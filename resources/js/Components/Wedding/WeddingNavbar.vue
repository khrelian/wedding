<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const gateDismissed = ref(false);
const onGateDismissed = () => { gateDismissed.value = true; };

onMounted(() => window.addEventListener('silver-gate-dismissed', onGateDismissed));
onBeforeUnmount(() => window.removeEventListener('silver-gate-dismissed', onGateDismissed));
</script>

<template>
    <nav v-if="gateDismissed" class="silver-bottom-nav" aria-label="Invitation sections">
        <a href="#home">Home</a>
        <a href="#details">Location</a>
        <a href="#rsvp">RSVP</a>
    </nav>
</template>
