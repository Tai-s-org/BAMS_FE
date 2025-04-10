"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import otpApi from "@/api/otp"
import { Modal } from "@/components/ui/Modal"
import ManagerRegistrationForm from "@/components/member-registration/manager-registration/ManagerRegistrationForm"
import PlayerRegistrationForm from "@/components/member-registration/player-registration/PlayerRegistrationForm"

export default function VerifyPage() {
    const [otp, setOtp] = useState(Array(6).fill(""))
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [registrationType, setRegistrationType] = useState("")
    const inputRefs = useRef([])
    const router = useRouter()

    // Get email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail")
        if (!storedEmail) {
            // Redirect back to login if no email is found
            router.push("/auth/register")
            return
        }
        setEmail(storedEmail)

        // Focus the first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [router])

    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        // Take only the last character if multiple are pasted
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)

        // Move to next input if current field is filled
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus()
        }

        // Auto-submit when all fields are filled
        if (index === 5 && value && !newOtp.includes("")) {
            handleVerify(newOtp)
        }
    }

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current field is empty
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text")
        if (!/^\d+$/.test(pastedData)) return

        const digits = pastedData.slice(0, 6).split("")
        const newOtp = [...otp]

        digits.forEach((digit, index) => {
            if (index < 6) {
                newOtp[index] = digit
            }
        })

        setOtp(newOtp)

        // Focus the appropriate input after paste
        if (digits.length < 6 && inputRefs.current[digits.length]) {
            inputRefs.current[digits.length].focus()
        }

        // Auto-submit when all fields are filled by paste
        if (digits.length === 6) {
            handleVerify(newOtp)
        }
    }

    const handleVerify = async (otpArray) => {
        const otpString = otpArray.join("")
        if (otpString.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            // Call API to verify the OTP
            const response = await otpApi.verifyEmailCode({
                email: email,
                code: otpString,
                purpose: "ManagerRegistrationForm",
            })

            console.log(response.data)

            // Get registration role from localStorage
            const registrationRoleCode = localStorage.getItem("registraionRoleCode")

            // Show the appropriate form based on role
            if (registrationRoleCode === "player") {
                setRegistrationType("player")
                setShowModal(true)
            } else if (registrationRoleCode === "manager") {
                setRegistrationType("manager")
                setShowModal(true)
            } else {
                console.log("Unknown role:", registrationRoleCode)
                setError("Unknown registration role. Please try again.")
            }
        } catch (err) {
            setError("Invalid verification code. Please try again.")
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        router.push("/auth/register")
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h1 className="text-3xl font-bold">Verification</h1>

                    <p className="text-gray-600">
                        If you have an account, we have sent a code to
                        <br />
                        <span className="font-medium text-gray-800">{email}</span>.
                        <br />
                        Enter it below.
                    </p>

                    <div className="flex justify-center gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                disabled={isLoading}
                                className={cn(
                                    "h-14 w-14 rounded-md border text-center text-xl font-semibold",
                                    "focus:border-[#bd2427] focus:outline-none focus:ring-1 focus:ring-[#bd2427]",
                                    error ? "border-red-500" : "border-gray-300",
                                    isLoading && "opacity-50",
                                )}
                            />
                        ))}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    {isLoading && (
                        <div className="flex justify-center">
                            <svg className="h-6 w-6 animate-spin text-[#bd2427]" viewBox="0 0 24 24">
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
                        </div>
                    )}

                    <button
                        className="inline-flex items-center text-[#bd2427] hover:underline disabled:opacity-50"
                        onClick={handleBack}
                        disabled={isLoading}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </button>
                </div>
            </div>

            {/* Using the Modal component */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title={registrationType === "player" ? "Đăng ký cầu thủ" : "Đăng Ký Quản Lý"}
            >
                {registrationType === "manager" && <ManagerRegistrationForm />}
                {registrationType === "player" && <PlayerRegistrationForm />}
            </Modal>
        </>
    )
}

