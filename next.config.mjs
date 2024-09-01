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
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
            {
                source: "/ingest/decide",
                destination: "https://us.i.posthog.com/decide",
            },
        ];
    },

    skipTrailingSlashRedirect: true,

    typescript: {
        // Ignore TypeScript errors during the build process
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
