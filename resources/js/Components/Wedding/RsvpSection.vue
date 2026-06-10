<script setup>
defineProps({
    wedding: Object,
    invitee: {
        type: Object,
        default: null,
    },
});
</script>

<template>
    <section id="rsvp" class="wedding-section bg-midnight">
        <div class="wedding-container">
            <div class="editorial-grid items-center">
                <div class="md:col-span-6">
                    <p class="scroll-reveal wedding-label mb-4">Join Us</p>
                    <h2 class="scroll-reveal wedding-heading">RSVP</h2>
                    <div class="scroll-reveal wedding-divider !mx-0" />
                    <p class="scroll-reveal wedding-body">
                        We would be honored to celebrate beneath the stars with you.
                        Please let us know if you will be joining us for this special day.
                    </p>
                    <p
                        v-if="wedding.rsvp.deadline"
                        class="scroll-reveal mt-6 font-sans text-sm uppercase tracking-[0.15em] text-gold-soft/70"
                    >
                        Kindly respond by {{ wedding.rsvp.deadline }}
                    </p>
                </div>

                <div class="scroll-reveal md:col-span-6">
                    <div class="border border-white/10 p-10 text-center md:p-12">
                        <template v-if="invitee?.rsvp_url">
                            <p class="font-display text-2xl text-white">
                                Hello, {{ invitee.name }}
                            </p>
                            <p
                                v-if="invitee.party_size > 1"
                                class="mt-3 font-sans text-body-md text-ivory/60"
                            >
                                Your invitation is for {{ invitee.party_size }} guests
                            </p>
                            <a :href="invitee.rsvp_url" class="wedding-button-primary mt-10 w-full">
                                Submit Your RSVP
                            </a>
                        </template>
                        <template v-else>
                            <p class="wedding-body">
                                RSVP is available through your personalized invitation link.
                            </p>
                            <p class="mt-6 font-sans text-sm text-ivory/50">
                                Questions? Contact
                                <a :href="'mailto:' + wedding.contact.email" class="text-gold-soft hover:text-white">
                                    {{ wedding.contact.email }}
                                </a>
                            </p>
                        </template>
                    </div>
                </div>
            </div>

            <div class="editorial-grid mt-20">
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="font-display text-2xl text-white">{{ wedding.policies.adults_only.title }}</h3>
                    <p class="mt-4 wedding-body">{{ wedding.policies.adults_only.body }}</p>
                </div>
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="font-display text-2xl text-white">{{ wedding.policies.gifts.title }}</h3>
                    <p class="mt-4 wedding-body">{{ wedding.policies.gifts.lead }}</p>
                    <p class="mt-4 wedding-body">{{ wedding.policies.gifts.body }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
