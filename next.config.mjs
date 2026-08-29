/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'public.blob.vercel-storage.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
            },
        ],
    },
    async redirects() {
        return [
            // The Unimed "Somos 200mil Vidas" campaign was published three times in five
            // minutes on 2026-07-27: the first attempt saved with no frame on it, the
            // second was a duplicate, and the third is the live one with the supporters.
            // Anyone still holding an early link lands on the real campaign.
            {
                source: '/c/somos-200mil-vidas-tzux',
                destination: '/c/somos-200mil-vidas-p02b',
                permanent: true,
            },
            {
                source: '/c/somos-200mil-vidas-r2kt',
                destination: '/c/somos-200mil-vidas-p02b',
                permanent: true,
            },
            // The es/id/tl marketing trees were removed on 2026-08-28. Real
            // usage was near zero (97% of frame uses are Brazil) and ~20
            // near-identical templated pages were a large part of why AdSense
            // flagged the site for low value content. Product UI in those
            // languages still works via the locale cookie.
            { source: '/es', destination: '/', permanent: true },
            { source: '/es/:path*', destination: '/', permanent: true },
            { source: '/id', destination: '/', permanent: true },
            { source: '/id/:path*', destination: '/', permanent: true },
            { source: '/tl', destination: '/', permanent: true },
            { source: '/tl/:path*', destination: '/', permanent: true },
        ];
    },
};

export default nextConfig;
