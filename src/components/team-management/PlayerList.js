import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function PlayerList({ players }) {
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
              <TableHead>Vị Trí</TableHead>
              <TableHead className="text-center">Số Áo</TableHead>
              <TableHead>Chiều Cao</TableHead>
              <TableHead>Cân Nặng</TableHead>
              <TableHead>Ngày Tham Gia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={player.fullname} />
                      <AvatarFallback>
                        {player.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{player.fullname}</span>
                  </div>
                </TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell className="text-center">{player.shirtNumber || "-"}</TableCell>
                <TableCell>{player.height} cm</TableCell>
                <TableCell>{player.weight} kg</TableCell>
                <TableCell>{new Date(player.clubJoinDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}