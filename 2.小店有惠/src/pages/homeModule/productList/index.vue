<template>
<view class="product">
    <image id="nav_bg" class="nav_bg" src="https://file.y1b.cn/store/1-0/2361/64784f6016d2d.png" mode="aspectFill"></image>
    <xh-navbar
        leftImage="/static/images/left_back.png"
  	    navbarImage="https://file.y1b.cn/store/1-0/2361/64784f6016d2d.png"
        titleAlign="titleRight"
        navbarImageMode="widthFix"
        :fixed="true"
        :overFlow="true"
        @leftCallBack="leftCallBack"
    >
        <view class="search_box" slot="title">
            <image class="search_icon" src="../static/search_icon.png" mode="aspectFill"></image>
            <view class="line"></view>
            <view class="swiper_box" @click="toSearchHandle">
                <view v-if="searchValue" style="color: #333">{{ searchValue }}</view>
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
                        v-for="(item, index) in textList"
                        :key="index"
                        class="swiper_item"
                    >
                    {{ item }}
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
            <good-list :list="goods" :isSearchItem="true">
            </good-list>
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
            <good-list :list="recommendGoods"></good-list>
        </mescroll-uni>
    </view>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import goodList from '@/components/goodList.vue';
import getViewPort from '@/utils/getViewPort.js';
import {
    material,
    jingfen,
    goodsQuery,
    keywordList,
    groupRecommend
} from '@/api/modules/jsShop.js';
import { mapGetters, mapActions } from 'vuex';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        goodList,
    },
    data() {
        return {
            goods:[],
            recommendGoods: [],
            upOption: {
                page: {
                    num : 0 ,
                    size : 2,
                    time : null
                },
                empty: {
					use: false,
                },
            },
            empty: {
                tip: '别灰心，换个词试试', // 提示
                icon: `/static/images/img_no_data.png`
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
            lastOddItem: null

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
            if(newValue.length <=6) {
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
            })
        },
        // 页面的滚动事件
        onPageScroll(e) {
        },
        async downCallbackInit(page) {
        },
        async upCallbackSearch(page) {
            let queryApi = goodsQuery;
            const params = {
                page: page.num,
                size: 6,
            }
            if(this.searchValue) {
                // 文字的搜索
                params.keyword = this.searchValue;
                params.is_search = 1;
            }
            if(!this.isRecommendRequest) {
                queryApi(params).then(res => {
                    let list = res.data ? res.data.list : [];
                    if(page.num == 1) this.goods = [];
                    this.goods = this.goods.concat(list);
                    // this.mescroll.endSuccess();
                    this.mescroll.endBySize(list.length, res.data.total_count);
                    if(!this.goods.length) this.isEmpty = true;
                    // 加载另一个
                    if(!this.goods.length) {
                        this.isRecommendRequest = true;
                        this.requestRem(page);
                        return;
                    }
                }).catch(()=>{ this.mescroll.endErr() });
            } else {
                this.requestRem(page);
            }
        },
        async requestRem(page) {
            if(!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: 3 });
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
            // const pageNum = page.num;
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
            queryApi(params).then(res=>{
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
                let isNextPage = (pageNum * params.size) <= total_count;
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
            }).catch(()=>{
                //联网失败, 结束加载
                // this.mescroll.endErr();
            });
        },
        toSearchHandle() {
            if(this.searchValue) {
                this.$redirectTo(`/pages/homeModule/productList/search?inputValue=${this.searchValue}`);
                return;
            }
            const placeholderValue = this.textList.length ? this.textList[this.currentIndex] : '';
            this.$redirectTo(`/pages/homeModule/productList/search?placeholderValue=${placeholderValue}`);
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
        },
        leftCallBack(){
            uni.navigateBack({
                fail: () => this.$switchTab('/pages/home/index')
            });
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
    margin-top: 14rpx;
    height: 100%;
    background: rgba($color: #f7f7f7, $alpha: .8);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
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
    flex: 1;
    margin-left: 20rpx;
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
</style>