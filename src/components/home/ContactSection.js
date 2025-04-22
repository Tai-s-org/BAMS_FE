'use client'

import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useEffect, useState } from "react";
import teamContactApi from "@/api/teamContact";
import Image from "next/image";

const ContactSection = () => {
    const [teamContact, setTeamContact] = useState([]);

    useEffect(() => {
        const fetchTeamContact = async () => {
            try {
                const response = await teamContactApi.getClubContct()
                console.log(response.data);

                setTeamContact(response.data);
            } catch (error) {
                console.error("Error fetching team contact:", error);
            }
        };

        fetchTeamContact();
    }, []);


    return (
        <section id="contact" className="py-20 bg-gradient-to-b from-red-900 to-gray-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16 text-red-400">Liên hệ với chúng tôi</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                        {teamContact.map((contact) => (
                            <div key={contact.contactMethodId} className="flex items-center space-x-4">
                                {/* <Image src={contact.iconUrl} width={'32px'} className="w-8 h-8 text-red-400" /> */}
                                <span className="text-lg">{contact.contactMethodName}: {contact.methodValue}</span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">

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
