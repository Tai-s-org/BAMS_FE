"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/Dialog"
import { Camera, User, Users, List, X, Trash2 } from "lucide-react"
import Image from "next/image"
import { useToasts } from "@/hooks/providers/ToastProvider"
import faceIdApi from "@/api/faceId"
import teamApi from "@/api/team"
import { useAuth } from "@/hooks/context/AuthContext"

export default function FaceIdManagement() {
    const [activeTab, setActiveTab] = useState("coaches")
    const [cameraOpen, setCameraOpen] = useState(false)
    const [currentUserId, setCurrentUserId] = useState("")
    const [currentUserName, setCurrentUserName] = useState("")
    const [capturedImage, setCapturedImage] = useState(null)
    const [viewingFaceIds, setViewingFaceIds] = useState(false)
    const [selectedUserFaceIds, setSelectedUserFaceIds] = useState([])
    const [stream, setStream] = useState(null)
    const videoRef = useRef(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [faceIdToDelete, setFaceIdToDelete] = useState(null)
    const { addToast } = useToasts()
    const { userInfo } = useAuth()
    const [players, setPlayers] = useState([])
    const [coaches, setCoaches] = useState([])
    const [team, setTeam] = useState([])


    useEffect(() => {
        if (!cameraOpen) return;

        // Chỉ khởi tạo camera khi modal mở và chưa có ảnh chụp
        if (!capturedImage) {
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                })
                .then((stream) => {
                    setStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current.play().catch(err => {
                                console.error("Lỗi phát video:", err);
                                addToast({ message: "Lỗi khi khởi động camera", type: "error" });
                            });
                        };
                    }
                })
                .catch((err) => {
                    console.error("Không thể truy cập camera:", err);
                    addToast({ message: "Không thể truy cập camera", type: "error" });
                });
        }

        // Ngăn chặn scroll body khi modal mở
        document.body.style.overflow = "hidden";

        return () => {
            // Cleanup khi đóng modal
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
            // Khôi phục scroll body
            document.body.style.overflow = "";
        };
    }, [cameraOpen, capturedImage]);

    useEffect(() => {
        return () => {
            if (capturedImage?.preview) {
                URL.revokeObjectURL(capturedImage.preview); // Giải phóng bộ nhớ
            }
        };
    }, [capturedImage]);

    useEffect(() => {
        if (userInfo?.roleInformation?.teamId) {
            fetchTeamDetail()
        }
    }, [userInfo])

    const fetchTeamDetail = async () => {
        try {
            const response = await teamApi.teamDetail(userInfo?.roleInformation.teamId)
            setTeam(response?.data.data)
            setPlayers(response?.data.data.players)
            setCoaches(response?.data.data.coaches)
        } catch (error) {
            console.error("Error fetching teams:", error);
            if (error?.response?.data.status === 401) {
                addToast({ message: "Phiên đăng nhập đã hết hạn", type: "error" });
            }
        }
    }

    // Hàm mở camera cho một người dùng cụ thể
    const openCamera = (userId, name) => {
        setCurrentUserId(userId);
        setCurrentUserName(name);
        setCameraOpen(true);
        setCapturedImage(null);
    };

    // Hàm đóng camera
    const closeCamera = () => {
        setCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                // Tạo cả blob (để upload) và data URL (để hiển thị)
                canvas.toBlob((blob) => {
                    const imageFile = new File([blob], "face-image.png", { type: "image/png" });

                    // Tạo URL để hiển thị ảnh
                    const imageUrl = URL.createObjectURL(blob);

                    // Lưu cả file và URL preview
                    setCapturedImage({
                        file: imageFile,    // Dùng để upload
                        preview: imageUrl   // Dùng để hiển thị
                    });
                }, "image/png");
            }
        }
    };

    // Hàm đăng ký face ID
    const registerFaceId = async () => {
        if (capturedImage?.file && currentUserId) {
            const formData = new FormData();
            formData.append("UserId", currentUserId);
            formData.append("Image", capturedImage.file)

            try {
                const response = await faceIdApi.registerFaceId(formData)
                addToast({ message: response?.data.message, type: response?.data.status });

            } catch (error) {
                console.error("Lỗi khi đăng ký Face ID:", error)
                addToast({ message: error?.response?.data?.errors?.Image || error?.response?.data?.errors[0], type: "error" });
            }

            // Đóng camera sau khi đăng ký
            closeCamera()
        }
    }

    // Hàm xem face ID cho một người dùng cụ thể
    const viewFaceIds = async (userId) => {
        // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ backend
        setCurrentUserId(userId)
        if (activeTab === "coaches") {
            const coach = coaches.find(coach => coach.userId === userId)
            setCurrentUserName(coach?.coachName)
        } else {
            const player = players.find(player => player.userId === userId)
            setCurrentUserName(player?.fullname)
        }
        try {
            const data = {
                userId: userId
            }
            const response = await faceIdApi.getFaceId(data)
            setSelectedUserFaceIds(response?.data.data.userFaces || [])
            setViewingFaceIds(true)
        } catch (error) {
            console.error("Lỗi khi lấy Face ID:", error)
            addToast({ message: error?.response?.data?.errors[0], type: "error" });
        }
    }

    // Hàm mở hộp thoại xác nhận xóa
    const confirmDelete = (faceId) => {
        setFaceIdToDelete(faceId)
        setDeleteConfirmOpen(true)
    }

    // Hàm xóa face ID
    const deleteFaceId = async () => {
        if (faceIdToDelete) {
            try {
                const response = await faceIdApi.deleteFaceId(faceIdToDelete)
                addToast({ message: response?.data.message, type: response?.data.status });
                setSelectedUserFaceIds((prevFaceIds) => prevFaceIds.filter((face) => face.id !== faceIdToDelete))
            } catch (error) {
                console.error("Lỗi khi xóa Face ID:", error)
                addToast({ message: error?.response?.data?.errors[0], type: "error" });
            } finally {
                // Đóng hộp thoại xác nhận
                setDeleteConfirmOpen(false)
                setFaceIdToDelete(null)
                setViewingFaceIds(false)
            }
        }
    }

    const handleRetake = () => {
        setCapturedImage(null);
        if (videoRef.current) {
            if (!stream) {
                openCamera();
            } else if (videoRef.current.paused) {
                videoRef.current.play(); // 
            }
        }
    };

    const takeDate = (dateString) => {
        if (!dateString) return "N/A"
        const dateSplit = dateString.split("T")
        return `${dateSplit[0]}`
    }

    const takeTime = (dateString) => {
        if (!dateString) return "N/A"
        const dateSplit = dateString.split("T")
        return `${dateSplit[1].slice(0, 8)}`
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-[#BD2427]">Quản Lý Face ID</h1>

            <Tabs defaultValue="coaches" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="coaches" >
                        <User className="h-4 w-4" />
                        Huấn Luyện Viên
                    </TabsTrigger>
                    <TabsTrigger value="players" >
                        <Users className="h-4 w-4" />
                        Cầu Thủ
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="coaches" className="space-y-4">
                    {coaches.map((coach) => (
                        <Card key={coach.userId} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl">{coach.coachName}</CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() => viewFaceIds(coach.userId)}
                                        className="flex items-center gap-2"
                                    >
                                        <List className="h-4 w-4" />
                                        Xem Face ID
                                    </Button>
                                </div>
                                <CardDescription>
                                    Hợp đồng: {coach.contractStartDate} đến {coach.contractEndDate}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button
                                    onClick={() => openCamera(coach.userId, coach.coachName)}
                                    className="bg-[#BD2427] hover:bg-[#9a1e21] text-white flex items-center gap-2"
                                >
                                    <Camera className="h-4 w-4" />
                                    Đăng Ký Face ID
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="players" className="space-y-4">
                    {players.map((player) => (
                        <Card key={player.userId} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 pb-4">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-xl">{player.fullname}</CardTitle>
                                    <Button
                                        variant="outline"
                                        onClick={() => viewFaceIds(player.userId)}
                                        className="flex items-center gap-2"
                                    >
                                        <List className="h-4 w-4" />
                                        Xem Face ID
                                    </Button>
                                </div>
                                <CardDescription>
                                    Vị trí: {player.position} • Ngày tham gia: {player.clubJoinDate}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <Button
                                    onClick={() => openCamera(player.userId, player.fullname)}
                                    className="bg-[#BD2427] hover:bg-[#9a1e21] text-white flex items-center gap-2"
                                >
                                    <Camera className="h-4 w-4" />
                                    Đăng Ký Face ID
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Hộp thoại Camera */}
            <Dialog open={cameraOpen} onOpenChange={(open) => !open && closeCamera()}>
                <DialogContent className="sm:max-w-2xl w-[95vw]">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                            <span>Đăng Ký Face ID cho {currentUserName}</span>
                            {/* <Button variant="ghost" size="icon" onClick={closeCamera} className="h-8 w-8 rounded-full">
                                <X className="h-4 w-4" />
                            </Button> */}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-4">
                        {!capturedImage ? (
                            <>
                                <div className="relative w-full aspect-[4/3] bg-black rounded-md overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ display: 'block' }}
                                    />
                                </div>
                                <Button onClick={capturePhoto} className="bg-[#BD2427] hover:bg-[#9a1e21] text-white w-full">
                                    Chụp Ảnh
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="relative w-full aspect-[4/3] bg-black rounded-md overflow-hidden">
                                    <img
                                        src={capturedImage?.preview || "/placeholder.svg"}
                                        alt="Ảnh đã chụp"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex gap-2 w-full">
                                    <Button variant="outline" onClick={handleRetake} className="flex-1">
                                        Chụp Lại
                                    </Button>
                                    <Button onClick={registerFaceId} className="bg-[#BD2427] hover:bg-[#9a1e21] text-white flex-1">
                                        Đăng Ký
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hộp thoại Xem Face ID */}
            <Dialog open={viewingFaceIds} onOpenChange={setViewingFaceIds}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Danh Sách Face ID của {currentUserName}</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {selectedUserFaceIds.length > 0 ? (
                            selectedUserFaceIds.map((faceId) => (
                                <div key={faceId.userFaceId} className="border rounded-md overflow-hidden relative group">
                                    <Image
                                        src={process.env.NEXT_PUBLIC_IMAGE_API_URL + faceId.imageUrl}
                                        alt={`Face ID ${faceId.userFaceId}`}
                                        width={200}
                                        height={200}
                                        className="w-full h-auto"
                                    />
                                    <div className="p-2 bg-gray-50 flex justify-between items-center">
                                        <p className="text-sm font-medium">Đăng ký vào lúc:<br />{takeDate(faceId.registeredAt)}<br />{takeTime(faceId.registeredAt)}</p>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => confirmDelete(faceId.userFaceId)}
                                            className="bg-[#BD2427] hover:bg-[#9a1e21] h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">Chưa có Face ID nào được đăng ký</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Hộp thoại Xác nhận xóa */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa Face ID này không? Hành động này không thể hoàn tất.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
                        <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={deleteFaceId} className="bg-[#BD2427] hover:bg-[#9a1e21]">
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}