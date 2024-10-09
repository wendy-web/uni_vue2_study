
<template>
<van-popup
	:show="isShow"
	position="bottom"
	custom-style="overflow: inherit;height:85%"
	round
	safe-area-inset-bottom
>
<view class="cont_box" :style="{ '--padding': payBottomDomHeight + 'px'}">
	<view class="close_box fl_bet">
    <view class="close_cancel" @click="cancelHandle">取消</view>
		<image class="title_icon" mode="aspectFill"
			src="https://file.y1b.cn/store/1-0/24627/667d1b1b06071.png"
		></image>
		<image class="close_box-icon" :src="subImgUrl +'/close.png'" mode="aspectFit" @click="popupClose"></image>
	</view>
	<view class="service">
		<view class="card_top">
			<image class="card_top-title" mode="aspectFill"
			src="https://file.y1b.cn/store/1-0/24627/667d1cf9e87ea.png"></image>
			<image class="card_top-icon" mode="aspectFill"
			src="https://file.y1b.cn/store/1-0/24627/667d1deb3f7c8.png"></image>
			<view class="card_price fl_bet">
				<view>年省<text class="card_price-num">1980</text>起</view>
				<view class="card_price-box box_fl_end">
					<view v-html="formatPrice(cardPrice)"></view>
					<view class="card_price-init">¥{{car_initPrice}}</view>
				</view>
			</view>
    </view>
      <!-- 开通省钱卡的权益 -->
    <cardContDom></cardContDom>
	</view>
	<view class="pay_bottom" id="payBottomDom">
      <view class="no_credits">
          <view class="no_credits-checkbox fl_bet">
            <view class="no_credits-left box_fl" @click="isShowNoCreditsDia = true">
              <image src="https://file.y1b.cn/store/1-0/24628/667e152c9f0f0.png" mode="scaleToFill" class="no_credits-img" ></image>
              <van-icon name="question-o" color="#A5512B" size="26rpx" custom-style="font-weight: 600;"/>
            </view>
            <van-checkbox
              checked-color="#FF4749" icon-size="18px" style="--checkbox-label-margin:5px;"
              :value="isNotCredits" @change="changeNotCreditsHandle" label-position="left"
            ><view style="color: #F84842;" v-html="formatPrice(not_creditsPrice)" ></view>
            </van-checkbox>
          </view>
      </view>
      <view class="pay_open">
        <view class="pay_btn fl_bet" @click="buyVipHandle">
        <image src="https://file.y1b.cn/store/1-0/24628/667e0f3ae2005.png" mode="scaleToFill" class="pay_lab-img" ></image>
        <view class="gesture_icon-box">
          <image src="https://file.y1b.cn/store/1-0/24124/65b0b0bca7769.png"
            mode="widthFix" class="gesture_icon"
          ></image>
        </view>
        <view class="pay_left fl_center">
          <view v-html="formatPrice(buyPrice)"></view>
          <view class="pay_left-lab">(原价<text style="text-decoration: line-through;">{{carInitPrice}}</text>元)</view>
        </view>
			  <image src="https://file.y1b.cn/store/1-0/2471/66824f2e7980d.png"
            mode="heightFix" class="confirm_icon"
          ></image>
        </view>
        <view class="pay_txt fl_bet">
          <view class="pay_agree">
            <van-checkbox checked-color="#FF4749" icon-size="16px" style="--checkbox-label-margin:5px;"
              :value="isAgreement" @change="changeHandle">
              <text style="color: #999;">同意</text>
            </van-checkbox>
            <text style="color: #FF4749;margin-left: 8rpx;" @click="toAgreeLook('/agreement/savings-server.html')">省钱卡会员服务协议</text>
          </view>
          <view class="pay_lab fl_center">安心保障 · 不自动续费</view>
        </view>
      </view>
  </view>
</view>
<noCreditsDia
  :isShow="isShowNoCreditsDia"
  @close="isShowNoCreditsDia = false"
></noCreditsDia>
<confirmDia
  :isShow="isShowAgree"
  @close="isShowAgree = false"
  @confirm="confirmBuyVipHandle"
></confirmDia>
</van-popup>
</template>

<script>
import cardContDom from '@/components/cardOpen/cardContDom.vue';
import confirmDia from '@/components/cardOpen/confirmDia.vue';
import noCreditsDia from '@/components/cardOpen/noCreditsDia.vue';
import swiperListCom from '@/components/cardOpen/swiperListCom.vue';

import { getImgUrl, toAgreeLook, warpRectDom } from '@/utils/auth.js';
import { mapGetters } from "vuex";

export default {
	props: {
		isShow: {
			type: Boolean,
			default: false
		}
	},
	components: {
		swiperListCom,
    noCreditsDia,
    confirmDia,
    cardContDom
	},
	data(){
		return {
			show: false,
			subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
			payBottomDomHeight: 0,
      isAgreement: false,
      isNotCredits: false,
      isShowNoCreditsDia: false,
      isShowAgree: false,
		}
	},
	computed: {
		...mapGetters(["userInfo", "cardPrice", "not_creditsPrice", "car_initPrice", "isAutoLogin"]),
    buyPrice() {
      if(this.isNotCredits) return Number(this.cardPrice) + Number(this.not_creditsPrice);
      return this.cardPrice;
    },
    carInitPrice() {
      if(this.isNotCredits) return Number(this.car_initPrice) + Number(this.not_creditsPrice);
      return this.car_initPrice;
    },
	},
	mounted() {
		setTimeout(async () => {
			const domBoxRes = await this.warpRectDom('payBottomDom');
			if(!domBoxRes) return;
			this.payBottomDomHeight = domBoxRes.height;
		}, 2000);
	},
	methods:{
    toAgreeLook,
    warpRectDom,
    popupClose() {
      this.$emit('close');
    },
    cancelHandle() {
      this.isNotCredits = false;
      this.$emit('cancel');
    },
    changeHandle(event) {
      this.isAgreement = event.detail;
    },
    changeNotCreditsHandle(event) {
      this.isNotCredits = event.detail;
    },
    confirmBuyVipHandle() {
      this.isAgreement = true;
      this.isShowAgree = false;
      this.buyVipHandle();
    },
    buyVipHandle() {
      if(!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
      if(!this.isAgreement) return this.isShowAgree = true;
      this.$emit('confirm', this.isNotCredits);
    },
		formatPrice(price) {
      price = Number(price).toString();
			if (!price) return;
			let splitPrice = price.split(".");
			return `
				<span style="font-weight:600;font-size: 24px">
          <span style="font-size: 13px;margin-right: -3px">¥</span>
				  ${splitPrice[0]}.<span style="font-size: 13px;">${splitPrice[1]}</span>
				</span>`;
		}
	}
}
</script>

<style lang="scss" scoped>
.cont_box {
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: scroll;
	border-radius: 32rpx 32rpx 0rpx 0rpx;
	background: #F5F6FA;
	position: relative;
	z-index: 0;
	padding-bottom: var(--padding);
	box-sizing: border-box;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/24627/667d197c2ff9a.png") 0 0 / cover;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 452rpx;
		z-index: -1;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
	}
	.close_box {
		width: 100%;
		height: 80rpx;
		position: sticky;
		top: 0;
		border-radius: 32rpx 32rpx 0rpx 0rpx;
		z-index: 1;
    font-size: 28rpx;
    text-align: left;
    color: #723e22;
    .close_cancel{
      padding-left: 32rpx;
    }
		.title_icon {
			width: 226rpx;
			height: 36rpx;
		}
		.close_box-icon {
			width: 48rpx;
			height: 48rpx;
			padding: 16rpx;
		}
	}
}
.card_top {
  margin: 14rpx 30rpx 0 32rpx;
  position: relative;
  padding: 48rpx 78rpx 48rpx 80rpx;
  z-index: 0;
  &::after {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24627/667d1bc5b6d9b.png") 0 0 / 100% 100%;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  &::before {
    content: '\3000';
    width: 750rpx;
    height: 194rpx;
    background: rgba(245,246,250,0.36);
    border-radius: 40rpx 40rpx 0rpx 0;
    position: absolute;
    left: 50%;
    top: 136rpx;
    transform: translateX(-50%);
    z-index: -1;
  }
  &-title {
    width: 190rpx;
    height: 46rpx;
  }
  &-icon {
    width: 174rpx;
    height: 140rpx;
    position: absolute;
    right: 26rpx;
    top: -14rpx;
  }
  .card_price {
    margin-top: 24rpx;
    font-size: 26rpx;
    color: #a98366;
    line-height: 36rpx;
    &-num {
      color: #F84842;
      font-size: 40rpx;
      font-weight: bold;
      margin: 0 8rpx;
      &::after {
        content: '元';
        font-size: 26rpx;
      }
    }
    &-box {
      color: #F84842;
      // &::before {
      //   content: '￥';
      //   font-weight: bold;
      //   display: inline;
      // }
    }
    &-init {
      text-decoration:  line-through;
      margin-left: 8rpx;
      color: #B79069;
    }
  }
}

.pay_bottom {
    position: fixed;
    z-index: 9;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
    .pay_open {
      background: #fff;
      border-radius: 40rpx 40rpx 0 0;
      overflow: hidden;
      padding-bottom: 20rpx;
      position: relative;
    }
    .pay_btn {
		height: 88rpx;
		margin: 36rpx 24rpx 16rpx;
		position: relative;
		z-index: 0;
		font-weight: 500;
		color: #652A08;
		border-radius: 40rpx 40rpx 0 0;
		background: #FEF5EB;
		border-radius: 44rpx;
		line-height: 88rpx;
		.pay_lab-img{
			position: absolute;
			width: 272rpx;
			height: 46rpx;
			top: -22rpx;
			left: 4rpx;
		}
		&-lab {
			font-size: 24rpx;
			margin: 4rpx 0 0 8rpx;
			opacity: .8;
		}
		.confirm_icon {
			height: 100%;
		}
		.pay_left {
			padding-left: 38rpx;
			&-lab {
				font-size: 24rpx;
				margin-left: 16rpx;
				opacity: .6;
			}
		}
    }
    .pay_lab{
      font-size: 26rpx;
      color: #333;
      line-height: 36rpx;
      &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24627/667d41328ab21.png") 0 0 / 100% 100%;
        width: 22rpx;
        height: 26rpx;
        margin-right: 10rpx;
        display: block;
      }
      .pay_safe{
        width: 20rpx;
        height: 26rpx;
        margin-right: 10rpx;
      }
    }
    .pay_agree {
      font-size: 26rpx;
      text-align: center;
      color: #aaaaaa;
      line-height: 36rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      white-space: nowrap;
    }
}
.pay_txt {
  margin: 0 24rpx;
}
.no_credits {
  position: relative;
  z-index: 0;
  &::before {
    content: '\3000';
    background: url("https://file.y1b.cn/store/1-0/24628/667e1a27ad1aa.png") 0 0 / 100% 100%;
    width: 100%;
    height: 246rpx;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
  &-checkbox {
    width: 100%;
    padding: 16rpx 40rpx;
    box-sizing: border-box;
  }
  &-img {
    width: 204rpx;
    height: 38rpx;
    margin-right: 16rpx;
  }
}
.gesture_icon-box{
  position: absolute;
  z-index: 0;
  right: -16rpx;
  bottom: -36rpx;
  width: 102rpx;
  height: 100rpx;
  &::before {
    content: "\3000";
    position: absolute;
    z-index: -1;
    width: 40rpx;
    height: 40rpx;
    top: 0;
    left: 0;
    border-radius: 50%;
    opacity: 0;
    animation: rippleAnimation 1s linear infinite;
    box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
  }
  &::after {
    content: "\3000";
    position: absolute;
    z-index: -1;
    width: 30rpx;
    height: 30rpx;
    top: 5rpx;
    left: 5rpx;
    border-radius: 50%;
    opacity: 0;
    animation: rippleCenterAnimation 1s linear infinite;
    box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
  }
  .gesture_icon {
    width: 70rpx;
    height: 70rpx;
    position: relative;
    transform: translate(16rpx, 16rpx);
    animation: gestureAnimation 1s linear infinite;
  }
}
@keyframes rippleAnimation {
  0% {
		transform: scale(1);
		opacity: 0;
	}
  30% {
		transform: scale(1);
		opacity: 0;
	}
	35% {
		transform: scale(1);
		opacity: 1;
	}
	60% {
		transform: scale(2);
		opacity: 0.5;
	}
  80% {
		transform: scale(2);
		opacity: 0;
	}
  100% {
		transform: scale(2);
		opacity: 0;
	}
}
@keyframes rippleCenterAnimation {
  0% {
		transform: scale(0);
		opacity: 0;
	}
  30% {
		transform: scale(0);
		opacity: 0;
	}
	35% {
		transform: scale();
		opacity: 1;
	}
	60% {
		transform: scale(1);
		opacity: 1;
	}
  80% {
		transform: scale(1);
		opacity: 0;
	}
  100% {
		transform: scale(1);
		opacity: 0;
	}
}
@keyframes gestureAnimation {
	0% {
    transform: translate(40rpx, 30rpx);
	}
	30% {
    transform: translate(16rpx, 16rpx);
	}
  80% {
    transform: translate(16rpx, 16rpx);
	}
	100% {
    transform: translate(40rpx, 30rpx);
	}
}
</style>
