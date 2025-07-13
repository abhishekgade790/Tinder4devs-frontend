import React, { createContext, useContext } from 'react';
import Toast from './Toast';
import { useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (toast) => {
        const id = Date.now() + Math.random();
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
        return id;
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const toastAPI = {
        success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
        error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
        warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
        info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
    };

    return (
        <ToastContext.Provider value={toastAPI}>
            {children}
            {/* Render toasts */}
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
