<template>
<view class="repair">
<mescroll-body
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  @up="upCallback"
  :up="upOption"
  :down="downOption"
>
<xh-navbar
  :leftImage="imgUrl+'static/images/arrow_left.png'"
  @leftCallBack="$topCallBack"
  :fixed="true"
  :navberColor="isShowNavBerColor ? subjectColor: ''"
  :fixedNum="9"
>
<view slot="title" class="dis_title">
  <image class="dis_logo" src="https://file.y1b.cn/store/1-0/23817/64dde6e68eaa7.png" mode="widthFix"></image>
</view>
</xh-navbar>
  <image src="https://file.y1b.cn/store/1-0/23825/64e86c87dbfaf.png" mode="widthFix" class="nav_bg">
  </image>
  <view class="cont_time">
    <image src="https://file.y1b.cn/store/1-0/23817/64dde6469664f.png" mode="widthFix" class="repair_time-icon"></image>
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
          <text class="item">{{ timeData.hours }}</text>
          :
          <text class="item">{{ timeData.minutes }}</text>
          :
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
          v-for="(item, index) in listData"
          :key="index"
          @click="couponDetailHandle(item)"
        >
          <image :src="item.image" mode="scaleToFill" class="item_left"></image>
          <view class="item_right fl_col_sp_bt">
            <view class="item_title txt_ov_ell1">{{item.goods_name}}</view>
            <view class="price_pro box_fl_end">
              <view class="item_price">
                <view class="repair_price">
                  <image src="https://file.y1b.cn/store/1-0/23117/654a048126eb0.png" mode="widthFix" class="repair_price-bg"></image>
                  捡漏价
                  <view class="repair_price-txt">¥{{ item.coupon_price }}</view>
                </view>
                <view class="fl_bet repair_nor">
                  <image src="https://file.y1b.cn/store/1-0/23824/64e6b5b6cf916.png" mode="widthFix" class="repair_pro"></image>
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
              <view class="item_btn fl_center">
                <image src="https://file.y1b.cn/store/1-0/23117/654a036ae3133.png" mode="widthFix" class="cou_btn"></image>
              </view>
            </view>
          </view>

        </view>
      </view>
    </view>
  </view>
</mescroll-body>
<confirmDia
  :isShow="isShowDia"
  :startTime="start_time"
  :overTime="over_time"
  @close="isShowDia = false"
></confirmDia>
</view>
</template>

<script>
import { leakList } from '@/api/modules/allowance.js';
import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { parseTime } from '@/utils/index.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapGetters, mapMutations } from 'vuex';
import confirmDia from './confirmDia.vue';
export default {
  mixins: [MescrollMixin, shareMixin], // 使用mixin
  components: {
    confirmDia
  },
  data() {
    return {
	      imgUrl: getImgUrl(),
        start_time: 0,
        over_time: 0,
        isGoDetail: false,
        isReadyStart: false,
        remainTime: 0,
        timeData: null,
        isShowDia: false,
        isShowNavBerColor: false,
        listData: [],
        subjectColor: '#F8470E',
        upOption: {},
        downOption: {}
    }
  },
  computed: {
    ...mapGetters(['isAutoLogin']),
    navHeight() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    }
  },
  watch: {
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
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
            has_coupon,
            is_flow
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
        if (is_flow == 2) {
          this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&isSearch=true`);
          return;
        }
        const { type_id, jdShareLink, mobile_url } = skuRes.data;
        this.setMiniProgram(lx_type);
        this.$openEmbeddedMiniProgram({
            appId: type_id,
            path: jdShareLink || mobile_url
        });
    },
    async upCallback(page) {
        let params = {
			    page: page.num,
          size: page.size
		    }
        leakList(params).then(res => {
          if(res.code != 1) return;
          const { list, leak,  total_count } = res.data;
          if(!this.start_time || !this.over_time) {
            this.start_time = leak.start_time;
            this.over_time = leak.over_time;
            this.updateRemainTime();
          }
          if (page.num == 1) this.listData = [];
					this.listData = this.listData.concat(list);
          this.mescroll.endBySize(this.listData.length, total_count);
        }).catch(error => {
            //联网失败, 结束加载
			    this.mescroll.endSuccess(0);
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
	onPageScroll(event) {
      const scrollTop = Math.ceil(event.scrollTop);
      if(scrollTop > 0) {
        this.isShowNavBerColor = true;
        return;
      }
      this.isShowNavBerColor = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.dis_title {
  position: absolute;
  left: 70rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.dis_logo {
  width: 330rpx;
  height: 38rpx;
}

.repair{
  position: relative;
  box-sizing: border-box;
  z-index: 0;
  // padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  // /* 兼容 IOS<11.2 */
  // padding-bottom: calc(10px + env(safe-area-inset-bottom));
  .nav_bg {
    width: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }
  .recharge_cont {
    box-sizing: border-box;
  }
}
.cont_time{
  padding: 72rpx 0 62rpx 90rpx;
  position: relative;
  z-index: 0;
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
.list_box {
  margin: auto;
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
        .item_price{
          font-size: 20rpx;
          flex: 1;
          .repair_price{
            opacity: 0.7;
            font-size: 20rpx;
            color: #e12803;
            line-height: 28rpx;
            // margin-top: 16rpx;
            position: relative;
            z-index: 0;
            opacity: 0.7;
            .repair_price-bg{
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
            .repair_pro{
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
      .item_btn{
        font-size: 0;
        margin-left: 61rpx;
        width: 114rpx;
        flex-shrink: 0;
        .cou_btn{
          width: 114rpx;
          height: 56rpx;
        }
      }
    }
  }
}
</style>
