/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ["bamsapi.tranhiep.id.vn", "*"], // Add your external hostname(s) here
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**', // Chấp nhận tất cả domain
          },
          {
            protocol: 'http',
            hostname: '**', // Nếu cần hỗ trợ cả http
          },
        ],
      },
};

export default nextConfig;
