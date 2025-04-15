"use client"

import React, { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-4xl", showCloseButton = true, }) {
    const [isVisible, setIsVisible] = useState(false)

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose()
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape)
            // Prevent scrolling on the body when modal is open
            document.body.style.overflow = "hidden"
            // Animate in
            setIsVisible(true)
        }

        return () => {
            document.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300",
                isVisible ? "opacity-100" : "opacity-0",
            )}
            onClick={onClose}
        >
            <div
                className={cn(
                    "relative w-full max-h-[95vh] overflow-auto bg-white rounded-lg shadow-lg transition-all duration-300",
                    maxWidth,
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {(title || showCloseButton) && (
                    <div className="sticky top-0 flex items-center justify-between bg-white p-4 border-b z-10">
                        {title && <h2 className="text-xl font-bold">{title}</h2>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-6 w-6 text-gray-500" />
                            </button>
                        )}
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}

