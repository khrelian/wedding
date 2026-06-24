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
const isLoadingFilters = ref(false);
const loadingStatus = ref('Preparing camera...');
const isCapturing = ref(false);
const isSwitchingCamera = ref(false);
const canSwitchCamera = ref(false);
const currentFacingMode = ref('user');
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

    if (!video || !canvas || video.readyState < 2) {
        animationFrame = requestAnimationFrame(drawFrame);
        return;
    }

    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);

    if (landmarker && video.currentTime !== lastVideoTime) {
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

    if (isLoadingFilters.value) {
        animationFrame = requestAnimationFrame(drawFrame);
        return;
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

const loadFilterAssets = async () => {
    isLoadingFilters.value = true;
    loadingStatus.value = 'Loading face filters...';

    const [
        ,
        landmarkerResult,
        classic,
        overlay,
        pavilion,
        botanical,
    ] = await Promise.all([
        preloadFaceStickerImages(props.faceFilters),
        getFaceLandmarker(),
        preloadWeddingFrameImages(props.weddingFrame),
        preloadWeddingFrameImages({
            ...props.weddingFrameOverlay,
            variant: 'overlay',
        }),
        preloadWeddingFrameImages({
            ...props.weddingFramePavilion,
            variant: 'pavilion',
        }),
        preloadWeddingFrameImages({
            ...props.weddingFrameBotanical,
            variant: 'botanical',
        }),
    ]);

    landmarker = landmarkerResult;
    classicFrameAssets = classic;
    overlayFrameAssets = overlay;
    pavilionFrameAssets = pavilion;
    botanicalFrameAssets = botanical;
    isLoadingFilters.value = false;
    loadingStatus.value = '';
};

const startCamera = async (preferredFacingMode = null, strict = false) => {
    const idealVideo = (facingMode) => ({
        video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 1280 },
        },
        audio: false,
    });

    const constraints = preferredFacingMode
        ? [
            idealVideo({ exact: preferredFacingMode }),
            idealVideo(preferredFacingMode),
            ...(strict ? [] : [{ video: true, audio: false }]),
        ]
        : [
            idealVideo('user'),
            idealVideo('environment'),
            { video: true, audio: false },
        ];

    let mediaStream = null;
    let resolvedFacingMode = preferredFacingMode ?? 'user';

    for (const constraint of constraints) {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraint);
            const facingMode = constraint.video?.facingMode;

            if (typeof facingMode === 'string') {
                resolvedFacingMode = facingMode;
            } else if (facingMode?.exact) {
                resolvedFacingMode = facingMode.exact;
            } else if (!preferredFacingMode) {
                resolvedFacingMode = constraint.video === true ? 'user' : resolvedFacingMode;
            }

            break;
        } catch {
            // Try the next camera configuration.
        }
    }

    if (!mediaStream) {
        throw new Error('Camera access was denied or unavailable.');
    }

    stream = mediaStream;
    currentFacingMode.value = resolvedFacingMode;
    mirrorPreview = resolvedFacingMode === 'user';

    const video = videoRef.value;
    video.srcObject = stream;
    video.playsInline = true;
    await video.play();

    const canvas = canvasRef.value;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
};

const stopStream = () => {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }

    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
};

const detectSwitchSupport = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
        canSwitchCamera.value = isMobileDevice();
        return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((device) => device.kind === 'videoinput');

    canSwitchCamera.value = videoInputs.length > 1 || isMobileDevice();
};

const isMobileDevice = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints > 0 && window.matchMedia('(max-width: 768px)').matches);
};

const switchCamera = async () => {
    if (isSwitchingCamera.value || isLoading.value || errorMessage.value) {
        return;
    }

    isSwitchingCamera.value = true;
    lastLandmarks.value = null;
    lastVideoTime = -1;
    resetRainingHearts();

    const nextFacingMode = currentFacingMode.value === 'user' ? 'environment' : 'user';

    try {
        stopStream();
        await startCamera(nextFacingMode, true);
    } catch {
        try {
            await startCamera(currentFacingMode.value, true);
        } catch {
            errorMessage.value = 'Unable to switch camera.';
        }
    } finally {
        isSwitchingCamera.value = false;
    }
};

const initialize = async () => {
    isLoading.value = true;
    isLoadingFilters.value = false;
    loadingStatus.value = 'Allow camera access when prompted';
    errorMessage.value = '';

    try {
        const cameraSupportMessage = getCameraSupportMessage();

        if (cameraSupportMessage) {
            throw new Error(cameraSupportMessage);
        }

        loadingStatus.value = 'Allow camera access when prompted';
        await startCamera();
        await detectSwitchSupport();

        isLoading.value = false;
        animationFrame = requestAnimationFrame(drawFrame);

        await loadFilterAssets();
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : 'Unable to start the camera.';
    } finally {
        isLoading.value = false;
        isLoadingFilters.value = false;
    }
};

const stopCamera = () => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    stopStream();
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
                <div class="face-camera-loading">
                    <div class="face-camera-spinner" aria-hidden="true" />
                    <p class="face-camera-loading-title">
                        Opening Camera
                    </p>
                    <p class="face-camera-loading-status">
                        {{ loadingStatus }}
                    </p>
                </div>
            </div>

            <div v-else-if="errorMessage" class="face-camera-overlay px-6 text-center">
                <p class="font-sans text-sm text-red-300">
                    {{ errorMessage }}
                </p>
            </div>

            <button
                v-if="!isLoading && !errorMessage && canSwitchCamera"
                type="button"
                class="face-camera-flip"
                :disabled="isSwitchingCamera"
                :aria-label="currentFacingMode === 'user' ? 'Switch to back camera' : 'Switch to front camera'"
                @click="switchCamera"
            >
                <svg
                    class="face-camera-flip-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    aria-hidden="true"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16 3h5v5M4 21l5-5M21 8a9 9 0 00-15.5-2.5M3 16a9 9 0 0015.5 2.5"
                    />
                </svg>
            </button>

            <button
                type="button"
                class="face-camera-close"
                @click="emit('close')"
            >
                Close
            </button>

            <p
                v-if="!isLoading && !errorMessage && isLoadingFilters"
                class="face-camera-filter-loading"
            >
                {{ loadingStatus }}
            </p>

            <p
                v-if="!isLoading && !errorMessage && selectedFilter()?.face_sticker && !isWeddingFrameSticker(selectedFilter()?.face_sticker) && !isLoadingFilters"
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
            :disabled="isLoading || Boolean(errorMessage) || isCapturing || isLoadingFilters"
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
    background: rgba(5, 6, 15, 0.92);
}

.face-camera-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.85rem;
    max-width: 16rem;
    padding: 0 1.5rem;
    text-align: center;
}

.face-camera-spinner {
    width: 2.25rem;
    height: 2.25rem;
    border: 2px solid rgba(255, 255, 255, 0.15);
    border-top-color: #d4af37;
    border-radius: 9999px;
    animation: face-camera-spin 0.8s linear infinite;
}

.face-camera-loading-title {
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #f8f5f0;
}

.face-camera-loading-status {
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.82rem;
    line-height: 1.5;
    color: rgba(248, 245, 240, 0.72);
}

.face-camera-filter-loading {
    position: absolute;
    left: 50%;
    bottom: 0.85rem;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(5, 6, 15, 0.78);
    padding: 0.45rem 0.75rem;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(248, 245, 240, 0.72);
}

@keyframes face-camera-spin {
    to {
        transform: rotate(360deg);
    }
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

.face-camera-flip {
    position: absolute;
    left: 0.75rem;
    top: 0.75rem;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 9999px;
    background: rgba(11, 16, 38, 0.8);
    color: #f8f5f0;
    transition: opacity 0.2s ease, background-color 0.2s ease;
}

.face-camera-flip:hover:not(:disabled) {
    background: rgba(11, 16, 38, 0.95);
}

.face-camera-flip:disabled {
    cursor: wait;
    opacity: 0.55;
}

.face-camera-flip-icon {
    width: 1.15rem;
    height: 1.15rem;
}

.face-camera-stage--fill .face-camera-flip {
    top: max(0.75rem, env(safe-area-inset-top));
    left: max(0.75rem, env(safe-area-inset-left));
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
