import { drawWeddingFrame, resolveActiveWeddingFrameConfig, createWeddingFrameStickerContext } from '@/composables/useWeddingFrame';
import { drawRainingHeartsSnapshot } from '@/composables/useRainingHearts';
import { drawThoughtBubbleAt, preloadThoughtBubble } from '@/composables/useThoughtBubble';
const FONT_DISPLAY = '"Playfair Display", Georgia, serif';
const FONT_SCRIPT = '"Allura", cursive';
const FONT_SANS = '"Inter", system-ui, sans-serif';

async function ensureFonts() {
    await Promise.all([
        document.fonts.load('700 32px Playfair Display'),
        document.fonts.load('400 48px Allura'),
        document.fonts.load('700 18px Inter'),
    ]);
}

function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            URL.revokeObjectURL(url);
            resolve(image);
        };

        image.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Unable to load image.'));
        };

        image.src = url;
    });
}

function findFilter(filters, filterId) {
    return filters.find((filter) => filter.id === filterId) ?? filters[0];
}

function pickRandom(items, fallback = '') {
    if (!items?.length) {
        return fallback;
    }

    return items[Math.floor(Math.random() * items.length)];
}

export function createStickerContext(filter) {
    if (!filter || filter.id === 'none' || !filter.sticker) {
        return {};
    }

    const weddingFrameContext = createWeddingFrameStickerContext(filter);

    if (Object.keys(weddingFrameContext).length) {
        return weddingFrameContext;
    }

    if (filter.sticker === 'thought_bubble') {
        return {
            phrase: pickRandom(filter.phrases, 'So much love!'),
        };
    }

    if (filter.sticker === 'speech_bubble') {
        return {
            text: filter.text ?? 'Cheers!',
        };
    }

    return {};
}

export function buildStickerPlan(filter, weddingContext, stickerContext, width, height) {
    if (!filter?.sticker) {
        return [];
    }

    const scale = Math.min(width, height) / 400;

    switch (filter.sticker) {
    case 'couple_names':
        return [{
            type: 'couple_names',
            text: weddingContext.coupleNames,
            x: 0.5,
            y: 0.9,
            scale,
        }];
    case 'thought_bubble':
        return [{
            type: 'thought_bubble',
            text: stickerContext.phrase ?? pickRandom(filter.phrases, 'Best day ever!'),
            x: 0.74,
            y: 0.16,
            scale,
        }];
    case 'speech_bubble':
        return [{
            type: 'speech_bubble',
            text: stickerContext.text ?? filter.text ?? 'Cheers!',
            x: 0.22,
            y: 0.78,
            scale,
        }];
    case 'just_married':
        return [{
            type: 'just_married',
            text: 'Just Married',
            x: 0.5,
            y: 0.1,
            scale,
        }];
    case 'hearts':
        return [
            { type: 'heart', x: 0.12, y: 0.14, scale: scale * 1.1, rotation: -0.25 },
            { type: 'heart', x: 0.88, y: 0.2, scale: scale * 0.95, rotation: 0.35 },
            { type: 'heart', x: 0.16, y: 0.72, scale: scale * 0.8, rotation: 0.15 },
            { type: 'heart', x: 0.84, y: 0.8, scale: scale * 1.2, rotation: -0.4 },
        ];
    case 'raining_hearts':
        return [{ type: 'raining_hearts' }];
    case 'tagline':
        return [
            { type: 'star', x: 0.14, y: 0.12, scale: scale * 0.7 },
            { type: 'star', x: 0.86, y: 0.14, scale: scale * 0.55 },
            {
                type: 'tagline',
                text: weddingContext.tagline,
                x: 0.5,
                y: 0.11,
                scale,
            },
        ];
    case 'wedding_frame':
    case 'wedding_frame_botanical':
        return [{ type: 'wedding_frame', sticker: filter.sticker }];
    default:
        return [];
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let current = '';

    words.forEach((word) => {
        const candidate = current ? `${current} ${word}` : word;

        if (ctx.measureText(candidate).width > maxWidth && current) {
            lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    });

    if (current) {
        lines.push(current);
    }

    return lines;
}

function drawHeart(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.3);
    ctx.bezierCurveTo(-size * 0.5, size * 0.6, 0, size * 0.85, 0, size);
    ctx.bezierCurveTo(0, size * 0.85, size * 0.5, size * 0.6, size * 0.5, size * 0.3);
    ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.3);
    ctx.closePath();
    ctx.fillStyle = '#E85D75';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = size * 0.06;
    ctx.stroke();
    ctx.restore();
}

function drawStar(ctx, x, y, size) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();

    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const outerX = Math.cos(angle) * size;
        const outerY = Math.sin(angle) * size;
        const innerAngle = angle + Math.PI / 5;
        const innerX = Math.cos(innerAngle) * (size * 0.42);
        const innerY = Math.sin(innerAngle) * (size * 0.42);

        if (i === 0) {
            ctx.moveTo(outerX, outerY);
        } else {
            ctx.lineTo(outerX, outerY);
        }

        ctx.lineTo(innerX, innerY);
    }

    ctx.closePath();
    ctx.fillStyle = '#D4AF37';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = size * 0.08;
    ctx.stroke();
    ctx.restore();
}

function drawSpeechBubble(ctx, sticker, width, height) {
    const x = sticker.x * width;
    const y = sticker.y * height;
    const scale = sticker.scale;
    const fontSize = Math.max(15, 17 * scale);
    const paddingX = 16 * scale;
    const paddingY = 12 * scale;

    ctx.save();
    ctx.font = `700 ${fontSize}px ${FONT_SANS}`;
    const textWidth = ctx.measureText(sticker.text).width;
    const bubbleWidth = textWidth + paddingX * 2;
    const bubbleHeight = fontSize + paddingY * 2;
    const left = x - bubbleWidth / 2;
    const top = y - bubbleHeight / 2;
    const radius = 16 * scale;

    ctx.fillStyle = '#FFF8E7';
    ctx.strokeStyle = '#1A1F4B';
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.roundRect(left, top, bubbleWidth, bubbleHeight, radius);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left + bubbleWidth * 0.28, top + bubbleHeight);
    ctx.lineTo(left + bubbleWidth * 0.18, top + bubbleHeight + 16 * scale);
    ctx.lineTo(left + bubbleWidth * 0.42, top + bubbleHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1A1F4B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.text, x, y);
    ctx.restore();
}

function drawNameBanner(ctx, sticker, width, height) {
    const x = sticker.x * width;
    const y = sticker.y * height;
    const scale = sticker.scale;
    const fontSize = Math.max(28, 42 * scale);
    const paddingX = 22 * scale;
    const paddingY = 10 * scale;

    ctx.save();
    ctx.font = `400 ${fontSize}px ${FONT_SCRIPT}`;
    const textWidth = ctx.measureText(sticker.text).width;
    const bannerWidth = textWidth + paddingX * 2;
    const bannerHeight = fontSize + paddingY * 2;
    const left = x - bannerWidth / 2;
    const top = y - bannerHeight / 2;

    ctx.fillStyle = 'rgba(11, 16, 38, 0.72)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.85)';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.roundRect(left, top, bannerWidth, bannerHeight, bannerHeight / 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.text, x, y + scale);
    ctx.restore();
}

function drawJustMarried(ctx, sticker, width, height) {
    const x = sticker.x * width;
    const y = sticker.y * height;
    const scale = sticker.scale;
    const fontSize = Math.max(18, 24 * scale);
    const paddingX = 24 * scale;
    const paddingY = 10 * scale;

    ctx.save();
    ctx.font = `700 ${fontSize}px ${FONT_DISPLAY}`;
    const textWidth = ctx.measureText(sticker.text).width;
    const bannerWidth = textWidth + paddingX * 2;
    const bannerHeight = fontSize + paddingY * 2;
    const left = x - bannerWidth / 2;
    const top = y - bannerHeight / 2;

    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(left + 12 * scale, top);
    ctx.lineTo(left + bannerWidth - 12 * scale, top);
    ctx.lineTo(left + bannerWidth, top + bannerHeight / 2);
    ctx.lineTo(left + bannerWidth - 12 * scale, top + bannerHeight);
    ctx.lineTo(left + 12 * scale, top + bannerHeight);
    ctx.lineTo(left, top + bannerHeight / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0B1026';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.text, x, y);
    ctx.restore();
}

function drawTagline(ctx, sticker, width, height) {
    const x = sticker.x * width;
    const y = sticker.y * height;
    const scale = sticker.scale;
    const fontSize = Math.max(16, 22 * scale);

    ctx.save();
    ctx.font = `400 ${fontSize}px ${FONT_SCRIPT}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = 'rgba(11, 16, 38, 0.75)';
    ctx.lineWidth = 3 * scale;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(sticker.text, x, y);
    ctx.fillText(sticker.text, x, y);
    ctx.restore();
}

function drawSticker(ctx, sticker, width, height, weddingContext, stickerContext = {}) {
    const x = sticker.x * width;
    const y = sticker.y * height;

    switch (sticker.type) {
    case 'wedding_frame':
        return drawWeddingFrame(
            ctx,
            width,
            height,
            resolveActiveWeddingFrameConfig(sticker.sticker, weddingContext, stickerContext)
                ?? weddingContext.weddingFrame,
        );
    case 'thought_bubble':
        drawThoughtBubbleAt(ctx, x, y, sticker.scale, sticker.text);
        break;
    case 'speech_bubble':
        drawSpeechBubble(ctx, sticker, width, height);
        break;
    case 'couple_names':
        drawNameBanner(ctx, sticker, width, height);
        break;
    case 'just_married':
        drawJustMarried(ctx, sticker, width, height);
        break;
    case 'tagline':
        drawTagline(ctx, sticker, width, height);
        break;
    case 'heart':
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(sticker.rotation ?? 0);
        drawHeart(ctx, 0, 0, 28 * sticker.scale);
        ctx.restore();
        break;
    case 'raining_hearts':
        drawRainingHeartsSnapshot(ctx, width, height);
        break;
    case 'star':
        drawStar(ctx, x, y, 18 * sticker.scale);
        break;
    default:
        break;
    }
}

export async function exportStickeredPhoto(file, filterId, filters, weddingContext, stickerContext, maxDimension = 2048) {
    const filter = findFilter(filters, filterId);

    if (!filter || filter.id === 'none' || !filter.sticker) {
        return file;
    }

    await ensureFonts();

    if (filter.sticker === 'thought_bubble') {
        await preloadThoughtBubble(filter.image);
    }

    const image = await loadImageFromFile(file);
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, width, height);

    const stickers = buildStickerPlan(filter, weddingContext, stickerContext, width, height);

    for (const sticker of stickers) {
        await drawSticker(ctx, sticker, width, height, weddingContext, stickerContext);
    }

    const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
            (result) => {
                if (result) {
                    resolve(result);
                    return;
                }

                reject(new Error('Unable to export stickered photo.'));
            },
            'image/jpeg',
            0.92,
        );
    });

    const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';

    return new File([blob], `${baseName}-stickered.jpg`, { type: 'image/jpeg' });
}
