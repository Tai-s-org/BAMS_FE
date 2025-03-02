import React from "react";

const InfoSection = () => {
    const infoItems = [
        {
            title: "Lịch sử hình thành",
            content:
                "Yên Hòa Storm được thành lập vào năm 2010 bởi một nhóm những người yêu bóng rổ tại quận Cầu Giấy, Hà Nội. Từ một đội bóng nghiệp dư, chúng tôi đã phát triển thành một trong những câu lạc bộ bóng rổ hàng đầu tại Hà Nội.",
            image: "/history.jpg",
        },
        {
            title: "Tầm nhìn và sứ mệnh",
            content:
                "Chúng tôi hướng đến việc trở thành một trung tâm đào tạo bóng rổ chuyên nghiệp, nơi ươm mầm cho những tài năng trẻ và góp phần phát triển phong trào bóng rổ tại Việt Nam.",
            image: "/vision.jpg",
        },
        {
            title: "Đội ngũ huấn luyện viên",
            content:
                "Yên Hòa Storm tự hào có đội ngũ huấn luyện viên giàu kinh nghiệm, trong đó có cả các cựu cầu thủ quốc gia. Họ không chỉ truyền đạt kỹ năng mà còn truyền cảm hứng cho các cầu thủ trẻ.",
            image: "/coaches.jpg",
        },
        {
            title: "Cơ sở vật chất",
            content:
                "Chúng tôi sở hữu một sân tập hiện đại với đầy đủ trang thiết bị, đảm bảo môi trường tập luyện tốt nhất cho các cầu thủ. Ngoài ra, chúng tôi còn có phòng gym và khu vực phục hồi chấn thương.",
            image: "/facilities.jpg",
        },
    ];

    return (
        <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-red-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 text-red-400">Về Yên Hòa Storm</h2>
                {infoItems.map((item, index) => (
                    <div
                        key={index}
                        className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center mb-20`}
                    >
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <h3 className="text-3xl font-semibold mb-4 text-red-400">{item.title}</h3>
                            <p className="text-lg leading-relaxed">{item.content}</p>
                        </div>
                        <div className="md:w-1/2 md:px-8">
                            <div className="relative h-80 w-full overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoSection;
