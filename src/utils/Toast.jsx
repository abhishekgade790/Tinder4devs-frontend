import React, { useState, useEffect } from 'react';

// Toast Component
const Toast = ({
    type = 'success',
    message,
    description = '',
    duration = 4000,
    onClose,
    position = 'top-right',
    showIcon = true,
    closable = true
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    };

    if (!isVisible) return null;

    const getToastStyles = () => {
        const baseStyles = 'alert shadow-xl border-l-4 transition-all duration-300 transform backdrop-blur-sm';
        const animationStyles = isAnimating
            ? 'opacity-0 translate-x-full scale-95'
            : 'opacity-100 translate-x-0 scale-100';

        switch (type) {
            case 'success':
                return `${baseStyles} bg-success text-success-content border-success-content/30 ${animationStyles}`;
            case 'error':
                return `${baseStyles} bg-error text-error-content border-error-content/30 ${animationStyles}`;
            case 'warning':
                return `${baseStyles} bg-warning text-warning-content border-warning-content/30 ${animationStyles}`;
            case 'info':
                return `${baseStyles} bg-info text-info-content border-info-content/30 ${animationStyles}`;
            default:
                return `${baseStyles} bg-success text-success-content border-success-content/30 ${animationStyles}`;
        }
    };

    const getIcon = () => {
        if (!showIcon) return null;

        switch (type) {
            case 'success':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getPositionStyles = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'top-4 right-4';
        }
    };

    return (
        <div className={`toast toast-${position} z-50`}>
            <div className={`${getToastStyles()} min-w-80 max-w-md`}>
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                        <div className="font-semibold text-sm">{message}</div>
                        {description && (
                            <div className="text-xs opacity-80 mt-1">{description}</div>
                        )}
                    </div>
                    {closable && (
                        <button
                            onClick={handleClose}
                            className="btn btn-ghost btn-xs btn-circle hover:bg-base-100/20 text-current"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                {duration > 0 && (
                    <div className="mt-3 w-full bg-base-100/20 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-current/80 h-full rounded-full transition-all ease-linear shadow-sm"
                            style={{
                                width: '100%',
                                animation: `shrink ${duration}ms linear forwards`
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};



export default Toast;