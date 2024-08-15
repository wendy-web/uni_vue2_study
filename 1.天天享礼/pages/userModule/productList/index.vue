<template>
<view class="product">
<mescroll-body
    :sticky="true"
    ref="mescrollRefInit"
    @init="mescrollInit"
    @down="downCallbackInit"
    @up="upCallback"
    :up="upBodyOption"
>
    <image id="nav_bg" class="nav_bg" src="https://file.y1b.cn/store/1-0/2361/64784f6016d2d.png" mode="aspectFill"></image>
    <xh-navbar
        leftImage="https://file.y1b.cn/store/1-0/24629/667f888cec84d.png"
  	    navbarImage="https://file.y1b.cn/store/1-0/2361/64784f6016d2d.png"
        titleAlign="titleRight"
        navbarImageMode="widthFix"
		:paddingBottomHeight="paddingBottomHeight"
        :overFlow="true"
        :fixed="true"
        @leftCallBack="$leftBack"
		:fixedNum="9"
    >
        <view :class="['title_box', searchTop <= 10 ? 'opacity0' : '']" slot="title" id="titleBox">
            <view class="title_left">
                <image class="title_img" src="https://file.y1b.cn/store/1-0/2387/64d0c73fc4c67.png" mode="aspectFill"></image>
            </view>
            领券下单更便宜
        </view>
        <view class="search_box" slot="title_cont" id="titleContBox"
            :style="{ top: searchTop +'px', width: searchWidth + 'px', left: searchLeft + 'px' }"
        >
            <image class="search_icon" src="../static/productList/search_icon01.png" mode="aspectFill"></image>
            <view class="line"></view>
            <view class="swiper_box" @click="toSearchHandle">
                <!-- 无搜索的推荐文本轮播 -->
                <swiper v-if="textList.length"
                    class="swiper"
                    style="height: 100%;"
                    :autoplay="true"
                    interval="10000"
                    :duration="300"
                    :circular="true"
                    :vertical="true"
                    :current="currentIndex"
                    @animationfinish="animationfinishHandle"
                >
                    <swiper-item
                        v-for="(item, index) in textList" :key="index"
                        class="swiper_item txt_ov_ell1" catchtouchmove='onTouchMove'
                    >{{ item }}
                    </swiper-item>
                </swiper>
                <view v-else>搜优惠 更便宜</view>
            </view>
            <view class="search_btn" @click="searchRequireHandle">搜索</view>
        </view>
    </xh-navbar>
    <!-- tab的切换 -->
    <view class="tabs_box sticky-tabs"
        :style="{top:stickyTop +'px'}">
        <me-tabs
            v-model="tabIndex"
            :tabs="tabs"
            scroll="true"
            :height="tabHeight"
        ></me-tabs>
    </view>
    <view class="good_list-box">
        <swiper
            :style="{height: mescrollHeight}"
            :current="tabIndex"
            @change="swiperChange"
        >
            <swiper-item v-for="(tab,i) in tabs" :key="i">
                <mescroll-item
                    ref="mescrollItem"
                    :i="i"
                    :index="tabIndex"
                    :tabs="tabs"
                    :height="mescrollHeight"
					:disable-scroll="disableScroll"
                    @notEnoughCredits="notEnoughCreditsHandle"
                ></mescroll-item>
            </swiper-item>
        </swiper>
    </view>
    <pointUpgradeDia ref='pointUpgradeDia' @happyGet='getHandle'/>
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
    <!-- 商品专题的半屏组件 -->
    <specialLisMiniPage
        ref="specialLisMiniPage"
        @notEnoughCredits="notEnoughCreditsHandle"
        @specialLisShare="specialLisShareHandle"
        @isBannerClick="goodListBannerHandle"
    ></specialLisMiniPage>
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
</mescroll-body>
</view>
</template>
<script>
import {
    jdGroup,
    jingfen,
    keywordList
} from '@/api/modules/jsShop.js';
import { taskNum } from '@/api/modules/task.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl, warpRectDom } from '@/utils/auth.js';
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from 'vuex';
import meTabs from './content/me-tabs.vue';
import MescrollItem from "./content/mescroll-swiper-item.vue";
import selTabs from './content/selTabs.vue';
export default {
    mixins: [MescrollMixin, goDetailsFun, configurationFun, shareMixin], // 使用mixin
    components: {
		meTabs,
        goodList,
        MescrollItem,
        exchangeFailed,
        serviceCredits,
        configurationDia,
        specialLisMiniPage,
        selTabs
    },
    data() {
        return {
			imgUrl: getImgUrl(),
            upBodyOption: {
                use: false, // 主体框架只启用下拉刷新
            },
			isEmpty: false,
            empty: {
                tip: '别灰心，换个词试试', // 提示
                icon: `${getImgUrl()}/static/images/img_no_data.png`
            },
            upOption: {
                page: {
                    num : 0 ,
                    size : 3,
                    time : null
                },
                empty: {
					use: false,
                },
            },
            groupRecommendData: null,
            isRecommendRequest: false,
            pageNum: 1,
            groupId_index: 0,
            tabs:[],
            tabIndex: 0, // tab下标
            downOption:{
                native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
            },
            is_search: 0,
            exchangeFailedShow: false, // 牛金豆不足的弹窗
            serviceCreditsShow: false, // 赚取牛金豆的弹窗
            _RewardedVideoAd: null, // 激励视频
			adunit: 'adunit-bc00b5948e4bbd52',
            swiperHeight: '',
			disableScroll: true, // swiper列表是否禁止滚动
            tabHeight: 54,
            fixationValue: uni.upx2px(96),
            paddingBottomHeight: uni.upx2px(96),
            titleBoxDom: null,
            titleContBoxDom: null,
            scroll_top: 0,
            textList: [],
            currentIndex: 0,
            lastOddItem: null,
            source: '',
        };
    },
    computed:{
        ...mapGetters(['userInfo', 'isAutoLogin']),
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            mescrollHeight = mescrollHeight - uni.upx2px(this.tabHeight);
            return mescrollHeight + 'px';
        },
        stickyTop(){
            let viewPort = getViewPort();
			return viewPort.navHeight;
        },
        searchTop() {
            let initSearchTop = uni.upx2px(92);
            let differentValue = uni.upx2px(92) - uni.upx2px(6);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchTopValue = uni.upx2px(92) - scrollValue;
            if(searchTopValue < 0) {
                initSearchTop = uni.upx2px(6);
            } else if(searchTopValue > uni.upx2px(92)) {
                initSearchTop = uni.upx2px(92);
            } else {
                initSearchTop = searchTopValue
            }
            return initSearchTop;
        },
        searchWidth() {
            const titleBoxWidth = uni.upx2px(454);
            let differentValue = uni.upx2px(702) - uni.upx2px(454);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchWidthValue = uni.upx2px(702) - scrollValue;
            let value = 0;
            if(searchWidthValue < titleBoxWidth) {
                value = titleBoxWidth
            } else if(searchWidthValue > uni.upx2px(702)) {
                value = uni.upx2px(702)
            } else {
                value = searchWidthValue
            }
            return value;
        },
        searchLeft() {
            const titleBoxLeft = uni.upx2px(72);
            let differentValue = uni.upx2px(72) - uni.upx2px(24);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchLeftValue =  uni.upx2px(24) + scrollValue;
            let value = 0;
            if(searchLeftValue > titleBoxLeft) {
                value = titleBoxLeft;
            } else if(searchLeftValue < uni.upx2px(24)) {
                value = uni.upx2px(24);
            } else {
                value = searchLeftValue;
            }
            return value;
        }
    },
    watch: {
        tabIndex(i) {
            if(this.disableScroll) {
				this.disableScroll = false // 当disableScroll=true时,scroll-view的scrollTo会失效,需先开启,再置顶
                this.$nextTick(() => {
                    let mescroll = this.getMescroll(i)
                    mescroll && mescroll.scrollTo(0,0);
                    setTimeout(() => this.disableScroll = true, 300);
                })
            }
        }
    },
    onLoad(option) {
        this.getUserInfo();
        if(option.typeIndex)  this.tabIndex = Number(option.typeIndex) || 0;
        if(option.source) this.source = option.source;
        /*初始化激励视频*/
		this.initRewardedVideoAd();
        this.initDom();
        keywordList().then(res => {
            if(res.code == 1 && res.data) {
                this.textList = res.data;
            }
        })
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        warpRectDom,
        // 分享的文案获取
        specialLisShareHandle({ share_word, share_img }) {
            this.currentSharePageObj.btnShareObj = {
                share_title: share_word,
                share_img
            }
        },
        // 列表广告位 - 跳转至半屏推券
        goodListBannerHandle(item) {
            this.$refs.recommendDia.initGtData({
                ...item,
                interval_time: item.type_sid
            });
        },
        animationfinishHandle(event){
            this.currentIndex = event.detail.current;
        },
        async initDom() {
            this.titleBoxDom = await this.warpRectDom('titleBox');
            this.titleContBoxDom = await this.warpRectDom('titleContBox');
        },
        // 页面的滚动事件
        onPageScroll(event) {
            const scroll_top = Math.ceil(event.scrollTop);
            this.scroll_top = scroll_top;
            this.disableScroll = scroll_top <= this.fixationValue;
            let padding_height = this.fixationValue - scroll_top;
            this.paddingBottomHeight = (padding_height < 0) ? 0 : padding_height;
        },
        // 牛金豆不足，打开弹窗
        notEnoughCreditsHandle(){
            this.exchangeFailedShow = true;
        },
        // 去赚取牛金豆
        async goTaskHandle(){
            const res = await taskNum();
            this.exchangeFailedShow = false;
            if(!res.code) return this.$switchTab('/pages/tabBar/task/index');
            const { total_times, video_times } = res.data;
            if(total_times > 0) {
                this.serviceCreditsShow = true;
                // 次数大于0； 打开赚取牛金豆的弹窗
                if(video_times == 0) this.$refs.serviceCredits.setSwiperNum(1);
            }
        },
		// 关闭赚取牛金豆 并更新用户信息
        closeHandle() {
            this.getUserInfo();
            this.serviceCreditsShow = false;
        },
        //播放视频拿奖励
        initRewardedVideoAd() {
            this._RewardedVideoAd = createRewardVideoAd(
                this.adunit,
                (status) => {
                    this.$refs.serviceCredits.finishAdPlay();
                }
            );
            this._RewardedVideoAd.videoAdCreate();
        },
        showAdPlayHandle(){
			this._RewardedVideoAd.videoPlay(); // 视频的播放
        },
        // 获取指定下标的mescroll对象
        getMescroll(i, compo = false) {
            let mescrollItems = this.$refs.mescrollItem;
            if (mescrollItems) {
                let item = mescrollItems[i];
                if(compo && item) return item;
                if (item) return item.mescroll;
            }
            return null;
        },
        async initTabs() {
            let res = await jdGroup();
            let _tab = res.data.map(item => {
                return {
                    ...item,
                    query: jingfen,
                    groupId_index: 0
                }
            })
            this.tabs = _tab;
        },
        async downCallbackInit(page) {
            await this.initTabs();
            if(page.isDownScrolling) {
                const currentIndex = this.tabIndex < (this.tabs.length - 1) ? this.tabIndex : (this.tabs.length - 1);
                let mescroll = this.getMescroll(currentIndex);
                let compoMescroll = this.getMescroll(currentIndex, true);
                compoMescroll.init_groupIdIndex();
                mescroll.resetUpScroll();
            }
            this.$refs.mescrollRefInit.mescroll.endSuccess();
        },
        swiperChange(e){
            this.tabIndex = e.detail.current;
        },
        // 主动触发下拉刷新
        triggerDownScroll(){
            this.mescroll.triggerDownScroll();
        },
        toSearchHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            if(this.source == 'home') return this.$leftBack();
            const pathUrl = '/pages/userModule/productList/search';
            const placeholderValue = this.textList.length ? this.textList[this.currentIndex] : '';
            this.$go(`${pathUrl}?placeholderValue=${placeholderValue}`);
        },
        // 搜索按钮
        searchRequireHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            const recommendTxt = this.textList.length ? this.textList[this.currentIndex] : '';
            if(!recommendTxt) return this.$go('/pages/userModule/productList/search');
            this.$go(`/pages/userModule/productList/searchResult?searchValue=${encodeURIComponent(recommendTxt)}&is_search=1`);
        }
    },
    onUnload() {
        // 销毁视频的初始化
        this._RewardedVideoAd.videoAdDestroy();
    },
};
</script>
<style lang="scss">
page {
    background: rgba($color: #f7f7f7, $alpha: .8);
}
.sticky-tabs {
    z-index: 99;
    position: sticky;
    top: var(--window-top);
}
.title_box {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    flex: 1;
    color: #666666;
    line-height: 26rpx;
    transition: all .3s;
    &.opacity0 {
        opacity: 0;
    }
}
.title_left {
    width: 172rpx;
    height: 48rpx;
    position: relative;
    margin: 8rpx 15rpx 0;
    .title_img {
        width: 100%;
        height: 100%;
    }
    .title_icon {
        position: absolute;
        width: 143rpx;
        height: 23rpx;
        z-index: 1;
        bottom: -6rpx;
        right: -6rpx;
    }
}
.search_box {
    font-size: 26rpx;
    color: #999;
    height: 68rpx;
    box-sizing: border-box;
    padding: 0 2rpx 0 20rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    line-height: 36rpx;
    position: absolute;
    background: #fff;
    border: 2rpx solid #f04138;
    border-radius: 16rpx;
    .search_icon {
        width: 28rpx;
        height: 28rpx;
    }
    .line {
        width: 2rpx;
        height: 28rpx;
        background: #d1d1d1;
        border-radius: 200rpx;
        margin: 0 20rpx 0 16rpx;
    }
    .swiper_box {
        height: 100%;
        flex: 1;
        line-height: 68rpx;
        width: 0;
        .txt_ov_ell1 {
            padding-right: 72rpx;
        }
        .sel_del {
            background: url("https://file.y1b.cn/store/1-0/24628/667e8cb8f273b.png") 0 0 / 100% 100%;
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            right: 16rpx;
            top: 50%;
            transform: translateY(-50%);
        }
        .swiper_item {
            height: 100%;
        }
    }
    .search_btn {
        width: 128rpx;
        line-height: 56rpx;
        font-size: 28rpx;
        text-align: center;
        color: #ffffff;
        margin-right: 2rpx;
        background: linear-gradient(135deg,#f9675f, #f84842);
        border-radius: 12rpx;
    }
}
.nav_bg {
  width: 100%;
  height: 384rpx;
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
}
.tabs_box {
    margin-bottom: 24rpx;
    margin-top: 96rpx;
}
.good_list-box {
    position: relative;
    // background: rgba($color: #f7f7f7, $alpha: .8);
    // background: linear-gradient(180deg,#ffffff, #f7f7f7 12%);
    // border-radius: 32rpx 32rpx 0rpx 0rpx;
}
.list_lab{
    font-size: 26rpx;
    margin: 28rpx 0;
    color: #999;
    text-align: center;
}
.selTab_sticky {
    position: sticky;
    z-index: 1;
    top: 0;
}
</style>
