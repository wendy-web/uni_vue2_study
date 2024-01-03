
<template>
<van-popup
    :show="isShow"
    @close="popupClose"
    position="bottom"
    custom-style="overflow: inherit; background: transparent; max-height:85vh;"
    round
    safe-area-inset-bottom
    :catchtouchmove="true"
    duration="5"
    :transition-appear="true"
>
<view :class="['detail_box', isScrollTop ? 'ani_bottom_active' : 'ani_Up_bottom_active']">
    <image class="close_icon" :src="imgUrl +'static/images/close_back.png'" mode="aspectFill" @click="popupClose"></image>
    <scroll-view
        :scroll-y="true"
        :scroll-top="scrollTopValue"
        @scroll="scrollHandle"
        class="detail_cont"
        @scrolltolower="scrollToLowerHandle"
    >
        <image class="dis_logo" src="https://file.y1b.cn/store/1-0/23817/64dde6e68eaa7.png" mode="widthFix"></image>
        <view class="cont_time">
            <view class="cd_txt">
                <van-count-down
                    @finish="countFinished"
                    :time="remainTime"
                    millisecond
                    use-slot
                    format="mm:ss"
                    @change="onChangeHandle"
                    style="--count-down-text-color:#fff;--count-down-font-size:26rpx;"
                    class="cd_time-con"
                    v-if="isGoDetail"
                >
                    <text class="item">{{ timeData.hours }}</text>:
                    <text class="item">{{ timeData.minutes }}</text>:
                    <text class="item">{{ timeData.seconds }}</text>
                    <text class="item_lab">{{isReadyStart ? '后开始' : '后结束'}}</text>
                </van-count-down>
                <view v-else>本轮捡漏已结束</view>
            </view>
            <view class="timer_lab">每天{{start_time}}-{{over_time}}开抢</view>
        </view>
        <view class="recharge_cont">
            <view class="cont_box">
                <view class="list_box" v-if="listData.length">
                    <view class="list_item fl_center"
                        v-for="(item, index) in listData" :key="index"
                        @click="couponDetailHandle(item)"
                    >
                        <van-image
                            width="220rpx"
                            height="220rpx"
                            :src="item.image"
                            use-loading-slot
                            class="item_left"
                            radius="24rpx"
                            use-error-slot
                        >
                            <van-loading slot="loading" type="spinner" size="20" vertical />
                            <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
                        </van-image>
                        <view class="item_right fl_col_sp_bt">
                            <view class="item_title txt_ov_ell1">{{item.goods_name}}</view>
                            <view class="price_pro">
                                <view class="repair_price">
                                    捡漏价<view class="repair_price-txt">¥{{ item.coupon_price }}</view>
                                </view>
                                <view class="fl_bet repair_nor">
                                    <view class="repair_nor-price">
                                        <view>日常价</view>
                                        <view style="color: #999">¥{{item.salePrice}}</view>
                                    </view>
                                    <view class="repair_nor-price">
                                        <view>恢复</view>
                                        <view style="color: #999">¥{{item.salePrice}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="loading_box">
            <van-loading size="14px" color="gray" v-if="isLoading">加载中...</van-loading>
            <view class="noMore_txt" v-else-if="!isScroll"> - 我也是有底线的 - </view>
        </view>
    </scroll-view>
    <repairConfirmDia
        :isShow="isShowDia"
        :startTime="start_time"
        :overTime="over_time"
        @close="isShowDia = false"
    ></repairConfirmDia>
</view>
</van-popup>
</template>
<script>
import repairConfirmDia from './repairConfirmDia.vue';
import goDetailsFun from '@/utils/goDetailsFun';
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { leakList } from '@/api/modules/allowance.js';
import { parseTime } from '@/utils/index.js';
import { mapGetters, mapMutations } from 'vuex';
import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
export default {
    mixins: [goDetailsFun], // 使用mixin
    computed: {
        ...mapGetters(['isAutoLogin']),
    },
    components:{
        repairConfirmDia
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            isShow: false,
            start_time: 0,
            over_time: 0,
            isGoDetail: false,
            isReadyStart: false,
            remainTime: 0,
            timeData: null,
            isShowDia: false,
            listData: [],
            pageNum: 1, // 页面num
            isScroll: true,
            isLoading: false,
            scrollTopValue: 0,
            isScrollTop: true
        }
    },
    methods: {
        ...mapMutations({
            setMiniProgram: "user/setMiniProgram",
        }),
        //倒计时结束
        countFinished(e) {
            this.updateRemainTime();
        },
        onChangeHandle(event) {
            let {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            } = event.detail;
            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds
            milliseconds = Math.floor(milliseconds/10);
            this.timeData = {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            }
        },
        async couponDetailHandle(item) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            if(!this.isGoDetail || this.isReadyStart) return this.isShowDia = true;
            const {
                lx_type,
                id,
                skuId,
                goods_sign,
                appid,
                path,
                positionId,
                has_coupon
            } = item;
            // 3乐刷 2京东 4拼多多 5: 深爱购
            if(lx_type == 3) return this.$go(`/pages/userModule/allowance/repairGet/detail?goods_id=${id}`);
            if(lx_type == 5) {
                this.setMiniProgram(lx_type);
                this.$openEmbeddedMiniProgram({
                    appId: appid,
                    envVersion:'trial',
                    path
                });
                return;
            }
            const params = { is_popover: 1 }
            let api = '';
            if (lx_type == 2) {
                api = bysubunionid;
                params.skuId = skuId;
                params.positionId = positionId;
                params.has_coupon = has_coupon || 0;
            } else {
                api = goodsPromotion;
                params.goods_sign = goods_sign;
            }
            const skuRes = await api(params);
            if (skuRes.code == 0) return this.$toast(skuRes.msg);
            const { type_id, jdShareLink, mobile_url } = skuRes.data;
            this.setMiniProgram(lx_type);
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                path: jdShareLink || mobile_url
            });
        },
        popupClose() {
            this.scrollTopValue = 0;
            this.isScrollTop = false;
            // setTimeout(() => {
                this.isShow = false;
                this.$emit('close');
            // }, 0);
        },
        popupShow() {
            this.isShow = true;
            this.isScrollTop = true;
            this.scrollTopValue = 1;
        },
        async init(){
            this.pageNum = 1;
            this.isScroll = true;
            this.isGoDetail = false;
            this.isReadyStart = false;
            this.listData = [];
            this.start_time = 0;
            this.over_time = 0;
            this.initGoodsTheme();
        },
        scrollHandle(event) {
            const {scrollLeft, scrollTop, scrollHeight, scrollWidth, deltaX, deltaY} = event.detail;
            // console.log('scrollTop', scrollTop);
            // this.scrollTopValue = scrollTop;
        },
        async initGoodsTheme() {
            if(this.isLoading) return;
            this.isLoading = true;
            const params = {
                page: this.pageNum,
                size: 10
            }
            leakList(params).then(res => {
                if(res.code != 1) return;
                const { list, leak,  total_count } = res.data;
                if (this.pageNum == 1) this.listData = [];
                this.listData = this.listData.concat(list);
                this.pageNum += 1;
                this.isLoading = false;
                this.popupShow();
                if(this.listData.length >= total_count) this.isScroll = false;
                if(!this.start_time || !this.over_time) {
                    this.start_time = leak.start_time;
                    this.over_time = leak.over_time;
                    this.updateRemainTime();
                }
            }).catch(error => {
                this.isLoading = false;
            });
        },
        updateRemainTime() {
            const currentDate = new Date();
            let cur_date = parseTime(currentDate, "{y}-{m}-{d}");
            const timestamp = currentDate.getTime(); // 当前时间戳
            let popover_start = cur_date + ' ' + this.start_time;
            let popover_over = cur_date + ' ' + this.over_time;
            const popover_startStamp = new Date(popover_start?.replace(new RegExp(/-/gm), '/')).getTime(); // 开始时间戳
            const popover_overStamp = new Date(popover_over?.replace(new RegExp(/-/gm), '/')).getTime(); // 结束时间戳
            // 在倒计时里
            if(timestamp >= popover_startStamp && timestamp <=popover_overStamp) {
                this.isGoDetail = true;
                this.isReadyStart = false;
                this.remainTime = popover_overStamp - timestamp;
                return;
            }
            const readyStartTime = popover_startStamp - 60*60*1000;
            // 倒计时预备的前一小时
            if(timestamp >= readyStartTime && timestamp <= popover_startStamp) {
                this.isGoDetail = true;
                this.isReadyStart = true;
                this.remainTime = popover_startStamp - timestamp;
                return;
            }
            this.isGoDetail = false;
        },
        scrollToLowerHandle(event) {
            if(!this.isScroll) return;
            this.initGoodsTheme();
        },
    }
}
</script>
<style lang="scss" scoped>
.detail_box {
    position: relative;
    height: 85vh;
    display: flex;
    flex-direction: column;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    // padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
    // /* 兼容 IOS<11.2 */
    // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
    box-sizing: border-box;
    .close_icon {
        width: 52rpx;
        height: 52rpx;
        flex: 0 0 52rpx;
        padding: 16rpx;
        margin: 0 24rpx 0rpx auto;
        display: block;
    }
    .recharge_cont {
        box-sizing: border-box;
    }
}
.detail_cont{
    border-radius: 48rpx 48rpx 0rpx 0rpx;
    position: relative;
    z-index: 0;
    flex: 1;
    overflow: scroll;
    box-sizing: border-box;
    &::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/23825/64e86c87dbfaf.png") 0 0 / 100% auto no-repeat;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 540rpx;
		z-index: -1;
	}
}
.cont_box {
  width: 100%;
  padding: 32rpx 24rpx 0;
  position: relative;
  z-index: 0;
  border-radius: 40rpx 40rpx 0 0;
  background: #fff;
  min-height: 220rpx;
  box-sizing: border-box;
}
.loading_box{
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .noMore_txt {
        font-size: 28rpx;
        padding: 30rpx 0;
        color: gray;
        text-align: center;
    }
}
.dis_logo {
    width: 330rpx;
    height: 38rpx;
    margin: 35rpx 35rpx 0;
}
.cont_time{
    padding: 72rpx 0 62rpx 90rpx;
    position: relative;
    z-index: 0;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/23817/64dde6469664f.png") 0 0 / 100% 100% no-repeat;
        width: 252rpx;
        height: 288rpx;
        position: absolute;
        right: 14rpx;
        top: -20rpx;
    }
  .repair_time-icon{
    width: 252rpx;
    height: 288rpx;
    position: absolute;
    right: 14rpx;
    top: -20rpx;
  }
  .cd_txt{
    font-weight: 600;
    font-size: 36rpx;
    color: #fff;
    .item{
      width: 40rpx;
      height: 40rpx;
      background: #d13b01;
      border-radius: 4rpx;
      text-align: center;
      line-height: 40rpx;
      margin: 0 8rpx;
      display: inline-block;
    }
    .item_lab{
      margin-left: 16rpx;
    }
  }
  .timer_lab{
    opacity: 0.8;
    font-size: 24rpx;
    color: #ffffff;
    line-height: 34rpx;
    margin-top: 20rpx;
    margin-left: 10rpx;
  }
}
.list_box {
  margin: auto;
  overflow: hidden;
  .list_item {
    width: 100%;
    background: #ffffff;
    border-radius: 40rpx;
    box-sizing: border-box;
    margin-bottom: 48rpx;
    .item_left {
      width: 220rpx;
      height:220rpx;
      border-radius: 24rpx;
      margin-right: 25rpx;
      flex: 0 0 220rpx;
    }
    .item_right{
      width: calc(100% - 245rpx);
      align-self: stretch;
      .item_title {
        font-size: 28rpx;
        font-weight: 600;
        color: #333333;
        line-height: 40rpx;
      }
      .price_pro{
        text-align: center;
        font-size: 20rpx;
        position: relative;
        padding-right: 175rpx;
        &::after {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/23117/654a036ae3133.png") 0 0 / 100% 100% no-repeat;
            width: 114rpx;
            height: 56rpx;
            position: absolute;
            right: 0;
            bottom: 0;
        }
        .repair_price{
            opacity: 0.7;
            font-size: 20rpx;
            color: #e12803;
            line-height: 28rpx;
            position: relative;
            z-index: 0;
            opacity: 0.7;
            &::before {
                content: '\3000';
                background: url("https://file.y1b.cn/store/1-0/23117/654a048126eb0.png") 0 0 / 100% 100% no-repeat;
                width: 86rpx;
                height: 94rpx;
                position: absolute;
                z-index: -1;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
            }
            .repair_price-txt{
              font-size: 26rpx;
              font-weight: 600;
              opacity: 1;
              line-height: 36rpx;
            }
          }
          .repair_nor{
            opacity: 0.7;
            color: #333333;
            line-height: 28rpx;
            position: relative;
            z-index: 0;
            margin-top: 25rpx;
            &::before {
                content: '\3000';
                background: url("https://file.y1b.cn/store/1-0/23824/64e6b5b6cf916.png") 0 0 / 100% 100% no-repeat;
              width: 232rpx;
              height: 50rpx;
              position: absolute;
              z-index: -1;
              top: -25rpx;
              left: 50%;
              transform: translateX(-50%);
            }
        }
      }
    }
  }
}
</style>
