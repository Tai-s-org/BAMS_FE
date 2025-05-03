import React from "react";

const GallerySection = () => {
    const images = [
        { src: "/assets/gallery/gall2.jpg", alt: "Trận đấu gay cấn" },
        { src: "/assets/gallery/winner1.jpg", alt: "Khoảnh khắc chiến thắng" },
        { src: "/assets/gallery/gall4.jpg", alt: "Đội tuyển nữ Yên Hòa Storm" },
        { src: "/assets/gallery/gall1.jpg", alt: "Huấn luyện viên và cầu thủ" },
        { src: "/assets/gallery/winner2.jpg", alt: "Khoảnh khắc ăn mừng" },
        { src: "/assets/gallery/gall3.jpg", alt: "Thành viên Yên Hòa Storm" },
    ];

    return (
        <section id="gallery" className="py-20 bg-gradient-to-b from-gray-900 to-red-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 text-red-400">Thư viện ảnh</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden ${index === 0 ? "rounded-tl-3xl" : index  === 2 ? "rounded-tr-3xl" : index  === 3 ? "rounded-bl-3xl" : index  === 5 ? "rounded-br-3xl" : ""} shadow-lg transform transition-all hover:scale-105`}
                        >
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt={image.alt}
                                width={400}
                                height={400}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                                <p className="absolute bottom-4 left-4 text-white font-semibold">{image.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
