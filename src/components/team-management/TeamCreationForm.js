"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
// import { toast } from "@/components/";

export default function TeamCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên đội",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTeamName("");
      toast({
        title: "Đã tạo đội thành công",
        description: `Đội bóng "${teamName}" đã được tạo.`,
      });
    }, 1500);
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
            <Label htmlFor="team-name">Tên Đội</Label>
            <Input
              id="team-name"
              placeholder="Nhập tên đội"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
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
