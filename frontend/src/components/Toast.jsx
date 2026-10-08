import { useEffect } from 'react';

export function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const isError = toast.type === 'error';

    return (
        <div className={`toast-container ${isError ? 'toast-error' : 'toast-success'}`} role="alert">
            <div className="toast-icon">
                {isError ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="9 12 12 15 16 10" />
                    </svg>
                )}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button type="button" className="toast-close" onClick={onClose} aria-label="Close notification">
                &times;
            </button>
        </div>
    );
}
