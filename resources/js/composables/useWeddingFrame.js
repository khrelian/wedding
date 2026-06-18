const FONT_DISPLAY = '"Playfair Display", Georgia, serif';
const FONT_SCRIPT = '"Allura", cursive';

const imageCache = new Map();

export function resolveWeddingFrameConfig(config = {}) {
    if (config.variant === 'elegant') {
        const title = config.title ?? 'Ian Jay &';
        const name = config.name ?? 'Karen Kate';

        return {
            variant: 'elegant',
            names: config.names ?? `${title} ${name}`.replace(/\s+/g, ' ').trim().toUpperCase(),
            date: config.date ?? '07.17.2026',
            text_color: config.text_color ?? '#FFFFFF',
            border_color: config.border_color ?? '#FFFFFF',
        };
    }

    if (config.variant === 'pavilion') {
        return {
            variant: 'pavilion',
            overlay_image: config.overlay_image ?? '/images/filters/wedding-frame-pavilion.png',
        };
    }

    if (config.variant === 'overlay') {
        return {
            variant: 'overlay',
            overlay_image: config.overlay_image ?? '/images/filters/wedding-frame-overlay.png',
        };
    }

    if (config.variant === 'botanical') {
        return {
            variant: 'botanical',
            title: config.title ?? 'Mr & Mrs',
            name: config.name ?? 'Broñola & Seronay',
            date: config.date ?? '7/17/26',
            text_color: config.text_color ?? '#8F5A63',
            floral_top_image: config.floral_top_image ?? '/images/filters/floral-frame-top.png',
            floral_bottom_image: config.floral_bottom_image ?? '/images/filters/floral-frame-bottom.png',
        };
    }

    return {
        variant: 'classic',
        title: config.title ?? 'Ian Jay &',
        name: config.name ?? 'Karen Kate',
        date: config.date ?? '17 | 07 | 2026',
        text_color: config.text_color ?? '#FFFFFF',
        floral_image: config.floral_image ?? '/images/filters/floral-border.png',
    };
}

export function defaultWeddingFrame(config = {}) {
    return resolveWeddingFrameConfig(config);
}

function loadImage(url) {
    if (!imageCache.has(url)) {
        imageCache.set(url, new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Unable to load image: ${url}`));
            image.src = url;
        }));
    }

    return imageCache.get(url);
}

export async function loadFloralImage(url) {
    return loadImage(url);
}

export async function preloadWeddingFrameImages(frameConfig) {
    const frame = resolveWeddingFrameConfig(frameConfig);

    if (frame.variant === 'overlay' || frame.variant === 'pavilion') {
        const overlay = await loadImage(frame.overlay_image).catch(() => null);

        return {
            variant: frame.variant,
            overlay,
        };
    }

    if (frame.variant === 'elegant') {
        return { variant: 'elegant' };
    }

    const urls = frame.variant === 'botanical'
        ? [frame.floral_top_image, frame.floral_bottom_image]
        : [frame.floral_image];

    const images = await Promise.all(
        urls.map((url) => loadImage(url).catch(() => null)),
    );

    if (frame.variant === 'botanical') {
        return {
            variant: 'botanical',
            top: images[0],
            bottom: images[1],
        };
    }

    return {
        variant: 'classic',
        bottom: images[0],
    };
}

async function ensureFonts(variant = 'classic') {
    const loads = [
        document.fonts.load('400 28px Playfair Display'),
        document.fonts.load('400 20px Playfair Display'),
    ];

    if (variant === 'classic') {
        loads.push(document.fonts.load('400 72px Allura'));
    } else if (variant === 'elegant') {
        loads.push(document.fonts.load('400 36px Playfair Display'));
        loads.push(document.fonts.load('400 18px Playfair Display'));
    } else {
        loads.push(document.fonts.load('400 42px Playfair Display'));
    }

    await Promise.all(loads);
}

function drawImageStrip(ctx, image, width, height, position) {
    if (!image) {
        return;
    }

    const drawWidth = width;
    const drawHeight = drawWidth / (image.width / image.height);

    if (position === 'top') {
        ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
        return;
    }

    ctx.drawImage(image, 0, height - drawHeight, drawWidth, drawHeight);
}

function drawOverlayWeddingFrame(ctx, width, height, overlayImage) {
    if (!overlayImage) {
        return;
    }

    ctx.drawImage(overlayImage, 0, 0, width, height);
}

function drawHeartShape(ctx, x, y, size, color = '#FFFFFF') {
    const drawPath = () => {
        ctx.beginPath();
        ctx.moveTo(0, size * 0.35);
        ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.35);
        ctx.bezierCurveTo(-size * 0.5, size * 0.62, 0, size * 0.9, 0, size);
        ctx.bezierCurveTo(0, size * 0.9, size * 0.5, size * 0.62, size * 0.5, size * 0.35);
        ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.35);
        ctx.closePath();
    };

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    drawPath();
    ctx.fill();
    ctx.translate(0, size * 0.04);
    ctx.fillStyle = color;
    drawPath();
    ctx.fill();
    ctx.restore();
}

function strokeElegantLine(ctx, drawLine, color, lineWidth, glow = 0) {
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.lineWidth = lineWidth + Math.max(1.5, glow);
    ctx.lineCap = 'butt';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = lineWidth * 2.5;
    drawLine();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    drawLine();
    ctx.stroke();
    ctx.restore();
}

function drawElegantWeddingFrame(ctx, width, height, frame) {
    const shortSide = Math.min(width, height);
    const color = frame.border_color ?? frame.text_color ?? '#FFFFFF';
    const inset = shortSide * 0.055;
    const cornerLen = shortSide * 0.095;
    const lineWidth = Math.max(2, shortSide * 0.0045);
    const heartSize = Math.max(10, shortSide * 0.03);
    const left = inset;
    const right = width - inset;
    const top = inset;
    const bottom = height - inset;
    const midY = height / 2;
    const heartGap = heartSize * 0.8;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(left + cornerLen, top);
        ctx.lineTo(right - cornerLen, top);
    }, color, lineWidth);

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(left + cornerLen, bottom);
        ctx.lineTo(right - cornerLen, bottom);
    }, color, lineWidth);

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(left, top + cornerLen);
        ctx.lineTo(left, midY - heartGap);
    }, color, lineWidth);

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(left, midY + heartGap);
        ctx.lineTo(left, bottom - cornerLen);
    }, color, lineWidth);

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(right, top + cornerLen);
        ctx.lineTo(right, midY - heartGap);
    }, color, lineWidth);

    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(right, midY + heartGap);
        ctx.lineTo(right, bottom - cornerLen);
    }, color, lineWidth);

    drawHeartShape(ctx, left, midY, heartSize, color);
    drawHeartShape(ctx, right, midY, heartSize, color);

    const names = frame.names ?? 'IAN JAY & KAREN KATE';
    const date = frame.date ?? '07.17.2026';
    const nameSize = Math.max(14, shortSide * 0.042);
    const dateSize = Math.max(10, shortSide * 0.028);
    const textY = height * 0.86;
    const dividerWidth = Math.min(width * 0.52, nameSize * names.length * 0.34);
    const dividerHeart = heartSize * 0.65;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = shortSide * 0.01;
    ctx.fillStyle = color;

    ctx.font = `400 ${nameSize}px ${FONT_DISPLAY}`;
    ctx.fillText(names, width / 2, textY - dateSize * 1.8);

    const dividerY = textY - dateSize * 0.55;
    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(width / 2 - dividerWidth / 2, dividerY);
        ctx.lineTo(width / 2 - dividerHeart * 0.65, dividerY);
    }, color, lineWidth);
    strokeElegantLine(ctx, () => {
        ctx.beginPath();
        ctx.moveTo(width / 2 + dividerHeart * 0.65, dividerY);
        ctx.lineTo(width / 2 + dividerWidth / 2, dividerY);
    }, color, lineWidth);
    drawHeartShape(ctx, width / 2, dividerY, dividerHeart, color);

    ctx.font = `400 ${dateSize}px ${FONT_DISPLAY}`;
    ctx.fillText(date, width / 2, textY + dateSize * 0.35);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

function drawClassicWeddingFrame(ctx, width, height, frame, floralImage) {
    const shortSide = Math.min(width, height);

    drawImageStrip(ctx, floralImage, width, height, 'bottom');

    const gradient = ctx.createLinearGradient(0, height * 0.45, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.45, 'rgba(0, 0, 0, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height * 0.45, width, height * 0.55);

    const centerX = width / 2;
    const textBaseY = height * 0.72;
    const titleSize = Math.max(16, shortSide * 0.038);
    const nameSize = Math.max(42, shortSide * 0.115);
    const dateSize = Math.max(13, shortSide * 0.028);
    const lineGap = nameSize * 0.22;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = shortSide * 0.012;
    ctx.shadowOffsetY = shortSide * 0.004;

    ctx.font = `400 ${titleSize}px ${FONT_DISPLAY}`;
    ctx.fillStyle = frame.text_color;
    ctx.fillText(frame.title, centerX, textBaseY - nameSize * 0.55);

    ctx.font = `400 ${nameSize}px ${FONT_SCRIPT}`;
    ctx.fillText(frame.name, centerX, textBaseY);

    ctx.font = `400 ${dateSize}px ${FONT_DISPLAY}`;
    ctx.fillText(frame.date, centerX, textBaseY + nameSize * 0.42 + lineGap);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}

function drawBotanicalWeddingFrame(ctx, width, height, frame, topImage, bottomImage) {
    const shortSide = Math.min(width, height);

    drawImageStrip(ctx, topImage, width, height, 'top');
    drawImageStrip(ctx, bottomImage, width, height, 'bottom');

    const centerX = width / 2;
    const nameSize = Math.max(28, shortSide * 0.09);
    const titleSize = Math.max(14, shortSide * 0.032);
    const dateSize = Math.max(12, shortSide * 0.026);
    const textCenterY = height * 0.86;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = frame.text_color;

    ctx.font = `400 ${titleSize}px ${FONT_DISPLAY}`;
    ctx.fillText(frame.title, centerX, textCenterY - nameSize * 0.72);

    ctx.font = `400 ${nameSize}px ${FONT_DISPLAY}`;
    ctx.fillText(frame.name, centerX, textCenterY);

    ctx.font = `400 ${dateSize}px ${FONT_DISPLAY}`;
    ctx.fillText(frame.date, centerX, textCenterY + nameSize * 0.62);
}

export function drawWeddingFrameSync(ctx, width, height, frameConfig, assets = {}) {
    const frame = resolveWeddingFrameConfig(frameConfig);

    if (frame.variant === 'overlay' || frame.variant === 'pavilion') {
        drawOverlayWeddingFrame(ctx, width, height, assets.overlay ?? null);
        return;
    }

    if (frame.variant === 'botanical') {
        drawBotanicalWeddingFrame(ctx, width, height, frame, assets.top ?? null, assets.bottom ?? null);
        return;
    }

    if (frame.variant === 'elegant') {
        drawElegantWeddingFrame(ctx, width, height, frame);
        return;
    }

    drawClassicWeddingFrame(ctx, width, height, frame, assets.bottom ?? assets.classic ?? null);
}

export async function drawWeddingFrame(ctx, width, height, frameConfig) {
    const frame = resolveWeddingFrameConfig(frameConfig);
    await ensureFonts(frame.variant);

    const assets = await preloadWeddingFrameImages(frameConfig);
    drawWeddingFrameSync(ctx, width, height, frameConfig, assets);
}

export function isWeddingFrameSticker(sticker) {
    return sticker === 'wedding_frame' || sticker === 'wedding_frame_botanical';
}

export function weddingFrameConfigKey(sticker) {
    return sticker === 'wedding_frame_botanical' ? 'weddingFrameBotanical' : 'weddingFrame';
}

export function resolveActiveWeddingFrameConfig(sticker, weddingContext = {}, stickerContext = {}) {
    if (!isWeddingFrameSticker(sticker)) {
        return null;
    }

    if (sticker === 'wedding_frame' && stickerContext.weddingFrameVariant === 'elegant') {
        return resolveWeddingFrameConfig({
            ...(weddingContext.weddingFrameElegant ?? {}),
            variant: 'elegant',
        });
    }

    if (sticker === 'wedding_frame' && stickerContext.weddingFrameVariant === 'pavilion') {
        return resolveWeddingFrameConfig({
            ...(weddingContext.weddingFramePavilion ?? {}),
            variant: 'pavilion',
        });
    }

    if (sticker === 'wedding_frame' && stickerContext.weddingFrameVariant === 'overlay') {
        return resolveWeddingFrameConfig({
            ...(weddingContext.weddingFrameOverlay ?? {}),
            variant: 'overlay',
        });
    }

    if (sticker === 'wedding_frame_botanical') {
        return resolveWeddingFrameConfig({
            ...(weddingContext.weddingFrameBotanical ?? {}),
            variant: 'botanical',
        });
    }

    return resolveWeddingFrameConfig(weddingContext.weddingFrame ?? {});
}

export function createWeddingFrameStickerContext(filter) {
    if (filter?.sticker === 'wedding_frame' || filter?.face_sticker === 'wedding_frame') {
        return { weddingFrameVariant: 'classic' };
    }

    return {};
}

const WEDDING_FRAME_VARIANTS = ['classic', 'elegant', 'overlay', 'pavilion'];

export function getWeddingFrameVariants() {
    return [...WEDDING_FRAME_VARIANTS];
}

export function getWeddingFrameVariantLabel(variant = 'classic') {
    switch (variant) {
    case 'overlay':
        return 'Botanical overlay';
    case 'pavilion':
        return 'Pavilion lights';
    case 'elegant':
        return 'Elegant frame';
    default:
        return 'Classic floral';
    }
}

export function getNextWeddingFrameVariantLabel(variant = 'classic') {
    const currentIndex = WEDDING_FRAME_VARIANTS.indexOf(variant);
    const nextVariant = WEDDING_FRAME_VARIANTS[(currentIndex + 1) % WEDDING_FRAME_VARIANTS.length];

    return getWeddingFrameVariantLabel(nextVariant);
}

export function toggleWeddingFrameVariant(context = {}) {
    const currentIndex = WEDDING_FRAME_VARIANTS.indexOf(context.weddingFrameVariant ?? 'classic');
    const nextVariant = WEDDING_FRAME_VARIANTS[(currentIndex + 1) % WEDDING_FRAME_VARIANTS.length];

    return {
        ...context,
        weddingFrameVariant: nextVariant,
    };
}

export function setWeddingFrameVariant(context = {}, variant = 'classic') {
    if (!WEDDING_FRAME_VARIANTS.includes(variant)) {
        return context;
    }

    return {
        ...context,
        weddingFrameVariant: variant,
    };
}

export function isWeddingFrameToggleable(filter) {
    return filter?.sticker === 'wedding_frame' || filter?.face_sticker === 'wedding_frame';
}
