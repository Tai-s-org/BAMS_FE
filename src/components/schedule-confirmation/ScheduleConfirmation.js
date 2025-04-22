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
import PriceConfirmationModal from "./PriceConfirmationModal"
import PriceUpdateConfirmationModal from "./PriceUpdateConfirmationModal"

export default function ScheduleConfirmation() {
  const [createSchedules, setCreateSchedules] = useState([])
  const [updateSchedules, setUpdateSchedules] = useState([])
  const [cancelSchedules, setCancelSchedules] = useState([])
  const [filteredCreateSchedules, setFilteredCreateSchedules] = useState([])
  const [filteredUpdateSchedules, setFilteredUpdateSchedules] = useState([])
  const [filteredCancelSchedules, setFilteredCancelSchedules] = useState([])
  const [activeTab, setActiveTab] = useState("create")
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [selectedScheduleId, setSelectedScheduleId] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [team, setTeam] = useState({})
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [selectedScheduleForPrice, setSelectedScheduleForPrice] = useState(null)
  const [isUpdatePriceModalOpen, setIsUpdatePriceModalOpen] = useState(false)
  const { user, userInfo } = useAuth();
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
  }, [activeTab, refresh])

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

  const handleOpenPriceModal = (scheduleId) => {
    let schedule

    switch (activeTab) {
      case "create":
        schedule = createSchedules.find((s) => s.trainingSessionId === scheduleId)
        if (schedule) {
          setSelectedScheduleForPrice(schedule)
          setIsPriceModalOpen(true)
        }
        break
      case "update":
        schedule = updateSchedules.find((s) => s.trainingSessionId === scheduleId)
        if (schedule) {
          setSelectedScheduleForPrice(schedule)
          setIsUpdatePriceModalOpen(true)
        }
        break
    }
  }

  const handleApproveCancel = async (scheduleId) => {
    try {
      const response = await scheduleApi.approveCancelPendingTrainingSession(scheduleId);
      addToast({ message: response?.data.message, type: response?.data.status });
      setRefresh(!refresh)
    } catch (error) {
      console.error("Error approving cancel:", error)
      addToast({ message: error?.response?.data.message, type: "error" });
    }
  }

  const handleConfirmPrice = async (price) => {
    if (selectedScheduleForPrice) {
      // Trong ứng dụng thực tế, đây sẽ là một API call
      const approvalData = {
        trainingSessionId: selectedScheduleForPrice.trainingSessionId,
        courtPrice: price,
      }
      // Cập nhật state tương ứng với tab đang active
      switch (activeTab) {
        case "create":
          try {
            const response = await scheduleApi.approvePendingTrainingSession(approvalData);
            addToast({ message: response?.data.message, type: response?.data.status });
            setRefresh(!refresh)
          } catch (error) {
            console.error("Error approve:", error);
            addToast({ message: error?.response?.data.message, type: "error" });
          } finally {
            setIsPriceModalOpen(false)
            setSelectedScheduleForPrice(null)
          }
          break
        case "update":
          try {
            const response = await scheduleApi.approveUpdatePendingTrainingSession(approvalData);
            addToast({ message: response?.data.message, type: response?.data.status });
            setRefresh(!refresh)
          } catch (error) {
            console.error("Error approve:", error);
            addToast({ message: error?.response?.data.message, type: "error" });
          } finally {
            setIsUpdatePriceModalOpen(false)
            setSelectedScheduleForPrice(null)
          }
          break
      }
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

  const handleCalcTime = (startTime, endTime) => {
    console.log("startTime", startTime, "endTime", endTime);
    
    const start = new Date(`1970-01-01T${startTime}Z`)
    const end = new Date(`1970-01-01T${endTime}Z`)
    const diff = (end - start) / 1000 / 60 / 60 
    return diff
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
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="create" >
                Tạo mới
              </TabsTrigger>
              <TabsTrigger value="update">
                Cập nhật
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
                    <div className="text-md text-muted-foreground mb-2">
                      Có <span className="font-semibold text-[#BD2427]">{filteredCreateSchedules.length}</span> yêu cầu tạo lịch tập mới
                    </div>
                    {filteredCreateSchedules.map((schedule) => (
                      <ScheduleItem
                        key={schedule.trainingSessionId}
                        schedule={schedule}
                        onApprove={handleOpenPriceModal}
                        onReject={handleReject}
                        userRole={user?.roleCode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="update" className="mt-0">
              <div className="space-y-4">
                <div className="text-md text-muted-foreground mb-2">
                  Có <span className="font-semibold text-[#BD2427]">{filteredUpdateSchedules.length}</span> yêu cầu cập nhật lịch tập
                </div>
                {filteredUpdateSchedules.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có yêu cầu cập nhật lịch tập trong khoảng thời gian này
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUpdateSchedules.map((schedule) => (
                      <ScheduleUpdateItem
                        key={schedule.trainingSessionId}
                        schedule={schedule}
                        onApprove={handleOpenPriceModal}
                        onReject={handleReject}
                        userRole={user?.roleCode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cancel" className="mt-0">
              <div className="space-y-4">
                <div className="text-md text-muted-foreground mb-2">
                  Có <span className="font-semibold text-[#BD2427]">{filteredCancelSchedules.length}</span> yêu cầu hủy lịch tập
                </div>
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
                        onApprove={handleApproveCancel}
                        onReject={handleReject}
                        userRole={user?.roleCode}
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

      {/* Modal xác nhận giá */}
      {selectedScheduleForPrice && activeTab === "create" && (
        <PriceConfirmationModal
          isOpen={isPriceModalOpen}
          onClose={() => {
            setIsPriceModalOpen(false)
            setSelectedScheduleForPrice(null)
          }}
          onConfirm={handleConfirmPrice}
          trainingSessionId={selectedScheduleForPrice.trainingSessionId}
          currentPrice={selectedScheduleForPrice.courtPrice}
          courtName={selectedScheduleForPrice.courtName}
          scheduledDate={selectedScheduleForPrice.scheduledDate}
          times={handleCalcTime(
            selectedScheduleForPrice.scheduledStartTime,
            selectedScheduleForPrice.scheduledEndTime
          )}
        />
      )}

      {selectedScheduleForPrice && activeTab === "update" && (
        <PriceUpdateConfirmationModal
          isOpen={isUpdatePriceModalOpen}
          onClose={() => {
            setIsUpdatePriceModalOpen(false)
            setSelectedScheduleForPrice(null)
          }}
          onConfirm={handleConfirmPrice}
          trainingSessionId={selectedScheduleForPrice.trainingSessionId}
          currentPrice={selectedScheduleForPrice.oldCourtPrice}
          courtName={selectedScheduleForPrice.newCourtName}
          scheduledDate={selectedScheduleForPrice.newScheduledDate}
          priceByHour={selectedScheduleForPrice.oldCourtRentPrice}
        />
      )}
    </div>
  )
}