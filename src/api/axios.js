import axios from "axios";
import { useLoading } from "@/hooks/context/LoadingContext";
import authApi from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Để gửi cookie nếu backend yêu cầu
});

export function setupAxiosInterceptors() {
    const { setLoading } = useLoading();

    axiosInstance.interceptors.request.use(
        (config) => {
            setLoading(true);
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            setLoading(false);
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            setLoading(false);
            return response;
        },
        async (error) => {
            setLoading(false);
            const originalRequest = error.config;

            // Nếu bị lỗi 401 và chưa retry lần nào
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    // Gọi API refresh token (cookie đã được gửi kèm nhờ withCredentials: true)
                    const res = await authApi.refreshToken();

                    const newAccessToken = res.data.accessToken;

                    // Lưu lại access token mới vào cookie
                    document.cookie = `token=${newAccessToken}; path=/`;

                    // Cập nhật token mới cho request gốc
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Gửi lại request cũ
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed", refreshError);
                    // Nếu refresh cũng fail → redirect về login
                    window.location.href = "/login";
                }
            }

            return Promise.reject(error);
        }
    );
}

export default axiosInstance;
