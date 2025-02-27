"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaTimes } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children, position = "top-right" }) => {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback((notification) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newNotification = { id, duration: 5000, ...notification }

        setNotifications((prev) => [newNotification, ...prev])

        setTimeout(() => {
            removeNotification(id)
        }, newNotification.duration)
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <NotificationContainer position={position} />
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}

const NotificationContainer = ({ position }) => {
    const { notifications, removeNotification } = useNotifications()

    const positionClasses = {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
    }[position]

    return (
        <div className={`fixed ${positionClasses} z-50 flex flex-col gap-2 w-80`}>
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onRemove={() => removeNotification(notification.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

const NotificationItem = ({ notification, onRemove }) => {
    const [progress, setProgress] = useState(100)

    useEffect(() => {
        const duration = notification.duration || 5000
        const interval = 100
        const step = (100 * interval) / duration

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer)
                    return 0
                }
                return prev - step
            })
        }, interval)

        const timeout = setTimeout(onRemove, duration)

        return () => {
            clearInterval(timer)
            clearTimeout(timeout)
        }
    }, [notification.duration, onRemove])

    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return <FaCheckCircle className="w-5 h-5" />
            case "warning":
                return <FaExclamationTriangle className="w-5 h-5" />
            case "error":
                return <FaTimesCircle className="w-5 h-5" />
            default:
                return <FaInfoCircle className="w-5 h-5" />
        }
    }

    const getBgColor = () => {
        switch (notification.type) {
            case "success":
                return "bg-green-100 border-green-500 text-green-700"
            case "warning":
                return "bg-yellow-100 border-yellow-500 text-yellow-700"
            case "error":
                return "bg-red-100 border-red-500 text-red-700"
            default:
                return "bg-blue-100 border-blue-500 text-blue-700"
        }
    }

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
                    <span className="ml-3 font-medium">{notification.message}</span>
                </div>
                <button onClick={onRemove} className="text-gray-500 hover:text-gray-700">
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-current" style={{ width: `${progress}%`, transition: "width 100ms linear" }} />
        </motion.div>
    )
}
