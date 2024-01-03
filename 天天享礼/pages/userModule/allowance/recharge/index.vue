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
  :navberColor="subjectColor"
  :fixed="true"
  :fixedNum="9"
>
<view slot="title" class="nav-custom">
  <image class="title_icon" src="https://file.y1b.cn/store/1-0/23817/64dde71999d9c.png" mode="aspectFill"></image>
</view>
</xh-navbar>
  <view class="banner_box fl_col_cen"
    :style="{top: navHeight + 'px', '--bg': subjectColor}"
    id="bannerId"
  >
  <banner-tabs
    :tabList="tabList"
    :tabIndex="tabIndex"
    class="banner_com"
    @change="tabChangeHandle"
  ></banner-tabs>
    <view class="ban_more" @click="moreHandle" v-if="tabList.length > 5">
      <image class="bg_img" src="https://file.y1b.cn/store/1-0/23817/64dde6b050eda.png" mode="scaleToFill"></image>
    </view>
  </view>
  <!-- 列表内容 -->
  <cont-tabs
    :tabList="tabList"
    :tabIndex="contIndex"
    :mescrollHeight="mescrollHeight"
    @scroll="scrollHandle"
  >
  </cont-tabs>
  <!-- 列表的弹窗 -->
  <listDia
    ref="listDia"
    @change="changeHandle"
  >
  </listDia>
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
</mescroll-body>
</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import configurationDia from '@/components/configurationDia/index.vue';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import { getImgUrl } from '@/utils/auth.js';
import bannerTabs from './banner-tabs.vue';
import contTabs from './cont-tabs.vue';
import listDia from './listDia.vue';
import {
  categoryCoupon
} from '@/api/modules/allowance.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
export default {
  mixins: [MescrollMixin, configurationFun, shareMixin], // 使用mixin
  components: {
    bannerTabs,
    contTabs,
    listDia,
    configurationDia
  },
  data() {
    return {
			imgUrl: getImgUrl(),
      subjectColor: '#FFF2D6',
      upOption: {
        empty: {
          use: false
        }
      },
      downOption: {
        empty: {
          use: false
        }
      },
      banIndex: 0,
      isShowNavBerColor: false,
      listScrollHeight: 0,
      isListDisScroll: false,
      tabIndex: 0,
      contIndex: 0,
      scrollTop: 0,
      tabList: [],
      banner_top: 0,
      isScroll: true
    }
  },
  computed: {
    mescrollHeight() {
      let viewPort = getViewPort();
      let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - this.listScrollHeight ;
      return mescrollHeight + 'px';
    },
    navHeight() {
      let viewPort = getViewPort();
      this.banner_top = uni.upx2px(366) - viewPort.navHeight;
      return viewPort.navHeight;
    },
    bannerContWidth() {
      // banner的组件的长度
      let viewPort = getViewPort();
      return viewPort.screenWidth - uni.upx2px(40);
    }
  },
  watch: {
    tabList: {
      handler(newValue, oldValue) {
        setTimeout(async () => {
          const bannerRes = await this.warpRectDom('bannerId');
          this.listScrollHeight = bannerRes.height;
        }, 2000);
      },
      immediate: true
    },
  },
  // 页面周期函数--监听页面加载
  async onLoad(option) {
  },
  methods: {
    async upCallback(page) {
        categoryCoupon().then(res => {
          if(res.code != 1) return;
          this.tabList = res.data;
          this.mescroll.endSuccess(0, false);
        }).catch(error => {
          //联网失败, 结束加载
					this.mescroll.endSuccess(0);
        });
    },
    async bannerItemDomFun(){
      this.tabs.forEach((res, index) => {
        const tabItemId = `tabItemId${index}`;
        this.warpRectDom(tabItemId).then(result => {
          res.top = result.top;
        });
      });
    },
		onPageScroll(event) {
      const scrollTop = Math.ceil(event.scrollTop);
      this.scrollTop = scrollTop;
      // this.currentScroll();
    },
    currentScroll() {
			if(!this.isScroll) return;
      const img_height = uni.upx2px(366);
      if(this.scrollTop >= (img_height - this.navHeight)) {
        this.isShowNavBerColor = true;
        this.isListDisScroll = true;
        return;
      }
      this.isShowNavBerColor = false;
      this.isListDisScroll = false;
    },
    tabChangeHandle(index) {
      const img_height = uni.upx2px(366);
      this.mescroll.scrollTo(img_height);
      this.isShowNavBerColor = true;
      this.isListDisScroll = true;
      this.tabIndex = index;
      this.contIndex = index;
      this.isScroll = false;
      setTimeout(() => {
				this.isScroll = true;
			}, 500);
    },
    // 列表的上下滚动
    scrollHandle(index, scrollTop) {
      this.tabIndex = index;
      if(scrollTop == 0) {
        this.isListDisScroll = false;
      }
    },
    moreHandle() {
      this.$refs.listDia.popupShow();
    },
    changeHandle(id) {
      const index = this.tabList.findIndex(res => res.id == id);
      this.tabChangeHandle(index)
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
.recharge{
  background: var(--bg);
  position: relative;
  font-size: 0;
  .recharge_cont {
    padding: 0 32rpx;
  }
}
.nav-custom {
		position: absolute;
		font-size: 0;
		top: 50%;
		transform: translateY(-50%);
		left: 84rpx;
		.title_icon{
      width: 154rpx;
      height: 36rpx;
    }
}
.banner_com{
  width: 100%;
}

.banner_box {
  position: sticky;
  top: 110rpx;
  border-radius: 32rpx 32rpx 0 0;
  z-index: 1;
  width: 100%;
  background: var(--bg);
  .ban_more {
    width: 78rpx;
    height: 154rpx;
    position: absolute;
    top: 22rpx;
    right: 0;
    z-index: 1;
  }
  .ban_index-box{
    height: 12rpx;
    background: #e1e1e1;
    border-radius: 6rpx;
    margin-bottom: 32rpx;
    .ban_index-active{
      height: 100%;
      background: #f98306;
      border-radius: 6rpx;
      position: relative;
    }
  }
  .bean_list-box{
    padding: 32rpx 20rpx;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
  }
}
</style>