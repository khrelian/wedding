<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { detectFaceLandmarks, getFaceLandmarker } from '@/composables/useFaceLandmarker';
import { createFaceFilterContext, drawFaceSticker, preloadFaceStickerImages } from '@/composables/useFaceStickers';
import { resetRainingHearts } from '@/composables/useRainingHearts';
import { getCameraSupportMessage } from '@/composables/useCameraSupport';
import { drawWeddingFrameSync, isWeddingFrameSticker, preloadWeddingFrameImages, resolveActiveWeddingFrameConfig } from '@/composables/useWeddingFrame';

const props = defineProps({
    faceFilters: {
        type: Array,
        default: () => [{ id: 'none', label: 'No Filter' }],
    },
    selectedFilterId: {
        type: String,
        default: 'none',
    },
    stickerContext: {
        type: Object,
        default: () => ({}),
    },
    weddingFrame: {
        type: Object,
        default: () => ({}),
    },
    weddingFrameOverlay: {
        type: Object,
        default: () => ({}),
    },
    weddingFramePavilion: {
        type: Object,
        default: () => ({}),
    },
    weddingFrameElegant: {
        type: Object,
        default: () => ({}),
    },
    weddingFrameBotanical: {
        type: Object,
        default: () => ({}),
    },
    fillViewport: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['capture', 'close']);

const videoRef = ref(null);
const canvasRef = ref(null);
const isLoading = ref(true);
const isCapturing = ref(false);
const errorMessage = ref('');
const faceDetected = ref(false);
const lastLandmarks = ref(null);

let landmarker = null;
let stream = null;
let animationFrame = null;
let lastVideoTime = -1;
let mirrorPreview = true;
let classicFrameAssets = null;
let overlayFrameAssets = null;
let pavilionFrameAssets = null;
let botanicalFrameAssets = null;

const selectedFilter = () => {
    return props.faceFilters.find((filter) => filter.id === props.selectedFilterId)
        ?? props.faceFilters[0];
};

const activeWeddingFrameConfig = () => {
    const filter = selectedFilter();

    if (!isWeddingFrameSticker(filter?.face_sticker)) {
        return null;
    }

    return resolveActiveWeddingFrameConfig(filter.face_sticker, {
        weddingFrame: props.weddingFrame,
        weddingFrameOverlay: props.weddingFrameOverlay,
        weddingFramePavilion: props.weddingFramePavilion,
        weddingFrameElegant: props.weddingFrameElegant,
        weddingFrameBotanical: props.weddingFrameBotanical,
    }, props.stickerContext);
};

const drawFrame = () => {
    const video = videoRef.value;
    const canvas = canvasRef.value;

    if (!video || !canvas || !landmarker) {
        animationFrame = requestAnimationFrame(drawFrame);
        return;
    }

    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);

    if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        lastLandmarks.value = detectFaceLandmarks(landmarker, video, performance.now());
        faceDetected.value = Boolean(lastLandmarks.value);
    }

    if (mirrorPreview) {
        context.save();
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);
        context.restore();
    } else {
        context.drawImage(video, 0, 0, width, height);
    }

    const filter = selectedFilter();
    const weddingFrameConfig = activeWeddingFrameConfig();
    const isWeddingFrame = weddingFrameConfig && isWeddingFrameSticker(filter?.face_sticker);

    if (isWeddingFrame) {
        const assets = weddingFrameConfig.variant === 'overlay'
            ? overlayFrameAssets
            : weddingFrameConfig.variant === 'pavilion'
                ? pavilionFrameAssets
                : weddingFrameConfig.variant === 'botanical'
                    ? botanicalFrameAssets
                    : weddingFrameConfig.variant === 'elegant'
                        ? {}
                        : classicFrameAssets;

        drawWeddingFrameSync(context, width, height, weddingFrameConfig, assets ?? {});
    } else if (filter?.face_sticker) {
        const canDraw = filter.face_sticker === 'raining_hearts' || lastLandmarks.value;

        if (canDraw) {
            drawFaceSticker(
                context,
                lastLandmarks.value ?? [],
                filter,
                props.stickerContext,
                width,
                height,
                {
                    mirrored: mirrorPreview,
                    timestamp: performance.now(),
                },
            );
        }
    }

    animationFrame = requestAnimationFrame(drawFrame);
};

const startCamera = async () => {
    const constraints = [
        { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false },
        { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } }, audio: false },
        { video: true, audio: false },
    ];

    let mediaStream = null;

    for (const constraint of constraints) {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
            mirrorPreview = Boolean(constraint.video?.facingMode === 'user');
            break;
        } catch {
            // Try the next camera configuration.
        }
    }

    if (!mediaStream) {
        throw new Error('Camera access was denied or unavailable.');
    }

    stream = mediaStream;

    const video = videoRef.value;
    video.srcObject = stream;
    video.playsInline = true;
    await video.play();

    const canvas = canvasRef.value;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
};

const initialize = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        const cameraSupportMessage = getCameraSupportMessage();

        if (cameraSupportMessage) {
            throw new Error(cameraSupportMessage);
        }

        await preloadFaceStickerImages(props.faceFilters);

        landmarker = await getFaceLandmarker();

        classicFrameAssets = await preloadWeddingFrameImages(props.weddingFrame);
        overlayFrameAssets = await preloadWeddingFrameImages({
            ...props.weddingFrameOverlay,
            variant: 'overlay',
        });
        pavilionFrameAssets = await preloadWeddingFrameImages({
            ...props.weddingFramePavilion,
            variant: 'pavilion',
        });
        botanicalFrameAssets = await preloadWeddingFrameImages({
            ...props.weddingFrameBotanical,
            variant: 'botanical',
        });

        await startCamera();
        animationFrame = requestAnimationFrame(drawFrame);
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : 'Unable to start the camera.';
    } finally {
        isLoading.value = false;
    }
};

const stopCamera = () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }

    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
};

const capturePhoto = async () => {
    const canvas = canvasRef.value;

    if (!canvas || isCapturing.value) {
        return;
    }

    isCapturing.value = true;

    try {
        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                (result) => {
                    if (result) {
                        resolve(result);
                        return;
                    }

                    reject(new Error('Unable to capture photo.'));
                },
                'image/jpeg',
                0.92,
            );
        });

        const file = new File([blob], `guest-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
        emit('capture', file);
    } finally {
        isCapturing.value = false;
    }
};

watch(() => props.selectedFilterId, () => {
    lastLandmarks.value = null;
    resetRainingHearts();
});

onMounted(() => {
    initialize();
});

onBeforeUnmount(() => {
    stopCamera();
    resetRainingHearts();
});
</script>

<template>
    <div class="face-camera" :class="{ 'face-camera--fill': fillViewport }">
        <div class="face-camera-stage" :class="{ 'face-camera-stage--fill': fillViewport }">
            <video
                ref="videoRef"
                class="sr-only"
                autoplay
                muted
                playsinline
            />

            <canvas
                ref="canvasRef"
                class="face-camera-canvas"
            />

            <div v-if="isLoading" class="face-camera-overlay">
                <p class="font-sans text-sm uppercase tracking-[0.15em] text-ivory/70">
                    Loading face filters...
                </p>
            </div>

            <div v-else-if="errorMessage" class="face-camera-overlay px-6 text-center">
                <p class="font-sans text-sm text-red-300">
                    {{ errorMessage }}
                </p>
            </div>

            <button
                type="button"
                class="face-camera-close"
                @click="emit('close')"
            >
                Close
            </button>

            <p
                v-if="!isLoading && !errorMessage && selectedFilter()?.face_sticker && !isWeddingFrameSticker(selectedFilter()?.face_sticker)"
                class="face-camera-hint"
                :class="selectedFilter()?.face_sticker === 'raining_hearts' || faceDetected ? 'text-green-300/80' : 'text-ivory/45'"
            >
                {{
                    selectedFilter()?.face_sticker === 'raining_hearts'
                        ? 'Raining hearts'
                        : faceDetected
                            ? 'Face detected'
                            : 'Center your face in the frame'
                }}
            </p>
        </div>

        <button
            type="button"
            class="face-camera-shutter"
            :disabled="isLoading || Boolean(errorMessage) || isCapturing"
            @click="capturePhoto"
        >
            {{ isCapturing ? 'Saving...' : 'Capture Photo' }}
        </button>
    </div>
</template>

<style scoped>
.face-camera {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.face-camera--fill {
    flex: 1;
    min-height: 0;
    gap: 0.75rem;
}

.face-camera--fill .face-camera-shutter {
    flex-shrink: 0;
    margin: 0 1rem;
}

.face-camera-stage {
    position: relative;
    overflow: hidden;
    background: #05060f;
    aspect-ratio: 1 / 1;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.face-camera-stage--fill {
    flex: 1;
    aspect-ratio: auto;
    min-height: 0;
    border: none;
}

.face-camera-canvas {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.face-camera-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(5, 6, 15, 0.82);
}

.face-camera-close {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    z-index: 2;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(11, 16, 38, 0.8);
    padding: 0.5rem 0.85rem;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f8f5f0;
}

.face-camera-stage--fill .face-camera-close {
    top: max(0.75rem, env(safe-area-inset-top));
    right: max(0.75rem, env(safe-area-inset-right));
}

.face-camera-hint {
    position: absolute;
    left: 50%;
    bottom: 0.85rem;
    transform: translateX(-50%);
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.face-camera-shutter {
    width: 100%;
    border: 1px solid rgba(212, 175, 55, 0.55);
    background: rgba(212, 175, 55, 0.12);
    padding: 0.85rem 1rem;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #d4af37;
    transition: background-color 0.2s ease, opacity 0.2s ease;
}

.face-camera-shutter:hover:not(:disabled) {
    background: rgba(212, 175, 55, 0.22);
}

.face-camera-shutter:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
