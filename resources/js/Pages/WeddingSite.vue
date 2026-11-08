<script setup>
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';
import { useScrollReveal } from '@/composables/useScrollReveal';
import EmberField from '@/Components/Wedding/EmberField.vue';
import PhotoMosaicBackground from '@/Components/Wedding/PhotoMosaicBackground.vue';
import WeddingNavbar from '@/Components/Wedding/WeddingNavbar.vue';
import HeroSection from '@/Components/Wedding/HeroSection.vue';
import DetailsSection from '@/Components/Wedding/DetailsSection.vue';
import WhatToWearSection from '@/Components/Wedding/WhatToWearSection.vue';
import RsvpSection from '@/Components/Wedding/RsvpSection.vue';
import GuestbookSection from '@/Components/Wedding/GuestbookSection.vue';
import TravelSection from '@/Components/Wedding/TravelSection.vue';
import PromoSection from '@/Components/Wedding/PromoSection.vue';
import WeddingFooter from '@/Components/Wedding/WeddingFooter.vue';

const props = defineProps({
    invitee: {
        type: Object,
        default: null,
    },
});

const page = usePage();
const wedding = computed(() => page.props.wedding);

const showMosaicBackground = computed(
    () => Boolean(wedding.value.gallery?.background_mosaic && wedding.value.gallery?.images?.length),
);

const showEmbers = computed(() => Boolean(wedding.value.features?.embers));

useScrollReveal();
</script>

<template>
    <div
        class="relative min-h-screen overflow-x-hidden bg-midnight text-ivory"
        :class="{ 'site-with-mosaic': showMosaicBackground, 'silver-wedding': true }"
    >
        <EmberField v-if="showEmbers" />
        <PhotoMosaicBackground
            v-if="showMosaicBackground"
            :images="wedding.gallery.images"
        />
        <WeddingNavbar />

        <main class="relative z-10">
            <HeroSection :wedding="wedding" :invitee="invitee" />
            <section class="wedding-section anniversary-memory-section" aria-labelledby="anniversary-memory-title">
                <div class="wedding-container">
                    <div class="anniversary-memory-layout">
                        <figure class="anniversary-memory-photo scroll-reveal">
                            <img
                                src="/images/anniversary-couple.jpeg"
                                alt="Joboy and Mimi sharing a walk together"
                                loading="lazy"
                                decoding="async"
                            >
                            <figcaption>Joboy &amp; Mimi · 25 years together</figcaption>
                        </figure>

                        <div class="anniversary-memory-quote scroll-reveal">
                            <p class="anniversary-memory-kicker">A love that keeps growing</p>
                            <span class="anniversary-memory-years" aria-hidden="true">25</span>
                            <h2 id="anniversary-memory-title" class="anniversary-memory-heading">Still side by side</h2>
                            <blockquote>
                                After twenty-five years, the sweetest part of the journey is still walking it together.
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>
            <DetailsSection :wedding="wedding" />
            <WhatToWearSection :wedding="wedding" />
            <RsvpSection :wedding="wedding" :invitee="invitee" />
            <GuestbookSection v-if="wedding.features.guestbook" :wedding="wedding" />
            <TravelSection :wedding="wedding" />
            <PromoSection :wedding="wedding" />
        </main>

        <WeddingFooter :wedding="wedding" class="relative z-10" />
    </div>
</template>
