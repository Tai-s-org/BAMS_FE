import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "../ui/Button";
import Link from "next/link";
import { LuEye } from "react-icons/lu";

export default function PlayerList({ players, onRemoveMember }) {
  return (
    <Card className="border-t-2 border-t-[#BD2427]">
      <CardHeader>
        <CardTitle className="text-lg">Danh Sách Cầu Thủ</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cầu Thủ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Ngày sinh</TableHead>
              <TableHead>Vị Trí</TableHead>
              <TableHead>Chiều Cao</TableHead>
              <TableHead>Cân Nặng</TableHead>
              <TableHead>Ngày Tham Gia</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          {players.length > 0 ? (<TableBody>
            {players.map((player) => (
              <TableRow key={player.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={player.fullname} />
                      <AvatarFallback className="bg-[#BD2427]/80 text-white">
                        {player.fullname
                          .charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{player.fullname}</span>
                  </div>
                </TableCell>
                <TableCell>{player.email || "-"}</TableCell>
                <TableCell>{player.phone || "-"}</TableCell>
                <TableCell>{player.dateOfBirth || "-"}</TableCell>
                <TableCell>{player.position || "-"}</TableCell>
                <TableCell>{player.height || "-"} cm</TableCell>
                <TableCell>{player.weight || "-"} kg</TableCell>
                <TableCell>{new Date(player.clubJoinDate).toLocaleDateString()}</TableCell>
                <TableCell>
                <Button className="text-[#BD2427] bg-white hover:bg-gray-200 border border-[#BD2427]" asChild>
                    <Link href={`/dashboard/player-management/${player.userId}`}><LuEye className="mr-2" />Chi tiết</Link>
                  </Button>
                  <Button className="text-white hover:bg-red-900 ml-2" onClick={() => onRemoveMember(player.userId, player.fullname)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>)
            :
            (<TableBody>
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Không có cầu thủ nào trong đội bóng này
                </TableCell>
              </TableRow>
            </TableBody>
            )}
        </Table>
      </CardContent>
    </Card>
  );
}