<template>
<view class="search">
<xh-navbar
    :fixed="true"
    :fixedNum="9"
    :leftImage="imgUrl+'/static/images/left_back.png'"
    titleAlign="titleRight"
    navbarImageMode="widthFix"
	@leftCallBack="$topCallBack"
    navberColor="#fff"
>
    <view class="search_box" slot="title">
        <image class="search_icon" :src="takeImgUrl +'/mdl_search.png'"  mode="aspectFill"></image>
        <van-field
            :value="inputValue"
            placeholder="搜索你喜欢的商品"
            :border="false"
            @confirm="confirmHandle"
            @change="inputValueChange"
            :focus="true"
            custom-style="font-size:26rpx;--field-input-text-color:#333333;background-color: transparent;"
        />
        <!-- @change="inputValueChange" -->
        <view class="search_btn" @click="searchBtnHandle()">搜索</view>
    </view>
</xh-navbar>
<!-- 搜索出的商品列表 -->
<view class="search_list_box"
    :style="{'minHeight': searchBoxHeight}"
    v-if="isShowSearchResult"
>
    <listItem
        :list="searListItem"
        @selCom="selComHandle"
        @selAddCom="selAddComHandle"
		@selSubCom="selSubComHandle"
        v-if="searListItem && searListItem.length"
    >
    </listItem>
    <view class="search_empty fl_col_cen" v-else >
        <image class="search_empty-icon" src="https://file.y1b.cn/store/1-0/2389/64d352c3c15a1.png" mode="aspectFill"></image>
        <view>暂无更多信息</view>
    </view>
    <view class="cart_box fl_center" v-if="isShowCart" @click="goMcDonald">
        <view class="buy_num fl_center">
            <image class="widHei" src="https://file.y1b.cn/store/1-0/231019/6530951a210d4.png" mode="widthFix"></image>
            <view class="num_add">{{ cartNum }}</view>
        </view>
    </view>
</view>
<view class="search_cont">
    <view class="sear_his">搜索历史</view>
    <image class="del_icon"
        :src="takeImgUrl +'/del_icon.png'"
        mode="aspectFill"
        v-if="searList.length"
        @click="isShowDelReCordDia = true"
    ></image>
</view>
<view class="search_list">
    <view class="search_list-item"
        v-for="(item,index) in searList"
        :key="index"
        @click="searchBtnHandle(item)"
    >
        {{item}}
    </view>
</view>
<!-- 确认删除记录的弹窗 -->
<confirmDia
    :isShow="isShowDelReCordDia"
    remindText="确定删除搜索历史？"
    @close="isShowDelReCordDia = false"
    @confirm="confirmDelRecordHandle"
>
</confirmDia>

<!-- 弹窗的内容 -->
<commodityDetails
  ref="commodityDetails"
  :isShowBuyBtn="false"
  @editCart="editCartHandle"
>
</commodityDetails>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import meTabs from './content/me-tabs.vue';
import goodList from '@/components/goodList.vue';
import confirmDia from './content/confirmDia.vue';
import listItem from './content/listItem.vue';
import commodityDetails from './content/commodityDetails.vue';
import {
    kfcHistory,
    delHistory,
} from '@/api/modules/takeawayMenu/kfc.js';
import { starbucksMenus } from '@/api/modules/takeawayMenu/starbucks.js';

import getViewPort from '@/utils/getViewPort.js';
import { getImgUrl } from '@/utils/auth.js';
import { mapGetters } from 'vuex';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
		meTabs,
        goodList,
        confirmDia,
        listItem,
        commodityDetails
    },
    computed: {
        ...mapGetters(['brand_id', 'cartNum', 'storeCode']),
        searchBoxHeight() {
            let viewPort = getViewPort();
            // uni.upx2px(142) 头部地址的内容 24位边距
            let searchBoxHeight =  viewPort.windowHeight - viewPort.navHeight;
            return searchBoxHeight + 'px';
        },
        isShowCart() {
            if(this.cartNum && this.searListItem && this.searListItem.length) return true;
            return false;
        }
    },
    data() {
        return {
			imgUrl: getImgUrl(),
            takeImgUrl: getImgUrl() + 'static/subPackages/userModule/takeawayMenu',
            inputValue: '',
            searList:[],
            searListItem: [],
            isShowDelReCordDia: false,
            isShowSearchResult: false
        };
    },
    onLoad(option) {
        if(option.inputValue) {
            this.inputValue = option.inputValue;
        }
        this.init();
    },
    methods: {
        async init() {
            const res = await kfcHistory({ tag: 3 });
            if(res.code != 1) return this.$toast(res.msg);
            this.searList = res.data;
        },
        selComHandle(item, tabIndex, index) {
            this.$refs.commodityDetails.popupShow(item, tabIndex, index);
        },
        selAddComHandle(item, tabIndex, index) {
            const { productId, car_num } = item;
            const currenComNum = car_num + 1;
            const params = { product_id: productId, amount: currenComNum };
            const editCart = { index, currenComNum }
            this.$refs.commodityDetails.editOrderCar(params, editCart);
		},
		selSubComHandle(item, tabIndex, index) {
            const { productId, car_num } = item;
            const currenComNum = car_num - 1;
            const params = { product_id: productId, amount: currenComNum };
            const editCart = { index, currenComNum }
            this.$refs.commodityDetails.editOrderCar(params, editCart);
		},
        editCartHandle({ ItemIndex, currenComNum }) {
            this.searListItem[ItemIndex].car_num = currenComNum;
        },
        goMcDonald() {
            this.$reLaunch(`/pages/userModule/takeawayMenu/starbucks/index?searchCartNum=${this.cartNum}`);
        },
        inputValueChange({detail}) {
            this.inputValue = detail;
            if(!this.inputValue) {
                this.isShowSearchResult = false;
            }
        },
        confirmHandle({detail}) {
            this.inputValue = detail.trim();
            this.searchBtnHandle();
        },
        async confirmDelRecordHandle() {
            this.isShowDelReCordDia = false;
            const res = await delHistory({ tag: 1 });
            if(res.code != 1) return this.$toast(res.msg);
            this.searList = [];
        },
        async searchBtnHandle(item) {
            if(item) {
                this.inputValue = item.trim();
            }
            if(!this.inputValue) return;
            const params = { keyword: this.inputValue}
            const res = await starbucksMenus(params);
            this.isShowSearchResult = true;
            if(res.code != 1 && res.data) {
                this.searListItem = [];
                return;
            }
            this.searList.unshift(this.inputValue);
            this.searListItem = res.data.list;
        }
    },
};
</script>
<style scoped lang="scss">
@import '@/static/css/mixin.scss';
page {
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
    border: 3rpx solid $starbucksColor;
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
        flex: 0 0 120rpx;
        width: 120rpx;
        line-height: 56rpx;
        background: $starbucksColor;
        border-radius: 32rpx;
        font-size: 28rpx;
        text-align: center;
        color: #fff;
        margin-right: 4rpx;
    }
}
.search_cont{
    padding: 0 16rpx 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40rpx;
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
}
.good_list-box{
    margin-top: 24rpx;
    width: 750rpx;
    background: linear-gradient(180deg,#ffffff, #f7f7f7 12%);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
    overflow: hidden;
}
.search_list_box{
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding-bottom: constant(safe-area-inset-bottom);
    /* 兼容 IOS<11.2 */
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
}
.search_empty{
    width: 100%;
    height: 85%;
    font-size: 26rpx;
    text-align: center;
    color: #999999;
    line-height: 36rpx;
    position: absolute;
    top: 0;
    left: 0;
    .search_empty-icon{
        width: 322rpx;
        height: 230rpx;
        margin-bottom: 32rpx;
    }
}
.cart_box{
    width: 108rpx;
    height: 108rpx;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0,0,0,0.14);
    position: fixed;
    right: 40rpx;
    bottom: 20%;
    .buy_num{
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 0;
        padding: 20rpx;
        box-sizing: border-box;
        .num_add {
            height: 32rpx;
            min-width: 32rpx;
            padding: 0 5rpx;
            font-weight: 600;
            text-align: center;
            color: #fff;
            line-height: 1;
            background: $starbucksColor;
            border: 2rpx solid #ffffff;
            border-radius: 50%;
            font-size: 24rpx;
            position: absolute;
            top: 0;
            right: 0;
            box-sizing: border-box;
        }
    }
}
</style>