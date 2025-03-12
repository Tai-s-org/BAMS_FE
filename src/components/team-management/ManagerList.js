import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";

export default function ManagerList({ managers }) {
  return (
    <Card className="border-t-2 border-t-[#BD2427]">
      <CardHeader>
        <CardTitle className="text-lg">Đội Ngũ Quản Lý</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Ngân Hàng</TableHead>
              <TableHead>Số Tài Khoản</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={manager.managerName} />
                      <AvatarFallback>
                        {manager.managerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{manager.managerName}</span>
                  </div>
                </TableCell>
                <TableCell>{manager.bankName || "-"}</TableCell>
                <TableCell>
                  {manager.bankAccountNumber ? "••••" + manager.bankAccountNumber.slice(-4) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}