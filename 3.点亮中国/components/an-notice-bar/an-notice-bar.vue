<template>
	<view class="an-notice-box">
		<scroll-view class="an-notice-content">
			<swiper v-if="show" class="swiper" :autoplay="true" :interval="switchTime*1000" :duration="1500" :circular="true" :vertical="true">
				<swiper-item v-for="item in list" :key="item.id" :item-id="item.id" class="an-notice-content-item" catchtouchmove='onTouchMove'>
					<view class="swiper-item">
						<image class="user-icon image-round" :src="item.image" mode="aspectFill"></image>
						<view class="nk-name">
							{{item.name}}
						</view>
						<text class="an-notice-content-item-text">
							捐了{{item.love}}能量
						</text>
						<text class="time">{{item.create_time}}</text>
					</view>
				</swiper-item>
			</swiper>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		props:{
			list: {
				type: Array,
				default(){
					return []
				}
			},
			switchTime: {
				type: Number,
				default: 3
			}
		},
		data() {
			return {
				number: 0,
				copyText: '',
				show: '',
			};
		},
		mounted() {
			this.show = true;
		},
		watch: {
			list: function () {
				this.show = true;
			}
		},
		methods: {
			more(){
				this.show = false;
				this.$emit('more')
			}
		}
	}
</script>
<style lang="scss">
	.an-notice-box{
		height: 62upx;
		padding-left:10upx;
		overflow: hidden;
		width: 350rpx;
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 32px;
		.swiper{
			height: 62upx!important;
		}

		.swiper-item{
			display: flex;
			align-items: center;
			position: relative;
		}
		.an-notice-content{
			// width: calc(100% - 220upx);
			position: relative;
		}
		.user-icon{
			width: 48rpx;
			height: 48rpx;
			margin-right: 15rpx;
		}
		.an-notice-content-item{
			width: 100%;
			height: 62upx;
			text-align: left;
			line-height: 62upx;
		}
		.nk-name{
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
			max-width: 80rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		.an-notice-content-item-text{
			display: block;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
		}
		.time{
			font-size: 24rpx;
			font-weight: 400;
			color: #cbccd6;
			margin-left: 12rpx;
			position: absolute;
			right: 15rpx;
			top: 50%;
			transform: translateY(-50%);
		}
		@keyframes anotice {
			 0%  {transform: translateY(100%);}
			30%  {transform: translateY(0);}
			70%  {transform: translateY(0);}
		   100%  {transform: translateY(-100%);}
		}
	}
</style>
