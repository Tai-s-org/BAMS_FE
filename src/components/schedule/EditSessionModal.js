"use client"

import { useState, useEffect } from "react"
import { format, parse, set } from "date-fns"
import { X, Clock, MapPin, Save } from "lucide-react"
import scheduleApi from "@/api/schedule"
import { vi } from "date-fns/locale"
import { Input } from "../ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { useToasts } from "@/hooks/providers/ToastProvider"

export function EditSessionModal({ isOpen, onClose, session, courts, sessionId, isModified }) {
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [court, setCourt] = useState({})
  const [updateReason, setUpadateReason] = useState("")
  const {addToast} = useToasts()

  useEffect(() => {
    if (session) {
      const [startTime, endTime] = session.time.split(" - ")
      setStartTime(startTime)
      setEndTime(endTime)
      setCourt(session.court.courtId)
    }
  }, [session])

  const handleSubmit = () => {
    if (!session) return
    let parsedDate = parse(session.scheduledDate, "EEEE, dd/MM/yyyy", new Date(), { locale: vi });
    let date = format(parsedDate, "yyyy-MM-dd");

    // Xử lý cập nhật buổi tập
    handleUpdateSession({
      trainingSessionId: sessionId,
      scheduledDate: date,
      startTime: correctTimeFormat(startTime),
      endTime: correctTimeFormat(endTime),
      courtId: court,
      updateReason: updateReason
    })
    // Đóng modal sau khi xử lý
    onClose()
  }

  const handleUpdateSession = async (data) => {
    try {
      console.log("Data to update:", data);

      const response = await scheduleApi.updateTrainingSession(data);
      addToast({message: response?.data.message, type: "success"})
      isModified();
    } catch (error) {
      console.error("Lỗi khi chỉnh buổi tập:", error.response.data.errors);
      addToast({message: error.response.data.errors, type: "error"})
    }
  }

  const correctTimeFormat = (time) => {
    const timeSplit = time.split(":")
    if (timeSplit.length == 2) return time + ":00"
    return time
  }

  if (!isOpen || !session) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-[#BD2427] px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
              Chỉnh Sửa Buổi Tập
            </h3>
            <button
              type="button"
              className="bg-[#BD2427] rounded-md text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5">
            <div className="space-y-6">

              {/* Giờ bắt đầu và kết thúc */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
                    Giờ bắt đầu
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="time"
                      id="start-time"
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
                    Giờ kết thúc
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      type="time"
                      id="end-time"
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Lý do thay đổi
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <Input
                      type="text"
                      id="updateReason"
                      value={updateReason}
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                      onChange={(e) => setUpadateReason(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sân */}
              <div>
                <label htmlFor="court" className="block text-sm font-medium text-gray-700">
                  Sân tập
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <Select value={court} onValueChange={(value) => setCourt(value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court.courtId} value={court.courtId}>
                          {court.courtName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
              onClick={handleSubmit}
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </button>
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}