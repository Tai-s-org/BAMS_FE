"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Users, UserRound, UserX } from "lucide-react"
import { Input } from "@/components/ui/Input"
import Link from "next/link"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/Alert-dialog"

const registrators = [
    { id: "REG001", name: "John Smith", dateOfBirth: "1988-05-12", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", status: "pending" },
    { id: "REG002", name: "Sarah Johnson", dateOfBirth: "1995-09-23", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", status: "pending" },
    { id: "REG003", name: "Michael Brown", dateOfBirth: "1981-11-07", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", status: "pending" },
    { id: "REG004", name: "Emily Davis", dateOfBirth: "1992-03-18", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", status: "pending" },
];

const players = [
    { id: "PLY001", name: "James Wilson", dateOfBirth: "2001-07-15", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY002", name: "Emma Martinez", dateOfBirth: "2004-02-28", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", disabled: true },
    { id: "PLY003", name: "David Thompson", dateOfBirth: "1999-12-05", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY004", name: "Sophia Garcia", dateOfBirth: "2002-08-19", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY005", name: "Daniel Rodriguez", dateOfBirth: "2000-04-11", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY006", name: "Olivia Chen", dateOfBirth: "2003-06-22", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY007", name: "Ethan Williams", dateOfBirth: "1998-10-30", gender: "Male", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
    { id: "PLY008", name: "Ava Johnson", dateOfBirth: "2001-01-14", gender: "Female", avatar: "/placeholder.svg?height=40&width=40", disabled: false },
];

const teams = [
    { id: "TEAM001", name: "Blazers", category: "Senior Men" },
    { id: "TEAM002", name: "Rockets", category: "Senior Men" },
    { id: "TEAM003", name: "Stars", category: "Senior Women" },
    { id: "TEAM004", name: "Thunder", category: "Junior Men" },
    { id: "TEAM005", name: "Lightning", category: "Junior Women" },
];

export default function MemberAssignment() {
    const [userType, setUserType] = useState("players");
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [disableDialogOpen, setDisableDialogOpen] = useState(false);
    const [userToDisable, setUserToDisable] = useState(null);

    const handleAssignTeam = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleTeamSelection = (team) => {
        alert(`${selectedUser?.name} has been assigned to ${team.name}`);
        setDialogOpen(false);
    };

    const handleDisableUser = (user) => {
        setUserToDisable(user);
        setDisableDialogOpen(true);
    };

    const confirmDisable = () => {
        alert(`${userToDisable?.name} has been ${userToDisable?.disabled ? "enabled" : "disabled"}`);
        setDisableDialogOpen(false);
    };

    const filteredUsers = (() => {
        switch (userType) {
            case "players":
                return players.filter((player) => !player.disabled);
            case "disabled-players":
                return players.filter((player) => player.disabled);
            case "registrators":
                return registrators;
            default:
                return [];
        }
    })().filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleApproveRegistrator = (user) => {
        setSelectedUser(user);
        setApproveDialogOpen(true);
    };

    const handleRejectRegistrator = (user) => {
        setSelectedUser(user);
        setRejectDialogOpen(true);
    };

    const confirmApprove = () => {
        alert(`${selectedUser?.name} has been approved`);
        setApproveDialogOpen(false);
    };

    const confirmReject = () => {
        alert(`${selectedUser?.name} has been rejected`);
        setRejectDialogOpen(false);
    };

    // Translation object
    const translations = {
        title: {
            en: "Assign Member to Team",
        },
        description: {
            en: "Select members and assign them to available basketball teams",
        },
        buttons: {
            players: {
                en: "Players List",
            },
            disabledPlayers: {
                en: "Disabled Players",
            },
            registrators: {
                en: "Registrator List",
            },
        },
        table: {
            id: {
                en: "ID",
            },
            member: {
                en: "Member",
            },
            dob: {
                en: "Date of Birth",
            },
            gender: {
                en: "Gender",
            },
            actions: {
                en: "Actions",
            },
        },
        actions: {
            assign: {
                en: "Assign to Team",
            },
            enable: {
                en: "Enable",
            },
            disable: {
                en: "Disable",
            },
            approve: {
                en: "Approve",
            },
            approved: {
                en: "Đã Phê Duyệt",
            },
            reject: {
                en: "Reject",
            },
            rejected: {
                en: "Đã Từ Chối",
            },
        },
        gender: {
            male: {
                en: "Male",
            },
            female: {
                en: "Female",
            },
        },
        dialog: {
            approve: {
                title: {
                    en: "Approve Registration",
                },
                description: {
                    en: "Are you sure you want to approve this registration?",
                },
            },
            reject: {
                title: {
                    en: "Reject Registration",
                },
                description: {
                    en: "Are you sure you want to reject this registration?",
                },
            },
            enable: {
                title: {
                    en: "Enable Player",
                },
                description: {
                    en: "Are you sure you want to enable this player?",
                },
            },
            disable: {
                title: {
                    en: "Disable Player",
                },
                description: {
                    en: "Are you sure you want to disable this player?",
                },
            },
        },
        search: {
            placeholder: {
                en: "Search by name or ID...",
            },
        },
        pagination: {
            showing: {
                en: "Showing",
            },
            to: {
                en: "to",
            },
            of: {
                en: "of",
            },
            entries: {
                en: "entries",
            },
            previous: {
                en: "Previous",
            },
            next: {
                en: "Next",
            },
        },
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>
                    <span className="flex flex-col gap-1">
                        <span>{translations.title.en}</span>
                    </span>
                </CardTitle>
                <CardDescription>
                    <span className="flex flex-col gap-1">
                        <span>{translations.description.en}</span>
                    </span>
                </CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                        variant={userType === "players" ? "default" : "outline"}
                        onClick={() => {
                            setUserType("players")
                            setCurrentPage(1)
                        }}
                        className="flex items-center gap-2"
                    >
                        <UserRound className="h-4 w-4" />
                        <span className="flex flex-col items-start text-xs">
                            <span>{translations.buttons.players.en}</span>
                        </span>
                    </Button>
                    <Button
                        variant={userType === "disabled-players" ? "default" : "outline"}
                        onClick={() => {
                            setUserType("disabled-players")
                            setCurrentPage(1)
                        }}
                        className="flex items-center gap-2"
                    >
                        <UserX className="h-4 w-4" />
                        <span className="flex flex-col items-start text-xs">
                            <span>{translations.buttons.disabledPlayers.en}</span>
                        </span>
                    </Button>
                    <Button
                        variant={userType === "registrators" ? "default" : "outline"}
                        onClick={() => {
                            setUserType("registrators")
                            setCurrentPage(1)
                        }}
                        className="flex items-center gap-2"
                    >
                        <Users className="h-4 w-4" />
                        <span className="flex flex-col items-start text-xs">
                            <span>{translations.buttons.registrators.en}</span>
                        </span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            placeholder={`${translations.search.placeholder.en}`}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="pl-10"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-muted-foreground"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    <span className="flex flex-col gap-1">
                                        <span>{translations.table.id.en}</span>
                                    </span>
                                </TableHead>
                                <TableHead>
                                    <span className="flex flex-col gap-1">
                                        <span>{translations.table.member.en}</span>
                                    </span>
                                </TableHead>
                                <TableHead>
                                    <span className="flex flex-col gap-1">
                                        <span>{translations.table.dob.en}</span>
                                    </span>
                                </TableHead>
                                <TableHead>
                                    <span className="flex flex-col gap-1">
                                        <span>{translations.table.gender.en}</span>
                                    </span>
                                </TableHead>
                                <TableHead className="text-right">
                                    <span className="flex flex-col gap-1 items-end">
                                        <span>{translations.table.actions.en}</span>
                                    </span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Link
                                                    href={`/${userType === "registrators" ? "member-assignment/registrator" : "member-assignment/player"}/${user.id}`}
                                                    className="hover:underline hover:text-primary"
                                                >
                                                    {user.name}
                                                </Link>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                                        <TableCell>
                                            <span className="flex flex-col gap-1">
                                                <span>{translations.gender[user.gender.toLowerCase()].en}</span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {userType === "registrators" ? (
                                                    <>
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handleApproveRegistrator(user)}
                                                            disabled={user.status === "approved"}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            <span className="flex flex-col">
                                                                <span>
                                                                    {user.status === "approved"
                                                                        ? translations.actions.approved.en
                                                                        : translations.actions.approve.en}
                                                                </span>
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleRejectRegistrator(user)}
                                                            disabled={user.status === "rejected"}
                                                        >
                                                            <span className="flex flex-col">
                                                                <span>
                                                                    {user.status === "rejected"
                                                                        ? translations.actions.rejected.en
                                                                        : translations.actions.reject.en}
                                                                </span>
                                                            </span>
                                                        </Button>
                                                    </>
                                                ) : userType === "disabled-players" ? (
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleDisableUser(user)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <span className="flex flex-col">
                                                            <span>{translations.actions.enable.en}</span>
                                                        </span>
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button variant="outline" size="sm" onClick={() => handleAssignTeam(user)}>
                                                            <span className="flex flex-col">
                                                                <span>{translations.actions.assign.en}</span>
                                                            </span>
                                                        </Button>
                                                        <Button variant="destructive" size="sm" onClick={() => handleDisableUser(user)}>
                                                            <span className="flex flex-col">
                                                                <span>{translations.actions.disable.en}</span>
                                                            </span>
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6">
                                        No members found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination with translations */}
                {filteredUsers.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                            {translations.pagination.showing.en}{" "}
                            {Math.min(filteredUsers.length, (currentPage - 1) * itemsPerPage + 1)} {translations.pagination.to.en}{" "}
                            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {translations.pagination.of.en}{" "}
                            {filteredUsers.length} {translations.pagination.entries.en}
                            <br />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <span className="flex flex-col">
                                    <span>{translations.pagination.previous.en}</span>
                                </span>
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-9"
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <span className="flex flex-col">
                                    <span>{translations.pagination.next.en}</span>
                                </span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Team Assignment Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Assign {selectedUser?.name} to Team</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium">Available Teams</h3>
                                <div className="grid gap-2">
                                    {teams.map((team) => (
                                        <Button
                                            key={team.id}
                                            variant="outline"
                                            className="justify-start"
                                            onClick={() => handleTeamSelection(team)}
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">{team.name}</span>
                                                <span className="text-xs text-muted-foreground">{team.category}</span>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Approve Dialog */}
                <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Approve Registration</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to approve {selectedUser?.name}'s registration? This will allow them to be
                                assigned to teams.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmApprove} className="bg-green-600 hover:bg-green-700">
                                Approve
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Reject Dialog */}
                <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Reject Registration</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to reject {selectedUser?.name}'s registration? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmReject} className="bg-destructive hover:bg-destructive/90">
                                Reject
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}