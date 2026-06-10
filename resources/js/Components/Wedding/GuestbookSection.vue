<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="guestbook" class="wedding-section bg-midnight">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label mb-4">Well Wishes</p>
                <h2 class="wedding-heading">{{ wedding.guestbook.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.guestbook.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mx-auto mt-8 grid max-w-4xl gap-8 md:grid-cols-2">
                <blockquote
                    v-for="(entry, index) in wedding.guestbook.entries"
                    :key="index"
                    class="scroll-reveal border border-white/10 p-8"
                >
                    <p class="font-display text-xl italic text-ivory/80 md:text-2xl">
                        "{{ entry.message }}"
                    </p>
                    <footer class="mt-6 font-sans text-sm uppercase tracking-[0.15em] text-gold-soft/70">
                        — {{ entry.name }}
                    </footer>
                </blockquote>
            </div>

            <div class="scroll-reveal mx-auto mt-12 max-w-2xl text-center">
                <p class="wedding-body">{{ wedding.guestbook.note }}</p>
                <a
                    v-if="wedding.contact.email"
                    :href="'mailto:' + wedding.contact.email + '?subject=Guestbook%20Message'"
                    class="wedding-button-secondary mt-8 inline-flex"
                >
                    Send a Message
                </a>
            </div>
        </div>
    </section>
</template>
