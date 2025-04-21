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
                {user.roleCode == "President" && <PresidentReportDetail id={id} />}
                {user.roleCode == "Manager" && <ManagerReportDetail id={id}/>}
                {user.roleCode == "Player" && <PlayerPaymentDetail id={id} />}
                {user.roleCode == "Parent" && <ParentPaymentDetail id={id}/>}
            </div>
        ) : null
    )
}