import { useAuth } from '../context/AuthContext';

export function Navbar({ onOpenCreateModal, onOpenAuthModal }) {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    return (
        <header className="app-navbar">
            <div className="navbar-container">
                {/* Brand / Logo */}
                <div className="navbar-brand">
                    <div className="brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="brand-title">Task Manager</h1>
                        <div className="brand-badges-row">
                            <span className="brand-badge">GOQii App</span>
                            {isAdmin && (
                                <span className="admin-status-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                    Admin Mode
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            {/* Primary Action Button */}
                            <button
                                type="button"
                                className="btn btn-primary btn-add-task"
                                onClick={onOpenCreateModal}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>New Task</span>
                            </button>

                            {/* User Profile Pill */}
                            <div className="navbar-user-info">
                                <span className="nav-avatar">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                                <div className="nav-user-details">
                                    <span className="nav-user-name">{user?.name}</span>
                                    <span className={`nav-role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
                                        {user?.role?.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                type="button"
                                className="btn btn-secondary btn-logout"
                                onClick={logout}
                                title="Sign Out"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                <span>Sign Out</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onOpenAuthModal}
                        >
                            Sign In / Register
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
