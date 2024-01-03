<template>
<view class="search">
<xh-navbar
    :fixed="true"
    leftImage="/static/images/left_back.png"
	navberColor="#fff"
    titleAlign="titleRight"
    navbarImageMode="widthFix"
	@leftCallBack="leftCallBack"
    :overFlow="true"
>
    <view class="search_box" slot="title">
        <image class="search_icon" src="../static/search_icon.png" mode="aspectFill"></image>
        <van-field
            :value="inputValue"
            :placeholder="placeholderValue || '请搜索喜欢的商品'"
            :border="false"
            @confirm="confirmHandle"
            @change="inputValueChange"
            :focus="isFocus"
            @blur="blurHandle"
            @focus="focusHandle"
            custom-style="font-size:26rpx;--field-input-text-color:#333333;background-color: transparent;"
        />
        <view class="search_btn" @click="searchBtnHandle()">搜索</view>
    </view>
</xh-navbar>
<scroll-view
    :style="{height: mescrollHeight}"
    scroll-y="true"
    class="keyword_box"
    v-if="keywordList.length"
>
    <view class="keyword_item"
        v-for="(item, index) in keywordList"
        :key="index"
    >
        <view v-html="brightenKeyword(item.key)" @click="searchBtnHandle(item.key)"></view>
    </view>
</scroll-view>
<view class="cont_box" :style="{'--top': navHeight}">
<mescroll-uni
    :fixed="false"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
>
    <view class="search_lab">搜京东商品，领隐藏优惠</view>
    <!-- search的关键字 -->
    <view class="search_cont" v-if="searList.length">
        <view class="sear_his">搜索历史</view>
        <image class="del_icon"
            src="../static/del_icon.png"
            mode="aspectFill"
            @click="delListHandle"
        ></image>
    </view>
    <view class="search_list">
        <view class="search_list-item"
            v-for="(item,index) in isShowSearList"
            :key="index"
            @click="searchBtnHandle(item)"
        >
            {{item}}
        </view>
        <view class="search_list-item" v-if="isShowNext" @click="isShowNext = false">
            <van-icon name="arrow-down" color="#999" />
        </view>
    </view>
</mescroll-uni>
</view>
</view>

</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import goodList from '@/components/goodList.vue';
import getViewPort from '@/utils/getViewPort.js';
import {
    jdHistory,
    delHistory,
    keyword
} from '@/api/modules/jsShop.js';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        goodList
    },
    computed:{
        mescrollHeight(){
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - viewPort.navHeight;
            return mescrollHeight + 'px';
        },
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight  + 'px';
        },
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
            if(newValue.length <=6) {
                this.mescroll.triggerUpScroll();
            }
        }
    },
    data() {
        return {
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
                    size: 2 // 每页数据的数量
                },
                empty: {
					use: false,
                },
            },
            isFocus: false,
			groupRecommendData: null,
        };
    },
    async onLoad(option) {
        if(option.inputValue) {
            this.inputValue = option.inputValue;
        }
        if(option.placeholderValue){
            this.placeholderValue = option.placeholderValue;
        }
    },
    onShow() {
        this.isFocus = true;
    },
    methods: {
        blurHandle() {
            this.isFocus = false;
        },
        focusHandle() {
            setTimeout(() => {
                this.mescroll.scrollTo(0);
            }, 300);
        },
        async upCallback(page) {
            const res = await jdHistory();
            this.mescroll.endSuccess(0)
            if(res.code != 1) return;
            this.searList = res.data;
            if(this.searList.length > 8) {
                return this.isShowNext = true;
            }
            this.isShowNext = false;
        },
        async inputValueChange({detail}) {
            this.inputValue = detail;
            const res = await keyword({keyword: detail});
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
        //将文字标红
        brightenKeyword(contentText) {
            let wordsArray = this.getRedWords(contentText);
            let res = contentText;
            for(let word of wordsArray){
                const Reg = new RegExp(word, 'i');
                res = res.replace(Reg, `<span style="color: red;">${word}</span>`);
            }
            return res;
        },
        confirmHandle({detail}) {
            this.inputValue = detail;
            this.searchBtnHandle();
        },
        async delListHandle(){
            const res = await delHistory();
            if(res.code != 1) return;
            this.searList = [];
            this.isShowSearList = [];
            this.isShowNext = false;
        },
        searchBtnHandle(item) {
            const inputValue = item || this.inputValue.trim() || this.placeholderValue;
            this.$go(`/pages/homeModule/productList/index?searchValue=${inputValue}`);
        },
        leftCallBack(){
            this.$switchTab('/pages/home/index');
        }
    },
};
</script>
<style scoped lang="scss">
page {
    background: #fff;
}
.cont_box{
    position: fixed;
    top: var(--top);
    bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
    left: 0;
    width: 100%;
    height: auto;
    background: #fff;
}
.search_box{
    font-size: 26rpx;
    color: #999;
    width: 454rpx;
    height: 68rpx;
    background: #fff;
    border-radius: 38rpx;
    padding: 0 2rpx 0 45rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999999;
    position: relative;
    border: 3rpx solid #f04138;
    box-sizing: border-box;
    line-height: 36rpx;
    .search_icon{
        width: 28rpx;
        height: 28rpx;
        flex: 0 0 28rpx;
        position: absolute;
        left: 32rpx;
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
        flex: 0 0 120rpx;
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
        line-height: 60rpx;
        background: #f1f1f1;
        border-radius: 30rpx;
        padding: 0 20rpx;
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
    position: absolute;
    background: #fff;
    box-sizing: border-box;
    z-index: 1;
    .keyword_item{
        line-height: 90rpx;
        font-size: 32rpx;
        border-bottom: 2rpx solid #f7f7f7 ;
    }
}
</style>