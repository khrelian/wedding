<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <footer class="border-t border-white/10 bg-midnight px-6 py-16">
        <div class="wedding-container text-center">
            <p class="font-display text-3xl italic text-gold-soft md:text-4xl">{{ wedding.tagline }}</p>
            <p class="mt-4 wedding-script-names text-white">
                {{ wedding.couple.display_names }}
            </p>
            <p class="mt-2 font-sans text-sm uppercase tracking-[0.2em] text-ivory/40">
                {{ wedding.date.display }}
            </p>

            <div class="mx-auto my-10 h-px w-24 bg-gradient-to-r from-transparent via-gold-soft/40 to-transparent" />

            <p class="font-sans text-sm text-ivory/40">
                Made with care for our special day
            </p>
            <p class="mt-4 font-sans text-xs text-ivory/30">
                <a :href="'mailto:' + wedding.contact.email" class="transition-colors hover:text-gold-soft">
                    {{ wedding.contact.email }}
                </a>
            </p>
        </div>
    </footer>
</template>
