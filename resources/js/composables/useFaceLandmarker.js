let landmarkerInstance = null;
let landmarkerPromise = null;

const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export async function getFaceLandmarker() {
    if (landmarkerInstance) {
        return landmarkerInstance;
    }

    if (!landmarkerPromise) {
        landmarkerPromise = createFaceLandmarker();
    }

    landmarkerInstance = await landmarkerPromise;
    return landmarkerInstance;
}

async function createFaceLandmarker() {
    const { FaceLandmarker, FilesetResolver } = await import('@mediapipe/tasks-vision');
    const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

    try {
        return await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: MODEL_PATH,
                delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
        });
    } catch {
        return FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: MODEL_PATH,
                delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
        });
    }
}

export function detectFaceLandmarks(landmarker, video, timestamp) {
    if (!landmarker || video.readyState < 2) {
        return null;
    }

    const results = landmarker.detectForVideo(video, timestamp);
    return results.faceLandmarks?.[0] ?? null;
}

export function releaseFaceLandmarker() {
    if (landmarkerInstance) {
        landmarkerInstance.close();
        landmarkerInstance = null;
        landmarkerPromise = null;
    }
}
