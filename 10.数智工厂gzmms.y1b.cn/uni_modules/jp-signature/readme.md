## jp-signature 、jp-signature-popup、 jp-merge 写字板
### jp-signature 写字板，可用业务签名等场景，方便用户自行改造 
### jp-signature-popup 小白专用弹框签名组件，方便小白开发使用，和输入框一样使用简单
### jp-merge 图片签字组件，提供用户在图片文档上进行签字

# 有合作需求请私
## 开发不易，如果帮助到你的，请支持 有问题请留言，作者会积极更新

## 平台兼容
| H5  | 微信小程序 | 支付宝小程序 | 百度小程序 | 头条小程序 | QQ 小程序 | App |
| --- | ---------- | ------------ | ---------- | ---------- | --------- | --- |
| √   | √          | √         | 未测       | 未测          | 未测      | √    |


## 代码演示

### jp-signature 基本用法
```html
<view style="width: 750rpx ;height: 500rpx;">
	<jp-signature  ref="signatureRef"   ></jp-signature>
</view>
<view>
	<button @click="clear">清空</button>
	<button @click="">撤消</button>
	<button @click="save">保存</button>
</view>

export default {
	data() {
		return {
			url: '',
		}
	},
	methods: {
		save(){
			this.$refs.signatureRef.canvasToTempFilePath({
				success: (res) => {
					// 是否为空画板 无签名
					console.log(res.isEmpty)
					// 生成图片的临时路径
					// H5 生成的是base64
					this.url = res.tempFilePath
				}
			})
		},
		clear(){
			this.$refs.signatureRef.clear()
		},
		undo(){
			this.$refs.signatureRef.undo()
		},
	}
}

```

## API
### Props

| 参数             | 说明                  | 类型              | 默认值        |
| --------------   | ------------         | ----------------  | ------------ |
| penSize          | 画笔大小              | <em>number</em>   |    `2`           |
| minLineWidth     | 线条最小宽            | <em>number</em>    | `2`        |
| maxLineWidth     | 线条最大宽            | <em>number</em>    | `6`        |
| penColor         | 画笔颜色              | <em>string</em>    | `black`      |
| backgroundColor  | 背景颜色              | <em>string</em>    | ``      |
| type             | 指定 canvas 类型  | <em>string</em> | `2d`  |
| openSmooth       | 是否模拟压感           | <em>boolean</em>   | `false`       |
| beforeDelay       | 延时初始化，在放在弹窗里可以使用 （毫秒）          | <em>number</em>   | `0`       |
| maxHistoryLength   | 限制历史记录数，即最大可撤销数，传入0则关闭历史记录功能           | <em>boolean</em>   | `20`       |
| landscape        | 横屏           | <em>boolean</em>   | ``       |
| disableScroll     | 当在写字时，禁止屏幕滚动以及下拉刷新           | <em>boolean</em>   | `true`       |
| boundingBox     | 只生成内容区域，即未画部分不生成，有性能的损耗（微信小程序pc不支持） | <em>boolean</em>   | `false`       |


### 事件 Events

| 事件名  | 说明         | 回调           |
| ------- | ------------ | -------------- |
| undo | 撤消，回退到上一步 |  |
| clear | 清空，清空画板 |  |
| canvasToTempFilePath | 保存，生成图片，与官方保持一致，但不需要传canvasId |  |

### 常见问题
- 放在弹窗里时，尺寸不对 可以延时手写板出现时机，给手写板加vif或beforeDelay="300"
- boundingBox 微信小程序 pc 不支持, 因为获取不到 ImageData 数据



## jp-signature-popup 基础用法
```html
<template>
	<view class="content">
		   <!-- #ifdef VUE2 -->
			<jp-signature-popup v-model="title"  />
			<!-- #endif -->
			<!-- #ifdef VUE3 -->
			<jp-signature-popup  v-model:value="title" />
			<!-- #endif -->
			{{title}}
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: ''
			}
		},
	}
</script>
```

####参数
| 参数名        | 类型   |  默认值  | 说明  |
| --------   |  -------- |  --------| --------|
|   value   |  String  |       |  签名内容，可以通过v-model和v-model:value绑定      |
| label        |   String   |  手写签名   |          |
| popup        |   Boolean   |  false   |   是否隐藏原有样式，该模式只使用弹框       |
| required        |    Boolean    |  false |   |
| placeholder        |    String    | 点击签名 |  签名说明 |
| readonly        |     Boolean   |  false |  是否只能可读 |
| openSmooth        |     Boolean   |  false |  是否开启签名笔锋 |
| boundingBox     |  boolean| false |   只生成内容区域，即未画部分不生成，有性能的损耗（微信小程序不支持）    |


####方法
| 方法名        | 返回参数   |  说明  |
| --------   |  -------- |  --------|
|  toPop    |    |   打开弹窗    |
| close      |    | 关闭弹窗  |
| deleteImg      |    | 删除内容  |

####事假
| 事件名        | 返回参数   |  说明  |
| --------   |  -------- |  --------|
|  input    |  签名内容  |    签名内容   |
|  change    |  签名内容  |  签名内容改变后触发   |
|  toImg    |  图片编码  |    点击图片时触发   |


## jp-merge 基础用法
```html
<template>
	<view class="content">
		<view>下面是使用 jp-signature-popup 结合 jp-merge  在文档上签字</view>
		<view style="text-align: center;padding-bottom: 150px;">
			<image :src="image4" v-if="image4" style="width: 350px;height: 350px;border: 1px solid #ccc;"></image>
			<image src="../../static/sqs.jpg" v-else style="width: 350px;height: 350px;border: 1px solid #ccc;"></image>
			<view class="but" style="margin: 0 25px;" @click="toPop">我要在上面签字</view>
			<jp-signature-popup ref="signature" @change="setImg" popup v-model:value="image3" />
			<jp-merge bgImage="../../static/sqs.jpg" ref="jpMerge"></jp-merge>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				image3:'',
				image4:''
			}
		},
		methods: {
			setImg(val){
				if(val){
					<!-- 生成签字结果的方法可以传入网络及本地图片 -->
					this.$refs.jpMerge.exportPost(val).then(res => {
						this.image4 = res
				    })
				}
			},
			toPop(){
				this.$refs.signature.toPop()
			}
		}
	}
</script>
<style lang="scss">
	.but{
		margin: 25px;
		line-height: 40px;
		text-align: center;
		background-color: #55aaff;
		color: #fff;
	}
</style>
```

####参数
| 参数名        | 类型   |  默认值  | 说明  |
| --------   |  -------- |  --------| --------|
| bgImage  |  String  |       |  文档图片地址，支持本地及线上图片（小程序如果是网络图片需要配置白名单）      |
| canvasWidth        |   number   |  400    |     生成图片的最终宽，建议长高和文档长高一致     |
| canvasHeight        |   number   |  400    |     生成图片的最终高，建议长高和文档长高一致     |
| width        |   number   |  80    |    签字图片宽     |
| height        |   number   |  80    |    签字图片高     |
| left        |   number   |  80    |    签字图片距离左边位置     |
| top        |   number   |  80    |    签字图片距离顶边位置     |


####方法
| 方法名        | 返回参数   |  说明  |
| --------   |  -------- |  --------|
|  exportPost    |    |   传入签字图片生成最终结果    |



### 常见问题
- 在vue2和vue3中使用v-model有区别，vue2中为v-model，vue3为v-model:value
- 使用实例已放在 uni_modules/jp-signature/pages 中，可复制后测试



