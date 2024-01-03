<template>
<view class="recharge" :style="{'--bg': subjectColor}">
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
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$topCallBack"
  :fixed="true"
  :navberColor="isShowNavBerColor ? subjectColor: ''"
></xh-navbar>
  <image :src="configData.bg_img" mode="widthFix" class="nav_bg" id="navBgId" :style="{'--margin': navHeight + 'px' }">
  </image>
  <view class="recharge_cont">
    <view class="type_top fl_bet">
      <image src="https://file.y1b.cn/store/1-0/23817/64dde60e1c0e5.png" mode="scaleToFill" class="bg_img"></image>
      <image mode="aspectFit" class="type_top-icon"
        :src="configData.left_img"
        @click="openMiniProgramHandle('left')"
      ></image>
      <image mode="aspectFit" class="type_top-icon"
        :src="configData.right_img"
        @click="openMiniProgramHandle('right')"
      ></image>
    </view>
    <view class="cont_box">
      <view class="type_img-box" v-if="configData.img" @click="toImgHandle">
        <image :src="configData.img" mode="widthFix" class="type_img"></image>
      </view>
      <view class="list_box" v-if="listData.length">
        <view class="list_item fl_center"
          v-for="(item, index) in listData"
          :key="index"
          @click="couponDetailHandle(item)"
        >
          <image :src="item.image" mode="scaleToFill" class="item_left"></image>
          <view class="item_right fl_col_sp_bt">
            <view class="item_title-box">
              <view class="item_title txt_ov_ell1">{{item.title}}</view>
              <view class="item_lab">{{item.exch_user_num + item.user_num}}人兑换</view>
            </view>
            <view class="fl_bet">
              <view class="vip_box box_fl" v-if="userInfo.is_vip">
                0豆特权
                <image class="vip_img" :src="cardImgUrl + 'vip_box.png'" mode="scaleToFill"></image>
              </view>
              <view class="item_price fl_center" v-else>
                <text class="item_price-lab">{{item.credits}}</text>
                牛金豆
              </view>
              <view class="item_btn fl_center">
                <image src="https://file.y1b.cn/store/1-0/23118/654b2f7589cfa.png" mode="widthFix" class="cou_btn"></image>
              </view>
            </view>
          </view>

        </view>
      </view>
    </view>
  </view>
</mescroll-body>
<!-- 配置的弹窗管理 -->
<configurationDia
  ref="configurationDia"
  :isShow="isShowConfig"
  @close="closeShowConfig"
  :config="config"
  @popoverRember="requestPopoverRember"
  :remainTime="remainTime"
></configurationDia>
<!-- 优惠推荐商品的弹窗 -->
<recommendDia ref="recommendDia"></recommendDia>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import { getImgUrl } from '@/utils/auth.js';
import configurationDia from '@/components/configurationDia/index.vue';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import {
	takeList,
  takeCoupon,
  takePower
} from '@/api/modules/allowance.js';
import { parseTime } from '@/utils/index.js';
import { wxmsgid } from '@/api/modules/index.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { mapGetters } from 'vuex';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
export default {
  mixins: [MescrollMixin, goDetailsFun, configurationFun, shareMixin], // 使用mixin
  components: {
    configurationDia
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      cardImgUrl:`${getImgUrl()}static/card/`,
      configData: null,
      nav_bgTop: 0,
      isShowNavBerColor: false,
      listData: [],
      subjectColor: '#FFECBD',
      upOption: {
        textNoMore: '',
        empty: {
          use: false
        }
      },
      downOption: {
      }
    }
  },
  computed: {
    ...mapGetters([
        "userInfo",
    ]),
    mescrollHeight() {
      let viewPort = getViewPort();
      // uni.upx2px(142) 头部地址的内容 24位边距
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(142) - uni.upx2px(24);
      return mescrollHeight + 'px';
    },
    navHeight() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    }
  },
  watch: {
    nav_bg:{
      handler(newValue, oldValue) {
        setTimeout(async () => {
          const navBgRes = await this.warpRectDom('navBgId');
          this.nav_bgTop = navBgRes.height - this.navHeight;
        }, 2000);
      },
      immediate: true
    }
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
    this.init();
  },
  methods: {
    init() {
      takeList().then(res => {
        if(res.code != 1) return;
        const {
          bg_color
        } = res.data;
        this.configData = res.data;
        this.subjectColor = bg_color;
      })
    },
    async openMiniProgramHandle(type) {
      if(type == 'right') {
        this.toOpenMiniProgram(type);
        return;
      }
      let local_date = uni.getStorageSync('takePowerWxMsgId');
			let cur_date = parseTime(Date.now(), "{y}-{m}-{d}");
      // 今日授权过一次就不在授权
      if (local_date && cur_date == local_date) {
        this.toOpenMiniProgram(type);
        return;
      }
      const res = await wxmsgid();
      const accuentIds = res.data[1];
      if(!accuentIds) return;
      uni.requestSubscribeMessage({
        tmplIds: [accuentIds],
        complete: async (event) => {
          uni.setStorageSync('takePowerWxMsgId', cur_date);
          const resultState = event[accuentIds];
          const is_power = (resultState == 'accept') ? 1 : 0;
          await takePower({ is_power });
          this.toOpenMiniProgram(type);
        }
      });
    },
    toOpenMiniProgram(type){
      const open_mini_type_sid = `${type}_open_mini_type`;
      const appid_sid = `${type}_appid`;
      const path_sid = `${type}_path`;
      const appId = this.configData[appid_sid];
      const path = this.configData[path_sid];
      const open_mini_type = this.configData[open_mini_type_sid];
      const openMiniProgram = (open_mini_type == 2 ) ? this.$openEmbeddedMiniProgram : this.$navigateToMiniProgram;
      openMiniProgram({
        appId,
        path,
      });
    },
    toImgHandle() {
      const {
        jump_type,
        appid: appId,
        path,
        coupon_id
      } = this.configData;
      if(jump_type == 1) {
        this.$openEmbeddedMiniProgram({
          appId,
          path,
        });
        return;
      }
      this.redPacketFun(coupon_id);
    },
    couponDetailHandle(item) {
      this.detailsFun_mixins(item, {})
    },
    async upCallback(page) {
        let params = {
					page:page.num
				}
        takeCoupon(params).then(res => {
          if(res.code != 1) return;
          const { data } = res;
          //设置列表数据
          if (page.num == 1) {
            this.listData = []; //如果是第一页需手动制空列表
          }
          //填充数据
					this.listData = this.listData.concat(data.list);
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length, false);
        }).catch(error => {
          //联网失败, 结束加载
					this.mescroll.endSuccess(0);
        });
    },
		onPageScroll(event) {
      const scrollTop = Math.ceil(event.scrollTop);
      // console.log('scrollTop :>> ', scrollTop);
      if(scrollTop >= this.nav_bgTop) {
        this.isShowNavBerColor = true;
        return;
      }
      this.isShowNavBerColor = false;

    },
    warpRectDom(idName) {
			return new Promise(resolve => {
				setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
						// #endif
					query.select('#'+idName).boundingClientRect(data => {
						resolve(data)
					}).exec();
				}, 20)
			})
		},
  }
}
</script>

<style lang="scss">
page {
  background: #FFECBD;
}
.recharge{
  background: var(--bg);
  position: relative;
  box-sizing: border-box;
  // padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  // /* 兼容 IOS<11.2 */
  // padding-bottom: calc(10px + env(safe-area-inset-bottom));
  .nav_bg {
    width: 100%;
    margin-top: calc(0px - var(--margin));
  }
  .recharge_cont {
    box-sizing: border-box;
  }
}
.vip_box{
  font-size: 32rpx;
  font-weight: 500;
  color: #f84842;
  line-height: 44rpx;
  .vip_img{
      width: 126rpx;
      height: 38rpx;
      margin-left: 12rpx;
  }
}
.type_top{
  width: 686rpx;
  height: 444rpx;
  position: relative;
  margin: auto;
  z-index: 0;
  .type_top-icon{
    width: 50%;
    height: 444rpx;
    flex:  0 0 50%;
  }
}
.type_img-box{
  width: 686rpx;
  margin: auto;
  font-size: 0;
  .type_img{
    width: 100%;
  }
}
.cont_box {
  width: 100%;
  margin-top: 56rpx;
  padding-top: 32rpx;
  position: relative;
  z-index: 0;
  &::before {
    content: '';
    width: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    min-height: 618rpx;
    height: 100%;
    background: linear-gradient(180deg,rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.50) 37%);
    border-radius: 40rpx 40rpx 0 0;
  }
  padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  /* 兼容 IOS<11.2 */
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  // border-radius: 40rpx 40rpx 0 0;
  // background: linear-gradient(180deg,rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.50) 37%);

}
.list_box {
  width: 686rpx;
  margin: auto;
  margin-top: 24rpx;
  .list_item {
    width: 100%;
    height: 212rpx;
    background: #ffffff;
    border-radius: 40rpx;
    padding: 16rpx;
    box-sizing: border-box;
    margin-bottom: 24rpx;
    .item_left {
      width: 180rpx;
      height: 180rpx;
      border-radius: 24rpx;
      margin-right: 16rpx;
      flex: 0 0 180rpx;
    }
    .item_right{
      flex: 0 0 450rpx;
      width: 420rpx;
      align-self: stretch;
      .item_title-box {
        width: 100%;
      }
      .item_title{
        font-size: 28rpx;
        font-weight: 600;
        color: #333333;
        line-height: 40rpx;
      }
      .item_lab{
        font-size: 26rpx;
        color: #aaaaaa;
        line-height: 36rpx;
      }
      .item_price{
        font-size: 26rpx;
        text-align: center;
        color: #e7331b;
        line-height: 48rpx;
        .item_price-lab {
          font-size: 36rpx;
          font-weight: 500;
          margin-right: 8rpx;
        }
      }
      .item_btn{
        width: 132rpx;
        height: 62rpx;
        background: #f84842;
        border-radius: 12rpx;
        margin-right: 8rpx;
        .cou_btn{
          width: 84rpx;
          height: 38rpx;
        }
      }
    }
  }
}
</style>