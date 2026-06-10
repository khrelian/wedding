<script setup>
import { computed } from 'vue';
import { useStarField } from '@/composables/useStarField';

const { stars, constellations, parallaxOffset } = useStarField(140);

const parallaxStyle = computed(() => ({
    transform: `translateY(${parallaxOffset.value * -0.5}px)`,
}));
</script>

<template>
    <div class="star-field" aria-hidden="true">
        <div class="absolute inset-0 bg-gradient-to-b from-midnight via-celestial/80 to-midnight" />
        <div class="absolute inset-0 opacity-40" :style="parallaxStyle">
            <div
                v-for="star in stars"
                :key="star.id"
                class="star-dot"
                :style="{
                    left: star.left + '%',
                    top: star.top + '%',
                    width: star.size + 'px',
                    height: star.size + 'px',
                    opacity: star.opacity,
                    animationDelay: star.delay + 's',
                    animationDuration: star.duration + 's',
                }"
            />
            <svg class="absolute inset-0 h-full w-full">
                <line
                    v-for="(line, index) in constellations"
                    :key="'line-' + index"
                    :x1="line.x1 + '%'"
                    :y1="line.y1 + '%'"
                    :x2="line.x2 + '%'"
                    :y2="line.y2 + '%'"
                    class="constellation-line"
                />
            </svg>
        </div>
        <div class="shooting-star" style="top: 18%; left: 8%;" />
        <div class="shooting-star" />
        <div class="shooting-star" />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(26,31,75,0.35)_0%,transparent_70%)]" />
    </div>
</template>
