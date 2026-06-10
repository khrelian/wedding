<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="travel" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">Plan Your Visit</p>
                <h2 class="wedding-heading">{{ wedding.travel.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.travel.subtitle }}</p>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mx-auto mt-12 max-w-5xl">
                <article
                    v-for="section in wedding.travel.sections"
                    :key="section.title"
                    class="scroll-reveal md:col-span-4"
                >
                    <h3 class="wedding-subheading !text-lg">{{ section.title }}</h3>
                    <p class="mt-4 wedding-body">{{ section.body }}</p>
                </article>
            </div>
        </div>
    </section>
</template>
