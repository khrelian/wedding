import { ref, onMounted } from 'vue';

export function useEmbers(count = 28) {
    const embers = ref([]);

    onMounted(() => {
        for (let i = 0; i < count; i += 1) {
            const startX = Math.random() * 100;
            const drift = (Math.random() - 0.5) * 18;

            embers.value.push({
                id: i,
                size: `${(Math.random() * 6 + 1).toFixed(1)}px`,
                startX: `${startX.toFixed(1)}vw`,
                endX: `${(startX + drift).toFixed(1)}vw`,
                duration: `${(24 + Math.random() * 16).toFixed(0)}s`,
                delay: `${(Math.random() * 32).toFixed(0)}s`,
                pulseDelay: `${(Math.random() * 2.5).toFixed(1)}s`,
            });
        }
    });

    return { embers };
}
