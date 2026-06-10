<script setup>
import WeddingImage from '@/Components/Wedding/WeddingImage.vue';

defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="story" class="wedding-section bg-midnight">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label-gold mb-4">Chapter One</p>
                <h2 class="wedding-heading">{{ wedding.story.title }}</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mt-16 items-start">
                <div class="md:col-span-5">
                    <div class="relative aspect-[4/5] overflow-hidden border border-white/10">
                        <WeddingImage
                            :src="wedding.story.image"
                            :alt="wedding.story.image_alt"
                        >
                            <template #fallback>
                                <div class="flex h-full flex-col justify-end p-8">
                                    <p class="font-display text-3xl text-gold-soft">{{ wedding.couple.partner1.name }}</p>
                                    <p class="mt-2 font-sans text-label text-ivory/40">&</p>
                                    <p class="mt-2 font-display text-3xl text-gold-soft">{{ wedding.couple.partner2.name }}</p>
                                </div>
                            </template>
                            <template v-if="wedding.story.image_alt" #caption>
                                <div class="bg-gradient-to-t from-midnight/95 via-midnight/60 to-transparent px-8 pb-8 pt-20">
                                    <p class="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-gold-soft/70">
                                        Our Story
                                    </p>
                                    <p class="mt-2 font-display text-xl text-white md:text-2xl">
                                        {{ wedding.story.image_alt }}
                                    </p>
                                </div>
                            </template>
                        </WeddingImage>
                    </div>
                </div>

                <div class="md:col-span-7">
                    <div class="wedding-prose space-y-8">
                        <p
                            v-for="(paragraph, index) in wedding.story.paragraphs"
                            :key="index"
                            class="wedding-body"
                        >
                            {{ paragraph }}
                        </p>
                        <p class="font-display text-2xl text-white md:text-3xl">
                            {{ wedding.story.closing }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-24">
                <p class="scroll-reveal wedding-label mb-10 text-center">Constellation Timeline</p>
                <div class="relative mx-auto max-w-4xl">
                    <div class="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-soft/30 to-transparent md:block" />
                    <div
                        v-for="(item, index) in wedding.timeline"
                        :key="item.title"
                        class="scroll-reveal relative mb-16 grid gap-6 md:grid-cols-2 md:gap-16"
                        :class="index % 2 === 0 ? '' : 'md:[&>div:first-child]:order-2'"
                    >
                        <div class="md:text-right" :class="index % 2 === 0 ? 'md:pr-12' : 'md:pl-12 md:text-left'">
                            <p class="font-display text-2xl italic text-gold-soft">{{ item.year }}</p>
                            <h3 class="mt-2 font-display text-2xl text-white">{{ item.title }}</h3>
                        </div>
                        <div :class="index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'">
                            <p class="wedding-body">{{ item.description }}</p>
                        </div>
                        <div class="absolute left-1/2 top-2 hidden h-3 w-3 -translate-x-1/2 rounded-full border border-gold-soft bg-midnight md:block" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
