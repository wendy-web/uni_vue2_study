<template>
<view class="product">
    <xh-navbar
        leftImage="/static/images/left_back.png"
	    navbarColor="#fff"
        titleAlign="titleRight"
        navbarImageMode="widthFix"
        :fixed="true"
        :overFlow="true"
        @leftCallBack="$leftBack"
    >
        <view class="search_box" slot="title">
            <image class="search_icon" src="/static/images/home/search_icon.png" mode="aspectFill"></image>
            <view class="swiper_box" @click="toSearchHandle">
                <view v-if="searchValue" style="color: #333" class="txt_ov_ell1">
                    {{ searchValue }}
                    <view class="sel_del" @click.stop="selDelHandle"></view>
                </view>
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
                    <swiper-item class="swiper_item"
                        v-for="(item, index) in textList" :key="index"
                    >{{ item }}
                    </swiper-item>
                </swiper>
                <view v-else>请搜索喜欢的商品</view>
            </view>
            <view class="search_btn" v-if="!searchValue" @click="searchRequireHandle">搜索</view>
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
        >
            <view class="selTab_sticky" v-if="is_rebate">
                <selTabs
                    :selTabID="selTabID"
                    :selTabList="selTabList"
                    :platformType="platformType"
                    @changeCheck="changeCheckHandle"
                    @selTab="selTabHandle"
                ></selTabs>
            </view>
            <good-list
                :list="goods"
                :isSearchItem="true"
                :isRebate="is_rebate"
            ></good-list>
            <!-- 列表为空时呈现 -->
            <view class="empty_box fl_col_cen" v-if="isEmpty">
                <image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
                <view>{{ empty.tip }}</view>
            </view>
            <view class="you_like-title" id="stickyTitleId" v-if="recommendGoods.length">
                <image class="left-icon" src="../static/love_left_icon.png" mode="aspectFill"></image>
                为你推荐
                <image class="right-icon" src="../static/love_right_icon.png" mode="aspectFill"></image>
            </view>
            <good-list
                :list="recommendGoods"
                :isHeightAutoItem="Boolean(is_rebate)"
                :isRebate="is_rebate"
            ></good-list>
        </mescroll-uni>
    </view>
</view>
</template>
<script>
import {
    groupRecommend,
    groupSearch,
    keywordList,
} from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters } from 'vuex';
import selTabs from './content/selTabs.vue';
import getQueryApi from "@/utils/queryListApi.js";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        goodList,
        selTabs
    },
    data() {
        return {
            goods:[],
            recommendGoods: [],
            upOption: {
                page: {
                    num : 0 ,
                    size : 1,
                    time : null
                },
                empty: {
					use: false,
                },
            },
            empty: {
                tip: '别灰心，换个词试试', // 提示
                icon: `https://file.y1b.cn/store/1-0/24131/65ba3c86e5ee6.png`
            },
            downOption:{
                native: true // 必须配置此项，且需在pages.json配置"enablePullDownRefresh" : true
            },
            searchValue: '',
            textList: [],
            currentIndex: 0,
            isEmpty: false,
            isRecommendRequest: false,
            pageNum: 1,
            groupId_index: 0,
            lastOddItem: null,
            is_rebate: '',
            is_pdd: 0,
            searchPageNum: 1,
            isRequestNum: 0,
            selTabList: [
                {
                    id: 0,
                    label: '综合',
                    paramsValue: ''
                },
                {
                    id: 1,
                    label: '收益率',
                    paramsValue: ''
                },
                {
                    id: 2,
                    label: '价格',
                    paramsValue: ''
                },
                {
                    id: 3,
                    paramsValue: ''
                }
            ],
            selTabID: 0,
            isRequestNum: 0,
            platformType: 1,
        };
    },
    computed:{
        ...mapGetters(['userInfo']),
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            return mescrollHeight + 'px';
        },
    },
    watch: {
        goods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        },
    },
    onShareAppMessage(data) {
        let share = {
            title: '领券下单更便宜',
            path: `pages/homeModule/productList/index?searchValue=${this.searchValue}`
        }
        return share;
    },
    onLoad(option) {
        if(option.searchValue){
            this.searchValue = option.searchValue;
            this.scroll_top = 80; // 模拟滚动的内容
        }
        if(option.is_rebate) this.is_rebate = option.is_rebate;
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
        changeCheckHandle(checkSel) {
            this.platformType = checkSel;
            this.selUpdateDownCallbackInit();
        },
        selTabHandle(id) {
            this.selTabID = id;
            this.selUpdateDownCallbackInit();
        },
        // 切换条件更新列表信息
        selUpdateDownCallbackInit() {
            this.is_pdd = 0;
            this.searchPageNum = 1;
            this.isRecommendRequest = false;
            this.isEmpty = false;
            this.mescroll.resetUpScroll();
        },
        animationfinishHandle(event){
            this.currentIndex = event.detail.current;
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
            }).catch((e) => {});
        },
        // 页面的滚动事件
        onPageScroll(e) {
        },
        selDelHandle() {
            // this.searchValue = '';
            // this.toSearchHandle();
            this.$redirectTo(`/pages/homeModule/productList/search?placeholderValue=${this.searchValue}&backDelta=2&is_rebate=${this.is_rebate}`);
        },
        async downCallbackInit(page) {
            this.is_pdd = 0;
            this.isRequestNum = 0;
            this.searchPageNum = 1;
            this.mescroll.resetUpScroll();
        },
        downCallback(page) {
            this.is_pdd = 0;
            this.isRequestNum = 0;
            this.searchPageNum = 1;
            this.mescroll.resetUpScroll();
        },
        searchEmpty(page) {
            if(!this.goods.length && this.is_pdd == 3) {
                this.isEmpty = true;
                this.isRecommendRequest = true;
                this.requestRem(page);
                return;
            }
        },
        async upCallbackSearch(page) {
            let queryApi = groupSearch;
            const params = {
                page: this.searchPageNum,
                size: 10,
                is_rebate: this.is_rebate,
                is_pdd: this.is_pdd
            }
            if(this.platformType) params.platform_type = this.platformType;
            if(this.selTabID == 1) params.sale_sort = 1;
            if(this.selTabID == 2) params.price_sort = 1;
            if(this.searchValue) {
                // 文字的搜索
                params.keyword = this.searchValue;
                params.is_search = 1;
            }
            // 搜索无数据 - 请求推荐的品
            if(this.isRecommendRequest) return this.requestRem(page);
            const res = await queryApi(params).catch(()=>{ this.mescroll.endErr() });
            if(page.num == 1) {
                this.goods = [];
                this.recommendGoods = [];
                this.isRecommendRequest = false;
            };
            if(res.code != 1 || !res.data) {
                this.mescroll.endSuccess();
                this.searchPageNum = 1;
                this.is_pdd += 1;
                (this.is_pdd < 3) && this.mescroll.triggerUpScroll();
                if(this.is_pdd == 3) this.searchEmpty(page);
                return;
            }
            let { list = [], total_count } = res.data;
            const isNextPage = this.searchPageNum * params.size <= total_count;
            this.searchPageNum += 1;
            this.goods = this.goods.concat(list);
            this.mescroll.endSuccess(list.length, isNextPage);
            this.searchEmpty(page);
            if((!isNextPage && this.is_pdd < 3)) {
                this.is_pdd += 1;
                this.isRequestNum += 0;
                this.searchPageNum = 1;
                this.mescroll.triggerUpScroll();
            }
            if(!list.length && this.isRequestNum < 2) {
                this.isRequestNum += 1;
                this.mescroll.triggerUpScroll();
                return;
            }
            this.isRequestNum = 0;
        },
        async requestRem(page) {
            if(!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: 3 });
                if(recRes.code != 1 || !recRes.data) return this.mescroll.endSuccess(0);
                this.groupRecommendData = recRes.data;
            }
            const { groupId, type } = this.groupRecommendData;
            let pageNum = this.pageNum;
            let { params, queryApi } = getQueryApi({
                ...this.groupRecommendData,
                pageNum
            });
            params.is_rebate = this.is_rebate;
            const res = await queryApi(params).catch(() => this.mescroll.endErr());
            const { list, total_count } = res.data;
            if( page.num == 1 ) {
                this.recommendGoods = [];
                this.pageNum = 1;
                this.lastOddItem = null;
            }; // 如果是第一页需手动制空列表
            // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            let isNextPage = (pageNum * params.size) <= total_count;
            if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                // 无下一页
                this.groupId_index += 1;
                this.mescroll.endSuccess(total_count, true);
                this.pageNum = 0;
            } else {
                this.mescroll.endSuccess(list.length || total_count, isNextPage);
            }
            if(list.length < 1 && isNextPage){
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
        },
        toSearchHandle() {
            if(this.searchValue) {
                this.$redirectTo(`/pages/homeModule/productList/search?inputValue=${this.searchValue}&is_rebate=${this.is_rebate}`);
                return;
            }
            const placeholderValue = this.textList.length ? this.textList[this.currentIndex] : '';
            this.$redirectTo(`/pages/homeModule/productList/search?placeholderValue=${placeholderValue}&is_rebate=${this.is_rebate}`);
        },
        // 搜索按钮
        searchRequireHandle() {
            const recommendTxt = this.textList.length ? this.textList[this.currentIndex] : '';
            if(!recommendTxt){
                this.$redirectTo(`/pages/homeModule/productList/search`);
                return;
            }
            this.searchValue = recommendTxt;
            this.mescroll.resetUpScroll();
        }
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
}
.mescroll_box{
    height: 100%;
    background: rgba($color: #F4F5F9, $alpha: .8);
    overflow: hidden;
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
.search_box {
    flex: 1;
    font-size: 26rpx;
    color: #999;
    height: 64rpx;
    background: #f1f1f1;
    border-radius: 12rpx;
    box-sizing: border-box;
    padding: 0 2rpx 0 20rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    line-height: 36rpx;
    // position: absolute;
    position: relative;
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
        .sel_del {
            background: url("https://file.y1b.cn/store/1-0/24628/667e8cb8f273b.png") 0 0 / 100% 100%;
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            right: 16rpx;
            top: 50%;
            transform: translateY(-50%);
        }
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
        margin-right: 6rpx;
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
.list_lab {
    font-size: 26rpx;
    margin: 28rpx 0;
    color: #999;
    text-align: center;
}
.selTab_sticky {
    position: sticky;
    z-index: 1;
    top: 0;
    background: #fff;
    border-top: 2rpx solid #E9E9E9;
    margin-bottom: 16rpx;
}
</style>
