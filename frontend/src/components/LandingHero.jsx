import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function LandingHero({ onOpenAuthModal, onQuickLoginSuccess }) {
    const { login } = useAuth();
    const [quickLoggingIn, setQuickLoggingIn] = useState(null); // 'admin' | 'user' | null
    const [quickError, setQuickError] = useState(null);

    const handleQuickLogin = async (role, email, password) => {
        setQuickLoggingIn(role);
        setQuickError(null);
        try {
            await login({ email, password });
            if (onQuickLoginSuccess) {
                onQuickLoginSuccess(`Logged in successfully as ${role === 'admin' ? 'Administrator' : 'Regular User'}!`);
            }
        } catch (err) {
            console.warn('Quick login error:', err);
            setQuickError(`Quick login failed. Ensure database is seeded with "php artisan db:seed" or use Sign In.`);
        } finally {
            setQuickLoggingIn(null);
        }
    };

    return (
        <section className="landing-hero-section">
            {/* Top Pill / Badge */}
            <div className="hero-pill-badge">
                <span className="hero-pulse-dot" />
                <span className="hero-badge-text">Practical Assessment • PHP 8.2+ / MySQL / React 19</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
                Enterprise Task Management <br />
                <span className="hero-gradient-text">Engineered for Scale & Security</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-description">
                A full-stack, production-grade platform built for the Developer Practical Assessment.
                Featuring stateless Laravel 12 Sanctum token authentication, Role-Based Access Control (RBAC),
                composite-indexed MySQL performance, and a reactive React 19 user interface.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-group">
                <button
                    type="button"
                    className="btn btn-primary hero-btn-main"
                    onClick={() => onOpenAuthModal('login')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    <span>Sign In to Dashboard</span>
                </button>

                <button
                    type="button"
                    className="btn btn-secondary hero-btn-sub"
                    onClick={() => onOpenAuthModal('register')}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    <span>Create User Account</span>
                </button>
            </div>

            {/* Evaluator Quick Access Strip */}
            <div className="evaluator-card">
                <div className="evaluator-header">
                    <div className="evaluator-title">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <strong>Evaluator Instant Demo:</strong> Click below to test either role with pre-seeded accounts:
                    </div>
                </div>

                <div className="evaluator-buttons">
                    <button
                        type="button"
                        className="btn-quick-role btn-quick-admin"
                        disabled={quickLoggingIn !== null}
                        onClick={() => handleQuickLogin('admin', 'sumant@example.com', 'password123')}
                    >
                        {quickLoggingIn === 'admin' ? (
                            <span className="spinner-border" />
                        ) : (
                            <span className="role-chip admin-chip">Admin</span>
                        )}
                        <span>Login as <strong>Sumant (Admin)</strong></span>
                        <span className="hint-arrow">&rarr;</span>
                    </button>

                    <button
                        type="button"
                        className="btn-quick-role btn-quick-user"
                        disabled={quickLoggingIn !== null}
                        onClick={() => handleQuickLogin('user', 'user@example.com', 'password123')}
                    >
                        {quickLoggingIn === 'user' ? (
                            <span className="spinner-border" />
                        ) : (
                            <span className="role-chip user-chip">User</span>
                        )}
                        <span>Login as <strong>Demo User</strong></span>
                        <span className="hint-arrow">&rarr;</span>
                    </button>
                </div>

                {quickError && (
                    <div className="quick-error-text">
                        ⚠️ {quickError}
                    </div>
                )}
            </div>

            {/* 3 Pillars Feature Grid */}
            <div className="hero-features-grid">
                {/* Feature 1 */}
                <div className="feature-card">
                    <div className="feature-icon-wrapper icon-rbac">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h3>Role-Based Access Control</h3>
                    <p>
                        Strict multi-tenant authorization powered by Laravel Sanctum & TaskPolicy. 
                        Regular users are isolated to their own tasks (with 403 Forbidden guards), 
                        while Administrators enjoy full oversight.
                    </p>
                    <div className="feature-tags">
                        <span className="tech-tag">Sanctum Bearer Tokens</span>
                        <span className="tech-tag">Policy Guards (401/403)</span>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="feature-card">
                    <div className="feature-icon-wrapper icon-db">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                    </div>
                    <h3>Optimized MySQL Architecture</h3>
                    <p>
                        Engineered in 3NF with cascading foreign keys and composite B-Tree indexes on 
                        <code>(user_id, status)</code>. Queries are verified via <code>EXPLAIN</code> execution plans 
                        to eliminate table scans.
                    </p>
                    <div className="feature-tags">
                        <span className="tech-tag">Composite Indexing</span>
                        <span className="tech-tag">EXPLAIN Verified</span>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="feature-card">
                    <div className="feature-icon-wrapper icon-react">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                        </svg>
                    </div>
                    <h3>Modern React 19 Frontend</h3>
                    <p>
                        Componentized dashboard featuring smart-placement DatePicker calendar, 
                        real-time status tabs, priority filters, optimistic updates, and accessible modals with loading states.
                    </p>
                    <div className="feature-tags">
                        <span className="tech-tag">React 19 + Vite</span>
                        <span className="tech-tag">Custom DatePicker</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
