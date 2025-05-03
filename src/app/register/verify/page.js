"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import otpApi from "@/api/otp"
import { useToasts } from "@/hooks/providers/ToastProvider"
import registrationSessionApi from "@/api/registrationSession"

export default function VerifyOTP() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [data, setData] = useState("")
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const { addToast } = useToasts();
    const [sessionId, setSessionId] = useState("")

    // 🧠 Lấy email + role từ localStorage khi component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem("email")
        const storedRole = localStorage.getItem("role")
        const sessionId = localStorage.getItem("session")

        if (!storedEmail || !storedRole) {
            router.push("/")
            return
        }

        setEmail(storedEmail)
        setRole(storedRole)
        setSessionId(sessionId)
    }, [router])

    // ⏳ Đếm ngược
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    setCanResend(true)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1)
        if (value && !/^\d+$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }

        // Auto-submit when all fields are filled
        if (index === 5 && value && !newOtp.includes("")) {
            handleVerify(newOtp)
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
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


    //auto verify 
    const handleVerify = async (otpArray) => {
        const otpString = otpArray.join("")
        if (otpString.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }

        setIsSubmitting(true)

        try {
            const roleForm = (role === "manager" ? "ManagerRegistrationForm" : "PlayerRegistrationForm")
            //Call API to verify the OTP
            const response = await otpApi.verifyEmailCode({
                email: email,
                code: otpString,
                purpose: roleForm,
                memberRegistrationSessionId: sessionId
            })

            addToast({ message: response.data.message, type: "success" });
            console.log(response.data);

            if (response.data.data.items[0]) {
                setData(response.data.data.items[0])
                setShowSaveDialog(true);
            } else {
                localStorage.removeItem("formData");
                router.push("/register/form")
            }


        } catch (error) {
            if (error.response.data?.message === null) {
                Object.entries(error.response.data?.errors).forEach(([key, value]) => {
                    const msg = String(`${key}: ${value}`).split(":")[1]?.trim();
                    addToast({ message: value, type: "error" });
                    console.log(value);

                });
            } else {
                addToast({ message: error.response.data?.message, type: "error" });
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpValue = otp.join("")
        if (otpValue.length !== 6) return

        setIsSubmitting(true)
        try {
            //API verify otp
            //const isValid = await verifyOTP(email, otpValue)
            if (isValid) {
                router.push(`/register/form`)
            } else {
                alert("Mã OTP không hợp lệ. Vui lòng thử lại.")
                setOtp(["", "", "", "", "", ""])
            }
        } catch (err) {
            console.error("OTP Error", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendOTP = async () => {
        if (!canResend) return
        try {
            //API send otp
            if (role === "manager") {
                response = await registrationSessionApi.validateManagerEmailAndSendOtp(sessionId, email);
            } else {
                response = await registrationSessionApi.validatePlayerEmailAndSendOtp({
                    "email": email,
                    "memberSessionId": sessionId,
                });
            }
            setTimeLeft(300)
            setCanResend(false)
            setOtp(["", "", "", "", "", ""])
        } catch (err) {
            console.error("Resend OTP error:", err)
        }
    }


    const handleUpdate = async () => {
        localStorage.setItem("formData", JSON.stringify(data))
        router.push("/register/form");
        setShowSaveDialog(false)
    }

    const handleCreate = async () => {
        localStorage.removeItem("formData");
        router.push("/register/form");
        setShowSaveDialog(false)
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center mb-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/register`)}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle className="ml-2">Xác thực email</CardTitle>
                    </div>
                    <CardDescription>Chúng tôi đã gửi mã xác thực đến {email}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label>Nhập mã xác thực (OTP)</Label>
                                <div className="flex gap-2 justify-between">
                                    {otp.map((digit, index) => (
                                        <Input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className="w-12 h-12 text-center text-xl"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="text-center text-sm">
                                {canResend ? (
                                    <Button variant="link" className="p-0 h-auto" onClick={handleResendOTP}>
                                        Gửi lại mã
                                    </Button>
                                ) : (
                                    <p>Gửi lại mã sau {formatTime(timeLeft)}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    {/* <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.push(`/register`)}>
                            Quay lại
                        </Button>
                        <Button type="submit" disabled={isSubmitting || otp.some((digit) => !digit)}>
                            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
                        </Button>
                    </CardFooter> */}
                </form>
            </Card>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thông báo</DialogTitle>
                        <DialogDescription>Chúng tôi ghi nhận trong đợt tuyển quân này đã có đơn đăng kí của bạn. Bạn muốn điền đơn mới hay chỉnh sửa đơn đã tồn tại ?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCreate}>
                            Tạo mới
                        </Button>
                        <Button onClick={handleUpdate}>Cập nhật đơn</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}


