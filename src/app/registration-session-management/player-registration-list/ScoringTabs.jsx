"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { ScoreButton } from "../../demo/score-button"

export function ScoringTab({ players, onStatusChange }) {
    return (
        <div>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Số điện thoại</TableHead>
                            <TableHead>Số báo danh</TableHead>
                            <TableHead>Giới tính</TableHead>
                            <TableHead>Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.length > 0 ? (
                            players.map((player) => (
                                <TableRow key={player.playerRegistrationId}>
                                    <TableCell>{player.fullName}</TableCell>
                                    <TableCell>{player.email}</TableCell>
                                    <TableCell>{player.phoneNumber}</TableCell>
                                    <TableCell>{player.candidateNumber}</TableCell>
                                    <TableCell>{player.gender ? "Nam" : "Nữ"}</TableCell>
                                    <TableCell>
                                        <ScoreButton
                                            playerId={player.playerRegistrationId}
                                            playerName={player.fullName}
                                            registrationName={player.registrationName}
                                            gender={player.gender}
                                            email={player.email}
                                            onScoreSubmitted={onStatusChange}
                                            candidateNumber={player.candidateNumber}
                                            onStatusChange = {onStatusChange}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-4">
                                    Không có cầu thủ nào đang chờ chấm điểm
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

