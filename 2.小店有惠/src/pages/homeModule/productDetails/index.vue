<template>
  <view class="product-details">
    <view class="product-details-top">
      <!-- 导航 -->
      <view
        class="nav-back"
        :style="{ height: navBarHeight + 'px', top: topHeight + 'px' }"
        @click="navBack"
      >
        <image
          class="nav-back-icon"
          src="../static/left_icon.png"
          mode="aspectFill"
        />
      </view>
      <!-- 展示图片 -->
      <view class="swiper-wrap">
        <channel-video
            :style="{width:screenWidth+'px',height:screenWidth+'px'}"
            object-fit="contain" autoplay loop
            :feed-id="config.video_account_id"
            :finder-user-name="config.video_id"
            @error="sphError"
            v-if="config.video_account_id"
        >
					<!-- 商品图片 -->
					<van-image
						@click="openSph()"
						:width="screenWidth+'px'"
						:height="screenWidth+'px'"
						:src="config.picList[0]"
						use-loading-slot
					>
						<van-loading slot="loading" type="spinner" size="20" vertical />
					</van-image>
				</channel-video>
        <swiper class="swiper" v-else
          :current="current" circular>
          <swiper-item v-for="(item, index) in config.picList" :key="index">
            <van-image
              :width="screenWidth+'px'"
              :height="screenWidth+'px'"
              :src="item"
              use-loading-slot
              fit="cover"
            >
              <van-loading slot="loading" type="spinner" size="20" vertical />
            </van-image>
          </swiper-item>
        </swiper>
      </view>
      <!-- 当前页显示 -->
      <view class="custom-indicator" v-if="(this.config.picList.length && !config.video_account_id) > 1">{{ indicator }}</view>
    </view>
    <!-- 商品基本信息 -->
    <view class="goods-basic">
      <view class="basic_title">
        <view class="basic_title-txt">
          <!-- 兑换商品 - 乐刷商品 -->
          <view class="price" v-if="productType">
            <text class="deduction_credits">{{ config.deduction_credits}}积分</text>
            <text class="deduction_label">官方价：¥{{ config._price }}</text>
          </view>
          <!-- 价格 -->
          <view class="price" v-else>
            <text class="price-prefix">¥</text>
            <text class="price-val">{{ config._price.split(".")[0] }}</text>
            <text class="price-float">.{{ config._price.split(".")[1] }}</text>
            <text class="price-label">[官方价]</text>
          </view>
          <!-- 商品名称 -->
          <view class="goods-name">{{ config.goods_name }}</view>
        </view>
         <!-- 收藏 -->
        <view class="is-collect" @click="collect">
          <van-icon
            v-if="config.is_collect === 1"
            name="star"
            size="36rpx"
            color="#FFC654"
          />
          <van-icon v-else name="star-o" size="36rpx" color="#979797" />
          <view>{{ config.is_collect ? "已收藏" : "未收藏" }}</view>
        </view>
      </view>
      <!-- 积分抵扣 积分不足-->
      <view class="point-deduc-not border-b" v-if="pointNot">
        <text>积分抵扣</text>
        <text>积分不足</text>
      </view>
      <!-- 积分抵扣 -->
      <view class="point-deduc border-b" v-if="pointDeduc">
        <view class="point-deduc-left">
          <van-icon size="28rpx" color="#AAAAAA" name="passed" />
          <span class="point-deduc-num">
            积分抵扣({{ config.deduction_credits }}积分)
          </span>
        </view>
        <view class="point-deduc-right">
          已抵{{ config._deduction_price }}元
        </view>
      </view>
    </view>
    <!-- 直充显示 -->
    <view class="recharge-account" v-if="config.goods_type === 0">
      <view class="recharge-account-title">充值账号<span class="required">*</span></view>
      <van-field
        :value="cz_number"
        :placeholder="placeholderText"
        :maxlength='config.cz_type == 1 ? 11 : -1'
        custom-style="padding:20rpx 0 8rpx 0;font-size:32rpx;font-weight: 500;color:#333333;"
        placeholder-style="color:#aaaaaa;font-size:32rpx;font-weight: 500;"
        type="number"
        @change="fieldChange"
      />
    </view>
    <!-- 购买须知 -->
    <view class="uparse-item" v-if="config.goods_explain">
      <view class="uparse-item-title">购买须知</view>
      <u-parse
        :content="config.goods_explain"
        @preview="preview"
        @navigate="navigate"
      ></u-parse>
    </view>
    <!-- 商品详情 -->
    <view class="uparse-item" v-if="config.goods_details">
      <view class="uparse-item-title">商品详情</view>
      <u-parse
        :content="config.goods_details"
        @preview="preview"
        @navigate="navigate"
      ></u-parse>
    </view>
    <!-- 底部付款 -->
    <view class="buy-box van-submit-bar-safe">
      <view class="buy-content van-submit-bar-safe">
        <view class="buy-content-left" v-if="!productType">
          <text class="buy-label" v-if="config.deduction_price > 0">优惠¥{{ config._deduction_price }}，</text>
          <text class="buy-label">应付：</text>
          <text class="buy-prefix">¥</text>
          <text class="buy-val">{{ showPrice.split(".")[0] }}</text>
          <text class="buy-float">.{{ showPrice.split(".")[1] }}</text>
        </view>
        <van-button
          type="danger"
          v-if="productType"
          @click="productHandle"
          :custom-style="btnStyle"
        >
        立即兑换
        </van-button>
        <van-button
          type="danger"
          v-else-if="userInfo.mobile || !isAutoLogin"
          @click="buyConfirm"
          :custom-style="btnStyle"
        >
          立即购买
        </van-button>
        <!-- 先获取手机号码 - 再进行购买 -->
        <van-button
          v-else
          type="danger"
          open-type="getPhoneNumber"
          @getphonenumber="buyBefore"
          :custom-style="btnStyle"
        >
          立即购买
        </van-button>
      </view>
    </view>
    <confirm-account ref="confirmAccount" @confirm="buy" />
    <price-change ref="priceChange" />
    <product-stop ref="productStop" />
    <!-- 新人专享188弹窗 -->
    <pointUpgradeDia ref='pointUpgradeDia' @close='closeHandle'/>
    <!-- 牛金豆不足 -->
    <confirmDia
      :isShow="confirmDiaShow"
      @close="confirmDiaShow = false"
      @confirm="confirmHandle"
      :credits="userInfo.credits"
    ></confirmDia>
    <privacy ref="privacy"></privacy>
  </view>
</template>
<script>
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import { escape2Html } from "@/utils/index.js";
import { mapGetters, mapActions } from "vuex";
import confirmAccount from "./confirmAccount.vue";
import confirmDia from "./confirmDia.vue";
import priceChange from "./priceChange.vue";
import productStop from "./productStop.vue";
import { goodsXq } from "@/api/modules/home.js";
import { createOrder } from "@/api/modules/order.js";
import { doCollect } from "@/api/modules/mine.js";
import goDetailsFun from '@/utils/goDetailsFun';
//pages 参数
let _options = null;
export default {
  mixins: [goDetailsFun],
  components: {
    confirmAccount,
    priceChange,
    productStop,
    confirmDia
  },
  data() {
    return {
      btnStyle: 'width:212rpx;height:98rpx;font-size: 32rpx;font-weight: 600;background:#EF2B20;border:none',
      current: 0,
      navBarHeight: 0,
      topHeight: 0,
      config: {
        picList: [],
        _price: "0.00",
        sale_price: "0.00",
        price: 0,
        goods_type: 1,
      },
      cz_number: "",
      placeholderText: '',
      screenWidth: 375,
      confirmDiaShow: false,
      is_popover: 0, // 是否扣取积分的标识
    };
  },
  computed: {
    ...mapGetters(["userInfo", 'isAutoLogin']),
    indicator() {
      return `${this.current + 1}/${this.config.picList.length}`;
    },
    showPrice(){
      const price = this.pointNot ? this.config._price : this.config.sale_price;
      return price;
    },
    //积分不足
    pointNot() {
      return (
        this.config.deduction_price === -1 ||
        this.config.deduction_credits === -1
      );
    },
    // 显示积分抵扣明细
    pointDeduc() {
      return (
        this.config.deduction_price > 0 &&
        this.config.deduction_credits > 0 &&
        !this.config.type
      );
    },
    productType() {
      return this.config.type;
    }
  },
  onShow() {
    this.$refs.privacy.LifetimesShow();
  },
  onLoad(options) {
    _options = options;
    if(options.is_popover) {
      this.is_popover = Number(options.is_popover);
    }
    getNavbarData().then((res) => {
      let { navBarHeight, statusBarHeight } = res;
      this.navBarHeight = navBarHeight;
      this.topHeight = statusBarHeight;
    });
    let system = uni.getSystemInfoSync()
		this.screenWidth = system.screenWidth || 375;

    //获取商品详情
    this.init();
  },
  onShareAppMessage(data) {
    let {
      goods_name,
      picList,
      id,
    } = this.config;
    let share = {
      title: goods_name,
      imageUrl: picList[0],
      path: `/pages/homeModule/productDetails/index?id=${id}`
    }
    return share;
  },
  methods: {
    ...mapActions({
      updateMobile: "user/updateMobile",
      getUserInfo: 'user/getUserInfo',
    }),
    init() {
      goodsXq({ id: _options.id }).then((res) => {
        /**处理数据 */
        let {
          goods_explain,
          goods_details,
          price,
          deduction_price,
          sale_price,
        } = res.data;
        //设置详情
        this.config = {
          ...res.data,
          _price: (Number(price) / 100).toFixed(2),
          _deduction_price: (Number(deduction_price) / 100).toFixed(2),
          sale_price: (Number(sale_price) / 100).toFixed(2),
          goods_explain: escape2Html(goods_explain),
          goods_details: escape2Html(goods_details),
        };
        this.placeholderText = this.config.cz_type_intro || '请输入账号';
      });
    },
    fieldChange(event) {
        this.cz_number = event.detail;
    },
    buyBefore(e) {
        if(!this.isAutoLogin) return this.$go('/pages/login/index');
        if(e.detail.code) {
            this.updateMobile({ code: e.detail.code }).then(() => {
            /**更新成功直接发起兑换 */
            this.buyConfirm();
            });
            return;
        }
        // 拒绝授权手机号
        this.buyConfirm();
    },
    // 验证手机号码的正则
    isPhoneReg(num){
      var num_reg = /^1\d{10}$/;
      if(!num_reg.test(num)){
        return false;
      }
      return true;
    },
    buyConfirm() {
        if(!this.isAutoLogin) return this.$go('/pages/login/index');
        let { goods_type, cz_type } = this.config;
        let cz_number = this.cz_number.replace(/\s/g, "");
        if (goods_type === 0) {
            if (!cz_number) {
            return uni.showToast({ title: "充值账号不能为空", icon: "none" });
            }
            if (!/^[A-Za-z0-9]+$/.test(cz_number)) {
            return uni.showToast({ title: "充值账号不符合规范", icon: "none" });
            }
            // 手机号码的类型判断
            if(cz_type == 1 && !this.isPhoneReg(cz_number)) {
            return uni.showToast({ title: "请输入正确的手机号码", icon: "none" });
            }
            this.$refs.confirmAccount.show(cz_number);
            return;
        }
        this.buy();
    },
    buy() {
      let {
        id: goods_id,
        price,
        deduction_price,
        deduction_credits,
      } = this.config;
      //下单
      createOrder({
        goods_id,
        cz_number: this.cz_number.replace(/\s/g, ""),
        price,
        deduction_price,
        deduction_credits,
        is_popover: this.is_popover
      }).then((res) => {
        if (res.code == 1) {
            this.getUserInfo();
          let { jspay_info, order_id } = res.data;
          jspay_info = JSON.parse(jspay_info);

          uni.requestPayment({
            nonceStr: jspay_info.nonceStr,
            package: jspay_info.package,
            paySign: jspay_info.paySign,
            signType: jspay_info.signType,
            timeStamp: jspay_info.timeStamp,
            success: (res) => {
              // 支付成功 —— 在详情页打开支付成功的模态窗口
              uni.redirectTo({
                url: `/pages/mineModule/orderDetail/index?id=${order_id}&payStatus=true`,
              });
              // 跳转支付详情 - 成功
              // uni.navigateTo({
              //   url: "/pages/payStatus/index?order_id=" + order_id,
              // });
            },
            fail: (err) => {
              if (/cancel/g.test("requestPayment:fail cancel")) {
                //跳转订单列表
                uni.redirectTo({
                  url: "/pages/mineModule/order/index?activeTab=0",
                });
                return uni.showToast({
                  title: "您取消了支付操作",
                  icon: "none",
                });
              }
              //其它提示
              uni.showModal({
                title: "温馨提示",
                content: err.errMsg,
                showCancel: true,
              });
            },
          });

          return;
        }
        //商品信息变更
        if (res.code == 2) {
          this.init();
          return this.$refs.priceChange.show();
        }
        //商品信息变更
        if (res.code == 3) {
          return this.$refs.productStop.show();
        }

        uni.showToast({
          title: res.msg,
          icon: "none",
        });
      });
    },
    collect() {
        if(!this.isAutoLogin) return this.$go('/pages/login/index');
        doCollect({ goods_id: this.config.id }).then((res) => {
            this.init();
            uni.showToast({ title: res.msg, icon: "none" });
        });
    },
    navBack() {
      uni.navigateBack({
        fail() {
          uni.reLaunch({ url: "/pages/home/index" });
        },
      });
    },
    // 立即兑换
    productHandle() {
        if(!this.isAutoLogin) return this.$go('/pages/login/index');
      const type = this.productType;
      let {
          type_id,
          type_sid,
          is_main,
          article_url,
          main_url,
          video_id,
          video_account_id,
          qz_url,
          open_mini_type,
          deduction_credits
      } = this.config;
      console.log('this.userInfo :>> ', this.userInfo.credits, deduction_credits);
      // 积分不足兑换时
      if (this.userInfo.credits < deduction_credits) {
          this.confirmDiaShow = true;
          return;
      }
      switch (type) {
        //公众号
        case 1:
            let link = is_main === 1 ? article_url : main_url;
            uni.navigateTo({
                url: `/pages/webview/index?link=${encodeURIComponent(link)}`
            });
            break;
        case 2:
            //视频号
            if (wx.openChannelsActivity) {
                wx.openChannelsActivity({
                    finderUserName: video_id,
                    feedId: video_account_id,
                    complete(res) {
                        console.log(res);
                    }
                });
            } else {
                wx.showModal({
                    icon: 'none',
                    title: '当前微信版本过低',
                    content: '升级后再使用,微信版本要求>=8.0.10'
                });
            }
            break;
        case 3:
            // 小程序
            let openMiniProgram = wx.navigateToMiniProgram;
            if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                openMiniProgram = wx.openEmbeddedMiniProgram;
            }
            console.log('tiaoz :>> ', type_id, type_sid);
            openMiniProgram({
                appId: type_id,
                path: type_sid,
                // envVersion: 'trial',
                success(res) {
                    // 打开成功
                }
            });
            break;
        case 5:
            // 千猪外链 _暂无
            if (qz_url) {
                uni.navigateTo({
                    url: `/pages/webview/index?link=${encodeURIComponent(qz_url)}`
                });
            }
            break;
        default:
            break;
      }
    },
    sphError(err) {
      console.log("视频号err：", err);
    },
    confirmHandle() {
      this.confirmDiaShow = false;
      uni.navigateTo({
        url: "/pages/mineModule/myCredit/index",
      });
    }
  },
};
</script>
<style lang="scss">
page {
  background-color: #f4f5f9;
}
.product-details {
  .product-details-top {
    width: 100%;
    height: 752rpx;
    position: relative;
  }
  .swiper-wrap {
    width: 100%;
    height: 752rpx;
  }
  .swiper {
    height: 100%;
    width: 100%;
  }
  .swiper-item {
    width: 100%;
    height: 100%;
    background-color: red;
  }
  .nav-back {
    position: fixed;
    left: 18px;
    display: flex;
    align-items: center;
    z-index: 1;
  }
  .nav-back-icon {
    width: 56rpx;
    height: 56rpx;
  }
  .custom-indicator {
    width: 94rpx;
    height: 50rpx;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 36px;
    position: absolute;
    bottom: 22rpx;
    right: 32rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    color: #ffffff;
  }
  .goods-basic {
    padding: 30rpx 24rpx 28rpx;
    background-color: #ffffff;
    position: relative;
    .basic_title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .basic_title-txt {
        flex: 1;
        .goods-name {
          font-size: 30rpx;
          color: #333333;
          margin-top: 14rpx;
        }
      }
      .is-collect {
        margin-right: 24rpx;
        font-size: 24rpx;
        text-align: center;
        color: #999999;
      }
    }
  }
  .price {
    color: #333333;
    font-weight: 500;
    .deduction_credits{
      font-size: 48rpx;
      font-family: Barlow, Barlow-Medium;
      font-weight: 500;
      color: #ef2b20;
      line-height: 58rpx;
      margin-right: 8rpx;
    }
    .deduction_label{
      font-size: 28rpx;
      text-decoration:  line-through;
      color: #999999;
      line-height: 40rpx;
    }
  }
  .price-prefix,
  .price-float {
    font-size: 32rpx;
  }
  .price-val {
    font-size: 48rpx;
  }
  .price-label {
    font-size: 28rpx;
    color: #ef2b20;
    margin-left: 16rpx;
  }
  .point-deduc-not {
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;
    padding-top: 25rpx;
  }
  .point-deduc {
    margin-top: 24rpx;
    padding-top: 25rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .point-deduc-num {
    font-size: 28rpx;
    color: #666666;
    margin-left: 8rpx;
  }
  .point-deduc-right {
    padding: 0 17rpx;
    height: 48rpx;
    border: 2rpx solid #ef2b20;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28rpx;
    color: #ef2b20;
  }

  .uparse-item {
    margin-top: 14rpx;
    padding: 32rpx 24rpx;
    background-color: #ffffff;
  }
  .uparse-item-title {
    font-size: 32rpx;
    color: #333333;
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;
    &::before {
      content: "";
      display: block;
      width: 4rpx;
      height: 26rpx;
      background-color: #ef2b20;
      border-radius: 2px;
      margin-right: 10rpx;
    }
  }
  .recharge-account {
    margin-top: 14rpx;
    padding: 32rpx 24rpx;
    background-color: #ffffff;
  }
  .recharge-account-title {
    font-size: 28rpx;
    color: #333333;
    font-weight: 500;
    .required {
      color: #ef2b20;
    }
  }
  .van-cell:after {
    left: 0;
    border-color: #e9e9e9;
  }

  .buy-box {
    width: 100%;
    height: 88rpx;
    margin-top: 14rpx;
  }
  .buy-content {
    position: fixed;
    bottom: 0;
    height: 88rpx;
    left: 0;
    right: 0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-left: 24rpx;
    font-size: 30rpx;
  }
  .buy-content-left {
    font-weight: 500;
    flex: 1;
  }
  .buy-label {
    color: #333333;
  }
  .buy-prefix,
  .buy-float,
  .buy-val {
    color: #ef2b20;
  }
  .buy-val {
    font-size: 48rpx;
  }
}
</style>
