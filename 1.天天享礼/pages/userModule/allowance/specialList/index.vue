<template>
<view class="recharge" :style="{'--bg': subjectColor + '' }">
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
    :fixed="true"
    titleAlign="titleRight"
    :navberColor="isShowNavBerColor ? subjectColor : ''"
  >
    <view slot="title" class="nav-custom fl_bet">
      <image class="custom_left_icon" mode="aspectFill"
        :src="imgUrl + 'static/images/icon_close.png'"
        @click="$leftBack"
      ></image>
      <swiperSearch
        :textList="textList"
        :isSwiperTxt="isShowNavBerColor"
        :class="['swiper_search', (textList.length && isShowNavBerColor) ? 'ani_flex-in' : 'ani_flex-out',]"
      ></swiperSearch>
    </view>
  </xh-navbar>
    <image :src="bg_img" mode="widthFix" class="nav_bg" id="navBgId" :style="{'--margin': navHeight + 'px' }">
    </image>
    <good-list
      :list="showGoods"
      :isBolCredits="true"
      :isShowBanner="true"
      @notEnoughCredits="notEnoughCreditsHandle"
      @isBannerClick="isBannerClickHandle"
    ></good-list>
  <recommendDia ref="recommendDia"></recommendDia>
</mescroll-body>
<!-- 牛金豆不足的情况 -->
<exchangeFailed
  :isShow="exchangeFailedShow"
  @goTask="goTaskHandle"
  @close="exchangeFailedShow=false"
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
import { goodsTheme } from '@/api/modules/allowance.js';
import { keywordList } from '@/api/modules/jsShop.js';
import { getApiParams } from '@/api/modules/requestConfiguration/lxType.js';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from "@/components/serviceCredits/serviceCreditsFun.js";
import swiperSearch from '@/components/swiperSearch.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl, warpRectDom } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from 'vuex';
export default {
  mixins: [MescrollMixin, goDetailsFun, serviceCreditsFun, shareMixin], // 使用mixin
  components: {
    goodList,
    exchangeFailed,
    serviceCredits,
    swiperSearch
  },
  data() {
    return {
		imgUrl: getImgUrl(),
        configData: null,
        nav_bgTop: 0,
        isShowNavBerColor: false,
        subjectColor: '#F5EDE2',
        bg_img: '',
        upOption: {
          page: {
            num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          },
        },
        id: 0,
        pageNum: 1,
        groupId_index: 0,
        goods: [],
        goods_lx_type: 1,
        textList: []
    }
  },
  computed: {
		...mapGetters(['isAutoLogin']),
    mescrollHeight() {
      let viewPort = getViewPort();
      // uni.upx2px(142) 头部地址的内容 24位边距
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(142) - uni.upx2px(24);
      return mescrollHeight + 'px';
    },
    navHeight() {
      let viewPort = getViewPort();
      return viewPort.navHeight;
    },
    // 列表数据
    showGoods() {
      let list = this.goods;
      let isType9 = 0;
      // 列表对单列呈现进行后排数组的操作
      list.length && list.forEach((nowItem, index) => {
        if(nowItem.type != 9 ) return;
        if(index%2 && (isType9%2) == 0) {
          list[index] = list[index-1];
          list[index - 1] = nowItem;
        }
        if((index%2) == 0 && isType9%2) {
          list[index] = list[index-1];
          list[index - 1] = nowItem;
        }
        isType9 += 1;
      });
      return list;
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
    this.getUserInfo();
    this.initTextList();
    if(option.id) this.id = option.id;
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    warpRectDom,
    isBannerClickHandle(item) {
      this.$refs.recommendDia.initGtData({
        ...item,
        interval_time: item.type_sid
      });
    },
    async initTextList () {
      const res = await keywordList();
      if (res.code == 1 && res.data) {
        this.textList = res.data;
      }
    },
    async upCallback(page) {
      const params = {
        id: this.id,
        page: page.num,
        size: 10
      }
        if(!this.configData || this.goods_lx_type == 1) {
          const res = await goodsTheme(params);
          if(res.code != 1) return this.mescroll.endSuccess(0);
          if(page.num == 1) this.goods = [];
          this.configData = res.data;
          const { bg_color, bg_img, share_word, share_img } = res.data;
          bg_color && (this.subjectColor = bg_color);
          this.bg_img = bg_img;
          // 混合方法中得对象键值的赋值
          this.getShareCont.share_title = share_word;
          this.getShareCont.share_img = share_img;
          this.getShareCont.id = this.id;
        }
        const { goods_lx_type, list, total_count } = this.configData;
        this.goods_lx_type = goods_lx_type;
        switch(goods_lx_type) {
          case 1:
            // 自选
            this.mescroll.setPageSize(3);
            this.goods = this.goods.concat(list); // 追加新数据
            this.mescroll.endSuccess(list.length);
            break;
          case 2:
          case 3:
            // 拼多多 - 京东
            this.mescroll.setPageSize(1)
            this.requestList(page);
            break;
        }
    },
    async requestList(page) {
        // 设置列表数据
        if( page.num == 1 ) {
            this.goods = [];
            this.groupId_index = 0;
            this.pageNum = 1;
        };
        const { queryApi, params, groupId, type } = getApiParams(
          this.configData, { pageNum: this.pageNum, groupId_index: this.groupId_index }, false
        );
        queryApi(params).then(res=>{
            const { list, total_count } = res.data;
            // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            let isNextPage = (this.pageNum * params.size) < total_count;
            if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                // 无下一页 - 京东
                this.groupId_index += 1;
                this.pageNum = 1;
                this.mescroll.endSuccess(total_count, true);
            } else {
                this.mescroll.endSuccess(list.length || total_count, isNextPage);
            }
            if(list.length == 0 && (this.pageNum * params.size) < total_count){
                this.mescroll.triggerUpScroll();
            }
            this.pageNum += 1;
            this.goods = this.goods.concat(list); // 追加新数据
        }).catch(() => this.mescroll.endErr());
    },
    // 牛金豆不足的情况
    notEnoughCreditsHandle() {
        this.exchangeFailedShow = true;
    },
	  onPageScroll(event) {
        const scrollTop = Math.ceil(event.scrollTop);
        if(scrollTop >= this.nav_bgTop) return this.isShowNavBerColor = true;
        this.isShowNavBerColor = false;
    }
  }
}
</script>
<style lang="scss">
page {
  background: #F5EDE2;
}
.recharge{
  background: var(--bg);
  position: relative;
  box-sizing: border-box;
//   padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
//   /* 兼容 IOS<11.2 */
//   padding-bottom: calc(10px + env(safe-area-inset-bottom));
  font-size: 0;
  .nav_bg {
    width: 100%;
    margin-top: calc(0px - var(--margin));
    margin-bottom: 10rpx;
  }
  .recharge_cont {
    box-sizing: border-box;
  }
}
.swiper_search{
  transition: all 0.5s;
  flex: 1;
  &.ani_flex-in {
    flex: 1;
  }
  &.ani_flex-out {
    flex: 0;
  }
}
.nav-custom{
  flex: 1;
  .custom_left_icon{
    width: 48rpx;
    height: 48rpx;
    flex: 0 0 48rpx;
    margin-right: 20rpx;
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
// .cont_box {
//   width: 100%;
//   margin-top: 56rpx;
//   padding-top: 32rpx;
//   position: relative
//   z-index: 0;
//   &::before {
//     content: '';
//     width: 100%;
//     position: absolute;
//     z-index: -1;
//     top: 0;
//     left: 0;
//     min-height: 618rpx;
//     height: 100%;
//     background: linear-gradient(180deg,rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.50) 37%);
//     border-radius: 40rpx 40rpx 0 0;
//   }
//   padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
//   /* 兼容 IOS<11.2 */
//   padding-bottom: calc(10px + env(safe-area-inset-bottom));
//   // border-radius: 40rpx 40rpx 0 0;
//   // background: linear-gradient(180deg,rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.50) 37%);

// }
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
