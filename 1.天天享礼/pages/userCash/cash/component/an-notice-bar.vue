<template>
<swiper
	class="swiper_an"
	:autoplay="true"
	:interval="switchTime*1000"
	:duration="1500"
	:circular="true"
	:vertical="true"
	v-if="cashRecodeList.length"
>
	<swiper-item v-for="item in cashRecodeList" :key="item.id" catchtouchmove='onTouchMove'>
		<view class="swiper-item box_fl">
			<van-image
				class="user-icon"
				height="44rpx" width="44rpx"
				:src="item.avatar_url"
				radius="50%"
				use-loading-slot><van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<view class="cont_right txt_ov_ell1">
				<text class="nk_name"> {{item.nick_name}}</text>刚刚领取了<text style="color: #F84842;">{{ item.profit }}</text> 元
			</view>
		</view>
	</swiper-item>
</swiper>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	props:{
		switchTime: {
			type: Number,
			default: 3
		}
	},
	computed: {
		...mapGetters(['cashRecodeList'])
	},
	data() {
		return {};
	},
	mounted() {
	},
	methods: {
	}
}
</script>
<style lang="scss">
.swiper_an {
	height: 60rpx!important;
	background: linear-gradient(90deg,#eceff5, rgba(247,248,250,0.00));
	border-radius: 12rpx;
	box-sizing: border-box;
}
.swiper-item{
	white-space: nowrap;
	font-size: 24rpx;
	color: #85462e;
	height: 100%;
	.user-icon{
		margin: 0 16rpx;
		opacity: .8;
	}
	.cont_right {
		flex: 1;
		width: 0;
	}
}
.nk_name {
	margin-right: 8rpx;
	// flex: 1;
	// width: 0;
	// overflow: hidden;
}
</style>
