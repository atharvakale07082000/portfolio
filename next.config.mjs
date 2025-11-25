/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/chat',
                destination: process.env.BACKEND_URL || 'http://backend:8000/api/chat',
            },
        ];
    },
};

export default nextConfig;
