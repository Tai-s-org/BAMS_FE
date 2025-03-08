import Image from "next/image";

const AchievementsSection = () => {
    return (
        <section id="achievements" className="py-20 bg-gradient-to-b from-red-900 to-gray-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 text-red-400">Thành tích nổi bật</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
                        <div className="relative h-64">
                            <Image src="/assets/achievement/achievement1.jpg" alt="Giải vô địch" layout="fill" objectFit="cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <h3 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                                Vô địch giải đấu THCS & THPT thành phố Hà Nội 2021
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-300">
                                Chiến thắng ngoạn mục tại giải đấu lớn nhất trong năm, khẳng định vị thế của Yên Hòa Storm trên bản đồ
                                bóng rổ Hà Nội.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg shadow-lg p-6 text-white transform transition-all hover:scale-105">
                            <h4 className="text-4xl font-bold mb-2">50+</h4>
                            <p>Giải thưởng đã đạt được</p>
                        </div>
                        <div className="bg-gradient-to-bl from-red-800 to-red-600 rounded-lg shadow-lg p-6 text-white transform transition-all hover:scale-105">
                            <h4 className="text-4xl font-bold mb-2">300+</h4>
                            <p>Thành viên đã tham gia</p>
                        </div>
                        <div className="bg-gradient-to-tr from-red-800 to-red-600 rounded-lg shadow-lg p-6 text-white transform transition-all hover:scale-105">
                            <h4 className="text-4xl font-bold mb-2">15+</h4>
                            <p>Năm kinh nghiệm</p>
                        </div>
                        <div className="bg-gradient-to-tl from-red-800 to-red-600 rounded-lg shadow-lg p-6 text-white transform transition-all hover:scale-105">
                            <h4 className="text-4xl font-bold mb-2">9</h4>
                            <p>Huấn luyện viên chuyên nghiệp</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AchievementsSection;
