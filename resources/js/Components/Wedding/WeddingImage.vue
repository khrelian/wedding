<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    src: {
        type: String,
        default: null,
    },
    alt: {
        type: String,
        default: '',
    },
    imageClass: {
        type: String,
        default: 'h-full w-full object-cover',
    },
});

const hasError = ref(false);

watch(
    () => props.src,
    () => {
        hasError.value = false;
    },
);

const showImage = () => props.src && !hasError.value;
</script>

<template>
    <div class="relative h-full w-full overflow-hidden">
        <img
            v-if="showImage()"
            :src="src"
            :alt="alt"
            :class="imageClass"
            loading="lazy"
            @error="hasError = true"
        >
        <div
            v-if="!showImage()"
            class="absolute inset-0 bg-gradient-to-br from-celestial/60 to-midnight"
        >
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(212,175,55,0.12),transparent_60%)]" />
            <slot name="fallback" />
        </div>
        <div
            v-else
            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/50 via-transparent to-transparent"
        />
        <div
            v-if="showImage()"
            class="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        >
            <slot name="caption" />
        </div>
    </div>
</template>
