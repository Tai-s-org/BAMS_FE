"use client"

import { useState } from "react"
import { format, addDays } from "date-fns"
import { X, Calendar, Clock, MapPin, Check } from "lucide-react"

const daysOfWeek = [
  { id: 1, name: "Thứ Hai" },
  { id: 2, name: "Thứ Ba" },
  { id: 3, name: "Thứ Tư" },
  { id: 4, name: "Thứ Năm" },
  { id: 5, name: "Thứ Sáu" },
  { id: 6, name: "Thứ Bảy" },
  { id: 0, name: "Chủ Nhật" },
]

const courts = ["Sân A", "Sân B", "Sân C"]
const teams = ["Đội Chính", "Đội Trẻ", "Đội Thiếu Niên", "Tất Cả Đội"]

export function RecurringSessionModal({ isOpen, onClose }) {
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 30), "yyyy-MM-dd"))
  const [sessionName, setSessionName] = useState("")
  const [daySelections, setDaySelections] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.id]: {
          selected: false,
          timeSlots: [{ startTime: "16:00", endTime: "17:30", court: "Sân A", team: "Đội Chính" }],
        },
      }),
      {}
    )
  )

  const toggleDaySelection = (dayId) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        selected: !prev[dayId].selected,
      },
    }))
  }

  const removeTimeSlot = (dayId, index) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        timeSlots: prev[dayId].timeSlots.filter((_, i) => i !== index),
      },
    }))
  }

  const updateTimeSlot = (dayId, index, field, value) => {
    setDaySelections((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        timeSlots: prev[dayId].timeSlots.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const handleSubmit = () => {
    const selectedDays = Object.entries(daySelections)
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => ({
        dayId: Number.parseInt(key),
        timeSlots: value.timeSlots,
      }))

    console.log({
      sessionName,
      startDate,
      endDate,
      selectedDays,
    })

    onClose()
  }

  if (!isOpen) return null

  return (
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
                          checked={daySelections[day.id].selected}
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

                      {daySelections[day.id].timeSlots.map((slot, index) => (
                        <div key={index} className="mb-4 last:mb-0 bg-gray-50 p-3 rounded-md relative">
                          {daySelections[day.id].timeSlots.length > 1 && (
                            <button
                              type="button"
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                              onClick={() => removeTimeSlot(day.id, index)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}

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
                                  value={slot.startTime}
                                  onChange={(e) => updateTimeSlot(day.id, index, "startTime", e.target.value)}
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
                                  value={slot.endTime}
                                  onChange={(e) => updateTimeSlot(day.id, index, "endTime", e.target.value)}
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
                                  value={slot.court}
                                  onChange={(e) => updateTimeSlot(day.id, index, "court", e.target.value)}
                                >
                                  {courts.map((court) => (
                                    <option key={court} value={court}>
                                      {court}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">Đội</label>
                              <select
                                className="focus:ring-[#BD2427] focus:border-[#BD2427] block w-full sm:text-sm border-gray-300 rounded-md p-1"
                                value={slot.team}
                                onChange={(e) => updateTimeSlot(day.id, index, "team", e.target.value)}
                              >
                                {teams.map((team) => (
                                  <option key={team} value={team}>
                                    {team}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
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
  )
}