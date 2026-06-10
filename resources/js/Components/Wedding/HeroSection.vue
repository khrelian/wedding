<script setup>
import { ref, computed } from 'vue';
import { useCountdown } from '@/composables/useCountdown';

const props = defineProps({
    wedding: Object,
    invitee: {
        type: Object,
        default: null,
    },
});

const ornamentError = ref(false);
const ceremonyTarget = computed(() => {
    const ceremony = props.wedding?.date?.ceremony;
    if (!ceremony) {
        return '2026-07-17T14:00:00+08:00';
    }

    return `${ceremony.replace(' ', 'T')}+08:00`;
});
const { remaining } = useCountdown(ceremonyTarget);

const units = [
    { label: 'Days', key: 'days' },
    { label: 'Hours', key: 'hours' },
    { label: 'Minutes', key: 'minutes' },
    { label: 'Seconds', key: 'seconds' },
];

const hasBackground = (wedding) => Boolean(wedding?.images?.hero?.background);
</script>

<template>
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 pb-20 md:pt-32">
        <div
            v-if="hasBackground(wedding)"
            class="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
        >
            <img
                :src="wedding.images.hero.background"
                :alt="wedding.images.hero.background_alt || 'Hero background'"
                class="h-full w-full scale-105 object-cover object-[center_22%] md:object-[center_28%]"
            >
            <div class="absolute inset-0 bg-midnight/25" />
            <div class="absolute inset-0 bg-gradient-to-b from-midnight/90 via-midnight/35 to-midnight" />
            <div class="absolute inset-0 bg-gradient-to-r from-midnight/50 via-transparent to-midnight/50" />
            <div class="absolute inset-0 hero-scrim" />
        </div>

        <div class="wedding-container relative z-10">
            <div class="mx-auto max-w-4xl text-center">
                <p
                    v-if="invitee"
                    class="scroll-reveal wedding-label mb-10 hero-text-shadow"
                >
                    Dear {{ invitee.name }}
                </p>
                <p
                    v-else
                    class="scroll-reveal wedding-label mb-10 hero-text-shadow"
                >
                    {{ wedding.couple.hero_headline }}
                </p>

                <div
                    v-if="wedding.images?.hero?.ornament && !ornamentError"
                    class="scroll-reveal mx-auto mb-8 flex justify-center"
                >
                    <img
                        :src="wedding.images.hero.ornament"
                        :alt="wedding.images.hero.ornament_alt || 'Hero ornament'"
                        class="h-auto w-28 object-contain opacity-95 drop-shadow-lg md:w-36"
                        @error="ornamentError = true"
                    >
                </div>

                <h1 class="scroll-reveal wedding-couple-names hero-text-shadow">
                    {{ wedding.couple.partner1.name }}
                    <span class="mx-2">&</span>
                    {{ wedding.couple.partner2.name }}
                </h1>

                <p class="scroll-reveal wedding-save-the-date mx-auto mt-10 max-w-md hero-text-shadow">
                    {{ wedding.tagline }}
                </p>

                <p class="scroll-reveal mt-10 font-display text-2xl text-ivory md:text-3xl hero-text-shadow">
                    {{ wedding.date.display }}
                </p>
                <p class="scroll-reveal mt-5 max-w-xl mx-auto font-sans text-label text-ivory/75 hero-text-shadow">
                    {{ wedding.venue.ceremony.name }} · {{ wedding.venue.ceremony.city }}
                </p>

                <p
                    v-if="invitee && invitee.party_size > 1"
                    class="scroll-reveal mt-6 font-sans text-body-md text-ivory/85 hero-text-shadow"
                >
                    You and {{ invitee.party_size - 1 }}
                    {{ invitee.party_size === 2 ? 'guest' : 'guests' }} are invited
                </p>

                <div
                    v-if="wedding.features.countdown"
                    class="scroll-reveal mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
                >
                    <div
                        v-for="unit in units"
                        :key="unit.key"
                        class="hero-countdown-cell"
                    >
                        <p class="font-display text-3xl tabular-nums text-gold-soft md:text-4xl hero-text-shadow">
                            {{ String(remaining[unit.key]).padStart(2, '0') }}
                        </p>
                        <p class="mt-2 font-sans text-label-sm text-ivory/55">
                            {{ unit.label }}
                        </p>
                    </div>
                </div>

                <div class="scroll-reveal mt-12 flex flex-wrap items-center justify-center gap-4">
                    <a href="#story" class="hero-button-solid">Our Story</a>
                    <a
                        v-if="invitee?.rsvp_url"
                        :href="invitee.rsvp_url"
                        class="hero-button-solid border-gold-soft bg-gold-soft/15 text-white"
                    >
                        RSVP Now
                    </a>
                    <a v-else href="#details" class="hero-button-ghost">Event Details</a>
                </div>
            </div>
        </div>

        <a
            href="#story"
            class="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded-full border border-white/10 bg-midnight/40 px-4 py-3 text-ivory/60 backdrop-blur-md transition-all duration-luxury hover:border-gold-soft/40 hover:text-gold-soft"
            aria-label="Scroll to story"
        >
            <span class="font-sans text-label-sm">Scroll</span>
            <svg class="h-4 w-4 animate-float-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
            </svg>
        </a>
    </section>
</template>
