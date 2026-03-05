<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';

defineProps({
    rsvps: Array,
    stats: Object,
});
</script>

<template>
    <Head title="RSVP Management - View All RSVPs" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                </svg>
                RSVP Management
            </h2>
        </template>

        <div class="py-12 bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-lg border border-amber-400/20 p-6">
                        <div class="flex items-center gap-3">
                            <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-slate-600">Total Responses</p>
                                <p class="text-3xl font-bold text-slate-800">{{ stats.total }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-lg border border-amber-400/20 p-6">
                        <div class="flex items-center gap-3">
                            <div class="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-slate-600">Attending</p>
                                <p class="text-3xl font-bold text-green-600">{{ stats.attending }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-lg border border-amber-400/20 p-6">
                        <div class="flex items-center gap-3">
                            <div class="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm text-slate-600">Not Attending</p>
                                <p class="text-3xl font-bold text-red-600">{{ stats.not_attending }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RSVPs List -->
                <div class="bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-lg border border-amber-400/20 overflow-hidden">
                    <div class="p-6 bg-gradient-to-r from-slate-800 to-blue-900 border-b border-amber-400/30">
                        <h3 class="text-xl font-serif font-semibold text-amber-100 flex items-center gap-2">
                            <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            All RSVP Responses
                        </h3>
                    </div>

                    <div v-if="rsvps.length === 0" class="p-12 text-center">
                        <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                        <p class="text-slate-500 text-lg">No RSVPs yet</p>
                        <p class="text-slate-400 text-sm mt-2">RSVPs will appear here once guests start responding</p>
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-200">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Guest
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Song Request
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Message
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-slate-200">
                                <tr v-for="rsvp in rsvps" :key="rsvp.id" class="hover:bg-slate-50 transition">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-slate-900">{{ rsvp.guest_name }}</div>
                                        <div class="text-sm text-slate-500">{{ rsvp.email }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span v-if="rsvp.attendance === 'yes'" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            ✓ Attending
                                        </span>
                                        <span v-else class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            ✗ Not Attending
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                        {{ rsvp.song_request || '-' }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                                        {{ rsvp.special_message || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {{ rsvp.submitted_at }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Export Options -->
                <div class="mt-6 bg-gradient-to-br from-white to-slate-50 rounded-lg shadow-lg border border-amber-400/20 p-6">
                    <h4 class="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                        Export Options
                    </h4>
                    <p class="text-sm text-slate-600 mb-4">Download your RSVP data for planning and coordination</p>
                    <div class="flex gap-3">
                        <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow-md flex items-center gap-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                            Export to Excel
                        </button>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-md flex items-center gap-2">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                            </svg>
                            Export to CSV
                        </button>
                    </div>
                    <p class="text-xs text-slate-500 mt-3">Coming soon! Export functionality will be added in the next update.</p>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
