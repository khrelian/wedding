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
                    <div class="mt-6 flex items-center gap-4">
                        <div
                            class="wedding-swatch"
                            style="background-color: #BCAF92"
                            title="Khaki"
                        />
                        <span class="font-sans text-xs uppercase tracking-[0.24em] text-ivory/55">
                            Khaki
                        </span>
                    </div>
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

            <div class="mx-auto mt-24 max-w-5xl border-t border-white/20 pt-16">
                <div class="scroll-reveal wedding-section-intro">
                    <p class="wedding-label-gold mb-4">For the Wedding Entourage</p>
                    <h3 class="wedding-heading">{{ wedding.entourage_wardrobe.title }}</h3>
                    <p class="mx-auto mt-6 max-w-2xl text-center wedding-quote text-ivory/75">
                        {{ wedding.entourage_wardrobe.intro }}
                    </p>
                </div>

                <div class="editorial-grid mx-auto mt-14 max-w-4xl">
                    <div class="scroll-reveal md:col-span-6">
                        <div class="mb-6 flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full border border-white/40 bg-[#d9dce2] shadow-[inset_0_1px_5px_rgba(255,255,255,0.75),0_5px_15px_rgba(0,0,0,0.16)]" title="Silver" />
                            <h4 class="wedding-subheading !text-lg">Ladies</h4>
                        </div>
                        <ul class="space-y-3">
                            <li v-for="item in wedding.entourage_wardrobe.ladies" :key="item" class="wedding-body !text-body-md">
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                    <div class="scroll-reveal md:col-span-6">
                        <div class="mb-6 flex items-center gap-4">
                            <div class="h-12 w-12 rounded-full border border-white/25 bg-black shadow-[inset_0_1px_5px_rgba(255,255,255,0.14),0_5px_15px_rgba(0,0,0,0.2)]" title="Black" />
                            <h4 class="wedding-subheading !text-lg">Gentlemen</h4>
                        </div>
                        <ul class="space-y-3">
                            <li v-for="item in wedding.entourage_wardrobe.gentlemen" :key="item" class="wedding-body !text-body-md">
                                {{ item }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
