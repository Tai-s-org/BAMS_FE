"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import teamApi from "@/api/team";
import { useToasts } from "@/hooks/providers/ToastProvider";

export default function TeamCreationForm({ onTeamCreated }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [gender, setGender] = useState("Nam");
  const { addToast } = useToasts();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      addToast({ message: "Vui lòng nhập tên đội", type: "error" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await teamApi.createTeam({ teamName: gender + " " + teamName });

      if (onTeamCreated) {
        addToast({ message: response?.data.message, type: response?.data.status });
        onTeamCreated();
      }
    } catch (error) {
      console.error("Error creating team:", error);
      addToast({ message: "Tên đội đã tồn tại", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Đội Mới</CardTitle>
        <CardDescription>Nhập tên để tạo đội bóng rổ mới</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="team-name">Tên Đội: {`${gender} ${teamName}`}</Label>
            <div className="flex items-center gap-2">
              {/* Select chiếm 1/4 chiều rộng */}
              <div className="w-1/4">
                <Select
                  id="gender"
                  value={gender}
                  onValueChange={(value) => setGender(value)}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Input chiếm 3/4 chiều rộng */}
              <div className="w-3/4">
                <Input
                  id="team-name"
                  placeholder="Nhập tên đội"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-[#BD2427] hover:bg-[#9a1e21]" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo Đội"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
