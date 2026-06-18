<script setup>
defineProps({
    color: {
        type: String,
        default: '#FFFFFF',
    },
});
</script>

<template>
    <svg
        class="elegant-frame-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <g
            fill="none"
            stroke="rgba(0, 0, 0, 0.7)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
            stroke-linecap="square"
        >
            <path d="M 15 5.5 H 85" />
            <path d="M 15 94.5 H 85" />
            <path d="M 5.5 15 V 41" />
            <path d="M 5.5 59 V 85" />
            <path d="M 94.5 15 V 41" />
            <path d="M 94.5 59 V 85" />
        </g>
        <g
            fill="none"
            :stroke="color"
            stroke-width="0.5"
            vector-effect="non-scaling-stroke"
            stroke-linecap="square"
        >
            <path d="M 15 5.5 H 85" />
            <path d="M 15 94.5 H 85" />
            <path d="M 5.5 15 V 41" />
            <path d="M 5.5 59 V 85" />
            <path d="M 94.5 15 V 41" />
            <path d="M 94.5 59 V 85" />
        </g>
        <text
            x="5.5"
            y="50.8"
            text-anchor="middle"
            font-size="4.2"
            :fill="color"
            stroke="rgba(0,0,0,0.65)"
            stroke-width="0.35"
            paint-order="stroke fill"
        >
            ♥
        </text>
        <text
            x="94.5"
            y="50.8"
            text-anchor="middle"
            font-size="4.2"
            :fill="color"
            stroke="rgba(0,0,0,0.65)"
            stroke-width="0.35"
            paint-order="stroke fill"
        >
            ♥
        </text>
    </svg>
</template>

<style scoped>
.elegant-frame-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
