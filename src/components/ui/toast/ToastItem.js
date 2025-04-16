import React, { useState, useEffect } from "react";
import {
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ToastItem = ({ toast, onRemove }) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const duration = toast.duration || 5000;
        const interval = 100;
        const step = (100 * interval) / duration;

        const timer = setInterval(() => {
            setProgress((prev) => (prev <= 0 ? 0 : prev - step));
        }, interval);

        const timeout = setTimeout(onRemove, duration);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }, [toast.duration, onRemove]);

    const type = toast.type?.toLowerCase();

    const getIcon = () => {
        switch (type) {
            case "success":
                return <FaCheckCircle className="w-5 h-5" />;
            case "warning":
                return <FaExclamationTriangle className="w-5 h-5" />;
            case "error":
            case "failed":
                return <FaTimesCircle className="w-5 h-5" />;
            default:
                return <FaInfoCircle className="w-5 h-5" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "success":
                return "bg-green-100 border-green-500 text-green-700";
            case "warning":
                return "bg-yellow-100 border-yellow-500 text-yellow-700";
            case "error":
            case "failed":
                return "bg-red-100 border-red-500 text-red-700";
            default:
                return "bg-blue-100 border-blue-500 text-blue-700";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-lg shadow-lg ${getBgColor()} border-l-4`}
        >
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    {getIcon()}
                    <span className="ml-3 font-medium">{toast.message}</span>
                </div>
                <button
                    onClick={onRemove}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>
            <div
                className="absolute bottom-0 left-0 h-1 bg-current"
                style={{
                    width: `${progress}%`,
                    transition: "width 100ms linear",
                }}
            />
        </motion.div>
    );
};

export default ToastItem;
