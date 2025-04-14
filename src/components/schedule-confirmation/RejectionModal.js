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
      <DialogContent className="sm:max-w-[425px] border-brand-red/30">
        <DialogHeader>
          <DialogTitle className="text-brand-red">Từ chối yêu cầu lịch tập</DialogTitle>
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
            className={`min-h-[100px] ${error ? "border-brand-red" : "focus-visible:ring-brand-red/30 border-brand-red/20"}`}
          />
          {error && <p className="text-sm text-brand-red mt-1">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-brand-red/30 hover:border-brand-red/70 hover:bg-brand-red/10"
          >
            Hủy bỏ
          </Button>
          <Button onClick={handleConfirm} className="bg-brand-red hover:bg-brand-red/90 text-white">
            Xác nhận từ chối
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}