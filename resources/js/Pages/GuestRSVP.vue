<script setup>
import { ref } from 'vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({
    invitee: Object,
    existingRsvp: Object,
    guestMode: Boolean,
});

const form = useForm({
    attendance: props.existingRsvp?.attendance || '',
    song_request: props.existingRsvp?.song_request || '',
    special_message: props.existingRsvp?.special_message || '',
});

const submitted = ref(false);

const submit = () => {
    form.post(route('rsvp.guest.store', props.invitee.token), {
        onSuccess: () => {
            submitted.value = true;
        },
    });
};
</script>

<template>
    <Head title="RSVP - Ian Jay & Karen Kate's Wedding" />

    <div class="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <!-- Animated Stars Background (same as Welcome page) -->
        <div class="stars-container absolute inset-0 overflow-hidden">
            <div
                v-for="i in 50"
                :key="i"
                class="star absolute rounded-full bg-amber-200"
                :style="{
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    width: (Math.random() * 2 + 1) + 'px',
                    height: (Math.random() * 2 + 1) + 'px',
                    animationDelay: Math.random() * 3 + 's',
                }"
            ></div>
        </div>

        <div class="relative z-10 py-12 px-4">
            <div class="max-w-3xl mx-auto">
                <!-- Header -->
                <div class="text-center mb-8">
                    <div class="flex justify-center gap-3 mb-4">
                        <svg class="w-8 h-8 text-amber-300 animate-twinkle" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                        <svg class="w-10 h-10 text-amber-400 animate-twinkle" style="animation-delay: 0.3s" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                        <svg class="w-8 h-8 text-amber-300 animate-twinkle" style="animation-delay: 0.6s" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                    </div>
                    <h1 class="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent mb-4">
                        You're Invited!
                    </h1>
                    <p class="text-2xl md:text-3xl font-script text-amber-50 mb-2">
                        Ian Jay & Karen Kate
                    </p>
                    <p class="text-amber-200/80 font-elegant">
                        July 17, 2026 • 7:00 AM • Sto. Niño Diocesan Shrine
                    </p>
                </div>

                <!-- Success State -->
                <div v-if="submitted" class="bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-10 text-center">
                    <div class="flex justify-center mb-6">
                        <svg class="w-16 h-16 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 class="text-3xl font-display font-bold text-amber-200 mb-3">Thank You, {{ invitee.name }}!</h2>
                    <p class="text-amber-100/80 font-elegant text-xl mb-2">
                        {{ form.attendance === 'yes' ? 'We\'re so excited to celebrate with you! 🌙' : 'We\'ll miss you, but we understand. Thank you for letting us know.' }}
                    </p>
                    <p class="text-amber-300/60 text-sm font-sans mt-4">Your RSVP has been successfully recorded.</p>
                </div>

                <!-- Welcome Message -->
                <div class="bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-6 mb-6">
                    <h2 class="text-xl font-elegant text-amber-100 mb-2 flex items-center gap-2">
                        <svg class="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                        Hello, {{ invitee.name }}!
                    </h2>
                    <p class="text-amber-100/90 font-sans">
                        We hope you can join us under the starry sky for our special day!
                        Please let us know if you'll be able to attend.
                    </p>
                    <p class="text-amber-300/80 text-sm mt-2 font-sans" v-if="invitee.party_size > 1">
                        Your invitation is for {{ invitee.party_size }} {{ invitee.party_size === 1 ? 'person' : 'people' }}.
                    </p>
                </div>

                <!-- Success Message -->
                <div v-if="$page.props.flash?.success" class="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-md">
                    <p class="text-green-100 flex items-center gap-2 font-sans">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        {{ $page.props.flash.success }}
                    </p>
                </div>

                <!-- RSVP Form -->
                <div class="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/20 p-6">
                    <form @submit.prevent="submit" class="space-y-6">
                        <!-- Attendance -->
                        <div>
                            <label class="block text-sm font-medium text-slate-800 mb-3 flex items-center gap-2 font-sans">
                                <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                Will you be attending? *
                            </label>
                            <div class="space-y-2">
                                <label class="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-amber-50/50 hover:border-amber-300 transition cursor-pointer" :class="{ 'bg-amber-50 border-amber-300': form.attendance === 'yes' }">
                                    <input v-model="form.attendance" type="radio" name="attendance" value="yes" class="mr-3 text-amber-500 focus:ring-amber-500">
                                    <span class="text-slate-700 font-sans">✨ Joyfully accept</span>
                                </label>
                                <label class="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer" :class="{ 'bg-slate-50 border-slate-300': form.attendance === 'no' }">
                                    <input v-model="form.attendance" type="radio" name="attendance" value="no" class="mr-3 text-slate-500 focus:ring-slate-500">
                                    <span class="text-slate-700 font-sans">Regretfully decline</span>
                                </label>
                            </div>
                            <p v-if="form.errors.attendance" class="mt-1 text-sm text-red-600 font-sans">{{ form.errors.attendance }}</p>
                        </div>

                        <!-- Song Request -->
                        <div>
                            <label class="block text-sm font-medium text-slate-800 mb-2 font-sans">
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
                            <label class="block text-sm font-medium text-slate-800 mb-2 font-sans">
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
                        <div class="flex items-center justify-center pt-4">
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-md hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/30 font-semibold font-sans flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                </svg>
                                {{ form.processing ? 'Submitting...' : (existingRsvp ? 'Update RSVP' : 'Submit RSVP') }}
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Adults-Only Note -->
                <div class="mt-6 bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-xl border border-amber-400/30 p-6 text-center">
                    <div class="flex justify-center mb-3">
                        <svg class="w-7 h-7 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-display font-semibold text-amber-200 mb-2">An Adults-Only Celebration</h3>
                    <p class="text-amber-100/70 font-sans text-sm leading-relaxed">
                        We adore your little ones, and we hope you understand that our celebration is reserved for adults only. We kindly ask that you make arrangements for childcare so you can relax, celebrate, and enjoy the evening to the fullest with us.
                    </p>
                </div>

                <!-- Gift Preference -->
                <div class="mt-6 bg-gradient-to-br from-slate-800/80 to-indigo-900/80 backdrop-blur-md rounded-lg shadow-xl border border-amber-400/30 p-6 text-center">
                    <div class="flex justify-center mb-3">
                        <svg class="w-7 h-7 text-amber-300" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10.125V21m0-10.875c-2.485 0-4.5-1.119-4.5-2.5V6.75m4.5 3.375c2.485 0 4.5-1.119 4.5-2.5V6.75m-9 4.5h18" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-display font-semibold text-amber-200 mb-2">A Note on Gifts</h3>
                    <p class="text-amber-100/70 font-sans text-sm leading-relaxed">
                        Your presence on our special day is already the greatest gift we could ask for. However, if you wish to bless us further, we kindly prefer
                        <span class="text-amber-300 font-medium">cash gifts</span>
                        as we begin building our new life together.
                    </p>
                </div>

                <!-- Footer Note -->
                <div class="mt-6 text-center text-amber-200/60 text-sm font-sans">
                    <p>Questions? Contact us at <a href="mailto:karenkateseronay@gmail.com" class="text-amber-300 hover:text-amber-200 underline">karenkateseronay@gmail.com</a></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.star {
    animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.3;
        transform: scale(0.8);
    }
}

.animate-twinkle {
    animation: twinkle 3s ease-in-out infinite;
}
</style>
