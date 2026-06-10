<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="travel" class="wedding-section bg-celestial/20">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label mb-4">Plan Your Visit</p>
                <h2 class="wedding-heading">{{ wedding.travel.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.travel.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mt-8">
                <article
                    v-for="(section, index) in wedding.travel.sections"
                    :key="section.title"
                    class="scroll-reveal md:col-span-4"
                >
                    <p class="font-sans text-label text-gold-soft/60">0{{ index + 1 }}</p>
                    <h3 class="mt-4 font-display text-2xl text-white">{{ section.title }}</h3>
                    <p class="mt-4 wedding-body">{{ section.body }}</p>
                </article>
            </div>
        </div>
    </section>
</template>
