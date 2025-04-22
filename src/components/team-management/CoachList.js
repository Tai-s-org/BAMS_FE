import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "../ui/Button";

export default function CoachList({ coaches, onRemoveMember }) {
  return (
    <Card className="border-t-2 border-t-[#BD2427]">
      <CardHeader>
        <CardTitle className="text-lg">Đội Ngũ Huấn Luyện Viên</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Tiểu Sử</TableHead>
              <TableHead>Thời Hạn Hợp Đồng</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coaches.map((coach) => (
              <TableRow key={coach.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={coach.coachName} />
                      <AvatarFallback className="bg-[#BD2427]/80 text-white">
                        {coach.coachName
                          .charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{coach.coachName}</span>
                  </div>
                </TableCell>
                <TableCell>{coach.coachEmail || "-"}</TableCell>
                <TableCell>{coach.coachPhone || "-"}</TableCell>
                <TableCell>{coach.bio ? coach.bio : "-"}</TableCell>
                <TableCell>
                  {new Date(coach.contractStartDate).toLocaleDateString()} -{" "}
                  {new Date(coach.contractEndDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button className="text-white hover:bg-red-900 ml-2" onClick={() => onRemoveMember(coach.userId, coach.coachName)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}