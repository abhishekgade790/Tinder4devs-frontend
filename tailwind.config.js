module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark", "light", "cupcake", "bumblebee", "emerald", "synthwave", "cyberpunk", "valentine", "halloween", "forest", "aqua", "luxury", "dracula"],
  },
};
