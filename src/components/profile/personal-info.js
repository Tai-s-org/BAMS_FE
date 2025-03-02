import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function PersonalInfo({ gender, dateOfBirth, height, weight, position }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPositionColor = (pos) => {
    const colors = {
      PG: "bg-blue-500",
      SG: "bg-green-500",
      SF: "bg-yellow-500",
      PF: "bg-orange-500",
      C: "bg-red-500",
    };
    return colors[pos] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Gender</p>
            <p className="text-sm text-muted-foreground">{gender}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Date of Birth</p>
            <p className="text-sm text-muted-foreground">{formatDate(dateOfBirth)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Height</p>
            <p className="text-sm text-muted-foreground">{height} cm</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Weight</p>
            <p className="text-sm text-muted-foreground">{weight} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Position</p>
            <Badge variant="secondary" className={`mt-1 ${getPositionColor(position)}`}>
              {position}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
