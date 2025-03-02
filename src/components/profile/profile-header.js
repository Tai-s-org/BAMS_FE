import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { Facebook, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function ProfileHeader({
  avatar,
  fullName,
  generationAndSchool,
  phoneNumber,
  email,
  facebookUrl,
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40" />
      <CardContent className="relative mt-[-64px] space-y-4 p-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={avatar} alt={fullName} />
            <AvatarFallback className="text-3xl">
              {fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            <p className="text-muted-foreground">{generationAndSchool}</p>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link
                href={`tel:${phoneNumber}`}
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </Link>
              <Link
                href={`mailto:${email}`}
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </Link>
              <Link
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-4 w-4" />
                <span>Facebook Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
