// ElLoading 指令必须手动注册下
import { ElLoading } from "element-plus";
// import 'element-plus/dist/index.css'
import "element-plus/theme-chalk/dark/css-vars.css";
// 有效解决自动导入elementPlus部分情况下,el-button不显示背景色的问题
// import "element-plus/theme-chalk/src/button.scss";
// import "element-plus/theme-chalk/src/input.scss";
import "element-plus/theme-chalk/src/loading.scss";
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/pagination.scss";
import "element-plus/theme-chalk/src/table.scss";
import Table from "@pureadmin/table";
// 引入svg注册脚本
import "virtual:svg-icons-register";
import { Directive, createApp } from "vue";
import type { App as AppType } from "vue";
//引入打印组件
import { hiPrintPlugin } from "vue-plugin-hiprint";
// 引入svg组件
import svgIcon from "@/components/SvgIcon/index.vue";
// 自定义指令
import * as directive from "@/directive";
import "@/permission";
import router from "@/router";
import { setupStore } from "@/store";
// import ElementPlus from "element-plus"; // 引入elementPlus
import "@/styles/index.scss";
import App from "./App.vue";
//完整引入VXETable,  ps:自动引入有坑,table的remove方法失效等;
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";

// 关闭打印组件的websockt自动连接
hiPrintPlugin.disAutoConnect();

// 创建vue实例
const app = createApp(App);

Object.keys(directive).forEach((key) => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});

// 挂载elementPlus
// app.use(ElementPlus);
app.use(router);

// 全局挂载
setupStore(app);
app.use(ElLoading).use(Table);
app.use(VXETable);
// app.use(VXETable);
//注册全局svg组件
app.component("svg-icon", svgIcon);
// 挂载实例
app.mount("#app");
