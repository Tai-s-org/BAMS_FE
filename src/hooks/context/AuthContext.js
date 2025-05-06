"use client";

import authApi from "@/api/auth";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (user && isInitialized) {
            fetchUserInfo();
        }
    }, [user, isInitialized]);

    // Hàm lấy thông tin user từ API
    const fetchUserInfo = async () => {
        try {
            const response = await authApi.information();
            setUserInfo(response.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
            setUser(null);
            localStorage.removeItem("user");
            await authApi.logout();
            window.location.href = "/login";
        }
    };

    // Hàm login (lưu user & token sau khi đăng nhập)
    const login = (userData, userToken) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Hàm logout 
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
