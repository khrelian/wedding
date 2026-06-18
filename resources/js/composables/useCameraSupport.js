export function getCameraSupportMessage() {
    if (typeof window === 'undefined') {
        return 'Camera is not available.';
    }

    if (!window.isSecureContext) {
        return 'The face camera requires a secure connection (HTTPS). Browsers block camera access on http:// addresses — including when you open your computer\'s IP (like http://192.168.x.x) from your phone. Use your deployed HTTPS site, or a dev tunnel (ngrok, Cloudflare Tunnel), or pick a photo from your gallery instead.';
    }

    if (!navigator.mediaDevices?.getUserMedia) {
        return 'Camera is not supported in this browser.';
    }

    return null;
}

export function isCameraSupported() {
    return getCameraSupportMessage() === null;
}
