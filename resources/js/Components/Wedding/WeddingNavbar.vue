<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    wedding: Object,
    invitee: {
        type: Object,
        default: null,
    },
});

const isScrolled = ref(false);
const isMenuOpen = ref(false);

const hasHeroBackground = computed(() => Boolean(props.wedding?.images?.hero?.background));

const onScroll = () => {
    isScrolled.value = window.scrollY > 40;
};

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
    <header
        class="fixed inset-x-0 top-0 z-50 transition-all duration-luxury"
        :class="[
            isScrolled
                ? 'border-b border-ivory/10 bg-midnight/90 py-4 backdrop-blur-md'
                : hasHeroBackground
                    ? 'bg-gradient-to-b from-midnight/80 via-midnight/40 to-transparent py-5 md:py-7'
                    : 'bg-transparent py-6 md:py-8',
        ]"
    >
        <div class="wedding-container flex items-center justify-between">
            <a
                href="#"
                class="font-display text-2xl italic text-gold-soft md:text-3xl"
                :class="{ 'hero-text-shadow': hasHeroBackground && !isScrolled }"
            >
                {{ wedding.tagline }}
            </a>

            <button
                type="button"
                class="rounded-full border border-white/10 bg-midnight/40 p-2 text-ivory backdrop-blur-md md:hidden"
                aria-label="Toggle menu"
                @click="isMenuOpen = !isMenuOpen"
            >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            </button>

            <nav
                class="hidden items-center gap-6 lg:gap-8 md:flex"
                aria-label="Primary"
            >
                <a
                    v-for="item in wedding.navigation"
                    :key="item.href"
                    :href="item.href"
                    :class="hasHeroBackground && !isScrolled ? 'hero-nav-link' : 'font-sans text-xs uppercase tracking-[0.18em] text-ivory/60 transition-colors duration-luxury hover:text-gold-soft'"
                >
                    {{ item.label }}
                </a>
                <a
                    v-if="invitee?.rsvp_url"
                    :href="invitee.rsvp_url"
                    class="hero-pill-primary min-w-0 px-5 py-2 text-[0.62rem]"
                >
                    RSVP
                </a>
            </nav>
        </div>

        <nav
            v-if="isMenuOpen"
            class="border-t border-ivory/10 bg-midnight/95 px-6 py-6 backdrop-blur-md md:hidden"
        >
            <div class="flex flex-col gap-4">
                <a
                    v-for="item in wedding.navigation"
                    :key="item.href + '-mobile'"
                    :href="item.href"
                    class="font-sans text-sm uppercase tracking-[0.15em] text-ivory/80"
                    @click="isMenuOpen = false"
                >
                    {{ item.label }}
                </a>
                <a
                    v-if="invitee?.rsvp_url"
                    :href="invitee.rsvp_url"
                    class="hero-pill-primary mt-2 w-full"
                    @click="isMenuOpen = false"
                >
                    RSVP
                </a>
            </div>
        </nav>
    </header>
</template>
