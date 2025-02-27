"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { AiOutlineClose } from "react-icons/ai" // Sử dụng icon "close" từ react-icons

// Create context
const NotificationContext = createContext(undefined)

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([])

    const addNotification = useCallback((notification) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newNotification = {
            id,
            duration: 5000, // Default duration
            type: "info", // Default type
            ...notification,
        }

        // Add new notification at the beginning of the array
        setNotifications((prev) => [newNotification, ...prev])
    }, [])

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    }, [])

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    )
}

// Custom hook to use notifications
export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider")
    }
    return context
}

// Individual notification component
const NotificationItem = ({ notification, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(
            () => {
                setIsExiting(true)
            },
            notification.duration ? notification.duration - 500 : 4500,
        )

        const removeTimer = setTimeout(() => {
            onRemove()
        }, notification.duration || 5000)

        return () => {
            clearTimeout(timer)
            clearTimeout(removeTimer)
        }
    }, [notification.duration, onRemove])

    // Determine background color based on notification type
    const getBgColor = () => {
        switch (notification.type) {
            case "success":
                return "bg-green-500"
            case "warning":
                return "bg-yellow-500"
            case "error":
                return "bg-red-500"
            default:
                return "bg-blue-500"
        }
    }

    return (
        <div
            className={`flex items-center justify-between p-4 mb-3 rounded-lg shadow-lg text-white
        ${getBgColor()}
        transition-all duration-500 ease-in-out
        ${isExiting ? "opacity-0 translate-x-full" : "opacity-100"}`}
        >
            <p>{notification.message}</p>
            <button onClick={onRemove} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
                <AiOutlineClose size={16} /> {/* Icon đóng từ react-icons */}
            </button>
        </div>
    )
}

// Container for all notifications
const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse w-80">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    )
}
