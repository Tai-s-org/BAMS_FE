"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import Link from "next/link"
import registrationSessionApi from "@/api/registrationSession"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail } from "lucide-react"
import { useToasts } from "@/hooks/providers/ToastProvider"

export default function Register() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const [role, setRole] = useState("")
    const [error, setError] = useState("")
    const { addToast } = useToasts()


    useEffect(() => {
        const sessionId = localStorage.getItem("session")
        const storedRole = localStorage.getItem("role")

        setRole(storedRole)
        setSessionId(sessionId)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        if (!email) {
            setError("Please enter your email")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address")
            return
        }

        try {
            let response;

            if (role === "manager") {
                response = await registrationSessionApi.validateManagerEmailAndSendOtp(sessionId, email);
            } else {
                response = await registrationSessionApi.validatePlayerEmailAndSendOtp({
                    "email": email,
                    "memberSessionId": sessionId,
                });
            }

            const resData = response.data;
            console.log(response);
            localStorage.setItem("email", email);
            addToast({ message: resData.message, type: "success" });
            router.push("/register/verify");
        } catch (error) {
            addToast({ message: error.response.data.errors.errorEmail, type: "error" });
        } finally {
            setIsSubmitting(false)
        }
    }

    

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center mb-2">
                        <Link href="/" className="mr-2">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <CardTitle>Đăng ký {role === "player" ? "Cầu thủ" : "Quản lý"}</CardTitle>
                    </div>
                    <CardDescription>Nhập email của bạn để tiếp tục</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="yenhoastorm@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button" onClick={() => router.back()}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            <Mail className="mr-2 h-5 w-5" />
                            {isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>

    )
}
