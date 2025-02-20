import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    require("glare-typography"),
    require("glare-themes"),
    require("glare-torch-mode"),
    function ({ addVariant }: any) {
      addVariant("rtl", '&[dir="rtl"]');
      addVariant("ltr", '&[dir="ltr"]');
    },
  ],
  safelist: [
    "animate-float-in", // Ensures this class is not purged
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "float-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) translateX(20px) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) translateX(0) scale(1)",
          },
        },
        "float-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0) translateX(0) scale(1)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(20px) translateX(20px) scale(0.5)",
          },
        },
      },
      animation: {
        "float-in": "float-in 0.3s ease-in-out forwards",
        "float-out": "float-out 0.3s ease-in-out forwards",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
} satisfies Config;
