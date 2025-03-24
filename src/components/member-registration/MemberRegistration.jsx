import { useState } from "react";
import PlayerRegistrationForm from "./player-registration/PlayerRegistrationForm";
import ManagerRegistrationForm from "./manager-registration/ManagerRegistrationForm";

export default function MemberRegistration() {
    const [activeForm, setActiveForm] = useState("player");

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "#bd2427" }}>
                Biểu Mẫu Đăng Ký
            </h1>

            {/* Form Toggle Buttons */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeForm === "player"
                                ? "bg-[#bd2427] text-white"
                                : "bg-white text-gray-900 hover:bg-gray-100 border border-[#bd2427]"
                            }`}
                        onClick={() => setActiveForm("player")}
                    >
                        Đăng Ký Cầu Thủ
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeForm === "manager"
                                ? "bg-[#bd2427] text-white"
                                : "bg-white text-gray-900 hover:bg-gray-100 border border-[#bd2427]"
                            }`}
                        onClick={() => setActiveForm("manager")}
                    >
                        Đăng Ký Quản Lý
                    </button>
                </div>
            </div>

            {/* Render the active form */}
            {activeForm === "player" ? <PlayerRegistrationForm /> : <ManagerRegistrationForm />}
        </div>
    );
}
