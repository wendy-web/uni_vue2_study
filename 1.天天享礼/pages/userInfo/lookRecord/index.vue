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
          v-for="(item, index) in dateItem.dateList" :key="index"
          :data-id="item.id" :data-item="item" async-close
          @click="goDetails($event, { listIndex: idx, index })"
          @close="onCloseHandle($event, idx, index)"
          @open="onOpenHandle($event, idx, index)"
        >
          <view class="list-item">
            <view class="list-icon">
              <van-image
                height="240rpx" width="240rpx"
                radius="16rpx" :src="item.image"
                use-loading-slot use-error-slot>
                <van-loading slot="loading" type="spinner" size="24" vertical />
                <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
              </van-image>
            </view>
            <view class="list-txt">
              <view class="list-item-title txt_ov_ell2">
                <view class="ty_store" v-if="item.type == 12"></view><!-- 到店吃 -->
                <view class="jd_icon_box" v-else-if="item.lx_type != 1 && Number(item.face_value)">
                  抵¥{{item.face_value}}券
                </view>
                <view class="show_type" v-if="userInfo.show_shopType && (item.lx_type > 1)">
                  {{ (item.lx_type == 2) ? '京东' : '拼多多' }}
                </view>
                {{ item.title }}
              </view>
              <view class="list_cont">
                <view class="use_cont">
                  <view class="use_cont-left" v-if="item.after_pay"></view>
                  <view class="use_cont-right" v-if="item.zero_credits">免豆特权</view>
                  <view v-else-if="show_lowestCouponPrice && item.credits && item.lowestCouponPrice" class="js_search_credits">
                    {{ item.credits || 0 }}牛金豆
                  </view>
                </view>
              <view class="vip_profit" v-if="item.vip_profit > 0">会员再返 ¥{{ item.vip_profit }}</view>
                <view class="list_cont-bottom fl_bet">
                  <view class="list_cont-left box_fl">
                    <view class="cowpea-num">
                      <block v-if="show_lowestCouponPrice && item.lowestCouponPrice">
                        <text v-if="Number(item.face_value)">券后</text>
                        <text class="good_credits">
                            <text style="font-size: 24rpx">￥</text>
                            {{ item.lowestCouponPrice || 0 }}
                        </text>
                      </block>
                      <block v-else>
                        <text :class="['value', item.zero_credits ? 'active' : '']">
                        {{ item.credits }}</text>牛金豆
                      </block>
                    </view>
                    <view class="exchange-num" v-if="item.lx_type == 1">{{ item.exch_user_num + Number(item.user_num)}}人兑换</view>
                    <view class="exchange-num" v-else-if="item.inOrderCount30Days">月售{{ item.inOrderCount30Days }}</view>
                    <view class="exchange-num" v-else-if="item.sales_tip">已售{{ item.sales_tip }}</view>
                  </view>
                  <view v-if="!item.isOpenCell" :class="['bottom-tools', item.isOpenCell ? 'active' : '']" >
                    <view :class="['collection-btn', item.is_collect ? 'active' : '']"
                      @click.stop="collectHandle(item, idx, index)">
                      {{ item.is_collect ? "已收藏" : "收藏" }}
                    </view>
                    <!-- <view class="collection-btn">
                      <button open-type="share" class="share_btn"
                        :data-item="item" @click.stop="shareHandle"></button>
                      <text>分享</text>
                    </view> -->
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
</view>
</template>
<script>
import { toggleCollect as jdToggleCollect } from "@/api/modules/jsShop.js";
import { toggleCollect as pddToggleCollect } from "@/api/modules/pddShop.js";
import { toggleCollect, watchDel, watchLog } from "@/api/modules/user.js";
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from "@/utils/auth.js";
import goDetailsFun from "@/utils/goDetailsFun";
import { parseTime } from "@/utils/index.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from 'vuex';
export default {
  mixins: [MescrollMixin, goDetailsFun, shareMixin],
  components: {
    exchangeFailed,
    serviceCredits,
  },
  data() {
    return {
      list: [],
      upOption: {
        auto: true,
        page: {
          size: 5
        }
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
    ...mapGetters(["userInfo", 'show_lowestCouponPrice'])
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
    shareHandle() {},
    upCallback(page) {
      let params = {
        size: page.size,
        page: page.num,
      };
      // 联网加载数据
      watchLog(params).then((res) => {
        let dataObj = res.data ? res.data : [];
        // 设置列表数据
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
        // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(list.length);
      }).catch((err) =>  this.mescroll.endErr());
    },
    goDetails(event, { listIndex, index }) {
      let { detail, currentTarget } = event;
      if (detail == "cell") {
        let { item } = currentTarget.dataset;
        // 最后一个参数代码判断牛金豆不足的拦截
        this.detailsFun_mixins(item, { listIndex, index }, true);
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
  color: #333;
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
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    height: 80rpx;
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
    display: inline;
    &::before {
      content: "\3000";
      background: url("https://file.y1b.cn/store/1-0/24621/6675210e27253.png") 0 0 / 100% 100% no-repeat;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
  }
  .show_type {
    padding: 0 4rpx;
    height: 34rpx;
    background: #f8cc82;
    border-radius: 6rpx;
    font-size: 24rpx;
    color: #7f4715;
    line-height: 34rpx;
    font-weight: bold;
    display: inline;
    margin-right: 8rpx;
  }
  .ty_store {
    width: 118rpx;
    height: 34rpx;
    background: url("https://test-file.y1b.cn/store/1-0/24412/6619090ba6bf5.png") 0 0 / 100% 100% no-repeat;
    margin-right: 8rpx;
    transform: translateY(8rpx);
    display: inline-block;
  }

  .exchange-num {
    font-size: 24rpx;
    color: #999;
    white-space: nowrap;
  }

  .cowpea-num {
    font-size: 24rpx;
    font-weight: 500;
    color: #f84842;
    line-height: 44rpx;
    margin-right: 10rpx;
    white-space: nowrap;
    .value {
      font-size: 32rpx;
      &.active {
        font-weight: 600;
        text-decoration: line-through;
        // text-decoration: line-through solid currentColor 4rpx;
      }
    }
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
    border: 2rpx solid #aaa;
    text-align: center;
    &:first-child {
      margin-right: 10rpx;
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
  margin-top: 30rpx;
  .list_cont-bottom{
    margin-top: 8rpx;
  }
}
.vip_box{
  font-size: 32rpx;
  font-weight: 500;
  color: #f84842;
  line-height: 44rpx;
  white-space: nowrap;
  .vip_img {
    width: 126rpx;
    height: 38rpx;
    margin-left: 4rpx;
  }
}
.use_cont {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  height: 34rpx;
  .use_cont-left {
    height: 34rpx;
    width: 143rpx;
    background: url("https://file.y1b.cn/store/1-0/24629/667f84504856c.png")  0 0 / 100% 100% no-repeat;
    margin-right: 18rpx;
    position: relative;
  }
  .use_cont-right {
    color: #999;
    position: relative;
    // padding-left: 32rpx;
    // &::before {
    //   content: "\3000";
    //   position: absolute;
    //   top: 4rpx;
    //   left: 0;
    //   width: 26rpx;
    //   height: 26rpx;
    //   background: url("https://test-file.y1b.cn/store/1-0/24312/65f024b3cdd36.png")  0 0 / 100% 100% no-repeat;
    // }
  }
}
.js_search_credits {
  font-size: 26rpx;
  text-align: center;
  color: #f97f02;
  line-height: 36rpx;
  display: flex;
  align-items: center;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/js_search_icon.png") 0 0 / cover no-repeat;
    width: 30rpx;
    height: 30rpx;
    margin-right: 4rpx;
    display: inline-block;
  }
}
.good_credits {
  font-size: 36rpx;
  margin-right: 4rpx;
  font-weight: bold;
  position: relative;
}
.vip_profit {
  font-size: 24rpx;
  color: #f0423a;
  line-height: 34rpx;
  margin-top: 12rpx;
}
</style>
