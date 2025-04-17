"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { CheckCircle, XCircle } from "lucide-react"

export default function ScheduleUpdateItem({ schedule, onApprove, onReject, userRole }) {
  return (
    <Card className="overflow-hidden border-[#BD2427]/20 hover:border-[#BD2427]/40 transition-colors">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#BD2427]">Lý do thay đổi: {schedule.requestReason}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between sm:block">
                <span className="font-medium text-muted-foreground">Ngày:</span>
                {((schedule.newScheduledDate !== schedule.oldScheduledDate)) ? <span className="sm:ml-2 text-red-500">{schedule.newScheduledDate}</span> : <span className="sm:ml-2">{schedule.newScheduledDate}</span>}
              </div>
              <div className="flex justify-between sm:block">
                <span className="font-medium text-muted-foreground">Thời gian:</span>
                {((schedule.newStartTime !== schedule.oldStartTime) || (schedule.newEndTime !== schedule.oldEndTime)) ? <span className="sm:ml-2 text-red-500">
                  {schedule.newStartTime} - {schedule.newEndTime}
                </span> : <span className="sm:ml-2">
                  {schedule.newStartTime} - {schedule.newEndTime}
                </span>}
              </div>
              <div className="flex justify-between sm:block">
                <span className="font-medium text-muted-foreground">Địa chỉ:</span>
                {((schedule.newCourtAddress !== schedule.oldCourtAddress)) ? <span className="sm:ml-2 text-red-500">{schedule.newCourtAddress}</span> : <span className="sm:ml-2">{schedule.newCourtAddress}</span>}
              </div>
              <div className="flex justify-between sm:block">
                <span className="font-medium text-muted-foreground">Liên hệ sân:</span>
                <span className="sm:ml-2">{schedule.oldCourtContact}</span>
              </div>
            </div>
          </div>

          { userRole === "Manager" ? (<div className="flex items-center justify-end gap-2 p-4 bg-gray-50">
            <Button
              variant="outline"
              className="border-[#BD2427] text-[#BD2427] hover:bg-[#BD2427]/10 hover:text-[#BD2427]"
              onClick={() => onReject(schedule.trainingSessionId)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button className="bg-[#BD2427] hover:bg-[#BD2427]/90 text-white" onClick={() => onApprove(schedule.trainingSessionId)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Phê duyệt
            </Button>
          </div>)
          : (<div className="flex items-center justify-end gap-2 p-4 bg-gray-50">Vui lòng chờ phê duyệt</div>) }
        </div>
      </CardContent>
    </Card>
  )
}