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
};

export default nextConfig;
