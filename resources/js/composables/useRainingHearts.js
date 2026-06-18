const HEART_COLORS = ['#E85D75', '#F4A4B8', '#FF8FAB', '#D4AF37'];

const particles = [];
let lastTimestamp = 0;

function drawHeart(ctx, x, y, size, rotation, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, size * 0.6, 0, size * 0.85, 0, size);
    ctx.bezierCurveTo(0, size * 0.85, size * 0.5, size * 0.6, size * 0.5, size * 0.3);
    ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = Math.max(1, size * 0.06);
    ctx.stroke();
    ctx.restore();
}

function canvasScale(width, height) {
    return Math.min(width, height) / 640;
}

function randomHeartSize(width, height) {
    const scale = canvasScale(width, height);
    const tier = Math.random();

    if (tier < 0.18) {
        return (16 + Math.random() * 12) * scale;
    }

    if (tier < 0.52) {
        return (30 + Math.random() * 20) * scale;
    }

    if (tier < 0.82) {
        return (48 + Math.random() * 24) * scale;
    }

    return (68 + Math.random() * 40) * scale;
}

function heartSizeFromSeed(index, width, height) {
    const scale = canvasScale(width, height);
    const tier = (index * 37) % 100;

    if (tier < 18) {
        return (16 + (index * 11) % 12) * scale;
    }

    if (tier < 52) {
        return (30 + (index * 13) % 20) * scale;
    }

    if (tier < 82) {
        return (48 + (index * 17) % 24) * scale;
    }

    return (68 + (index * 19) % 40) * scale;
}

function spawnHeart(width, height) {
    const size = randomHeartSize(width, height);
    const scale = canvasScale(width, height);

    return {
        x: Math.random() * width,
        y: -size - Math.random() * height * 0.35,
        size,
        speed: (50 + Math.random() * 90) * scale + size * 0.35,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 1 + Math.random() * 2.2,
        rotation: Math.random() * Math.PI * 2,
        spin: -0.8 + Math.random() * 1.6,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        opacity: 0.5 + Math.random() * 0.45,
    };
}

export function resetRainingHearts() {
    particles.length = 0;
    lastTimestamp = 0;
}

export function drawRainingHearts(ctx, width, height, timestamp = performance.now()) {
    const delta = lastTimestamp ? Math.min(0.05, (timestamp - lastTimestamp) / 1000) : 0;
    lastTimestamp = timestamp;

    const targetCount = Math.max(16, Math.round(width / 52));

    while (particles.length < targetCount) {
        particles.push(spawnHeart(width, height));
    }

    ctx.save();

    particles.forEach((particle) => {
        particle.y += particle.speed * delta;
        particle.sway += particle.swaySpeed * delta;
        particle.x += Math.sin(particle.sway) * 28 * delta;
        particle.rotation += particle.spin * delta;

        if (particle.y > height + particle.size) {
            Object.assign(particle, spawnHeart(width, height));
            particle.y = -particle.size;
        }

        ctx.globalAlpha = particle.opacity;
        drawHeart(ctx, particle.x, particle.y, particle.size, particle.rotation, particle.color);
    });

    ctx.restore();
}

export function drawRainingHeartsSnapshot(ctx, width, height) {
    const count = Math.max(24, Math.round(width / 30));

    for (let index = 0; index < count; index++) {
        const progress = (index + 0.5) / count;
        const x = ((index * 73) % 97) / 97 * width;
        const y = progress * height * 1.05 - height * 0.05;
        const size = heartSizeFromSeed(index, width, height);
        const rotation = ((index * 29) % 360) * (Math.PI / 180);
        const color = HEART_COLORS[index % HEART_COLORS.length];
        const opacity = 0.45 + ((index * 13) % 45) / 100;

        ctx.save();
        ctx.globalAlpha = opacity;
        drawHeart(ctx, x, y, size, rotation, color);
        ctx.restore();
    }
}
