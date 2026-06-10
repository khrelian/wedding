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
    <section id="rsvp" class="wedding-section">
        <div class="wedding-container">
            <div class="editorial-grid items-start">
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
                        class="scroll-reveal mt-6 wedding-meta uppercase tracking-[0.18em] text-gold-soft/70"
                    >
                        Kindly respond by {{ wedding.rsvp.deadline }}
                    </p>
                </div>

                <div class="scroll-reveal wedding-panel md:col-span-6">
                    <template v-if="invitee?.rsvp_url">
                        <p class="wedding-subheading">
                            Hello, {{ invitee.name }}
                        </p>
                        <p
                            v-if="invitee.party_size > 1"
                            class="mt-3 wedding-meta"
                        >
                            Your invitation is for {{ invitee.party_size }} guests
                        </p>
                        <a :href="invitee.rsvp_url" class="wedding-button-primary mt-10 inline-flex w-full md:w-auto">
                            Submit Your RSVP
                        </a>
                    </template>
                    <template v-else>
                        <p class="wedding-body">
                            RSVP is available through your personalized invitation link.
                        </p>
                        <p class="mt-6 wedding-meta">
                            Questions? Contact
                            <a :href="'mailto:' + wedding.contact.email" class="text-gold-soft transition-colors hover:text-white">
                                {{ wedding.contact.email }}
                            </a>
                        </p>
                    </template>
                </div>
            </div>

            <div class="editorial-grid mx-auto mt-24 max-w-5xl">
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="wedding-subheading !text-lg">{{ wedding.policies.adults_only.title }}</h3>
                    <p class="mt-4 wedding-body">{{ wedding.policies.adults_only.body }}</p>
                </div>
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="wedding-subheading !text-lg">{{ wedding.policies.gifts.title }}</h3>
                    <p class="mt-4 wedding-body">{{ wedding.policies.gifts.lead }}</p>
                    <p class="mt-4 wedding-body">{{ wedding.policies.gifts.body }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
