import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "../ui/Button";

export default function ManagerList({ managers, onRemoveMember }) {
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
              <TableHead>Email</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Ngân Hàng</TableHead>
              <TableHead>Số Tài Khoản</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.userId}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={manager.managerName} />
                      <AvatarFallback className="bg-[#BD2427]/80 text-white">
                        {manager.managerName
                          .charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{manager.managerName}</span>
                  </div>
                </TableCell>
                <TableCell>{manager.managerEmail || "-"}</TableCell>
                <TableCell>{manager.managerPhone || "-"}</TableCell>
                <TableCell>{manager.bankName || "-"}</TableCell>
                <TableCell>
                  {manager.bankAccountNumber ? "••••" + manager.bankAccountNumber.slice(-4) : "-"}
                </TableCell>
                <TableCell>
                  <Button className="text-white hover:bg-red-900 ml-2" onClick={() => onRemoveMember(manager.userId, manager.managerName)}>Xóa</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}