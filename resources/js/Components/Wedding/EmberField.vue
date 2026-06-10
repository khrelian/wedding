<script setup>
import { useEmbers } from '@/composables/useEmbers';

const { embers } = useEmbers(30);
</script>

<template>
    <div class="ember-field" aria-hidden="true">
        <div
            v-for="ember in embers"
            :key="ember.id"
            class="ember-container"
            :style="{
                '--ember-size': ember.size,
                '--ember-start-x': ember.startX,
                '--ember-end-x': ember.endX,
                '--ember-duration': ember.duration,
                '--ember-delay': ember.delay,
                '--ember-pulse-delay': ember.pulseDelay,
            }"
        >
            <div class="ember-glow" />
        </div>
    </div>
</template>
