## 一个炫酷的3D图片展示模块
### 标签名: ```<hj3-display-images>```
## 如果打赏过88（100%）或者在五月底（80%概率）推出新的版本：流模式<图片内容无限更替且不影响可见的那些>
### 属性： 
>#### 图片列表：images: Array[Image Url String||Object<{src:Image Url String,title:String}>]
>#### 是否横图显示（默认：true）：vertical: Boolean 
>#### 是否支持手势切换（默认：true）：vtouch: Boolean 
>#### 是否自动轮播（默认：false）：autoplay: Boolean 
>#### 轮播间隔（默认：3000 ms）： interval: Number 
>#### 顺时针轮播（默认：false）： clockwise: Boolean
>#### 标题底部显示（默认：false）：	 titleBottom: Boolean
>#### 标题背景色（默认：'rgba(0,0,0,0.2)'）： backcolor: CSS Color String
>#### 字体颜色（默认：'black'）： fontcolor: CSS Color String
>#### 标题对其方式（默认：'center'）：titleAlign: string<'center'||'left'||'right>
#### <新增+++>
>#### 背景设置（默认：'rgba(0,0,0,0)'）：background:CSS Color String|| Image Url

### 事件：
>#### @itap handler第一个参数是图片在列表中的index 

### 已测试：微信小程序，安卓APP，H5(初步测试)如有BUG欢迎在底部留言
####更新日志：
##### v1.0.4 小的内容修改。2019-03-20
##### v1.0.3 新增了背景图片或颜色设置。 2019-03-20
##### v1.0.2 新增了标题功能，以及与该功能相关的改进;点击事件更名为itap，防止h5环境下与原生的tap事件冲突。欢迎给出建议。 2019-03-09
##### v1.0.1 新增了自动轮播功能（PS:由于支持点击事件，页面跳转还是全图预览都可以解决，就不增加在插件内了） 2019-02-27
##### v1.0.0 分享一个炫酷的图片展示模块吧！花了不少时间做的，主要是为了支持触摸 2019-01-26

### 使用示例
```
<template>
	<view class="content">
		<hj3-display-images :images="img" :vertical="false" :vtouch="true" @itap="tap" :autoplay="true" :clockwise="true" :interval="2000" :titleBottom="true" :background="back"></hj3-display-images>
		 <view class="" >
		 	点击图片的Index为:{{current}}
		 </view>
	</view>
</template>

<script>
	import hj3DisplayImages from '@/components/hj3-display-images/hj3-display-images.vue';
	
	export default {
		components:{
			hj3DisplayImages
		},
		data() {
			return {
				img: [{src:'http://image.zhangxinxu.com/image/study/s/s128/mm1.jpg',title:"mm1"}, {src:'http://image.zhangxinxu.com/image/study/s/s128/mm8.jpg',title:"mm2"}, 
				//只是为了演示，不推荐这种混合方式，不一致不太好
					'http://image.zhangxinxu.com/image/study/s/s128/mm3.jpg', 'http://image.zhangxinxu.com/image/study/s/s128/mm4.jpg',
					'http://image.zhangxinxu.com/image/study/s/s128/mm6.jpg', 'http://image.zhangxinxu.com/image/study/s/s128/mm7.jpg',
					'http://image.zhangxinxu.com/image/study/s/s128/mm10.jpg', 'http://image.zhangxinxu.com/image/study/s/s128/mm13.jpg'
				],
				current:0,
				// back:'rgba(233,111,111,0.5)' ,
				back:'http://picm.bbzhi.com/fengjingbizhi/wubianyuzhoumeilixingkong/wubianyuzhoumeilixingkong_450321_m.jpg'
			};
		},
		methods: {
			tap:function (e) {
				console.log(1)
				this.current = e 
			}
		}
	}
</script>

<style scoped="">
	.content{
		display: flex;
		flex-direction: column;
	}
	
</style>

```