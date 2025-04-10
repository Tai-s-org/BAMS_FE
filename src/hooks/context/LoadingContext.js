"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loading from "@/components/ui/Loading";

const LoadingContext = createContext({
    loading: false,
    setLoading: () => { },
});

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); // Fake delay để hiển thị loading
        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {loading && (
                // <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
                //     <div className="relative w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                // </div>
                <Loading />
            )}
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingContext);
}
