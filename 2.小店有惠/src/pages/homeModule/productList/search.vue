<template>
<view class="search">
<xh-navbar
    :fixed="true"
    leftImage="/static/images/left_back.png"
	navberColor="#fff"
    navbarImageMode="widthFix"
	@leftCallBack="leftCallBack"
    :overFlow="true"
    :title="is_rebate ? '搜商品 赚佣金' : '搜商品 更便宜'"
></xh-navbar>
<view class="cont_box" :style="{ '--top' : navHeight + 'px' }">
<mescroll-uni
    :fixed="false"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
>
    <view class="search_box">
        <view class="search_box-left">
            <image class="search_icon" src="/static/images/home/search_icon.png" mode="aspectFill"></image>
            <van-field
                :value="inputValue"
                :placeholder="placeholderValue || (is_rebate ? '搜你想推广的商品' : '请搜索喜欢的商品')"
                :border="false"
                @confirm="confirmHandle"
                @change="inputValueChange"
                :focus="isFocus"
                @blur="blurHandle"
                @focus="focusHandle"
                custom-style="font-size:26rpx;--field-input-text-color:#333333;background-color: transparent;padding: 0;"
                clearable
                class="field_box"
            />
        </view>
        <view class="search_btn" @click="searchBtnHandle()">搜索</view>
    </view>
    <scroll-view :style="{height: mescrollHeight}"
        scroll-y="true" class="keyword_box"
        v-if="keywordList.length"
    >
        <view class="keyword_item" v-for="(item, index) in keywordList" :key="index">
            <view v-html="brightenKeyword(item.key)" @click="searchBtnHandle(item.key)"></view>
        </view>
    </scroll-view>
    <!-- search的关键字 -->
    <view class="search_cont" v-if="searList.length">
        <view class="sear_his">
            <image class="del_icon"
                src="../static/history.png"
                mode="widthFix"
                @click="delListHandle"
            ></image>
            搜索历史
        </view>
        <image class="del_icon"
            src="../static/del_icon1.png"
            mode="widthFix"
            @click="delListHandle"
        ></image>
    </view>
    <view class="search_list">
        <view class="search_list-item"
            v-for="(item,index) in isShowSearList"
            :key="index"
            @click="searchBtnHandle(item)"
        >{{item}}
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
import {
    delHistory,
    jdHistory,
    keyword
} from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import getViewPort from '@/utils/getViewPort.js';
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
            return viewPort.navHeight;
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
            is_rebate: '',
            backDelta: 1,
        };
    },
    async onLoad(option) {
        if(option.backDelta) this.backDelta = Number(option.backDelta);
        if(option.inputValue) {
            this.inputValue = option.inputValue;
        }
        if(option.placeholderValue){
            this.placeholderValue = option.placeholderValue;
        }
        if(option.is_rebate) {
            this.is_rebate = option.is_rebate;
        };
    },
    onShow() {
        this.isFocus = true;
        if(this.inputValue) this.inputValueChange({ detail: this.inputValue});
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
        async inputValueChange({ detail }) {
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
        async delListHandle() {
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
            const inputValue = item || this.inputValue.trim() || this.placeholderValue;
            if(!inputValue) return this.isFocus = false;
            this.$go(`/pages/homeModule/productList/index?searchValue=${inputValue}&is_rebate=${this.is_rebate}`);
        },
        leftCallBack(){
            if(this.is_rebate) return this.$leftBack(this.backDelta);
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
    height: 64rpx;
    background: #fff;
    display: flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    margin: 0 24rpx;
    &-left {
        padding: 0 16rpx 0 32rpx;
        height: 64rpx;
        display: flex;
        align-items: center;
        color: #999;
        border-radius: 38rpx;
        background: #f1f1f1;
        border-radius: 12rpx;
        flex: 1;

    }
    .field_box {
        flex: 1;
    }
    .search_icon{
        width: 28rpx;
        height: 28rpx;
        flex: 0 0 28rpx;
        margin-right: 8rpx;
    }
    .search_btn {
        margin-left: 24rpx;
        font-size: 32rpx;
        color: #ef2b20;
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
    .sear_his {
        font-size: 30rpx;
        font-weight: 600;
        color: #aaa;
        line-height: 44rpx;
        display: flex;
        align-items: center;
        .del_icon {
            margin-right: 8rpx;
        }
    }
    .del_icon{
        width: 30rpx;
        height: 30rpx;
        flex: 0 0 30rpx;
    }
}
/* 文本超出隐藏 */
@mixin text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.search_list{
    padding: 0 28rpx 0 26rpx;
    display: flex;
    flex-wrap: wrap;
    .search_list-item{
        line-height: 60rpx;
        background: #f1f1f1;
        border-radius: 30rpx;
        padding: 0 24rpx;
        font-size: 26rpx;
        color: #666666;
        margin-top: 24rpx;
        margin-right: 16rpx;
        @include text-ellipsis;
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
    height: calc(100% - 126rpx);
    .keyword_item{
        line-height: 90rpx;
        font-size: 32rpx;
        border-bottom: 2rpx solid #f7f7f7 ;
    }
}
</style>
