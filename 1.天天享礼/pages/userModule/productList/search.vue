<template>
<view class="search">
<xh-navbar
    :fixed="true"
    :leftImage="imgUrl+'/static/images/left_back.png'"
	navberColor="#fff"
    titleAlign="titleRight"
    navbarImageMode="widthFix"
	@leftCallBack="leftCallBack"
    :fixedNum="9"
>
    <view class="search_box" slot="title">
        <image src="../static/productList/search_icon01.png"
        mode="aspectFill" class="search_icon"
        v-if="!focusValue && !inputValue"></image>
        <van-field
            :value="inputValue"
            :placeholder="placeholderValue || '搜你想买的'"
            :border="false"
            @confirm="confirmHandle"
            @change="inputValueChange"
            :focus="focusValue"
            @focus="focusHandle"
            @blur="blurHandle"
            custom-style="font-size:26rpx;--field-input-text-color:#333333;background-color: transparent;"
        />
        <view class="search_btn" @click="searchBtnHandle()">搜索</view>
    </view>
</xh-navbar>
<scroll-view
    :style="{height: mescrollHeight}"
    scroll-y="true"
    class="keyword_box"
    v-if="keywordList.length">
    <view class="keyword_item"
        v-for="(item, index) in keywordList" :key="index">
        <view v-html="brightenKeyword(item.key)" @click="searchBtnHandle(item.key)"></view>
    </view>
</scroll-view>
<view class="cont_box"
    :style="{
        top: navHeight +'px'
    }"
>
<mescroll-uni
    :fixed="false"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
>
    <view class="search_lab">搜京东优惠，比官方更便宜</view>
    <!-- search的关键字 -->
    <view class="search_cont" v-if="searList.length">
        <view class="sear_his">搜索历史</view>
        <image class="del_icon"
            src="../static/productList/del_icon.png"
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
    <view class="you_like-title" id="stickyTitleId" v-if="goods.length">
        <image class="left-icon" :src="imgUrl +'static/shopMall/love_left_icon.png'" mode="aspectFill"></image>
        热搜爆品
        <image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
    </view>
    <good-list
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
>
</exchangeFailed>
<!-- 赚取牛金豆 -->
<serviceCredits
    ref="serviceCredits"
    :isShow="serviceCreditsShow"
    @showAdPlay="showAdPlayHandle"
    @close="closeHandle"
>
</serviceCredits>
</view>

</template>
<script>
import { groupRecommend } from '@/api/modules/index.js';
import { delHistory, goodsQuery, jdHistory, jingfen, keyword, material } from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import meTabs from './content/me-tabs.vue';
export default {
    mixins: [MescrollMixin, serviceCreditsFun], // 使用mixin
    components: {
		meTabs,
        goodList,
        exchangeFailed,
        serviceCredits
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
            if(newValue.length <=6) {
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
			groupRecommendData: null,
            goods: [],
            pageNum: 1,
			groupId_index: 0,
            lastOddItem: null,
            source: '',
            focusValue: false
        };
    },
    async onLoad(option) {
        if(option.inputValue) {
            this.inputValue = decodeURIComponent(option.inputValue);
        }
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
    onShow() {
        this.focusValue = true;
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
        async requestRem(page) {
            if(!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: 7 });
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
                    this.goods = [];
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
                    this.goods.push(this.lastOddItem);
                    this.lastOddItem = null;
                }
                this.pageNum += 1;
                this.goods = this.goods.concat(list); // 追加新数据
                const goodLength = this.goods.length;
                if(goodLength % 2 && goodLength > 6) {
                    this.lastOddItem = this.goods.pop();
                }
            }).catch(()=>{
                //联网失败, 结束加载
                this.mescroll.endErr();
            });
        },
        async inputValueChange({detail}) {
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
            const res = await delHistory();
            if(res.code != 1) return;
            this.searList = [];
            this.isShowSearList = [];
            this.isShowNext = false;
        },
        searchBtnHandle(item) {
            let inputValue = item || this.inputValue.trim() || this.placeholderValue;
            this.inputValue = inputValue;
            inputValue = encodeURIComponent(inputValue)
            const pathUrl = `/pages/userModule/productList/index?searchValue=${inputValue}&is_search=1`;
            if(this.source == 'home') return this.$go(`${pathUrl}&source=home`);
            this.$redirectTo(pathUrl);
        },
        leftCallBack(){
            uni.navigateBack({
                fail() {
                    uni.switchTab({
                        url: '/pages/tabBar/shopMall/index'
                    });
                }
            });
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
.cont_box{
    position: fixed;
    top: 184rpx;
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
    padding: 0 2rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
    position: relative;
    border: 3rpx solid #f04138;
    box-sizing: border-box;
    line-height: 36rpx;
    .search_icon{
        width: 28rpx;
        height: 28rpx;
        flex: 0 0 28rpx;
        margin-left: 24rpx;
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
