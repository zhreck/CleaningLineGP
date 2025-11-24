/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        /* 🌿 PRIMARY (Verde corporativo) */
        primary: {
          50: "#E3F3EB",
          100: "#C4E6D6",
          200: "#A5D9C1",
          300: "#7FBA95",  // Suave
          400: "#509B6C",  // Medio
          500: "#2C7D4A",  // Principal
          600: "#135F2F",  // Fuerte
          700: "#024019",  // Extra fuerte
          800: "#012A12",
          900: "#001D0C",
        },

        /* 🟣 SECONDARY PURPLE (Elegante, destacados) */
        secondaryPurple: {
          50: "#F4E9F4",
          100: "#E5CCE5",
          200: "#D7AEDD",
          300: "#A572A7",
          400: "#89488B",
          500: "#6E2870",
          600: "#531156",
          700: "#38023A",
          800: "#250026",
          900: "#160016",
        },

        /* 💛 SECONDARY LIME (Ofertas, energía, badges) */
        secondaryLime: {
          50: "#F8FCD9",
          100: "#F2FBB8",
          200: "#EAF7A8",
          300: "#BEC66B",
          400: "#A8B845",
          500: "#95A63A",
          600: "#6F7F19",
          700: "#485602",
          800: "#2F3C01",
          900: "#1E2600",
        },

        /* 🔥 COMPLEMENT / DANGER (Eliminar, errores) */
        danger: {
          50: "#FFE4DF",
          100: "#FFBCAE",
          200: "#F29E8D",
          300: "#D5806E",
          400: "#AC503C",
          500: "#842C1A",
          600: "#591102",
          700: "#3E0C01",
          800: "#260700",
          900: "#140300",
        },

        /* ⚪ Neutrales (fondos suaves) */
        neutralSoft: {
          50: "#FAFAFA",
          100: "#F2F2F2",
          200: "#E6E6E6",
          300: "#D9D9D9",
        },
      },
    },
  },
  plugins: [],
};
