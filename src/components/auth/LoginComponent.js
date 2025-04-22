"use client";
import { useState } from "react";
import { useToasts } from "@/hooks/providers/ToastProvider";
import authApi from "@/api/auth";
import FormLogin from "../form/LoginForm";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/context/AuthContext";


export default function LoginComponent() {
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (formData) => {
        setLoading(true);
        try {
            const response = await authApi.signIn(formData);
            addToast({ message: response.data.message, type: "success" });
            console.log(response.data.user);
            login(response.data.user);
            router.push('/check-login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                addToast({ message: error.response.data.message, type: "error" });
            }
            //console.log(error.response);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg shadow-lg w-full h-full">
            <Button
                variant="outline"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-300"
                asChild
            >
                <Link href="/team-dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Link>
            </Button>
            <FormLogin onSubmit={handleLogin} loading={loading}/>
        </div>
    );
}
