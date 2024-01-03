# 小店有惠小程序

## 安装环境推荐的版本：
```
node@14.15.3
@vue/cli@4.5.15
sass-loader@4.12.0
```
- 开发者工具是`Vscode`
- appId: wx90c41e1f393af0ff


### 授权同步彬纷有礼的个人信息

- 彬纷有礼测试版appid: wx9c60968a55b21fdb
- 彬纷有礼appid： wxfdeaae516b9559f2

## 安装依赖
```
npm install
```

### 项目运行

#### 运行到h5
```
npm run serve
```
#### 运行到微信小程序
```
npm run dev:mp-weixin
```
小程序需要手动打开开发者工具，导入`dist/dev/mp-weixin`的文件；只需导入一次即可进行热更新开发;

## 小程序的弹窗入口参数

- 首页： pages/home/index?phoneId=1
    phoneId=是进入的弹窗配置；(入口是彬纷有礼带参过来)
