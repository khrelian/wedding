<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useCountdown } from '@/composables/useCountdown';

const props = defineProps({
    wedding: Object,
    invitee: { type: Object, default: null },
});

const gateOpened = ref(false);
const gateDismissed = ref(false);
const musicAudio = ref(null);
const musicIsPlaying = ref(false);
let gateTimer;
let orientationEnabled = false;

const setShinePosition = (x, y) => {
    const root = document.documentElement;
    root.style.setProperty('--silver-shine-x', `${Math.min(92, Math.max(8, x))}%`);
    root.style.setProperty('--silver-shine-y', `${Math.min(92, Math.max(8, y))}%`);
};

const handleDeviceOrientation = (event) => {
    if (event.gamma === null || event.beta === null) return;

    const horizontalTilt = Math.min(45, Math.max(-45, event.gamma));
    const verticalTilt = Math.min(45, Math.max(-45, event.beta - 90));
    setShinePosition(50 + horizontalTilt * 0.9, 50 + verticalTilt * 0.9);
};

const handlePointerMove = (event) => {
    if (orientationEnabled || event.pointerType !== 'mouse') return;

    setShinePosition(
        (event.clientX / window.innerWidth) * 100,
        (event.clientY / window.innerHeight) * 100,
    );
};

const enableTiltShine = async () => {
    if (!('DeviceOrientationEvent' in window)) return;

    try {
        const requestPermission = window.DeviceOrientationEvent.requestPermission;
        if (typeof requestPermission === 'function') {
            const permission = await requestPermission();
            if (permission !== 'granted') return;
        }

        orientationEnabled = true;
        window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    } catch {
        // Keep the static silver finish if motion access is unavailable.
    }
};

const startMusic = () => {
    musicAudio.value?.play().catch(() => {});
};

const toggleMusic = () => {
    if (!musicAudio.value) return;

    if (musicIsPlaying.value) {
        musicAudio.value.pause();
        return;
    }

    musicAudio.value.play().catch(() => {});
};

const openGate = () => {
    if (gateOpened.value) return;
    gateOpened.value = true;
    enableTiltShine();
    startMusic();
    gateTimer = window.setTimeout(() => {
        gateDismissed.value = true;
        window.dispatchEvent(new Event('silver-gate-dismissed'));
    }, 1900);
};

onMounted(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
});

onBeforeUnmount(() => {
    window.clearTimeout(gateTimer);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    document.documentElement.style.removeProperty('--silver-shine-x');
    document.documentElement.style.removeProperty('--silver-shine-y');
    musicAudio.value?.pause();
});

const ceremonyTarget = computed(() => {
    const ceremony = props.wedding?.date?.ceremony;
    return ceremony ? `${ceremony.replace(' ', 'T')}+08:00` : '2026-07-17T14:00:00+08:00';
});
const ceremonyMeta = computed(() => {
    const date = new Date(ceremonyTarget.value);
    return {
        month: date.toLocaleDateString('en-US', { month: 'long', timeZone: 'Asia/Manila' }),
        day: date.toLocaleDateString('en-US', { day: 'numeric', timeZone: 'Asia/Manila' }),
        year: date.toLocaleDateString('en-US', { year: 'numeric', timeZone: 'Asia/Manila' }),
        weekday: date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Manila' }),
    };
});
const heroKicker = computed(() => props.invitee ? `Dear ${props.invitee.name}` : 'Together with their families');
const { remaining } = useCountdown(ceremonyTarget);
const units = [
    { label: 'Days', key: 'days' }, { label: 'Hours', key: 'hours' },
    { label: 'Minutes', key: 'minutes' }, { label: 'Seconds', key: 'seconds' },
];
const padCountdown = (value) => String(value).padStart(2, '0');
</script>

<template>
    <section id="home" class="hero-minimal silver-hero relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 pb-24 md:pt-32">
        <audio
            ref="musicAudio"
            src="/audio/umagang-kay-ganda.mp3"
            loop
            preload="none"
            @play="musicIsPlaying = true"
            @pause="musicIsPlaying = false"
        />
        <div class="silver-hero-paper" aria-hidden="true" />

        <div class="invitation-content relative z-10 mx-auto w-full max-w-xl text-center">
            <img class="invitation-frame-art" src="/images/hero/ornate-double-line-vintage-frame.png" alt="" aria-hidden="true" draggable="false">
            <p class="scroll-reveal hero-minimal-kicker">{{ heroKicker }}</p>
            <h1 class="scroll-reveal mt-6">
                <span class="hero-minimal-name">{{ wedding.couple.partner1.name }}</span>
                <span class="hero-minimal-amp">&</span>
                <span class="hero-minimal-name">{{ wedding.couple.partner2.name }}</span>
            </h1>
            <p class="scroll-reveal hero-minimal-tagline mt-6">joyfully invite you to celebrate their 25 years of marriage</p>

            <div class="scroll-reveal hero-minimal-details mt-9">
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

            <p v-if="invitee && invitee.party_size > 1" class="scroll-reveal mt-8 font-sans text-sm text-ivory/70">
                You and {{ invitee.party_size - 1 }} {{ invitee.party_size === 2 ? 'guest' : 'guests' }} are invited
            </p>

            <div v-if="wedding.features.countdown" class="scroll-reveal hero-minimal-countdown mt-10">
                <div v-for="unit in units" :key="unit.key" class="hero-minimal-countdown-unit">
                    <span class="hero-minimal-countdown-value">{{ padCountdown(remaining[unit.key]) }}</span>
                    <span class="hero-minimal-countdown-label">{{ unit.label }}</span>
                </div>
            </div>

        </div>

        <Transition name="gate-veil">
            <div v-if="!gateDismissed" class="gate-veil" :class="{ 'is-open': gateOpened }">
                <div class="gate-paper-card" aria-hidden="true">
                    <span class="gate-card-kicker">You are cordially invited</span>
                    <span class="gate-card-names">{{ wedding.couple.partner1.name }} <i>&</i> {{ wedding.couple.partner2.name }}</span>
                    <span class="gate-card-rule" />
                    <span class="gate-card-date">{{ wedding.date.display }}</span>
                    <span class="gate-card-city">{{ wedding.venue.ceremony.city }}</span>
                </div>

                <div class="iron-gate" aria-hidden="true">
                    <div class="gate-leaf gate-leaf-left">
                        <img src="/images/hero/silvery-metallic-gate-with-swirls.png" alt="" draggable="false">
                    </div>
                    <div class="gate-leaf gate-leaf-right">
                        <img src="/images/hero/silvery-metallic-gate-with-swirls.png" alt="" draggable="false">
                    </div>
                </div>

                <button type="button" class="gate-open-button" :disabled="gateOpened" @click="openGate">
                    <span>{{ gateOpened ? 'Welcome' : 'Tap to open' }}</span>
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
                </button>
                <span class="gate-instruction">An invitation awaits</span>
            </div>
        </Transition>

        <a href="#details" class="hero-scroll-hint" aria-label="Scroll to wedding details">
            <svg class="h-4 w-4 animate-float-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
            </svg>
        </a>

        <button
            v-if="gateDismissed"
            type="button"
            class="music-toggle"
            :aria-label="musicIsPlaying ? 'Pause invitation music' : 'Play invitation music'"
            :title="musicIsPlaying ? 'Pause music' : 'Play music'"
            @click="toggleMusic"
        >
            <svg v-if="musicIsPlaying" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 6v12M16 6v12" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m9 6 10 6-10 6V6Z" />
            </svg>
        </button>
    </section>
</template>
