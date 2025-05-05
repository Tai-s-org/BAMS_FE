"use client"

import React from "react"

import { Users } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"



const ExpenditureDetail = ({ open, onClose, expenditure }) => {
    if (!expenditure) return null

    const formatDate = (dateString) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    function formatTienVN(number) {
        return number != null ? number.toLocaleString("vi-VN") : ""
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chi tiết khoản chi</DialogTitle>
                    <DialogDescription>Thông tin chi tiết về khoản chi</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 text-sm font-medium text-gray-500">Tên khoản chi:</div>
                        <div className="col-span-2 font-medium">{expenditure.name}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 text-sm font-medium text-gray-500">Số tiền:</div>
                        <div className="col-span-2 font-medium">{formatTienVN(expenditure.amount)} VNĐ</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 text-sm font-medium text-gray-500">Ngày chi tiêu:</div>
                        <div className="col-span-2">{formatDate(expenditure.date)}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 text-sm font-medium text-gray-500">Áp dụng cho:</div>
                        <div className="col-span-2">
                            {expenditure.playerExpenditures && expenditure.playerExpenditures.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {expenditure.playerExpenditures.map((player) => (
                                        <Badge key={player.userId} variant="outline" className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {player.fullname}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <Badge variant="outline">Tất cả thành viên</Badge>
                            )}
                        </div>
                    </div>

                    {expenditure.description && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-sm font-medium text-gray-500">Mô tả:</div>
                            <div className="col-span-2">{expenditure.description}</div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Đóng</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ExpenditureDetail
