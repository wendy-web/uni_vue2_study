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
        :leftImage="imgUrl+'/static/images/left_back.png'"
  	    navbarImage="https://file.y1b.cn/store/1-0/2361/64784f6016d2d.png"
        titleAlign="titleRight"
        navbarImageMode="widthFix"
		:paddingBottomHeight="paddingBottomHeight"
        :overFlow="true"
        :fixed="true"
        @leftCallBack="$leftBack"
		:fixedNum="9"
    >
        <view class="title_box" slot="title" id="titleBox">
            <view class="title_left">
                <image class="title_img" src="https://file.y1b.cn/store/1-0/2387/64d0c73fc4c67.png" mode="aspectFill"></image>
            </view>
            领券下单更便宜
        </view>
        <view class="search_box"
            slot="title_cont"
            id="titleContBox"
            :style="{ top: searchTop +'px', width: searchWidth + 'px', left: searchLeft + 'px' }"
        >
            <block v-if="!searchValue">
                <image class="search_icon" src="../static/productList/search_icon01.png" mode="aspectFill"></image>
                <view class="line"></view>
            </block>
            <view class="swiper_box" @click="toSearchHandle">
                <view v-if="searchValue" style="color: #333" class="txt_ov_ell1">{{ searchValue }}</view>
                <!-- 无搜索的推荐文本轮播 -->
                <swiper v-else-if="textList.length"
                    class="swiper"
                    style="height: 100%;"
                    :autoplay="true"
                    interval="3000"
                    :duration="300"
                    :circular="true"
                    :vertical="true"
                    :current="currentIndex"
                    @animationfinish="animationfinishHandle"
                >
                    <swiper-item
                        v-for="(item, index) in textList" :key="index"
                        class="swiper_item"
                        catchtouchmove='onTouchMove'
                    >
                    {{ item }}
                    </swiper-item>
                </swiper>
                <view v-else>请搜索喜欢的商品</view>
            </view>
            <view class="search_btn" v-if="!searchValue" @click="searchRequireHandle">搜索</view>
        </view>
    </xh-navbar>
    <!-- <view class="search_box"  @click="toSearchHandle">
        <image class="search_icon" src="../static/productList/search_icon01.png" mode="aspectFill"></image>
        <view class="line"></view>
        {{ searchValue ||'请搜索喜欢的商品'}}
    </view> -->
    <!-- tab的切换 -->
    <view
        class="tabs_box sticky-tabs"
        v-if="!searchValue"
        :style="{top:stickyTop +'px'}"
    >
        <me-tabs
            v-model="tabIndex"
            :tabs="tabs"
            scroll="true"
            :height="tabHeight"
        ></me-tabs>
    </view>
    <view class="good_list-box" v-if="!searchValue">
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
    <view class="mescroll_box" v-else>
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
            <good-list
                :list="goods"
                :isSearchJdModel="true"
                :isBolCredits="true"
                :isJdLink="true"
                :isShowBanner="true"
                @notEnoughCredits="notEnoughCreditsHandle"
                v-if="goods.length"
            ></good-list>
            <block v-if="pddGoods.length">
                <view class="list_lab" >以下优惠商品由拼多多提供</view>
                <good-list
                    :list="pddGoods"
                    :isSearchJdModel="true"
                    :isBolCredits="true"
                    :isJdLink="true"
                    @notEnoughCredits="notEnoughCreditsHandle"
                >
                </good-list>
            </block>

            <!-- 列表为空时呈现 -->
            <view class="empty_box fl_col_cen" v-if="isEmpty">
                <image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
                <view>{{ empty.tip }}</view>
            </view>
            <view class="you_like-title" id="stickyTitleId" v-if="recommendGoods.length">
                <image class="left-icon" :src="imgUrl +'static/shopMall/love_left_icon.png'" mode="aspectFill"></image>
                为你推荐
                <image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
            </view>
            <good-list
                v-if="recommendGoods.length"
                :list="recommendGoods"
                :isJdModel="true"
                :isBolCredits="true"
                :isJdLink="true"
                @notEnoughCredits="notEnoughCreditsHandle"
            ></good-list>
        </mescroll-uni>
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
import { groupRecommend } from '@/api/modules/index.js';
import {
    goodsQuery,
    jdGroup,
    jingfen,
    keywordList,
    material
} from '@/api/modules/jsShop.js';
import { groupSearch } from '@/api/modules/pddShop.js';
import { taskNum } from '@/api/modules/task.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import specialLisMiniPage from "@/components/specialLisMiniPage.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import createRewardVideoAd from "@/utils/createRewardVideoAd.js";
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters } from 'vuex';
import meTabs from './content/me-tabs.vue';
import MescrollItem from "./content/mescroll-swiper-item.vue";
export default {
    mixins: [MescrollMixin, goDetailsFun, configurationFun, shareMixin], // 使用mixin
    components: {
		meTabs,
        goodList,
        MescrollItem,
        exchangeFailed,
        serviceCredits,
        configurationDia,
        specialLisMiniPage
    },
    data() {
        return {
			imgUrl: getImgUrl(),
            goods:[],
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
            recommendGoods: [],
            pageNum: 1,
            groupId_index: 0,
            tabs:[],
            tabIndex: 0, // tab下标
            downOption:{
                native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
            },
            searchValue: '',
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
            is_pdd: 0, // 0： 乐刷 1：京东 2：拼多多；查找京东商品后传入
            searchPageNum: 1
        };
    },
    computed:{
        ...mapGetters(['userInfo', 'isAutoLogin']),
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            if(!this.searchValue) {
                mescrollHeight = mescrollHeight - uni.upx2px(this.tabHeight);
            }
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
        goods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if(newValue.length <=6) {
                this.mescroll.triggerUpScroll();
            }
        },
        recommendGoods(newValue, oldValue) {
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        },
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
        if(option.searchValue){
            this.searchValue = decodeURIComponent(option.searchValue);
            this.is_search = option.is_search;
            this.paddingBottomHeight = 0;
            this.scroll_top = 80; // 模拟滚动的内容
        }
        if(option.typeIndex) {
            this.tabIndex = Number(option.typeIndex);
        }
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
            this.titleBoxDom = await this.initWarpRect('titleBox');
            this.titleContBoxDom = await this.initWarpRect('titleContBox');
        },
        initWarpRect(id) {
            return new Promise(resolve => {
                setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
                    let query = uni.createSelectorQuery();
                    // #ifndef MP-ALIPAY
                    query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                    // #endif
                    query.select('#' + id).boundingClientRect(data => {
                        resolve(data)
                    }).exec();
                }, 20)
            })
        },
        // 页面的滚动事件
        onPageScroll(event) {
            if(this.searchValue) return;
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
            if (!this.searchValue) {
                let res = await jdGroup();
                let _tab = res.data.map(item => {
                    return {
                        ...item,
                        query: jingfen
                    }
                })
                this.tabs = _tab;
            }
        },
        async downCallbackInit(page) {
            if(!this.searchValue) {
                await this.initTabs();
                if(page.isDownScrolling) {
                    const currentIndex = this.tabIndex < (this.tabs.length - 1) ? this.tabIndex : (this.tabs.length - 1);
                    let mescroll = this.getMescroll(currentIndex);
                    let compoMescroll = this.getMescroll(currentIndex, true);
                    compoMescroll.init_groupIdIndex();
                    mescroll.resetUpScroll();
                }
                // return;
            }
            this.$refs.mescrollRefInit.mescroll.endSuccess();
            if(this.goods.length){
                this.is_pdd = 0;
                this.searchPageNum = 1;
                this.mescroll.resetUpScroll();
            }
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
                is_pdd: this.is_pdd
            }
            // 搜索请求
            if(this.is_pdd > 1) {
               return this.searchPddList(params, page)
            }
            this.searchJdList(params, page);
        },
        async searchJdList(params, page) {
            const res = await groupSearch(params).catch(()=>{ this.mescroll.endErr() });
            let { list, total_count } = res.data;
            if(page.num == 1) {
                this.goods = [];
                this.pddGoods = [];
            };
            this.goods = this.goods.concat(list);
            this.searchPageNum += 1;
            this.mescroll.endBySize(list.length, total_count);
            if(this.searchPageNum * params.size >= total_count) {
                this.is_pdd += 1;
                this.searchPageNum = 1;
                this.mescroll.triggerUpScroll();
            }
        },
        async searchPddList(params, page) {
            const res = await groupSearch(params).catch(()=>{ this.mescroll.endErr() });
            let { list, total_count } = res.data;
            this.searchPageNum += 1;
            this.pddGoods = this.pddGoods.concat(list);
            // this.mescroll.endBySize(list.length, total_count);
            if(list.length) {
                return this.mescroll.endSuccess(10, true);
            }
            // this.mescroll.endUpScroll(true);
            // if(!list.length) this.mescroll.showEmpty();
            // 搜索无结果
            if(!this.goods.length && !this.pddGoods.length && this.is_pdd == 3) {
                this.isEmpty = true;
                this.isRecommendRequest = true;
                this.requestRem(page);
            }
            if(this.is_pdd == 2) {
                this.is_pdd = 3;
                this.searchPageNum = 1;
                this.mescroll.endSuccess(10, true);
                this.mescroll.triggerUpScroll();
            }
            this.mescroll.endSuccess(0);
        },
        async requestRem(page) {
            if(!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: 8 });
                if(recRes.code != 1 || !recRes.data) return this.mescroll.endSuccess(0);
                this.groupRecommendData = recRes.data;
            }
            const {
                id,
                cid,
                cid2,
                cid3,
                eliteId,
                groupId,
                type
            } = this.groupRecommendData;
            let pageNum = this.pageNum;
            let params = {
                id,
                page: pageNum,
                size: 10,
            }
            let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch(type) {
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
            };
            queryApi(params).then(res => {
                const {
                    list,
                    total_count
                } = res.data;
                // 设置列表数据
                if( page.num == 1 ) {
                    this.recommendGoods = [];
                    this.pageNum = 1;
                    this.lastOddItem = null;
                }; //如果是第一页需手动制空列表
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = (pageNum * params.size) < total_count;
                if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                    // 无下一页
                    this.groupId_index += 1;
                    this.mescroll.endSuccess(total_count, true);
                    this.pageNum = 0;
                } else {
                    this.mescroll.endSuccess(list.length || total_count, isNextPage);
                }
                if(list.length == 0 && (pageNum * params.size) < total_count){
                    this.mescroll.triggerUpScroll();
                }
                if(this.lastOddItem) {
                    this.recommendGoods.push(this.lastOddItem);
                    this.lastOddItem = null;
                }
                this.pageNum += 1;
                this.recommendGoods = this.recommendGoods.concat(list); // 追加新数据
                const goodLength = this.recommendGoods.length;
                if(goodLength % 2 && goodLength > 6) {
                    this.lastOddItem = this.recommendGoods.pop();
                }
            }).catch(() => this.mescroll.endErr());
        },
        // 轮播菜单
        swiperChange(e){
            this.tabIndex = e.detail.current;
        },
        // 主动触发下拉刷新
        triggerDownScroll(){
            this.mescroll.triggerDownScroll();
        },
        toSearchHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            if(this.source == 'home')return this.$leftBack();
            const pathUrl = '/pages/userModule/productList/search';
            const placeholderValue = this.textList.length ? this.textList[this.currentIndex] : '';
            if(this.searchValue) return this.$redirectTo(`${pathUrl}?inputValue=${encodeURIComponent(this.searchValue)}`);
            this.$go(`${pathUrl}?placeholderValue=${placeholderValue}`);
        },
        // 搜索按钮
        searchRequireHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            const recommendTxt = this.textList.length ? this.textList[this.currentIndex] : '';
            if(!recommendTxt) return this.$go('/pages/userModule/productList/search');
            this.$go(`/pages/userModule/productList/index?searchValue=${encodeURIComponent(recommendTxt)}&is_search=1`);
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
.sticky-tabs{
    z-index: 99;
    position: sticky;
    top: var(--window-top);
    // background-color: #fff;
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
.title_box{
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    flex: 1;
    color: #666666;
    line-height: 26rpx;
}
.title_left {
    width: 172rpx;
    height: 48rpx;
    position: relative;
    margin: 8rpx 15rpx 0;
    .title_img{
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
.search_box{
    font-size: 26rpx;
    color: #999;
    height: 68rpx;
    background: #ffffff;
    border-radius: 38rpx;
    box-sizing: border-box;
    padding: 0 2rpx 0 32rpx;
    display: flex;
    align-items: center;
    border: 3rpx solid #f04138;
    box-sizing: border-box;
    line-height: 36rpx;
    position: absolute;
    // top: 92rpx; // 68 + 24
    // left: 50%;
    // transform: translateX(-50%);
    // width: 702rpx;
    .search_icon{
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
    .swiper_box{
        height: 100%;
        flex: 1;
        line-height: 68rpx;
        width: 0;
        .swiper_item{
            height: 100%;
        }
    }
    .search_btn{
        width: 120rpx;
        line-height: 56rpx;
        background: linear-gradient(135deg,#f9675f, #f84842);
        border-radius: 32rpx;
        font-size: 28rpx;
        text-align: center;
        color: #ffffff;
        margin-right: 4rpx;
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
</style>
