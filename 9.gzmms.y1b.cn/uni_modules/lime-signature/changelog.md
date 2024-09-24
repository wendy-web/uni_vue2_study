## 1.4.6（2024-07-18）
- chore: 更新文档
## 1.4.5（2024-07-17）
- chore: 删除多余console
## 1.4.4（2024-07-15）
- fix: 修复`钉钉小程序`无法生成图片的问题
## 1.4.3（2024-07-15）
- fix: 修复`钉钉小程序`无法使用的问题
## 1.4.2（2024-07-04）
- fix: 修复`vue2`因类型问题无法使用
## 1.4.1（2024-07-04）
- fix: 修复`uvue`因类型问题无法使用
## 1.4.0（2024-05-21）
- fix: 修复`nvue`因重复`width`和`height`重复导致无法使用
## 1.3.9（2024-04-11）
- feat: 增加`preferToDataURL`porps，是否优先使用`toDataURL`生成图片，在支持`toDataURL`的环境优先使用，会生成base64的图片
## 1.3.8（2024-04-10）
- fix: 修复因兼容抖音导致微信小程序图片不完整
## 1.3.7（2024-04-10）
- fix: 修复uniapp x(web)无法生图的问题
- feat: 支持uniapp x(web on pc)
## 1.3.6（2024-04-09）
- fix: 修复抖音小程序无法生成图片
## 1.3.5（2024-04-01）
- feat: 支持uniapp x ios(app-js)
## 1.3.4（2024-03-11）
- feat: app-vue,app-nvue支持生成图片时传`destWidth`,`destHeight`
## 1.3.3（2024-03-07）
- fix: 修复因小数导致mask无法生成
## 1.3.2（2024-03-06）
- fix: 修复app-vue多重复命名变量导致无法使用
## 1.3.1（2024-03-04）
- fix: 缺少this导致云打包失败
## 1.3.0（2024-02-28）
- feat: 支持uniapp x web
## 1.2.9（2024-02-21）
- fix: 修复微信小程序IOS会断断续续的问题
## 1.2.8（2023-12-21）
- fix: 修复redo函数漏了`,`
## 1.2.7（2023-12-19）
- fix: 修复因非uniapp x默认引入了uts文件，导入无法运行
## 1.2.6（2023-12-18）
- feat: 增加支持uniapp x
## 1.2.5（2023-10-11）
- fix: 修复PC浏览不生效的问题
## 1.2.4（2023-08-28）
- feat: 增加 `disabled`
## 1.2.3（2023-08-26）
- fix: 修复app-nvue 无法生成图片
## 1.2.2（2023-08-24）
- fix: 修复app端获取`boundingBox`尺寸异常
## 1.2.1（2023-08-23）
- fix: 修复因画板尺寸有小数导致`boundingBox`失效
## 1.2.0（2023-08-22）
- fix: vue3 app 无法在第一时间获取到 `getSystemInfoSync` 函数，故在生命周期里获取
## 1.1.9（2023-08-18）
- fix: 排除`backgroundColor`为`transparent`的参数,因为会导致生成空白图片
## 1.1.8（2023-08-16）
- chore: 去掉多余的console.log
## 1.1.7（2023-08-09）
- fix: 修复 支付宝无法生成的问题
## 1.1.6（2023-08-03）
- fix: 多了个 return
## 1.1.5（2023-07-27）
- fix: 修复 微信小程序PC端无法绘制问题
## 1.1.4（2023-07-21）
- fix: 修复 APP 报 `requestAnimationFrame` 的问题
## 1.1.3（2023-07-20）
- fix: 修复 性能较一般的手机 手写会卡顿的问题
## 1.1.2（2023-07-18）
- fix: 修复 非 canvas 2d 微信小程序 无法生成图片
## 1.1.1（2023-07-04）
- feat: 增加 `boundingBox` 属性，只生成有笔画的内容区域，从而缩小图片的尺寸节省空间
## 1.1.0（2023-06-20）
- feat: 增加 `canvasToTempFilePath` 质量参数
## 1.0.9（2023-06-13）
- fix: 修复大屏设备上，画板会被离屏canvas挡住的情况
## 1.0.8（2023-06-12）
- fix: 修复vue2 rendrejs 导入问题
## 1.0.7（2023-06-09）
- fix: 修复vue3 rendrejs 找到不节点问题
## 1.0.6（2023-05-23）
- chore: stylus 改为 scss
## 1.0.5（2023-05-16）
- fix: 修复转临时路径出错
## 1.0.4（2023-04-17）
- chore: 删除多余字符
## 1.0.3（2023-04-15）
- BUG: QQ小程序可以使用，会有报错但不影响使用
## 1.0.2（2023-04-15）
- feat: 支持横屏
- BUG: QQ小程序无法使用，为UNI官方问题，插件所需要的API传this都会报错。
## 1.0.1（2023-04-03）
- fix: 销毁时报错
## 1.0.0（2022-10-27）
- feat: 增加背景色
- feat: 修复 app canvasToTempFilePath 无操作只能执行一次的问题
## 0.8.0（2022-08-22）
- feat: 增加beforeDelay 延时初始化，可用于手写板在弹窗里时
## 0.7.0（2022-08-16）
- fix: 修复缺少 canvasWidth
## 0.6.0（2022-07-16）
- fix: 修复 success is no defined
## 0.5.0（2022-07-09）
- feat: canvasToTempFilePath success 增加返回 isEmpty
- fix: 修复 微信小程序 canvasToTempFilePath 无效问题
## 0.4.0（2022-07-04）
- fix: 生成图片缺少最后一笔
## 0.3.0（2022-05-24）
- chore: 支持多端 H5 小程序 APP APP-NVUE
## 0.2.0（2021-07-09）
- chore: 统一命名规范，无须主动引入组件
- fix: 修复错位问题
## 0.1.0（2021-03-07）
- 首次上传
- 撤消、清空、保存、模拟压感等功能