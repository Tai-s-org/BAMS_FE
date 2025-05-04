"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { CalendarDays, CheckCircle2, ClipboardCheck, Mail, Phone, Star, User, XCircle } from 'lucide-react'

export function CompletedTab({ players }) {
  const approvedCount = players.filter(player => player.status === "Approved").length
  const rejectedCount = players.filter(player => player.status === "Rejected").length

  // return (
  //   <div>
  //     <div className="border rounded-md overflow-hidden">
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>Họ và tên</TableHead>
  //             <TableHead>Email</TableHead>
  //             <TableHead>Số điện thoại</TableHead>
  //             <TableHead>Điểm trung bình</TableHead>
  //             <TableHead>Trạng thái</TableHead>
  //             <TableHead>Ngày cập nhật</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {players.length > 0 ? (
  //             players.map((player) => (
  //               <TableRow key={player.playerRegistrationId}>
  //                 <TableCell>{player.fullName}</TableCell>
  //                 <TableCell>{player.email}</TableCell>
  //                 <TableCell>{player.phoneNumber}</TableCell>
  //                 <TableCell>{player.scores?.total ? player.scores.total.toFixed(2) : "N/A"}</TableCell>
  //                 <TableCell>
  //                   <Badge className={player.status === "Approved" ? "bg-green-600" : "bg-red-600"}>
  //                     {player.status === "Approved" ? "Chấp nhận" : "Từ chối"}
  //                   </Badge>
  //                 </TableCell>
  //                 <TableCell>
  //                   {player.updatedDate ? format(new Date(player.updatedDate), "dd/MM/yyyy") : "N/A"}
  //                 </TableCell>
  //               </TableRow>
  //             ))
  //           ) : (
  //             <TableRow>
  //               <TableCell colSpan={6} className="text-center py-4">
  //                 Không có cầu thủ nào đã hoàn thành quy trình
  //               </TableCell>
  //             </TableRow>
  //           )}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </div>
  // )
  return (
    <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <CardHeader className="bg-white pb-4 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Cầu thủ đã hoàn thành</CardTitle>
            <CardDescription className="text-gray-500 mt-1">
              Danh sách cầu thủ đã được chấp nhận hoặc từ chối
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 font-medium flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {approvedCount} chấp nhận
            </Badge>
            <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 font-medium flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              {rejectedCount} từ chối
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700 py-3">Họ và tên</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Email</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Số điện thoại</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-center">Điểm trung bình</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3 text-center">Trạng thái</TableHead>
                <TableHead className="font-semibold text-gray-700 py-3">Ngày cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.length > 0 ? (
                players.map((player) => (
                  <TableRow
                    key={player.playerRegistrationId}
                    className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${player.status === "Approved" ? "bg-green-50/30" : "bg-red-50/30"
                      }`}
                  >
                    <TableCell className="py-3 font-medium text-gray-900">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        {player.fullName}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        {player.email}
                      </div>

                    </TableCell>
                    <TableCell className="py-3 text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      {player.phoneNumber}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      {player.scores?.total ? (
                        <Badge
                          className={`flex items-center justify-center gap-1 font-medium ${getScoreColorClass(player.scores.total)
                            }`}
                        >
                          <Star className="w-3 h-3" />
                          {player.scores.total.toFixed(2)}
                        </Badge>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-center">
                      {player.status === "Approved" ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Chấp nhận
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 border-red-200 font-medium flex items-center justify-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Từ chối
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-gray-600 flex items-center">
                      <CalendarDays className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      {player.updatedDate ? format(new Date(player.updatedDate), "dd/MM/yyyy") : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardCheck className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="font-medium">Không có cầu thủ nào đã hoàn thành quy trình</p>
                      <p className="text-sm text-gray-400 mt-1">Cầu thủ sẽ xuất hiện ở đây sau khi được chấp nhận hoặc từ chối</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  // Helper function to get color class based on score
  function getScoreColorClass(score) {
    if (score >= 4) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 3) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }
}

