import PlayerRegistrationForm from "@/components/member-registration/player-registration/PlayerRegistrationForm";


export default function PlayerRegistration() {

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8" style={{ color: "#bd2427" }}>
                Biểu Mẫu Đăng Ký
            </h1>
            <PlayerRegistrationForm />
        </div>
    );
}
