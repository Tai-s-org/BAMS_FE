"use client";

import { useAuth } from "@/hooks/context/AuthContext";
import { useParams } from 'next/navigation';
import PresidentPayment from "../PresidentPayment";
import ManagerPayment from "../ManagerPayment";
import PlayerPayment from "../PlayerPayment";
import ParentPayment from "../ParentPayment";

export default function PaymentPage() {
    const { user } = useAuth();
    const { id } = useParams();

    return (
        user ? (
            <div>
                {user.roleCode == "President" && <PresidentPayment />}
                {user.roleCode == "Manager" && <ManagerPayment />}
                {user.roleCode == "Player" && <PlayerPayment />}
                {user.roleCode == "Parent" && <ParentPayment />}
            </div>
        ) : null
    )
}