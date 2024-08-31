/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "*",
                pathname: "**",
                protocol: "https",
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: "/og/match/:matchId",
                destination: "/api/v1/og/match/:matchId",
            },
        ];
    },
};

export default nextConfig;
