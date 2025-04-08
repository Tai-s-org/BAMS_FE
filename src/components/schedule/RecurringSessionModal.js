"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { X, Calendar, Clock, MapPin, Check } from "lucide-react"
import { FailedSessionsModal } from "./FailedSessionsModal"
import scheduleApi from "@/api/schedule"

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
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"))
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

  const handleSubmit = async () => {
    const selectedDays = Object.entries(daySelections)
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => ({
        dayId: Number.parseInt(key),
        timeSlots: value.timeSlots,
      }))

    console.log("data generate", {
      teamId: teamId,
      startDate: startDate,
      endDate: endDate,
      trainingSessionInADayOfWeekDetails:
        selectedDays.map((day) => ({
          dayOfWeek: plus(day.dayId),
          startTime: day.timeSlots.startTime + ":00",
          endTime: day.timeSlots.endTime + ":00",
          courtId: day.timeSlots.court,
        })),
    });

    const data = {
      teamId: teamId,
      startDate: startDate,
      endDate: endDate,
      trainingSessionInADayOfWeekDetails:
        selectedDays.map((day) => ({
          dayOfWeek: plus(day.dayId),
          startTime: day.timeSlots.startTime + ":00",
          endTime: day.timeSlots.endTime + ":00",
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
        onClose()
      }
    } catch (error) {
      console.error("Error creating training session:", error)
    }
  }

  const handleSaveFailedSessions = async (updatedSessions) => {
    console.log("Đã lưu các buổi tập đã chỉnh sửa:", updatedSessions)
    console.log("Đã lưu các buổi tập đã chỉnh sửa:", updatedSessions?.map((session) => ({
      teamId: teamId,
      courtId: session.selectedCourtId,
      scheduledDate: session.scheduledDate,
      startTime: checkTimeFormat(session.startTime),
      endTime: checkTimeFormat(session.endTime),
    })));

    const data = updatedSessions?.map((session) => ({
      teamId: teamId,
      courtId: session.selectedCourtId,
      scheduledDate: session.scheduledDate,
      startTime: checkTimeFormat(session.startTime),
      endTime: checkTimeFormat(session.endTime),
    }))

    try {
      const response = await scheduleApi.createTrainingSessionBulk(data);
      console.log("Response from bulk:", response)
      onClose()
    } catch (error) {
      console.error("Error creating training session:", error)
    }
  }

  const checkTimeFormat = (time) => {
    const splitTime = time.split(":")
    if (splitTime.length == 2) return time + ":00";
    else {
      return time;
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
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="start-date"
                        className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="end-date"
                        className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
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
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="time"
                                  className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  value={daySelections[day.id].timeSlots.startTime}
                                  onChange={(e) => updateTimeSlot(day.id, "startTime", e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Giờ kết thúc</label>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                  type="time"
                                  className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                  value={daySelections[day.id].endTime}
                                  onChange={(e) => updateTimeSlot(day.id, "endTime", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Sân tập</label>
                              <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                </div>
                                <select
                                  className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-1"
                                  value={daySelections[day.id].court}
                                  onChange={(e) => updateTimeSlot(day.id, "court", e.target.value)}
                                >
                                  {courts?.map((court) => (
                                    <option key={court.courtId} value={court.courtId}>
                                      {court.courtName}
                                    </option>
                                  ))}
                                </select>
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