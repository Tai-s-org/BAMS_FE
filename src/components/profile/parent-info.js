import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Mail, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/Alert-dialog";

export function ParentInfo({ parentInfo, onRemove }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Parent Information</CardTitle>
        {onRemove && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Parent Information</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove the parent information? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onRemove} className="bg-destructive hover:bg-destructive/90">
                  Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Name</p>
            <p className="text-sm text-muted-foreground">{parentInfo.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">Relationship</p>
            <p className="text-sm text-muted-foreground">{parentInfo.relationship}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`tel:${parentInfo.phoneNumber}`}
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            <span>{parentInfo.phoneNumber}</span>
          </Link>
          <Link
            href={`mailto:${parentInfo.email}`}
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            <span>{parentInfo.email}</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
