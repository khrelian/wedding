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
                        Please join us as we celebrate 25 years of love, partnership, and cherished memories.
                        Kindly confirm your attendance by {{ wedding.rsvp.deadline_display }} so we can make the necessary arrangements.
                    </p>
                    <p
                        v-if="wedding.rsvp.deadline"
                        class="scroll-reveal mt-6 wedding-meta uppercase tracking-[0.18em] text-gold-soft/70"
                    >
                        RSVP by {{ wedding.rsvp.deadline_display }}
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
                            Kindly confirm by {{ wedding.rsvp.deadline_display }}. Use our general RSVP form to share your details and let us know if you can join us.
                        </p>
                        <a href="/generic-invitation" class="wedding-button-primary mt-10 inline-flex w-full md:w-auto">
                            Open RSVP Form
                        </a>
                    </template>
                    <div class="mt-8 space-y-3 wedding-meta">
                        <p>RSVP Contacts</p>
                        <p v-for="contact in wedding.rsvp.contacts" :key="contact.name">
                            {{ contact.name }} ·
                            <a :href="'tel:' + contact.phone" class="text-gold-soft transition-colors hover:text-white">
                                {{ contact.phone }}
                            </a>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>
