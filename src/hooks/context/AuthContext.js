"use client";

import authApi from "@/api/auth";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchUserInfo();
        }
    }, []);

    // Hàm lấy thông tin user từ API
    const fetchUserInfo = async () => {
        try {
            const response = await authApi.information();
            setUserInfo(response.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
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
