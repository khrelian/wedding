<script setup>
import { Head, Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';

const stars = ref([]);

onMounted(() => {
    // Generate random stars
    for (let i = 0; i < 100; i++) {
        stars.value.push({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 2 + 1,
            delay: Math.random() * 3,
            duration: Math.random() * 2 + 2
        });
    }
});
</script>

<template>
    <Head title="Welcome to Our Wedding - Elegant Starry Night" />

    <div class="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
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
                    animationDuration: star.duration + 's'
                }"
            ></div>
        </div>

        <!-- Shooting Stars -->
        <div class="shooting-stars absolute inset-0">
            <div class="shooting-star"></div>
            <div class="shooting-star" style="animation-delay: 3s; top: 30%;"></div>
            <div class="shooting-star" style="animation-delay: 6s; top: 60%;"></div>
        </div>

        <!-- Hero Section -->
        <div class="flex items-center justify-center min-h-screen px-8 sm:px-12 md:px-16 lg:px-20 relative z-10">
            <div class="text-center max-w-6xl mx-auto w-full">
                <!-- Star Decoration -->
                <div class="flex justify-center gap-4 mb-8">
                    <svg class="w-8 h-8 text-amber-300 animate-twinkle" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                    </svg>
                    <svg class="w-12 h-12 text-amber-400 animate-twinkle" style="animation-delay: 0.3s" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                    </svg>
                    <svg class="w-8 h-8 text-amber-300 animate-twinkle" style="animation-delay: 0.6s" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                    </svg>
                </div>

                <!-- Main Content -->
                <div class="px-4 sm:px-8 md:px-12">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent mb-8 drop-shadow-lg tracking-wider leading-relaxed" style="padding-left: 0.5rem; padding-right: 0.5rem; -webkit-box-decoration-break: clone; box-decoration-break: clone;">
                        We're Getting Married!
                    </h1>
                </div>
                
                <div class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-amber-50 mb-8 font-script font-normal tracking-wide drop-shadow-lg">
                    <p class="mb-2">Ian Jay & Karen Kate</p>
                </div>

                <!-- Wedding Date -->
                <div class="inline-block bg-gradient-to-br from-slate-800/80 to-blue-900/80 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 px-8 py-6 mb-12">
                    <p class="text-amber-300 text-sm uppercase tracking-widest mb-2 flex items-center justify-center gap-2 font-sans font-light">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                        Save the Date
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                        </svg>
                    </p>
                    <p class="text-3xl md:text-4xl font-display font-semibold text-amber-100 mb-2">July 17, 2026</p>
                    <p class="text-amber-200/80 font-elegant text-lg">Butuan City Cathedral</p>
                    <p class="text-amber-300/60 text-sm mt-1 font-sans italic font-light">Under the Starry Sky</p>
                </div>

                <!-- Quick Links -->
                <div class="flex flex-wrap justify-center gap-4 mt-12">
                    <Link
                        :href="route('dashboard')"
                        class="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-full font-sans font-semibold tracking-wide hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/60 transform hover:-translate-y-0.5 border border-amber-400"
                    >
                        RSVP Now
                    </Link>
                    <a
                        href="#story"
                        class="px-8 py-3 bg-slate-800/50 backdrop-blur-md text-amber-100 rounded-full font-sans font-medium tracking-wide hover:bg-slate-700/50 transition shadow-lg border border-amber-400/30 hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Our Story
                    </a>
                    <a
                        href="#details"
                        class="px-8 py-3 bg-slate-800/50 backdrop-blur-md text-amber-100 rounded-full font-sans font-medium tracking-wide hover:bg-slate-700/50 transition shadow-lg border border-amber-400/30 hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        Event Details
                    </a>
                </div>
            </div>
        </div>

        <!-- Our Story Section -->
        <div id="story" class="py-20 px-6 bg-gradient-to-b from-indigo-900 to-slate-900 relative">
            <div class="max-w-4xl mx-auto relative z-10">
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 mb-12 drop-shadow-lg tracking-tight">
                    Our Love Story
                </h2>
                <div class="prose prose-lg prose-invert mx-auto text-center">
                    <div class="bg-gradient-to-br from-slate-800/50 to-blue-900/40 backdrop-blur-md rounded-lg p-8 md:p-12 border border-amber-300/30 shadow-2xl">
                        <p class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light">
                            Like celestial bodies guided by an invisible force, we were drawn to each other across the vast expanse of life. 
                            We weren't searching, yet somehow we found exactly what our hearts needed.
                        </p>
                        
                        <div class="flex justify-center my-6">
                            <svg class="w-8 h-8 text-amber-300 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                        </div>
                        
                        <p class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light">
                            It was as if the universe had been quietly aligning stars, preparing constellations, 
                            and weaving fate's delicate threads long before our paths crossed. 
                            The moment we met, it felt less like a beginning and more like a recognition—
                            as though our souls had always known each other, waiting patiently for this lifetime to reunite.
                        </p>
                        
                        <p class="text-amber-50 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light">
                            In a world of endless searching, we discovered each other effortlessly. 
                            No grand plans, no deliberate pursuit—just two hearts guided by something greater, 
                            drawn together like stars destined to share the same sky.
                        </p>
                        
                        <div class="flex justify-center my-8">
                            <svg class="w-6 h-6 text-amber-300 mx-2 animate-pulse" style="animation-delay: 0.2s" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            <svg class="w-8 h-8 text-amber-200 mx-2 animate-pulse" style="animation-delay: 0.4s" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            <svg class="w-6 h-6 text-amber-300 mx-2 animate-pulse" style="animation-delay: 0.6s" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                        </div>
                        
                        <p class="text-amber-100 text-lg md:text-xl mb-6 leading-relaxed font-elegant font-light italic">
                            What we have is rare and precious—a love that found us when we least expected it, 
                            proving that the most beautiful things in life aren't found by searching, 
                            but by being open to the magic that surrounds us.
                        </p>
                        
                        <p class="text-amber-200 text-xl md:text-2xl font-display font-medium mt-8 mb-8">
                            Now, under the same stars that brought us together, we begin our forever.
                        </p>
                        
                        <div class="flex justify-center items-center gap-3 mt-10 text-amber-100">
                            <span class="text-2xl md:text-3xl font-display font-medium">Ian Jay</span>
                            <svg class="w-6 h-6 md:w-7 md:h-7 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            <span class="text-lg md:text-xl font-elegant font-light">and</span>
                            <svg class="w-6 h-6 md:w-7 md:h-7 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                            <span class="text-2xl md:text-3xl font-display font-medium">Karen Kate</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Event Details Section -->
        <div id="details" class="py-20 px-6 bg-gradient-to-b from-slate-900 to-indigo-950 relative">
            <div class="max-w-6xl mx-auto relative z-10">
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 mb-16 drop-shadow-lg tracking-tight">
                    Event Details
                </h2>
                
                <div class="grid md:grid-cols-2 gap-8 mb-12">
                    <!-- Ceremony -->
                    <div class="bg-gradient-to-br from-slate-800/80 to-blue-900/60 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-8 text-center hover:border-amber-400/50 transition">
                        <div class="text-amber-400 mb-4">
                            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-display font-semibold text-amber-100 mb-4">Ceremony</h3>
                        <p class="text-amber-200/80 mb-2 text-xl font-elegant font-medium">7:00 AM</p>
                        <p class="text-amber-200/80 mb-1 font-sans">July 17, 2026</p>
                        <p class="text-amber-200/80 mb-2 text-lg font-elegant font-medium">Butuan City Cathedral</p>
                        <p class="text-amber-300/60 text-sm font-sans italic">Morning ceremony under the stars</p>
                    </div>

                    <!-- Reception -->
                    <div class="bg-gradient-to-br from-slate-800/80 to-violet-900/60 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/30 p-8 text-center hover:border-amber-400/50 transition">
                        <div class="text-amber-400 mb-4">
                            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h3 class="text-2xl md:text-3xl font-display font-semibold text-amber-100 mb-4">Reception</h3>
                        <p class="text-amber-200/80 mb-2 font-sans">July 17, 2026</p>
                        <p class="text-amber-200/80 mb-2 text-lg font-elegant font-medium">Butuan Watergate</p>
                        <p class="text-amber-300/60 text-sm font-sans italic">Breakfast reception following the ceremony</p>
                    </div>
                </div>

                <!-- Dress Code Section -->
                <div class="mt-16">
                    <div class="bg-gradient-to-br from-amber-900/30 to-slate-800/50 backdrop-blur-md rounded-lg shadow-2xl border border-amber-300/40 p-8 md:p-12 max-w-4xl mx-auto">
                        <div class="text-center mb-8">
                            <div class="flex justify-center mb-4">
                                <svg class="w-10 h-10 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-3xl md:text-4xl font-display font-semibold text-amber-200 mb-4">Dress Code</h3>
                            <p class="text-2xl md:text-3xl font-elegant font-medium text-amber-100 mb-2">Formal Attire</p>
                            <p class="text-lg text-amber-200/80 font-elegant italic">Elegant Starry Night Inspired</p>
                        </div>

                        <div class="grid md:grid-cols-2 gap-8 mt-8">
                            <!-- For Ladies -->
                            <div class="text-center">
                                <div class="flex justify-center mb-3">
                                    <svg class="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                    </svg>
                                </div>
                                <h4 class="text-xl font-semibold text-amber-100 mb-3">For the Ladies</h4>
                                <ul class="space-y-2 text-amber-50">
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Long gowns or cocktail dresses</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Evening colors preferred</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Navy, midnight blue, gold, silver</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- For Gentlemen -->
                            <div class="text-center">
                                <div class="flex justify-center mb-3">
                                    <svg class="w-8 h-8 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                    </svg>
                                </div>
                                <h4 class="text-xl font-semibold text-amber-100 mb-3">For the Gentlemen</h4>
                                <ul class="space-y-2 text-amber-50">
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Barong Tagalog or suit & tie</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Dark suits recommended</span>
                                    </li>
                                    <li class="flex items-start justify-center">
                                        <svg class="w-4 h-4 text-amber-400 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                                        </svg>
                                        <span>Navy, black, or charcoal</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-8 pt-8 border-t border-amber-300/20 text-center">
                            <p class="text-amber-100/80 text-sm md:text-base italic">
                                Think elegant evening wear with celestial touches—shimmer, sparkle, and shine like the stars! ✨
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-slate-950 py-8 px-6 text-center text-amber-200/60 border-t border-amber-400/20">
            <p class="text-sm flex items-center justify-center gap-2">
                Made with 
                <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.156L12 18.896l-7.417 4.53L6 15.27 0 9.423l8.332-1.268z"/>
                </svg>
                for our special day
            </p>
        </footer>
    </div>
</template>

<style scoped>
.star {
    animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
    0%, 100% {
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

.shooting-star {
    position: absolute;
    top: 10%;
    right: -10%;
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff);
    transform: rotate(-26.5deg);
    animation: shoot 8s linear infinite;
    transform-origin: right center;
}

@keyframes shoot {
    0% {
        transform: rotate(-26.5deg) translateX(0);
        opacity: 1;
    }
    70% {
        opacity: 1;
    }
    100% {
        transform: rotate(-26.5deg) translateX(-1100px);
        opacity: 0;
    }
}

.shooting-star::after {
    content: '';
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
</style>
