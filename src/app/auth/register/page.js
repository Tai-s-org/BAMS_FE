'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import registrationSessionApi from "@/api/registrationSession"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function RegisterPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const memberRegistrationSessionId = localStorage.getItem("memberRegistrationSessionId");
    const { addToast } = useToasts();

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email) {
            setError("Please enter your email")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const response =  await registrationSessionApi.validateEmailAndSendOtp(memberRegistrationSessionId, email )
            console.log(response.data);
            // Store email in localStorage to use in OTP page
            localStorage.setItem("userEmail", email)
            addToast({ message: response.data.message, type: "success" });
            // Navigate to OTP verification page
            router.push("/auth/register/verify")

        } catch (err) {
            //setError("Something went wrong. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Đăng ký</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={cn(
                                    "w-full rounded-md border px-4 py-3 text-base",
                                    "focus:border-[#bd2427] focus:outline-none focus:ring-1 focus:ring-[#bd2427]",
                                    error ? "border-red-500" : "border-gray-300",
                                )}
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center rounded-md bg-[#bd2427] px-4 py-3 text-white hover:bg-[#27272a] focus:outline-none focus:ring-2 focus:ring-[#bd2427] focus:ring-offset-2 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Otp sẽ được gửi đến email trong ít phút...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Mail className="mr-2 h-5 w-5" />
                                Xác nhận Email
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}



