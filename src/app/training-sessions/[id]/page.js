"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format, set } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowLeft, UserCheck, Check, X, Clock1, Edit, ListChecks, Plus } from "lucide-react"
import Link from "next/link";
import { useAuth } from "@/hooks/context/AuthContext";
import Image from "next/image";
import { EditSessionModal } from "@/components/schedule/EditSessionModal"
import { ExerciseManagementModal } from "@/components/schedule/ExerciseManagementModal"
import scheduleApi from "@/api/schedule";
import courtApi from "@/api/court";
import coachApi from "@/api/coach";

// Dữ liệu mẫu
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
]

// Dữ liệu mẫu cho huấn luyện viên
const coaches = [
    { id: 1, name: "Nguyễn Văn A", role: "Huấn Luyện Viên Trưởng", status: "present" },
    { id: 2, name: "Trần Thị B", role: "Huấn Luyện Viên Phụ", status: "absent" },
    { id: 3, name: "Lê Văn C", role: "Huấn Luyện Viên Thể Lực", status: "late" },
]

// Dữ liệu mẫu cho cầu thủ
const players = [
    { id: 1, name: "Phạm Văn D", number: 5, position: "Hậu vệ", team: "Đội Chính", status: "present" },
    { id: 2, name: "Hoàng Thị E", number: 7, position: "Tiền vệ", team: "Đội Chính", status: "present" },
    { id: 3, name: "Đỗ Văn F", number: 10, position: "Tiền đạo", team: "Đội Chính", status: "absent" },
    { id: 4, name: "Ngô Thị G", number: 12, position: "Hậu vệ", team: "Đội Chính", status: "late" },
    { id: 5, name: "Vũ Văn H", number: 15, position: "Tiền vệ", team: "Đội Chính", status: "present" },
    { id: 6, name: "Đinh Thị I", number: 3, position: "Tiền đạo", team: "Đội Trẻ", status: "present" },
    { id: 7, name: "Bùi Văn J", number: 8, position: "Hậu vệ", team: "Đội Trẻ", status: "absent" },
    { id: 8, name: "Lý Thị K", number: 11, position: "Tiền vệ", team: "Đội Trẻ", status: "present" },
    { id: 9, name: "Dương Văn L", number: 14, position: "Tiền đạo", team: "Đội Trẻ", status: "late" },
    { id: 10, name: "Đặng Thị M", number: 20, position: "Hậu vệ", team: "Đội Trẻ", status: "present" },
]

// Dữ liệu mẫu cho bài tập
const exercises = [
    {
        id: "1",
        trainingSessionId: "1",
        exerciseName: "Khởi động",
        description: "Chạy nhẹ quanh sân và các bài tập khởi động cơ bản",
        duration: 15,
        coachId: "1",
    },
    {
        id: "2",
        trainingSessionId: "1",
        exerciseName: "Ném rổ cơ bản",
        description: "Luyện tập kỹ thuật ném rổ cơ bản từ các vị trí khác nhau",
        duration: 30,
        coachId: "2",
    },
    {
        id: "3",
        trainingSessionId: "1",
        exerciseName: "Phòng thủ cá nhân",
        description: "Luyện tập kỹ thuật phòng thủ 1-1",
        duration: 25,
        coachId: "3",
    },
    {
        id: "4",
        trainingSessionId: "2",
        exerciseName: "Khởi động",
        description: "Chạy nhẹ quanh sân và các bài tập khởi động cơ bản",
        duration: 15,
        coachId: "2",
    },
    {
        id: "5",
        trainingSessionId: "2",
        exerciseName: "Phòng thủ khu vực",
        description: "Luyện tập kỹ thuật phòng thủ khu vực",
        duration: 35,
        coachId: "2",
    },
]

export default function TrainingSessionDetail() {
    const { user, userInfo } = useAuth();

    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [showAttendance, setShowAttendance] = useState(false)
    const [filteredPlayers, setFilteredPlayers] = useState([])
    const [sessionExercises, setSessionExercises] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
    const [courts, setCourts] = useState([])
    const [coaches, setCoaches] = useState([])

    const fetchCoaches = async () => {
        try {
            if (session) {
                const response = await coachApi.listCoaches({ TeamId: userInfo?.roleInformation.teamId });
                console.log("fetchCoaches", response?.data.data.items);
                setCoaches(response?.data.data.items);
            }
        } catch (error) {
            console.error("Error fetching coaches:", error)
        }
    }

    const fetchCourts = async () => {
        try {
            const response = await courtApi.courtList()
            const filteredCourt = response?.data.items.filter((court) => court.usagePurpose == "2" || court.usagePurpose == "3");
            setCourts(filteredCourt);
        } catch (error) {
            console.error("Error fetching courts:", error)
        }
    }

    useEffect(() => {
        fetchCourts()
        fetchCoaches()
    }, [session])

    useEffect(() => {
        // Tìm buổi tập với ID tương ứng
        const id = params.id
        fetchTrainingSession(id);
        // const foundSession = trainingSessions.find((s) => s.id === id)
        const foundSession = {
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
        }

        if (foundSession) {
            // Lọc cầu thủ theo đội của buổi tập
            const teamPlayers = players.filter(
                (player) => foundSession.team === "Tất Cả Đội" || player.team === foundSession.team,
            )
            setFilteredPlayers(teamPlayers)

        } else {
            // Xử lý khi không tìm thấy buổi tập
            router.push("/schedules")
        }
    }, [params.id, router])

    const fetchTrainingSession = async (id) => {
        try {
            const response = await scheduleApi.getTrainingSessionById(id);
            console.log("TrainingSessionDetail", response?.data.data);
            setSession(response?.data.data);
            setSessionExercises(response?.data.data.exercises);
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "present":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Có mặt
                    </span>
                )
            case "absent":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <X className="mr-1 h-3 w-3" />
                        Vắng mặt
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Chưa điểm danh
                    </span>
                )
        }
    }

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
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Session Details Card */}
                        {session && <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                                                {session.scheduledDate}
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
                                                {session.time}
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
                                            <div className="text-sm text-gray-500">{session.teamName}</div>
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
                                            <div className="text-sm text-gray-500">{session.court.courtName}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-5 border-t border-gray-200 w-full">
                                    <div className="relative w-full h-64">
                                        <Image
                                            src={process.env.NEXT_PUBLIC_IMAGE_API_URL + session.court.imageUrl}
                                            alt="Court Image"
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="relative ">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                </div>

                                {/* Danh sách bài tập */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-4 mt-4">
                                        <h3 className="text-base font-medium text-gray-900">Danh Sách Bài Tập</h3>
                                    </div>

                                    {sessionExercises.length > 0 ? (
                                        <div className="space-y-4">
                                            {sessionExercises.map((exercise) => (
                                                <div key={exercise.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-base font-medium text-gray-900">{exercise.exerciseName}</h4>
                                                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#BD2427]/10 text-[#BD2427]">
                                                            <Clock1 className="mr-1 h-3 w-3" />
                                                            {exercise.duration} phút
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">{exercise.description}</p>
                                                    <div className="text-xs text-gray-500">
                                                        <span className="font-medium">HLV:</span>{" "}
                                                        {exercise.coachUsername}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        userInfo?.roleInformation.teamId === session.teamId && <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                            <p className="text-sm text-gray-500">Chưa có bài tập nào được thêm vào.</p>
                                            <button
                                                onClick={() => setExerciseModalOpen(true)}
                                                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-[#BD2427] hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
                                            >
                                                <Plus className="mr-1 h-3 w-3" />
                                                Thêm bài tập
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>}
                        {/* Attendance List */}
                        {showAttendance && (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-800">Điểm Danh Buổi Tập</h2>
                                    <button onClick={() => setShowAttendance(false)} className="text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="px-6 py-5">
                                    {/* Summary */}
                                    <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="bg-green-50 rounded-lg p-3 flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                <Check className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-800">Có mặt</p>
                                                <p className="text-xl font-semibold text-green-900">
                                                    {coaches.filter((c) => c.status === "present").length +
                                                        filteredPlayers.filter((p) => p.status === "present").length}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-red-50 rounded-lg p-3 flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                                <X className="h-5 w-5 text-red-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-red-800">Vắng mặt</p>
                                                <p className="text-xl font-semibold text-red-900">
                                                    {coaches.filter((c) => c.status === "absent").length +
                                                        filteredPlayers.filter((p) => p.status === "absent").length}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <UserCheck className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-800">Tổng</p>
                                                <p className="text-xl font-semibold text-gray-900">{coaches.length + filteredPlayers.length}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coaches */}
                                    <div className="mb-6">
                                        <h3 className="text-base font-medium text-gray-900 mb-3">Huấn Luyện Viên</h3>
                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Tên
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Chức vụ
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Trạng thái
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {coaches.map((coach) => (
                                                        <tr key={coach.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                        <span className="font-medium text-gray-600">{coach.name.charAt(0)}</span>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{coach.name}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">{coach.role}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(coach.status)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Players */}
                                    <div>
                                        <h3 className="text-base font-medium text-gray-900 mb-3">Cầu Thủ</h3>
                                        <div className="overflow-hidden rounded-lg border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Tên
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Số áo
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Vị trí
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        >
                                                            Trạng thái
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredPlayers.map((player) => (
                                                        <tr key={player.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#BD2427]/10 flex items-center justify-center">
                                                                        <span className="font-medium text-[#BD2427]">{player.name.charAt(0)}</span>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{player.name}</div>
                                                                        <div className="text-xs text-gray-500">{player.team}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100">
                                                                    <span className="text-xs font-medium">{player.number}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-500">{player.position}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(player.status)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions Card */}
                        {userInfo?.roleInformation.teamId === session?.teamId && user?.roleCode === "Coach" &&
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">Thao Tác</h2>
                                </div>
                                <div className="px-6 py-5 space-y-4">
                                    <button
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                                        onClick={() => setEditModalOpen(true)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Chỉnh Sửa Buổi Tập
                                    </button>
                                    <button
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                                        onClick={() => setExerciseModalOpen(true)}
                                    >
                                        <ListChecks className="mr-2 h-4 w-4" />
                                        Quản Lý Chi Tiết
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
                                    onClick={() => setShowAttendance(!showAttendance)}
                                >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Quản Lý Điểm Danh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Chỉnh Sửa Buổi Tập */}
            <EditSessionModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} session={session} courts={courts} />

            {/* Modal Quản Lý Chi Tiết Buổi Tập */}
            <ExerciseManagementModal
                isOpen={exerciseModalOpen}
                onClose={() => {
                    fetchTrainingSession(params.id);
                    setExerciseModalOpen(false)
                }}
                sessionId={params.id.toString()}
                initialExercises={session?.exercises}
                coaches={coaches}
            />
        </div>
    );
}