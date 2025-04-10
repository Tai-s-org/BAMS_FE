"use client"; // ✅ Đánh dấu Client Component

import { useEffect } from "react";
import { LoadingProvider, useLoading } from "@/hooks/context/LoadingContext";
import axiosInstance from "@/api/axios";
import { useRouter } from "next/navigation";

export default function RootLayoutClient({ children }) {
    return (
        <LoadingProvider>
            <LoadingHandler />
            {children}
        </LoadingProvider>
    );
}

// ✅ Thêm component xử lý loading
function LoadingHandler() {
    const { setLoading } = useLoading();
    const router = useRouter();

    useEffect(() => {
        // Interceptor Axios
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                setLoading(true);
                return config;
            },
            (error) => {
                setLoading(false);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                setLoading(false);
                return response;
            },
            (error) => {
                setLoading(false);
                return Promise.reject(error);
            }
        );

        // Xử lý loading khi đổi trang
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        router.events?.on("routeChangeStart", handleStart);
        router.events?.on("routeChangeComplete", handleStop);
        router.events?.on("routeChangeError", handleStop);

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
            router.events?.off("routeChangeStart", handleStart);
            router.events?.off("routeChangeComplete", handleStop);
            router.events?.off("routeChangeError", handleStop);
        };
    }, [setLoading, router]);

    return null;
}
