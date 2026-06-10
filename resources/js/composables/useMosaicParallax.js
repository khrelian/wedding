import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useMosaicParallax() {
    const scrollY = ref(0);
    const viewportHeight = ref(900);
    const reducedMotion = ref(false);

    let onScroll = null;
    let onResize = null;

    onMounted(() => {
        reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollY.value = window.scrollY;
        viewportHeight.value = window.innerHeight;

        onScroll = () => {
            scrollY.value = window.scrollY;
        };

        onResize = () => {
            viewportHeight.value = window.innerHeight;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });
    });

    onBeforeUnmount(() => {
        if (onScroll) {
            window.removeEventListener('scroll', onScroll);
        }

        if (onResize) {
            window.removeEventListener('resize', onResize);
        }
    });

    return { scrollY, viewportHeight, reducedMotion };
};
