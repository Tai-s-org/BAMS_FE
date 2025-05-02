"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { X, MapPin, Check } from "lucide-react"
import { FailedSessionsModal } from "./FailedSessionsModal"
import scheduleApi from "@/api/schedule"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { DatePicker } from "../ui/DatePicker"
import { TimePicker } from "../ui/TimePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";


const daysOfWeek = [
  { id: 0, name: "Thứ Hai" },
  { id: 1, name: "Thứ Ba" },
  { id: 2, name: "Thứ Tư" },
  { id: 3, name: "Thứ Năm" },
  { id: 4, name: "Thứ Sáu" },
  { id: 5, name: "Thứ Bảy" },
  { id: 6, name: "Chủ Nhật" },
]

const plus = (id) => {
  return id + 1;
}

export function RecurringSessionModal({ isOpen, onClose, teamId, courts }) {
  const [startDate, setStartDate] = useState(addDays(new Date(), 1))
  const [endDate, setEndDate] = useState(addDays(new Date(), 2))
  const [daySelections, setDaySelections] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.id]: {
          selected: false,
          timeSlots: { startTime: "16:00", endTime: "17:30", court: courts[0]?.courtId || null },
        },
      }),
      {}
    )
  )
  const [showFailedSessionsModal, setShowFailedSessionsModal] = useState(false)
  const [failedSessions, setFailedSessions] = useState([])
  const { addToast } = useToasts();

  const toggleDaySelection = (dayId) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        selected: !prev[dayId].selected,
      },
    }))
  }

  const updateTimeSlot = (dayId, field, value) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        timeSlots: {
          ...prev[dayId].timeSlots,
          [field]: value,
        },
      },
    }))
  }

  const formatDate = (date) => {
    if (!date) return ""
    return format(date, "yyyy-MM-dd")
  }

  const formatTime = (time) => {
    if (!time) return ""
    const timeSplit = time.split(":")
    if (timeSplit.length === 2) {
      return `${timeSplit[0]}:${timeSplit[1]}:00`
    }
    return time
  }

  const handleSubmit = async () => {
    const selectedDays = Object.entries(daySelections)
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => ({
        dayId: Number.parseInt(key),
        timeSlots: value.timeSlots,
      }))

    const data = {
      teamId: teamId,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      trainingSessionInADayOfWeekDetails:
        selectedDays.map((day) => ({
          dayOfWeek: plus(day.dayId),
          startTime: formatTime(day.timeSlots.startTime),
          endTime: formatTime(day.timeSlots.endTime),
          courtId: day.timeSlots.court,
        })),
    }

    // Giả lập API call và nhận về các buổi tập thất bại
    try {
      const response = await scheduleApi.createTrainingSessionAutomation(data);
      const mockFailedSessions = response?.data.data.failedSessions || [];

      // Nếu có buổi tập thất bại, hiển thị modal
      if (mockFailedSessions.length > 0) {
        setFailedSessions(mockFailedSessions)
        setShowFailedSessionsModal(true)
      } else {
        // Nếu không có buổi tập thất bại, đóng modal
        addToast({
          type: "success",
          message: "Thêm lịch tập vào danh sách chờ thành công",
        })
        onClose()
      }
    } catch (error) {
      console.error("Error creating training session:", error)
      if (error.response && error.response.data) {
        // Lặp qua tất cả các giá trị lỗi trong object
        Object.values(error.response.data.errors).forEach(message => {
          addToast({
            message: message,
            type: "error"
          });
        });
      }
    }
  }

  const handleSaveFailedSessions = async (updatedSessions) => {
    const data = updatedSessions?.map((session) => ({
      teamId: teamId,
      courtId: session.selectedCourtId,
      scheduledDate: formatDate(session.scheduledDate),
      startTime: formatTime(session.startTime),
      endTime: formatTime(session.endTime),
    }))

    try {
      const response = await scheduleApi.createTrainingSessionBulk(data);
      addToast({ message: "Đã thêm các lịch tập được kiểm tra", type: response?.data.status });
      onClose()
    } catch (error) {
      console.error("Error creating training session:", error)
      addToast({ message: "Thêm lịch tập thất bại", type: "error" });
      if (error.response && error.response.data) {
        // Lặp qua tất cả các giá trị lỗi trong object
        Object.values(error.response.data.errors).forEach(message => {
          addToast({
            message: message,
            type: "error"
          });
        });
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={onClose}
          ></div>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
            <div className="bg-[#BD2427] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                Tạo Buổi Tập Lặp Lại
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <DatePicker
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      minDate={new Date()}
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <DatePicker
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      minDate={startDate}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Chọn ngày trong tuần</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day) => (
                      <div key={day.id} className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`day-${day.id}`}
                            type="checkbox"
                            className="focus:ring-[#BD2427] h-4 w-4 text-[#BD2427] border-gray-300 rounded"
                            checked={daySelections[day.id]?.selected}
                            onChange={() => toggleDaySelection(day.id)}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`day-${day.id}`} className="font-medium text-gray-700">
                            {day.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {daysOfWeek
                    .filter((day) => daySelections[day.id].selected)
                    .map((day) => (
                      <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{day.name}</h4>

                        <div className="mb-4 last:mb-0 bg-gray-50 p-3 rounded-md relative">

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Giờ bắt đầu</label>
                              <TimePicker
                                value={daySelections[day.id].timeSlots.startTime}
                                onChange={(time) => updateTimeSlot(day.id, "startTime", time)}
                                className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Giờ kết thúc</label>
                              <TimePicker
                                value={daySelections[day.id].timeSlots.endTime}
                                onChange={(time) => updateTimeSlot(day.id, "endTime", time)}
                                className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Sân tập</label>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <Select value={daySelections[day.id].court} onValueChange={(court) => updateTimeSlot(day.id, "court", court)} required>
                                  <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Chọn sân" />
                                  </SelectTrigger>
                                  <SelectContent >
                                    {courts?.map((court) => (
                                      <SelectItem key={court.courtId} value={court.courtId}>
                                        {court.courtName} - {court.address}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
              <button
                type="button"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] disabled:opacity-50 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={
                  !daysOfWeek || daysOfWeek.some(
                    (day) =>
                      daySelections[day.id]?.selected && !daySelections[day.id]?.timeSlots?.court
                  )
                }
                
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
      {/* Modal hiển thị các buổi tập thất bại */}
      <FailedSessionsModal
        isOpen={showFailedSessionsModal}
        onClose={() => {
          setShowFailedSessionsModal(false)
          onClose()
        }}
        failedSessions={failedSessions}
        onSave={handleSaveFailedSessions}
        teamId={teamId}
        allCourts={courts}
      />
    </>
  )
}