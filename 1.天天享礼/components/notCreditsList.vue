<template>
<view class="not_credit-box" id="notCreditsDomBox">
	<view class="not_title">
		{{title}}
	</view>
	<scroll-view class="no_credits" scroll-x="true">
		<vew class="no_credits-list">
			<view class="no_credits-item"
				v-for="(item, index) in jdList" :key="index"
				@click="jdHandle(item)">
				<van-image class="item_image" height="144rpx" width="144rpx"
					fit="contain"  use-loading-slot :src="item.jdImage" radius="16rpx"
				><van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
				<view class="item_price">{{item.price}}</view>
			</view>
		</vew>
	</scroll-view>
</view>
</template>

<script>
import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
import { getImgUrl } from '@/utils/auth.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { mapGetters } from 'vuex';
export default{
	props: {
		title: {
			type: String,
			default: ''
		},
		jdList: {
			type: Array,
			default: []
		},
		positionId: {
			type: String || Number,
			default: ''
		}
    },
	computed: {
		...mapGetters(['isAutoLogin']),
	},
	mixins: [goDetailsFun],
	data(){
		return {
			bestValueList:[],
			exchangeRankList:[],
			imgUrl: getImgUrl(),
			isShow: false
		}
	},
	methods:{
		async jdHandle(item) {
			if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
			const { skuId, has_coupon, lx_type, goods_sign, positionId, is_flow } = item;
			let api = '';
            const params = { positionId };
			if (lx_type == 3) {
                api = goodsPromotion;
                params.goods_sign = goods_sign;
            } else {
                api = bysubunionid;
                params.skuId = skuId;
                params.is_popover = 1;
                params.has_coupon = has_coupon || 0;
            }
            const skuRes = await api(params);
			if (skuRes.code == 0) return this.$toast(skuRes.msg);
			if (is_flow == 2) {
                this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&positionId=${positionId}`);
                return;
            }
			const { type_id, jdShareLink, mobile_url } = skuRes.data;
			this.$openEmbeddedMiniProgram({
                appId: type_id,
                path: jdShareLink || mobile_url
            });
		}
	}
}
</script>
<style lang="scss">
.not_credit-box{
	// height: 312rpx;
	border-radius: 16rpx;
	position: relative;
	z-index: 0;
	margin-bottom: 16rpx;
	padding: 8rpx;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/2482/66ac7c7d4749d.png") 0 0 / 100% 100% no-repeat;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	// &::after {
	// 	content: '\3000';
	// 	background: url("https://file.y1b.cn/store/1-0/2482/66ac8403c4117.png") 0 0 / cover no-repeat;
	// 	position: absolute;
	// 	right: 0;
	// 	top: 0;
	// 	width: 385rpx;
	// 	height: 97rpx;
	// 	z-index: -1;
	// }
}
.not_title{
	position: relative;
	padding: 16rpx 27rpx 16rpx;
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	line-height: 50rpx;
	z-index: 0;
	display: inline-block;
	// &::before {
	// 	content: '\3000';
	// 	background: url("https://file.y1b.cn/store/1-0/23118/654af6d2a0a73.png") 0 0 / 100% 100% no-repeat;
	// 	position: absolute;
	// 	width: 54rpx;
	// 	height: 54rpx;
	// 	top: 17rpx;
	// 	left: 12rpx;
	// 	z-index: -1;
	// }
	&::after {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/2482/66ac7f45a856a.png") 0 0 / 100% 100% no-repeat;
		position: absolute;
		width: 132rpx;
		height: 60rpx;
		top: 9rpx;
		right: -16rpx;
	}
	.not_title-lab{
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		line-height: 36rpx;
	}
}
.no_credits {
	position: relative;
	background: #fff;
	border-radius: 12rpx;
	padding: 20rpx 0 10rpx 0;
	box-sizing: border-box;
	&::after {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/2482/66ac8403c4117.png") 0 0 / 100% 100% no-repeat;
		position: absolute;
		right: 15rpx;
		top: -98rpx;
		width: 114rpx;
		height: 98rpx;
		z-index: -1;
	}
	.no_credits-list {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		padding: 0 16rpx;
		font-size: 28rpx;
		font-weight: 600;
		text-align: center;
		color: #f84842;
		line-height: 28rpx;
		.no_credits-item {
			margin-right: 24rpx;
			.item_price {
				margin-top: 12rpx;
				&::before {
					content: '￥';
					font-size: 20rpx;
					margin-right: 4rpx;
				}
			}
		}
	}
}
</style>
