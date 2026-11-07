/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    poweredByHeader: false,
    images: {
        formats: ["image/avif", "image/webp"],
    },
    experimental: {
        optimizePackageImports: ["react-icons", "framer-motion"],
    },
    async rewrites() {
        // The résumé chatbot is served by app/api/chat. These run only when no
        // route matches, so the optional Python backend stays a fallback.
        return {
            afterFiles: [],
            fallback: [
                {
                    source: "/api/chat/:path*",
                    destination: `${process.env.BACKEND_URL || "http://backend:8000"}/api/chat/:path*`,
                },
            ],
        };
    },
};

export default nextConfig;
