"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"

export default function RejectionModal({ isOpen, onClose, onConfirm }) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Vui lòng cung cấp lý do từ chối")
      return
    }

    onConfirm(reason)
    setReason("")
    setError("")
  }

  const handleClose = () => {
    setReason("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] border-[#BD2427]/30">
        <DialogHeader>
          <DialogTitle className="text-[#BD2427]">Từ chối yêu cầu lịch tập</DialogTitle>
          <DialogDescription>Vui lòng cung cấp lý do từ chối yêu cầu lịch tập này.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Textarea
            placeholder="Nhập lý do từ chối..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (e.target.value.trim()) setError("")
            }}
            className={`min-h-[100px] ${error ? "border-[#BD2427]" : "focus-visible:ring-[#BD2427]/30 border-[#BD2427]/20"}`}
          />
          {error && <p className="text-sm text-[#BD2427] mt-1">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#BD2427]/30 hover:border-[#BD2427]/70 hover:bg-[#BD2427]/10"
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirm} className="bg-[#BD2427] hover:bg-[#BD2427]/90 text-white">
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}