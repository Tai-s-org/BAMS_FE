"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ScoreButton } from "../../demo/score-button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { ClipboardList, Mail, Phone, User, UserCheck } from 'lucide-react'

export function ScoringTab({ players, onStatusChange }) {
    // return (
    //     <div>
    //         <div className="border rounded-md overflow-hidden">
    //             <Table>
    //                 <TableHeader>
    //                     <TableRow>
    //                         <TableHead>Họ và tên</TableHead>
    //                         <TableHead>Email</TableHead>
    //                         <TableHead>Số điện thoại</TableHead>
    //                         <TableHead>Số báo danh</TableHead>
    //                         <TableHead>Giới tính</TableHead>
    //                         <TableHead>Thao tác</TableHead>
    //                     </TableRow>
    //                 </TableHeader>
    //                 <TableBody>
    //                     {players.length > 0 ? (
    //                         players.map((player) => (
    //                             <TableRow key={player.playerRegistrationId}>
    //                                 <TableCell>{player.fullName}</TableCell>
    //                                 <TableCell>{player.email}</TableCell>
    //                                 <TableCell>{player.phoneNumber}</TableCell>
    //                                 <TableCell>{player.candidateNumber}</TableCell>
    //                                 <TableCell>{player.gender ? "Nam" : "Nữ"}</TableCell>
    //                                 <TableCell>
    //                                     <ScoreButton
    //                                         playerId={player.playerRegistrationId}
    //                                         playerName={player.fullName}
    //                                         registrationName={player.registrationName}
    //                                         gender={player.gender}
    //                                         email={player.email}
    //                                         onScoreSubmitted={onStatusChange}
    //                                         candidateNumber={player.candidateNumber}
    //                                         onStatusChange = {onStatusChange}
    //                                     />
    //                                 </TableCell>
    //                             </TableRow>
    //                         ))
    //                     ) : (
    //                         <TableRow>
    //                             <TableCell colSpan={5} className="text-center py-4">
    //                                 Không có cầu thủ nào đang chờ chấm điểm
    //                             </TableCell>
    //                         </TableRow>
    //                     )}
    //                 </TableBody>
    //             </Table>
    //         </div>
    //     </div>
    // )
    return (
        <Card className="border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <CardHeader className="bg-white pb-4 border-b border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <CardTitle className="text-xl font-bold text-gray-800">Chấm điểm cầu thủ</CardTitle>
                        <CardDescription className="text-gray-500 mt-1">
                            Đánh giá kỹ năng và thể lực của cầu thủ đã điểm danh
                        </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-medium">
                        <UserCheck className="w-4 h-4 mr-1" />
                        {players.length} cầu thủ chờ chấm điểm
                    </Badge>
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
                                <TableHead className="font-semibold text-gray-700 py-3 text-center">Số báo danh</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 text-center">Giới tính</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.length > 0 ? (
                                players.map((player) => (
                                    <TableRow
                                        key={player.playerRegistrationId}
                                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                    >
                                        <TableCell className="py-3 font-medium text-gray-900 flex items-center">
                                            <User className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                            {player.fullName}
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600 ">
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
                                            <Badge variant="outline" className="bg-gray-100 text-gray-800 font-medium">
                                                {player.candidateNumber || "N/A"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <Badge
                                                className={`${player.gender
                                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                                    : "bg-pink-100 text-pink-800 border-pink-200"
                                                    } font-medium`}
                                            >
                                                {player.gender ? "Nam" : "Nữ"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 text-center">
                                            <ScoreButton
                                                playerId={player.playerRegistrationId}
                                                playerName={player.fullName}
                                                registrationName={player.registrationName}
                                                gender={player.gender}
                                                email={player.email}
                                                onScoreSubmitted={onStatusChange}
                                                candidateNumber={player.candidateNumber}
                                                onStatusChange={onStatusChange}
                                                className="bg-[#bd2427] hover:bg-[#a01e21] text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ClipboardList className="w-4 h-4" />
                                                Chấm điểm
                                            </ScoreButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <ClipboardList className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="font-medium">Không có cầu thủ nào đang chờ chấm điểm</p>
                                            <p className="text-sm text-gray-400 mt-1">Các cầu thủ sẽ xuất hiện ở đây sau khi điểm danh</p>
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
}

