<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    photos: Array,
    stats: Object,
});

const approveForm = useForm({});
const deleteForm = useForm({});

const approvePhoto = (photoId) => {
    approveForm.patch(route('guest-photos.approve', photoId));
};

const deletePhoto = (photo) => {
    if (confirm(`Delete photo from ${photo.guest_name}?`)) {
        deleteForm.delete(route('guest-photos.destroy', photo.id));
    }
};
</script>

<template>
    <Head title="Guest Photos" />

    <AuthenticatedLayout>
        <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <h2 class="text-xl font-semibold leading-tight text-gray-800">
                    Guest Photos
                </h2>
                <Link
                    :href="route('photos.slideshow')"
                    class="rounded-md border border-amber-500/40 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                    target="_blank"
                >
                    Open Slideshow
                </Link>
            </div>
        </template>

        <div class="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                    <div class="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div
                            v-for="photo in photos"
                            :key="photo.id"
                            class="overflow-hidden rounded-lg border border-slate-200"
                        >
                            <img
                                :src="photo.url"
                                :alt="photo.caption || `Photo by ${photo.guest_name}`"
                                class="aspect-square w-full object-cover"
                            >
                            <div class="space-y-3 p-4">
                                <div>
                                    <p class="font-medium text-slate-900">{{ photo.guest_name }}</p>
                                    <p v-if="photo.caption" class="mt-1 text-sm text-slate-600">
                                        {{ photo.caption }}
                                    </p>
                                    <p class="mt-1 text-xs text-slate-400">{{ photo.uploaded_at }}</p>
                                </div>

                                <div class="flex items-center justify-between gap-3">
                                    <span
                                        class="rounded-full px-2 py-1 text-xs"
                                        :class="photo.approved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'"
                                    >
                                        {{ photo.approved ? 'Approved' : 'Pending' }}
                                    </span>

                                    <div class="flex gap-2">
                                        <button
                                            v-if="!photo.approved"
                                            type="button"
                                            class="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                                            @click="approvePhoto(photo.id)"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                                            @click="deletePhoto(photo)"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="photos.length === 0" class="p-12 text-center text-slate-500">
                        No guest photos yet.
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
