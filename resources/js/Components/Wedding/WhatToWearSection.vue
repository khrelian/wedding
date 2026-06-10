<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="what-to-wear" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label-gold mb-4">{{ wedding.what_to_wear.subtitle }}</p>
                <h2 class="wedding-heading">{{ wedding.what_to_wear.title }}</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="scroll-reveal mx-auto mt-12 max-w-3xl text-center">
                <p class="wedding-quote text-ivory/85">
                    {{ wedding.what_to_wear.intro }}
                </p>
            </div>

            <div class="scroll-reveal mx-auto mt-14 flex flex-wrap items-center justify-center gap-10 md:gap-14">
                <div
                    v-for="color in wedding.what_to_wear.colors"
                    :key="color.name"
                    class="flex flex-col items-center gap-3"
                >
                    <div
                        class="wedding-swatch"
                        :style="{ backgroundColor: color.hex }"
                        :title="color.name"
                    />
                    <span class="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-ivory/45">
                        {{ color.name }}
                    </span>
                </div>
            </div>

            <div class="editorial-grid mx-auto mt-20 max-w-4xl">
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="wedding-subheading !text-lg">For the Ladies</h3>
                    <ul class="mt-6 space-y-4">
                        <li
                            v-for="item in wedding.dress_code.ladies"
                            :key="item"
                            class="wedding-body !text-body-md"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
                <div class="scroll-reveal md:col-span-6">
                    <h3 class="wedding-subheading !text-lg">For the Gentlemen</h3>
                    <ul class="mt-6 space-y-4">
                        <li
                            v-for="item in wedding.dress_code.gentlemen"
                            :key="item"
                            class="wedding-body !text-body-md"
                        >
                            {{ item }}
                        </li>
                    </ul>
                </div>
            </div>

            <p class="scroll-reveal mx-auto mt-14 max-w-2xl text-center wedding-meta italic">
                {{ wedding.dress_code.note }}
            </p>
        </div>
    </section>
</template>
