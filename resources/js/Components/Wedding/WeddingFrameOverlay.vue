<script setup>
import { computed } from 'vue';
import { resolveWeddingFrameConfig } from '@/composables/useWeddingFrame';
import ElegantWeddingFrameSvg from '@/Components/Wedding/ElegantWeddingFrameSvg.vue';

const props = defineProps({
    weddingFrame: {
        type: Object,
        default: () => ({}),
    },
});

const frame = computed(() => resolveWeddingFrameConfig(props.weddingFrame));
const isBotanical = computed(() => frame.value.variant === 'botanical');
const isOverlay = computed(() => frame.value.variant === 'overlay' || frame.value.variant === 'pavilion');
const isElegant = computed(() => frame.value.variant === 'elegant');
const frameColor = computed(() => frame.value.border_color ?? frame.value.text_color ?? '#FFFFFF');
</script>

<template>
    <div class="wedding-frame pointer-events-none absolute inset-0 z-20">
        <template v-if="isOverlay">
            <img
                :src="frame.overlay_image"
                alt=""
                class="wedding-frame-overlay"
            >
        </template>

        <template v-else-if="isBotanical">
            <img
                :src="frame.floral_top_image"
                alt=""
                class="wedding-frame-floral wedding-frame-floral--top"
            >
            <img
                :src="frame.floral_bottom_image"
                alt=""
                class="wedding-frame-floral wedding-frame-floral--bottom"
            >

            <div
                class="wedding-frame-text wedding-frame-text--botanical"
                :style="{ color: frame.text_color }"
            >
                <p class="wedding-frame-title wedding-frame-title--botanical">{{ frame.title }}</p>
                <p class="wedding-frame-name wedding-frame-name--botanical">{{ frame.name }}</p>
                <p class="wedding-frame-date wedding-frame-date--botanical">{{ frame.date }}</p>
            </div>
        </template>

        <template v-else-if="isElegant">
            <ElegantWeddingFrameSvg :color="frameColor" />

            <div
                class="wedding-frame-text wedding-frame-text--elegant"
                :style="{ color: frame.text_color ?? frameColor }"
            >
                <p class="wedding-frame-names">{{ frame.names }}</p>
                <div class="wedding-frame-divider">
                    <span class="wedding-frame-divider-line" />
                    <span class="wedding-frame-divider-heart">♥</span>
                    <span class="wedding-frame-divider-line" />
                </div>
                <p class="wedding-frame-date wedding-frame-date--elegant">{{ frame.date }}</p>
            </div>
        </template>

        <template v-else>
            <div class="wedding-frame-gradient" />

            <img
                :src="frame.floral_image"
                alt=""
                class="wedding-frame-floral wedding-frame-floral--bottom"
            >

            <div class="wedding-frame-text">
                <p class="wedding-frame-title">{{ frame.title }}</p>
                <p class="wedding-frame-name">{{ frame.name }}</p>
                <p class="wedding-frame-date">{{ frame.date }}</p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.wedding-frame {
    overflow: hidden;
}

.wedding-frame-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
}

.wedding-frame-gradient {
    position: absolute;
    inset: 45% 0 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.12) 45%, rgba(0, 0, 0, 0.35) 100%);
}

.wedding-frame-floral {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
    pointer-events: none;
}

.wedding-frame-floral--top {
    top: 0;
    max-height: 28%;
    object-position: top center;
}

.wedding-frame-floral--bottom {
    bottom: 0;
    max-height: 42%;
    object-position: bottom center;
}

.wedding-frame-text {
    position: absolute;
    left: 50%;
    bottom: 22%;
    transform: translateX(-50%);
    width: 90%;
    text-align: center;
    color: #fff;
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}

.wedding-frame-text--botanical {
    bottom: 12%;
    text-shadow: none;
}

.wedding-frame-text--elegant {
    bottom: 14%;
    width: 88%;
    color: #fff;
    text-shadow:
        0 0 10px rgba(0, 0, 0, 0.95),
        0 2px 6px rgba(0, 0, 0, 0.85),
        0 0 2px rgba(0, 0, 0, 1);
}

.wedding-frame-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(0.85rem, 3.8vw, 1.35rem);
    letter-spacing: 0.06em;
    line-height: 1.2;
}

.wedding-frame-title--botanical {
    font-size: clamp(0.75rem, 3.2vw, 1.05rem);
    letter-spacing: 0.1em;
}

.wedding-frame-name {
    margin-top: 0.15rem;
    font-family: 'Allura', cursive;
    font-size: clamp(2.4rem, 11.5vw, 4.5rem);
    line-height: 0.95;
}

.wedding-frame-name--botanical {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.5rem, 8vw, 2.75rem);
    line-height: 1.05;
    letter-spacing: 0.03em;
}

.wedding-frame-names {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(0.8rem, 4.2vw, 1.45rem);
    font-weight: 400;
    letter-spacing: 0.08em;
    line-height: 1.2;
    text-transform: uppercase;
}

.wedding-frame-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin: 0.45rem auto 0.35rem;
    width: min(52%, 16rem);
}

.wedding-frame-divider-line {
    flex: 1;
    height: 2px;
    background: currentColor;
    opacity: 0.95;
}

.wedding-frame-divider-heart {
    flex-shrink: 0;
    font-size: clamp(0.45rem, 2.2vw, 0.7rem);
    line-height: 1;
}

.wedding-frame-date {
    margin-top: 0.55rem;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(0.7rem, 2.8vw, 1rem);
    letter-spacing: 0.14em;
}

.wedding-frame-date--botanical {
    margin-top: 0.35rem;
    font-size: clamp(0.65rem, 2.5vw, 0.9rem);
    letter-spacing: 0.08em;
}

.wedding-frame-date--elegant {
    margin-top: 0;
    font-size: clamp(0.62rem, 2.8vw, 0.95rem);
    letter-spacing: 0.12em;
}
</style>
