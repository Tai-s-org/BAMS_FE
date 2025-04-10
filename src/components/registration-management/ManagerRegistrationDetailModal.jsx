"use client"

import { Button } from "@/components/ui/Button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { format } from "date-fns"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"

export function RegistrationDetailsModal({ isOpen, onClose, registration, onApprove, onReject, }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết đơn đăng kí</DialogTitle>
                    <DialogDescription>
                        Submitted on {format(new Date(registration.submitedDate), "MMMM dd, yyyy")}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Registration ID</h3>
                            <p>{registration.managerRegistrationId}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Họ và tên</h3>
                            <p>{registration.fullName}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Generation & School</h3>
                            <p>{registration.generationAndSchoolName}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Contact Information</h3>
                            <p>Phone: {registration.phoneNumber}</p>
                            <p>Email: {registration.email}</p>
                            <p>
                                Facebook:{" "}
                                <a
                                    href={registration.facebookProfileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#bd2427] hover:underline"
                                >
                                    {registration.facebookProfileUrl}
                                </a>
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                            <Badge
                                className={cn(
                                    "mt-1",
                                    registration.status === "Approved" && "bg-green-500",
                                    registration.status === "Rejected" && "bg-red-500",
                                    registration.status === "Pending" && "bg-yellow-500",
                                )}
                            >
                                {registration.status}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Knowledge About Academy</h3>
                            <p>{registration.knowledgeAboutAcademy}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Reason To Choose Us</h3>
                            <p>{registration.reasonToChooseUs}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Knowledge About Manager Role</h3>
                            <p>{registration.knowledgeAboutAmanager}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Experience As Manager</h3>
                            <p>{registration.experienceAsAmanager}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Strengths</h3>
                            <p>{registration.strength}</p>
                        </div>

                        <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Weaknesses & Solutions</h3>
                            <p>{registration.weaknessAndItSolution}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    {registration.status === "Pending" && (
                        <>
                            <Button
                                variant="outline"
                                className="border-[#bd2427] text-[#bd2427] hover:bg-[#bd2427] hover:text-white"
                                onClick={() => {
                                    onReject(registration.managerRegistrationId)
                                    onClose()
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                className="bg-[#bd2427] hover:bg-[#a01f22]"
                                onClick={() => {
                                    onApprove(registration.managerRegistrationId)
                                    onClose()
                                }}
                            >
                                Approve
                            </Button>
                        </>
                    )}
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

