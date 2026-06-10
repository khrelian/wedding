<script setup>
import WeddingImage from '@/Components/Wedding/WeddingImage.vue';

defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="proposal" class="wedding-section">
        <div class="wedding-container">
            <div class="editorial-grid items-center">
                <div class="md:col-span-6">
                    <div class="scroll-reveal wedding-image-frame aspect-[5/6]">
                        <WeddingImage
                            :src="wedding.proposal.image"
                            :alt="wedding.proposal.image_alt"
                        >
                            <template #fallback>
                                <div class="absolute inset-0 flex items-center justify-center p-10 text-center">
                                    <div>
                                        <p class="wedding-quote text-gold-soft/90">
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
                    <blockquote class="scroll-reveal mt-10">
                        <p class="wedding-quote text-white">
                            "{{ wedding.proposal.quote }}"
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    </section>
</template>
