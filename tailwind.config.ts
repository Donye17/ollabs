import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                display: ['var(--font-display)', 'var(--font-inter)', 'sans-serif'],
            },
            colors: {
                // Ollabs brand system
                ink: '#06141F',
                paper: '#F4F1EA',
                paper2: '#EAE6DC',
                cream: '#FDFCF9',
                brand: {
                    DEFAULT: '#01BEF6',
                    deep: '#0288B8',
                    wash: '#E4F7FE',
                },
                coral: '#FF5C39',
                amber: '#FFC24B',
                muted: '#726C5F',
                // legacy aliases kept so existing components compile
                primary: '#01BEF6',
                secondary: '#EAE6DC',
                cta: '#FF5C39',
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-up': 'slide-up 0.5s ease-out',
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                marquee: "marquee 40s linear infinite",
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                marquee: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-50%)" },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
};
export default config;
