<template>
	<view class="city-share-card">
		<van-popup
			:show="show"
			@close="popupClose"
			custom-style="background-color: transparent;overflow:auto;"
			:close-on-click-overlay="false"
		>
			<view :class="['city-share-card-box', showClose ? 'active' :'']">
				<image
					class="close"
					src="/static/images/close.png"
					mode="aspectFill"
					@click="show = false"
					v-if="showClose"
				></image>
				<!-- 保存图片 -->
				<van-image width="579.6rpx" height="694.8rpx" :src="showImage" fit="cover" radius="10px"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="share-btn" @click="show = false" v-if="showClose">
					我也要参加
				</view>
			</view>
		</van-popup>
		<painter v-if="template" customStyle="width:604px;height:724px;position:fixed;bottom:-10000px;z-index:-10000;"
			@imgOK="onImgOk" @imgErr="imgErr" :palette="template" :dirty="true" />
	</view>
</template>

<script>
	import palette from './card.js'
	export default {
		data() {
			return {
				show: false,
				template: '',
				showImage: '',
				shareImgData: '',
				showClose: false
			}
		},
		methods: {
			popupClose() {
				this.show = false
				this.showImage = ''
			},
			showTime(data, showClose) {
				console.log('分享生成图片 :>> ');
				this.showImage = '';
				this.template = '';
				this.shareImgData = data;
				this.showClose = showClose;
				setTimeout(() => {
					this.template = palette(data)
					this.show = true
				}, 0)
			},
			createImg(data) {
				console.log('data', data);
				this.showImage = '';
				this.template = '';
				this.shareImgData = data;
				setTimeout(() => {
					this.template = palette(data)
				}, 0);
			},

			getImageUrl() {
				return this.showImage;
			},
			getShareImgData() {
				return this.shareImgData;
			},
			save() {
				wx.saveImageToPhotosAlbum({
					filePath: this.showImage,
					success() {
						uni.showToast({
							icon: 'none',
							title: '图片保存成功，可前往本地查看'
						})
					}
				})
			},
			onImgOk(e) {
				this.showImage = e.mp.detail.path || e.target.path

			},
			imgErr(err) {
				console.log(err)
			}
		}
	}
</script>

<style lang="scss">
	.city-share-card {
		.city-share-card-box {
			width: 579.6rpx;
			height: 694.8rpx;
			font-size: 0;
			padding-bottom: 360rpx;
			&.active {
				padding-bottom: 0;
				position: relative;
			}
		}

		.close {
			position: absolute;
			right: 0;
			top: -80rpx;
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 0 auto;
		}
		.share-btn{
			width: 282rpx;
			height: 80rpx;
			border: 4rpx solid #fedbce;
			border-radius: 44px;
			background-color: #FB9D18;
			font-size: 32rpx;
			font-weight: 700;
			text-align: center;
			color: #ffffff;
			line-height: 80rpx;
			margin: 38rpx auto 0;
		}
	}
</style>
