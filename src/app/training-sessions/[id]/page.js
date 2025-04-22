"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserCheck, Check, X, Clock1, Edit, ListChecks, Plus } from "lucide-react"
import Link from "next/link";
import { useAuth } from "@/hooks/context/AuthContext";
import Image from "next/image";
import { EditSessionModal } from "@/components/schedule/EditSessionModal"
import { ExerciseManagementModal } from "@/components/schedule/ExerciseManagementModal"
import scheduleApi from "@/api/schedule";
import courtApi from "@/api/court";
import coachApi from "@/api/coach";
import { AttendanceReviewModal } from "@/components/attendance/AttendanceReviewModal";
import CancelModal from "@/components/schedule/CancelModal";
import { useToasts } from "@/hooks/providers/ToastProvider";

export default function TrainingSessionDetail() {
    const { user, userInfo } = useAuth();

    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [sessionExercises, setSessionExercises] = useState([])
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [exerciseModalOpen, setExerciseModalOpen] = useState(false)
    const [courts, setCourts] = useState([])
    const [coaches, setCoaches] = useState([])
    const [isModified, setIsModified] = useState(false)
    const [attendanceRvOpen, setAttendanceRvOpen] = useState(false)
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const { addToast } = useToasts();

    const fetchCoaches = async () => {
        try {
            if (session) {
                const response = await coachApi.listCoaches({ TeamId: userInfo?.roleInformation.teamId });
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
        if (user?.roleCode === "Coach") {
            fetchCoaches()
        }
    }, [session])

    useEffect(() => {
        // Tìm buổi tập với ID tương ứng
        const id = params.id
        const result = fetchTrainingSession(id);

        if (result) {

        } else {
            // Xử lý khi không tìm thấy buổi tập
            router.push("/schedules")
        }
    }, [params.id, router, isModified]);

    const fetchTrainingSession = async (id) => {
        try {
            const response = await scheduleApi.getTrainingSessionById(id);
            setSession(response?.data.data);
            setSessionExercises(response?.data.data.exercises);
            return true;
        } catch (error) {
            console.error("Lỗi:", error);
            return false;
        }
    };

    const handleCancel = async (reason) => {
        try {
            const data = {
                trainingSessionId: params.id,
                reason: reason
            }
            const response = await scheduleApi.cancelTrainingSession(data);
            addToast({ message: response?.data.message, type: "success" });
            router.push("/schedules");
        } catch (error) {
            console.error("Lỗi:", error?.response);
            if (error?.response?.data?.errors) {
                error.response.data.errors?.map(element => {
                    addToast({ message: element, type: "error" });
                });
            }
            if (error?.response?.status === 401) {
                addToast({ message: error?.response?.data.Message, type: "error" });
            }
        } finally {
            setCancelModalOpen(false)
        }
    };

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
                                            <div className="text-sm font-medium text-gray-900">Địa điểm (Nhấn để truy cập GoogleMaps)</div>
                                            <a
                                                href={`https://www.google.com/maps?q=${encodeURIComponent(session.court.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-500 hover:underline"
                                            >
                                                {session.court.courtName} - {session.court.address}
                                            </a>
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
                                        user?.roleCode === "Coach" && userInfo?.roleInformation.teamId === session.teamId && <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
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
                                    <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-[#BD2427] text-sm font-medium rounded-md shadow-sm text-[#BD2427] bg-white hover:bg-[#BD2427]/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] transition-colors duration-200"
                                        onClick={() => setCancelModalOpen(true)}
                                    >
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
                                    onClick={() => setAttendanceRvOpen(true)}
                                >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Xem Kết Quả Điểm Danh
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Chỉnh Sửa Buổi Tập */}
            <EditSessionModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} session={session} courts={courts} sessionId={params.id} isModified={() => setIsModified(!isModified)} />

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

            {/* Modal Xem Kết Quả Điểm Danh */}
            <AttendanceReviewModal isOpen={attendanceRvOpen} onClose={() => setAttendanceRvOpen(false)} session={session} sessionId={params.id} />

            {/* Modal Hủy Buổi Tập */}
            <CancelModal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} onConfirm={handleCancel} />
        </div>
    );
}