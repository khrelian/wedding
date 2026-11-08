<script setup>
import { computed, ref } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { useScrollReveal } from '@/composables/useScrollReveal';

const page = usePage();
const wedding = computed(() => page.props.wedding);
const submitted = ref(false);

const form = useForm({
    name: '',
    email: '',
    phone: '',
    attendance: '',
    special_message: '',
});

const submit = () => {
    form.post(route('generic-invitation.store'), {
        onSuccess: () => {
            submitted.value = true;
        },
    });
};

useScrollReveal();
</script>

<template>
    <Head :title="`Invitation & RSVP — ${wedding.couple.display_names}`" />

    <main class="silver-wedding min-h-screen overflow-x-hidden px-5 py-12 text-slate-800 sm:px-8 sm:py-20">
        <div class="mx-auto max-w-3xl">
            <header class="scroll-reveal text-center">
                <p class="font-sans text-xs uppercase tracking-[0.28em] text-slate-600">A Silver Anniversary Celebration</p>
                <h1 class="mt-5 font-display text-4xl text-slate-900 sm:text-5xl">
                    {{ wedding.couple.partner1.name }} <span class="font-display italic">&amp;</span> {{ wedding.couple.partner2.name }}
                </h1>
                <p v-if="submitted" class="mt-4 font-display text-2xl italic text-slate-700">
                    Dear {{ form.name }}
                </p>
                <p class="mt-5 font-sans text-sm uppercase tracking-[0.16em] text-slate-600">
                    {{ wedding.date.display }} · {{ wedding.date.ceremony_time }}
                </p>
                <p class="mt-2 font-sans text-sm text-slate-600">{{ wedding.venue.ceremony.name }} · {{ wedding.venue.ceremony.city }}</p>
                <p class="mx-auto mt-6 max-w-xl font-display text-lg italic text-slate-700">
                    We would be delighted to celebrate twenty-five years of love with you.
                </p>
            </header>

            <div class="my-10 h-px bg-slate-500/30 sm:my-12" />

            <section v-if="submitted" class="scroll-reveal border border-slate-500/30 bg-white/40 p-8 text-center shadow-lg sm:p-12">
                <h2 class="mt-4 font-display text-3xl text-slate-900">Your RSVP is received</h2>
                <p class="mx-auto mt-4 max-w-xl text-slate-700">
                    {{ form.attendance === 'yes'
                        ? "We're so happy you'll join us to celebrate this special milestone."
                        : "Thank you for letting us know. You'll be missed at the celebration." }}
                </p>
            </section>

            <form v-else class="scroll-reveal space-y-8 border border-slate-500/25 bg-white/35 p-6 shadow-xl sm:p-10" @submit.prevent="submit">
                <div class="text-center">
                    <p class="font-sans text-xs uppercase tracking-[0.25em] text-slate-600">Kindly reply</p>
                    <h2 class="mt-2 font-display text-3xl text-slate-900">Your RSVP</h2>
                    <p class="mt-3 text-sm text-slate-600">Please share your details so we can prepare to welcome you.</p>
                </div>

                <div class="grid gap-5 sm:grid-cols-2">
                    <div class="sm:col-span-2">
                        <label for="generic-name" class="mb-2 block text-sm font-medium text-slate-700">Your name *</label>
                        <input id="generic-name" v-model="form.name" type="text" autocomplete="name" required maxlength="255" class="w-full border border-slate-300 bg-white/80 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-slate-500">
                        <p v-if="form.errors.name" class="mt-1 text-sm text-red-700">{{ form.errors.name }}</p>
                    </div>

                    <div>
                        <label for="generic-email" class="mb-2 block text-sm font-medium text-slate-700">Email</label>
                        <input id="generic-email" v-model="form.email" type="email" autocomplete="email" maxlength="255" class="w-full border border-slate-300 bg-white/80 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-slate-500">
                        <p v-if="form.errors.email" class="mt-1 text-sm text-red-700">{{ form.errors.email }}</p>
                    </div>

                    <div>
                        <label for="generic-phone" class="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                        <input id="generic-phone" v-model="form.phone" type="tel" autocomplete="tel" maxlength="30" class="w-full border border-slate-300 bg-white/80 px-4 py-3 text-slate-900 focus:border-slate-500 focus:ring-slate-500">
                        <p v-if="form.errors.phone" class="mt-1 text-sm text-red-700">{{ form.errors.phone }}</p>
                    </div>
                    <p v-if="form.errors.email && form.errors.phone" class="-mt-3 text-sm text-red-700 sm:col-span-2">Please provide an email address or phone number.</p>

                </div>

                <fieldset>
                    <legend class="mb-3 text-sm font-medium text-slate-700">Will you be attending? *</legend>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <label class="flex cursor-pointer items-center gap-3 border p-4 transition" :class="form.attendance === 'yes' ? 'border-slate-700 bg-white/80' : 'border-slate-300 bg-white/35 hover:bg-white/60'">
                            <input v-model="form.attendance" type="radio" name="attendance" value="yes" required class="text-slate-700 focus:ring-slate-500">
                            <span class="text-sm text-slate-800">Joyfully accept</span>
                        </label>
                        <label class="flex cursor-pointer items-center gap-3 border p-4 transition" :class="form.attendance === 'no' ? 'border-slate-700 bg-white/80' : 'border-slate-300 bg-white/35 hover:bg-white/60'">
                            <input v-model="form.attendance" type="radio" name="attendance" value="no" class="text-slate-700 focus:ring-slate-500">
                            <span class="text-sm text-slate-800">Regretfully decline</span>
                        </label>
                    </div>
                    <p v-if="form.errors.attendance" class="mt-2 text-sm text-red-700">{{ form.errors.attendance }}</p>
                </fieldset>

                <div>
                    <label for="generic-message" class="mb-2 block text-sm font-medium text-slate-700">A message for the couple <span class="font-normal text-slate-500">(optional)</span></label>
                    <textarea id="generic-message" v-model="form.special_message" rows="3" maxlength="2000" placeholder="Share your well wishes" class="w-full border border-slate-300 bg-white/80 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500" />
                    <p v-if="form.errors.special_message" class="mt-1 text-sm text-red-700">{{ form.errors.special_message }}</p>
                </div>

                <div class="text-center">
                    <button type="submit" :disabled="form.processing" class="generic-invitation-submit inline-flex min-w-56 justify-center border border-slate-800 bg-slate-800 px-8 py-3 text-sm uppercase tracking-[0.16em] text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {{ form.processing ? 'Submitting…' : 'Send my RSVP' }}
                    </button>
                </div>
            </form>

            <p v-if="$page.props.flash?.success && !submitted" class="mt-6 border border-green-700/20 bg-green-50/70 p-4 text-center text-sm text-green-800">
                {{ $page.props.flash.success }}
            </p>
        </div>
    </main>
</template>
