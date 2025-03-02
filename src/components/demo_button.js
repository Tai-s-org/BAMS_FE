"use client";

import { Button } from "./ui/Button";
import { useToasts } from "@/providers/ToastProvider";

export function DemoButtons() {
    const { addToast } = useToasts(); 

    const showToast = (type) => {
        const messages = {
            info: "This is an information toast",
            success: "Operation completed successfully!",
            warning: "Warning: This action cannot be undone",
            error: "Error: Something went wrong",
        };

        addToast({
            message: messages[type],
            type: type,
        });
    };

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            <Button
                onClick={() => showToast("info")} 
                backgroundColor="bg-blue-100"
                textColor="text-blue-700"
                hoverBackgroundColor="hover:bg-blue-200"
                hoverTextColor="hover:text-blue-800"
            >
                Info Toast
            </Button>

            <Button
                onClick={() => showToast("success")}
                backgroundColor="bg-green-100"
                textColor="text-green-700"
                hoverBackgroundColor="hover:bg-green-200"
                hoverTextColor="hover:text-green-800"
            >
                Success Toast
            </Button>

            <Button
                onClick={() => showToast("warning")}
                backgroundColor="bg-yellow-100"
                textColor="text-yellow-700"
                hoverBackgroundColor="hover:bg-yellow-200"
                hoverTextColor="hover:text-yellow-800"
            >
                Warning Toast
            </Button>

            <Button
                onClick={() => showToast("error")}
                backgroundColor="bg-red-100"
                textColor="text-red-700"
                hoverBackgroundColor="hover:bg-red-200"
                hoverTextColor="hover:text-red-800"
            >
                Error Toast
            </Button>
        </div>
    );
}
