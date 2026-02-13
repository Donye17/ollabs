
import * as React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {

        // Manual variant handling since we don't have cva
        const variants = {
            default: "bg-zinc-50 text-zinc-950 hover:bg-zinc-50/90",
            destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90",
            outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100 hover:text-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50",
            secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 bg-zinc-800 text-zinc-50 hover:bg-zinc-800/80",
            ghost: "hover:bg-zinc-100 hover:text-zinc-900 hover:bg-zinc-800 hover:text-zinc-50",
            link: "text-zinc-900 underline-offset-4 hover:underline text-zinc-50",
        }

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-zinc-950 focus-visible:ring-zinc-300",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
