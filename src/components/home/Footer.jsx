import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 text-red-400">Yên Hòa Storm</h3>
                        <p className="mb-4 text-gray-400">
                            Đội bóng rổ hàng đầu tại Hà Nội, mang đến niềm đam mê và tinh thần thể thao cho cộng đồng.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-red-400">Liên kết nhanh</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#about" className="hover:text-red-400 transition-colors">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="#achievements" className="hover:text-red-400 transition-colors">
                                    Thành tích
                                </Link>
                            </li>
                            <li>
                                <Link href="#gallery" className="hover:text-red-400 transition-colors">
                                    Thư viện
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:text-red-400 transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-red-400">Theo dõi chúng tôi</h4>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/YenHoaBasketballTeam" className="hover:text-red-400 transition-colors">
                                <Facebook />
                            </a>
                            <a href="#" className="hover:text-red-400 transition-colors">
                                <Instagram />
                            </a>
                            <a href="#" className="hover:text-red-400 transition-colors">
                                <Twitter />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2023 Yên Hòa Storm. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
