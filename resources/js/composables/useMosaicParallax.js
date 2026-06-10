import { ref, onMounted, onBeforeUnmount } from 'vue';

const SCROLL_EASE = 0.08;

export function useMosaicParallax() {
    const scrollY = ref(0);
    const viewportHeight = ref(900);
    const reducedMotion = ref(false);

    let targetScrollY = 0;
    let animationFrame = null;
    let onScroll = null;
    let onResize = null;

    const animateScroll = () => {
        const delta = targetScrollY - scrollY.value;

        if (Math.abs(delta) < 0.35) {
            scrollY.value = targetScrollY;
        } else {
            scrollY.value += delta * SCROLL_EASE;
        }

        animationFrame = requestAnimationFrame(animateScroll);
    };

    onMounted(() => {
        reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetScrollY = window.scrollY;
        scrollY.value = window.scrollY;
        viewportHeight.value = window.innerHeight;

        onScroll = () => {
            targetScrollY = window.scrollY;

            if (reducedMotion.value) {
                scrollY.value = targetScrollY;
            }
        };

        onResize = () => {
            viewportHeight.value = window.innerHeight;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        if (!reducedMotion.value) {
            animationFrame = requestAnimationFrame(animateScroll);
        }
    });

    onBeforeUnmount(() => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        if (onScroll) {
            window.removeEventListener('scroll', onScroll);
        }

        if (onResize) {
            window.removeEventListener('resize', onResize);
        }
    });

    return { scrollY, viewportHeight, reducedMotion };
};
