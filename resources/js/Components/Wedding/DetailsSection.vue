<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="details" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label-gold mb-4">The Celebration</p>
                <h2 class="wedding-heading">Wedding Details</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mx-auto mt-12 max-w-4xl">
                <article class="scroll-reveal md:col-span-6">
                    <p class="wedding-label mb-4">Ceremony</p>
                    <h3 class="wedding-subheading">{{ wedding.venue.ceremony.name }}</h3>
                    <p class="mt-4 font-display text-lg text-gold-soft/90">{{ wedding.date.ceremony_time }}</p>
                    <p class="mt-2 wedding-meta">{{ wedding.date.display }}</p>
                    <p class="mt-1 wedding-meta">
                        {{ wedding.venue.ceremony.address }}, {{ wedding.venue.ceremony.city }}
                    </p>
                    <p class="mt-4 wedding-meta italic">{{ wedding.venue.ceremony.note }}</p>
                    <a
                        :href="wedding.venue.ceremony.google_maps_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wedding-link mt-8"
                    >
                        View on Google Maps
                    </a>
                </article>

                <article class="scroll-reveal md:col-span-6 md:mt-16">
                    <p class="wedding-label mb-4">Reception</p>
                    <h3 class="wedding-subheading">{{ wedding.venue.reception.name }}</h3>
                    <p class="mt-4 font-display text-lg text-gold-soft/90">{{ wedding.date.reception_time }}</p>
                    <p class="mt-2 wedding-meta">{{ wedding.date.display }}</p>
                    <p class="mt-1 wedding-meta">
                        {{ wedding.venue.reception.address }}, {{ wedding.venue.reception.city }}
                    </p>
                    <p class="mt-4 wedding-meta italic">{{ wedding.venue.reception.note }}</p>
                    <a
                        :href="wedding.venue.reception.google_maps_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wedding-link mt-8"
                    >
                        View on Google Maps
                    </a>
                </article>
            </div>
        </div>
    </section>
</template>
