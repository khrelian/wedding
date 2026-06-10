<script setup>
import { computed } from 'vue';
import { useMosaicParallax } from '@/composables/useMosaicParallax';

const props = defineProps({
    images: {
        type: Array,
        default: () => [],
    },
});

const ROW_COUNT = 7;
const IMAGES_PER_ROW = 12;

const { scrollY, viewportHeight, reducedMotion } = useMosaicParallax();

const sourceImages = computed(() => props.images.filter((image) => image?.src));

const mosaicRows = computed(() => {
    if (!sourceImages.value.length) {
        return [];
    }

    const rows = [];

    for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
        const row = [];

        for (let cellIndex = 0; cellIndex < IMAGES_PER_ROW; cellIndex += 1) {
            const imageIndex = (rowIndex * 3 + cellIndex) % sourceImages.value.length;
            row.push(sourceImages.value[imageIndex]);
        }

        rows.push(row);
    }

    return rows;
});

const wrapStyle = computed(() => {
    const fadeStart = viewportHeight.value * 0.45;
    const fadeEnd = viewportHeight.value * 1.05;
    const fadeProgress = Math.min(1, Math.max(0, (scrollY.value - fadeStart) / (fadeEnd - fadeStart)));
    const opacity = 0.35 + fadeProgress * 0.65;

    if (reducedMotion.value) {
        return {
            opacity,
            transform: 'translate3d(-50%, -50%, 0) rotate(22.5deg) scale(2.35)',
        };
    }

    const driftY = scrollY.value * 0.14;

    return {
        opacity,
        transform: `translate3d(-50%, calc(-50% + ${driftY}px), 0) rotate(22.5deg) scale(2.35)`,
    };
});

const lineStyle = (rowIndex) => {
    if (reducedMotion.value) {
        return {};
    }

    const direction = rowIndex % 2 === 0 ? 1 : -1;
    const speed = 0.06 + (rowIndex % 4) * 0.025;
    const offset = (rowIndex - 4) * 18;
    const translateX = scrollY.value * speed * direction + offset;

    return {
        transform: `translate3d(${translateX}px, 0, 0)`,
    };
};
</script>

<template>
    <div
        v-if="mosaicRows.length"
        class="photo-mosaic-bg"
        aria-hidden="true"
    >
        <div
            class="photo-mosaic-wrap"
            :style="wrapStyle"
        >
            <div
                v-for="(row, rowIndex) in mosaicRows"
                :key="`row-${rowIndex}`"
                class="photo-mosaic-line"
                :style="lineStyle(rowIndex)"
            >
                <div
                    v-for="(image, cellIndex) in row"
                    :key="`${rowIndex}-${cellIndex}-${image.src}`"
                    class="photo-mosaic-cell"
                >
                    <img
                        :src="image.src"
                        :alt="''"
                        loading="lazy"
                        decoding="async"
                        class="photo-mosaic-tile"
                    >
                </div>
            </div>
        </div>

        <div class="photo-mosaic-overlay" />
        <div class="photo-mosaic-vignette" />
    </div>
</template>
