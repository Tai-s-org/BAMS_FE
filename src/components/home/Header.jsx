import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/assets/logo/logo.png" alt="Yên Hòa Storm Logo" width={50} height={50} className="rounded-full" />
                    <span className="text-2xl font-bold">Yên Hòa Storm</span>
                </Link>
                <nav className="hidden md:flex space-x-6">
                    <Link href="#about" className="hover:text-red-400 transition-colors">
                        Giới thiệu
                    </Link>
                    <Link href="#achievements" className="hover:text-red-400 transition-colors">
                        Thành tích
                    </Link>
                    <Link href="#gallery" className="hover:text-red-400 transition-colors">
                        Thư viện
                    </Link>
                    <Link href="#contact" className="hover:text-red-400 transition-colors">
                        Liên hệ
                    </Link>
                </nav>
                <Link href={'/login'}>
                    <Button className="bg-red-600 text-white hover:bg-red-700">Đăng nhập</Button>
                </Link>

            </div>
        </header>
    );
};

export default Header;
