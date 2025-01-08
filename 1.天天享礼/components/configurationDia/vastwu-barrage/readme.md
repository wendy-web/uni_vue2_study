# 测试发现h5不支持
## 如何使用
```
<template>
	<view class="barrage-test">
		<vastwu-barrage width="750rpx" height="1300rpx" ref="vBarrage"></vastwu-barrage>
	</view>
</template>
<script>
	const list = ['模拟弹幕效果','宽度如要修改请留意动画是从750rpx到-100%','高度默认100%','随机颜色','随机速度','图标可设置','图标大小可控','可自定义高度轨道','高度轨道数组多长，一屏幕就能播多少列','高度不够不会显示','欢迎使用','不会重叠']
	import vastwuBarrage from '@/components/vastwu-barrage/vastwu-barrage.vue'
	export default {
		components:{vastwuBarrage},
		data() {
			return {}
		},
		onLoad() {
			this.$refs.vBarrage.init(list)
		},
		methods: {}
	}
</script>

<style>
.barrage-test{
	background-color: #C0C0C0
}
</style>
```

## 参数说明
|参数|类型|默认|说明|
|:-|:-:|-:|-:|
|trackList|Array|[0,100,200,300,400,500,600,700,800,900,1000]|自定义弹幕轨道，值为距离容器顶部的距离，可根据图标高度自行调整|
|icon|String|![默认图](https://vkceyugu.cdn.bspapp.com/VKCEYUGU-d0fe8d48-ece3-4582-a195-6929fb47a9c5/43a4f7a7-ff65-4460-b774-1249f31fbef7.png)|默认图标|
|iconWidth|String|62rpx|图标宽度|
|iconHeight|String|'86rpx'|图标高度|
|minTime|Number|7|最短过渡时间|
|maxTime|Number|10|最长过渡时间|
|width|String|'100%'|容器宽度|
|height|String|'100%'|容器高度|