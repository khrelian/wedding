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
    <Head title="Ian Jay & Karen Kate — Written In The Stars" />
    <WeddingSite />
</template>
