<script setup>
defineProps({
    wedding: Object,
});
</script>

<template>
    <section id="entourage" class="wedding-section">
        <div class="wedding-container">
            <div class="scroll-reveal wedding-section-intro">
                <p class="wedding-label-gold mb-4">{{ wedding.entourage.subtitle }}</p>
                <h2 class="wedding-heading">{{ wedding.entourage.title }}</h2>
            </div>

            <div class="scroll-reveal wedding-divider" />

            <div class="editorial-grid mx-auto mt-16 max-w-4xl">
                <div
                    v-for="side in ['groom', 'bride']"
                    :key="side"
                    class="scroll-reveal md:col-span-6"
                    :class="side === 'bride' ? 'md:mt-12' : ''"
                >
                    <h3 class="text-center font-sans text-label text-gold-soft/70">
                        {{ wedding.entourage.parents[side].label }}
                    </h3>
                    <ul class="mt-6 space-y-3 text-center">
                        <li
                            v-for="member in wedding.entourage.parents[side].members"
                            :key="member.name"
                            class="wedding-entourage-name"
                        >
                            <span v-if="member.memorial" class="text-gold-soft/70">† </span>{{ member.name }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="scroll-reveal mx-auto mt-24 max-w-5xl">
                <h3 class="text-center font-sans text-label text-gold-soft/70">
                    Principal Sponsors
                </h3>
                <div class="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                    <div
                        v-for="(pair, index) in wedding.entourage.principal_sponsors"
                        :key="index"
                        class="grid grid-cols-2 gap-4 py-3 text-center sm:text-left"
                    >
                        <p class="wedding-entourage-name">{{ pair.left }}</p>
                        <p class="wedding-entourage-name">{{ pair.right }}</p>
                    </div>
                </div>
            </div>

            <div class="editorial-grid mx-auto mt-24 max-w-5xl">
                <div
                    v-for="side in ['bride', 'groom']"
                    :key="'party-' + side"
                    class="scroll-reveal md:col-span-6"
                >
                    <h3 class="text-center font-sans text-label text-gold-soft/70 md:text-left">
                        {{ wedding.entourage.wedding_party[side].label }}
                    </h3>
                    <div
                        v-for="group in wedding.entourage.wedding_party[side].groups"
                        :key="group.role"
                        class="mt-8"
                    >
                        <p class="text-center font-display text-base italic text-gold-soft/85 md:text-left">
                            {{ group.role }}
                        </p>
                        <ul class="mt-3 space-y-2 text-center md:text-left">
                            <li
                                v-for="name in group.names"
                                :key="name"
                                class="wedding-entourage-name"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="scroll-reveal mx-auto mt-24 max-w-5xl">
                <h3 class="text-center font-sans text-label text-gold-soft/70">
                    Secondary Sponsors
                </h3>
                <div class="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="group in wedding.entourage.secondary_sponsors"
                        :key="group.role"
                        class="text-center"
                    >
                        <p class="font-display text-base italic text-gold-soft/85">
                            {{ group.role }}
                        </p>
                        <ul class="mt-3 space-y-2">
                            <li
                                v-for="name in group.names"
                                :key="name"
                                class="wedding-entourage-name"
                            >
                                {{ name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
