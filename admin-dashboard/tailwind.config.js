/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Matching mobile app's minimal emerald-teal gradient palette
        primary: {
          DEFAULT: '#10B981',  // Emerald-500 (same as mobile)
          light: '#6BC497',
          dark: '#059669',     // Emerald-600
        },
        accent: {
          DEFAULT: '#14B8A6',  // Teal-500 (same as mobile)
          light: '#2DD4BF',    // Teal-400
          dark: '#0D9488',     // Teal-600
        },
        cyan: {
          DEFAULT: '#06B6D4',  // Cyan-500 (same as mobile)
          light: '#22D3EE',
          dark: '#0891B2',
        }
      }
    },
  },
  plugins: [],
}
