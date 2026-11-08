<script setup>
import { Head } from '@inertiajs/vue3';
import WeddingSite from './WeddingSite.vue';

defineProps({
    invitee: Object,
});
</script>

<template>
    <Head :title="`${invitee.name}, You're Invited to Joboy & Mimi’s 25th Anniversary`" />
    <WeddingSite :invitee="invitee" />
</template>
