<template>
	<view class="h100">
		<!-- #ifdef VUE2 -->
		<jp-signature-popup v-model="image" required />
		<view>{{image}}</view>
		<view class="but" @click="toPop1">自定义样式，弹框调用</view>
		<jp-signature-popup ref="signature1" popup v-model="image2" />
		<image :src="image2" style="width: 200px;" mode="widthFix"></image>
		<!-- #endif -->
		<!-- #ifdef VUE3 -->
		<jp-signature-popup  v-model:value="image" required />
		<view>{{image}}</view>
		<view class="but" @click="toPop1">自定义样式，弹框调用</view>
		<jp-signature-popup ref="signature1" popup v-model:value="image2" />
		<image :src="image2" style="width: 200px;" mode="widthFix"></image>
		<!-- #endif -->
		{{image2}}
		
		
		<view>下面是使用 jp-signature-popup 结合 jp-merge  在文档上签字</view>
		<view style="text-align: center;padding-bottom: 150px;">
			<image :src="image4" v-if="image4" style="width: 350px;height: 350px;border: 1px solid #ccc;"></image>
			<image src="../../static/sqs.jpg" v-else style="width: 350px;height: 350px;border: 1px solid #ccc;"></image>
			<view class="but" style="margin: 0 25px;" @click="toPop2">我要在上面签字</view>
			<jp-signature-popup ref="signature2" @change="setImg" popup v-model:value="image3" />
			<jp-merge bgImage="../../static/sqs.jpg" ref="jpMerge"></jp-merge>
		</view>
	</view>
</template>
<!-- 有项目需要开发的请联系 扣 - 371524845 -->
<script>
	export default {
		data() {
			return {
				image:'',
				image2:'',
				image3:'',
				image4:''
			}
		},
		methods: {
			setImg(val){
				if(val){
					this.$refs.jpMerge.exportPost(val).then(res => {
						this.image4 = res
				    })
				}
			},
			toPop1(){
				this.$refs.signature1.toPop()
			},
			toPop2(){
				this.$refs.signature2.toPop()
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
	.sssv{
		height: 1150px;
	}
</style>
