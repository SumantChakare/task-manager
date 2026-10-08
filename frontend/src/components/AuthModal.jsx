import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const { login, register } = useAuth();

    const [mode, setMode] = useState(initialMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setGeneralError(null);
            setFieldErrors({});
        }
    }, [isOpen, initialMode]);

    // Login Form State
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Register Form State
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    if (!isOpen) return null;

    const handleSwitchMode = (newMode) => {
        setMode(newMode);
        setGeneralError(null);
        setFieldErrors({});
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        setFieldErrors({});

        if (!loginData.email) {
            setFieldErrors({ email: 'Email address is required.' });
            return;
        }
        if (!loginData.password) {
            setFieldErrors({ password: 'Password is required.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await login(loginData);
            onClose();
        } catch (err) {
            console.error('Login error:', err);
            if (err.errors) {
                setFieldErrors(err.errors);
            } else {
                setGeneralError(err.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        setFieldErrors({});

        const errors = {};
        if (!registerData.name.trim()) errors.name = 'Full name is required.';
        if (!registerData.email.trim()) errors.email = 'Email address is required.';
        if (!registerData.password) {
            errors.password = 'Password is required.';
        } else if (registerData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long.';
        }
        if (registerData.password !== registerData.password_confirmation) {
            errors.password_confirmation = 'Passwords do not match.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await register(registerData);
            onClose();
        } catch (err) {
            console.error('Register error:', err);
            if (err.errors) {
                const mapped = {};
                for (const [k, v] of Object.entries(err.errors)) {
                    mapped[k] = Array.isArray(v) ? v[0] : v;
                }
                setFieldErrors(mapped);
            } else {
                setGeneralError(err.message || 'Registration failed.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="auth-modal-header">
                    <div className="auth-modal-brand">
                        <div className="brand-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div>
                            <h2>{mode === 'login' ? 'Sign in' : 'Sign Up'}</h2>
                            <p className="auth-subtitle">
                                {mode === 'login' ? 'Sign in to access your task dashboard' : 'Create an account with role-based access'}
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close">
                            &times;
                        </button>
                    )}
                </div>

                {/* Mode Tabs */}
                <div className="auth-tabs">
                    <button
                        type="button"
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => handleSwitchMode('login')}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                        onClick={() => handleSwitchMode('register')}
                    >
                        Register
                    </button>
                </div>

                {/* Global Error Banner */}
                {generalError && (
                    <div className="auth-alert auth-alert-error" role="alert">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{generalError}</span>
                    </div>
                )}

                {/* Login Form */}
                {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} noValidate>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="login-email">Email Address</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                    placeholder="e.g., admin@example.com"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    autoFocus
                                />
                                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="login-password">Password</label>
                                <input
                                    id="login-password"
                                    type="password"
                                    className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border" /> Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Register Form */}
                {mode === 'register' && (
                    <form onSubmit={handleRegisterSubmit} noValidate>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="reg-name">Full Name <span className="req">*</span></label>
                                <input
                                    id="reg-name"
                                    type="text"
                                    className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                                    placeholder="John Doe"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                    autoFocus
                                />
                                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="reg-email">Email Address <span className="req">*</span></label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                                    placeholder="john@example.com"
                                    value={registerData.email}
                                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                />
                                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group col">
                                    <label htmlFor="reg-password">Password <span className="req">*</span></label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                                        placeholder="Min 8 characters"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                    />
                                    {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                                </div>

                                <div className="form-group col">
                                    <label htmlFor="reg-confirm">Confirm Password <span className="req">*</span></label>
                                    <input
                                        id="reg-confirm"
                                        type="password"
                                        className={`form-control ${fieldErrors.password_confirmation ? 'is-invalid' : ''}`}
                                        placeholder="Repeat password"
                                        value={registerData.password_confirmation}
                                        onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                                    />
                                    {fieldErrors.password_confirmation && (
                                        <span className="field-error">{fieldErrors.password_confirmation}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border" /> Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
