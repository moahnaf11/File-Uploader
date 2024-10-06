/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs,js}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["intro_rust_gbase_2_line", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
