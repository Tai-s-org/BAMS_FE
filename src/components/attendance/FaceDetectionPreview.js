'use client'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { X, Check, Search } from 'lucide-react'
import faceIdApi from '@/api/faceId'
import { useToasts } from '@/hooks/providers/ToastProvider'

export function FaceDetectionPreview({
    players,
    detectionResult,
    onConfirm,
    onClose
}) {
    const imgRef = useRef(null)
    const [selectedFace, setSelectedFace] = useState(null)
    const [expandedFace, setExpandedFace] = useState(null)
    const [assignedPlayers, setAssignedPlayers] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)

    // Hàm tạo faceKey từ tọa độ boundingBox
    const getFaceKey = (face) => {
        const { top, left, width, height } = face.boundingBox;
        return `${top.toFixed(4)}-${left.toFixed(4)}-${width.toFixed(4)}-${height.toFixed(4)}`;
    };

    const [processedFaces, setProcessedFaces] = useState(() => {
        return detectionResult.detectedFaces.map(face => {
            if (face.userId === "Không xác định" && face.faceId === "Không xác định") {
                return {
                    ...face,
                    faceId: `unidentified_${getFaceKey(face)}`
                }
            }
            return face
        })
    })
    const { addToast } = useToasts()

    // Danh sách player đã được detect tự động
    let autoDetectedPlayers = useMemo(() => {
        return processedFaces
            .filter(face => face.userId !== "Không xác định")
            .map(face => face.userId)
    }, [processedFaces])

    // Danh sách player có thể gán
    const availablePlayers = useMemo(() => {
        return players.filter(player =>
            !autoDetectedPlayers.includes(player.userId) &&
            !Object.values(assignedPlayers).some(p => p.userId === player.userId)
        )
    }, [players, autoDetectedPlayers, assignedPlayers])

    // Players phù hợp với từ khóa tìm kiếm
    const filteredPlayers = useMemo(() => {
        if (!searchTerm) return availablePlayers
        return availablePlayers.filter(player =>
            player.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            player.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [availablePlayers, searchTerm])

    useEffect(() => {
        // Re-render khi assignedPlayers thay đổi
    }, [assignedPlayers])

    // Chỉ chọn 1 khuôn mặt duy nhất
    const handleSelectFace = (face) => {
        if (face.userId !== "Không xác định") {
            return
        }

        if (selectedFace?.faceId === face.faceId) {
            setSelectedFace(null)
            setExpandedFace(null)
        } else {
            setSelectedFace(face)
            setExpandedFace(face.faceId)
        }
    }

    const assignPlayerToFace = (player) => {
        if (!selectedFace) return

        setAssignedPlayers(prev => ({
            ...prev,
            [selectedFace.faceId]: player
        }))
        setSelectedFace(null)
        setExpandedFace(null)
        setSearchTerm('')
    }

    const removeAssignment = (faceId) => {
        setAssignedPlayers(prev => {
            const newState = { ...prev }
            delete newState[faceId]
            return newState
        })
    }

    const registerFaceId = async (userId, croppedImage) => {
        const memberName = players?.find(p => p.userId == userId)?.fullName
        try {
            const blob = await fetch(croppedImage).then(res => res.blob())
            const randomString = Math.random().toString(36).substring(2, 8)
            const fileName = `${userId}_${randomString}_${Date.now()}.jpg`
            const file = new File([blob], fileName, { type: 'image/jpeg' })

            const data = new FormData()
            data.append("UserId", userId)
            data.append("Image", file)
            const response = await faceIdApi.registerFaceId(data)
            addToast({ message: `Đăng ký Face ID cho: ${memberName} thành công`, type: "success" })
            return response?.data.data.registeredFaces[0]
        } catch (error) {
            addToast({
                message: `Không tìm thấy khuôn mặt để đăng ký Face ID cho: ${memberName}. Vui lòng chọn ảnh khác!`,
                type: "error"
            })
            throw error
        }
    }

    const handleConfirm = async () => {
        setLoading(true)
        try {
            // Tạo bản sao tạm thời
            const tempProcessedFaces = [...processedFaces];
            const tempAssignedPlayers = { ...assignedPlayers };
            const tempAutoDetectedPlayers = [...autoDetectedPlayers];

            // Sử dụng Promise.allSettled để xử lý cả thành công và thất bại
            const results = await Promise.allSettled(
                Object.entries(tempAssignedPlayers).map(async ([faceId, player]) => {
                    try {
                        const faceIndex = tempProcessedFaces.findIndex(f => f.faceId === faceId);
                        if (faceIndex === -1 || !imgRef.current) {
                            throw new Error(`Face ${faceId} not found or image missing`);
                        }

                        const face = tempProcessedFaces[faceIndex];
                        const img = imgRef.current;
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const { width, height } = img;

                        const { boundingBox: originalBB } = face;
                        const paddingRatio = 0.35;

                        const expandedBB = {
                            left: Math.max(0, originalBB.left - originalBB.width * paddingRatio),
                            top: Math.max(0, originalBB.top - originalBB.height * paddingRatio * 1.5),
                            width: Math.min(1, originalBB.width * (1 + 2 * paddingRatio)),
                            height: Math.min(1, originalBB.height * (1 + 2 * paddingRatio * 1.2))
                        };

                        canvas.width = expandedBB.width * width;
                        canvas.height = expandedBB.height * height;
                        ctx.drawImage(
                            img,
                            expandedBB.left * width,
                            expandedBB.top * height,
                            expandedBB.width * width,
                            expandedBB.height * height,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                        const croppedImage = canvas.toDataURL('image/jpeg');
                        const registeredFace = await registerFaceId(player.userId, croppedImage);

                        if (!registeredFace) {
                            throw new Error(`Registration failed for face ${faceId}`);
                        }

                        return { faceId, player, faceIndex };
                    } catch (error) {
                        console.error(`Error processing face ${faceId}:`, error);
                        throw error; // Re-throw để có thể xử lý ở phần results
                    }
                })
            );

            const hasErrors = results.some(result => result.status === 'rejected');

            if (hasErrors) {
                return;
            }

            // Xử lý kết quả sau khi tất cả hoàn thành
            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    const { faceId, player, faceIndex } = result.value;

                    // 1. Cập nhật processedFaces
                    tempProcessedFaces[faceIndex] = {
                        ...tempProcessedFaces[faceIndex],
                        userId: player.userId,
                        username: player.username,
                    };

                    // 2. Thêm vào autoDetectedPlayers
                    if (!tempAutoDetectedPlayers.includes(player.userId)) {
                        tempAutoDetectedPlayers.push(player.userId);
                    }

                    // 3. Xóa khỏi assignedPlayers
                    delete tempAssignedPlayers[faceId];

                    console.log(`Successfully processed face ${faceId}`);
                }
            });

            // Cập nhật các biến gốc một lần duy nhất sau cùng
            setProcessedFaces(tempProcessedFaces);
            setAssignedPlayers(tempAssignedPlayers);;

            const allAttendedPlayers = [
                ...tempAutoDetectedPlayers,
                ...Object.values(assignedPlayers).map(p => p.userId)
            ];

            onConfirm(allAttendedPlayers);
        } catch (error) {
            console.error("Unexpected error in handleConfirm:", error);
        } finally {
            setLoading(false);
        }
    };

    const isFaceAssigned = (faceId) => {
        return !!assignedPlayers[faceId]
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="bg-[#BD2427] px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                        Xác nhận khuôn mặt nhận diện
                    </h3>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Ảnh và chú thích */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
                        {/* Ảnh và bounding boxes */}
                        <div className="w-full lg:w-auto flex justify-center">
                            <div className="relative inline-block">
                                <img
                                    ref={imgRef}
                                    src={detectionResult.originalImageUrl}
                                    alt="Detected faces"
                                    className="max-w-full rounded-lg border"
                                />

                                {/* Bounding boxes */}
                                {processedFaces.map((face) => {
                                    const isIdentified = face.userId !== "Không xác định"
                                    const isAssigned = isFaceAssigned(face.faceId)
                                    const isSelected = selectedFace?.faceId === face.faceId
                                    const assignedPlayer = assignedPlayers[face.faceId]

                                    return (
                                        <div key={face.faceId}>
                                            {/* Bounding box */}
                                            <div
                                                className={`absolute border-2 cursor-pointer ${isIdentified
                                                    ? 'border-green-500 bg-green-500/20'
                                                    : isAssigned
                                                        ? 'border-blue-500 bg-blue-500/20'
                                                        : isSelected
                                                            ? 'border-yellow-500 bg-yellow-500/20'
                                                            : 'border-red-500'
                                                    }`}
                                                style={{
                                                    left: `${face.boundingBox.left * 100}%`,
                                                    top: `${face.boundingBox.top * 100}%`,
                                                    width: `${face.boundingBox.width * 100}%`,
                                                    height: `${face.boundingBox.height * 100}%`,
                                                }}
                                                onClick={() => handleSelectFace(face)}
                                            />

                                            {/* Face label */}
                                            <div
                                                className={`absolute px-2 py-1 rounded text-sm flex items-center ${isIdentified
                                                    ? 'bg-green-100 text-green-800'
                                                    : isAssigned
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : isSelected
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                style={{
                                                    left: `${face.boundingBox.left * 100}%`,
                                                    top: `${(face.boundingBox.top + face.boundingBox.height) * 100}%`,
                                                    transform: 'translateY(0.25rem)'
                                                }}
                                            >
                                                {isIdentified ? (
                                                    face.username
                                                ) : isAssigned ? (
                                                    <>
                                                        {assignedPlayer.fullName}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                removeAssignment(face.faceId)
                                                            }}
                                                            className="ml-2"
                                                        >
                                                            <X className="h-4 w-4 text-red-600" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {isSelected ? "Đang chọn..." : "Chưa xác định"}
                                                    </>
                                                )}
                                            </div>

                                            {/* Player selection dropdown */}
                                            {!isIdentified && !isAssigned && isSelected && (
                                                <div
                                                    className="absolute z-10 mt-1 w-64 rounded-md bg-white shadow-lg"
                                                    style={{
                                                        left: `${face.boundingBox.left * 100}%`,
                                                        top: `${(face.boundingBox.top + face.boundingBox.height) * 100}%`,
                                                        transform: 'translateY(0.5rem)'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="p-2 border-b">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="Tìm kiếm cầu thủ..."
                                                                className="pl-10 pr-4 py-2 w-full text-sm border-none focus:ring-0"
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="py-1 max-h-60 overflow-auto">
                                                        {filteredPlayers.length > 0 ? (
                                                            filteredPlayers.map(player => (
                                                                <div
                                                                    key={player.userId}
                                                                    className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                                                                    onClick={() => assignPlayerToFace(player)}
                                                                >
                                                                    {player.fullName} ({player.username})
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-2 text-sm text-gray-500">
                                                                Không tìm thấy cầu thủ phù hợp
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 w-full lg:w-72">
                            <p>• <span className="text-green-600">Khung xanh</span>: Đã xác định tự động</p>
                            <p>• <span className="text-blue-600">Khung xanh dương</span>: Đã gán thủ công</p>
                            <p>• <span className="text-yellow-600">Khung vàng</span>: Đang được chọn</p>
                            <p>• <span className="text-red-600">Khung đỏ</span>: Chưa xác định</p>
                        </div>
                    </div>

                    {Object.keys(assignedPlayers).length > 0 && (
                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-2">Cầu thủ đã gán thủ công:</h4>
                            <div className="space-y-2">
                                {Object.entries(assignedPlayers).map(([faceId, player]) => (
                                    <div key={faceId} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded">
                                        <span>{player.fullName} ({player.username})</span>
                                        <button
                                            onClick={() => removeAssignment(faceId)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-[#BD2427] hover:bg-[#A61F22]"
                        disabled={loading}
                    >
                        <Check className="mr-2" size={18} />
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}