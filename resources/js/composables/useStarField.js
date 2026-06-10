import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useStarField(count = 120) {
    const stars = ref([]);
    const constellations = ref([]);
    const parallaxOffset = ref(0);

    let onScroll = null;

    onMounted(() => {
        for (let i = 0; i < count; i++) {
            stars.value.push({
                id: i,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: Math.random() * 2 + 0.5,
                delay: Math.random() * 4,
                duration: Math.random() * 3 + 3,
                opacity: Math.random() * 0.5 + 0.3,
            });
        }

        const numLines = Math.min(35, Math.floor(count / 3));
        for (let i = 0; i < numLines; i++) {
            const star1 = stars.value[Math.floor(Math.random() * stars.value.length)];
            const star2 = stars.value[Math.floor(Math.random() * stars.value.length)];
            const distance = Math.hypot(star2.left - star1.left, star2.top - star1.top);

            if (distance < 18 && distance > 4) {
                constellations.value.push({
                    x1: star1.left,
                    y1: star1.top,
                    x2: star2.left,
                    y2: star2.top,
                });
            }
        }

        onScroll = () => {
            parallaxOffset.value = window.scrollY * 0.15;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    });

    onBeforeUnmount(() => {
        if (onScroll) {
            window.removeEventListener('scroll', onScroll);
        }
    });

    return { stars, constellations, parallaxOffset };
}
