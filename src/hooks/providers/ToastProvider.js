"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "@/components/ui/toast/ToastContainer";

const ToastContext = createContext(null);

export const ToastProvider = ({ children, position = "top-right" }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, duration: 5000, ...toast };

        setToasts((prev) => [newToast, ...prev]);

        setTimeout(() => {
            removeToast(id);
        }, newToast.duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer position={position} />
        </ToastContext.Provider>
    );
};

export const useToasts = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToasts must be used within a ToastProvider");
    }
    return context;
};
