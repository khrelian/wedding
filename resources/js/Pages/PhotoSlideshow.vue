<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import StarField from '@/Components/Wedding/StarField.vue';

const props = defineProps({
    photos: {
        type: Array,
        default: () => [],
    },
    upload_url: {
        type: String,
        default: '',
    },
});

const page = usePage();
const wedding = computed(() => page.props.wedding);
const guestPhotos = computed(() => wedding.value.guest_photos ?? {});

const slides = ref([...props.photos]);
const currentIndex = ref(0);
const isPaused = ref(false);

const intervalSeconds = computed(() => guestPhotos.value.slideshow_interval_seconds ?? 8);
const refreshSeconds = computed(() => guestPhotos.value.slideshow_refresh_seconds ?? 20);
const maxCollageTiles = 11;

const seededRandom = (seed) => {
    let value = Math.abs(Math.floor(Number(seed))) % 2147483646;

    if (value <= 0) {
        value = 1;
    }

    return () => {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
    };
};

const createSideLayout = (photoId) => {
    const rand = seededRandom(Number(photoId) * 7919 + 104729);
    let left = 0;
    let top = 0;
    let attempts = 0;

    do {
        left = 2 + rand() * 90;
        top = 3 + rand() * 90;
        attempts++;
    } while (
        attempts < 30
        && left > 30
        && left < 70
        && top > 28
        && top < 62
    );

    return {
        left: Math.round(left * 10) / 10,
        top: Math.round(top * 10) / 10,
        width: Math.round((8 + rand() * 6) * 10) / 10,
        rotate: Math.round((-16 + rand() * 32) * 10) / 10,
        delay: Math.round(rand() * 6 * 10) / 10,
    };
};

const getHomeLayout = (photoId) => createSideLayout(photoId);

const featuredTileWidth = 'clamp(16rem, 52vw, 36rem)';

const hasPhotos = computed(() => slides.value.length > 0);
const currentPhoto = computed(() => slides.value[currentIndex.value] ?? null);

const collageItems = computed(() => {
    const photos = slides.value;

    if (!photos.length) {
        return [];
    }

    const featured = currentIndex.value;
    const items = [];

    if (photos.length === 1) {
        return [{
            ...photos[featured],
            isFeatured: true,
            sideIndex: -1,
        }];
    }

    let sideIndex = 0;

    for (let offset = 1; offset < photos.length && sideIndex < maxCollageTiles; offset++) {
        const prev = (featured - offset + photos.length) % photos.length;
        const next = (featured + offset) % photos.length;

        if (prev !== featured && sideIndex < maxCollageTiles) {
            items.push({
                ...photos[prev],
                isFeatured: false,
                sideIndex,
            });
            sideIndex++;
        }

        if (next !== featured && next !== prev && sideIndex < maxCollageTiles) {
            items.push({
                ...photos[next],
                isFeatured: false,
                sideIndex,
            });
            sideIndex++;
        }
    }

    return items;
});

const featuredItem = computed(() => slides.value[currentIndex.value] ?? null);

const sideItems = computed(() => collageItems.value.filter((item) => !item.isFeatured));

const tileStyle = (item) => {
    const home = getHomeLayout(item.id);

    return {
        '--tile-left': `${home.left}%`,
        '--tile-top': `${home.top}%`,
        '--tile-width': `${home.width}%`,
        '--tile-rotate': `${home.rotate}deg`,
        '--tile-scale': 1,
        '--tile-delay': `${home.delay}s`,
        zIndex: 5 + item.sideIndex,
    };
};

const featuredTileStyle = {
    '--tile-left': '50%',
    '--tile-top': '46%',
    '--tile-width': featuredTileWidth,
    '--tile-rotate': '0deg',
    '--tile-scale': 1,
    '--tile-delay': '0s',
};

let advanceTimer = null;
let refreshTimer = null;

const goTo = (index) => {
    if (!slides.value.length) {
        return;
    }

    currentIndex.value = (index + slides.value.length) % slides.value.length;
};

const next = () => {
    goTo(currentIndex.value + 1);
};

const previous = () => {
    goTo(currentIndex.value - 1);
};

const startAdvanceTimer = () => {
    stopAdvanceTimer();

    if (!hasPhotos.value || isPaused.value || slides.value.length <= 1) {
        return;
    }

    advanceTimer = window.setInterval(() => {
        next();
    }, intervalSeconds.value * 1000);
};

const stopAdvanceTimer = () => {
    if (advanceTimer) {
        window.clearInterval(advanceTimer);
        advanceTimer = null;
    }
};

const fetchPhotos = async () => {
    try {
        const response = await fetch(route('photos.slideshow.data'), {
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        const incoming = data.photos ?? [];

        if (!incoming.length) {
            slides.value = [];
            currentIndex.value = 0;
            return;
        }

        const wasAtEnd = currentIndex.value >= slides.value.length - 1;
        const previousLength = slides.value.length;
        slides.value = incoming;

        if (incoming.length > previousLength && wasAtEnd) {
            currentIndex.value = incoming.length - 1;
        } else if (currentIndex.value >= incoming.length) {
            currentIndex.value = incoming.length - 1;
        }
    } catch {
        // Ignore transient network errors during polling.
    }
};

const startRefreshTimer = () => {
    stopRefreshTimer();
    refreshTimer = window.setInterval(fetchPhotos, refreshSeconds.value * 1000);
};

const stopRefreshTimer = () => {
    if (refreshTimer) {
        window.clearInterval(refreshTimer);
        refreshTimer = null;
    }
};

const togglePause = () => {
    isPaused.value = !isPaused.value;
};

watch([isPaused, hasPhotos, intervalSeconds], () => {
    startAdvanceTimer();
});

watch(() => props.photos, (photos) => {
    slides.value = [...photos];

    if (currentIndex.value >= photos.length) {
        currentIndex.value = Math.max(0, photos.length - 1);
    }
});

onMounted(() => {
    if (slides.value.length) {
        currentIndex.value = slides.value.length - 1;
    }

    startAdvanceTimer();
    startRefreshTimer();
});

onBeforeUnmount(() => {
    stopAdvanceTimer();
    stopRefreshTimer();
});
</script>

<template>
    <Head :title="`${guestPhotos.slideshow_title} — ${wedding.couple.display_names}`" />

    <div class="relative min-h-screen overflow-hidden bg-midnight text-ivory">
        <StarField />
        <div class="pointer-events-none absolute inset-0 hero-scrim hero-scrim-soft" aria-hidden="true" />

        <header class="relative z-30 flex flex-col gap-4 px-6 pt-8 pb-3 md:flex-row md:items-end md:justify-between md:px-10 md:pt-10">
            <div class="text-center md:text-left">
                <p class="hero-minimal-kicker hero-text-shadow">{{ wedding.tagline }}</p>
                <h1 class="mt-3 font-display text-display-md text-white hero-text-shadow md:text-display-lg">
                    {{ guestPhotos.slideshow_title }}
                </h1>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-2 md:justify-end">
                <button
                    v-if="hasPhotos && slides.length > 1"
                    type="button"
                    class="slideshow-control"
                    aria-label="Previous photo"
                    @click="previous"
                >
                    Prev
                </button>
                <button type="button" class="slideshow-control" @click="togglePause">
                    {{ isPaused ? 'Play' : 'Pause' }}
                </button>
                <button
                    v-if="hasPhotos && slides.length > 1"
                    type="button"
                    class="slideshow-control"
                    aria-label="Next photo"
                    @click="next"
                >
                    Next
                </button>
                <Link :href="route('photos.share')" class="slideshow-control">
                    Share
                </Link>
            </div>
        </header>

        <main v-if="hasPhotos && currentPhoto" class="collage-main">
            <div class="collage-watermark pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center" aria-hidden="true">
                <span class="hero-minimal-name opacity-[0.07]">{{ wedding.couple.partner1.name }}</span>
                <span class="hero-minimal-amp opacity-[0.08]">&</span>
                <span class="hero-minimal-name opacity-[0.07]">{{ wedding.couple.partner2.name }}</span>
            </div>

            <div class="collage-board" aria-live="polite">
                <TransitionGroup name="collage-tile" tag="div" class="collage-side-layer">
                    <article
                        v-for="item in sideItems"
                        :key="item.id"
                        class="collage-tile"
                        :style="tileStyle(item)"
                    >
                        <div class="collage-tile-float">
                            <button
                                type="button"
                                class="collage-polaroid"
                                :aria-label="`View photo by ${item.guest_name}`"
                                @click="goTo(slides.findIndex((photo) => photo.id === item.id))"
                            >
                                <div class="collage-image-shell">
                                    <img
                                        :src="item.url"
                                        :alt="item.caption || `Photo by ${item.guest_name}`"
                                        class="collage-image"
                                        loading="lazy"
                                    >
                                </div>
                                <div class="collage-polaroid-footer">
                                    <p class="collage-guest font-script">{{ item.guest_name }}</p>
                                </div>
                            </button>
                        </div>
                    </article>
                </TransitionGroup>

                <Transition name="collage-featured" mode="out-in">
                    <article
                        v-if="featuredItem"
                        :key="featuredItem.id"
                        class="collage-tile collage-tile-featured collage-featured-layer"
                        :style="featuredTileStyle"
                    >
                        <div class="collage-tile-float">
                            <button
                                type="button"
                                class="collage-polaroid"
                                :aria-label="`View photo by ${featuredItem.guest_name}`"
                                aria-current="true"
                                @click="goTo(currentIndex)"
                            >
                                <div class="collage-image-shell">
                                    <img
                                        :src="featuredItem.url"
                                        :alt="featuredItem.caption || `Photo by ${featuredItem.guest_name}`"
                                        class="collage-image"
                                    >
                                </div>
                                <div class="collage-polaroid-footer">
                                    <p class="collage-guest font-script">{{ featuredItem.guest_name }}</p>
                                    <p v-if="featuredItem.caption" class="collage-caption">
                                        {{ featuredItem.caption }}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </article>
                </Transition>
            </div>

            <div class="collage-meta fixed bottom-6 left-6 z-50 max-w-xs md:bottom-8 md:left-8">
                <Transition name="collage-meta" mode="out-in">
                    <div :key="currentPhoto.id" class="hero-text-shadow">
                        <p class="wedding-label">Now Showing</p>
                        <h2 class="mt-2 font-display text-2xl text-white md:text-3xl">
                            {{ currentPhoto.guest_name }}
                        </h2>
                        <p v-if="currentPhoto.caption" class="mt-2 max-w-sm font-sans text-sm leading-relaxed text-ivory/65">
                            {{ currentPhoto.caption }}
                        </p>
                        <p class="mt-3 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-ivory/45">
                            {{ String(currentIndex + 1).padStart(2, '0') }}
                            <span class="text-gold-soft/70">/</span>
                            {{ String(slides.length).padStart(2, '0') }}
                        </p>
                    </div>
                </Transition>
            </div>

            <aside
                class="collage-qr fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2 text-center md:bottom-8 md:right-8"
                aria-label="Scan to upload a photo"
            >
                <p class="wedding-label-gold">Scan to Upload</p>
                <img
                    :src="route('photos.slideshow.qrcode')"
                    alt="QR code to upload a wedding photo"
                    class="h-24 w-24 bg-white p-1 shadow-[0_8px_32px_rgba(11,16,38,0.35)]"
                >
            </aside>
        </main>

        <section v-else class="collage-empty flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-6 text-center">
            <p class="wedding-label mb-4">Live Slideshow</p>
            <h2 class="wedding-heading">Waiting for the first photo</h2>
            <p class="mt-4 max-w-md wedding-body">
                Guest uploads will appear here automatically
            </p>

            <div class="mt-10 flex flex-col items-center gap-3 border border-white/10 bg-white/[0.03] px-8 py-8">
                <p class="wedding-label-gold">Share Your Photo</p>
                <img
                    :src="route('photos.slideshow.qrcode')"
                    alt="QR code to upload a wedding photo"
                    class="h-36 w-36 bg-white p-1 shadow-[0_8px_32px_rgba(11,16,38,0.35)]"
                >
                <p v-if="upload_url" class="max-w-xs font-sans text-[0.62rem] text-ivory/40 break-all">
                    {{ upload_url }}
                </p>
            </div>

            <Link :href="route('photos.share')" class="wedding-button-primary mt-8">
                Be the First to Share
            </Link>
        </section>
    </div>
</template>

<style scoped>
.slideshow-control {
    @apply inline-flex items-center justify-center rounded-full border border-ivory/25 px-4 py-2 font-sans text-[0.62rem] uppercase tracking-[0.18em] text-ivory/80 transition-all duration-luxury hover:border-ivory/45 hover:text-white;
}

.collage-main {
    position: relative;
    z-index: 1;
    min-height: calc(100vh - 6.5rem);
}

.collage-board {
    position: relative;
    z-index: 1;
    height: calc(100vh - 8.5rem);
    overflow: hidden;
}

.collage-side-layer {
    position: absolute;
    inset: 0;
    z-index: 1;
}

.collage-featured-layer {
    z-index: 10;
}

.collage-tile {
    position: absolute;
    left: var(--tile-left);
    top: var(--tile-top);
    width: var(--tile-width);
    transform: translate(-50%, -50%) rotate(var(--tile-rotate)) scale(var(--tile-scale, 1));
    transition:
        left 1.1s cubic-bezier(0.22, 1, 0.36, 1),
        top 1.1s cubic-bezier(0.22, 1, 0.36, 1),
        width 1.1s cubic-bezier(0.22, 1, 0.36, 1),
        transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.collage-tile-float {
    animation: collage-drift 9s ease-in-out infinite;
    animation-delay: var(--tile-delay);
}

.collage-tile-featured .collage-tile-float {
    animation: none;
}

.collage-polaroid {
    display: block;
    width: 100%;
    border: none;
    padding: 0.65rem 0.65rem 2.4rem;
    background-color: #faf7f2;
    cursor: pointer;
    text-align: left;
    color: inherit;
    isolation: isolate;
    overflow: hidden;
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.18),
        0 16px 32px rgba(0, 0, 0, 0.24);
    transition: box-shadow 0.6s ease, transform 0.6s ease;
}

.collage-tile-featured .collage-polaroid {
    padding: 1rem 1rem 3rem;
    box-shadow:
        0 4px 10px rgba(0, 0, 0, 0.18),
        0 20px 40px rgba(0, 0, 0, 0.26),
        0 0 0 1px rgba(212, 175, 106, 0.35);
}

.collage-tile:not(.collage-tile-featured) .collage-image-shell::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(8, 12, 28, 0.16);
    pointer-events: none;
    transition: background-color 0.35s ease;
}

.collage-tile:not(.collage-tile-featured):hover .collage-image-shell::after {
    background: transparent;
}

.collage-image-shell {
    position: relative;
    overflow: hidden;
}

.collage-tile:not(.collage-tile-featured):hover .collage-polaroid {
    transform: scale(1.03);
}

.collage-image {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    background: #e8e4dc;
}

.collage-polaroid-footer {
    min-height: 1.75rem;
    margin-top: 0.65rem;
    padding: 0 0.15rem;
    text-align: center;
    color: #3a3228;
}

.collage-tile-featured .collage-polaroid-footer {
    min-height: 2.5rem;
    margin-top: 0.85rem;
}

.collage-guest {
    font-size: clamp(1rem, 2vw, 1.55rem);
    line-height: 1.1;
    color: #3a3228;
}

.collage-tile-featured .collage-guest {
    font-size: clamp(1.5rem, 3.5vw, 2.5rem);
}

.collage-tile-featured .collage-caption {
    font-size: clamp(0.72rem, 1.4vw, 0.9rem);
}

.collage-caption {
    margin-top: 0.15rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.04em;
    color: rgba(58, 50, 40, 0.72);
}

.collage-tile-enter-active {
    transition:
        opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.collage-tile-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}

.collage-tile-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(calc(var(--tile-rotate) - 18deg)) scale(calc(var(--tile-scale, 1) * 0.35));
}

.collage-tile-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(calc(var(--tile-rotate) + 12deg)) scale(calc(var(--tile-scale, 1) * 0.2));
}

.collage-tile-move {
    transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.collage-featured-enter-active,
.collage-featured-leave-active {
    transition:
        opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.collage-featured-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.88);
}

.collage-featured-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.94);
}

.collage-meta-enter-active,
.collage-meta-leave-active {
    transition: opacity 0.45s ease, transform 0.45s ease;
}

.collage-meta-enter-from,
.collage-meta-leave-to {
    opacity: 0;
    transform: translateY(0.6rem);
}

@keyframes collage-drift {
    0%, 100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

@media (max-width: 768px) {
    .collage-board {
        height: calc(100vh - 9.5rem);
    }

    .collage-meta {
        left: 1rem;
        right: 1rem;
        bottom: 5.5rem;
        max-width: none;
    }

    .collage-featured-layer {
        top: 38% !important;
    }

    .collage-qr {
        right: 1rem;
        bottom: 1rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .collage-tile-float {
        animation: none;
    }

    .collage-tile,
    .collage-tile-move,
    .collage-tile-enter-active,
    .collage-tile-leave-active,
    .collage-featured-enter-active,
    .collage-featured-leave-active {
        transition-duration: 0.01ms !important;
    }
}
</style>
