const FONT_SANS = '"Inter", system-ui, sans-serif';
export const DEFAULT_THOUGHT_BUBBLE_IMAGE = '/images/filters/thought-bubble.png';

const state = {
    image: null,
    crop: null,
    url: null,
};

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Unable to load thought bubble image: ${url}`));
        image.src = url;
    });
}

function detectImageCrop(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0);

    const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const alpha = data[(y * width + x) * 4 + 3];

            if (alpha > 20) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    if (maxX <= minX || maxY <= minY) {
        return { x: 0, y: 0, width: image.width, height: image.height };
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
    };
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

export async function preloadThoughtBubble(imageUrl = DEFAULT_THOUGHT_BUBBLE_IMAGE) {
    if (state.image && state.url === imageUrl) {
        return state;
    }

    state.url = imageUrl;
    state.image = await loadImage(imageUrl);
    state.crop = detectImageCrop(state.image);

    return state;
}

function getBubbleMetrics(bubbleWidth) {
    const crop = state.crop ?? {
        x: 0,
        y: 0,
        width: state.image?.width ?? 1,
        height: state.image?.height ?? 1,
    };
    const bubbleHeight = bubbleWidth / (crop.width / crop.height);

    return { crop, bubbleWidth, bubbleHeight };
}

function drawBubbleImage(ctx, drawX, drawY, bubbleWidth) {
    const { crop, bubbleHeight } = getBubbleMetrics(bubbleWidth);

    ctx.drawImage(
        state.image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        drawX,
        drawY,
        bubbleWidth,
        bubbleHeight,
    );

    return { bubbleHeight };
}

function drawBubbleText(ctx, text, textX, textY, maxTextWidth, fontSize) {
    ctx.save();
    ctx.font = `700 ${fontSize}px ${FONT_SANS}`;
    ctx.fillStyle = '#1A1F4B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, text, maxTextWidth);
    const lineHeight = fontSize * 1.15;

    lines.forEach((line, index) => {
        const lineY = textY + (index - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, textX, lineY);
    });

    ctx.restore();
}

export function drawThoughtBubbleForFace(ctx, landmarks, width, height, text) {
    if (!state.image) {
        return;
    }

    const forehead = {
        x: landmarks[10].x * width,
        y: landmarks[10].y * height,
    };
    const leftTemple = {
        x: landmarks[234].x * width,
        y: landmarks[234].y * height,
    };
    const rightTemple = {
        x: landmarks[454].x * width,
        y: landmarks[454].y * height,
    };
    const headWidth = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);
    const bubbleWidth = headWidth * 1.2;
    const drawX = forehead.x - bubbleWidth * 0.34;
    const drawY = forehead.y - getBubbleMetrics(bubbleWidth).bubbleHeight * 0.9;
    const fontSize = Math.max(12, headWidth * 0.085);

    const { bubbleHeight } = drawBubbleImage(ctx, drawX, drawY, bubbleWidth);
    drawBubbleText(
        ctx,
        text,
        drawX + bubbleWidth * 0.52,
        drawY + bubbleHeight * 0.34,
        bubbleWidth * 0.52,
        fontSize,
    );
}

export function drawThoughtBubbleAt(ctx, x, y, scale, text) {
    if (!state.image) {
        return;
    }

    const bubbleWidth = Math.max(130, 170 * scale);
    const drawX = x - bubbleWidth * 0.56;
    const drawY = y - getBubbleMetrics(bubbleWidth).bubbleHeight * 0.28;
    const fontSize = Math.max(11, 13 * scale);

    const { bubbleHeight } = drawBubbleImage(ctx, drawX, drawY, bubbleWidth);
    drawBubbleText(
        ctx,
        text,
        drawX + bubbleWidth * 0.52,
        drawY + bubbleHeight * 0.34,
        bubbleWidth * 0.5,
        fontSize,
    );
}

export function getThoughtBubbleImageUrl() {
    return state.url ?? DEFAULT_THOUGHT_BUBBLE_IMAGE;
}
