<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="schedule" class="wedding-section bg-celestial/20">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label mb-4">The Day</p>
                <h2 class="wedding-heading">Schedule</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mx-auto mt-8 max-w-3xl">
                <div
                    v-for="(item, index) in wedding.schedule"
                    :key="item.title"
                    class="scroll-reveal grid gap-4 border-b border-white/10 py-8 md:grid-cols-[140px_1fr]"
                >
                    <p class="font-display text-2xl text-gold-soft">{{ item.time }}</p>
                    <div>
                        <h3 class="font-display text-xl text-white">{{ item.title }}</h3>
                        <p class="mt-2 wedding-body">{{ item.description }}</p>
                    </div>
                    <div
                        v-if="index < wedding.schedule.length - 1"
                        class="hidden md:col-span-2"
                    />
                </div>
            </div>
        </div>
    </section>
</template>
