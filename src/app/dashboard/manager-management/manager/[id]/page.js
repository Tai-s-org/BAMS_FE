"use client";

import ManagerDetail from "@/components/manager-manament/ManagerDetail";
import { useParams } from 'next/navigation';

export default function ManagerDetailPage() {
    const { id } = useParams();
    return (
        <div>
            <ManagerDetail id={id}/>
        </div>
    );
}