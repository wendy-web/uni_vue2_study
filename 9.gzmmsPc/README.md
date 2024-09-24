## 贵州物料数据平台

### 介绍 📖

技术栈: Vue3.2、TypeScript、Vite、Pinia、Element-Plus 后台管理

### 安装使用步骤 📔

- 安装依赖包

```
pnpm install
```

- 运行开发环境

```
pnpm run dev
```

### 文件资源目录 📚

```text
vue3-Admin
├─ .vscode                # VSCode 推荐配置
├─ public                 # 静态资源文件（该文件夹不会被打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ directives          # 全局指令文件
│  ├─ layout              # 框架布局模块
│  ├─ routers             # 路由管理
│  ├─ stores              # pinia store
│  ├─ styles              # 全局样式文件
│  ├─ types               # 全局 ts 声明
│  ├─ utils               # 常用工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 项目主组件
│  ├─ main.ts             # 项目入口文件
│  ├─ permission.ts       # 全局路由守卫
│  ├─ settings.ts         # 一些基础设置
│  └─ vite-env.d.ts       # vue文件的ts声明扩充
├─ types                  # 自动导入插件的类型声明文件
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.staging           # 模拟环境配置
├─ .gitignore             # 忽略 git 提交
├─ .prettierignore        # 忽略 Prettier 格式化
├─ .prettierrc.js         # Prettier 格式化配置
├─ index.html             # 入口 html
├─ package.json           # 依赖包管理
├─ package-lock.yaml      # 依赖包包版本
├─ postcss.config.js      # postcss 配置
├─ README.md              # README 介绍
├─ tailwind.config.js     # tailwindcss设置
├─ tsconfig.json          # typescript 全局配置
├─ tsconfig.node.json     # typescript node 全局配置
└─ vite.config.ts         # vite 全局配置文件
```
