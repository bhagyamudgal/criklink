/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "g.cricapi.com",
                pathname: "**",
                protocol: "https",
            },
        ],
    },
};

export default nextConfig;
