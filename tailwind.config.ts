import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-space)', 'sans-serif'],
                heading: ['var(--font-archivo)', 'sans-serif'],
            },
            colors: {
                primary: '#2563EB',
                secondary: '#60A5FA',
                cta: '#F43F5E',
            },
        },
    },
    plugins: [],
};
export default config;
