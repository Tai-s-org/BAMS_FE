"use client";


import { useAuth } from "@/hooks/context/AuthContext";
import { useParams } from 'next/navigation';
import PresidentReportDetail from "./PresidentPaymentDetail";
import ManagerReportDetail from "./ManagerPaymentDetail";
import PlayerPaymentDetail from "./PlayerPaymentDetail";
import ParentPaymentDetail from "./ParentPaymentDetail";

export default function PaymentDetailPage() {
    const { user } = useAuth();
    const { id } = useParams();

    return (
        user ? (
            <div>
                {user.roleCode == "President" && <PresidentReportDetail />}
                {user.roleCode == "Manager" && <ManagerReportDetail />}
                {user.roleCode == "Player" && <PlayerPaymentDetail />}
                {user.roleCode == "Parent" && <ParentPaymentDetail />}
            </div>
        ) : null
    )
}