/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Keep a minimal palette used across the app
        primary: "#2563eb",   // blue-600
        secondary: "#0ea5e9", // sky-500
        accent: "#f59e0b",    // amber-500 (optional third)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          ".text-primary-medium": {
            // for label of fields
            fontSize: "16px",
            lineHeight: "1.5",
            fontWeight: "400",
            fontFamily: '"Inter", sans-serif',
          },
        },
        ["responsive"] // ✅ enables sm:, md:, lg: etc.
      );
    },
  ],
};
