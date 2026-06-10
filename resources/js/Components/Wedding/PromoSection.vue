<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section
        v-if="wedding.features.promo"
        class="wedding-section"
    >
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label mb-4">For Couples</p>
                <h2 class="wedding-heading">{{ wedding.promo.title }}</h2>
                <p class="mt-4 wedding-body">{{ wedding.promo.body }}</p>

                <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
                    <a :href="'tel:' + wedding.promo.phone" class="wedding-button-primary">
                        {{ wedding.promo.phone_display }}
                    </a>
                    <a :href="'mailto:' + wedding.promo.email" class="wedding-button-secondary">
                        {{ wedding.promo.email }}
                    </a>
                    <a
                        :href="wedding.promo.messenger_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="wedding-button-secondary"
                    >
                        {{ wedding.promo.messenger_label }}
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>
