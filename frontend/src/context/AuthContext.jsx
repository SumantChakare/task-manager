import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { getStoredToken, clearStoredToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getStoredToken());
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user profile on startup if token is present
    const checkAuthStatus = useCallback(async () => {
        const currentToken = getStoredToken();
        if (!currentToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const userData = await authService.getMe();
            setUser(userData);
            setToken(currentToken);
        } catch (err) {
            console.warn('Authentication verification failed:', err);
            clearStoredToken();
            setUser(null);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();

        // Listen for automatic logout on 401 response from any API request
        const handleUnauthorized = () => {
            setUser(null);
            setToken(null);
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [checkAuthStatus]);

    const login = async ({ email, password }) => {
        const data = await authService.login({ email, password });
        setUser(data.user);
        setToken(data.token);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        setToken(data.token);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
        checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
