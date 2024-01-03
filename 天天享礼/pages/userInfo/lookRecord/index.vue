<template>
<view class="my-collect">
    <mescroll-body
        ref="mescrollRef"
        height="100"
        @init="mescrollInit"
        @down="downCallback"
        @up="upCallback"
        :up="upOption"
        :down="downOption"
    >
      <view class="list-box">
        <view v-for="(dateItem, idx) in list" :key="idx">
          <view class="date_time">{{ dateItem.dateTime }}</view>
          <van-swipe-cell
            :right-width="84"
            v-for="(item, index) in dateItem.dateList"
            :key="index"
            :data-id="item.id"
            :data-item="item"
            async-close
            @click="goDetails($event, { listIndex: idx, index })"
            @close="onCloseHandle($event, idx, index)"
            @open="onOpenHandle($event, idx, index)"
          >
            <!-- 主要内容 -->
            <view class="list-item">
              <!-- <image class="list-icon" :src="item.image" mode="scaleToFill"></image> -->
                <view class="list-icon">
                    <van-image
                        height="240rpx"
                        width="240rpx"
                        radius="16rpx"
                        :src="item.image"
                        use-loading-slot
                        use-error-slot
                    >
                      <van-loading slot="loading" type="spinner" size="24" vertical />
                      <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
                    </van-image>
                </view>
              <view class="list-txt">
                <view class="list-item-title txt_ov_ell2">
                  <view class="jd_icon_box" v-if="item.lx_type != 1 && Number(item.face_value)">
                    <image class="bg_img" mode="scaleToFill"
                      :src="imgUrl + 'static/shopMall/jd_icon_bg.png'"
                    ></image>
                    抵¥{{parseInt(item.face_value)}}券
                  </view>
                  {{ item.title }}
                </view>
                <view class="list_cont">
                  <view class="list_cont-left">
                    <view
                      class="exchange-num"
                      :style="{ opacity: item.lx_type == 1 ? 1 : 0 }"
                    >
                      {{ item.exch_user_num }}人兑换
                    </view>
                    <view class="vip_box box_fl" v-if="userInfo.is_vip">
                    0豆特权
                    <image class="vip_img" :src="cardImgUrl + 'vip_box.png'" mode="scaleToFill"></image>
                  </view>
                    <view class="cowpea-num" v-else>
                      <text class="value">{{ item.credits }}</text>牛金豆
                    </view>
                  </view>
                  <view
                    :class="['bottom-tools', item.isOpenCell ? 'active' : '']"
                    v-if="!item.isOpenCell"
                  >
                    <!-- 收藏 -->
                    <view
                        :class="['collection-btn', item.is_collect ? 'active' : '']"
                        @click.stop="collectHandle(item, idx, index)"
                    >
                      {{ item.is_collect ? "已收藏" : "收藏" }}
                    </view>
                    <view class="collection-btn">
                      <button
                        open-type="share"
                        class="share_btn"
                        :data-item="item"
                        @click.stop="shareHandle"
                      ></button>
                      <text>分享</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <!-- 侧滑内容 -->
            <view class="right-swipe" slot="right">
              <view>删除</view>
              <view>记录</view>
            </view>
          </van-swipe-cell>
        </view>
      </view>
    </mescroll-body>
    <!-- 背景 -->
    <view class="list-bg"></view>
    <!-- 牛金豆不足的情况 -->
    <exchangeFailed
      :isShow="exchangeFailedShow"
      @goTask="goTaskHandle"
      @close="exchangeFailedShow = false"
    ></exchangeFailed>
    <!-- 赚取牛金豆 -->
    <serviceCredits
      ref="serviceCredits"
      :isShow="serviceCreditsShow"
      @showAdPlay="showAdPlayHandle"
      @close="closeHandle"
    ></serviceCredits>
</view>
</template>
<script>
import goDetailsFun from "@/utils/goDetailsFun";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 牛金豆不足混入的组件与方法
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import { watchLog, watchDel } from "@/api/modules/user.js";
import { toggleCollect as jdToggleCollect } from "@/api/modules/jsShop.js";
import { toggleCollect as pddToggleCollect } from "@/api/modules/pddShop.js";
import { toggleCollect } from "@/api/modules/user.js";
import { parseTime } from "@/utils/index.js";
import { getImgUrl } from "@/utils/auth.js";
import { mapActions, mapGetters } from 'vuex';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法

export default {
  mixins: [MescrollMixin, goDetailsFun, serviceCreditsFun, shareMixin],
  components: {
    exchangeFailed,
    serviceCredits,
  },
  data() {
    return {
      list: [],
      upOption: {
        auto: false,
      },
      downOption: {
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      currentYear: 0, // 当年的年份
      imgUrl: getImgUrl(),
      cardImgUrl:`${getImgUrl()}static/card/`,
    };
  },
  computed: {
    ...mapGetters([
        "userInfo",
    ])
  },
  onShow() {
    let mescrollRef = this.$refs.mescrollRef;
    mescrollRef.mescroll.resetUpScroll();
  },
  onLoad(options) {
    let date = new Date();
    this.currentYear = parseTime(date, "{y}");
    this.getUserInfo();
  },
  methods: {
    ...mapActions({
        getUserInfo: 'user/getUserInfo',
    }),
    // 收藏
    async collectHandle(item, index, itemIndex) {
        const { coupon_id, skuId, lx_type, goods_sign, goods_id } = item;
        let apiToggleCollect = toggleCollect;
        let params = {coupon_id};
        //   京东商品
        if (lx_type == 2) {
            apiToggleCollect = jdToggleCollect;
            params.skuId = skuId;
            delete params.coupon_id;
        }
        // 拼多多商品
        if (lx_type == 3) {
            apiToggleCollect = pddToggleCollect;
            params.goods_sign = goods_sign;
            params.goods_id = goods_id;
            delete params.coupon_id;
        }
        const res = await apiToggleCollect(params);
        if (res.code != 1) return this.$toast(res.msg);
        this.list[index].dateList[itemIndex].is_collect = !this.list[index].dateList[itemIndex].is_collect;
        this.$toast(res.msg);
    },
    shareHandle() {
      console.log("分享 :>> 防止事件冒泡");
    },
    upCallback(page) {
        //参数
        let params = {
            size: 10,
            page: page.num,
        };
        // 联网加载数据
        watchLog(params).then((res) => {
            let dataObj = res.data ? res.data : [];
            //设置列表数据
            if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
            let list = [];
            Object.keys(dataObj).forEach((value) => {
                const itemYear = parseTime(value, "{y}");
                const itemList = dataObj[value].map((res) => {
                    return {
                    ...res,
                    isOpenCell: false,
                    };
                });
                const cFormat = this.currentYear == itemYear ? "{m}月{d}日" : "{y}年{m}月{d}日";
                list.push({
                    dateTime: parseTime(value, cFormat),
                    dateList: itemList,
                });
            });
            this.list = this.list.concat(list); // 追加新数据
            //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            this.mescroll.endSuccess(list.length);
        }).catch((err) => {
            this.mescroll.endErr();
        });
    },
    goDetails(event, { listIndex, index }) {
      let { detail, currentTarget } = event;
      if (detail == "cell") {
        let { item } = currentTarget.dataset;
        // 最后一个参数代码判断牛金豆不足的拦截
        this.detailsFun_mixins(item, { listIndex, index }, this.list, true);
      }
    },
    onCloseHandle(event, index, itemIndex) {
      let { detail, currentTarget } = event;
      if (!detail) return this.list[index].dateList[itemIndex].isOpenCell = false;
      if (detail.position == "right") {
        let { id } = currentTarget.dataset;
        watchDel({ id }).then((res) => {
            if (res.code != 1) return this.$toast(res.msg);
            this.$toast('已删除');
            detail.instance.close();
            // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
            this.mescroll.resetUpScroll();
        });
      }
    },
    onOpenHandle(event, index, itemIndex) {
      this.list[index].dateList[itemIndex].isOpenCell = true;
    }
  },
};
</script>

<style lang="scss">
page {
  font-family: PingFang SC, PingFang SC-5;
  background-color: #f7f7f7;
}
.list-box {
  padding-top: 40rpx;
}
.date_time {
  padding-left: 24rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  line-height: 50rpx;
  margin-bottom: 24rpx;
}
.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 0 18rpx 0 24rpx;
  .list-icon {
    width: 240rpx;
    height: 240rpx;
    border-radius: 16rpx;
    margin-right: 16rpx;
    flex: 0 0 240rpx;
  }
  .list-txt {
    flex: 1;
    padding: 16rpx 0;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.my-collect {
  position: relative;
  z-index: 0;
  &::before {
    content: "\3000";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(180deg, #ffffff, #f7f7f7 62%);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
  }
  .right-swipe {
    width: 70px;
    background-color: #ef2b20;
    border-radius: 8px;
    height: 100%;
    box-sizing: border-box;
    text-align: center;
    font-size: 24rpx;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .list-item-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    line-height: 40rpx;
    max-height: 80rpx;
  }
  .jd_icon_box {
    padding: 0 10rpx 0 20rpx;
    font-size: 24rpx;
    font-weight: 600;
    color: #ffffff;
    line-height: 34rpx;
    position: relative;
    z-index: 0;
    margin-right: 8rpx;
    white-space: nowrap;
    display: inline-block;
  }

  .exchange-num {
    font-size: 24rpx;
    color: #999999;
    margin-top: 24rpx;
    margin-bottom: 8rpx;
  }

  .cowpea-num {
    font-size: 24rpx;
    font-weight: 500;
    color: #f84842;
    line-height: 44rpx;
  }

  .cowpea-num .value {
    font-size: 32rpx;
  }

  .list-bg {
    background-color: #ffffff;
    border-radius: 12px 12px 0 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.bottom-tools {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #666;
  opacity: 1;
  &.active {
    opacity: 0;
  }
  .collection-btn {
    position: relative;
    line-height: 44rpx;
    width: 96rpx;
    height: 44rpx;
    border-radius: 24rpx;
    border: 1rpx solid #aaa;
    text-align: center;
    &:first-child {
      margin-right: 20rpx;
    }
    &.active {
      background: #f84842;
      color: #fff;
      border-color: #f84842;
    }
    .share_btn {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
}
.list_cont {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.vip_box{
    font-size: 32rpx;
    font-weight: 500;
    color: #f84842;
    line-height: 44rpx;
    white-space: nowrap;
    .vip_img{
        width: 126rpx;
        height: 38rpx;
        margin-left: 4rpx;
    }
}
</style>
