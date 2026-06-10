<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="schedule" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">The Day</p>
                <h2 class="wedding-heading">Schedule</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="mx-auto mt-8 max-w-3xl">
                <div
                    v-for="item in wedding.schedule"
                    :key="item.title"
                    class="scroll-reveal wedding-row"
                >
                    <p class="wedding-row-time">{{ item.time }}</p>
                    <div>
                        <h3 class="wedding-subheading !text-lg">{{ item.title }}</h3>
                        <p class="mt-2 wedding-body">{{ item.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
