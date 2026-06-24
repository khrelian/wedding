<script setup>
import { computed, ref } from 'vue';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    photos: {
        type: Array,
        default: () => [],
    },
    stats: {
        type: Object,
        default: () => ({ total: 0, approved: 0, pending: 0 }),
    },
});

const page = usePage();
const activeFilter = ref('all');
const actingOnId = ref(null);

const approveForm = useForm({});
const rejectForm = useForm({});
const deleteForm = useForm({});

const flashSuccess = computed(() => page.props.flash?.success ?? '');

const filteredPhotos = computed(() => {
    if (activeFilter.value === 'approved') {
        return props.photos.filter((photo) => photo.approved);
    }

    if (activeFilter.value === 'pending') {
        return props.photos.filter((photo) => !photo.approved);
    }

    return props.photos;
});

const setFilter = (filter) => {
    activeFilter.value = filter;
};

const approvePhoto = (photoId) => {
    actingOnId.value = photoId;
    approveForm.patch(route('guest-photos.approve', photoId), {
        preserveScroll: true,
        onFinish: () => {
            actingOnId.value = null;
        },
    });
};

const rejectPhoto = (photoId) => {
    actingOnId.value = photoId;
    rejectForm.patch(route('guest-photos.reject', photoId), {
        preserveScroll: true,
        onFinish: () => {
            actingOnId.value = null;
        },
    });
};

const deletePhoto = (photo) => {
    if (! confirm(`Delete this photo from ${photo.guest_name}? This cannot be undone.`)) {
        return;
    }

    actingOnId.value = photo.id;
    deleteForm.delete(route('guest-photos.destroy', photo.id), {
        preserveScroll: true,
        onFinish: () => {
            actingOnId.value = null;
        },
    });
};

const isActingOn = (photoId) => actingOnId.value === photoId;
</script>

<template>
    <Head title="Guest Photos" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Guest Photos
                </h2>
                <div class="flex flex-wrap gap-2">
                    <Link
                        :href="route('photos.share')"
                        class="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        target="_blank"
                    >
                        Upload Page
                    </Link>
                    <Link
                        :href="route('photos.slideshow')"
                        class="rounded-md border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                        target="_blank"
                    >
                        Open Slideshow
                    </Link>
                </div>
            </div>
        </template>

        <div class="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div
                    v-if="flashSuccess"
                    class="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                >
                    {{ flashSuccess }}
                </div>

                <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div class="rounded-lg border border-amber-400/20 bg-white p-6 shadow-lg">
                        <p class="text-sm text-slate-600">Total Uploads</p>
                        <p class="text-3xl font-bold text-slate-800">{{ stats.total }}</p>
                    </div>
                    <div class="rounded-lg border border-amber-400/20 bg-white p-6 shadow-lg">
                        <p class="text-sm text-slate-600">Approved</p>
                        <p class="text-3xl font-bold text-green-600">{{ stats.approved }}</p>
                    </div>
                    <div class="rounded-lg border border-amber-400/20 bg-white p-6 shadow-lg">
                        <p class="text-sm text-slate-600">Pending</p>
                        <p class="text-3xl font-bold text-amber-600">{{ stats.pending }}</p>
                    </div>
                </div>

                <div class="overflow-hidden rounded-lg border border-amber-400/20 bg-white shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
                        <p class="text-sm font-medium text-slate-700">
                            Manage uploads — approve for the slideshow or delete permanently.
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <button
                                type="button"
                                class="rounded-full px-3 py-1 text-xs font-medium transition"
                                :class="activeFilter === 'all'
                                    ? 'bg-slate-800 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                                @click="setFilter('all')"
                            >
                                All ({{ stats.total }})
                            </button>
                            <button
                                type="button"
                                class="rounded-full px-3 py-1 text-xs font-medium transition"
                                :class="activeFilter === 'approved'
                                    ? 'bg-green-700 text-white'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'"
                                @click="setFilter('approved')"
                            >
                                Approved ({{ stats.approved }})
                            </button>
                            <button
                                type="button"
                                class="rounded-full px-3 py-1 text-xs font-medium transition"
                                :class="activeFilter === 'pending'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
                                @click="setFilter('pending')"
                            >
                                Pending ({{ stats.pending }})
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="filteredPhotos.length"
                        class="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        <div
                            v-for="photo in filteredPhotos"
                            :key="photo.id"
                            class="overflow-hidden rounded-lg border border-slate-200"
                        >
                            <div class="relative aspect-square bg-slate-100">
                                <img
                                    :src="photo.url"
                                    :alt="photo.caption || `Photo by ${photo.guest_name}`"
                                    class="h-full w-full object-cover"
                                >
                                <span
                                    class="absolute left-3 top-3 rounded-full px-2 py-1 text-xs font-medium"
                                    :class="photo.approved ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'"
                                >
                                    {{ photo.approved ? 'Approved' : 'Pending' }}
                                </span>
                            </div>

                            <div class="space-y-3 p-4">
                                <div>
                                    <p class="font-medium text-slate-900">{{ photo.guest_name }}</p>
                                    <p v-if="photo.caption" class="mt-1 text-sm text-slate-600">
                                        {{ photo.caption }}
                                    </p>
                                    <p class="mt-1 text-xs text-slate-400">{{ photo.uploaded_at }}</p>
                                </div>

                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-if="!photo.approved"
                                        type="button"
                                        class="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                                        :disabled="isActingOn(photo.id)"
                                        @click="approvePhoto(photo.id)"
                                    >
                                        {{ isActingOn(photo.id) && approveForm.processing ? 'Approving...' : 'Approve' }}
                                    </button>
                                    <button
                                        v-if="photo.approved"
                                        type="button"
                                        class="rounded-md bg-slate-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                                        :disabled="isActingOn(photo.id)"
                                        @click="rejectPhoto(photo.id)"
                                    >
                                        {{ isActingOn(photo.id) && rejectForm.processing ? 'Hiding...' : 'Hide' }}
                                    </button>
                                    <button
                                        type="button"
                                        class="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                                        :disabled="isActingOn(photo.id)"
                                        @click="deletePhoto(photo)"
                                    >
                                        {{ isActingOn(photo.id) && deleteForm.processing ? 'Deleting...' : 'Delete' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-else
                        class="p-12 text-center text-slate-500"
                    >
                        {{
                            activeFilter === 'all'
                                ? 'No guest photos yet.'
                                : `No ${activeFilter} photos.`
                        }}
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
