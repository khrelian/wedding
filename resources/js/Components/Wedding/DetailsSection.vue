<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="details" class="wedding-section bg-midnight">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label-gold mb-4">The Celebration</p>
                <h2 class="wedding-heading">Wedding Details</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mt-8">
                <article class="scroll-reveal md:col-span-6">
                    <p class="wedding-label mb-3">Ceremony</p>
                    <h3 class="font-display text-3xl text-white">{{ wedding.venue.ceremony.name }}</h3>
                    <p class="mt-4 font-display text-xl text-gold-soft">{{ wedding.date.ceremony_time }}</p>
                    <p class="mt-2 font-sans text-body-md text-ivory/70">{{ wedding.date.display }}</p>
                    <p class="mt-1 font-sans text-sm text-ivory/50">
                        {{ wedding.venue.ceremony.address }}, {{ wedding.venue.ceremony.city }}
                    </p>
                    <p class="mt-4 font-sans text-sm italic text-ivory/40">{{ wedding.venue.ceremony.note }}</p>
                    <a
                        :href="wedding.venue.ceremony.google_maps_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wedding-link mt-8"
                    >
                        View on Google Maps
                    </a>
                </article>

                <article class="scroll-reveal md:col-span-6 md:mt-24">
                    <p class="wedding-label mb-3">Reception</p>
                    <h3 class="font-display text-3xl text-white">{{ wedding.venue.reception.name }}</h3>
                    <p class="mt-4 font-display text-xl text-gold-soft">{{ wedding.date.reception_time }}</p>
                    <p class="mt-2 font-sans text-body-md text-ivory/70">{{ wedding.date.display }}</p>
                    <p class="mt-2 font-sans text-sm text-ivory/50">
                        {{ wedding.venue.reception.address }}, {{ wedding.venue.reception.city }}
                    </p>
                    <p class="mt-4 font-sans text-sm italic text-ivory/40">{{ wedding.venue.reception.note }}</p>
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
