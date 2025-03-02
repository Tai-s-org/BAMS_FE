import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function RegistratorInfo({ reason, experience, achievement, tryOutNote }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Reason to Choose Club</h3>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Basketball Experience</h3>
          <p className="text-sm text-muted-foreground">{experience}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Achievements</h3>
          <p className="text-sm text-muted-foreground">{achievement}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">Try Out Notes</h3>
          <p className="text-sm text-muted-foreground">{tryOutNote}</p>
        </div>
      </CardContent>
    </Card>
  );
}
