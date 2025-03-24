import Link from "next/link";
import React from "react";
import { Button } from "../ui/Button";

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-red-600 via-[#BD2427] to-red-600 text-white py-20">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-5xl font-bold mb-4 shadow-text">Tuyển quân cho đội bóng rổ Yên Hòa Storm</h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Tham gia cùng chúng tôi và trở thành ngôi sao bóng rổ tiếp theo! Khám phá tiềm năng của bạn cùng đội ngũ huấn
                    luyện viên chuyên nghiệp.
                </p>
                <Link href={'/auth/registration'}>
                    <Button className="bg-white text-[#BD2427] hover:bg-red-100 text-lg px-8 py-3 rounded-full shadow-lg transform transition hover:scale-105">
                        Đăng ký ngay
                    </Button>
                </Link>

            </div>
        </section>
    );
};

export default HeroSection;
