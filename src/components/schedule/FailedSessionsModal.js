"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Save, AlertTriangle, ClipboardCheck } from "lucide-react"
import courtApi from "@/api/court"
import scheduleApi from "@/api/schedule"
import { TbAlertTriangleFilled } from "react-icons/tb"
import { DatePicker } from "../ui/DatePicker"
import { format } from "date-fns"
import { TimePicker } from "../ui/TimePicker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";


export function FailedSessionsModal({ isOpen, onClose, failedSessions, onSave, teamId, allCourts }) {
  const [sessions, setSessions] = useState([])
  const [availableCourts, setAvailableCourts] = useState([])
  const [sessionsStatus, setSessionsStatus] = useState([])
  const [allCourtsList, setAllCourtsList] = useState([])
  const [checkFailed, setCheckFailed] = useState({ index: -1, message: "" })

  useEffect(() => {
    setSessions(failedSessions)
    for (let i = 0; i < failedSessions.length; i++) {
      setSessionsStatus((prev) => {
        const updated = [...prev]
        updated[i] = { ...failedSessions[i], status: false }
        return updated
      })
    }
    setAllCourtsList(allCourts)
  }, [failedSessions])

  const fetchAvailableCourts = async (session) => {
    try {
      const filter = {
        StartDate: formatDate(session.scheduledDate),
        EndDate: formatDate(session.scheduledDate),
        StartTime: formatTime(session.startTime),
        EndTime: formatTime(session.endTime),
        DayOfWeek: session.dayOfWeek,
      }

      const response = await courtApi.getAvailableCourt(filter);
      setAvailableCourts(response?.data.data);
    } catch (error) {
      console.error("Error fetching available courts:", error)
    }
  }

  const handleDateChange = (index, date) => {
    setSessions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], scheduledDate: date }
      return updated
    })
  }

  const handleStartTimeChange = (index, time) => {
    setSessions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], startTime: time }
      return updated
    })
  }

  const handleEndTimeChange = (index, time) => {
    setSessions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], endTime: time }
      return updated
    })
  }

  const handleCourtChange = (index, courtId) => {
    setSessions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], selectedCourtId: courtId }
      return updated
    })
  }

  const handleSave = () => {
    onSave(sessions)
    onClose()
  }

  // Convert day of week number to day name
  const getDayName = (dayOfWeek) => {
    const days = ["Không xác định", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ nhật"]
    return days[dayOfWeek]
  }

  // Format time from "HH:MM:SS" to "HH:MM"
  const formatDate = (date) => {
    const formattedDate = format(new Date(date), "yyyy-MM-dd")
    return formattedDate;
  }

  const formatTime = (time) => {
    if (!time) return ""
    const timeSplit = time.split(":")
    if (timeSplit.length === 2) return time + ":00"
    return time
  }

  if (!isOpen) return null

  const handleCheck = async (session, index) => {
    try {
      const filter = {
        TeamId: teamId,
        ScheduledDate: formatDate(session.scheduledDate),
        StartTime: formatTime(session.startTime),
        EndTime: formatTime(session.endTime),
      }
      const response = await scheduleApi.checkSessionConflict(filter);

      if (response?.data.data === null) {
        setSessionsStatus((prev) => {
          const updated = [...prev]
          updated[index] = { ...updated[index], status: true }
          return updated
        })
        setCheckFailed({ index: -1, message: "" })
      } else {
        setCheckFailed({ index: index, message: response?.data.message })
      }
    } catch (error) {
      console.error("Error checking session:", error)
    }
  }

  const checkSessionStatus = (session, index) => {
    let foundSession = sessionsStatus?.find((s, sid) => sid === index && s.status === false)

    if (foundSession) {
      return foundSession.status
    } else {
      return true;
    }
  }

  const takeCourtName = (courtId) => {
    const court = allCourtsList?.find((court) => court.courtId === courtId)
    return court ? court.courtName : "Sân không xác định"
  }

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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-amber-500 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-white mr-2" />
              <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
                Lịch Tập Bị Trùng
              </h3>
            </div>
            <button
              type="button"
              className="bg-amber-500 rounded-md text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Đóng</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-5">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Một số lịch tập không thể tạo do trùng lịch hoặc sân đã được đặt. Vui lòng xem lại và điều chỉnh thông
                tin.
              </p>
            </div>

            {/* List of failed sessions */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto">
              {sessions.map((session, index) => (
                <div key={index} className={checkSessionStatus(session, index) ? "bg-green-50 rounded-lg p-4 border border-green-200" : "bg-amber-50 rounded-lg p-4 border border-amber-200"}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-medium text-gray-900">
                      Buổi tập {index + 1} - {getDayName(session.dayOfWeek)}
                    </h4>
                  </div>

                  {/* Check button for available sessions */}
                  {checkSessionStatus(session, index) ?
                    (
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                            <div className="relative rounded-md shadow-sm">
                              {session.scheduledDate}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Sân</label>
                          <div className="relative rounded-md shadow-sm">
                            {takeCourtName(session.selectedCourtId)}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu</label>
                            <div className="relative rounded-md shadow-sm">
                              {session.startTime}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc</label>
                            <div className="relative rounded-md shadow-sm">
                              {session.endTime}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                            <DatePicker
                              value={new Date(session.scheduledDate)}
                              onChange={(date) => handleDateChange(index, date)}
                              minDate={new Date()}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sân</label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gray-400" />
                              </div>
                              <Select value={session.selectedCourtId} onValueChange={(value) => handleCourtChange(index, value)} required className="w-full" onOpenChange={() => fetchAvailableCourts(session)}> 
                                <SelectTrigger className="pl-10" >
                                  <SelectValue placeholder="Chọn sân" />
                                </SelectTrigger>
                                <SelectContent >
                                  {availableCourts?.map((court) => (
                                    <SelectItem key={court.courtId} value={court.courtId}>
                                      {court.courtName} - {court.address}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu</label>
                            <TimePicker
                              value={session.startTime}
                              onChange={(time) => handleStartTimeChange(index, time)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc</label>
                            <TimePicker
                              value={session.endTime}
                              onChange={(time) => handleEndTimeChange(index, time)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="relative rounded-md shadow-sm">
                              <button
                                type="button"
                                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427] mt-3"
                                onClick={() => handleCheck(session, index)}
                              >
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                                Kiểm tra
                              </button>
                            </div>
                          </div>
                          {checkFailed.index === index && <div className="flex items-center text-sm text-red-500 mt-3">
                            <TbAlertTriangleFilled className="h-4 w-4 mr-1" />
                            {checkFailed.message}
                          </div>}
                        </div>
                      </>
                    )
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse">
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#BD2427] hover:bg-[#A61F22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu Thay Đổi Đã Chỉnh Sửa
            </button>
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BD2427]"
              onClick={onClose}
            >
              Bỏ Qua
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}