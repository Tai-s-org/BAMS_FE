import Image from "next/image";

const Banner = () => {
    return (
        <div className="relative w-full h-[600px] overflow-hidden">
            <Image
                src="/assets/banner/banner1.jpg"
                alt="Yên Hòa Storm Banner"
                layout="fill"
                objectFit="cover"
                loading="lazy"
                className="brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-transparent"></div>
            {/* <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-6xl font-bold text-white text-center shadow-text px-4">
                    YÊN HÒA YÊN HÒA <br /> YÊN HÒA CHIẾN
                </h2>
            </div> */}
        </div>
    );
};

export default Banner;
