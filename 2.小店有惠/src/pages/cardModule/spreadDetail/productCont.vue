<template>
<view class="pro_cont">
	<view class="vip_card active">
		<view class="cowpea_box">
			<view :class="['search', config.face_value ? 'faveValueTxt' : '']">
				<text class="cowpea-num">{{ config.price }}</text>
				<text class="cowpea_num_lab" v-if="config.face_value">￥{{ config.sale_price }}</text>
			</view>
			<view class="cowpea_order-value" v-if="config.sale_num">
				{{ (config.lx_type == 2) ? '月售' : '已售' }}{{ config.sale_num }}
			</view>
		</view>
		<!-- <view class="cont_top box_fl" v-if="config.after_pay">
			<image class="bg_img" src="https://test-file.y1b.cn/store/1-0/24329/660681e121ed8.png" mode="scaleToFill"></image>
			<image class="cont_top-icon" src="https://test-file.y1b.cn/store/1-0/24329/660682c53facd.png" mode="scaleToFill"></image>
			先用后付 | 支持0元下单，确认收货后再付款
		</view> -->
		<scroll-view scroll-x scroll-with-animation :scroll-animation-duration="300" class="scroll_box">
			<view class="lab_box">
				<view class="lab_txt lx_type">{{ config.lx_type == 2 ? '京东' : '拼多多' }}</view>
				<view class="lab_txt face_value"v-if="config.face_value">
					{{ is_xq ? `${config.credits}积分抵${config.face_value}元券`: `${config.face_value}元券`}}
				</view>
				<!-- <view class="lab_txt face_value" v-if="config.face_value">{{ config.face_value }}元券</view> -->
				<block v-if="config.tags.length">
					<view class="lab_txt" v-for="(item, idx) in config.tags" :key="idx">{{ item }}</view>
				</block>
			</view>
		</scroll-view>
		<!-- <view class="cowpea_detail fl_bet" v-if="config.face_value" @click="confirmHandle">
			<image class="bg_img" src="https://file.y1b.cn/store/1-0/24528/66558004b3c29.png" mode="scaleToFill"></image>
			<view class="cowpea_val">{{ config.face_value }}</view>
			<view class="cowpea_txt fl_bet">
				<view>
					<view>{{ config.face_value }}元优惠券</view>
					<view class="cowpea_txt-lab">使用期限：{{ config.coupon_start_time }} ~ {{ config.coupon_end_time }}</view>
				</view>
				<van-icon name="arrow" color="#F84943" size="20" />
			</view>
		</view>-->
		<image class="after_pay-img" src="https://file.y1b.cn/store/1-0/2466/66618c1756afb.png"
			mode="widthFix" v-if="config.after_pay"></image>
	</view>
	<view class="pro_title-cont">
		<view class="product_title">{{ config.goods_name }}</view>
		<view class="labList_cont">
			<text class="lab_txt">回头客{{config.again_num || 0}}人</text>
			<text class="lab_txt" space="emsp">· 一周内{{config.buy_num || 0}}人购买</text>
			<text class="lab_txt" space="emsp">· {{config.collect_num || 0}}人收藏</text>
		</view>
	</view>
</view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
	props: {
		config: {
			type: Object,
			default () {
				return {
				}
			}
		},
		is_xq: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
		}
	},
	computed: {
		...mapGetters(["userInfo", 'isAutoLogin']),
	},
	methods: {
		confirmHandle() {
			this.$emit('confirm');
		}
	},
}
</script>
<style lang="scss" scoped>
.pro_cont{
	background: #fff;
	padding: 24rpx;
}
.vip_card {
	position: relative;
	z-index: 0;
	overflow: hidden;
}
.cowpea_box {
	color: #EF2B20;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.search {
		line-height: 40rpx;
		display: flex;
		align-items: center;
		&.faveValueTxt::before{
			content: '券后';
			font-size: 28rpx;
			margin-right: 8rpx;
			font-weight: bold;
		}
		.cowpea-num {
			&::before{
				content: '￥';
				font-size: 26rpx;
			}
		}
		.cowpea_num_lab {
			font-size: 28rpx;
			text-decoration: line-through;
			color: #aaa;
			margin-left: 12rpx;
			margin-top: 3rpx;
		}
	}
	.cowpea_order-value {
		font-size: 26rpx;
		color: #aaa;
	}
	.cowpea-num {
		font-size: 48rpx;
		font-weight: bold;
	}
	.cowpea-label {
		font-size: 28rpx;
		font-weight: 600;
		margin-left: 6rpx;
	}
	.cowpea_value {
		font-size: 26rpx;
		text-decoration: line-through;
		margin-left: 20rpx;
		opacity: 0.6;
	}
}
.cowpea_cont {
	background: #fff;
	border-radius: 28rpx;
	margin: 0 4rpx 4rpx 4rpx;
	padding: 24rpx 16rpx 0;
	overflow: hidden;
	.cont_top {
		padding: 10rpx 24rpx;
		position: relative;
		z-index: 0;
		font-size: 26rpx;
		font-weight: bold;
		color: #2faa5e;
		line-height: 36rpx;
		margin-bottom: 26rpx;
		.cont_top-icon{
			width: 34rpx;
			height: 34rpx;
			margin-right: 8rpx;
		}
	}
}
.scroll_box {
	margin-top: 24rpx;
}
.lab_box {
	display: flex;
	flex-wrap: nowrap;
	.lab_txt {
		border: 0.8rpx solid rgba(248,72,66,0.35);
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #f84842;
		line-height: 38rpx;
		padding: 2rpx 10rpx;
		white-space: nowrap;
		&:not(:last-child) {
			margin-right: 10rpx;
		}
		&.lx_type {
			border: 0;
			padding: 2rpx 12rpx;
            font-size: 24rpx;
            font-weight: 600;
            color: #fff;
            position: relative;
            z-index: 0;
            &::before {
                content: "\3000";
                background: url("https://file.y1b.cn/store/1-0/2465/665fffdf7025d.png") 0 0 / 100% 100% no-repeat;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            }
		}
		&.face_value {
			color: #F55436;
			background: rgba(245,84,54,0.12);
			border-radius: 4rpx;
			border: 0;
			padding: 2rpx 12rpx;
		}
	}
}
.after_pay-img {
	width: 100%;
	height: 56rpx;
	margin-top: 24rpx;
}
.cowpea_detail {
	position: relative;
	z-index: 0;
	padding: 12rpx 0;
	margin-top: 24rpx;
	.cowpea_val {
		width: 140rpx;
		flex: 0 0 140rpx;
		font-size: 52rpx;
		color: #fff;
		text-align: center;
		line-height: 70rpx;
		font-weight: bold;
		&::before {
			content: '￥';
			font-size: 32rpx;
		}
	}
	.cowpea_txt {
		flex: 1;
		box-sizing: border-box;
		padding-right: 24rpx;
		font-size: 28rpx;
		color: #EF2B20;
		line-height: 40rpx;
		margin-left: 20rpx;
		font-weight: bold;
		.cowpea_txt-lab{
			margin-top: 4rpx;
			font-size: 24rpx;
			color: rgba(248,72,66,0.50);
		}
	}
}
.pro_title-cont {
	margin-top: 24rpx;
}
.product_title {
  font-size: 32rpx;
  color: #333;
  line-height: 44rpx;
  font-weight: bold;
}
.labList_cont {
	margin-top: 16rpx;
	font-size: 24rpx;
	color: #9D6B36;
	line-height: 38rpx;
	.lab_txt{
		margin-right: 1em;
	}
}
 </style>
