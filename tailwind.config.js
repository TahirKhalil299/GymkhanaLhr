module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        textColor: '#030000',
        button_background: '#b81503',
        cursor_color: '#d9382a',
        button_text: '#FFFFFF', // Fixed: Changed to 6 F's
        outline_button: '#ed271e',
        app_background_2: '#FFFFF',
        text_light: '#41403c',
      }
    },
  },
  plugins: [],
}