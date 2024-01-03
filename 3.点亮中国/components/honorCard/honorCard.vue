<template>
	<view class="honor-card">
		<van-popup
			:show="show"
			@close="popupClose"
			custom-style="background-color: transparent; overflow:visible;"
			:close-on-click-overlay="false">
			<image class="close" src="../../static/images/close.png" mode="aspectFill" @click="show = false"></image>
			<view class="honor-card-box">
               <!-- 保存图片 -->
				<van-image  width="626rpx" height="870rpx" :src="showImage" fit="cover"  use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
			<!-- 删除按钮 -->
			<view class="tools-btn" v-if="isShowBtn">
				<view v-if="isShowDonateBtn">
					<view class="share-btn" @click="continueLightHandle">
						继续帮助更多人
					</view>
					<view class="share_btn">
						<image class="share_btn-bg" src="../../static/images/cardShare.png" mode="aspectFill"></image>
						<button open-type="share" data-name="honorCard">分享好友</button>
					</view>
				</view>
				<view class="btn_list" v-else>
					<view class="save-btn">
						<button open-type="share" data-name="honorCard">分享好友</button>
					</view>
					<view class="save-btn" @click="save">
						保存图片
					</view>
				</view>
			</view>
		</van-popup>
		<painter v-if="template" customStyle="width:626px;height:870px;position:fixed;bottom:-10000px;z-index:-10000;" @imgOK="onImgOk" @imgErr="imgErr" :palette="template" :dirty="true"/>
	</view>
</template>

<script>
	import palette from './card.js'
	export default {
		data(){
			return {
				show:false,
				template:'',
				showImage:'',
				isShowBtn: true,
				isShowDonateBtn: false
			}
		},
		methods:{
			popupClose(){
				this.show = false
			},
			popupShowImg(data) {
				this.showTime(data)
				this.isShowBtn = false;
			},
			// 我的成就中的分享 - 展示btn的按钮
			showTime(data, showDonate = false){
				this.showImage = '';
				this.template = '';
				this.isShowDonateBtn = showDonate;
				setTimeout(()=>{
					this.template = palette(data)
					this.show = true
				},0)
			},
			getImageUrl() {
				return this.showImage;
			},
			save () {
				wx.saveImageToPhotosAlbum({filePath:this.showImage,success() {
					uni.showToast({
						icon:'none',
						title:'图片保存成功，可前往本地查看'
					})
				}})
			},
			onImgOk (e) {
				this.showImage = e.mp.detail.path||e.target.path
			},
			imgErr(err){
				console.log(err)
			},
			continueLightHandle() {
				this.popupClose();
				this.$emit('continueLight');
			}
		}
	}
</script>

<style lang="scss">
	.honor-card{
		.honor-card-box{
			position: relative;
			width: 626rpx;
			height: 870rpx;
			font-size: 0;
			background-color: transparent;
		}
		.close {
			position: absolute;
			width: 56rpx;
			height: 56rpx;
			top: -88rpx;
			right: 0;
		}
		.tools-btn{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 1000;
		}
		.save-btn{
			width: 282rpx;
			height: 80rpx;
			box-sizing: border-box;
			text-align: center;
			line-height: 68rpx;
			font-size: 32rpx;
			font-weight: 700;
			border-radius: 30px;
		}
		.save-btn{
			border: 6rpx solid #ebc797;
			background-color: #FAE3B8;
			button:after {
				border: none;
			}
			button {
				background-color: transparent;
				padding: 0;
				height: 68rpx;
				line-height: 68rpx;
				font-size: 32rpx;
				font-weight: 700;
				border-radius: 30px;
				color: #6b3813;
			}
		}
		.btn_list {
			width: 100%;
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin: 40rpx auto 30rpx;
		}
		.share-btn{
			width: 520rpx;
			line-height: 80rpx;
			border-radius: 46rpx;
			border: 6rpx solid #ca873c;
			background-color: #F5BD5C;
			color: #6B3813;
			box-sizing: border-box;
			text-align: center;
			font-size: 32rpx;
			font-weight: 700;
			margin: 40rpx auto 30rpx;
		}
		.share_btn{
			position: relative;
			margin: auto;
			z-index: 0;
			width: 140rpx;
			height: 40rpx;
			.share_btn-bg {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: -1;
			}
			>button {
				opacity: 0;
			}
		}
	}
</style>