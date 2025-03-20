import { NextResponse } from "next/server";
import { jwt_decode } from "jwt-decode"; // Dùng để giải mã token mà không cần secret key

// Danh sách route cần bảo vệ theo role
const protectedRoutes = {
    manager: ["/dashboard"],
    user: ["/profile", "/orders"],
};

// Key chứa role trong token
const ROLE_KEY = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export function middleware(req) {
    // const token = req.cookies.get("AccessToken");

    // if (!token) {
    //     return NextResponse.redirect(new URL("/login", req.url)); // Chưa đăng nhập
    // }

    // try {
    //     // Giải mã token để lấy thông tin user (Không cần secret key)
    //     const decoded = jwt_decode(token);
    //     const userRole = decoded[ROLE_KEY]; // Lấy role từ token
    //     console.log(token + " / " + userRole);


    //     const pathname = req.nextUrl.pathname;

    //     // Kiểm tra role có quyền vào route không
    //     if (userRole && protectedRoutes[userRole]) {
    //         const allowedRoutes = protectedRoutes[userRole];

    //         if (!allowedRoutes.includes(pathname)) {
    //             return NextResponse.redirect(new URL("/403", req.url)); // Không có quyền
    //         }
    //     }
    // } catch (error) {
    //     console.error("JWT Decode Error:", error);
    //     return NextResponse.redirect(new URL("/login", req.url)); // Token lỗi hoặc hết hạn
    // }

    // return NextResponse.next();
}

// Áp dụng middleware cho các route cần bảo vệ
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/orders/:path*"],
};
