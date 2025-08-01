/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

colors:{

  textColor:'#030000',
  button_background:'#d9382a',
  outline_button:'#ed271e',
  app_background_2:'#FFFFF',
  text_light:'#41403c',

}

    },
  },
  plugins: [],
}