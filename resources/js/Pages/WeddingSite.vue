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
