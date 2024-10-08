# 天天享礼

## 运行发布

- 运行：使用HBuilder的运行，运行到小程序的微信模拟器
- 发布： 更改utils/auth.js文件中的`getENV()`的函数，调整`getENV='production'`为正式环境进行发行上传

## 基本配置信息

APPID： wx6deb62d876c03d85

正式域名：`https://ttxl.y1b.cn`

测试域名：`https://ttxl-test.y1b.cn`

后台管理：

- 测试域名： `https://ttxl-test.y1b.cn/apios/#/login?redirect=/`

- 正式域名： `https://ttxl.y1b.cn/apios/#/login?redirect=/`

## 引进的经营模块

### (一) 京东电商

- 领券中心
tab的切换与搜索的使用，直接通过获取appid与path地址跳转；
京东与拼多多俩大版块的配置添加

### (二) 惠吃喝板块

#### 1.海威（接入API）

- 瑞幸点餐
- 麦当劳点餐
- 星巴克点餐
- 肯德基点餐

#### 2.千猪模块

- 肯德基（已接入API，可配h5的入口）
   - 接入：千猪小程序的支付

- 星巴克（已接入API，h5入口跳转）
   - 接入：
- 惠电影（h5入口跳转）
- 接入抓娃娃入口（h5）
- 接入移动积分 （h5）

- 商品列表
    - 京东商品
    - 拼多多商品

### （三）福利中心

## 功能模块的介绍

- 列表商品的配置
   - 自选的卡券商品
   - 京东商品
   - 拼多多商品
- 推券商品的配置
    - 列表商品的类型配置
- 弹窗配置
   - 配置京东商品的倒计时弹窗
   - 配置列表商品的跳转（根据类型的配置跳转）
   - 彬纷配置参数跳转至天天的弹
- 彬纷的配置进入天天的呈现
   - 弹窗的呈现
   - 列表商品的高亮呈现
   - icon的高亮呈现
- 小店省钱卡的绑定
   - 跳转进入到省钱卡会员并绑定用户

## 页面介绍

### 惠吃喝

- 海威的模块(麦当劳，瑞幸)

- 千猪的电影与肯德基模块

## 彬纷享礼入口进入

进行来源的判定 同步用户信息

- 彬纷享礼 appID: wxbb29c5aec6891525

``{
   "path": "pages/demo/demo",
   "style": {
      "navigationBarTitleText": "demo",
      "usingComponents": {
         "coral-adv": "plugin://coral-adv/adv"
      }
   }
}``


## 测试进入

- mock的接口数据模拟返回的使用
   - main.js的文件 - 打开Mock的注释使用

- 进入商品列表的高亮：
添加参数：skuId=pddE9r2LP8Ekc9k2DRxwebd3ELo3mPPTv49_JQ37rHM2L7

- 配置icon的高亮的使用 - 在icon的配置中添加跳转进入的事件，参数为：psite=popover_12&lsite=light_12

## 版本更新


- 2024/07/19（周五） 优化小程序加载
   - 京东/拼多多的列表的加载
   - 推荐商品的配置更改 - 写入混合方法中
   - 引入的查找元素的方法 - 统一更改
   - 调整抓娃娃高亮的呈现及登录的使用

- 2024/07/09（周二） 会员卡改版上线
   - 统一更改成年卡的开通

- 2024/08/15 添加橙券的订单使用
   - 将乐刷的商品一并替换成橙券的商品

- 配置icon高亮的二维码
   - pages/tabBar/shopMall/index?lsite=
   - icon_省钱卡id-非省钱卡id
   - 领红包：icon_85-223
   - 红牛： icon_83-222
   - pages/tabBar/shopMall/index?lsite=icon_84-224
   - pages/tabBar/shopMall/index?lsite=icon_85-223
