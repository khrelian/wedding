<script setup>
import { Head } from '@inertiajs/vue3';
import WeddingSite from './WeddingSite.vue';

defineProps({
    canLogin: Boolean,
    canRegister: Boolean,
    laravelVersion: String,
    phpVersion: String,
});
</script>

<template>
    <Head title="Joboy & Mimi — 25th Anniversary Celebration" />
    <WeddingSite />
</template>
