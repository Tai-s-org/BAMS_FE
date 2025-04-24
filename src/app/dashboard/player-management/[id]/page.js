"use client";

import PlayerDetailPage from "@/components/players/PlayerProfile";
import { useParams } from "next/navigation";

export default function PlayerProfile() {
    const { id } = useParams();

    return (
        <div>
               <PlayerDetailPage playerId={id}/>
        </div>
    );
}