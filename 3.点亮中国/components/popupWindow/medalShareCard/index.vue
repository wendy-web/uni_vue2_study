<template>
	<view class="city-share-card">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false">
			<view class="city-share-card-box">
				<!-- 保存图片 -->
				<van-image width="579.6rpx" height="769.8rpx" :src="showImage" fit="cover" radius="10px"
					use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
			<!-- <image class="close" src="../../static/images/close.png" mode="aspectFill" @click="show = false"></image> -->
		</van-popup>
		<painter v-if="template" customStyle="width:604px;height:802px;position:fixed;bottom:-10000px;z-index:-10000;"
			@imgOK="onImgOk" @imgErr="imgErr" :palette="template" :dirty="true" />
	</view>
</template>

<script>
	import palette from './card.js'
	import paletteTeam from './cardTeam.js'
	export default {
		data() {
			return {
				show: false,
				template: '',
				showImage: ''
			}
		},
		methods: {
			popupClose() {
				this.show = false
				this.showImage = ''
			},
			showTime(data) {
				console.log('data', data)
				this.showImage = ''
				this.template = ''
				setTimeout(() => {
					this.template = data.type == 0 ? palette(data) : paletteTeam(data)
					this.show = true;
				}, 0)
			},
			getImageUrl() {
				return this.showImage;
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
			// position: relative;
			width: 579.6rpx;
			height: 769.8rpx;
			font-size: 0;
			padding-bottom: 380rpx;
		}

		.close {
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 0 auto;
		}
	}
</style>
