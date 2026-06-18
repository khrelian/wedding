<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import { useScrollReveal } from '@/composables/useScrollReveal';
import {
    createFaceFilterContext,
    cycleCrownVariant,
    cycleGlassesVariant,
    isCrownToggleable,
    isGlassesToggleable,
} from '@/composables/useFaceStickers';
import { createStickerContext, exportStickeredPhoto } from '@/composables/usePhotoStickers';
import { getCameraSupportMessage } from '@/composables/useCameraSupport';
import {
    getWeddingFrameVariantLabel,
    getWeddingFrameVariants,
    isWeddingFrameToggleable,
    setWeddingFrameVariant,
    toggleWeddingFrameVariant,
} from '@/composables/useWeddingFrame';
import FaceCameraSession from '@/Components/Wedding/FaceCameraSession.vue';
import PhotoStickerOverlay from '@/Components/Wedding/PhotoStickerOverlay.vue';
import StarField from '@/Components/Wedding/StarField.vue';

const props = defineProps({
    invitee: {
        type: Object,
        default: null,
    },
    recentUploads: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const wedding = computed(() => page.props.wedding);
const guestPhotos = computed(() => wedding.value.guest_photos ?? {});
const features = computed(() => wedding.value.features ?? {});
const photoFilters = computed(() => guestPhotos.value.photo_filters ?? [{ id: 'none', label: 'No Sticker' }]);
const faceFilters = computed(() => guestPhotos.value.face_filters ?? [{ id: 'none', label: 'No Filter' }]);

const photoSource = ref(null);
const previewUrl = ref(null);
const originalFile = ref(null);
const selectedFilterId = ref('none');
const selectedFaceFilterId = ref('none');
const stickerContext = ref({});
const faceStickerContext = ref({});
const fileInput = ref(null);
const submitted = ref(false);
const isExporting = ref(false);
const isMobileViewport = ref(false);
const cameraSupportMessage = ref('');
const weddingFrameVariants = getWeddingFrameVariants();

const updateMobileViewport = () => {
    if (typeof window === 'undefined') {
        return;
    }

    isMobileViewport.value = window.matchMedia('(max-width: 767px)').matches;
};

const form = useForm({
    photo: null,
    guest_name: props.invitee?.name ?? '',
    caption: '',
});

const uploadRoute = computed(() => {
    if (props.invitee?.token) {
        return route('photos.guest.store', props.invitee.token);
    }

    return route('photos.share.store');
});

const selectedFilter = computed(() => {
    return photoFilters.value.find((filter) => filter.id === selectedFilterId.value) ?? photoFilters.value[0];
});

const weddingContext = computed(() => ({
    coupleNames: wedding.value.couple?.display_names ?? '',
    tagline: wedding.value.tagline ?? '',
    weddingFrame: {
        ...guestPhotos.value.wedding_frame ?? {},
        variant: 'classic',
    },
    weddingFrameOverlay: {
        ...guestPhotos.value.wedding_frame_overlay ?? {},
        variant: 'overlay',
    },
    weddingFramePavilion: {
        ...guestPhotos.value.wedding_frame_pavilion ?? {},
        variant: 'pavilion',
    },
    weddingFrameElegant: {
        ...guestPhotos.value.wedding_frame_elegant ?? {},
        variant: 'elegant',
    },
    weddingFrameBotanical: {
        ...guestPhotos.value.wedding_frame_botanical ?? {},
        variant: 'botanical',
    },
}));

const isGalleryPhoto = computed(() => photoSource.value === 'gallery');
const isCameraPhoto = computed(() => photoSource.value === 'camera');
const showCamera = computed(() => photoSource.value === 'camera' && !previewUrl.value);
const showSourcePicker = computed(() => !photoSource.value && !previewUrl.value);

const lockBodyScroll = (locked) => {
    if (typeof document === 'undefined') {
        return;
    }

    document.body.style.overflow = locked ? 'hidden' : '';
};

watch(showCamera, (open) => {
    const isMobile = typeof window !== 'undefined'
        && window.matchMedia('(max-width: 767px)').matches;

    lockBodyScroll(open && isMobile);
});

const setPhotoFromFile = (file, source) => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }

    photoSource.value = source;
    originalFile.value = file;
    form.photo = file;
    previewUrl.value = URL.createObjectURL(file);
    submitted.value = false;

    if (source === 'gallery') {
        selectedFilterId.value = 'none';
        stickerContext.value = {};
    }
};

const onFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    setPhotoFromFile(file, 'gallery');
};

const openCamera = () => {
    const message = getCameraSupportMessage();

    if (message) {
        cameraSupportMessage.value = message;
        return;
    }

    cameraSupportMessage.value = '';
    photoSource.value = 'camera';
    selectedFaceFilterId.value = 'none';
    faceStickerContext.value = {};
    submitted.value = false;
};

const openGallery = () => {
    cameraSupportMessage.value = '';
    fileInput.value?.click();
};

const onCameraCapture = (file) => {
    setPhotoFromFile(file, 'camera');
};

const closeCamera = () => {
    photoSource.value = null;
};

const selectFilter = (filterId) => {
    const filter = photoFilters.value.find((item) => item.id === filterId);

    if (filterId === selectedFilterId.value && filter?.sticker === 'thought_bubble') {
        stickerContext.value = createStickerContext(filter);
        return;
    }

    if (filterId === selectedFilterId.value && isWeddingFrameToggleable(filter)) {
        stickerContext.value = toggleWeddingFrameVariant(stickerContext.value);
        return;
    }

    selectedFilterId.value = filterId;
    stickerContext.value = createStickerContext(filter);
};

const selectFaceFilter = (filterId) => {
    const filter = faceFilters.value.find((item) => item.id === filterId);

    if (filterId === selectedFaceFilterId.value && filter?.face_sticker === 'thought_bubble') {
        faceStickerContext.value = createFaceFilterContext(filter);
        return;
    }

    if (filterId === selectedFaceFilterId.value && isWeddingFrameToggleable(filter)) {
        faceStickerContext.value = toggleWeddingFrameVariant(faceStickerContext.value);
        return;
    }

    if (filterId === selectedFaceFilterId.value && isGlassesToggleable(filter)) {
        faceStickerContext.value = cycleGlassesVariant(
            faceStickerContext.value,
            filter.images.length,
        );
        return;
    }

    if (filterId === selectedFaceFilterId.value && isCrownToggleable(filter)) {
        faceStickerContext.value = cycleCrownVariant(
            faceStickerContext.value,
            filter.images.length,
        );
        return;
    }

    selectedFaceFilterId.value = filterId;
    faceStickerContext.value = createFaceFilterContext(filter);
};

const selectWeddingFrameVariant = (variant, target = 'gallery') => {
    const contextRef = target === 'camera' ? faceStickerContext : stickerContext;
    contextRef.value = setWeddingFrameVariant(contextRef.value, variant);
};

const clearPhoto = () => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }

    previewUrl.value = null;
    originalFile.value = null;
    photoSource.value = null;
    selectedFilterId.value = 'none';
    selectedFaceFilterId.value = 'none';
    stickerContext.value = {};
    faceStickerContext.value = {};
    form.photo = null;
    form.clearErrors('photo');

    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const submit = async () => {
    if (!originalFile.value || isExporting.value) {
        return;
    }

    isExporting.value = true;

    try {
        if (isGalleryPhoto.value) {
            form.photo = await exportStickeredPhoto(
                originalFile.value,
                selectedFilterId.value,
                photoFilters.value,
                weddingContext.value,
                stickerContext.value,
            );
        } else {
            form.photo = originalFile.value;
        }

        form.post(uploadRoute.value, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                submitted.value = true;
                clearPhoto();
                form.caption = '';
                if (!props.invitee) {
                    form.guest_name = '';
                }
            },
            onFinish: () => {
                isExporting.value = false;
            },
        });
    } catch {
        form.setError('photo', 'We could not prepare your photo. Please try again.');
        isExporting.value = false;
    }
};

onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateMobileViewport);
    }

    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
    }

    lockBodyScroll(false);
});

useScrollReveal();

onMounted(() => {
    updateMobileViewport();
    window.addEventListener('resize', updateMobileViewport);
});
</script>

<template>
    <Head :title="`${guestPhotos.upload_title} — ${wedding.couple.display_names}`" />

    <div class="relative min-h-screen overflow-x-hidden bg-midnight text-ivory">
        <StarField />

        <div class="relative z-10 px-6 py-24 md:py-32">
            <div class="mx-auto max-w-2xl">
                <div class="scroll-reveal text-center">
                    <p class="wedding-label mb-4">Guest Photos</p>
                    <h1 class="font-display text-display-md text-white md:text-display-lg">
                        {{ guestPhotos.upload_title }}
                    </h1>
                    <p class="mt-4 wedding-body">
                        {{ guestPhotos.upload_subtitle }}
                    </p>
                    <p v-if="invitee" class="mt-3 font-sans text-sm text-gold-soft/70">
                        Sharing as {{ invitee.name }}
                    </p>
                </div>

                <div class="scroll-reveal wedding-divider" />

                <div
                    v-if="submitted || $page.props.flash?.success"
                    class="scroll-reveal mb-8 border border-green-400/30 bg-green-400/10 p-6 text-center text-green-100"
                >
                    {{ $page.props.flash?.success || 'Thank you! Your photo has been shared.' }}
                </div>

                <form
                    class="scroll-reveal space-y-8 border border-white/10 p-8 md:p-10"
                    @submit.prevent="submit"
                >
                    <div v-if="!invitee">
                        <label class="mb-3 block font-sans text-sm uppercase tracking-[0.15em] text-ivory/70">
                            Your Name *
                        </label>
                        <input
                            v-model="form.guest_name"
                            type="text"
                            class="w-full border border-white/10 bg-transparent px-4 py-3 font-sans text-ivory placeholder:text-ivory/30 focus:border-gold-soft focus:outline-none"
                            placeholder="Enter your name"
                        >
                        <p v-if="form.errors.guest_name" class="mt-2 text-sm text-red-400">
                            {{ form.errors.guest_name }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-3 block font-sans text-sm uppercase tracking-[0.15em] text-ivory/70">
                            Photo *
                        </label>

                        <div
                            v-if="previewUrl"
                            class="space-y-4"
                        >
                            <div class="relative overflow-hidden border border-white/10">
                                <div class="relative max-h-[28rem] w-full overflow-hidden">
                                    <img
                                        :src="previewUrl"
                                        alt="Photo preview"
                                        class="max-h-[28rem] w-full object-cover"
                                    >
                                    <PhotoStickerOverlay
                                        v-if="isGalleryPhoto && selectedFilter?.sticker"
                                        :filter="selectedFilter"
                                        :wedding-context="weddingContext"
                                        :sticker-context="stickerContext"
                                    />
                                </div>
                                <button
                                    type="button"
                                    class="absolute right-3 top-3 border border-white/20 bg-midnight/80 px-3 py-1 font-sans text-xs uppercase tracking-[0.12em] text-ivory"
                                    @click="clearPhoto"
                                >
                                    Retake
                                </button>
                            </div>

                            <div v-if="isGalleryPhoto">
                                <p class="mb-3 font-sans text-xs uppercase tracking-[0.15em] text-ivory/60">
                                    Pick a Fun Sticker
                                </p>
                                <div class="flex gap-3 overflow-x-auto pb-1">
                                    <button
                                        v-for="filter in photoFilters"
                                        :key="filter.id"
                                        type="button"
                                        class="group shrink-0 text-left"
                                        @click="selectFilter(filter.id)"
                                    >
                                        <div
                                            class="relative flex h-16 w-16 items-center justify-center overflow-hidden border transition-colors sm:h-20 sm:w-20"
                                            :class="selectedFilterId === filter.id
                                                ? 'border-gold-soft bg-gold-soft/10'
                                                : 'border-white/15 bg-white/5 group-hover:border-white/40'"
                                        >
                                            <template v-if="filter.id === 'none'">
                                                <span class="font-sans text-[0.65rem] uppercase tracking-[0.12em] text-ivory/70">
                                                    None
                                                </span>
                                            </template>
                                            <template v-else>
                                                <img
                                                    :src="previewUrl"
                                                    alt=""
                                                    class="absolute inset-0 h-full w-full object-cover opacity-55"
                                                >
                                                <span class="relative text-2xl drop-shadow-md sm:text-3xl">
                                                    {{ filter.emoji }}
                                                </span>
                                            </template>
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
                                    v-if="selectedFilter?.sticker === 'thought_bubble' && stickerContext.phrase"
                                    class="mt-3 font-sans text-sm text-ivory/55"
                                >
                                    "{{ stickerContext.phrase }}" — tap again for a new one
                                </p>
                                <div
                                    v-else-if="selectedFilter?.sticker === 'wedding_frame'"
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
                                            @click="selectWeddingFrameVariant(variant, 'gallery')"
                                        >
                                            {{ getWeddingFrameVariantLabel(variant) }}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p
                                v-else-if="isCameraPhoto"
                                class="font-sans text-sm text-ivory/55"
                            >
                                Face filter applied. Retake to try a different one.
                            </p>
                        </div>

                        <div
                            v-else-if="showCamera && !isMobileViewport"
                            class="space-y-4"
                        >
                            <FaceCameraSession
                                :face-filters="faceFilters"
                                :selected-filter-id="selectedFaceFilterId"
                                :sticker-context="faceStickerContext"
                                :wedding-frame="weddingContext.weddingFrame"
                                :wedding-frame-overlay="weddingContext.weddingFrameOverlay"
                                :wedding-frame-pavilion="weddingContext.weddingFramePavilion"
                                :wedding-frame-elegant="weddingContext.weddingFrameElegant"
                                :wedding-frame-botanical="weddingContext.weddingFrameBotanical"
                                :wedding-frame-variants="weddingFrameVariants"
                                @capture="onCameraCapture"
                                @close="closeCamera"
                                @select-filter="selectFaceFilter"
                                @select-wedding-frame-variant="selectWeddingFrameVariant($event, 'camera')"
                            />
                        </div>

                        <div
                            v-else-if="showCamera && isMobileViewport"
                            class="sr-only"
                            aria-hidden="true"
                        >
                            Camera open
                        </div>

                        <div
                            v-else-if="showSourcePicker"
                            class="grid gap-3 sm:grid-cols-2"
                        >
                            <button
                                type="button"
                                class="flex min-h-44 flex-col items-center justify-center border border-dashed border-white/20 px-6 py-8 text-center transition-colors hover:border-gold-soft/50 hover:bg-white/5"
                                @click="openCamera"
                            >
                                <span class="text-3xl">🤳</span>
                                <span class="mt-3 font-display text-xl text-white">Face Camera</span>
                                <span class="mt-2 font-sans text-sm text-ivory/50">
                                    Live filters that follow your face
                                </span>
                            </button>

                            <button
                                type="button"
                                class="flex min-h-44 flex-col items-center justify-center border border-dashed border-white/20 px-6 py-8 text-center transition-colors hover:border-gold-soft/50 hover:bg-white/5"
                                @click="openGallery"
                            >
                                <span class="text-3xl">🖼️</span>
                                <span class="mt-3 font-display text-xl text-white">From Gallery</span>
                                <span class="mt-2 font-sans text-sm text-ivory/50">
                                    Pick a photo and add fun stickers
                                </span>
                            </button>

                            <input
                                ref="fileInput"
                                type="file"
                                accept="image/*"
                                class="sr-only"
                                @change="onFileChange"
                            >
                        </div>

                        <p
                            v-if="cameraSupportMessage"
                            class="mt-3 border border-amber-400/30 bg-amber-400/10 p-4 font-sans text-sm leading-relaxed text-amber-100"
                        >
                            {{ cameraSupportMessage }}
                        </p>

                        <p v-if="form.errors.photo" class="mt-2 text-sm text-red-400">
                            {{ form.errors.photo }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-3 block font-sans text-sm uppercase tracking-[0.15em] text-ivory/70">
                            Caption (optional)
                        </label>
                        <textarea
                            v-model="form.caption"
                            rows="3"
                            class="w-full border border-white/10 bg-transparent px-4 py-3 font-sans text-ivory placeholder:text-ivory/30 focus:border-gold-soft focus:outline-none"
                            placeholder="Add a short note about this moment"
                        />
                        <p v-if="form.errors.caption" class="mt-2 text-sm text-red-400">
                            {{ form.errors.caption }}
                        </p>
                    </div>

                    <button
                        type="submit"
                        class="wedding-button-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="form.processing || isExporting || !originalFile || (!invitee && !form.guest_name)"
                    >
                        {{ form.processing || isExporting ? 'Uploading...' : 'Share Photo' }}
                    </button>
                </form>

                <div
                    v-if="recentUploads.length"
                    class="scroll-reveal mt-12 border border-white/10 p-8"
                >
                    <p class="wedding-label mb-6">Recently Shared</p>
                    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div
                            v-for="photo in recentUploads"
                            :key="photo.id"
                            class="overflow-hidden border border-white/10"
                        >
                            <img
                                :src="photo.url"
                                :alt="photo.caption || `Photo by ${photo.guest_name}`"
                                class="aspect-square w-full object-cover"
                                loading="lazy"
                            >
                        </div>
                    </div>
                </div>

                <div class="scroll-reveal mt-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
                    <Link
                        v-if="features.slideshow"
                        :href="route('photos.slideshow')"
                        class="wedding-button-secondary inline-flex"
                    >
                        View Live Slideshow
                    </Link>
                    <Link
                        :href="invitee ? route('invitation.show', invitee.token) : '/'"
                        class="font-sans text-sm uppercase tracking-[0.15em] text-ivory/50 transition-colors hover:text-gold-soft"
                    >
                        Back to Invitation
                    </Link>
                </div>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div
            v-if="showCamera && isMobileViewport"
            class="camera-fullscreen-mobile"
        >
            <FaceCameraSession
                fill-viewport
                :face-filters="faceFilters"
                :selected-filter-id="selectedFaceFilterId"
                :sticker-context="faceStickerContext"
                :wedding-frame="weddingContext.weddingFrame"
                :wedding-frame-overlay="weddingContext.weddingFrameOverlay"
                :wedding-frame-pavilion="weddingContext.weddingFramePavilion"
                :wedding-frame-elegant="weddingContext.weddingFrameElegant"
                :wedding-frame-botanical="weddingContext.weddingFrameBotanical"
                :wedding-frame-variants="weddingFrameVariants"
                @capture="onCameraCapture"
                @close="closeCamera"
                @select-filter="selectFaceFilter"
                @select-wedding-frame-variant="selectWeddingFrameVariant($event, 'camera')"
            />
        </div>
    </Teleport>
</template>

<style scoped>
.camera-fullscreen-mobile {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100dvh;
    background: #05060f;
    overflow: hidden;
}
</style>
