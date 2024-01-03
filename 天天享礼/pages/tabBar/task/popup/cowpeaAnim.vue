<template>
	<view class="cowpea-anim" v-if="isShow">
		<image class="cowpea-icon anim01" :style="animTemplate"  :src="imgUrl + 'static/popup/cowpea_anim.png'" mode="aspectFill"></image>
		<image class="cowpea-icon anim02" :style="animTemplate"  :src="imgUrl + 'static/popup/cowpea_anim.png'" mode="aspectFill"></image>
		<image class="cowpea-icon anim03" :style="animTemplate"  :src="imgUrl + 'static/popup/cowpea_anim.png'" mode="aspectFill"></image>
		<image class="cowpea-icon anim04" :style="animTemplate"  :src="imgUrl + 'static/popup/cowpea_anim.png'" mode="aspectFill"></image>
		<image class="cowpea-icon anim05" :style="animTemplate"  :src="imgUrl + 'static/popup/cowpea_anim.png'" mode="aspectFill"></image>
	</view>
</template>

<script>
	import { getImgUrl } from '@/utils/auth.js';
	export default {
		data(){
			return {
				isShow:false,
				animTemplate:'',
				imgUrl: getImgUrl()
			}
		},
		methods:{
			show(data){
				this.isShow = true
				setTimeout(()=>{
					this.animTemplate = `transform:scale(1);left:${data.left}px;top:${data.top}px;`
					this.closeAnim()
				},100)
			},
			closeAnim(){
				setTimeout(()=>{
					this.isShow = false
					this.$emit('animEnd')
					this.animTemplate = ''
				},1200)
			}
		}
	}
</script>

<style lang="scss">
	.cowpea-anim {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: auto;
		height: auto;
		z-index: 10000;
		// background-color: rgba(0, 0, 0, .6);
		.cowpea-icon{
			width: 68rpx;
			height: 62rpx;
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -32rpx;
			margin-top: -32rpx;
			transform: scale(2);
		}
		.anim01 {
			transition: all 0.5s ease-in 0.1s;
		}

		.anim02 {
			transition: all 0.5s ease-in 0.2s;
		}

		.anim03 {
			transition: all 0.5s ease-in 0.3s;
		}

		.anim04 {
			transition: all 0.5s ease-in 0.4s;
		}

		.anim05 {
			transition: all 0.5s ease-in 0.5s;
		}
	}
</style>
