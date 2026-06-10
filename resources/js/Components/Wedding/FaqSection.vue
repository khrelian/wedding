<script setup>
import { ref } from 'vue';

defineProps({
    wedding: Object,
});

const openIndex = ref(0);
</script>

<template>
    <section id="faq" class="wedding-section bg-midnight">
        <div class="wedding-container">
            <div class="editorial-grid">
                <div class="md:col-span-5">
                    <p class="scroll-reveal wedding-label mb-4">Questions</p>
                    <h2 class="scroll-reveal wedding-heading">FAQ</h2>
                    <p class="scroll-reveal mt-6 wedding-body">
                        Everything you need to know for a seamless celebration beneath the stars.
                    </p>
                </div>

                <div class="md:col-span-7">
                    <div
                        v-for="(item, index) in wedding.faq"
                        :key="item.question"
                        class="faq-item scroll-reveal py-6"
                    >
                        <button
                            type="button"
                            class="flex w-full items-start justify-between gap-6 text-left"
                            @click="openIndex = openIndex === index ? -1 : index"
                        >
                            <span class="font-display text-xl text-white md:text-2xl">{{ item.question }}</span>
                            <span class="font-sans text-gold-soft">{{ openIndex === index ? '−' : '+' }}</span>
                        </button>
                        <p
                            v-show="openIndex === index"
                            class="mt-4 wedding-body"
                        >
                            {{ item.answer }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
