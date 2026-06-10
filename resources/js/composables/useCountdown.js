import { ref, computed, onMounted, onBeforeUnmount, toValue } from 'vue';

export function useCountdown(targetDate) {
    const now = ref(Date.now());
    let interval = null;

    onMounted(() => {
        interval = setInterval(() => {
            now.value = Date.now();
        }, 1000);
    });

    onBeforeUnmount(() => {
        clearInterval(interval);
    });

    const remaining = computed(() => {
        const target = new Date(toValue(targetDate)).getTime();
        const diff = Math.max(0, target - now.value);

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isPast: diff === 0,
        };
    });

    return { remaining };
}
