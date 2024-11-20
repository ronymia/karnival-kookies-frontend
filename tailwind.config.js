/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        lighttheme: {
          primary: "#d2982c", // White as primary
          secondary: "#2D2627", // Light gray for secondary elements
          "primary-content": "#F0E5C1",
          accent: "#e5e7eb", // Another light shade for accents
          neutral: "#f9fafb", // Neutral background
          "base-100": "#0B0A0B", // Base background color
          "base-200": "#6F6E6F", // Base background color
          "base-300": "#ffffff", // Base background color
          info: "#d1d5db", // Light info
          success: "#34d399", // Light green for success
          warning: "#fbbf24", // Light yellow for warning
          error: "#f87171", // Light red for error
        },
      },
    ],
    // Set the default theme
    defaultTheme: "lighttheme",
  },
};
