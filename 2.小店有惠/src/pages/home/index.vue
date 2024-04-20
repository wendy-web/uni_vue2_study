<template>
<view class="demo_bottom">
  <mescroll-body :sticky="true" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
    <xh-navbar
      navbarColor="#fff"
      titleAlign="titleRight"
    >
      <view slot="title" class="nav_title box_fl">
        <image class="title_logo" mode="aspectFit" src="https://file.y1b.cn/store/1-0/24131/65ba377f11904.png"></image>
        <view class="nav_search fl_center" @click="toSearchHandle">
            <image class="search_icon" mode="aspectFit" src="@/static/images/home/search_icon.png"></image>
            <swiper
                class="search_txt"
                style="height: 100%;"
                :autoplay="true"
                interval="3000"
                :duration="300"
                :circular="true"
                :vertical="true"
                :current="currentIndex"
                :disable-touch="false"
                @animationfinish="animationfinishHandle"
                v-if="textList.length"
		    >
                <swiper-item
                    v-for="(item, index) in textList"
                    :key="index"
                    class="swiper_item txt_ov_ell1"
                >
                {{ item }}
                </swiper-item>
			</swiper>
          <view class="search_txt" v-else>搜索喜欢的商品</view>
        </view>
      </view>
    </xh-navbar>
    <view class="stick-box fl_bet" @click="goMyCredit">
      <view class="stick_left fl_col_cen">
        <image class="bg_img" mode="aspectFit" src="https://file.y1b.cn/store/1-0/24131/65ba375769586.png" ></image>
        <image class="card_icon" mode="aspectFit"  src="https://file.y1b.cn/store/1-0/24131/65ba3717ad35a.png" ></image>
        <view class="credit-title">我的积分</view>
      </view>
      <view class="credit-box fl_bet">
        <view class="credit-num">
          <text class="num-width one-line" v-if="countupComplete">{{  creditsnumber || 0 }}</text>
          <text class="num-width one-line" v-else>{{ userInfo.credits || 0 }}</text>
          <text style="font-size: 28rpx;margin-left:8rpx">积分</text>
        </view>
        <view class="credit_btn">赚积分</view>
      </view>
    </view>
    <!-- 团长的标识 -->
    <view class="vip_cont" v-if="singletonImg" @click="vipHandle">
        <van-image
            width="100%" height="100%"
            :src="singletonImg"
            use-loading-slot
        >
            <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
    </view>
    <!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
    <view class="sticky-tabs" :style="{top:stickyTop +'px'}" id="tabs">
      <tabs v-model="tabIndex" :height="tabsHeight" :tabs="tabs" @change="tabChange"></tabs>
    </view>
    <!-- 数据列表 -->
    <view :style="{ minHeight: (goods && goods.length > 2) && swiperHeight}">
        <good-list
            :list="goods"
            @deleteBysubunionid="deleteBysubunionidHandle"
        ></good-list>
    </view>
  </mescroll-body>
    <!-- 未登录模块引导 -->
    <view class="login_box fl_bet"
        :style="{'--padding': tabHeightValue + 'px'}"
        v-if="!isAutoLogin"
    >
        <view class="lg_left">登录享更多精彩内容</view>
        <view class="lg_btn" @click="toLoginHandle">登录</view>
    </view>
  <!-- 底部导航 -->
  <navbar
    :currentIndex="0"
    @domObjHeight="domObjHeightHandle"
  ></navbar>
  <!-- 话费充值的弹窗 -->
  <popoverDia
    :diaId="diaId"
    :diaImage="diaImage"
    :isShow="isShowPopoverDia"
    @close="closePopoverDiaHandle"
    @openLink="openLinkHandle"
  >
  </popoverDia>
</view>
</template>
<script>
import {
    goodsGroup,
    goodsList,
    popover,
    singleton
} from "@/api/modules/home.js";
import {
    goodsQuery,
    jingfen,
    keywordList,
    material
} from '@/api/modules/jsShop.js';
import {
    goodsRecommend,
    goodsSearch,
} from '@/api/modules/pddShop.js';
import goodList from "@/components/goodList.vue";
import popoverDia from "@/components/popoverDia.vue";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import WxCountUp from "@/utils/WxCountUp.js";
import { getPlatform } from "@/utils/auth.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import tabs from "./component/tabs.vue";
  let _options = {
    separator: "",
    duration: 1,
  };
export default {
	mixins: [MescrollMixin], // 使用mixin
    components: {
        tabs,
        goodList,
        popoverDia
    },
	data() {
		return {
            countupComplete: false,
            stickyTop: 0,
            creditsnumber: 0,
            tabs:[],
            tabIndex: 0, // 当前菜单下标
            // topBoxHeight: uni.upx2px(100), // 顶部内容的高度 (单位px)
            tabHeightValue: 0, // 底部导航栏的高度
            tabsHeight: 88,
            diaId: 0, // 手机充值的id
            diaImage: '',
            isShowPopoverDia: false,
            currentIndex: 0,
            textList: [],
            singletonImg: '',
            upOption: {
                auto: false,
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 1
                },
            },

		}
	},
    watch: {
        userInfo: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.$nextTick(() => {
                    this.updateWxCountUp(newVal.credits);
                    });
                }
            },
            immediate: true,
            deep: true,
        },
        diaList(newValue, oldValue) {
            
            if(newValue.length && (newValue[0] == 'phoneId')) {
                this.isShowPopoverDia = true;
            }
        }
    },
    computed: {
        ...mapGetters(["userInfo", "unionid", "diaList", 'isAutoLogin']),
        goods() {
            return this.tabs[this.tabIndex]?.goods
        },
        topBoxHeight() {
            return this.stickyTop - uni.upx2px(16);
        },
        swiperHeight() {
            // uni.upx2px(226)
            let minHeight = (uni.getSystemInfoSync().windowHeight - uni.upx2px(88) - this.tabHeightValue - this.stickyTop) + 'px';
            if(this.goods && !this.goods.length) {
                minHeight = 0 + 'px';
            }
            return minHeight;
        },
    },
    // 分享
    onShareAppMessage() {
        let share = {
            title: '太划算了，原来积分这么值钱，又省了一笔钱',
            imageUrl: 'https://file.y1b.cn/store/1-0/23519/64673967429f9.png'
        }
        return share;
    },
    async onLoad(options) {
        this.countUp = new WxCountUp("creditsnumber", 0, _options, this);
        this.countUp.start((complete) => {
            this.countupComplete = true;
        });
        // 彬纷有礼的进入——
        if(options.phoneId) {
            this.diaId = options.diaId;
            const platform = getPlatform();
            const res = await popover({
                type: 'xdyh',
                platform,
                unionid: this.unionid
            })
            if(res.code == 1 && res.data && res.data.goods_id) {
                const { goods_id, image2 } = res.data;
                this.diaId = goods_id;
                this.diaImage = image2;
                if(this.diaList.length) {
                    this.setDiaList('phoneId');
                } else {
                    this.isShowPopoverDia = true;
                }
            }
        } else {
            this.$refs.pointUpgradeDia.initUpgrade(false);
        }
        getNavbarData().then((res) => {
            let { navBarHeight, statusBarHeight } = res;
            this.stickyTop = navBarHeight + statusBarHeight;
        });
        const res = await keywordList();
	    if(res.code == 1 && res.data) {
            this.textList = res.data;
        }
    },
    onShow() {
        if(!this.isShowPopoverDia && this.diaId) {
            this.diaId = null;
            this.$refs.pointUpgradeDia.initUpgrade(false);
        }
    },
	methods: {
        ...mapActions({
            getUserInfo: "user/getUserInfo",
        }),
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        // 进入商品的搜索
        toSearchHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            let placeholderValue = '';
            if(!this.isShowCowpeaNav && this.textList.length) {
                placeholderValue = this.textList[this.currentIndex];
            }
            // 去领券中心的搜索页
            this.$go(`/pages/homeModule/productList/search?placeholderValue=${placeholderValue}`);
        },
        animationfinishHandle(event){
			this.currentIndex = event.detail.current;
		},
        updateWxCountUp(num) {
            this.countUp.update(+num);
        },
        domObjHeightHandle(height) {
            this.tabHeightValue = height;
        },
        deleteBysubunionidHandle(index) {
            this.goods.splice(index, 1);
        },
        async singletonInit() {
            const res = await singleton();
            if(!res.code || !res.data) return;
            this.singletonImg = res.data;
        },
        /*下拉刷新的回调 */
        downCallback() {
            this.getUserInfo(); //获取用户信息
            this.singletonInit();
            if(this.tabs[this.tabIndex]) this.tabs[this.tabIndex].pageNum = 1;
            this.mescroll.resetUpScroll();
        },
		async upCallback(page) {
            if (!this.tabs.length) {
                let res = await goodsGroup();
                this.tabs = res.data.map((item) => {
                item.name = item.title;
                return {
                    ...item,
                    goods: null,
                    num: 1,
                    y: 0,
                    curPagelen: 0,
                    hasNext: true,
                    pageNum:1
                };
                });
            }
            if(!this.tabs.length){
                return this.mescroll.endSuccess(0);
            };
            const itemTab = this.tabs[this.tabIndex];
            // 京东/拼多多列表
            if([2, 3].includes(Number(itemTab.lx_type))) return this.requestRem(page);
            const params = {
                page: page.num,
                size: 10,
                id: this.tabs[this.tabIndex].id,
            }
            goodsList(params).then((res) => {
                const {list, total_count} = res.data;
                let curTab = this.tabs[this.tabIndex];
                // 设置列表数据
                if(page.num == 1) curTab.goods = []; //如果是第一页需手动制空列表
                curTab.goods = curTab.goods.concat(
                list.map(function (item) {
                    return {
                        ...item,
                        sale_price: (item.sale_price / 100).toFixed(2),
                        price: (item.price / 100).toFixed(2)
                    };
                })
                ); //追加新数据
                curTab.num = page.num; // 页码
                curTab.curPageLen = list.length; // 当前页长
                curTab.hasNext = this.mescroll.optUp.hasNext; // 是否还有下一页
                this.tabs[this.tabIndex] = curTab;
                // 需先隐藏加载状态
                // this.mescroll.endSuccess(list.length);
                // 更改商品列表的下拉触底的加载
                this.mescroll.endBySize(curTab.goods.length, total_count);
                const isNextPage = (page.num * params.size) < total_count;
                if(isNextPage && !list.length) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(() => {
                this.mescroll.endErr();
            });
	    },
        async requestRem(page) {
            const curTab = this.tabs[this.tabIndex];
            const {
                id,
                cid,
                cid2,
                cid3,
                eliteId,
                groupId,
                type,
                pageNum,
                groupId_index,
                positionId,
                lx_type
            } = curTab;
            let params = {
                id,
                positionId,
                page: pageNum,
                size: 10,
            }
			let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch(type) {
                case 1:
                    // 拼多多接口的访问
                    if (lx_type == 3) {
                        queryApi = goodsRecommend;
                        params.positionId = positionId;
                    } else {
                        queryApi = material;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 10;
                    }
                    break;
                case 2:
                    if (lx_type == 3) {
                        queryApi = goodsSearch;
                        params.positionId = positionId;
                    } else {
                        queryApi = jingfen;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 20;
                    }
                    break;
                case 3:
                    queryApi = goodsQuery;
                    params.cid1 = cid;
                    params.cid2 = cid2;
                    params.cid3 = cid3;
                    break;
                case 4:
                    queryApi = jingfen;
                    params.eliteId = eliteId;
                    params.groupId = groupId[groupId_index];
                    params.size = 20;
                    break;
            };
            queryApi(params).then(res=>{
                const {
                    list,
                    total_count
                } = res.data;
                // 设置列表数据
                curTab.num = page.num; // 页码
                curTab.curPageLen = list.length; // 当前页长
                curTab.hasNext = this.mescroll.optUp.hasNext; // 是否还有下一页
                if( page.num == 1 ) {
                    curTab.goods = [];
                    curTab.pageNum = 1;
                }; //如果是第一页需手动制空列表
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = (pageNum * params.size) < total_count;
                if(!isNextPage && type == 4 && groupId_index < (groupId.length - 1)) {
                    // 无下一页
                    curTab.groupId_index += 1;
                    this.mescroll.endSuccess(total_count, true);
                    curTab.pageNum = 0;
                } else {
                    this.mescroll.endSuccess(list.length || total_count, isNextPage);
                }
                if((list.length == 0 || curTab.goods.length < 6 ) && (pageNum * params.size) < total_count ){
                    this.mescroll.triggerUpScroll();
                }
                curTab.pageNum += 1;
                curTab.goods = curTab.goods.concat(list); // 追加新数据
            }).catch(()=>this.mescroll.endErr());
		},
        // 切换菜单
        tabChange (index, item) {
            // 记录切换前滚动条的位置
            if(!this.preIndex) this.preIndex = 0
            let preTab = this.tabs[this.preIndex]
            preTab.y = this.mescroll.getScrollTop();
            this.preIndex = index;
            // 当前菜单的数据
            let curTab = this.tabs[index];
            if (!curTab.goods) {
                curTab.pageNum = 1;
                curTab.groupId_index = 0;
                // 没有初始化,则初始化
                this.mescroll.resetUpScroll();
            } else{
                // 初始化过,则恢复之前的列表数据
                this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
                this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
            }
            this.$nextTick(()=>{
                this.mescroll.scrollTo(this.topBoxHeight, 0); // 恢复滚动条的位置
            });
		},
        goMyCredit() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$go("/pages/mineModule/myCredit/index");
        },
        closePopoverDiaHandle() {
            this.isShowPopoverDia = false;
            this.diaId = null;
            this.delCurrentDiaList();
            this.$refs.pointUpgradeDia.initUpgrade(false);
        },
        openLinkHandle() {
            this.delCurrentDiaList();
            this.isShowPopoverDia = false;
        },
        toLoginHandle() {
            this.$go('/pages/login/index');
        },
        vipHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$switchTab('/pages/card/index')
        }
	}
}
</script>

<style lang="scss">
page {
  background: #f4f5f9;
  // overflow: auto !important;
}
.vip_cont{
    width: 100%;
    height: 210rpx;
    background: #fff;
    padding-bottom: 16rpx;
    margin-bottom: 16rpx;
    .vip_cont-img{
        width: 100%;
        height: 100%;
    }
}
.demo_bottom{
  padding-bottom: calc(125rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(125rpx + env(safe-area-inset-bottom));
}
.nav_title {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  .title_logo{
    width: 144rpx;
    height: 38rpx;
    margin-right: 24rpx;
  }
  .nav_search{
    flex: 1;
    height: 64rpx;
    background: #f1f1f1;
    border-radius: 32rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    .search_icon{
      width: 28rpx;
      height: 28rpx;
      margin-right: 16rpx;
    }
    .search_txt {
        font-size: 26rpx;
        color: #999;
        line-height: 64rpx;
        word-break: break-all;
        width: calc(100% - 64rpx);
        text-align: left;
	}
  }
}
	/*
	sticky生效条件：
	1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	3、父元素的高度不能低于sticky元素的高度
	4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	*/
	.sticky-tabs{
		z-index: 99;
		position: sticky;
		top: var(--window-top);
		background-color: #fff;
    margin-bottom: 16rpx;
	}
	// 使用mescroll-uni,则top为0
.mescroll-uni{
		.sticky-tabs{
			top: 0;
		}
	}
	.demo-tip{
		padding: 18rpx;
		font-size: 24rpx;
		text-align: center;
	}

  .stick-box {
    position: relative;
    background: #fff;
    margin: 16rpx 0 2rpx;
    color: #333333;
    .stick_left{
      font-size: 28rpx;
      line-height: 40rpx;
      padding: 16rpx 52rpx;
      position: relative;
      z-index: 0;
      .card_icon{
        width: 74rpx;
        height: 58rpx;
        margin-bottom: 4rpx;
      }
    }
  }
  .img-card {
    width: 376rpx;
    height: 300rpx;
    position: absolute;
    right: 16rpx;
    z-index: 2;
    bottom: -55rpx;
  }
  .credit-title {
    font-size: 32rpx;
    font-size: 28rpx;
    text-align: center;
    line-height: 40rpx;
  }
  .credit_btn{
    line-height: 52rpx;
    border: 2rpx solid #999999;
    border-radius: 8rpx;
    padding: 0 20rpx;
    font-size: 26rpx;
    text-align: center;
    height: 52rpx;
    box-sizing: border-box;
  }
  .credit-box {
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    z-index: 1;
    padding: 0 40rpx;
    flex: 1;
    .credit-num {
      display: flex;
      align-items: baseline;
      font-size: 52rpx;
      font-weight: 500;
      text-align: center;
      color: #333333;
      .num-width {
        max-width: 340rpx;
      }
      .icon-right {
        width: 18rpx;
        height: 24rpx;
      }
    }

    .credit-tips {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      font-weight: 400;
      color: #cccccc;

      .icon-warn {
        width: 24rpx;
        height: 24rpx;
        margin-right: 8rpx;
      }
    }
}
.login_box {
    position: fixed;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.75);
    bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
    bottom: calc(var(--padding) + env(safe-area-inset-bottom));
    bottom: calc(var(--padding));
    height: 88rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #fff;
    padding: 14rpx 32rpx;
    box-sizing: border-box;
    .lg_btn {
        width: 152rpx;
        height: 60rpx;
        line-height: 60rpx;
        background: #f84842;
        border-radius: 12rpx;
        font-size: 28rpx;
        font-weight: 600;
        text-align: center;
        color: #fff;
    }
}
</style>
