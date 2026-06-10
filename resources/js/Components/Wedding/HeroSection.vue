<script setup>
import { computed } from 'vue';
import { useCountdown } from '@/composables/useCountdown';

const props = defineProps({
    wedding: Object,
    invitee: {
        type: Object,
        default: null,
    },
});

const ceremonyTarget = computed(() => {
    const ceremony = props.wedding?.date?.ceremony;
    if (!ceremony) {
        return '2026-07-17T14:00:00+08:00';
    }

    return `${ceremony.replace(' ', 'T')}+08:00`;
});

const ceremonyMeta = computed(() => {
    const date = new Date(ceremonyTarget.value);

    return {
        month: date.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Manila' }).toUpperCase(),
        day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'Asia/Manila' }),
        year: date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'Asia/Manila' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }).toUpperCase(),
    };
});

const heroKicker = computed(() => {
    if (props.invitee) {
        return `Dear ${props.invitee.name}`;
    }

    return props.wedding?.couple?.hero_headline || "We're Getting Married!";
});

const { remaining } = useCountdown(ceremonyTarget);

const units = [
    { label: 'Days', key: 'days' },
    { label: 'Hours', key: 'hours' },
    { label: 'Minutes', key: 'minutes' },
    { label: 'Seconds', key: 'seconds' },
];

const hasBackground = (wedding) => Boolean(wedding?.images?.hero?.background);

const padCountdown = (value) => String(value).padStart(2, '0');
</script>

<template>
    <section class="hero-minimal relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 pb-24 md:pt-32">
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
            <div class="absolute inset-0 bg-midnight/20" />
            <div class="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/25 to-midnight/85" />
            <div class="absolute inset-0 hero-scrim hero-scrim-soft" />
        </div>

        <div class="relative z-10 mx-auto w-full max-w-xl text-center">
            <p class="scroll-reveal hero-minimal-kicker hero-text-shadow">
                {{ heroKicker }}
            </p>

            <h1 class="scroll-reveal mt-10 hero-text-shadow">
                <span class="hero-minimal-name">{{ wedding.couple.partner1.name }}</span>
                <span class="hero-minimal-amp">&</span>
                <span class="hero-minimal-name">{{ wedding.couple.partner2.name }}</span>
            </h1>

            <p class="scroll-reveal hero-minimal-tagline mt-8 hero-text-shadow">
                {{ wedding.tagline }}
            </p>

            <div class="scroll-reveal hero-minimal-details mt-12 hero-text-shadow">
                <div class="hero-minimal-date">
                    <p class="hero-minimal-date-month">{{ ceremonyMeta.month }}</p>
                    <p class="hero-minimal-date-day">{{ ceremonyMeta.day }}</p>
                    <p class="hero-minimal-date-year">{{ ceremonyMeta.year }}</p>
                </div>

                <div class="hero-minimal-rule" aria-hidden="true" />

                <div class="hero-minimal-venue">
                    <p class="hero-minimal-weekday">{{ ceremonyMeta.weekday }}</p>
                    <p class="hero-minimal-time">{{ wedding.date.ceremony_time }}</p>
                    <p class="hero-minimal-venue-name">{{ wedding.venue.ceremony.name }}</p>
                    <p class="hero-minimal-city">{{ wedding.venue.ceremony.city }}</p>
                </div>
            </div>

            <p
                v-if="invitee && invitee.party_size > 1"
                class="scroll-reveal mt-8 font-sans text-sm text-ivory/70 hero-text-shadow"
            >
                You and {{ invitee.party_size - 1 }}
                {{ invitee.party_size === 2 ? 'guest' : 'guests' }} are invited
            </p>

            <div
                v-if="wedding.features.countdown"
                class="scroll-reveal hero-minimal-countdown mt-12 hero-text-shadow"
            >
                <div
                    v-for="unit in units"
                    :key="unit.key"
                    class="hero-minimal-countdown-unit"
                >
                    <span class="hero-minimal-countdown-value">{{ padCountdown(remaining[unit.key]) }}</span>
                    <span class="hero-minimal-countdown-label">{{ unit.label }}</span>
                </div>
            </div>

            <div class="scroll-reveal mt-12 flex flex-wrap items-center justify-center gap-3">
                <a href="#story" class="hero-pill-outline">
                    Our Story
                </a>
                <a
                    v-if="invitee?.rsvp_url"
                    :href="invitee.rsvp_url"
                    class="hero-pill-primary"
                >
                    RSVP
                </a>
                <a
                    v-else
                    href="#rsvp"
                    class="hero-pill-primary"
                >
                    RSVP
                </a>
                <a href="#details" class="hero-pill-outline">
                    Event Details
                </a>
            </div>
        </div>

        <a
            href="#story"
            class="hero-scroll-hint"
            aria-label="Scroll to story"
        >
            <svg class="h-4 w-4 animate-float-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
            </svg>
        </a>
    </section>
</template>
