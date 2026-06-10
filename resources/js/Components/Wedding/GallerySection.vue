<script setup>
import WeddingImage from '@/Components/Wedding/WeddingImage.vue';

defineProps({
    wedding: Object,
});

const aspectClasses = {
    featured: 'aspect-[4/5]',
    default: 'aspect-square',
    wide: 'aspect-[4/3]',
    tall: 'aspect-[3/4]',
};

const getAspect = (item, index) => {
    if (item.featured || index === 0) {
        return aspectClasses.featured;
    }

    if (index === 2) {
        return aspectClasses.tall;
    }

    if (index === 3) {
        return aspectClasses.wide;
    }

    return aspectClasses.default;
};
</script>

<template>
    <section id="gallery" class="wedding-section bg-celestial/20">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label mb-4">Captured Light</p>
                <h2 class="wedding-heading">{{ wedding.gallery.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.gallery.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="(item, index) in wedding.gallery.images"
                    :key="item.label + index"
                    class="scroll-reveal group relative overflow-hidden border border-white/10 bg-midnight/50"
                    :class="[getAspect(item, index), item.featured || index === 0 ? 'sm:row-span-2' : '']"
                >
                    <WeddingImage :src="item.src" :alt="item.alt || item.label">
                        <template #fallback>
                            <div class="absolute inset-0 flex items-end p-6">
                                <p class="font-sans text-xs uppercase tracking-[0.2em] text-ivory/40">
                                    {{ item.label }}
                                </p>
                            </div>
                        </template>
                    </WeddingImage>
                    <div
                        v-if="item.src"
                        class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/80 to-transparent p-6 opacity-0 transition-opacity duration-luxury group-hover:opacity-100"
                    >
                        <p class="font-sans text-xs uppercase tracking-[0.2em] text-ivory/70">
                            {{ item.label }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="scroll-reveal mx-auto mt-16 max-w-2xl border border-white/10 p-8 text-center">
                <p class="wedding-label mb-3">Guest Photos</p>
                <p class="wedding-body">{{ wedding.gallery.note }}</p>
                <a
                    :href="'mailto:' + wedding.gallery.upload_email + '?subject=Wedding%20Photos'"
                    class="wedding-button-primary mt-8"
                >
                    Share Your Photos
                </a>
            </div>
        </div>
    </section>
</template>
