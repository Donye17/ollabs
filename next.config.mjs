/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'public.blob.vercel-storage.com',
            'lh3.googleusercontent.com',
            'cdn.discordapp.com'
        ],
    },
};

export default nextConfig;
