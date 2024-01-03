<template>
	<view class="honor-card">
		<van-popup :show="show"   @close="popupClose"   custom-style="background-color: transparent;" :close-on-click-overlay="false">
			<view class="honor-card-box">
               <!-- 保存图片 -->
				<van-image  width="502rpx" height="566rpx" :src="showImage" fit="cover" radius="10px"  use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
			</view>
			<!-- <image class="close" src="../../../static/images/close.png" mode="aspectFill" @click="show = false"></image> -->
		</van-popup>
		<painter v-if="template" customStyle="width:314px;height:354px;position:fixed;bottom:-10000px;z-index:-10000;" @imgOK="onImgOk" @imgErr="imgErr" :palette="template" :dirty="true"/>
	</view>
</template>

<script>
	import palette from './card.js'
	export default {
		data(){
			return {
				show:false,
				template:'',
				showImage:''
			}
		}, 
		methods:{
			popupClose(){
				this.show = false
			},
			showTime(data){
				this.template = palette(data)
				this.show = true
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
			getImageUrl(){
				return this.showImage
			},
			imgErr(err){
				console.log(err)
			}
		}
	}
</script>

<style lang="scss">
	.honor-card{
		.honor-card-box{
			// position: relative;
			// overflow: hidden;
			// text-align: center;
			// margin-top: 200rpx;
			padding-bottom: 200rpx;
		}
		
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
	}
	

</style>