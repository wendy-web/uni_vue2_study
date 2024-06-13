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
      <van-swipe-cell
        :right-width="84"
        v-for="(item, index) in list" :key="index"
        :data-id="item.coupon_id"
        @click="goDetails($event, item, { listIndex: index })"
        @open="onOpenHandle(index)"
        @close="onCloseHandle(index)"
      >
        <view class="list-item">
          <view class="list-icon">
            <van-image
              height="240rpx" width="240rpx"
              radius="16rpx" :src="item.image"
              use-loading-slot
              use-error-slot>
              <van-loading slot="loading" type="spinner" size="24" vertical />
              <van-icon slot="error" color="#edeef1" size="120" name="photo-fail" />
            </van-image>
          </view>
          <view class="list-txt">
            <view class="list-item-title txt_ov_ell2">
              <view class="ty_store" v-if="item.type == 12"></view><!-- 到店吃 -->
              <view class="jd_icon_box" v-else-if="item.lx_type != 1 && Number(item.face_value)">
                <image class="bg_img" mode="scaleToFill"
                  :src="imgUrl + 'static/shopMall/jd_icon_bg.png'"
                ></image>抵¥{{parseInt(item.face_value)}}券
              </view>
              {{ item.title }}
            </view>
            <view class="list_cont">
              <view class="use_cont">
                <view class="use_cont-left" v-if="item.after_pay">先用后付</view>
                <view class="use_cont-right" v-if="item.zero_credits">0豆特权</view>
                  <view v-else-if="show_lowestCouponPrice && item.credits && item.lowestCouponPrice"
                    class="js_search_credits">
                    {{ item.credits || 0 }}牛金豆
                  </view>
              </view>
              <view class="list_cont-bottom fl_bet">
                <view class="list_cont-left box_fl">
                  <view class="cowpea-num">
                    <block v-if="show_lowestCouponPrice && item.lowestCouponPrice">
                      <text v-if="parseInt(item.face_value)">券后</text>
                      <text class="good_credits">
                          <text style="font-size: 24rpx">￥</text>
                          {{ item.lowestCouponPrice || 0 }}
                      </text>
                    </block>
                    <block v-else>
                      <text :class="['value', item.zero_credits ? 'active' : '']">{{ item.credits }}</text>牛金豆
                    </block>
                  </view>
                  <view class="exchange-num" v-if="item.lx_type == 1">
                    {{ Number(item.exch_user_num) + Number(item.user_num) }}人兑换
                  </view>
                  <view class="exchange-num" v-else-if="item.inOrderCount30Days">月售{{ item.inOrderCount30Days }}</view>
                    <view class="exchange-num" v-else-if="item.sales_tip">已售{{ item.sales_tip }}</view>
                </view>
                <view :class="['collection-btn', item.isOpenCell ? 'active' : '']" v-if="!item.isOpenCell">
                  <button open-type="share" class="share_btn"
                    :data-item="item" @click.stop="shareHandle"></button>
                    <text>分享</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 侧滑内容 -->
        <view class="right-swipe" slot="right"
          @click="toggleCollectHandle(item, index)">
          <view>取消</view>
          <view>收藏</view>
        </view>
      </van-swipe-cell>
    </view>
    <!-- 列表为空时呈现 -->
    <view class="empty_box fl_col_cen" v-if="isEmpty">
      <image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
      <view>{{ empty.tip }}</view>
    </view>
    <view class="you_like-title" v-if="goods.length">
      <image class="left-icon" mode="aspectFill"
        :src="imgUrl + 'static/shopMall/love_left_icon.png'"></image>
        猜你喜欢
      <image class="right-icon" mode="aspectFill"
        :src="imgUrl + 'static/shopMall/love_right_icon.png'"></image>
    </view>
    <good-list
      v-if="goods.length"
      :list="goods"
      :isBolCredits="true"
      :isJdLink="true"
      @notEnoughCredits="notEnoughCreditsHandle"
    ></good-list>
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
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import goDetailsFun from "@/utils/goDetailsFun";
// 牛金豆不足混入的组件与方法
import { groupRecommend } from "@/api/modules/index.js";
import { goodsQuery, toggleCollect as jdToggleCollect, jingfen, material } from "@/api/modules/jsShop.js";
import { toggleCollect as pddToggleCollect } from "@/api/modules/pddShop.js";
import { couponCollect, toggleCollect } from "@/api/modules/user.js";
import goodList from "@/components/goodList.vue";
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import { getImgUrl } from "@/utils/auth.js";
import getViewPort from "@/utils/getViewPort.js";
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from 'vuex';
export default {
  mixins: [MescrollMixin, goDetailsFun, serviceCreditsFun, shareMixin],
  components: {
    exchangeFailed,
    serviceCredits,
    goodList,
  },
  data() {
    return {
      cardImgUrl:`${getImgUrl()}static/card/`,
      list: [],
      empty: {
        tip: "~ 暂无更多信息 ~", // 提示
        icon: `${getImgUrl()}static/images/img_no_data.png`,
      },
      isEmpty: false,
      upOption: {
        auto: false,
        // textNoMore: '',
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 1, // 每页数据的数量
        },
        empty: {
          use: false,
        },
      },
      downOption: {
        use: false,
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
      },
      imgUrl: getImgUrl(),
      groupRecommendData: null,
      isRecommendRequest: false,
      goods: [],
      pageNum: 1,
      groupId_index: 0,
      lastOddItem: null,
    };
  },
  watch: {
    goods(newValue) {
      if (newValue.length <= 4) {
        this.mescroll.triggerUpScroll();
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo", 'show_lowestCouponPrice']),
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight = viewPort.windowHeight;
      return mescrollHeight + "px";
    },
  },
  onShow() {
    let mescrollRef = this.$refs.mescrollRef;
    mescrollRef.mescroll.resetUpScroll();
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    onOpenHandle(index) {
      this.list[index].isOpenCell = true;
    },
    onCloseHandle(index) {
      this.list[index].isOpenCell = false;
    },
    shareHandle() {
    },
    warpRectDom(idName) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // 延时确保dom已渲染, 不使用$nextclick
          let query = uni.createSelectorQuery();
          // #ifndef MP-ALIPAY
          query = query.in(this); // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
          // #endif
          query
            .select("#" + idName)
            .boundingClientRect((data) => {
              resolve(data);
            })
            .exec();
        }, 20);
      });
    },
    // 牛金豆不足的情况
    notEnoughCreditsHandle() {
      this.exchangeFailedShow = true;
    },
    upCallback(page) {
      let params = {
        size: 10,
        page: page.num,
      };
      // 是否请求推荐列表，我的收藏列表请求完毕后进行其他接的请求事件
      if (this.isRecommendRequest) return this.requestRem(page);
      couponCollect(params).then((res) => {
        let list = res.data ? res.data.data : [];
        //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
        this.mescroll.endSuccess(params.size, true);
        //设置列表数据
        if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
        this.list = this.list.concat(list); //追加新数据
        this.list = this.list.map((res) => {
          return {
            ...res,
            isOpenCell: false,
          };
        });
        if (!this.list.length) this.isEmpty = true;
        // this.mescroll.endUpScroll(false);
        // 加载另一个
        if (list.length < params.size) {
          this.isRecommendRequest = true;
          this.requestRem(page);
          return;
        }
      }).catch((err) => this.mescroll.endErr());
    },
    async requestRem(page) {
      if (!this.groupRecommendData) {
        const recRes = await groupRecommend({ page: 3 });
        if (recRes.code != 1 || !recRes.data)
          return this.mescroll.endSuccess(0);
        this.groupRecommendData = recRes.data;
      }
      const { id, cid, cid2, cid3, eliteId, groupId, type } =
        this.groupRecommendData;
      let pageNum = this.pageNum;
      // const pageNum = page.num;
      let params = {
        id,
        page: pageNum,
        size: 10,
      };
      let queryApi = goodsQuery;
      // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
      switch (type) {
        case 1:
          queryApi = material;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 10;
          break;
        case 2:
          queryApi = jingfen;
          params.eliteId = eliteId;
          params.groupId = groupId;
          params.size = 20;
          break;
        case 3:
          queryApi = goodsQuery;
          params.cid1 = cid;
          params.cid2 = cid2;
          params.cid3 = cid3;
          break;
        case 4:
          queryApi = jingfen;
          const groupId_index = this.groupId_index;
          params.eliteId = eliteId;
          params.groupId = groupId[groupId_index];
          params.size = 20;
          break;
      }
      queryApi(params)
        .then((res) => {
          const { list, total_count } = res.data;
          // 设置列表数据
          if (page.num == 1) {
            this.goods = [];
            this.pageNum = 1;
            this.lastOddItem = null;
          } //如果是第一页需手动制空列表
          // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          let isNextPage = pageNum * params.size < total_count;
          if (
            !isNextPage &&
            type == 4 &&
            this.groupId_index < groupId.length - 1
          ) {
            // 无下一页
            this.groupId_index += 1;
            this.mescroll.endSuccess(total_count, true);
            this.pageNum = 0;
          } else {
            this.mescroll.endSuccess(list.length || total_count, isNextPage);
          }
          if (list.length == 0 && pageNum * params.size < total_count) {
            this.mescroll.triggerUpScroll();
          }
          if (this.lastOddItem) {
            this.goods.push(this.lastOddItem);
            this.lastOddItem = null;
          }
          this.pageNum += 1;
          this.goods = this.goods.concat(list); // 追加新数据
          const goodLength = this.goods.length;
          if (goodLength % 2 && goodLength > 6) {
            this.lastOddItem = this.goods.pop();
          }
        })
        .catch(() => {
          //联网失败, 结束加载
          // this.mescroll.endErr();
        });
    },
    goDetails(event, item, { listIndex }) {
      let { detail } = event;
      if (detail == "cell") {
        // 最后一个参数代码判断牛金豆不足的拦截
        this.detailsFun_mixins(item, { listIndex }, true);
      }
    },
    async toggleCollectHandle(item, index) {
        const { id, skuId, lx_type, goods_sign, goods_id } = item;
        let queryCollect = toggleCollect;
        let params = { coupon_id: id };
        // 京东商品
        if (lx_type == 2) {
          queryCollect = jdToggleCollect;
          params.skuId = skuId;
          delete params.coupon_id;
        }
        // 拼多多商品
        if (lx_type == 3) {
          queryCollect = pddToggleCollect;
          params.goods_sign = goods_sign;
          params.goods_id = goods_id;
          delete params.coupon_id;
        }
        const res = await queryCollect(params)
        if (res.code != 1) return this.$toast(res.msg);
        // 删除某项的列表
        this.list.splice(index, 1);
        this.$toast('已取消')
    }
  },
};
</script>
<style lang="scss" scoped>
page {
  font-family: PingFang SC, PingFang SC-5;
  background-color: #f7f7f7;
}
.list-item {
  display: flex;
  align-items: center;
  margin-top: 56rpx;
  padding: 0 24rpx;
  .list-icon {
    width: 240rpx;
    height: 240rpx;
    flex: 0 0 240rpx;
    border-radius: 16rpx;
    margin-right: 32rpx;
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
    color: #333;
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
    display: inline-block;
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
  }

  .cowpea-num {
    font-size: 24rpx;
    font-weight: 500;
    color: #f84842;
    line-height: 44rpx;
    margin-right: 10rpx;
  }

  .cowpea-num .value {
    font-size: 32rpx;
    font-weight: bold;
    &.active {
      text-decoration: line-through;
      // text-decoration: line-through solid #f84842 4rpx;
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
        margin-left: 4rpx;
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
.list_cont {
  margin-top: 30rpx;
  .list_cont-bottom{
    margin-top: 8rpx;
  }
}
.collection-btn {
  position: relative;
  line-height: 44rpx;
  width: 96rpx;
  height: 44rpx;
  border-radius: 24rpx;
  border: 2rpx solid #aaa;
  text-align: center;
  font-size: 24rpx;
  color: #666;
  opacity: 1;
  &.active {
    opacity: 0;
  }
  .share_btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .start_btn-icon {
    width: 26rpx;
    height: 26rpx;
    margin: -4rpx 2rpx 0 0;
  }
}
.use_cont {
  display: flex;
  font-size: 24rpx;
  line-height: 34rpx;
  height: 34rpx;
  .use_cont-left {
    color: #32a666;
    margin-right: 18rpx;
    display: flex;
    align-items: center;
    &::before {
      content: "\3000";
      width: 30rpx;
      height: 30rpx;
      background: url("https://test-file.y1b.cn/store/1-0/24312/65f023e89516c.png")  0 0 / 100% 100% no-repeat;
      margin-right: 5rpx;
    }
  }
  .use_cont-right{
    color: #c16e15;
    display: flex;
    align-items: center;
    &::before {
      content: "\3000";
      width: 24rpx;
      height: 24rpx;
      background: url("https://test-file.y1b.cn/store/1-0/24312/65f024b3cdd36.png")  0 0 / 100% 100% no-repeat;
      margin-right: 5rpx;
    }
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
</style>
