/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      "sidebar-logo": "#2b2f3a",
    }),
    extend: {
      colors: {
        bg_color: "var(--el-bg-color)",
        primary: "var(--el-color-primary)",
        text_color_primary: "var(--el-text-color-primary)",
        text_color_regular: "var(--el-text-color-regular)"
      }
    }

  },
  plugins: [],
  // 禁止tailwindcss的默认属性
  // corePlugins: {
  //   preflight: false
  // }
};
