import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-gradient-to-b from-red-900 to-gray-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 text-red-400">Liên hệ với chúng tôi</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        <form className="space-y-6">
                            <Input placeholder="Họ và tên" className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
                            <Input
                                type="email"
                                placeholder="Email"
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                            <Textarea
                                placeholder="Tin nhắn"
                                rows={4}
                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            />
                            <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white">
                                Gửi tin nhắn
                            </Button>
                        </form>
                    </div>
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                        <div className="flex items-center space-x-4">
                            <Mail className="w-8 h-8 text-red-400" />
                            <span className="text-lg">yhbasketballteam@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Phone className="w-8 h-8 text-red-400" />
                            <span className="text-lg">+84 123 456 789</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <MapPin className="w-8 h-8 text-red-400" />
                            <span className="text-lg">251 Đường Nguyễn Khang, Yên Hoà, Cầu Giấy, Hà Nội</span>
                        </div>
                        <div className="mt-8">
                            <iframe
                                src="https://maps.google.com/maps?width=600&height=400&hl=en&q=Tr%C6%B0%E1%BB%9Dng%20THPT%20Y%C3%AAn%20H%C3%B2a&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
