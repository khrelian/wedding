<script setup>
import { ref, computed } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    invitee: Object,
    existingRsvp: Object,
    guestMode: Boolean,
});

const page = usePage();
const wedding = computed(() => page.props.wedding);

const form = useForm({
    attendance: props.existingRsvp?.attendance || '',
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
    <Head :title="`RSVP — ${wedding.couple.display_names}`" />

    <div class="silver-wedding silver-rsvp-page relative min-h-screen overflow-x-hidden bg-midnight text-ivory">
        <div class="relative z-10 px-6 py-24 md:py-32">
            <div class="mx-auto max-w-2xl">
                <div class="text-center">
                    <p class="wedding-label mb-4">RSVP</p>
                    <h1 class="font-display text-display-md text-white md:text-display-lg">
                        You're Invited
                    </h1>
                    <p class="mt-4 silver-rsvp-names text-gold-soft">
                        {{ wedding.couple.partner1.name }}
                        <span class="mx-1">&</span>
                        {{ wedding.couple.partner2.name }}
                    </p>
                    <p class="mt-4 font-sans text-sm uppercase tracking-[0.18em] text-ivory/50">
                        {{ wedding.date.display }} · {{ wedding.date.ceremony_time }} · {{ wedding.venue.ceremony.name }}
                    </p>
                </div>

                <div class="wedding-divider" />

                <div
                    v-if="submitted"
                    class="border border-gold-soft/30 p-10 text-center"
                >
                    <p class="font-display text-3xl text-white">Thank You, {{ invitee.name }}</p>
                    <p class="mt-4 wedding-body">
                        {{
                            form.attendance === 'yes'
                                ? "We're so excited to celebrate 25 years of love with you."
                                : "We'll miss you, but we understand. Thank you for letting us know."
                        }}
                    </p>
                    <p class="mt-4 font-sans text-sm text-ivory/40">Your RSVP has been recorded.</p>
                </div>

                <template v-else>
                    <div class="mb-8 border border-white/10 p-8">
                        <h2 class="font-display text-2xl text-white">Hello, {{ invitee.name }}</h2>
                        <p class="mt-3 wedding-body">
                            We hope you can join us for our special day. Please let us know if you'll be able to attend.
                        </p>
                    </div>

                    <div
                        v-if="$page.props.flash?.success"
                        class="mb-6 border border-green-400/30 bg-green-400/10 p-4 text-green-100"
                    >
                        {{ $page.props.flash.success }}
                    </div>

                    <form
                        class="space-y-8 border border-white/10 p-8 md:p-10"
                        @submit.prevent="submit"
                    >
                        <div>
                            <label class="mb-4 block font-sans text-sm uppercase tracking-[0.15em] text-ivory/75">
                                Will you be attending? *
                            </label>
                            <div class="space-y-3">
                                <label
                                    class="flex cursor-pointer items-center border p-4 transition-colors"
                                    :class="form.attendance === 'yes' ? 'border-gold-soft bg-gold-soft/10' : 'border-white/10 hover:border-white/20'"
                                >
                                    <input v-model="form.attendance" type="radio" name="attendance" value="yes" class="mr-3 accent-gold-soft focus:ring-gold-soft">
                                    <span class="font-sans text-ivory">Joyfully accept</span>
                                </label>
                                <label
                                    class="flex cursor-pointer items-center border p-4 transition-colors"
                                    :class="form.attendance === 'no' ? 'border-white/30 bg-white/5' : 'border-white/10 hover:border-white/20'"
                                >
                                    <input v-model="form.attendance" type="radio" name="attendance" value="no" class="mr-3 accent-ivory focus:ring-ivory">
                                    <span class="font-sans text-ivory">Regretfully decline</span>
                                </label>
                            </div>
                            <p v-if="form.errors.attendance" class="mt-2 text-sm text-red-400">{{ form.errors.attendance }}</p>
                        </div>

                        <div>
                            <label class="mb-2 block font-sans text-sm uppercase tracking-[0.15em] text-ivory/75">
                                Special Message
                            </label>
                            <textarea
                                v-model="form.special_message"
                                rows="4"
                                class="w-full border border-white/10 bg-midnight px-4 py-3 font-sans text-ivory placeholder:text-ivory/40 focus:border-gold-soft focus:outline-none focus:ring-1 focus:ring-gold-soft"
                                placeholder="Share your well wishes..."
                            />
                        </div>

                        <div class="flex justify-center pt-2">
                            <button
                                type="submit"
                                :disabled="form.processing"
                                class="wedding-button-primary min-w-[220px] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {{ form.processing ? 'Submitting...' : (existingRsvp ? 'Update RSVP' : 'Submit RSVP') }}
                            </button>
                        </div>
                    </form>
                </template>

                <div
                    v-if="wedding.policies.adults_only || wedding.policies.gifts"
                    class="scroll-reveal mt-10 space-y-8"
                >
                    <div v-if="wedding.policies.adults_only" class="border border-white/10 p-8 text-center">
                        <h3 class="font-display text-xl text-white">{{ wedding.policies.adults_only.title }}</h3>
                        <p class="mt-4 wedding-body">{{ wedding.policies.adults_only.body }}</p>
                    </div>
                    <div v-if="wedding.policies.gifts" class="border border-white/10 p-8 text-center">
                        <h3 class="font-display text-xl text-white">{{ wedding.policies.gifts.title }}</h3>
                        <p class="mt-4 wedding-body">{{ wedding.policies.gifts.lead }}</p>
                        <p class="mt-4 wedding-body">{{ wedding.policies.gifts.body }}</p>
                    </div>
                </div>

                <p class="mt-10 text-center font-sans text-sm text-ivory/60">
                    RSVP Contacts:
                    <span v-for="(contact, index) in wedding.rsvp.contacts" :key="contact.name">
                        {{ contact.name }}
                        <a :href="'tel:' + contact.phone" class="text-gold-soft hover:text-white">
                            {{ contact.phone }}
                        </a><span v-if="index < wedding.rsvp.contacts.length - 1"> · </span>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>
