import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand & Accent
        primary: "#9fe870",
        "on-primary": "#0e0f0c",
        "primary-active": "#cdffad",
        "primary-neutral": "#c5edab",
        "primary-pale": "#e2f6d5",
        // Surface
        canvas: "#ffffff",
        "canvas-soft": "#e8ebe6",
        // Text
        ink: "#0e0f0c",
        "ink-deep": "#163300",
        body: "#454745",
        mute: "#868685",
        // Semantic
        positive: "#2ead4b",
        "positive-deep": "#054d28",
        warning: "#ffd11a",
        "warning-deep": "#b86700",
        "warning-content": "#4a3b1c",
        negative: "#d03238",
        "negative-deep": "#a72027",
        "negative-darkest": "#a7000d",
        "negative-bg": "#320707",
        // Accent
        "accent-orange": "#ffc091",
        "accent-cyan": "#38c8ff",
      },
      borderRadius: {
        none: "0px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
        full: "9999px",
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
      },
      fontFamily: {
        display: ['"Wise Sans"', "Inter", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-mega": ["7.88rem", { lineHeight: "107.1px", fontWeight: "900" }],
        "display-xxl": ["6rem", { lineHeight: "81.6px", fontWeight: "900" }],
        "display-xl": ["4rem", { lineHeight: "54.4px", fontWeight: "900" }],
        "display-lg": ["2.94rem", { lineHeight: "70.5px", fontWeight: "400", letterSpacing: "-0.108px" }],
        "display-md": ["2.5rem", { lineHeight: "34px", fontWeight: "900" }],
        "display-sm": ["2rem", { lineHeight: "38.4px", fontWeight: "600", letterSpacing: "-0.96px" }],
        "display-xs": ["1.5rem", { lineHeight: "31.2px", fontWeight: "600", letterSpacing: "-0.48px" }],
        "body-lg": ["1.25rem", { lineHeight: "30px", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "24px", fontWeight: "400" }],
        "body-md-strong": ["1rem", { lineHeight: "24px", fontWeight: "600" }],
        "body-sm": ["0.875rem", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm-strong": ["0.875rem", { lineHeight: "20px", fontWeight: "600" }],
        caption: ["0.75rem", { lineHeight: "16px", fontWeight: "400" }],
        "button-md": ["1rem", { lineHeight: "24px", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};
export default config;
