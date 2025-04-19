"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "../ui/Button"
import SparklesText from "../ui/SparklesText"
import attendanceApi from "@/api/attendance"
import { useToasts } from "@/hooks/providers/ToastProvider"

const CameraCapture = ({ handleAICapture }) => {
  const [showModal, setShowModal] = useState(false)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [createHover, setCreateHover] = useState(false)
  const {addToast} = useToasts()

  useEffect(() => {
    if (!showModal) return

    // Only initialize camera when modal is open and no image is captured
    if (!capturedImage) {
      // Bật camera khi mở modal
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        })
        .catch((err) => {
          console.error("Không thể truy cập camera:", err)
          addToast({ message: "Không thể truy cập camera", type: "error" })
        })
    }

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      // Cleanup khi đóng modal
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      // Restore body scrolling
      document.body.style.overflow = ""
    }
  }, [showModal, capturedImage])

  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const now = new Date()
    const timestamp = now.toLocaleString()
    context.fillStyle = "white"
    context.font = "24px Arial"
    context.fillText(timestamp, 10, canvas.height - 20)

    const dataUrl = canvas.toDataURL("image/png")
    setCapturedImage(dataUrl)
  }

  const handleUpload = async () => {
    if (!capturedImage) return

    const blob = await (await fetch(capturedImage)).blob()
    const file = new File([blob], "captured.png", { type: "image/png" })

    const formData = new FormData()
    formData.append("Image", file)

    try {
        const response = await attendanceApi.getFaceId(formData);
        handleAICapture(response?.data.data.detectedFaces)
        addToast({type: response?.data.status, message: response?.data.message})
    } catch (error) {
      console.error("Error uploading image:", error);
      addToast({type: "error", message: error?.response?.data?.errors[0] || "Có lỗi xảy ra trong quá trình gửi ảnh"})
    } finally {
      setShowModal(false)
      setCapturedImage(null)
    }
  }

  return (
    <>
      {/* Trigger */}
      <SparklesText disabled={!createHover} className="inline-flex w-full">
        <Button
          className="bg-gradient-to-br from-purple-500 to-pink-500 shadow-md font-bold group"
          onMouseOver={() => setCreateHover(true)}
          onMouseLeave={() => setCreateHover(false)}
          onClick={() => setShowModal(true)}
        >
          Điểm danh bằng AI
        </Button>
      </SparklesText>

      {/* Modal toàn màn hình */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" style={{marginLeft: "0px"}}>
          <div className="relative w-full max-w-3xl mx-auto p-2 flex flex-col items-center">
            <button
              onClick={() => {
                setShowModal(false)
                setCapturedImage(null)
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 z-10"
              aria-label="Đóng"
            >
              ✖
            </button>

            <div className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
              <h2 className="text-xl font-bold text-white text-center py-3 bg-gray-800">
                {capturedImage ? "Xem lại ảnh" : "Chụp ảnh điểm danh"}
              </h2>

              <div className="relative aspect-video w-full">
                {!capturedImage ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Đã chụp"
                    className="w-full h-full object-contain"
                  />
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="p-4 flex justify-center">
                {!capturedImage ? (
                  <button
                    onClick={handleCapture}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg flex items-center"
                  >
                    <span className="mr-2">📸</span> Chụp ảnh
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        // Just clear the captured image, the useEffect will handle restarting the camera
                        setCapturedImage(null)
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                      🔄 Chụp lại
                    </button>
                    <button
                      onClick={handleUpload}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      📤 Gửi ảnh
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CameraCapture
