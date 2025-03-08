import React from "react";
import { AnimatePresence } from "framer-motion";
import { useToasts } from "@/hooks/providers/ToastProvider";
import ToastItem from "./ToastItem";

const ToastContainer = ({ position }) => {
    const { toasts, removeToast } = useToasts();

    const positionClasses = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
    }[position];

    return (
        <div className={`fixed ${positionClasses} z-50 flex flex-col gap-2 w-80`}>
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
