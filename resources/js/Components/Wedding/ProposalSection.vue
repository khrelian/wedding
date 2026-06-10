<script setup>
import WeddingImage from '@/Components/Wedding/WeddingImage.vue';

defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="proposal" class="wedding-section bg-celestial/30">
        <div class="wedding-container">
            <div class="editorial-grid items-center">
                <div class="md:col-span-6">
                    <div class="scroll-reveal relative aspect-[5/6] overflow-hidden border border-white/10">
                        <WeddingImage
                            :src="wedding.proposal.image"
                            :alt="wedding.proposal.image_alt"
                        >
                            <template #fallback>
                                <div class="absolute inset-0 flex items-center justify-center p-10 text-center">
                                    <div>
                                        <svg class="mx-auto h-16 w-16 text-gold-soft/80" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z" />
                                        </svg>
                                        <p class="mt-8 font-display text-3xl italic text-gold-soft md:text-4xl">
                                            {{ wedding.proposal.subtitle }}
                                        </p>
                                    </div>
                                </div>
                            </template>
                        </WeddingImage>
                    </div>
                </div>

                <div class="md:col-span-6">
                    <p class="scroll-reveal wedding-label-gold mb-4">Chapter Two</p>
                    <h2 class="scroll-reveal wedding-heading">{{ wedding.proposal.title }}</h2>
                    <div class="scroll-reveal wedding-divider !mx-0" />
                    <div class="space-y-6">
                        <p
                            v-for="(paragraph, index) in wedding.proposal.paragraphs"
                            :key="index"
                            class="scroll-reveal wedding-body"
                        >
                            {{ paragraph }}
                        </p>
                    </div>
                    <blockquote class="scroll-reveal mt-10 border-l border-gold-soft/40 pl-6">
                        <p class="font-display text-2xl italic text-white md:text-3xl">
                            "{{ wedding.proposal.quote }}"
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    </section>
</template>
