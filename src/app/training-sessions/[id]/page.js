"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/context/AuthContext";

// Sample data
const trainingSessions = [
    {
        id: 1,
        name: "Luyện Tập Ném Rổ",
        team: "Đội Chính",
        court: "Sân A",
        day: new Date(2025, 2, 17), // 17/3/2025
        startTime: "16:00",
        endTime: "17:00",
        coach: "Nguyễn Văn A",
        description:
            "Tập trung vào cải thiện độ chính xác và kỹ thuật ném rổ. Cầu thủ sẽ luyện tập ném phạt, ném ba điểm và ném tầm trung.",
        equipment: ["Bóng rổ", "Máy ném bóng", "Cọc tiêu"],
    },
    {
        id: 2,
        name: "Bài Tập Phòng Thủ",
        team: "Đội Trẻ",
        court: "Sân B",
        day: new Date(2025, 2, 17), // 17/3/2025
        startTime: "17:30",
        endTime: "19:00",
        coach: "Trần Thị B",
        description:
            "Vị trí và kỹ thuật phòng thủ. Tập trung vào phòng thủ người đối người, phòng thủ hỗ trợ và luân chuyển phòng thủ.",
        equipment: ["Bóng rổ", "Áo tập", "Còi"],
    },
    {
        id: 3,
        name: "Đấu Tập",
        team: "Đội Chính",
        court: "Sân A",
        day: new Date(2025, 2, 18), // 18/3/2025
        startTime: "15:00",
        endTime: "17:00",
        coach: "Nguyễn Văn A",
        description: "Đấu tập toàn sân để luyện tập các tình huống trận đấu và chiến thuật đội.",
        equipment: ["Bóng rổ", "Áo tập", "Bảng điểm"],
    },
    {
        id: 4,
        name: "Tập Thể Lực",
        team: "Tất Cả Đội",
        court: "Sân C",
        day: new Date(2025, 2, 19), // 19/3/2025
        startTime: "16:30",
        endTime: "18:00",
        coach: "Lê Văn C",
        description: "Các bài tập sức mạnh và thể lực để cải thiện thể chất và sức bền tổng thể.",
        equipment: ["Thang nhanh nhẹn", "Dây kháng lực", "Cọc tiêu", "Dây nhảy"],
    },
    {
        id: 5,
        name: "Luyện Ném Phạt",
        team: "Đội Trẻ",
        court: "Sân B",
        day: new Date(2025, 2, 20), // 20/3/2025
        startTime: "15:30",
        endTime: "16:30",
        coach: "Trần Thị B",
        description: "Buổi tập tập trung vào kỹ thuật ném phạt và chuẩn bị tâm lý.",
        equipment: ["Bóng rổ"],
    },
    {
        id: 6,
        name: "Chiến Thuật Trận Đấu",
        team: "Đội Chính",
        court: "Sân A",
        day: new Date(2025, 2, 21), // 21/3/2025
        startTime: "17:00",
        endTime: "19:00",
        coach: "Nguyễn Văn A",
        description: "Xem lại video trận đấu và lập kế hoạch chiến thuật cho các trận đấu sắp tới.",
        equipment: ["Bảng chiến thuật", "Thiết bị video", "Bóng rổ"],
    },
];

export default function TrainingSessionDetail() {
    const {user} = useAuth();

    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Find the session with the corresponding ID
        const id = Number(params.id);
        const foundSession = trainingSessions.find((s) => s.id === id);

        if (foundSession) {
            setSession(foundSession);
        } else {
            // Handle case when session is not found
            router.push("/schedules");
        }
    }, [params.id, router]);

    if (!session) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD2427]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex items-center">
                    <Link href={"/schedules"}>
                        <button
                            className="mr-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay Lại Lịch
                        </button>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900">{session.name}</h1>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Session Details Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Chi Tiết Buổi Tập</h2>
                            </div>

                            <div className="px-6 py-5">
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-[#BD2427]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">Ngày</div>
                                            <div className="text-sm text-gray-500">
                                                {format(new Date(session.day), "EEEE, dd/MM/yyyy", { locale: vi })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-[#BD2427]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">Thời gian</div>
                                            <div className="text-sm text-gray-500">
                                                {session.startTime} - {session.endTime}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-[#BD2427]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">Đội</div>
                                            <div className="text-sm text-gray-500">{session.team}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                            <svg
                                                className="h-5 w-5 text-[#BD2427]"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">Địa điểm</div>
                                            <div className="text-sm text-gray-500">{session.court}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-6 pt-6">
                                    <h3 className="text-base font-medium text-gray-900 mb-2">Mô Tả</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{session.description}</p>
                                </div>

                                {/* Coach */}
                                <div className="mb-6">
                                    <h3 className="text-base font-medium text-gray-900 mb-2">Huấn Luyện Viên</h3>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 font-medium">{session.coach.charAt(0)}</span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{session.coach}</div>
                                            <div className="text-xs text-gray-500">Huấn Luyện Viên</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions Card */}
                        {user?.roleCode === "Coach" && <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Thao Tác</h2>
                            </div>
                            <div className="px-6 py-5 space-y-4">
                                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200">
                                    Chỉnh Sửa Buổi Tập
                                </button>
                                <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200">
                                    Hủy Buổi Tập
                                </button>
                            </div>
                        </div>}

                        {/* Attendance Card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Điểm Danh</h2>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-sm text-gray-500 mb-4">Theo dõi điểm danh cho buổi tập này.</p>
                                <button 
                                className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                                onClick={() => {}}
                                >
                                    Quản Lý Điểm Danh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}