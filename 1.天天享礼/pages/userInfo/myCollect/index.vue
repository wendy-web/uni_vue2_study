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
          v-for="(item, index) in list"
          :key="index"
          :data-id="item.coupon_id"
          @click="goDetails($event, item, { listIndex: index })"
          @open="onOpenHandle(index)"
          @close="onCloseHandle(index)"
        >
          <!-- 主要内容 -->
          <view class="list-item">
            <!-- <image class="list-icon" :src="item.image"></image> -->
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
                  <view class="exchange-num" :style="{ opacity: item.lx_type == 1 ? 1 : 0 }">
                    {{ Number(item.exch_user_num) + Number(item.user_num) }}人兑换
                  </view>
                  <view class="vip_box box_fl" v-if="userInfo.is_vip">
                    0豆特权
                    <image class="vip_img" :src="cardImgUrl + 'vip_box.png'" mode="scaleToFill"></image>
                  </view>
                  <view class="cowpea-num" v-else>
                    <text class="value">{{ item.credits }}</text>牛金豆
                  </view>
                </view>
                <view :class="['collection-btn', item.isOpenCell ? 'active' : '']"
                  v-if="!item.isOpenCell">
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
import goDetailsFun from "@/utils/goDetailsFun";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
// 牛金豆不足混入的组件与方法
import exchangeFailed from "@/components/serviceCredits/exchangeFailed.vue";
import serviceCredits from "@/components/serviceCredits/index.vue";
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import goodList from "@/components/goodList.vue";
import { couponCollect, toggleCollect } from "@/api/modules/user.js";
import { toggleCollect as jdToggleCollect } from "@/api/modules/jsShop.js";
import { toggleCollect as pddToggleCollect } from "@/api/modules/pddShop.js";
import getViewPort from "@/utils/getViewPort.js";
import { getImgUrl } from "@/utils/auth.js";
import { groupRecommend } from "@/api/modules/index.js";
import { material, jingfen, goodsQuery } from "@/api/modules/jsShop.js";
import { mapActions, mapGetters } from 'vuex';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
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
    ...mapGetters([
        "userInfo",
    ]),
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
      console.log("分享 :>> 此事件添加为防止事件冒泡");
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
      //参数
      let params = {
        size: 10,
        page: page.num,
      };
      // 是否请求推荐列表，我的收藏列表请求完毕后进行其他接的请求事件
      if (!this.isRecommendRequest) {
        //联网加载数据
        couponCollect(params)
          .then((res) => {
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
          })
          .catch((err) => {
            this.mescroll.endErr();
          });
      } else {
        this.requestRem(page);
      }
      //联网失败, 结束加载
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
        this.detailsFun_mixins(item, { listIndex }, this.list, true);
      }
    },
    async toggleCollectHandle(item, index) {
        const { id, skuId, lx_type, goods_sign, goods_id } = item;
        let queryCollect = toggleCollect;
        let params = {
            coupon_id: id,
        };
        //   京东商品
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}
.collection-btn {
  position: relative;
  line-height: 44rpx;
  width: 96rpx;
  height: 44rpx;
  border-radius: 24rpx;
  border: 1rpx solid #aaa;
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
</style>
