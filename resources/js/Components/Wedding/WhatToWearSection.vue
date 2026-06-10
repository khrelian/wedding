<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="what-to-wear" class="wedding-section bg-celestial/20">
        <div class="wedding-container">
            <div class="scroll-reveal mx-auto max-w-3xl text-center">
                <p class="wedding-label-gold mb-4">{{ wedding.what_to_wear.subtitle }}</p>
                <h2 class="wedding-heading">{{ wedding.what_to_wear.title }}</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="scroll-reveal mx-auto mt-12 max-w-3xl text-center">
                <p class="font-display text-2xl leading-relaxed text-ivory md:text-3xl md:leading-relaxed">
                    {{ wedding.what_to_wear.intro }}
                </p>
            </div>

            <div class="scroll-reveal mx-auto mt-14 flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <div
                    v-for="color in wedding.what_to_wear.colors"
                    :key="color.name"
                    class="flex flex-col items-center gap-4"
                >
                    <div
                        class="h-16 w-16 rounded-full border border-white/20 shadow-lg md:h-20 md:w-20"
                        :style="{ backgroundColor: color.hex }"
                        :title="color.name"
                    />
                    <span class="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-ivory/50">
                        {{ color.name }}
                    </span>
                </div>
            </div>

            <div class="editorial-grid mx-auto mt-20 max-w-4xl">
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="font-display text-xl text-white">For the Ladies</h3>
                    <ul class="mt-6 space-y-3">
                        <li
                            v-for="item in wedding.dress_code.ladies"
                            :key="item"
                            class="flex items-start gap-3 font-sans text-body-md text-ivory/75"
                        >
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-soft" />
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="font-display text-xl text-white">For the Gentlemen</h3>
                    <ul class="mt-6 space-y-3">
                        <li
                            v-for="item in wedding.dress_code.gentlemen"
                            :key="item"
                            class="flex items-start gap-3 font-sans text-body-md text-ivory/75"
                        >
                            <span class="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-soft" />
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>

            <p class="scroll-reveal mx-auto mt-14 max-w-2xl text-center font-display text-lg italic text-ivory/60">
                {{ wedding.dress_code.note }}
            </p>
        </div>
    </section>
</template>
