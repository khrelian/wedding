<script setup>
import { Head } from '@inertiajs/vue3';
import WeddingSite from './WeddingSite.vue';

defineProps({
    invitee: Object,
});
</script>

<template>
    <Head :title="`${invitee.name}, You're Invited — Written In The Stars`" />
    <WeddingSite :invitee="invitee" />
</template>
