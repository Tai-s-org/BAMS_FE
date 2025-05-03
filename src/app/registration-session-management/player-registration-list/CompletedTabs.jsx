"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { format } from "date-fns"

export function CompletedTab({ players }) {
  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Điểm trung bình</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
            </TableRow> 
          </TableHeader>
          <TableBody>
            {players.length > 0 ? (
              players.map((player) => (
                <TableRow key={player.playerRegistrationId}>
                  <TableCell>{player.fullName}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.phoneNumber}</TableCell>
                  <TableCell>{player.scores?.total ? player.scores.total.toFixed(2) : "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={player.status === "Approved" ? "bg-green-600" : "bg-red-600"}>
                      {player.status === "Approved" ? "Chấp nhận" : "Từ chối"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {player.updatedDate ? format(new Date(player.updatedDate), "dd/MM/yyyy") : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Không có cầu thủ nào đã hoàn thành quy trình
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

