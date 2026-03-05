<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    existingRsvp: Object,
});

const form = useForm({
    attendance: props.existingRsvp?.attendance || '',
    song_request: props.existingRsvp?.song_request || '',
    special_message: props.existingRsvp?.special_message || '',
});

const submit = () => {
    form.post(route('rsvp.store'), {
        onSuccess: () => {
            // Form is reset automatically by Inertia on success
        },
    });
};
</script>

<template>
    <Head title="RSVP - Elegant Starry Night Wedding" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                </svg>
                RSVP
            </h2>
        </template>

        <div class="py-12 bg-gradient-to-b from-slate-50 to-blue-50">
            <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <!-- Welcome Message -->
                <div class="bg-gradient-to-r from-slate-800 to-blue-900 overflow-hidden shadow-lg sm:rounded-lg mb-6 border border-amber-400/30">
                    <div class="p-6 text-white">
                        <div class="flex items-center gap-3 mb-4">
                            <svg class="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            <h3 class="text-2xl font-serif font-semibold text-amber-100">We hope you can join us under the stars!</h3>
                        </div>
                        <p class="text-amber-100/90">
                            Please let us know if you'll be able to attend our special night. 
                            We can't wait to celebrate with you beneath the starry sky!
                        </p>
                    </div>
                </div>

                <!-- RSVP Form -->
                <div class="bg-gradient-to-br from-white to-slate-50 overflow-hidden shadow-lg sm:rounded-lg border border-amber-400/20">
                    <div class="p-6">
                        <!-- Success Message -->
                        <div v-if="$page.props.flash?.success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p class="text-green-800 flex items-center gap-2">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                                {{ $page.props.flash.success }}
                            </p>
                        </div>

                        <form @submit.prevent="submit" class="space-y-6">
                            <!-- Attendance -->
                            <div>
                                <label class="block text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                                    <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                    </svg>
                                    Will you be attending? *
                                </label>
                                <div class="space-y-2">
                                    <label class="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer" :class="{ 'bg-amber-50 border-amber-300': form.attendance === 'yes' }">
                                        <input v-model="form.attendance" type="radio" name="attendance" value="yes" class="mr-3 text-amber-500 focus:ring-amber-500">
                                        <span class="text-slate-700">✨ Joyfully accept</span>
                                    </label>
                                    <label class="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer" :class="{ 'bg-slate-50 border-slate-300': form.attendance === 'no' }">
                                        <input v-model="form.attendance" type="radio" name="attendance" value="no" class="mr-3 text-slate-500 focus:ring-slate-500">
                                        <span class="text-slate-700">Regretfully decline</span>
                                    </label>
                                </div>
                                <p v-if="form.errors.attendance" class="mt-1 text-sm text-red-600">{{ form.errors.attendance }}</p>
                            </div>

                            <!-- Song Request -->
                            <div>
                                <label class="block text-sm font-medium text-slate-800 mb-2">
                                    Song Request
                                </label>
                                <input 
                                    v-model="form.song_request"
                                    type="text" 
                                    class="mt-1 block w-full rounded-md border-amber-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white"
                                    placeholder="What song will get you dancing under the stars?"
                                >
                            </div>

                            <!-- Special Message -->
                            <div>
                                <label class="block text-sm font-medium text-slate-800 mb-2">
                                    Special Message for the Couple
                                </label>
                                <textarea 
                                    v-model="form.special_message"
                                    rows="4"
                                    class="mt-1 block w-full rounded-md border-amber-200 shadow-sm focus:border-amber-500 focus:ring-amber-500 bg-white"
                                    placeholder="Share your well wishes..."
                                ></textarea>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex items-center justify-end gap-4">
                                <button
                                    type="submit"
                                    :disabled="form.processing"
                                    class="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-md hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/30 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                    </svg>
                                    {{ form.processing ? 'Submitting...' : (existingRsvp ? 'Update RSVP' : 'Submit RSVP') }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Important Information -->
                <div class="mt-6 bg-gradient-to-br from-slate-800 to-blue-900 overflow-hidden shadow-lg sm:rounded-lg border border-amber-400/30">
                    <div class="p-6">
                        <h4 class="font-semibold text-amber-100 mb-3 flex items-center gap-2">
                            <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            Important Information
                        </h4>
                        <ul class="space-y-2 text-sm text-amber-100/90">
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                <span>Please RSVP by <strong class="text-amber-200">June 30, 2026</strong></span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                <span>Dress code: Elegant Evening Attire (think starry night elegance)</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                <span><strong class="text-amber-200">Adults-Only Celebration:</strong> While we love your little ones, we would prefer to have an adults-only celebration. We hope you understand and can arrange childcare for the evening.</span>
                            </li>
                            <li class="flex items-start">
                                <svg class="w-5 h-5 text-amber-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                <span>Questions? Contact us at <a href="mailto:karenkateseronay@gmail.com" class="text-amber-300 hover:text-amber-200 underline">karenkateseronay@gmail.com</a></span>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Gift Information -->
                <div class="mt-6 bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden shadow-lg sm:rounded-lg border border-amber-400/50">
                    <div class="p-6">
                        <h4 class="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-lg">
                            <svg class="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            Gift Registry
                        </h4>
                        <div class="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-amber-300/50">
                            <p class="text-slate-700 mb-3 leading-relaxed">
                                Your presence at our wedding is the greatest gift we could ask for! 
                                However, if you wish to honor us with a gift, we would be grateful for a cash contribution 
                                to help us start our new journey together.
                            </p>
                            <p class="text-slate-600 text-sm italic">
                                "The greatest gift is not found in a store, but in the hearts of true friends and family." ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
