const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const TOKEN_KEY = 'task_manager_token';

export function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * Standard fetch wrapper handling Bearer token injection, JSON headers, and error parsing.
 */
export async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Attach Sanctum Bearer token if user is logged in
    const token = getStoredToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    }

    if (!response.ok) {
        // Handle 401 Unauthorized (Session/Token expired)
        if (response.status === 401) {
            clearStoredToken();
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        let errorMessage = 'An unexpected error occurred';
        let errors = null;

        if (data) {
            if (data.errors) {
                errors = data.errors;
                const firstKey = Object.keys(data.errors)[0];
                errorMessage = data.errors[firstKey][0] || data.message || errorMessage;
            } else if (data.message) {
                errorMessage = data.message;
            }
        } else {
            errorMessage = response.status === 401
                ? 'Unauthenticated. Please log in.'
                : response.status === 403
                ? 'Forbidden: You do not have permission for this action.'
                : `Request failed with status ${response.status} (${response.statusText})`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.errors = errors;
        error.data = data;
        throw error;
    }

    return data;
}