import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { brand: { DEFAULT: "#1B3FBF", dark: "#142E8C", soft: "#EEF2FF" }, ink: "#101828", deal: "#F59E0B" },
    fontFamily: { display: ["var(--font-display)", "sans-serif"], sans: ["var(--font-body)", "system-ui", "sans-serif"] },
  } },
  plugins: [],
};
export default config;
