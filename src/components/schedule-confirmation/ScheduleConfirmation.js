"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/Calendar"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { CalendarIcon } from "lucide-react"
import { format, isWithinInterval, parseISO, set } from "date-fns"
import { cn } from "@/lib/utils"
import ScheduleItem from "./ScheduleItem"
import RejectionModal from "./RejectionModal"
import scheduleApi from "@/api/schedule"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { useAuth } from "@/hooks/context/AuthContext"
import teamApi from "@/api/team"

// Dữ liệu mẫu riêng biệt cho từng tab
const mockUpdateSchedules = [
  {
    id: "2",
    teamId: "team-01",
    courtId: "court-b",
    scheduledDate: "2025-04-15",
    scheduledStartTime: "10:00",
    scheduledEndTime: "12:00",
    trainingSessionId: "ts-002",
    status: "update",
    teamName: "Lakers",
    courtName: "Sân Tập",
  },
  {
    id: "5",
    teamId: "team-01",
    courtId: "court-b",
    scheduledDate: "2025-04-18",
    scheduledStartTime: "15:00",
    scheduledEndTime: "17:00",
    trainingSessionId: "ts-005",
    status: "update",
    teamName: "Lakers",
    courtName: "Sân Tập",
  },
]

const mockCancelSchedules = [
  {
    id: "3",
    teamId: "team-01",
    courtId: "court-a",
    scheduledDate: "2025-04-16",
    scheduledStartTime: "18:00",
    scheduledEndTime: "20:00",
    trainingSessionId: "ts-003",
    status: "cancel",
    teamName: "Lakers",
    courtName: "Sân Chính",
  },
  {
    id: "6",
    teamId: "team-01",
    courtId: "court-a",
    scheduledDate: "2025-04-19",
    scheduledStartTime: "13:00",
    scheduledEndTime: "15:00",
    trainingSessionId: "ts-006",
    status: "cancel",
    teamName: "Lakers",
    courtName: "Sân Chính",
  },
]

export default function ScheduleConfirmation() {
  // Sử dụng state riêng cho từng loại lịch
  const [createSchedules, setCreateSchedules] = useState([])
  const [updateSchedules, setUpdateSchedules] = useState(mockUpdateSchedules)
  const [cancelSchedules, setCancelSchedules] = useState(mockCancelSchedules)
  const [filteredCreateSchedules, setFilteredCreateSchedules] = useState([])

  const [dateRange, setDateRange] = useState({
    from: new Date("2025-04-14"),
    to: new Date("2025-04-20"),
  })
  const [activeTab, setActiveTab] = useState("create")
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState(null)
  const [team, setTeam] = useState({})
  const {userInfo} = useAuth();
  const {addToast} = useToasts();

  useEffect(() => {
    fetchCreateSchedules()
    fetchTeamDetail()
  }, [])

  const fetchTeamDetail = async () => {
    try {
      const response = await teamApi.teamDetail(userInfo?.roleInformation.teamId);
      console.log("Team", response?.data.data);
      
      // setTeam(response?.data.data);
    } catch (error) {
      console.log("Error fetching team detail:", error);
    }
  }

  const fetchCreateSchedules = async () => {
    try {
      const response = await scheduleApi.getPendingTrainingSession();
      setCreateSchedules(response?.data.data);
      setFilteredCreateSchedules(response?.data.data);
    } catch (error) {
      console.log("Error fetching create schedules:", error);

    }
  }

  // Lọc dữ liệu theo khoảng ngày cho từng danh sách
  // const filteredCreateSchedules = createSchedules.filter((schedule) => isDateInRange(schedule.scheduledDate))
  const filteredUpdateSchedules = updateSchedules.filter((schedule) => isDateInRange(schedule.scheduledDate))
  const filteredCancelSchedules = cancelSchedules.filter((schedule) => isDateInRange(schedule.scheduledDate))

  // Xử lý phê duyệt lịch tập
  const handleApprove = async (scheduleId) => {
    // Cập nhật state tương ứng với tab đang active
    switch (activeTab) {
      case "create":
        try {
          const response = await scheduleApi.approvePendingTrainingSession(scheduleId);
          addToast({ message: response?.data.message, type: response?.data.status });
        } catch (error) {
          console.error("Error approve:", error);
          addToast({ message: error?.response?.data.message, type: "error" });
        } finally {
          setCreateSchedules(createSchedules.filter((s) => s.trainingSessionId !== scheduleId))
        }
        break
      case "update":
        setUpdateSchedules(updateSchedules.filter((s) => s.trainingSessionId !== scheduleId))
        break
      case "cancel":
        setCancelSchedules(cancelSchedules.filter((s) => s.trainingSessionId !== scheduleId))
        break
    }
  }

  // Xử lý từ chối lịch tập
  const handleReject = (scheduleId) => {
    setSelectedScheduleId(scheduleId)
    setIsRejectionModalOpen(true)
  }

  // Xác nhận từ chối lịch tập
  const confirmRejection = async (reason) => {
    if (selectedScheduleId) {
      // Trong ứng dụng thực tế, đây sẽ là một API call
      const data = {
        trainingSessionId: selectedScheduleId,
        reason: reason
      }

      // Cập nhật state tương ứng với tab đang active
      switch (activeTab) {
        case "create":
          try {
            const response = await scheduleApi.rejectPendingTrainingSession(data);
            addToast({ message: response?.data.message, type: response?.data.status });
          } catch (error) {
            console.error("Error approve:", error);
            addToast({ message: error?.response?.data.message, type: "error" });
          }
          setCreateSchedules(createSchedules.filter((s) => s.trainingSessionId !== selectedScheduleId))
          break
        case "update":
          setUpdateSchedules(updateSchedules.filter((s) => s.trainingSessionId !== selectedScheduleId))
          break
        case "cancel":
          setCancelSchedules(cancelSchedules.filter((s) => s.trainingSessionId !== selectedScheduleId))
          break
      }

      setIsRejectionModalOpen(false)
      setSelectedScheduleId(null)
    }
  }

  // Kiểm tra xem ngày có nằm trong khoảng đã chọn không
  function isDateInRange(dateString) {
    if (!dateRange?.from || !dateRange?.to) return true

    const date = parseISO(dateString)
    return isWithinInterval(date, {
      start: dateRange.from,
      end: dateRange.to,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="border-brand-red/20">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-brand-red mb-2">Đội Lakers</h2>
            <p className="text-muted-foreground">Quản lý lịch tập cho đội Lakers</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-col gap-2">
              {/* <label className="text-sm font-medium">Khoảng thời gian</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal border-brand-red/30 hover:border-brand-red/70",
                      !dateRange && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Chọn khoảng thời gian</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="[&_.rdp-day_button:hover]:bg-[#BD2427]/10 [&_.rdp-day_button:focus]:bg-[#BD2427]/20 [&_.rdp-day_button.rdp-day_selected]:bg-[#BD2427]"
                  />
                </PopoverContent>
              </Popover> */}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="create" >
                Tạo mới ({filteredCreateSchedules.length})
              </TabsTrigger>
              <TabsTrigger value="update">
                Chỉnh sửa ({filteredUpdateSchedules.length})
              </TabsTrigger>
              <TabsTrigger value="cancel">
                Hủy lịch ({filteredCancelSchedules.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-0">
              <div className="space-y-4">
                {filteredCreateSchedules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có yêu cầu tạo lịch tập mới trong khoảng thời gian này
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCreateSchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule.trainingSessionId}
                        schedule={schedule}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="update" className="mt-0">
              <div className="space-y-4">
                {filteredUpdateSchedules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có yêu cầu chỉnh sửa lịch tập trong khoảng thời gian này
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUpdateSchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule.trainingSessionId}
                        schedule={schedule}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancel" className="mt-0">
              <div className="space-y-4">
                {filteredCancelSchedules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có yêu cầu hủy lịch tập trong khoảng thời gian này
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCancelSchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule.trainingSessionId}
                        schedule={schedule}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        onConfirm={confirmRejection}
      />
    </div>
  )
}