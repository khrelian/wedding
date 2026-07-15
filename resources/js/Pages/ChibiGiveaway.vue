<script setup>
import { computed } from 'vue';
import { Head, Link, usePage } from '@inertiajs/vue3';
import StarField from '@/Components/Wedding/StarField.vue';

const page = usePage();
const wedding = computed(() => page.props.wedding);
const giveaway = computed(() => wedding.value.giveaways?.chibi ?? {});
</script>

<template>
    <Head :title="`${giveaway.title ?? 'Build Your Own Chibi'} — ${wedding.couple.display_names}`" />

    <div class="chibi-giveaway">
        <StarField />

        <header class="chibi-giveaway-header">
            <div class="chibi-giveaway-header-copy">
                <p class="wedding-label">{{ giveaway.kicker ?? 'Wedding Giveaway' }}</p>
                <h1 class="font-display text-2xl text-white md:text-3xl">
                    {{ giveaway.title ?? 'Build Your Own Chibi' }}
                </h1>
                <p class="mt-1 font-sans text-sm text-ivory/60">
                    {{ giveaway.subtitle ?? 'A little keepsake from our special day' }}
                </p>
            </div>

            <Link href="/" class="chibi-giveaway-back">
                Back
            </Link>
        </header>

        <main class="chibi-giveaway-main">
            <figure class="chibi-giveaway-poster">
                <img
                    :src="giveaway.poster_image ?? '/images/giveaways/chibi-instructions.png'"
                    :alt="giveaway.poster_alt ?? 'Build Your Own Chibi giveaway instructions'"
                    class="chibi-giveaway-image"
                >
            </figure>
        </main>

        <footer class="chibi-giveaway-footer">
            <p class="font-script text-xl text-gold-soft md:text-2xl">
                {{ wedding.couple.display_names }}
            </p>
            <p class="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-ivory/45">
                {{ wedding.date?.display ?? 'July 17, 2026' }}
            </p>
        </footer>
    </div>
</template>

<style scoped>
.chibi-giveaway {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    overflow: hidden;
    background: #05060f;
    color: #f8f5f0;
}

.chibi-giveaway-header {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.25rem 0.5rem;
}

.chibi-giveaway-back {
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.45rem 0.85rem;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(248, 245, 240, 0.8);
    transition: border-color 0.2s ease, color 0.2s ease;
}

.chibi-giveaway-back:hover {
    border-color: rgba(212, 175, 55, 0.55);
    color: #d4af37;
}

.chibi-giveaway-main {
    position: relative;
    z-index: 10;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 0.5rem 1rem 1rem;
}

.chibi-giveaway-poster {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    margin: 0;
}

.chibi-giveaway-image {
    display: block;
    width: 100%;
    height: 100%;
    max-height: calc(100dvh - 8.5rem);
    object-fit: contain;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
}

.chibi-giveaway-footer {
    position: relative;
    z-index: 10;
    flex-shrink: 0;
    padding: 0.75rem 1.25rem max(1rem, env(safe-area-inset-bottom));
    text-align: center;
}

@media (min-width: 768px) {
    .chibi-giveaway-header {
        padding: 1.25rem 2rem 0.75rem;
    }

    .chibi-giveaway-main {
        padding: 0.75rem 2rem 1.25rem;
    }

    .chibi-giveaway-image {
        max-height: calc(100dvh - 9rem);
    }
}

@media (orientation: landscape) and (max-height: 520px) {
    .chibi-giveaway-header,
    .chibi-giveaway-footer {
        display: none;
    }

    .chibi-giveaway-main {
        padding: 0.5rem;
    }

    .chibi-giveaway-image {
        max-height: calc(100dvh - 1rem);
        border: none;
        box-shadow: none;
    }
}
</style>
