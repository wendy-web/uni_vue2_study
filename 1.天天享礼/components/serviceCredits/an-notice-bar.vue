<template>
		<view class="an-notice-box">
			<scroll-view class="an-notice-content">
				<swiper v-if="show" class="swiper" :autoplay="true" :interval="switchTime*1000" :duration="1500" :circular="true" :vertical="true">
					<swiper-item v-for="item in list" :key="item.id" :item-id="item.id" class="an-notice-content-item" catchtouchmove='onTouchMove'>
						<view class="swiper-item">
							<view>
								<text class="nk-name">恭喜{{item.nick_name}}</text>
								<text>刚刚中奖获得{{item.credits}}牛金豆</text>
							</view>
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
	height: 40rpx;
	.swiper{
		height: 40rpx!important;
	}
	.swiper-item{
		white-space: nowrap;
		font-size: 24rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #85462e;
		text-align: center;
	}
	.an-notice-content{
		position: relative;
	}
	.an-notice-content-item{
		width: 100%;
		height: 40rpx;
		text-align: left;
		line-height: 40rpx;
	}
	.nk-name{
		margin-right: 8rpx;
	}
	@keyframes anotice {
			0%  {transform: translateY(100%);}
		30%  {transform: translateY(0);}
		70%  {transform: translateY(0);}
		100%  {transform: translateY(-100%);}
	}
}
</style>
