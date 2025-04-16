"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import ScheduleItem from "./ScheduleItem"
import RejectionModal from "./RejectionModal"
import scheduleApi from "@/api/schedule"
import { useToasts } from "@/hooks/providers/ToastProvider"
import { useAuth } from "@/hooks/context/AuthContext"
import teamApi from "@/api/team"
import ScheduleUpdateItem from "./ScheduleUpdateItem"
import ScheduleCancelItem from "./ScheduleCancelItem"

export default function ScheduleConfirmation() {
  // Sử dụng state riêng cho từng loại lịch
  const [createSchedules, setCreateSchedules] = useState([])
  const [updateSchedules, setUpdateSchedules] = useState([])
  const [cancelSchedules, setCancelSchedules] = useState([])
  const [filteredCreateSchedules, setFilteredCreateSchedules] = useState([])
  const [filteredUpdateSchedules, setFilteredUpdateSchedules] = useState([])
  const [filteredCancelSchedules, setFilteredCancelSchedules] = useState([])

  const [activeTab, setActiveTab] = useState("create")
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState(null)
  const [team, setTeam] = useState({})
  const { userInfo } = useAuth();
  const { addToast } = useToasts();

  useEffect(() => {
    fetchTeamDetail()
  }, [])

  useEffect(() => {
    if (activeTab === "create") {
      fetchCreateSchedules()
    } else if (activeTab === "update") {
      fetchUpdateSchedules()
    } else if (activeTab === "cancel") {
      fetchCancelSchedules()
    }
  }, [activeTab])

  const fetchTeamDetail = async () => {
    try {
      const response = await teamApi.teamDetail(userInfo?.roleInformation.teamId);
      setTeam(response?.data.data);
    } catch (error) {
      console.error("Error fetching team detail:", error);
    }
  }

  const fetchCreateSchedules = async () => {
    try {
      const response = await scheduleApi.getPendingTrainingSession();
      setCreateSchedules(response?.data.data);
      setFilteredCreateSchedules(response?.data.data);
    } catch (error) {
      console.error("Error fetching create schedules:", error);
      if (error?.response?.status === 401) {
        addToast({ message: error?.response?.data.Message, type: "error" });
      }
    }
  }

  const fetchUpdateSchedules = async () => {
    try {
      const response = await scheduleApi.getUpdatePendingTrainingSession();
      setUpdateSchedules(response?.data.data);
      setFilteredUpdateSchedules(response?.data.data);
    } catch (error) {
      console.error("Error fetching update schedules:", error);
    }
  }

  const fetchCancelSchedules = async () => {
    try {
      const response = await scheduleApi.getCancelPendingTrainingSession();
      setCancelSchedules(response?.data.data);
      setFilteredCancelSchedules(response?.data.data);
    } catch (error) {
      console.error("Error fetching cancel schedules:", error);
    }
  }

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


  return (
    <div className="space-y-6">
      <Card className="border-brand-red/20">
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-brand-red mb-2">Đội {team?.teamName}</h2>
            <p className="text-muted-foreground">Quản lý lịch tập cho đội {team?.teamName}</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Khoảng thời gian</label>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="create" >
                Tạo mới
              </TabsTrigger>
              <TabsTrigger value="update">
                Chỉnh sửa
              </TabsTrigger>
              <TabsTrigger value="cancel">
                Hủy lịch
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
                      <ScheduleUpdateItem
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
                      <ScheduleCancelItem
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