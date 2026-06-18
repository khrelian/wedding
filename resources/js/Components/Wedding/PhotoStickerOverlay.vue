<script setup>
import { computed } from 'vue';
import { buildStickerPlan } from '@/composables/usePhotoStickers';
import { isWeddingFrameSticker, resolveActiveWeddingFrameConfig } from '@/composables/useWeddingFrame';
import { DEFAULT_THOUGHT_BUBBLE_IMAGE } from '@/composables/useThoughtBubble';
import WeddingFrameOverlay from '@/Components/Wedding/WeddingFrameOverlay.vue';

const props = defineProps({
    filter: {
        type: Object,
        default: null,
    },
    weddingContext: {
        type: Object,
        required: true,
    },
    stickerContext: {
        type: Object,
        default: () => ({}),
    },
});

const stickers = computed(() => {
    if (!props.filter?.sticker) {
        return [];
    }

    return buildStickerPlan(props.filter, props.weddingContext, props.stickerContext, 1000, 1000);
});

const isWeddingFrame = computed(() => isWeddingFrameSticker(props.filter?.sticker));

const activeWeddingFrame = computed(() => {
    if (!props.filter?.sticker) {
        return {};
    }

    return resolveActiveWeddingFrameConfig(
        props.filter.sticker,
        props.weddingContext,
        props.stickerContext,
    ) ?? props.weddingContext.weddingFrame ?? {};
});

const thoughtBubbleImage = computed(() => props.filter?.image ?? DEFAULT_THOUGHT_BUBBLE_IMAGE);
</script>

<template>
    <div
        v-if="isWeddingFrame"
        class="pointer-events-none absolute inset-0 z-20"
    >
        <WeddingFrameOverlay
            :wedding-frame="activeWeddingFrame"
        />
    </div>

    <div v-else class="pointer-events-none absolute inset-0 z-20">
        <template v-for="(sticker, index) in stickers" :key="`${sticker.type}-${index}`">
            <div
                v-if="sticker.type === 'couple_names'"
                class="sticker sticker--names"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    fontSize: `${Math.max(1.1, 2.2 * sticker.scale)}rem`,
                }"
            >
                {{ sticker.text }}
            </div>

            <div
                v-else-if="sticker.type === 'thought_bubble'"
                class="sticker sticker--thought"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    width: `${Math.max(28, 42 * sticker.scale)}%`,
                    transform: 'translate(-56%, -28%)',
                }"
            >
                <img
                    :src="thoughtBubbleImage"
                    alt=""
                    class="sticker-thought-bubble-img"
                >
                <p class="sticker-thought-text">
                    {{ sticker.text }}
                </p>
            </div>

            <div
                v-else-if="sticker.type === 'speech_bubble'"
                class="sticker sticker--speech"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    transform: `translate(-50%, -50%) scale(${Math.max(0.8, sticker.scale)})`,
                }"
            >
                {{ sticker.text }}
            </div>

            <div
                v-else-if="sticker.type === 'just_married'"
                class="sticker sticker--married"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    transform: `translate(-50%, -50%) scale(${Math.max(0.85, sticker.scale)})`,
                }"
            >
                {{ sticker.text }}
            </div>

            <div
                v-else-if="sticker.type === 'tagline'"
                class="sticker sticker--tagline"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    transform: `translate(-50%, -50%) scale(${Math.max(0.85, sticker.scale)})`,
                }"
            >
                {{ sticker.text }}
            </div>

            <div
                v-else-if="sticker.type === 'heart'"
                class="sticker sticker--heart"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${sticker.rotation ?? 0}rad) scale(${sticker.scale})`,
                }"
            >
                ♥
            </div>

            <div
                v-else-if="sticker.type === 'raining_hearts'"
                class="sticker-rain"
            >
                <span
                    v-for="drop in 18"
                    :key="drop"
                    class="sticker-rain-heart"
                    :class="`sticker-rain-heart--${['sm', 'md', 'lg', 'xl'][(drop * 37) % 4]}`"
                    :style="{
                        left: `${((drop * 73) % 97)}%`,
                        animationDelay: `${(drop % 7) * 0.35}s`,
                        animationDuration: `${2.6 + (drop % 5) * 0.5 + ((drop * 37) % 4) * 0.2}s`,
                        opacity: 0.45 + (drop % 4) * 0.12,
                    }"
                >
                    ♥
                </span>
            </div>

            <div
                v-else-if="sticker.type === 'star'"
                class="sticker sticker--star"
                :style="{
                    left: `${sticker.x * 100}%`,
                    top: `${sticker.y * 100}%`,
                    transform: `translate(-50%, -50%) scale(${sticker.scale})`,
                }"
            >
                ★
            </div>
        </template>
    </div>
</template>

<style scoped>
.sticker {
    position: absolute;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 1.2;
}

.sticker--names {
    padding: 0.45rem 1.1rem;
    border-radius: 999px;
    border: 1.5px solid rgba(212, 175, 55, 0.85);
    background: rgba(11, 16, 38, 0.72);
    color: #d4af37;
    font-family: 'Allura', cursive;
    white-space: nowrap;
    text-shadow: 0 1px 8px rgba(0, 0, 0, 0.35);
}

.sticker--thought {
    pointer-events: none;
}

.sticker-thought-bubble-img {
    display: block;
    width: 100%;
    height: auto;
}

.sticker-thought-text {
    position: absolute;
    left: 52%;
    top: 34%;
    width: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    color: #1a1f4b;
    font-family: Inter, system-ui, sans-serif;
    font-size: clamp(0.55rem, 2.2vw, 0.72rem);
    font-weight: 700;
    line-height: 1.15;
    text-align: center;
}

.sticker--speech {
    padding: 0.55rem 0.9rem;
    border: 2px solid #1a1f4b;
    border-radius: 1rem;
    background: #fff8e7;
    color: #1a1f4b;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.82rem;
    font-weight: 700;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.16);
}

.sticker--speech::after {
    content: '';
    position: absolute;
    left: 28%;
    bottom: -0.55rem;
    width: 0;
    height: 0;
    border-left: 0.45rem solid transparent;
    border-right: 0.45rem solid transparent;
    border-top: 0.7rem solid #fff8e7;
    filter: drop-shadow(0 2px 0 #1a1f4b);
}

.sticker--married {
    padding: 0.45rem 1.2rem;
    background: #d4af37;
    color: #0b1026;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    clip-path: polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.sticker--tagline {
    color: #fff;
    font-family: 'Allura', cursive;
    font-size: 1.35rem;
    text-shadow:
        0 0 10px rgba(11, 16, 38, 0.9),
        0 2px 12px rgba(0, 0, 0, 0.45);
    max-width: 70%;
}

.sticker--heart {
    color: #e85d75;
    font-size: 2rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.sticker--star {
    color: #d4af37;
    font-size: 1.5rem;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.sticker-rain {
    position: absolute;
    inset: 0;
    overflow: hidden;
}

.sticker-rain-heart {
    position: absolute;
    top: -12%;
    color: #e85d75;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    animation: sticker-rain-fall linear infinite;
}

.sticker-rain-heart--sm {
    font-size: clamp(1rem, 3.2vw, 1.35rem);
}

.sticker-rain-heart--md {
    font-size: clamp(1.35rem, 4.4vw, 1.9rem);
}

.sticker-rain-heart--lg {
    font-size: clamp(1.85rem, 6vw, 2.75rem);
}

.sticker-rain-heart--xl {
    font-size: clamp(2.4rem, 8vw, 3.6rem);
}

@keyframes sticker-rain-fall {
    0% {
        transform: translateY(0) rotate(0deg);
    }

    100% {
        transform: translateY(125vh) rotate(360deg);
    }
}
</style>
