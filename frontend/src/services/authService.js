import { apiRequest, setStoredToken, clearStoredToken } from './api';

export const authService = {
    /**
     * Register a new user account.
     */
    async register({ name, email, password, password_confirmation }) {
        const response = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password,
                password_confirmation,
            }),
        });

        if (response?.data?.token) {
            setStoredToken(response.data.token);
        }

        return response.data;
    },

    /**
     * Authenticate existing user credentials.
     */
    async login({ email, password }) {
        const response = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response?.data?.token) {
            setStoredToken(response.data.token);
        }

        return response.data;
    },

    /**
     * Retrieve currently authenticated user profile.
     */
    async getMe() {
        const response = await apiRequest('/me', { method: 'GET' });
        return response?.data?.user;
    },

    /**
     * Invalidate user session and revoke token on backend.
     */
    async logout() {
        try {
            await apiRequest('/logout', { method: 'POST' });
        } catch (err) {
            console.warn('Logout request failed or token already invalid:', err);
        } finally {
            clearStoredToken();
        }
    },

    /**
     * Admin-only: Fetch list of users for owner filtering and task assignment.
     */
    async getUsers() {
        const response = await apiRequest('/users', { method: 'GET' });
        return response?.data || [];
    },
};
