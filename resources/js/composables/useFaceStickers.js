import { drawThoughtBubbleForFace, preloadThoughtBubble } from '@/composables/useThoughtBubble';
import { createWeddingFrameStickerContext } from '@/composables/useWeddingFrame';
import { drawRainingHearts } from '@/composables/useRainingHearts';

const DEFAULT_MUSTACHE_IMAGE = '/images/filters/mustache.png';
const DEFAULT_CROWN_IMAGE = '/images/filters/crown.png';

const stickerImages = {
    mustache: null,
    mustacheCrop: null,
    crowns: [],
    glasses: [],
};

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Unable to load image: ${url}`));
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

function detectGlassesBridgeY(image, crop) {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    const { data, width, height } = ctx.getImageData(0, 0, crop.width, crop.height);
    const searchStart = Math.floor(height * 0.2);
    const searchEnd = Math.ceil(height * 0.7);
    let bridgeRow = Math.floor(height * 0.45);
    let narrowestSpan = Number.POSITIVE_INFINITY;

    for (let y = searchStart; y < searchEnd; y++) {
        let minX = width;
        let maxX = 0;

        for (let x = 0; x < width; x++) {
            if (data[(y * width + x) * 4 + 3] > 20) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
        }

        if (maxX <= minX) {
            continue;
        }

        const span = maxX - minX;

        if (span < narrowestSpan) {
            narrowestSpan = span;
            bridgeRow = y;
        }
    }

    return Math.min(0.68, Math.max(0.34, (bridgeRow + height * 0.02) / height));
}

function detectCrownBaseY(image, crop) {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    const { data, width, height } = ctx.getImageData(0, 0, crop.width, crop.height);
    const searchStart = Math.floor(width * 0.2);
    const searchEnd = Math.ceil(width * 0.8);

    for (let y = height - 1; y >= 0; y--) {
        for (let x = searchStart; x < searchEnd; x++) {
            if (data[(y * width + x) * 4 + 3] > 20) {
                return Math.min(1, (y + height * 0.01) / height);
            }
        }
    }

    return 0.98;
}

function averagePoints(points) {
    const total = points.reduce(
        (accumulator, current) => ({
            x: accumulator.x + current.x,
            y: accumulator.y + current.y,
        }),
        { x: 0, y: 0 },
    );

    return {
        x: total.x / points.length,
        y: total.y / points.length,
    };
}

export async function preloadFaceStickerImages(faceFilters = []) {
    const mustacheFilter = faceFilters.find((filter) => filter.face_sticker === 'mustache');
    const mustacheUrl = mustacheFilter?.image ?? DEFAULT_MUSTACHE_IMAGE;
    const crownFilter = faceFilters.find((filter) => filter.face_sticker === 'crown');
    const crownUrls = crownFilter?.images?.map((variant) => variant.image)
        ?? (crownFilter?.image ? [crownFilter.image] : [DEFAULT_CROWN_IMAGE]);
    const thoughtFilter = faceFilters.find((filter) => filter.face_sticker === 'thought_bubble');
    const thoughtUrl = thoughtFilter?.image ?? undefined;
    const glassesFilter = faceFilters.find((filter) => filter.face_sticker === 'glasses');
    const glassesUrls = glassesFilter?.images?.map((variant) => variant.image) ?? [];

    stickerImages.glasses = [];

    for (const url of glassesUrls) {
        try {
            const image = await loadImage(url);
            const crop = detectImageCrop(image);

            stickerImages.glasses.push({
                image,
                crop,
                bridgeY: detectGlassesBridgeY(image, crop),
            });
        } catch {
            // Skip variants that fail to load.
        }
    }

    try {
        stickerImages.mustache = await loadImage(mustacheUrl);
        stickerImages.mustacheCrop = detectImageCrop(stickerImages.mustache);
    } catch {
        stickerImages.mustache = null;
        stickerImages.mustacheCrop = null;
    }

    stickerImages.crowns = [];

    for (const url of crownUrls) {
        try {
            const image = await loadImage(url);
            const crop = detectImageCrop(image);

            stickerImages.crowns.push({
                image,
                crop,
                baseY: detectCrownBaseY(image, crop),
            });
        } catch {
            // Skip variants that fail to load.
        }
    }

    try {
        await preloadThoughtBubble(thoughtUrl);
    } catch {
        // Thought bubble falls back to drawn shape only if image fails.
    }
}

function point(landmarks, index, width, height, mirrored = false) {
    const landmark = landmarks[index];

    return {
        x: (mirrored ? 1 - landmark.x : landmark.x) * width,
        y: landmark.y * height,
    };
}

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a, b) {
    return {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2,
    };
}

function getMouthGeometry(landmarks, width, height, mirrored = false) {
    const leftMouth = point(landmarks, 61, width, height, mirrored);
    const rightMouth = point(landmarks, 291, width, height, mirrored);
    const screenLeft = leftMouth.x <= rightMouth.x ? leftMouth : rightMouth;
    const screenRight = leftMouth.x <= rightMouth.x ? rightMouth : leftMouth;
    const mouthAngle = Math.atan2(
        rightMouth.y - leftMouth.y,
        rightMouth.x - leftMouth.x,
    );

    return {
        mouthSpan: distance(leftMouth, rightMouth),
        mouthCenter: midpoint(screenLeft, screenRight),
        mouthAngle,
    };
}

function getEyeGeometry(landmarks, width, height, mirrored = false) {
    const leftOuter = point(landmarks, 33, width, height, mirrored);
    const leftInner = point(landmarks, 133, width, height, mirrored);
    const rightInner = point(landmarks, 362, width, height, mirrored);
    const rightOuter = point(landmarks, 263, width, height, mirrored);
    const leftEyeCenter = midpoint(leftOuter, leftInner);
    const rightEyeCenter = midpoint(rightOuter, rightInner);
    const screenLeft = leftEyeCenter.x <= rightEyeCenter.x ? leftEyeCenter : rightEyeCenter;
    const screenRight = leftEyeCenter.x <= rightEyeCenter.x ? rightEyeCenter : leftEyeCenter;
    const eyeSpan = distance(leftOuter, rightOuter);
    const eyeAngle = Math.atan2(
        rightEyeCenter.y - leftEyeCenter.y,
        rightEyeCenter.x - leftEyeCenter.x,
    );

    return {
        eyeSpan,
        center: midpoint(screenLeft, screenRight),
        angle: eyeAngle,
    };
}

function drawVectorGlasses(ctx, landmarks, width, height, mirrored = false) {
    const leftOuter = point(landmarks, 33, width, height, mirrored);
    const leftInner = point(landmarks, 133, width, height, mirrored);
    const rightInner = point(landmarks, 362, width, height, mirrored);
    const rightOuter = point(landmarks, 263, width, height, mirrored);
    const nose = point(landmarks, 1, width, height, mirrored);
    const eyeSpan = distance(leftOuter, rightOuter);
    const lensRadius = eyeSpan * 0.13;

    ctx.save();
    ctx.strokeStyle = '#D4AF37';
    ctx.fillStyle = 'rgba(26, 31, 75, 0.55)';
    ctx.lineWidth = Math.max(3, eyeSpan * 0.018);

    [
        { center: midpoint(leftOuter, leftInner), radius: lensRadius },
        { center: midpoint(rightOuter, rightInner), radius: lensRadius },
    ].forEach(({ center, radius }) => {
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(leftInner.x + lensRadius * 0.2, leftInner.y);
    ctx.lineTo(rightInner.x - lensRadius * 0.2, rightInner.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(midpoint(leftInner, rightInner).x, midpoint(leftInner, rightInner).y);
    ctx.lineTo(nose.x, nose.y - lensRadius * 0.2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    [leftOuter, rightOuter].forEach((corner) => {
        ctx.beginPath();
        ctx.arc(corner.x - lensRadius * 0.2, corner.y - lensRadius * 0.25, lensRadius * 0.22, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.restore();
}

function drawGlasses(ctx, landmarks, width, height, filter, stickerContext = {}, mirrored = false) {
    const variantIndex = stickerContext.glassesVariantIndex ?? 0;
    const glassesAsset = stickerImages.glasses[variantIndex] ?? stickerImages.glasses[0];

    if (glassesAsset?.image) {
        const { eyeSpan, center, angle } = getEyeGeometry(landmarks, width, height, mirrored);
        const crop = glassesAsset.crop;
        const drawWidth = eyeSpan * 1.55;
        const drawHeight = drawWidth / (crop.width / crop.height);
        const bridgeY = glassesAsset.bridgeY ?? 0.5;

        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(angle);
        ctx.scale(1, -1);
        ctx.drawImage(
            glassesAsset.image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            -drawWidth / 2,
            -drawHeight * bridgeY,
            drawWidth,
            drawHeight,
        );
        ctx.restore();

        return;
    }

    drawVectorGlasses(ctx, landmarks, width, height, mirrored);
}

function drawBunnyEars(ctx, landmarks, width, height, mirrored = false) {
    const forehead = point(landmarks, 10, width, height, mirrored);
    const leftTemple = point(landmarks, 234, width, height, mirrored);
    const rightTemple = point(landmarks, 454, width, height, mirrored);
    const headWidth = distance(leftTemple, rightTemple);
    const earWidth = headWidth * 0.22;
    const earHeight = headWidth * 0.75;

    ctx.save();
    ctx.fillStyle = '#F4D9E7';
    ctx.strokeStyle = '#E8A4C0';
    ctx.lineWidth = Math.max(2, headWidth * 0.02);

    [
        { x: forehead.x - headWidth * 0.22, lean: -0.18 },
        { x: forehead.x + headWidth * 0.22, lean: 0.18 },
    ].forEach(({ x, lean }) => {
        ctx.beginPath();
        ctx.ellipse(x, forehead.y - earHeight * 0.55, earWidth, earHeight, lean, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FBE8F0';
        ctx.beginPath();
        ctx.ellipse(x, forehead.y - earHeight * 0.55, earWidth * 0.45, earHeight * 0.65, lean, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F4D9E7';
    });

    ctx.restore();
}

function drawMustache(ctx, landmarks, width, height, mirrored = false) {
    const mouthGeometry = getMouthGeometry(landmarks, width, height, mirrored);
    const noseBottom = point(landmarks, 2, width, height, mirrored);
    const upperLipOuter = averagePoints([
        point(landmarks, 37, width, height, mirrored),
        point(landmarks, 0, width, height, mirrored),
        point(landmarks, 267, width, height, mirrored),
    ]);

    const drawWidth = mouthGeometry.mouthSpan * 2.05;

    if (stickerImages.mustache && stickerImages.mustacheCrop) {
        const crop = stickerImages.mustacheCrop;
        const drawHeight = drawWidth / (crop.width / crop.height);
        const philtrumHeight = Math.max(12, upperLipOuter.y - noseBottom.y);
        const fittedHeight = Math.min(drawHeight, philtrumHeight * 1.2);
        const lipAnchorY = upperLipOuter.y + mouthGeometry.mouthSpan * 0.08;
        const bottomRatio = 0.9;

        ctx.save();
        ctx.translate(mouthGeometry.mouthCenter.x, lipAnchorY);
        ctx.rotate(mouthGeometry.mouthAngle);
        ctx.scale(1, -1);
        ctx.drawImage(
            stickerImages.mustache,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            -drawWidth / 2,
            -fittedHeight * bottomRatio,
            drawWidth,
            fittedHeight,
        );
        ctx.restore();

        return;
    }

    const centerY = upperLipOuter.y - mouthGeometry.mouthSpan * 0.12;

    ctx.save();
    ctx.translate(mouthGeometry.mouthCenter.x, centerY);
    ctx.rotate(mouthGeometry.mouthAngle);
    ctx.fillStyle = '#2C1810';
    ctx.strokeStyle = '#1A0F0A';
    ctx.lineWidth = Math.max(1.5, mouthGeometry.mouthSpan * 0.04);

    ctx.beginPath();
    ctx.moveTo(-mouthGeometry.mouthSpan / 2, 0);
    ctx.quadraticCurveTo(-mouthGeometry.mouthSpan * 0.2, -mouthGeometry.mouthSpan * 0.35, 0, -mouthGeometry.mouthSpan * 0.08);
    ctx.quadraticCurveTo(mouthGeometry.mouthSpan * 0.2, -mouthGeometry.mouthSpan * 0.35, mouthGeometry.mouthSpan / 2, 0);
    ctx.quadraticCurveTo(mouthGeometry.mouthSpan * 0.14, mouthGeometry.mouthSpan * 0.28, 0, mouthGeometry.mouthSpan * 0.2);
    ctx.quadraticCurveTo(-mouthGeometry.mouthSpan * 0.14, mouthGeometry.mouthSpan * 0.28, -mouthGeometry.mouthSpan / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawCrown(ctx, landmarks, width, height, filter, stickerContext = {}, mirrored = false) {
    const forehead = point(landmarks, 10, width, height, mirrored);
    const leftTemple = point(landmarks, 234, width, height, mirrored);
    const rightTemple = point(landmarks, 454, width, height, mirrored);
    const headWidth = distance(leftTemple, rightTemple);
    const variantIndex = stickerContext.crownVariantIndex ?? 0;
    const crownAsset = stickerImages.crowns[variantIndex] ?? stickerImages.crowns[0];

    if (crownAsset?.image) {
        const crop = crownAsset.crop;
        const drawWidth = headWidth * 1.2;
        const drawHeight = drawWidth / (crop.width / crop.height);
        const baseY = crownAsset.baseY ?? 0.98;
        const screenLeft = leftTemple.x <= rightTemple.x ? leftTemple : rightTemple;
        const screenRight = leftTemple.x <= rightTemple.x ? rightTemple : leftTemple;
        const headAngle = Math.atan2(
            screenRight.y - screenLeft.y,
            screenRight.x - screenLeft.x,
        );
        const bottomInset = drawHeight * (1 - baseY);

        ctx.save();
        ctx.translate(forehead.x, forehead.y);
        ctx.rotate(headAngle);
        ctx.drawImage(
            crownAsset.image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            -drawWidth / 2,
            bottomInset,
            drawWidth,
            -drawHeight,
        );
        ctx.restore();

        return;
    }

    const crownWidth = headWidth * 1.05;
    const crownHeight = headWidth * 0.35;
    const baseY = forehead.y - headWidth * 0.08;
    const left = forehead.x - crownWidth / 2;
    const peaks = 5;
    const step = crownWidth / peaks;

    ctx.save();
    ctx.fillStyle = '#D4AF37';
    ctx.strokeStyle = '#FFF2C2';
    ctx.lineWidth = Math.max(2, headWidth * 0.015);
    ctx.beginPath();
    ctx.moveTo(left, baseY);

    for (let i = 0; i < peaks; i++) {
        const peakX = left + step * i + step / 2;
        const valleyX = left + step * (i + 1);
        ctx.lineTo(peakX, baseY - crownHeight);
        ctx.lineTo(valleyX, baseY - crownHeight * 0.35);
    }

    ctx.lineTo(left + crownWidth, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#B8922D';
    for (let i = 0; i < peaks; i++) {
        const gemX = left + step * i + step / 2;
        ctx.beginPath();
        ctx.arc(gemX, baseY - crownHeight * 0.82, headWidth * 0.025, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}

export function createGlassesStickerContext() {
    return { glassesVariantIndex: 0 };
}

export function createCrownStickerContext() {
    return { crownVariantIndex: 0 };
}

export function cycleGlassesVariant(context = {}, variantCount) {
    if (variantCount <= 1) {
        return context;
    }

    const current = context.glassesVariantIndex ?? 0;

    return {
        ...context,
        glassesVariantIndex: (current + 1) % variantCount,
    };
}

export function isGlassesToggleable(filter) {
    return filter?.face_sticker === 'glasses' && (filter.images?.length ?? 0) > 1;
}

export function cycleCrownVariant(context = {}, variantCount) {
    if (variantCount <= 1) {
        return context;
    }

    const current = context.crownVariantIndex ?? 0;

    return {
        ...context,
        crownVariantIndex: (current + 1) % variantCount,
    };
}

export function isCrownToggleable(filter) {
    return filter?.face_sticker === 'crown' && (filter.images?.length ?? 0) > 1;
}

export function getGlassesVariantLabel(filter, variantIndex = 0) {
    return filter?.images?.[variantIndex]?.label ?? `Style ${variantIndex + 1}`;
}

export function getCrownVariantLabel(filter, variantIndex = 0) {
    return filter?.images?.[variantIndex]?.label ?? `Style ${variantIndex + 1}`;
}

export function createFaceFilterContext(filter) {
    if (!filter || filter.id === 'none' || !filter.face_sticker) {
        return {};
    }

    const weddingFrameContext = createWeddingFrameStickerContext(filter);

    if (Object.keys(weddingFrameContext).length) {
        return weddingFrameContext;
    }

    if (filter.face_sticker === 'thought_bubble') {
        const phrases = filter.phrases ?? [];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)] ?? 'So much love!';

        return { phrase };
    }

    if (filter.face_sticker === 'glasses') {
        return createGlassesStickerContext();
    }

    if (filter.face_sticker === 'crown') {
        return createCrownStickerContext();
    }

    return {};
}

export function isFaceTrackedSticker(sticker) {
    return Boolean(sticker) && sticker !== 'raining_hearts';
}

export function drawFaceSticker(ctx, landmarks, filter, stickerContext, width, height, options = {}) {
    if (!filter?.face_sticker) {
        return;
    }

    if (filter.face_sticker !== 'raining_hearts' && !landmarks?.length) {
        return;
    }

    const mirrored = options.mirrored ?? false;

    switch (filter.face_sticker) {
    case 'raining_hearts':
        drawRainingHearts(ctx, width, height, options.timestamp ?? performance.now());
        break;
    case 'glasses':
        drawGlasses(ctx, landmarks, width, height, filter, stickerContext, mirrored);
        break;
    case 'bunny_ears':
        drawBunnyEars(ctx, landmarks, width, height, mirrored);
        break;
    case 'mustache':
        drawMustache(ctx, landmarks, width, height, mirrored);
        break;
    case 'crown':
        drawCrown(ctx, landmarks, width, height, filter, stickerContext, mirrored);
        break;
    case 'thought_bubble':
        drawThoughtBubbleForFace(
            ctx,
            mirrored
                ? landmarks.map((landmark) => ({ ...landmark, x: 1 - landmark.x }))
                : landmarks,
            width,
            height,
            stickerContext.phrase ?? filter.phrases?.[0] ?? 'Best day ever!',
        );
        break;
    default:
        break;
    }
}
