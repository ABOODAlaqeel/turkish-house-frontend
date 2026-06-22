import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          light: "var(--brand-light)",
          dark: "var(--brand-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        success: "var(--success)",
        danger: "var(--danger)",
        info: "var(--info)",
        // Keep 'gold' as alias for backward compat during migration
        gold: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dark: "var(--brand-dark)",
        },
      },
      fontFamily: {
        arabic: ["Noto Kufi Arabic", "Tajawal", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "brand-pulse": "brandPulse 2s ease-in-out infinite",
        "cart-bounce": "cartBounce 0.4s ease",
        "shimmer": "shimmer 2.5s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "float-subtle": "floatSubtle 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "badge-pulse": "badgePulse 3s ease-in-out infinite",
        "blur-in": "blurIn 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-right": "slideRight 0.5s ease-out forwards",
        "spin-slow": "spinSlow 20s linear infinite",
        "skeleton": "skeleton 1.5s ease-in-out infinite",
        "gradient-flow": "gradientFlow 4s ease infinite",
        "shake": "shake 0.5s ease-in-out",
        "confetti": "confettiDrop 1s ease-out forwards",
        "curtain": "curtainReveal 1s ease-out forwards",
        "smoke": "smoke 6s ease-out infinite",
        "draw-line": "drawLine 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        brandPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(139,36,56,0)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(139,36,56,0.25)" },
        },
        cartBounce: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        shimmer: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatSubtle: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-6px) rotate(0.5deg)" },
          "66%": { transform: "translateY(3px) rotate(-0.5deg)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232, 118, 43, 0)" },
          "50%": { boxShadow: "0 0 25px 5px rgba(232, 118, 43, 0.15)" },
        },
        badgePulse: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(232, 118, 43, 0.3)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 15px 3px rgba(232, 118, 43, 0.1)" },
        },
        blurIn: {
          "0%": { filter: "blur(12px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(40px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        skeleton: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-3px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(3px)" },
        },
        confettiDrop: {
          "0%": { transform: "translateY(0) rotateZ(0deg)", opacity: "1" },
          "100%": { transform: "translateY(60px) rotateZ(720deg)", opacity: "0" },
        },
        curtainReveal: {
          "0%": { clipPath: "inset(0 0 100% 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        smoke: {
          "0%": { transform: "translateY(0) scaleX(1) scaleY(1)", opacity: "0.4" },
          "50%": { transform: "translateY(-60px) scaleX(1.5) scaleY(1.8)", opacity: "0.2" },
          "100%": { transform: "translateY(-120px) scaleX(2) scaleY(2.5)", opacity: "0" },
        },
        drawLine: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, var(--brand), var(--brand-light), var(--brand))",
        "accent-gradient": "linear-gradient(135deg, var(--accent), var(--accent-light), var(--accent))",
        "dark-gradient": "linear-gradient(180deg, transparent, var(--bg-primary))",
      },
    },
  },
  plugins: [],
};
export default config;
