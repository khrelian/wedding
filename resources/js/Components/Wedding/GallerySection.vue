<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
    wedding: Object,
    invitee: {
        type: Object,
        default: null,
    },
});

const activeImage = ref(null);

const collageLayouts = [
    { column: '1 / 5', row: '1 / 5' },
    { column: '5 / 9', row: '1 / 3' },
    { column: '9 / 13', row: '1 / 4' },
    { column: '2 / 6', row: '4 / 7' },
    { column: '6 / 10', row: '3 / 6' },
    { column: '10 / 13', row: '4 / 7' },
    { column: '1 / 4', row: '6 / 9' },
    { column: '4 / 8', row: '7 / 10' },
    { column: '8 / 13', row: '7 / 10' },
    { column: '3 / 7', row: '9 / 12' },
    { column: '7 / 11', row: '10 / 13' },
    { column: '1 / 5', row: '10 / 13' },
];

const collageItems = computed(() => {
    const images = props.wedding?.gallery?.images ?? [];

    return images.map((image, index) => ({
        ...image,
        index,
        layout: collageLayouts[index % collageLayouts.length],
        accent: index % 3 === 0,
    }));
});

const ceremonyDate = computed(() => {
    const ceremony = props.wedding?.date?.ceremony;

    if (!ceremony) {
        return {
            day: '17',
            month: 'JULY',
            year: '2026',
            weekday: 'FRIDAY',
        };
    }

    const date = new Date(ceremony.replace(' ', 'T') + '+08:00');

    return {
        day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'Asia/Manila' }),
        month: date.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Manila' }).toUpperCase(),
        year: date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'Asia/Manila' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }).toUpperCase(),
    };
});

const backgroundLines = computed(() => {
    const tagline = props.wedding?.tagline || 'Written In The Stars';

    return tagline.split(' ').reduce((lines, word, index, words) => {
        if (index % 2 === 0) {
            lines.push(words.slice(index, index + 2).join(' '));
        }

        return lines;
    }, []);
});

const openLightbox = (image) => {
    if (!image?.src) {
        return;
    }

    activeImage.value = image;
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
    activeImage.value = null;
    document.body.style.overflow = '';
};

const onKeydown = (event) => {
    if (event.key === 'Escape') {
        closeLightbox();
    }
};

watch(activeImage, (image) => {
    if (image) {
        window.addEventListener('keydown', onKeydown);
    } else {
        window.removeEventListener('keydown', onKeydown);
    }
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown);
    document.body.style.overflow = '';
});
</script>

<template>
    <section id="gallery" class="wedding-section gallery-collage-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">Captured Light</p>
                <h2 class="wedding-heading">{{ wedding.gallery.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.gallery.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="gallery-collage-stage scroll-reveal mt-12">
                <div class="gallery-collage-watermark" aria-hidden="true">
                    <p
                        v-for="(line, index) in backgroundLines"
                        :key="line"
                        class="gallery-collage-watermark-line"
                        :class="`gallery-collage-watermark-line-${index + 1}`"
                    >
                        {{ line }}
                    </p>
                </div>

                <div class="gallery-collage-date" aria-hidden="true">
                    <p class="gallery-collage-date-day">{{ ceremonyDate.day }}</p>
                    <p class="gallery-collage-date-month">{{ ceremonyDate.month }}</p>
                    <p class="gallery-collage-date-year">{{ ceremonyDate.year }}</p>
                    <p class="gallery-collage-date-weekday">{{ ceremonyDate.weekday }}</p>
                </div>

                <p class="gallery-collage-name gallery-collage-name-left" aria-hidden="true">
                    {{ wedding.couple.partner1.name }}
                </p>
                <p class="gallery-collage-name gallery-collage-name-right" aria-hidden="true">
                    {{ wedding.couple.partner2.name }}
                </p>

                <span class="gallery-collage-mark gallery-collage-mark-top" aria-hidden="true" />
                <span class="gallery-collage-mark gallery-collage-mark-bottom" aria-hidden="true" />

                <div class="gallery-collage-grid">
                    <button
                        v-for="item in collageItems"
                        :key="`${item.label}-${item.index}`"
                        type="button"
                        class="gallery-collage-item group"
                        :class="{ 'gallery-collage-item-accent': item.accent }"
                        :style="{
                            gridColumn: item.layout.column,
                            gridRow: item.layout.row,
                        }"
                        :aria-label="`View ${item.alt || item.label}`"
                        @click="openLightbox(item)"
                    >
                        <img
                            v-if="item.src"
                            :src="item.src"
                            :alt="item.alt || item.label"
                            class="gallery-collage-image"
                            loading="lazy"
                            decoding="async"
                        >
                        <div
                            v-else
                            class="gallery-collage-image gallery-collage-placeholder"
                        >
                            <p class="wedding-label !text-ivory/40">{{ item.label }}</p>
                        </div>
                        <span class="gallery-collage-item-label">{{ item.label }}</span>
                    </button>
                </div>
            </div>

            <div
                v-if="wedding.features?.guest_photos"
                class="scroll-reveal wedding-callout mt-16"
            >
                <p class="wedding-label mb-3">Guest Photos</p>
                <p class="wedding-body">{{ wedding.gallery.note }}</p>
                <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <a
                        :href="invitee?.photos_url || route('photos.share')"
                        class="wedding-button-primary inline-flex"
                    >
                        Share a Photo
                    </a>
                    <a
                        v-if="wedding.features?.slideshow"
                        :href="route('photos.slideshow')"
                        class="wedding-button-secondary inline-flex"
                        target="_blank"
                    >
                        View Live Slideshow
                    </a>
                </div>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="gallery-lightbox">
                <div
                    v-if="activeImage"
                    class="gallery-lightbox"
                    role="dialog"
                    aria-modal="true"
                    :aria-label="activeImage.alt || activeImage.label"
                    @click.self="closeLightbox"
                >
                    <button
                        type="button"
                        class="gallery-lightbox-close"
                        aria-label="Close gallery"
                        @click="closeLightbox"
                    >
                        Close
                    </button>
                    <img
                        :src="activeImage.src"
                        :alt="activeImage.alt || activeImage.label"
                        class="gallery-lightbox-image"
                    >
                    <p class="gallery-lightbox-caption">{{ activeImage.label }}</p>
                </div>
            </Transition>
        </Teleport>
    </section>
</template>
