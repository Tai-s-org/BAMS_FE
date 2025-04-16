"use client"

import { useState } from "react"
import { format } from "date-fns"
import { X, Calendar, Clock, MapPin, Check } from "lucide-react"
import scheduleApi from "@/api/schedule"
import { useToasts } from "@/hooks/providers/ToastProvider"

export function SingleSessionModal({ isOpen, onClose, teamId, courts, isModified }) {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [startTime, setStartTime] = useState("16:00")
  const [endTime, setEndTime] = useState("17:30")
  const [court, setCourt] = useState(courts[0]?.courtId)
  const {addToast} = useToasts();

  const handleSubmit = async () => {
    // Xử lý tạo buổi tập đơn lẻ
    try {
      const data = {
        teamId: teamId,
        courtId: court,
        scheduledDate: date,
        startTime: startTime + ":00",
        endTime: endTime + ":00",
      }

      console.log("Data", data);
      
      const response = await scheduleApi.createTrainingSession(data);
      addToast({ message: response?.data.message, type: response?.data.status });
      isModified();
    } catch (error) {
      console.error("Lỗi khi tạo buổi tập đơn lẻ:", error.response.data.errors)
      addToast({ message: error.response.data.errors, type: "error" });
    }

    // Đóng modal sau khi xử lý
    onClose()
  }

  if (!isOpen) return null

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
              Tạo Buổi Tập Đơn Lẻ
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

              {/* Ngày tập */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Ngày tập
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

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
                    <input
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
                    <input
                      type="time"
                      id="end-time"
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sân và đội */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="court" className="block text-sm font-medium text-gray-700">
                    Sân tập
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="court"
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={court}
                      onChange={(e) => setCourt(e.target.value)}
                    >
                      {courts.map((c) => (
                        <option key={c.courtId} value={c.courtId}>
                          {c.courtName}
                        </option>
                      ))}
                    </select>
                  </div>
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
              <Check className="mr-2 h-4 w-4" />
              Xác nhận
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