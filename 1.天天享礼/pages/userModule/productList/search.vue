<template>
<view class="search">
<xh-navbar
    :fixed="true"
    :leftImage="imgUrl+'/static/images/left_back.png'"
	navberColor="#fff"
    navbarImageMode="widthFix"
	@leftCallBack="$leftBack"
    :fixedNum="9"
    titleColor="#333"
    title="搜优惠 更便宜"
>
</xh-navbar>
<view class="cont_box" :style="{ top: navHeight + 'px' }">
<mescroll-uni
    :fixed="false"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
>
    <view class="search_input_cont">
        <view class="search_box">
            <view class="search_box-left">
                <image src="../static/productList/search_icon01.png" mode="aspectFill" class="search_icon"></image>
                <van-field
                    :value="inputValue"
                    :placeholder="placeholderValue || '搜优惠 更便宜'"
                    :border="false"
                    @confirm="confirmHandle"
                    @change="inputValueChange"
                    :focus="focusValue"
                    @focus="focusHandle"
                    @blur="blurHandle"
                    custom-style="font-size:26rpx;--field-input-text-color:#333333;background-color: transparent;padding: 0;"
                    clearable class="field_box"
                />
            </view>
            <view class="search_btn" @click="searchBtnHandle()">搜索</view>
        </view>
    </view>
    <scroll-view scroll-y="true" class="keyword_box" :style="{'--height': mescrollHeight }" v-if="keywordList.length">
        <view class="keyword_item" v-for="(item, index) in keywordList" :key="index">
            <view v-html="brightenKeyword(item.key)" @click="searchBtnHandle(item.key)"></view>
        </view>
    </scroll-view>
    <!-- search的关键字 -->
    <view class="search_cont" v-if="searList.length">
        <view class="sear_his">搜索历史</view>
        <image class="del_icon"
            src="../static/productList/del_icon.png"
            mode="aspectFill" @click="delListHandle"
        ></image>
    </view>
    <view class="search_list">
        <view class="search_list-item txt_ov_ell1"
            v-for="(item,index) in isShowSearList" :key="index"
            @click="searchBtnHandle(item)"
        >{{item}}</view>
        <view class="search_list-item" v-if="isShowNext" @click="isShowNext = false">
            <van-icon name="arrow-down" color="#999" />
        </view>
    </view>
    <view class="you_like-title" id="stickyTitleId" v-if="goods.length">
        <image class="left-icon" src="https://file.y1b.cn/store/1-0/24718/6698cd1ab8927.png" mode="aspectFill"></image>
        热搜爆品
        <image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
    </view>
    <good-list
        v-if="goods.length"
        :list="goods"
        :isJdModel="true"
        :isBolCredits="true"
        :isJdLink="true"
        @notEnoughCredits="notEnoughCreditsHandle"
    ></good-list>
</mescroll-uni>
</view>
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
import { delHistory, jdHistory, keyword } from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import meTabs from './content/me-tabs.vue';
export default {
    mixins: [MescrollMixin, serviceCreditsFun, groupRecommendMixin], // 使用mixin
    components: {
		meTabs,
        goodList,
        exchangeFailed,
        serviceCredits
    },
    computed:{
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight - uni.upx2px(126);
            return mescrollHeight + 'px';
        },
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        }
    },
    watch: {
        isShowNext(newValue) {
            if(newValue) {
                return this.isShowSearList = this.searList.slice(0, 8);
            }
            return this.isShowSearList = this.searList;
        },
        goods(newValue, oldValue) {
            if(oldValue.length == newValue.length) return;
            if(newValue.length <= 6) {
                this.mescroll.triggerUpScroll();
            }
        }
    },
    data() {
        return {
			imgUrl: getImgUrl(),
            inputValue: '',
            isShowNext: null,
            searList: [],
            isShowSearList: [],
            placeholderValue: '',
            keywordList: [],
            upOption: {
                auto: false,
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 1 // 每页数据的数量
                },
                empty: {
					use: false,
                },
            },
            source: '',
            focusValue: false,
            backDelta: 1
        };
    },
    async onLoad(option) {
        if(option.inputValue) {
            this.inputValue = decodeURIComponent(option.inputValue);
        }
        if(option.backDelta) this.backDelta = Number(option.backDelta);
        if(option.placeholderValue){
            this.placeholderValue = decodeURIComponent(option.placeholderValue);
        }
        if(option.source) this.source = option.source;
        const res = await jdHistory();
        if(res.code != 1) return;
        this.searList = res.data;
        if(this.searList.length > 8) {
            return this.isShowNext = true;
        }
        this.isShowNext = false;
    },
    onShow(option) {
        this.focusValue = true;
        if(this.inputValue) this.inputValueChange({ detail: this.inputValue})
    },
    methods: {
        // 牛金豆不足的情况
        notEnoughCreditsHandle() {
            this.exchangeFailedShow = true;
        },
        focusHandle() {
            setTimeout(() => {
                this.mescroll.scrollTo(0);
            }, 300);
        },
        blurHandle() {
            this.focusValue = false;
        },
        upCallback(page) {
			this.requestRem(page);
        },
        async inputValueChange({ detail }) {
            this.inputValue = detail;
            const res = await keyword({keyword: detail});
            // if(res.code != 1) return;
            this.keywordList = res.data;
        },
        //获取需要标红的文字
        getRedWords(contentText) {
            const keyword = this.inputValue;
            let keywordArray = keyword.split('');
            let wordsArray = [];
            for(let key of keywordArray){
                if(contentText.includes(key)) wordsArray.push(key);
            }
            return wordsArray;
        },
        // 将文字标红
        brightenKeyword(contentText) {
            let wordsArray = this.getRedWords(contentText);
            let res = contentText;
            for(let word of wordsArray){
                let Reg = new RegExp(`(${word})(?![^<]*>|[^<>]*<\/)`, 'g');
                if(word == '.') Reg = /(\.)(?![^<]*>|[^<>]*<\/)/g;
                res = res.replace(Reg, `<span style="color: red;">${word}</span>`);
            }
            return res;
        },
        confirmHandle({detail}) {
            this.inputValue = detail;
            this.searchBtnHandle();
        },
        async delListHandle(){
            this.$showModal({
                content: '确认删除搜索历史？',
                confirmText: '删除',
                confirm: async () => {
                    const res = await delHistory();
                    if(res.code != 1) return;
                    this.searList = [];
                    this.isShowSearList = [];
                    this.isShowNext = false;
                }
            });
        },
        searchBtnHandle(item) {
            let inputValue = item || this.inputValue.trim() || this.placeholderValue;
            this.inputValue = inputValue;
            inputValue = encodeURIComponent(inputValue)
            const pathUrl = `/pages/userModule/productList/searchResult?searchValue=${inputValue}&is_search=1`;
            if(this.source == 'home') return this.$go(`${pathUrl}&source=home`);
            this.$redirectTo(pathUrl);
        }
    },
    onUnload() {
    },
};
</script>
<style scoped lang="scss">
page {
    background: #fff;
}
.cont_box {
    position: fixed;
    top: 184rpx;
    bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
    left: 0;
    width: 100%;
    height: auto;
    background: #fff;
    padding-top: 24rpx;
}
.search_input_cont {
    background: #fff;
    position: sticky;
    top: 0;
    width: 100%;
    z-index: 1;
}
.search_box {
    font-size: 26rpx;
    color: #999;
    margin: 0 24rpx;
    height: 68rpx;
    padding: 0 2rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
    position: relative;
    box-sizing: border-box;
    line-height: 36rpx;
    .search_box-left {
        display: flex;
        align-items: center;
        background: #f1f1f1;
        border-radius: 16rpx;
        align-self: stretch;
        flex: 1;
        padding-right: 24rpx;
    }
    .field_box {
        flex: 1;
    }
    .search_icon{
        width: 28rpx;
        height: 28rpx;
        flex: 0 0 28rpx;
        margin: 0 24rpx;
    }
    .search_btn{
        width: 116rpx;
        line-height: 68rpx;
        background: linear-gradient(135deg,#f9675f, #f84842);
        border-radius: 16rpx;
        font-size: 28rpx;
        text-align: center;
        color: #ffffff;
        margin-right: 4rpx;
        flex: 0 0 116rpx;
        margin-left: 20rpx;
    }
}
.search_lab {
    font-size: 24rpx;
    color: #f97f02;
    line-height: 34rpx;
    letter-spacing: 0.02rpx;
    margin: 5rpx auto 0 96rpx;
}
.search_cont{
    padding: 0 16rpx 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 42rpx;
    .sear_his{
        font-size: 32rpx;
        font-weight: 600;
        color: #333333;
        line-height: 44rpx;
    }
    .del_icon{
        width: 48rpx;
        height: 48rpx;
    }
}
.search_list{
    padding: 0 28rpx 0 26rpx;
    display: flex;
    flex-wrap: wrap;
    .search_list-item{
        // line-height: 60rpx;
        background: #f1f1f1;
        border-radius: 30rpx;
        padding: 10rpx 20rpx;
        font-size: 26rpx;
        color: #666666;
        margin-top: 24rpx;
        margin-right: 16rpx;
    }
}
.nav_bg {
  width: 100%;
  height: 384rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
}
.sticky-tabs{
    z-index: 990;
    position: sticky;
    // background: linear-gradient(270deg, #FCE8D6, rgba(249, 127, 2, 0.08) 33%, rgba(255, 211, 213, 0.50) 93%);
	// filter: blur(80px);
}
.good_list-box{
    margin-top: 24rpx;
    width: 750rpx;
    // height: 1354rpx;
    background: linear-gradient(180deg,#ffffff, #f7f7f7 12%);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    overflow: hidden;
}
.keyword_box {
    padding: 0 40rpx;
    color: #323233;
    position: fixed;
    background: #fff;
    box-sizing: border-box;
    z-index: 1;
    height: calc(100% - 88px - 92rpx - constant(safe-area-inset-bottom));
    height: calc(100% - 88px - 92rpx - env(safe-area-inset-bottom));
    &::after {
        content: '\3000';
        position: absolute;
        bottom: -128rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 100vw;
        height: 128rpx;
        background:#fff;
        z-index: -1;
    }
    .keyword_item{
        line-height: 90rpx;
        font-size: 32rpx;
        border-bottom: 2rpx solid #f7f7f7 ;
    }
}
</style>
