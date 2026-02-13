module.exports = {
  plugins: [
    require('tailwind-scrollbar')
  ],
}
export default {
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(7deg)" },
          "50%": { transform: "rotate(-7deg)" },
          "75%": { transform: "rotate(1deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
         dance: {
          to: {
            backgroundPosition: "150px",
          },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        dance: "dance 2s linear infinite",
      },
    },
  },
};


