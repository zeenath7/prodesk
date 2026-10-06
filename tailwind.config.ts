import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { brand: { DEFAULT: "#1B3FBF", dark: "#142E8C", soft: "#EEF2FF" }, ink: "#101828", deal: "#F59E0B" },
    fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    boxShadow: {
      "2xs": "0 1px 2px 0 rgb(0 0 0 / 0.04)",
      "xs": "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
    },
  } },
  plugins: [],
};
export default config;
