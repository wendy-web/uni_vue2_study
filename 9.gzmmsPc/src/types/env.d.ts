/// <reference types="vite/client" />

declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 环境变量 TypeScript的智能提示
interface ImportMetaEnv {
  VITE_APP_TITLE: string;
  VITE_APP_PORT: string;
  VITE_APP_BASE_API: string;
  VITE_SCAN_CODE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "vue-plugin-hiprint";
declare module "vue3-online-signature";

//解决 vue3报错JSX 元素隐式具有类型 "any",因为不存在接口 "JSX.IntrinsicElements"。
declare namespace JSX {
  interface IntrinsicElements {
    // 在这里声明你需要的自定义元素
    [keys: string]: any;
  }
}
