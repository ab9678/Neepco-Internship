// Resolves relative paths returned by the backend (e.g. "/uploads/posts/xyz.jpg")
// into absolute URLs pointing at the API server's origin.
// Mirrors the base URL resolution logic in services/api.js without modifying it.

const resolveApiBaseUrl = () => {
    const env =
        typeof import.meta !== "undefined" && import.meta.env
            ? import.meta.env
            : {};

    if (env.VITE_API_BASE_URL) {
        return env.VITE_API_BASE_URL;
    }

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:5000/api`;
    }

    return "http://localhost:5000/api";
};

// Strips a trailing "/api" (or "/api/") segment to get the bare server origin,
// since uploaded files are served from "/uploads/..." at the server root,
// not under "/api".
export const getServerOrigin = () =>
    resolveApiBaseUrl().replace(/\/api\/?$/, "");

export const getFileUrl = (path) => {
    if (!path) return "";

    // Already absolute (e.g. an external URL) — return as-is.
    if (/^https?:\/\//i.test(path)) return path;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${getServerOrigin()}${normalizedPath}`;
};
