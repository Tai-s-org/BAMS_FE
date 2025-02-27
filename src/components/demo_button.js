"use client"

import { Button } from "./ui/Button"
import { useNotifications } from "./ui/Alert"

export function DemoButtons() {
    const { addNotification } = useNotifications()

    const showNotification = (type) => {
        const messages = {
            info: "This is an information notification",
            success: "Operation completed successfully!",
            warning: "Warning: This action cannot be undone",
            error: "Error: Something went wrong",
        }

        addNotification({
            message: messages[type],
            type: type,
        })
    }

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            <Button
                onClick={() => showNotification("info")}
                backgroundColor="bg-blue-100"
                textColor="text-blue-700"
                hoverBackgroundColor="hover:bg-blue-200"
                hoverTextColor="hover:text-blue-800"
            >
                Info Notification
            </Button>

            <Button
                onClick={() => showNotification("success")}
                backgroundColor="bg-green-100"
                textColor="text-green-700"
                hoverBackgroundColor="hover:bg-green-200"
                hoverTextColor="hover:text-green-800"
            >
                Success Notification
            </Button>

            <Button
                onClick={() => showNotification("warning")}
                backgroundColor="bg-yellow-100"
                textColor="text-yellow-700"
                hoverBackgroundColor="hover:bg-yellow-200"
                hoverTextColor="hover:text-yellow-800"
            >
                Warning Notification
            </Button>

            <Button
                onClick={() => showNotification("error")}
                backgroundColor="bg-red-100"
                textColor="text-red-700"
                hoverBackgroundColor="hover:bg-red-200"
                hoverTextColor="hover:text-red-800"
            >
                Error Notification
            </Button>
        </div>
    )
}
