"use client"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { AlertTriangle } from "lucide-react"

export default function DeleteConfirmationExpenditureDialog({
  isOpen,
  onClose,
  onConfirm,
  playerName,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#BD2427]" />
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </div>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa <span className="font-medium">{playerName}</span> khỏi khoản thu này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-[#BD2427] hover:bg-[#9a1e21]">
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}