<script setup>
import { computed } from 'vue';
import {
    getCrownVariantLabel,
    getGlassesVariantLabel,
    isCrownToggleable,
    isGlassesToggleable,
} from '@/composables/useFaceStickers';
import { getWeddingFrameVariantLabel } from '@/composables/useWeddingFrame';
import PhotoFaceCamera from '@/Components/Wedding/PhotoFaceCamera.vue';

const props = defineProps({
    fillViewport: {
        type: Boolean,
        default: false,
    },
    faceFilters: {
        type: Array,
        default: () => [],
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
    weddingFrameVariants: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['capture', 'close', 'select-filter', 'select-wedding-frame-variant']);

const selectedFilter = computed(() => {
    return props.faceFilters.find((filter) => filter.id === props.selectedFilterId)
        ?? props.faceFilters[0];
});
</script>

<template>
    <div
        class="face-camera-session"
        :class="{ 'face-camera-session--fill': fillViewport }"
    >
        <PhotoFaceCamera
            class="face-camera-session-preview"
            :fill-viewport="fillViewport"
            :face-filters="faceFilters"
            :selected-filter-id="selectedFilterId"
            :sticker-context="stickerContext"
            :wedding-frame="weddingFrame"
            :wedding-frame-overlay="weddingFrameOverlay"
            :wedding-frame-pavilion="weddingFramePavilion"
            :wedding-frame-elegant="weddingFrameElegant"
            :wedding-frame-botanical="weddingFrameBotanical"
            @capture="emit('capture', $event)"
            @close="emit('close')"
        />

        <div class="face-camera-session-controls">
            <p class="mb-3 font-sans text-xs uppercase tracking-[0.15em] text-ivory/60">
                Pick a Face Filter
            </p>
            <div class="flex gap-3 overflow-x-auto pb-1">
                <button
                    v-for="filter in faceFilters"
                    :key="filter.id"
                    type="button"
                    class="group shrink-0 text-left"
                    @click="emit('select-filter', filter.id)"
                >
                    <div
                        class="relative flex h-16 w-16 items-center justify-center overflow-hidden border transition-colors sm:h-20 sm:w-20"
                        :class="selectedFilterId === filter.id
                            ? 'border-gold-soft bg-gold-soft/10'
                            : 'border-white/15 bg-white/5 group-hover:border-white/40'"
                    >
                        <span
                            v-if="filter.id === 'none'"
                            class="font-sans text-[0.65rem] uppercase tracking-[0.12em] text-ivory/70"
                        >
                            None
                        </span>
                        <span
                            v-else
                            class="text-2xl sm:text-3xl"
                        >
                            {{ filter.emoji }}
                        </span>
                    </div>
                    <span
                        class="mt-2 block max-w-[4.5rem] truncate font-sans text-[0.625rem] uppercase tracking-[0.1em]"
                        :class="selectedFilterId === filter.id ? 'text-gold-soft' : 'text-ivory/50'"
                    >
                        {{ filter.label }}
                    </span>
                </button>
            </div>
            <p
                v-if="selectedFilter?.face_sticker === 'thought_bubble' && stickerContext.phrase"
                class="mt-3 font-sans text-sm text-ivory/55"
            >
                "{{ stickerContext.phrase }}" — tap again for a new one
            </p>
            <div
                v-else-if="selectedFilter?.face_sticker === 'wedding_frame'"
                class="mt-3 space-y-3"
            >
                <p class="font-sans text-sm text-ivory/55">
                    Frame style — tap 💐 again to cycle, or pick one:
                </p>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="variant in weddingFrameVariants"
                        :key="variant"
                        type="button"
                        class="border px-3 py-1.5 font-sans text-[0.65rem] uppercase tracking-[0.1em] transition-colors"
                        :class="(stickerContext.weddingFrameVariant ?? 'classic') === variant
                            ? 'border-gold-soft bg-gold-soft/15 text-gold-soft'
                            : 'border-white/15 text-ivory/55 hover:border-white/35 hover:text-ivory'"
                        @click="emit('select-wedding-frame-variant', variant)"
                    >
                        {{ getWeddingFrameVariantLabel(variant) }}
                    </button>
                </div>
            </div>
            <p
                v-else-if="selectedFilter?.face_sticker === 'glasses' && isGlassesToggleable(selectedFilter)"
                class="mt-3 font-sans text-sm text-ivory/55"
            >
                {{
                    getGlassesVariantLabel(
                        selectedFilter,
                        stickerContext.glassesVariantIndex ?? 0,
                    )
                }} — tap again for the next style
            </p>
            <p
                v-else-if="selectedFilter?.face_sticker === 'crown' && isCrownToggleable(selectedFilter)"
                class="mt-3 font-sans text-sm text-ivory/55"
            >
                {{
                    getCrownVariantLabel(
                        selectedFilter,
                        stickerContext.crownVariantIndex ?? 0,
                    )
                }} — tap again for the next style
            </p>
        </div>
    </div>
</template>

<style scoped>
.face-camera-session {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.face-camera-session--fill {
    height: 100%;
    min-height: 0;
    gap: 0;
}

.face-camera-session-preview {
    flex: 1;
    min-height: 0;
}

.face-camera-session--fill .face-camera-session-controls {
    flex-shrink: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(5, 6, 15, 0.98);
    padding: 0.75rem 1rem max(1rem, env(safe-area-inset-bottom));
}
</style>
