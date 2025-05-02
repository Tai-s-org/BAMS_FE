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
    const { addToast } = useToasts()

    // Hàm tạo faceKey từ tọa độ boundingBox
    const getFaceKey = (face) => {
        const { top, left, width, height } = face.boundingBox;
        return `${top.toFixed(4)}-${left.toFixed(4)}-${width.toFixed(4)}-${height.toFixed(4)}`;
    };

    // Xử lý detectedFaces để đảm bảo mỗi face có faceId duy nhất
    const processedFaces = useMemo(() => {
        return detectionResult.detectedFaces.map(face => {
            // Nếu là face chưa xác định và không có faceId, tạo faceId từ tọa độ
            if (face.userId === "Không xác định" && face.faceId === "Không xác định") {
                return {
                    ...face,
                    faceId: `unidentified_${getFaceKey(face)}`
                }
            }
            return face
        })
    }, [detectionResult.detectedFaces])

    // Danh sách player đã được detect tự động
    const autoDetectedPlayers = useMemo(() => {
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
            await faceIdApi.registerFaceId(data)
            addToast({ message: `Đăng ký Face ID cho: ${memberName} thành công`, type: "success" })
        } catch (error) {
            console.error(`Lỗi khi đăng ký Face ID cho: ${memberName}`, error)
            addToast({
                message: `Không thành công đăng ký Face ID cho: ${memberName}. Vui lòng chọn ảnh khác!`,
                type: "error"
            })
            throw error
        }
    }

    const handleConfirm = async () => {
        try {
            await Promise.all(
                Object.entries(assignedPlayers).map(async ([faceId, player]) => {
                    const face = processedFaces.find(f => f.faceId === faceId)
                    if (!face || !imgRef.current) return

                    const img = imgRef.current
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    const { width, height } = img

                    const { boundingBox: bb } = face
                    canvas.width = bb.width * width
                    canvas.height = bb.height * height
                    ctx.drawImage(
                        img,
                        bb.left * width,
                        bb.top * height,
                        bb.width * width,
                        bb.height * height,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    )

                    const croppedImage = canvas.toDataURL('image/jpeg')
                    await registerFaceId(player.userId, croppedImage)
                })
            )

            const allAttendedPlayers = [
                ...autoDetectedPlayers,
                ...Object.values(assignedPlayers).map(p => p.userId)
            ]

            onConfirm(allAttendedPlayers)
        } catch (error) {
            console.error("Error confirming:", error)
        }
    }

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
                <div className="p-6">
                    <div className="relative inline-block mb-4">
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

                    <div className="mt-4 text-sm text-gray-600">
                        <p>• <span className="text-green-600">Khung xanh</span>: Đã xác định tự động</p>
                        <p>• <span className="text-blue-600">Khung xanh dương</span>: Đã gán thủ công</p>
                        <p>• <span className="text-yellow-600">Khung vàng</span>: Đang được chọn</p>
                        <p>• <span className="text-red-600">Khung đỏ</span>: Chưa xác định</p>
                    </div>

                    {/* Assigned players summary */}
                    {Object.keys(assignedPlayers).length > 0 && (
                        <div className="mt-6 border-t pt-4">
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
                    <Button variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-[#BD2427] hover:bg-[#A61F22]"
                    >
                        <Check className="mr-2" size={18} />
                        Xác nhận
                    </Button>
                </div>
            </div>
        </div>
    )
}