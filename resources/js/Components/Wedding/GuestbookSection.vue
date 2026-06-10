<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="guestbook" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">Well Wishes</p>
                <h2 class="wedding-heading">{{ wedding.guestbook.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.guestbook.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mx-auto mt-12 grid max-w-4xl gap-12 md:grid-cols-2">
                <blockquote
                    v-for="(entry, index) in wedding.guestbook.entries"
                    :key="index"
                    class="scroll-reveal"
                >
                    <p class="wedding-quote">
                        "{{ entry.message }}"
                    </p>
                    <footer class="mt-6 wedding-meta uppercase tracking-[0.18em] text-gold-soft/65">
                        — {{ entry.name }}
                    </footer>
                </blockquote>
            </div>

            <div class="scroll-reveal wedding-callout mt-12">
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
