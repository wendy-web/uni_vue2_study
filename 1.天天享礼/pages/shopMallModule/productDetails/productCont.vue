<template>
<view class="pro_cont">
	<view class="vip_card active">
		<view class="cowpea_box">
			<view class="box_fl_end search" :class="{'faveValueTxt' :config.face_value}">
				<text class="cowpea-num">{{ config.price }}</text>
			</view>
			<view class="cowpea_order-value" v-if="config.sale_num">
				{{ (config.lx_type == 2) ? '月售' : '已售' }}{{ config.sale_num }}
			</view>
		</view>
		<view class="cowpea_cont" v-if="config.after_pay || config.tags.length || config.face_value" >
			<view class="cont_top box_fl" v-if="config.after_pay">
				<image class="bg_img" src="https://test-file.y1b.cn/store/1-0/24329/660681e121ed8.png" mode="scaleToFill"></image>
				<image class="cont_top-icon" src="https://test-file.y1b.cn/store/1-0/24329/660682c53facd.png" mode="scaleToFill"></image>
				先用后付 | 支持0元下单，确认收货后再付款
			</view>
			<scroll-view
				scroll-x scroll-with-animation :scroll-animation-duration="300"
				class="scroll_box" v-if="config.tags.length">
				<view class="lab_box">
					<view class="lab_txt" v-for="(item, idx) in config.tags" :key="idx">{{ item }}</view>
				</view>
			</scroll-view>
			<view class="cowpea_detail fl_bet" v-if="config.face_value" @click="confirmHandle">
				<image class="bg_img" src="https://test-file.y1b.cn/store/1-0/24330/66077545d19c8.png" mode="scaleToFill"></image>
				<view class="cowpea_val">{{ config.face_value }}</view>
				<view class="cowpea_txt fl_bet">
					<view>
						<view>优惠券
							<text>（{{config.zero_credits ? '0豆特权' : `${config.credits}牛金豆兑`}}）</text>
						</view>
						<view class="cowpea_txt-lab">使用期限：{{ config.coupon_start_time }} ~ {{ config.coupon_end_time }}</view>
					</view>
					<van-icon name="arrow" color="#F84943" size="20" />
				</view>
			</view>
		</view>
	</view>
	<view class="pro_title-cont">
		<view class="product_title">{{ config.goods_name }}</view>
		<view class="labList_cont">
			<view class="lab_txt">回头客{{config.again_num || 0}}人</view>
			<view class="lab_txt">一周内{{config.buy_num || 0}}人购买</view>
			<view class="lab_txt" v-if="config.collect_num">{{config.collect_num || 0}}人收藏</view>
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
			this.$emit('confirm')
		}
	},
}
</script>
<style lang="scss" scoped>
.pro_cont{
	margin: 0 24rpx;
	padding-top: 4rpx;
}
.vip_card {
	position: relative;
	z-index: 0;
	overflow: hidden;
	&.active {
		background: #F84842 url("https://test-file.y1b.cn/store/1-0/24329/660679e2dbc63.png") 0 0 / 100% auto no-repeat;
		border-radius: 28rpx;
		margin-bottom: 24rpx;
	}
}
.cowpea_box {
	color: #fff;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding: 0 24rpx;
	font-size: 26rpx;
	margin-top: 10rpx;
	line-height: 1;
	margin-bottom: 10rpx;
	.search {
		&.faveValueTxt::before{
			content: '券后';
			font-size: 28rpx;
			line-height: 40rpx;
			margin-right: 8rpx;
		}
		.cowpea-num {
			&::before{
				content: '￥';
				font-size: 26rpx;
				line-height: 36rpx;
			}
		}
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
	margin-bottom: 24rpx;
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
		padding: 0 10rpx;
		white-space: nowrap;
		&:not(:last-child) {
			margin-right: 10rpx;
		}
	}
}
.cowpea_detail {
	position: relative;
	z-index: 0;
	padding: 12rpx 0;
	margin-bottom: 24rpx;
	.cowpea_val {
		width: 140rpx;
		flex: 0 0 140rpx;
		font-size: 40rpx;
		color: #fff;
		text-align: center;
		line-height: 70rpx;
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
		color: #f84842;
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
	margin: 0 20rpx;
}
.product_title {
  font-size: 32rpx;
  color: #333;
  line-height: 44rpx;
  font-weight: bold;
}
.labList_cont {
	display: flex;
	flex-wrap: nowrap;
	margin-top: 18rpx;
	.lab_txt {
		border: 0.8rpx solid rgba(157,107,54,0.35);
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #9D6B36;
		line-height: 38rpx;
		padding: 0 10rpx;
		white-space: nowrap;
		&:not(:last-child) {
			margin-right: 10rpx;
		}
	}
}
 </style>
