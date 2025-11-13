// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        bg: {
          DEFAULT: "#081827", // page background
          soft: "#0C2138", // surfaces
          hover: "#102944",
        },
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#b6d4ff",
          300: "#8cb8ff",
          400: "#5f98ff",
          500: "#3b82f6", // main blue
          600: "#2f6bd4",
          700: "#2556ac",
          800: "#1e478c",
          900: "#1a3b73",
        },
        text: {
          base: "#e8f0fb",
          muted: "#a2b5cd",
        },
        outline: "#2C4566",
      },
      borderRadius: {
        xl2: "1rem",
        xl3: "1.25rem",
      },
      boxShadow: {
        card: "0 6px 24px rgba(5, 20, 42, 0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
        glow: "0 0 0 1px rgba(74, 144, 255, 0.24), 0 8px 32px rgba(24, 84, 190, 0.35)",
      },
      backgroundImage: {
        // Used for hero and CTA glows
        "radial-1":
          "radial-gradient(800px 400px at 75% 30%, rgba(17, 109, 255, 0.22), rgba(17,109,255,0) 60%), radial-gradient(700px 380px at 25% 65%, rgba(0, 188, 255, 0.18), rgba(0,188,255,0) 55%)",
        "radial-2":
          "radial-gradient(600px 320px at 85% 40%, rgba(60, 120, 255, 0.30), rgba(60,120,255,0) 60%), radial-gradient(500px 250px at 20% 80%, rgba(0, 166, 255, 0.18), rgba(0,166,255,0) 52%)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Arial"],
      },
    },
  },
  plugins: [],
};

export default config;
