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
        :overFlow="true"
        :fixed="true"
        @leftCallBack="$leftBack"
		:fixedNum="9"
    >
        <view class="search_box" slot="title_cont" id="titleContBox">
            <image class="search_icon" src="../static/productList/search_icon01.png" mode="aspectFill"></image>
            <view class="swiper_box" @click="toSearchHandle">
                <view v-if="searchValue" style="color: #333" class="txt_ov_ell1">
                    {{ searchValue }}
                    <view class="sel_del" @click.stop="selDelHandle"></view>
                </view>
                <view v-else>搜优惠 更便宜</view>
            </view>
        </view>
    </xh-navbar>
    <view class="mescroll_box">
        <mescroll-uni
            ref="mescrollRef"
            @init="mescrollInit"
            :height="mescrollHeight"
            :down="downOption"
            @down="downCallback"
            :up="upOption"
            @up="upCallbackSearch"
            @emptyclick="emptyClick"
        >
            <!-- <view class="selTab_sticky">
                <selTabs
                    :selTabID="selTabID"
                    :selTabList="selTabList"
                    :isHasCoupon="isHasCoupon"
                    @changeCheck="changeCheckHandle"
                    @selTab="selTabHandle"
                ></selTabs>
            </view> -->
            <good-list
                :list="jdGoods"
                :isSearchJdModel="true"
                :isBolCredits="true"
                :isJdLink="true"
                :isShowBanner="true"
                :isShowProfit="true"
                @notEnoughCredits="notEnoughCreditsHandle"
                v-if="jdGoods.length"
            ></good-list>
            <block v-if="pddGoods.length">
                <view class="list_lab" >以下优惠商品由拼多多提供</view>
                <good-list
                    :list="pddGoods"
                    :isSearchJdModel="true"
                    :isBolCredits="true"
                    :isJdLink="true"
                    :isShowProfit="true"
                    @notEnoughCredits="notEnoughCreditsHandle"
                ></good-list>
            </block>
            <!-- 列表为空时呈现 -->
            <view class="empty_box fl_col_cen" v-if="isEmpty">
                <image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
                <view>{{ empty.tip }}</view>
            </view>
            <view class="you_like-title" id="stickyTitleId" v-if="goods.length">
                <image class="left-icon" src="https://file.y1b.cn/store/1-0/24718/6698cd1ab8927.png" mode="aspectFill"></image>
                为你推荐
                <image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
            </view>
            <good-list
                v-if="goods.length"
                :list="goods"
                :isJdModel="true"
                :isBolCredits="true"
                :isJdLink="true"
                :isShowProfit="true"
                @notEnoughCredits="notEnoughCreditsHandle"
            ></good-list>
        </mescroll-uni>
    </view>
    <pointUpgradeDia ref='pointUpgradeDia' @happyGet='getHandle'/>
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
import { groupSearch } from '@/api/modules/pddShop.js';
import { taskNum } from '@/api/modules/task.js';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import { mapActions, mapGetters } from 'vuex';
import meTabs from './content/me-tabs.vue';
import MescrollItem from "./content/mescroll-swiper-item.vue";
import selTabs from './content/selTabs.vue';
export default {
    mixins: [MescrollMixin, goDetailsFun, groupRecommendMixin], // 使用mixin
    components: {
		meTabs,
        goodList,
        MescrollItem,
        exchangeFailed,
        serviceCredits,
        selTabs
    },
    data() {
        return {
			imgUrl: getImgUrl(),
            jdGoods:[],
            pddGoods: [],
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
            tabs:[],
            downOption:{
                native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
            },
            searchValue: '',
            is_search: 0,
            exchangeFailedShow: false, // 牛金豆不足的弹窗
            serviceCreditsShow: false, // 赚取牛金豆的弹窗
            _RewardedVideoAd: null, // 激励视频
			adunit: 'adunit-bc00b5948e4bbd52',
            currentIndex: 0,
            lastOddItem: null,
            source: '',
            is_pdd: 0, // 0： 乐刷 1：京东 2：拼多多 3：拼多多无券；查找京东商品后传入
            searchPageNum: 1,
            selTabList: [
                {
                    id: 0,
                    label: '综合',
                    paramsValue: ''
                },
                {
                    id: 1,
                    label: '销量',
                    paramsValue: ''
                },
                {
                    id: 2,
                    label: '价格',
                    paramsValue: ''
                },
                {
                    id: 3,
                    label: '仅有券',
                    paramsValue: ''
                }
            ],
            selTabID: 0,
            isHasCoupon: true,
            isRequestNum: 0,
        };
    },
    computed:{
        ...mapGetters(['userInfo', 'isAutoLogin']),
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            return mescrollHeight + 'px';
        },
    },
    watch: {
        jdGoods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        },
        // 拼多多搜索结果的监听 - 加载下拉下一页的使用
        pddGoods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if((this.jdGoods.length <= 6) && (newValue.length <= 6)) {
                this.mescroll.triggerUpScroll();
            }
        },
        // 猜你喜欢推荐的品
        goods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        },
    },
    onLoad(option) {
        this.getUserInfo();
        if(option.searchValue){
            this.searchValue = decodeURIComponent(option.searchValue);
            this.is_search = option.is_search;
        }
        if(option.typeIndex)  this.tabIndex = Number(option.typeIndex) || 0;
        if(option.source) this.source = option.source;
        /*初始化激励视频*/
		this.initRewardedVideoAd();
    },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        changeCheckHandle(checkSel) {
            this.isHasCoupon = checkSel;
            this.selUpdateDownCallbackInit();
        },
        selTabHandle(id) {
            this.selTabID = id;
            this.selUpdateDownCallbackInit();
        },
        // 分享的文案获取
        specialLisShareHandle({ share_word, share_img }) {
            this.currentSharePageObj.btnShareObj = {
                share_title: share_word,
                share_img
            }
        },
        animationfinishHandle(event){
            this.currentIndex = event.detail.current;
        },
        // 页面的滚动事件
        onPageScroll(event) {
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
        async downCallbackInit(page) {
            this.$refs.mescrollRefInit.mescroll.endSuccess();
            if(this.jdGoods.length){
                this.is_pdd = 0;
                this.searchPageNum = 1;
                this.mescroll.resetUpScroll();
            }
        },
        selUpdateDownCallbackInit() {
            this.is_pdd = 0;
            this.searchPageNum = 1;
            this.mescroll.resetUpScroll();
        },
        downCallback() {
            this.is_pdd = 0;
            this.searchPageNum = 1;
            this.mescroll.resetUpScroll();
        },
        async upCallbackSearch(page) {
            // 搜索无结果 请求推荐列表的内容
			if(this.isRecommendRequest) return this.requestRem(page);
            const params = {
                page: this.searchPageNum,
                size: 20,
                keyword: this.searchValue,
                is_pdd: this.is_pdd,
            }
            // if(this.isHasCoupon) params.has_coupon = 1;
            // if(this.selTabID == 1) params.sale_sort = 1;
            // if(this.selTabID == 2) params.price_sort = 1;
            // 搜索请求
            if(this.is_pdd > 1) return this.searchPddList(params, page);
            this.searchJdList(params, page);
        },
        async searchJdList(params, page) {
            const res = await groupSearch(params).catch(() => { this.mescroll.endErr() });
            if(page.num == 1) {
                this.jdGoods = [];
                this.pddGoods = [];
            };
            if(res.code != 1) {
                this.mescroll.endSuccess(0);
                this.is_pdd += 1;
                this.searchPageNum = 1;
                this.mescroll.triggerUpScroll();
                return;
            };
            let { list, total_count } = res.data;
            this.jdGoods = this.jdGoods.concat(list);
            this.searchPageNum += 1;
            this.mescroll.endBySize(list.length, total_count);
            const isNextPage = (this.searchPageNum * params.size) < total_count;
            if(!isNextPage) {
                this.is_pdd += 1;
                this.searchPageNum = 1;
                this.isRequestNum = 0;
                this.mescroll.triggerUpScroll();
                return;
            }
            if(isNextPage && !list.length && this.isRequestNum < 2) {
                this.isRequestNum += 1;
                this.mescroll.triggerUpScroll();
            }
            this.isRequestNum = 0;
        },
        async searchPddList(params, page) {
            const res = await groupSearch(params).catch(()=>{ this.mescroll.endErr() });
            if(res.code != 1) return this.searchEmpty(page);
            let { list, total_count } = res.data;
            this.searchPageNum += 1;
            this.pddGoods = this.pddGoods.concat(list);
            if(list.length) return this.mescroll.endSuccess(10, true);
            // 搜索无结果
            const isNextPage = (this.searchPageNum * params.size) < total_count;
            if(isNextPage && !list.length && this.isRequestNum < 2) {
                this.isRequestNum += 1;
                this.mescroll.endSuccess(10, true);
                this.mescroll.triggerUpScroll();
            }
            if(!isNextPage && (this.is_pdd < 3)) {
                this.is_pdd +=1;
                this.searchPageNum = 1;
                this.isRequestNum = 0;
                this.mescroll.endSuccess(10, true);
                this.mescroll.triggerUpScroll();
                return;
            }
            return this.searchEmpty(page);
        },
        searchEmpty(page) {
            if(!this.jdGoods.length && !this.pddGoods.length && this.is_pdd == 3) {
                this.isEmpty = true;
                this.isRecommendRequest = true;
                this.requestRem(page);
                return;
            }
            this.mescroll.endSuccess(0);
        },
        // 主动触发下拉刷新
        triggerDownScroll(){
            this.mescroll.triggerDownScroll();
        },
        selDelHandle() {
            this.$redirectTo(`/pages/userModule/productList/search?placeholderValue=${this.searchValue}&backDelta=2`)
        },
        toSearchHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            if(this.source == 'home') return this.$leftBack();
            const pathUrl = '/pages/userModule/productList/search';
            if(this.searchValue) return this.$redirectTo(`${pathUrl}?inputValue=${encodeURIComponent(this.searchValue)}`);
        },
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
.mescroll_box{
    margin-top: 14rpx;
    height: 100%;
    // background-color: #fff;
    background: rgba($color: #f7f7f7, $alpha: .8);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    overflow: hidden;
    padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
    padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
}
.search_box{
    font-size: 26rpx;
    color: #999;
    height: 68rpx;
    background: rgba(255,255,255,0.75);
    border-radius: 16rpx;
    box-sizing: border-box;
    padding: 0 2rpx 0 20rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    line-height: 36rpx;
    position: absolute;
    // top: 6rpx;
    left: 72rpx;
    width: 454rpx;
    top: 50%;
    transform: translateY(-50%);
    .search_icon{
        width: 28rpx;
        height: 28rpx;
        margin-right: 20rpx;
    }
    .swiper_box{
        height: 100%;
        flex: 1;
        line-height: 68rpx;
        width: 0;
        .txt_ov_ell1 {
            padding-right: 72rpx;
        }
        .sel_del{
            background: url("https://file.y1b.cn/store/1-0/24628/667e8cb8f273b.png") 0 0 / 100% 100%;
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            right: 16rpx;
            top: 50%;
            transform: translateY(-50%);
        }
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
