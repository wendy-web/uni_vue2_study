import { PlusProComponentsResolver } from "@plus-pro-components/resolver";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
// 自动导入相关插件
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
// 自动引入elementPlus图标相关
import Icons from "unplugin-icons/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { ConfigEnv, defineConfig, loadEnv } from "vite";
// 生产环境移除console
import removeConsole from "vite-plugin-remove-console";
// svgicon相关
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// 像引入 vue 组件一样引入 svg的插件 示例: import backTop from "@/assets/svg/back_top.svg?component";
import svgLoader from "vite-svg-loader";
import visualizer from 'rollup-plugin-visualizer';

import viteCompression from 'vite-plugin-compression'


const pathSrc = path.resolve(__dirname, "src");

export default defineConfig(({ mode }: ConfigEnv) => {
  // 获取 .env 环境配置文件
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        "@": path.resolve("./src"), // @代替src
      },
    },
    base: "./",
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行自动打开浏览器
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // target: "https://gzmms.y1b.cn",
          target: "https://203.195.203.96:803", //测试环境
          // target: "http://192.168.1.178:81",
          changeOrigin: true,
          rewrite: (path) => {
            // console.log("path", path);
            return path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "");
          },
          bypass(req, res, options) {
            let reqUrl = options.rewrite!(req.url as string);
            let targetUrl = options.target as string;
            const proxyUrl = new URL(reqUrl, targetUrl)?.href || "";
            console.log("proxyUrl", proxyUrl);
            // res.setHeader("x-res-proxyUrl",proxyUrl)
          },
        },
      },
    },
    plugins: [
      viteCompression({
        verbose: true, // 是否在控制台输出压缩结果
        disable: true, //是否禁用 gzip 压缩
        threshold: 10240, // 压缩文件的大小阈值（以字节为单位）对大于 1m 的文件进行压缩
        deleteOriginFile: true, //是否删除源文件      
        algorithm: 'gzip', //压缩算法
        ext: '.gz', //文件类型  
      }),
      vue(),
      // jsx、tsx语法支持
      vueJsx(),
      removeConsole(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue"],
        resolvers: [
          // 自动注册图标组件
          IconsResolver({
            prefix: "Icon",
          }),
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
        // dts: path.resolve(pathSrc, "types", "auto-imports.d.ts"), // (false) 配置文件生成位置，默认是根目录 /auto-imports.d.ts
        dts: path.resolve("types", "auto-imports.d.ts"), // (false) 配置文件生成位置，默认是根目录 /auto-imports.d.ts
      }),
      // 自动导入组件, 可设置按需加载的目录和其他ui框架
      Components({
        // dirs: ["src/components"], // 按需加载的文件夹
        resolvers: [
          IconsResolver({
            enabledCollections: ["ep"],
          }),
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
          PlusProComponentsResolver(),
        ],
        // dts: path.resolve(pathSrc, "types", "components.d.ts"), // (false) 配置文件生成位置，默认是根目录 /components.d.ts
        dts: path.resolve("types", "components.d.ts"), // (false) 配置文件生成位置，默认是根目录 /components.d.ts
      }),
      // svg组件化支持
      svgLoader(),
      Icons({
        autoInstall: true,
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      // visualizer({
      //   open: true, // 构建后自动打开分析报告
      //   gzipSize: true,
      //   brotliSize: true,
      // })
    ],
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "element-plus/es/components/form/style/css",
        "element-plus/es/components/form-item/style/css",
        "element-plus/es/components/button/style/css",
        "element-plus/es/components/input/style/css",
        "element-plus/es/components/input-number/style/css",
        "element-plus/es/components/switch/style/css",
        "element-plus/es/components/upload/style/css",
        "element-plus/es/components/menu/style/css",
        "element-plus/es/components/col/style/css",
        "element-plus/es/components/icon/style/css",
        "element-plus/es/components/row/style/css",
        "element-plus/es/components/tag/style/css",
        "element-plus/es/components/dialog/style/css",
        "element-plus/es/components/loading/style/css",
        "element-plus/es/components/radio/style/css",
        "element-plus/es/components/radio-group/style/css",
        "element-plus/es/components/popover/style/css",
        "element-plus/es/components/scrollbar/style/css",
        "element-plus/es/components/tooltip/style/css",
        "element-plus/es/components/dropdown/style/css",
        "element-plus/es/components/dropdown-menu/style/css",
        "element-plus/es/components/dropdown-item/style/css",
        "element-plus/es/components/sub-menu/style/css",
        "element-plus/es/components/menu-item/style/css",
        "element-plus/es/components/divider/style/css",
        "element-plus/es/components/card/style/css",
        "element-plus/es/components/link/style/css",
        "element-plus/es/components/breadcrumb/style/css",
        "element-plus/es/components/breadcrumb-item/style/css",
        "element-plus/es/components/table/style/css",
        "element-plus/es/components/tree-select/style/css",
        "element-plus/es/components/table-column/style/css",
        "element-plus/es/components/select/style/css",
        "element-plus/es/components/option/style/css",
        "element-plus/es/components/pagination/style/css",
        "element-plus/es/components/tree/style/css",
        "element-plus/es/components/alert/style/css",
        "element-plus/es/components/notification/style/css",
        "element-plus/es/components/checkbox/style/css",
        "element-plus/es/components/drawer/style/css",
        "element-plus/es/components/tabs/style/css",
        "element-plus/es/components/tab-pane/style/css",
        "element-plus/es/components/badge/style/css",
        "element-plus/es/components/date-picker/style/css",
        "element-plus/es/components/message/style/css",
        "element-plus/es/components/message-box/style/css",
        "element-plus/es/components/cascader/style/css",
        "element-plus/es/components/image/style/css",
        "element-plus/es/components/popconfirm/style/css",
        "element-plus/es/components/checkbox-group/style/css",
        "element-plus/es/components/space/style/css",
        "element-plus/es/components/backtop/style/css",
        "element-plus/es/components/text/style/css",
        "element-plus/es/components/infinite-scroll/style/css",
        "element-plus/es/components/empty/style/css",
        "element-plus/es/components/autocomplete/style/css",
        "element-plus/es/components/radio-button/style/css",
        "element-plus/es/components/affix/style/css",
        "element-plus/es/components/collapse/style/css",
        "element-plus/es/components/collapse-item/style/css",
        "element-plus/es/components/time-select/style/css",
        "element-plus/es/components/time-picker/style/css",
        "element-plus/es/components/select-v2/style/css",
     
        "@js-preview/docx",
        "@js-preview/excel",
        "@js-preview/pdf",
        "@element-plus/icons-vue",
        "vue3-online-signature",
        "dayjs",
        "sortablejs",
        "@vueuse/core",
        "@pureadmin/utils",
        "path-to-regexp",
        "print-js",
        "jsbarcode",
        "path-browserify",
        "easy-typer-js",
        "qrcode.vue",
        "plus-pro-components/es",
        "plus-pro-components/es/components/search/style/css",
        "plus-pro-components/es/components/form/style/css",
        "plus-pro-components/es/components/dialog-form/style/css",
        "plus-pro-components/es/components/descriptions/style/css",
        "plus-pro-components/es/components/date-picker/style/css",
        "plus-pro-components/es/components/dialog/style/css"
      ],
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        },
      },
    },
  };
});
