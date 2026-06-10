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
    <section id="gallery" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">Captured Light</p>
                <h2 class="wedding-heading">{{ wedding.gallery.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.gallery.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                <div
                    v-for="(item, index) in wedding.gallery.images"
                    :key="item.label + index"
                    class="scroll-reveal wedding-gallery-item group"
                    :class="[getAspect(item, index), item.featured || index === 0 ? 'sm:row-span-2' : '']"
                >
                    <WeddingImage :src="item.src" :alt="item.alt || item.label">
                        <template #fallback>
                            <div class="absolute inset-0 flex items-end p-6">
                                <p class="wedding-label !text-ivory/40">
                                    {{ item.label }}
                                </p>
                            </div>
                        </template>
                    </WeddingImage>
                    <div
                        v-if="item.src"
                        class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-midnight/70 to-transparent p-5 opacity-0 transition-opacity duration-luxury group-hover:opacity-100"
                    >
                        <p class="wedding-label !text-ivory/60">
                            {{ item.label }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="scroll-reveal wedding-callout mt-16">
                <p class="wedding-label mb-3">Guest Photos</p>
                <p class="wedding-body">{{ wedding.gallery.note }}</p>
                <a
                    :href="'mailto:' + wedding.gallery.upload_email + '?subject=Wedding%20Photos'"
                    class="wedding-button-secondary mt-8 inline-flex"
                >
                    Share Your Photos
                </a>
            </div>
        </div>
    </section>
</template>
