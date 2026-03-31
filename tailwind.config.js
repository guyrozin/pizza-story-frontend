module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E31837',   // brand red – main CTA
        gold:    '#FFC107',   // loyalty / premium accent
        dark:    '#1A1A1A',   // text
        muted:   '#6b7280',   // secondary text
        surface: '#f5f5f5',   // page background
        // legacy aliases
        tomato:  '#E31837',
        navy:    '#1A1A1A',
        crust:   '#FFB74D',
      },
    },
  },
  rtl: true,
  plugins: [],
};
