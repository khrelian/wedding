<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <footer class="border-t border-ivory/10 px-6 py-20">
        <div class="wedding-container text-center">
            <p class="font-display text-2xl italic text-gold-soft/90 md:text-3xl">{{ wedding.tagline }}</p>
            <p class="mt-6 wedding-script-names text-white">
                {{ wedding.couple.display_names }}
            </p>
            <p class="mt-3 wedding-meta uppercase tracking-[0.2em]">
                {{ wedding.date.display }}
            </p>

            <div class="wedding-divider" />

            <p class="wedding-meta">
                Made with care for our special day
            </p>
            <p class="mt-4 wedding-meta">
                <a :href="'mailto:' + wedding.contact.email" class="transition-colors hover:text-gold-soft">
                    {{ wedding.contact.email }}
                </a>
            </p>
        </div>
    </footer>
</template>
