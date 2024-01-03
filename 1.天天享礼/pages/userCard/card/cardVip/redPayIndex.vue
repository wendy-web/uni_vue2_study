<template>
<view class="card">
    <xh-navbar
        :leftImage="imgUrl + '/static/images/left_back.png'"
        @leftCallBack="$topCallBack"
        :fixed="true"
        title="省钱卡红包"
        titleColor="#333"
        :navberColor="isShowNavBerColor ? '#FDE8B9': ''"
    ></xh-navbar>
    <image :src="cardVip_bgImg" :style="{ '--margin': navHeight + 'px' }" mode="widthFix"  class="nav_bg"></image>
    <!-- 未开通 -->
    <onOpenPacket
        :saving_money="saving_money"
        :isDisCheckbox="isDisCheckbox"
        :isSelectRedPacket="isOpenSelectRedPacket"
        @change="openChangeSelHandle"
        v-if="!is_vip"
    ></onOpenPacket>
    <!-- 加量包 -->
    <onOpenPacket
        :saving_money="saving_money"
        :isDisCheckbox="isDisCheckbox"
        :isSelectRedPacket="isSelectRedPacket"
        :isShowFeature="false"
        :packNum="dosingArr.dosing_packet_num"
        v-else-if="dosingArr.dosing_packet_num"
        @change="changeSelHandle"
    ></onOpenPacket>
    <featureCom v-if="!is_vip"></featureCom>
    <view
        :class="['use_box', isShowCardTop ? 'active' : '', !is_vip ? 'white_bg' : '', isScrollBox ? 'set_height' : '']"
        :style="{ '--useheight': useHeight }"
        v-if="isContPack"
    >
        <image :src="cardImgUrl + 'use_box.png'" mode="widthFix" class="bg_img" v-if="isShowCardTop"></image>
        <scroll-view :scroll-y="isScrollBox" class="detail_cont">
            <!-- 加量包的呈现 -->
            <itemPacket
              :packNum="dosingArr.dosing_packet_num"
              :packTime="dosingArr.time"
              :isDisCheckbox="isDisCheckbox"
              v-if="!is_vip && dosingArr.dosing_packet_num"
            ></itemPacket>
            <block v-if="isListPack">
                <view class="use_title" style="background-color: ; margin-top: 32rpx;">已为你选定最大优惠</view>
                <view class="use_red-box">
                    <block v-for="(itemHas, indexHas) in useArr" :key="indexHas">
                        <itemUsePacket
                            :itemHas="itemHas"
                            :isSelectRedPacket="isSelectRedPacket"
                            :isDisCheckbox="isDisCheckbox"
                            @change="changeSelHandle"
                        ></itemUsePacket>
                    </block>
                    <itemHasPacket :havArr="havArr"></itemHasPacket>
                </view>
            </block>
        </scroll-view>
    </view>
    <!-- 支付 -->
    <view class="pay_bottom">
        <view class="pay_btn fl_bet" @click="confirmHandle">
            <image :src="cardImgUrl + 'pay_btn1.png'" mode="scaleToFill" class="bg_img" ></image>
            <view class="pay_left box_fl_end">
                红包优惠
                <view v-html="formatPrice(isSelectRedPacket ? saving_money : 0, 2)" class="pay_left-price"></view>
                <!-- <text style="color: #999; font-size: 24rpx" v-if="!userInfo.is_vip">
                    开通省钱卡 ¥3.90
                </text> -->
            </view>
            <view class="pay_right">确认</view>
        </view>
        <view class="pay_agree">
            同意 <text style="color: #fe9433" @click="toAgreeLook('/agreement/savings-server.html')">
            《省钱卡会员服务协议》</text>
        </view>
    </view>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from "@/utils/getViewPort.js";
import { getImgUrl, formatPrice, toAgreeLook } from "@/utils/auth.js";
import onOpenPacket from '../component/onOpenPacket.vue';
import featureCom from '../component/featureCom.vue';
import itemPacket from '../component/itemPacket.vue';
import itemUsePacket from '../component/itemUsePacket.vue';
import itemHasPacket from '../component/itemHasPacket.vue';
import { mapGetters, mapMutations } from "vuex";
import {
    simulatePacket,
} from '@/api/modules/packet.js';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        onOpenPacket,
        itemPacket,
        itemUsePacket,
        itemHasPacket,
        featureCom
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
            isShowNavBerColor: false,
            isSelectRedPacket: true,
            isOpenSelectRedPacket: true,
            isHidden: true,
            ly_type: 0,
            saving_money: 0,
            is_vip: 0,
            havArr: [],
            useArr: [],
            dosingArr: null, // 加量包的呈现
            subjectColor: "#FFECBD",
        };
    },
    computed: {
        ...mapGetters(["userInfo", 'isSelRedPacket', 'isSelNewPacket']),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        cardVip_bgImg() {
            let url = "redPayIndex_bg.png";
            return `${this.cardImgUrl}${url}`;
        },
        isDisCheckbox() {
            return this.ly_type != 0;
        },
        isShowCardTop(){
            return this.is_vip && this.dosingArr.dosing_packet_num;
        },
        isScrollBox(){
            return this.is_vip && !this.dosingArr.dosing_packet_num;
        },
        useHeight() {
            let viewPort = getViewPort();
            let useHeight = viewPort.windowHeight - viewPort.navHeight;
            return useHeight + 'px';
        },
        isListPack() {
            const isListPack = this.useArr.length || this.useArr.length
            return isListPack
        },
        isContPack() {
            let isContPack = this.isListPack;
            if(this.dosingArr && !isContPack) {
                isContPack = !this.is_vip && dosingArr.dosing_packet_num;
            }
            return isContPack;
        }

    },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
    if(option.saving_money) {
        this.saving_money = option.saving_money;
        this.ly_type = option.ly_type;
    }
    this.init()
  },
  methods: {
    ...mapMutations({
        setSelRedPacket: 'user/setSelRedPacket',
        setSelNewPacket: 'user/setSelNewPacket'
    }),
    formatPrice,
    toAgreeLook,
    async init(page) {
        const res = await simulatePacket({
            saving_money: this.saving_money,
            ly_type: this.ly_type
        });
        if(res.code != 1) return;
        const { is_vip, dosingArr, havArr, useArr } = res.data;
        this.is_vip = is_vip;
        // this.is_vip = 0;
        this.isHidden = !this.is_vip;
        this.dosingArr = dosingArr;
        // this.dosingArr = {};
        this.havArr = havArr;
        this.useArr = useArr;
    },
    confirmHandle() {
        // 千猪与海威 - 直接返回上一页
        if(this.ly_type != 0) return this.$topCallBack();
        this.setSelRedPacket(this.isSelectRedPacket);
        if(!this.userInfo.is_vip) this.setSelNewPacket(this.isOpenSelectRedPacket);
        this.$topCallBack();
    },
    onPageScroll(event) {
        const scrollTop = Math.ceil(event.scrollTop);
        // console.log('scrollTop :>> ', scrollTop, this.navHeight);
        if(scrollTop >= this.navHeight) {
            this.isShowNavBerColor = true;
            return;
        }
        this.isShowNavBerColor = false;
    },
    changeSelHandle(isCheck) {
        this.isSelectRedPacket = isCheck;
        if(isCheck){
            this.isOpenSelectRedPacket = isCheck;
        }
    },
    openChangeSelHandle(isCheck) {
        this.isOpenSelectRedPacket = isCheck;
        this.isSelectRedPacket = isCheck;
    },
  },
};
</script>
<style lang="scss">
page {
    background-color: #f5f6fa;
}
.card {
  position: relative;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  box-sizing: border-box;
  // padding-bottom: constant(safe-area-inset-bottom);
  // padding-bottom: env(safe-area-inset-bottom);
  &::before {
    content: "\3000";
    position: absolute;
    top: 0;
    left: 0;
    width: 750rpx;
    height: 698rpx;
    opacity: 0.65;
    background: linear-gradient(135deg, #fdde99, #f7d27d);
    filter: blur(46rpx);
  }
  .nav_bg {
    width: 542rpx;
    height: 314rpx;
    position: absolute;
    right: 0;
    z-index: -1;
    margin-top: calc(18rpx - var(--margin));
  }
}
.card_top-btn {
  width: 140rpx;
  height: 60rpx;
}
.nick_cont {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  line-height: 40rpx;
  margin-left: 20rpx;
  .nick_lab {
    font-size: 24rpx;
    font-weight: 400;
    color: #666;
    line-height: 34rpx;
  }
}
.card_cont {
  background: #fff;
  padding: 72rpx 24rpx 0;
  margin-top: -18rpx;
}
.sel_item {
  position: relative;
  z-index: 0;
  width: 218rpx;
  height: 312rpx;
  font-size: 28rpx;
  text-align: center;
  color: #333;
  &.active {
    .item_price {
      color: #f84842;
    }
    .price_value {
      color: #b07851;
      font-weight: 500;
    }
  }
  .item_time {
    margin: 32rpx auto 10rpx;
    font-weight: 500;
    line-height: 40rpx;
  }

  .price_value {
    position: absolute;
    bottom: 8rpx;
    width: 100%;
    text-align: center;
    left: 0;
  }
}
.lab_title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  line-height: 44rpx;
  margin-top: 64rpx;
  margin-bottom: 24rpx;
}
.red_lab {
  font-size: 26rpx;
  color: #999;
  line-height: 36rpx;
  margin: 25rpx 0 32rpx;
  .red_av {
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    margin-right: 8rpx;
  }
}
.car_red {
  background: linear-gradient(180deg, #ffffff, #f5f6fa 19%);
  border-radius: 40rpx;
  padding: 0 24rpx;
  overflow: hidden;
  .lab_title {
    margin-top: 40rpx;
  }
  .car_red-cont {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    .red_cont-title {
      font-size: 28rpx;
      font-weight: 600;
    }
    .red_cont-right {
      font-size: 26rpx;
      color: #aaaaaa;
    }
  }
}
.car_open-lab {
  font-size: 26rpx;
  color: #333;
  margin-top: 6rpx;
  position: relative;
  z-index: 0;
  &::before {
    content: "\3000";
    position: absolute;
    width: 228rpx;
    height: 16rpx;
    background: rgba(255, 255, 255, 0.4);
    bottom: 0;
    z-index: -1;
    left: 50%;
    transform: translateX(-50%);
  }
}
.pay_lab {
  font-size: 26rpx;
  color: #999;
  line-height: 36rpx;
  margin-top: 20rpx;
  .pay_safe {
    width: 20rpx;
    height: 26rpx;
    margin-right: 10rpx;
  }
}
.pay_bottom {
  position: fixed;
  z-index: 9;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 16rpx 24rpx;
  border-radius: 40rpx;
  background: rgba($color: #fff, $alpha: 1);
  overflow: hidden;
  padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
  .pay_btn {
    width: 702rpx;
    height: 92rpx;
    position: relative;
    z-index: 0;
    font-weight: 600;
    text-align: center;
    color: #fff;
  }
  .pay_left {
    font-size: 28rpx;
    color: #652a08;
    margin-left: 28rpx;
    line-height: 40rpx;
  }
  .pay_right {
    font-size: 32rpx;
    margin-right: 64rpx;
  }

  .pay_left-price {
    margin: 0 12rpx;
  }
  .pay_agree {
    font-size: 26rpx;
    text-align: center;
    color: #aaaaaa;
    line-height: 36rpx;
    margin-top: 16rpx;
  }
}
.use_box {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    z-index: 0;
    padding: 0 24rpx;
    padding-bottom: calc(168rpx + constant(safe-area-inset-bottom));
    /* 兼容 IOS<11.2 */
    padding-bottom: calc(168rpx + env(safe-area-inset-bottom));
    overflow: hidden;
    transition: all 0.3s;
    &::before {
        content: '\3000';
        width: 750rpx;
        height: 930rpx;
        background: linear-gradient(180deg,#ffffff, #f5f6fa 31%);
        border-radius: 40rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        border-radius: 32rpx;
    }
  &.white_bg{
    padding-top: 40rpx;
    margin-top: -40rpx;
  }
  &.active {
    &::before {
        background: transparent;
    }
    margin-top: -32rpx;
  }
  &.set_height {
    height: var(--useheight);
  }
  .detail_cont {
    height: 100%;
  }
  .use_title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    line-height: 44rpx;
    margin-bottom: 24rpx;
  }
}
.use_red-box{
    overflow: hidden;
}
.check_box {
  margin-top: 32rpx;
}
</style>