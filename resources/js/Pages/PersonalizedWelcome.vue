<script setup>
import { Head } from '@inertiajs/vue3';
import WeddingSite from './WeddingSite.vue';

defineProps({
    invitee: Object,
});
</script>

<template>
    <Head :title="`${invitee.name}, You're Invited — 25th Anniversary Celebration`" />
    <WeddingSite :invitee="invitee" />
</template>
