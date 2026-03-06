<script setup>
import { Head, Link } from "@inertiajs/vue3";
import { ref, onMounted, onBeforeUnmount } from "vue";

const stars = ref([]);
const constellations = ref([]);
const observedSections = ref(new Set());

onMounted(() => {
    // Generate random stars
    for (let i = 0; i < 100; i++) {
        stars.value.push({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 3,
            duration: Math.random() * 2 + 2,
        });
    }

    // Generate constellation lines connecting some stars
    const numConstellations = 90;
    for (let i = 0; i < numConstellations; i++) {
        const star1 =
            stars.value[Math.floor(Math.random() * stars.value.length)];
        const star2 =
            stars.value[Math.floor(Math.random() * stars.value.length)];

        // Only connect stars that are reasonably close
        const distance = Math.sqrt(
            Math.pow(star2.left - star1.left, 2) +
                Math.pow(star2.top - star1.top, 2),
        );

        if (distance < 25 && distance > 5) {
            constellations.value.push({
                x1: star1.left,
                y1: star1.top,
                x2: star2.left,
                y2: star2.top,
                delay: Math.random() * 2,
            });
        }
    }

    // Setup Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
                observedSections.value.add(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll(".scroll-animate");
    sections.forEach((section) => observer.observe(section));

    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Cleanup function
    return () => {
        sections.forEach((section) => observer.unobserve(section));
    };
});

onBeforeUnmount(() => {
    observedSections.value.clear();
});
</script>

<template>
    <Head title="Welcome to Our Wedding - Elegant Starry Night" />

    <div
        class="relative"
    >
        <!-- Hero Section -->
        <div
            class="flex items-center justify-center min-h-screen px-8 sm:px-12 md:px-16 lg:px-20 pt-16 md:pt-20 relative z-10 scroll-animate bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
        >
            <!-- Animated Stars Background -->
            <div class="stars-container absolute inset-0 overflow-hidden">
                <div
                    v-for="star in stars"
                    :key="star.id"
                    class="star absolute rounded-full bg-amber-200"
                    :style="{
                        left: star.left + '%',
                        top: star.top + '%',
                        width: star.size + 'px',
                        height: star.size + 'px',
                        animationDelay: star.delay + 's',
                        animationDuration: star.duration + 's',
                    }"
                ></div>
            </div>

            <!-- Constellation Lines -->
            <svg
                class="constellation-lines absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    v-for="(line, index) in constellations"
                    :key="'line-' + index"
                    :x1="line.x1 + '%'"
                    :y1="line.y1 + '%'"
                    :x2="line.x2 + '%'"
                    :y2="line.y2 + '%'"
                    class="constellation-line"
                    :style="{ animationDelay: line.delay + 's' }"
                />
            </svg>

            <!-- Shooting Stars -->
            <div
                class="shooting-stars absolute inset-0 pointer-events-none overflow-hidden"
            >
                <div class="shooting-star" style="bottom: 10%; left: 10%"></div>
                <div
                    class="shooting-star"
                    style="animation-delay: 4s; bottom: 30%; left: 20%"
                ></div>
                <div
                    class="shooting-star"
                    style="animation-delay: 8s; bottom: 50%; left: 5%"
                ></div>
            </div>
            <div
                class="text-center max-w-6xl mx-auto w-full relative hero-content-frame flex flex-col justify-center"
            >
                <!-- Decorative Corner Borders (frame around hero content) -->
                <div class="corner-border-wrapper">
                    <div class="corner-border corner-border-left"></div>
                    <div class="corner-border corner-border-right"></div>
                </div>
                <!-- Hero Ornament (crescent moon & cranes) -->
                <div class="flex justify-center mb-8 hero-stars">
                    <img
                        src="/images/hero-ornament.png"
                        alt=""
                        class="w-40 h-auto md:w-52 max-w-[280px] object-contain"
                    />
                </div>
                <!-- Main Content -->
                <div class="px-4 sm:px-8 md:px-12 hero-title">
                    <h1
                        class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent mb-8 drop-shadow-lg tracking-wider leading-relaxed"
                        style="
                            padding-left: 0.5rem;
                            padding-right: 0.5rem;
                            -webkit-box-decoration-break: clone;
                            box-decoration-break: clone;
                        "
                    >
                        We're Getting Married!
                    </h1>
                </div>

                <div
                    class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-50 mb-8 font-script font-normal tracking-wide drop-shadow-lg hero-names"
                >
                    <p class="mb-2">Ian Jay & Karen Kate</p>
                </div>

                <!-- Wedding Date -->
                <div
                    class="inline-block bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 px-8 py-6 mb-12 hero-date max-w-sm mx-auto w-full"
                >
                    <p
                        class="text-amber-300 text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2 font-sans font-light"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                            />
                        </svg>
                        Save the Date
                        <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                            />
                        </svg>
                    </p>
                    <p
                        class="text-3xl md:text-4xl font-display font-semibold text-amber-100 mb-2"
                    >
                        July 17, 2026
                    </p>
                    <p class="text-amber-200/80 font-elegant text-lg">
                        Saint Joseph Cathedral
                    </p>
                    <p
                        class="text-amber-300/60 text-sm mt-1 font-sans italic font-light"
                    >
                        Under the Starry Sky
                    </p>
                </div>

                <!-- Quick Links -->
                <div
                    class="flex flex-wrap justify-center items-center gap-4 mt-12 hero-cta"
                >
                    <Link
                        :href="route('dashboard')"
                        class="inline-flex items-center px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-full font-sans font-semibold tracking-wide hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transform hover:-translate-y-0.5 border border-amber-400"
                    >
                        RSVP Now
                    </Link>
                    <a
                        href="#story"
                        class="inline-flex items-center px-8 py-3 bg-slate-800/50 backdrop-blur-md text-amber-100 rounded-full font-sans font-medium tracking-wide hover:bg-slate-700/50 transition shadow-lg border border-amber-400/30 hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Our Story
                    </a>
                    <a
                        href="#details"
                        class="inline-flex items-center px-8 py-3 bg-slate-800/50 backdrop-blur-md text-amber-100 rounded-full font-sans font-medium tracking-wide hover:bg-slate-700/50 transition shadow-lg border border-amber-400/30 hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Event Details
                    </a>
                </div>
            </div>
        </div>

        <!-- Our Story Section -->
        <div
            id="story"
            class="py-20 px-6 bg-gradient-to-b from-indigo-900 to-slate-900 relative scroll-animate"
        >
            <div class="max-w-4xl mx-auto relative z-10">
                <h2
                    class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 mb-12 drop-shadow-lg tracking-tight section-title"
                >
                    Our Love Story
                </h2>
                <div
                    class="prose prose-lg prose-invert mx-auto text-center section-content"
                >
                    <div
                        class="bg-gradient-to-br from-slate-800/50 to-blue-900/40 backdrop-blur-md rounded-lg p-8 md:p-12 border border-amber-300/30 shadow-2xl relative overflow-hidden"
                    >
                        <!-- Walking silhouettes -->
                        <div class="story-characters pointer-events-none">
                            <div class="story-character-wrap story-character-left">
                                <div class="story-character-gradient story-character-gradient-left" aria-hidden="true"></div>
                                <img src="/images/story-man.png" alt="Groom walking" class="story-character" />
                            </div>
                            <div class="story-character-wrap story-character-right">
                                <div class="story-character-gradient story-character-gradient-right" aria-hidden="true"></div>
                                <img src="/images/story-woman.png" alt="Bride walking" class="story-character" />
                            </div>
                        </div>
                        <div class="relative z-10">
                        <p
                            class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light"
                        >
                            Like celestial bodies guided by an invisible force,
                            we were drawn to each other across the vast expanse
                            of life. We weren't searching, yet somehow we found
                            exactly what our hearts needed.
                        </p>

                        <div class="flex justify-center my-6">
                            <svg
                                class="w-8 h-8 text-amber-300 animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                        </div>

                        <p
                            class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light"
                        >
                            It was as if the universe had been quietly aligning
                            stars, preparing constellations, and weaving fate's
                            delicate threads long before our paths crossed. The
                            moment we met, it felt less like a beginning and
                            more like a recognition— as though our souls had
                            always known each other, waiting patiently for this
                            lifetime to reunite.
                        </p>

                        <p
                            class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light"
                        >
                            In a world of endless searching, we discovered each
                            other effortlessly. No grand plans, no deliberate
                            pursuit—just two hearts guided by something greater,
                            drawn together like stars destined to share the same
                            sky.
                        </p>

                        <div class="flex justify-center my-8">
                            <svg
                                class="w-6 h-6 text-amber-300 mx-2 animate-pulse"
                                style="animation-delay: 0.2s"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                            <svg
                                class="w-8 h-8 text-amber-200 mx-2 animate-pulse"
                                style="animation-delay: 0.4s"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                            <svg
                                class="w-6 h-6 text-amber-300 mx-2 animate-pulse"
                                style="animation-delay: 0.6s"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                        </div>

                        <p
                            class="text-amber-100 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light italic"
                        >
                            What we have is rare and precious—a love that found
                            us when we least expected it, proving that the most
                            beautiful things in life aren't found by searching,
                            but by being open to the magic that surrounds us.
                        </p>

                        <p
                            class="text-amber-200 text-xl md:text-2xl font-display font-medium mt-8 mb-8"
                        >
                            Now, under the same stars that brought us together,
                            we begin our forever.
                        </p>

                        <div
                            class="flex justify-center items-center gap-3 mt-10 text-amber-100"
                        >
                            <span
                                class="text-2xl md:text-3xl font-display font-medium"
                                >Ian Jay</span
                            >
                            <svg
                                class="w-6 h-6 md:w-7 md:h-7 text-amber-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                            <span
                                class="text-lg md:text-xl font-elegant font-light"
                                >and</span
                            >
                            <svg
                                class="w-6 h-6 md:w-7 md:h-7 text-amber-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                            <span
                                class="text-2xl md:text-3xl font-display font-medium"
                                >Karen Kate</span
                            >
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Details Section -->
        <div
            id="details"
            class="py-20 px-6 bg-gradient-to-b from-slate-900 to-indigo-950 relative scroll-animate"
        >
            <div class="max-w-6xl mx-auto relative z-10">
                <h2
                    class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 mb-16 drop-shadow-lg tracking-tight section-title"
                >
                    Event Details
                </h2>

                <div class="grid md:grid-cols-2 gap-8 mb-12 section-content">
                    <!-- Ceremony -->
                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-blue-900/60 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-8 text-center hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-amber-400/20 event-card"
                    >
                        <div class="text-amber-400 mb-4">
                            <svg
                                class="w-12 h-12 mx-auto"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                />
                            </svg>
                        </div>
                        <h3
                            class="text-2xl md:text-3xl font-display font-semibold text-amber-100 mb-4"
                        >
                            Ceremony
                        </h3>
                        <p
                            class="text-amber-200/80 mb-2 text-xl font-elegant font-medium"
                        >
                            7:00 AM
                        </p>
                        <p class="text-amber-200/80 mb-1 font-sans">
                            July 17, 2026
                        </p>
                        <p
                            class="text-amber-200/80 mb-2 text-lg font-elegant font-medium"
                        >
                            Saint Joseph Cathedral
                        </p>
                        <p
                            class="text-amber-300/60 text-sm font-sans italic mb-4"
                        >
                            Morning ceremony under the stars
                        </p>
                        <a
                            href="https://maps.google.com/?q=Butuan+City+Cathedral"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-full text-sm font-sans transition border border-amber-400/40 hover:border-amber-400/60"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            View on Google Maps
                        </a>
                    </div>

                    <!-- Reception -->
                    <div
                        class="bg-gradient-to-br from-slate-800/80 to-violet-900/60 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-8 text-center hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-amber-400/20 event-card"
                    >
                        <div class="text-amber-400 mb-4">
                            <svg
                                class="w-12 h-12 mx-auto"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
                            </svg>
                        </div>
                        <h3
                            class="text-2xl md:text-3xl font-display font-semibold text-amber-100 mb-4"
                        >
                            Reception
                        </h3>
                        <p class="text-amber-200/80 mb-2 font-sans">
                            July 17, 2026
                        </p>
                        <p
                            class="text-amber-200/80 mb-2 text-lg font-elegant font-medium"
                        >
                            Butuan Watergate
                        </p>
                        <p
                            class="text-amber-300/60 text-sm font-sans italic mb-4"
                        >
                            Breakfast reception following the ceremony
                        </p>
                        <a
                            href="https://maps.google.com/?q=Butuan+Watergate"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-full text-sm font-sans transition border border-amber-400/40 hover:border-amber-400/60"
                        >
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            View on Google Maps
                        </a>
                    </div>
                </div>

                <!-- Dress Code Section -->
                <div class="mt-16 section-content">
                    <div
                        class="bg-gradient-to-br from-amber-900/30 to-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl border border-amber-300/40 p-8 md:p-12 max-w-4xl mx-auto"
                    >
                        <div class="text-center mb-8">
                            <div class="flex justify-center mb-4">
                                <svg
                                    class="w-10 h-10 text-amber-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3
                                class="text-3xl md:text-4xl font-display font-semibold text-amber-200 mb-4"
                            >
                                Dress Code
                            </h3>
                            <p
                                class="text-2xl md:text-3xl font-elegant font-medium text-amber-100 mb-2"
                            >
                                Formal Attire
                            </p>
                            <p
                                class="text-lg text-amber-200/80 font-elegant italic"
                            >
                                Elegant Starry Night Inspired
                            </p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-8 mt-8">
                            <!-- For Ladies -->
                            <div class="text-center">
                                <div class="flex justify-center mb-3">
                                    <svg
                                        class="w-8 h-8 text-amber-300"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                        />
                                    </svg>
                                </div>
                                <h4
                                    class="text-xl font-semibold text-amber-100 mb-3"
                                >
                                    For the Ladies
                                </h4>
                                <ul class="space-y-2 text-amber-50">
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span
                                            >Long gowns or cocktail
                                            dresses</span
                                        >
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span>Evening colors preferred</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span
                                            >Navy, midnight blue, gold,
                                            silver</span
                                        >
                                    </li>
                                </ul>
                            </div>

                            <!-- For Gentlemen -->
                            <div class="text-center">
                                <div class="flex justify-center mb-3">
                                    <svg
                                        class="w-8 h-8 text-amber-300"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                        />
                                    </svg>
                                </div>
                                <h4
                                    class="text-xl font-semibold text-amber-100 mb-3"
                                >
                                    For the Gentlemen
                                </h4>
                                <ul class="space-y-2 text-amber-50">
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span
                                            >Barong Tagalog or suit & tie</span
                                        >
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span>Dark suits recommended</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg
                                            class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                                            />
                                        </svg>
                                        <span>Navy, black, or charcoal</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div
                            class="mt-8 pt-8 border-t border-amber-300/20 text-center"
                        >
                            <p
                                class="text-amber-100/80 text-sm md:text-base italic"
                            >
                                Think elegant evening wear with celestial
                                touches—shimmer, sparkle, and shine like the
                                stars! ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Promotional Section -->
        <div class="py-16 px-6 bg-gradient-to-b from-slate-950 to-indigo-950 border-t border-amber-400/20">
            <div class="max-w-2xl mx-auto text-center">
                <div class="flex justify-center mb-4">
                    <svg class="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z" />
                    </svg>
                </div>
                <h2 class="text-2xl md:text-3xl font-display font-semibold text-amber-200 mb-3 tracking-tight">
                    Want a Wedding Website Like This?
                </h2>
                <p class="text-amber-100/70 font-elegant text-lg mb-8">
                    We'd love to help you create a personalized wedding website for your special day.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
                    <a
                        href="tel:09617982617"
                        class="flex items-center gap-3 px-6 py-3 bg-slate-800/60 border border-amber-400/30 rounded-full text-amber-100 hover:border-amber-400/70 hover:bg-slate-700/60 transition-all duration-200"
                    >
                        <svg class="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.26.2 2.47.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"/>
                        </svg>
                        <span class="font-sans text-sm tracking-wide whitespace-nowrap">0961 798 2617</span>
                    </a>
                    <a
                        href="mailto:mr.ianjaybronola@gmail.com"
                        class="flex items-center gap-3 px-6 py-3 bg-slate-800/60 border border-amber-400/30 rounded-full text-amber-100 hover:border-amber-400/70 hover:bg-slate-700/60 transition-all duration-200"
                    >
                        <svg class="w-5 h-5 text-amber-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span class="font-sans text-sm tracking-wide">mr.ianjaybronola@gmail.com</span>
                    </a>
                    <a
                        href="https://m.me/karenkate.buendiaserona"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-3 px-6 py-3 bg-slate-800/60 border border-amber-400/30 rounded-full text-amber-100 hover:border-amber-400/70 hover:bg-slate-700/60 transition-all duration-200"
                    >
                        <svg class="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.444 5.503 3.705 7.205V22l3.38-1.857A10.7 10.7 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.007 12.435l-2.547-2.715-4.97 2.715 5.467-5.802 2.61 2.715 4.908-2.715-5.468 5.802z"/>
                        </svg>
                        <span class="font-sans text-sm tracking-wide whitespace-nowrap">Karenkate Buendia Seronay</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer
            class="bg-slate-950 py-8 px-6 text-center text-amber-200/60 border-t border-amber-400/20"
        >
            <p class="text-sm flex items-center justify-center gap-2">
                Made with
                <svg
                    class="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"
                    />
                </svg>
                for our special day
            </p>
        </footer>
    </div>
</template>

<style scoped>
/* Smooth scroll for the entire page */
html {
    scroll-behavior: smooth;
}

/* Star animations */
.star {
    animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.3;
        transform: scale(0.8);
    }
}

.animate-twinkle {
    animation: twinkle 3s ease-in-out infinite;
}

/* Constellation Lines */
.constellation-line {
    stroke: rgba(212, 165, 116, 0.3);
    stroke-width: 1;
    opacity: 0;
    animation: fadeInLine 3s ease-out forwards;
}

@keyframes fadeInLine {
    from {
        opacity: 0;
        stroke-dasharray: 200;
        stroke-dashoffset: 200;
    }
    to {
        opacity: 1;
        stroke-dasharray: 200;
        stroke-dashoffset: 0;
    }
}

/* Crescent Moon */
.moon {
    filter: drop-shadow(0 0 20px rgba(212, 165, 116, 0.5));
    animation: floatMoon 6s ease-in-out infinite;
}

@keyframes floatMoon {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

/* Hero content frame (border wraps this area) */
.hero-content-frame {
    padding: 3rem 2rem 0;
}

/* Decorative Corner Border */
.corner-border-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 30;
}

.corner-border {
    position: absolute;
    top: 0;
    width: 250px;
    height: 250px;
}

/* Left Corner Border */
.corner-border-left {
    left: 0;
}

.corner-border-left::before,
.corner-border-left::after {
    content: "";
    position: absolute;
    background: linear-gradient(
        to bottom,
        rgba(212, 165, 116, 0.9),
        rgba(212, 165, 116, 0)
    );
}

/* Left outer border line (vertical) */
.corner-border-left::before {
    top: 0;
    left: 30px;
    width: 2px;
    height: 320px;
}

/* Left outer border line (horizontal) */
.corner-border-left::after {
    top: 30px;
    left: 0;
    width: 220px;
    height: 2px;
    background: linear-gradient(
        to right,
        rgba(212, 165, 116, 0.9),
        rgba(212, 165, 116, 0)
    );
}

/* Right Corner Border */
.corner-border-right {
    right: 0;
    left: auto;
}

.corner-border-right::before,
.corner-border-right::after {
    content: "";
    position: absolute;
    background: linear-gradient(
        to bottom,
        rgba(212, 165, 116, 0.9),
        rgba(212, 165, 116, 0)
    );
}

/* Right outer border line (vertical) */
.corner-border-right::before {
    top: 0;
    right: 30px;
    width: 2px;
    height: 320px;
}

/* Right outer border line (horizontal) */
.corner-border-right::after {
    top: 30px;
    right: 0;
    width: 220px;
    height: 2px;
    background: linear-gradient(
        to left,
        rgba(212, 165, 116, 0.9),
        rgba(212, 165, 116, 0)
    );
}

/* Inner border lines for left corner */
.corner-border-wrapper::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 250px;
    height: 250px;
    background:
        linear-gradient(
                to bottom,
                rgba(212, 165, 116, 0.6),
                rgba(212, 165, 116, 0)
            )
            36px 0 / 2px 310px no-repeat,
        linear-gradient(
                to right,
                rgba(212, 165, 116, 0.6),
                rgba(212, 165, 116, 0)
            )
            0 36px / 210px 2px no-repeat;
}

/* Inner border lines for right corner */
.corner-border-wrapper::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 250px;
    height: 250px;
    background:
        linear-gradient(
                to bottom,
                rgba(212, 165, 116, 0.6),
                rgba(212, 165, 116, 0)
            )
            calc(100% - 36px) 0 / 2px 310px no-repeat,
        linear-gradient(
                to left,
                rgba(212, 165, 116, 0.6),
                rgba(212, 165, 116, 0)
            )
            0 36px / 210px 2px no-repeat;
}

/* Our Story walking silhouettes */
.story-characters {
    position: absolute;
    inset: 0;
}

.story-character-wrap {
    position: absolute;
    bottom: 0;
    height: 100%;
    max-height: 900px;
    width: min(84%, 540px);
    opacity: 0;
}

.story-character-wrap.story-character-left {
    left: calc(50% - 556px);
}

.story-character-wrap.story-character-right {
    left: calc(50% + 16px);
}

/* Gradient only where the silhouette is (masked by same image) */
.story-character-gradient {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
        105deg,
        rgba(212, 165, 116, 0.5) 0%,
        rgba(155, 133, 198, 0.47) 50%,
        rgba(99, 102, 241, 0.45) 100%
    );
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: bottom center;
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: bottom center;
}

.story-character-gradient-left {
    mask-image: url("/images/story-man.png");
    -webkit-mask-image: url("/images/story-man.png");
}

.story-character-gradient-right {
    mask-image: url("/images/story-woman.png");
    -webkit-mask-image: url("/images/story-woman.png");
}

.story-character {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: auto;
    max-height: 100%;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 0 20px rgba(15, 23, 42, 0.9));
}

#story.animate-in .story-character-wrap.story-character-left {
    animation: storyWalkLeft 2.8s ease-out forwards;
}

#story.animate-in .story-character-wrap.story-character-right {
    animation: storyWalkRight 2.8s ease-out forwards;
}

@keyframes storyWalkLeft {
    0% {
        left: -65%;
        opacity: 0;
    }
    100% {
        left: calc(50% - 556px);
        opacity: 0.5;
    }
}

@keyframes storyWalkRight {
    0% {
        left: 115%;
        opacity: 0;
    }
    100% {
        left: calc(50% + 16px);
        opacity: 0.5;
    }
}

/* Shooting star animations */
.shooting-star {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 150px;
    height: 2px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0), #fff);
    animation: shoot 10s linear infinite;
}

@keyframes shoot {
    0% {
        transform: translateX(0) translateY(0) rotate(-45deg);
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        transform: translateX(1500px) translateY(-1500px) rotate(-45deg);
        opacity: 0;
    }
}

.shooting-star::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.8);
}

.shooting-star::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.8);
}

/* Scroll-triggered animations */
.scroll-animate {
    opacity: 0;
    transition: opacity 0.8s ease-out;
}

.scroll-animate.animate-in {
    opacity: 1;
}

/* Hero section staggered animations */
.hero-stars {
    opacity: 0;
    transform: translateY(-20px);
    animation: fadeInDown 1s ease-out 0.2s forwards;
}

.hero-title {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1s ease-out 0.4s forwards;
}

.hero-names {
    opacity: 0;
    transform: scale(0.9);
    animation: fadeInScale 1s ease-out 0.6s forwards;
}

.hero-date {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s ease-out 0.8s forwards;
}

.hero-cta {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 1s ease-out 1s forwards;
}

/* Section animations */
.section-title {
    opacity: 0;
    transform: translateY(30px);
    transition:
        opacity 0.8s ease-out,
        transform 0.8s ease-out;
}

.scroll-animate.animate-in .section-title {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s;
}

.section-content {
    opacity: 0;
    transform: translateY(40px);
    transition:
        opacity 0.8s ease-out,
        transform 0.8s ease-out;
}

.scroll-animate.animate-in .section-content {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.4s;
}

/* Event card staggered animations */
.event-card {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    transition:
        opacity 0.6s ease-out,
        transform 0.6s ease-out;
}

.scroll-animate.animate-in .event-card:nth-child(1) {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition-delay: 0.5s;
}

.scroll-animate.animate-in .event-card:nth-child(2) {
    opacity: 1;
    transform: translateY(0) scale(1);
    transition-delay: 0.7s;
}

/* Keyframe animations */
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInScale {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* Enhanced button hover animations */
a[href^="#"],
.Link {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

a[href^="#"]::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition:
        width 0.6s,
        height 0.6s;
}

a[href^="#"]:hover::before {
    width: 300px;
    height: 300px;
}

/* Parallax effect on scroll */
@media (prefers-reduced-motion: no-preference) {
    .stars-container {
        will-change: transform;
    }
}

/* Smooth transitions for all interactive elements */
button,
a {
    transition:
        transform 0.3s ease,
        box-shadow 0.3s ease,
        background 0.3s ease;
}

button:active,
a:active {
    transform: scale(0.98);
}
</style>
