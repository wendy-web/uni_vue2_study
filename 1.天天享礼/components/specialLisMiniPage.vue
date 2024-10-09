<template>
<van-popup :show="isShow"
    position="bottom"
    custom-style="overflow: inherit; background: transparent; max-height:90vh;"
    round
    safe-area-inset-bottom
    :catchtouchmove="true"
    duration="5"
    :transition-appear="true"
>
    <view :class="['detail_box', isScrollTop ? 'ani_bottom_active' : 'ani_Up_bottom_active']">
        <view class="del_top fl_bet">
            <view class="share_icon">
                <button open-type="share" class="share_btn" :data-id="id"></button>
            </view>
            <image class="close_icon" mode="aspectFill" :src="imgUrl +'static/images/close_back.png'" @click="popupClose"></image>
        </view>
        <scroll-view :scroll-y="true"
            :scroll-top="scrollTopValue"
            class="detail_cont"
            :style="{'--bg': subjectColor}"
            @scrolltolower="scrollToLowerHandle"
        >
            <image mode="widthFix" class="top_img"
                :src="bg_img" :style="{'--margin': navHeight + 'px' }"></image>
            <good-list
                :list="showGoods"
                :isShowBanner="true"
                :isBolCredits="true"
                :isShowProfit="true"
                @notEnoughCredits="notEnoughCreditsHandle"
                @isBannerClick="isBannerClickHandle"
            ></good-list>
            <view class="loading_box">
                <van-loading size="14px" color="gray" v-if="isLoading">加载中...</van-loading>
                <view class="noMore_txt" v-else-if="!isScroll"> - 我也是有底线的 - </view>
            </view>
        </scroll-view>
    </view>
</van-popup>
</template>
<script>
import { goodsTheme } from '@/api/modules/allowance.js';
import { getApiParams } from '@/api/modules/requestConfiguration/lxType.js';
import goodList from "@/components/goodList.vue";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { mapMutations } from 'vuex';
export default {
    mixins: [goDetailsFun], // 使用mixin
    components: {
        goodList,
    },
    data () {
        return {
            id: 0,
            coupon_id: null,
            imgUrl: getImgUrl(),
            isShow: false,
            goods: [],
            pageNum: 1, // 页面num
            configData: null,
            bg_img: '',
            groupId_index: 0,
            goods_lx_type: 1,
            subjectColor: '#F5EDE2',
            isScroll: true,
            isLoading: false,
            scrollTopValue: 0,
            isScrollTop: true,
            isRequestNum: 0
        };
    },
    computed: {
        navHeight () {
            let viewPort = getViewPort();
            return viewPort.statusBarHeight;
        },
        // 列表数据
        showGoods() {
            let list = this.goods;
            let isType9 = 0;
            // 列表对单列呈现进行后排数组的操作
            list.length && list.forEach((nowItem, index) => {
                if(nowItem.type != 9 ) return;
                if(index%2 && (isType9%2) == 0) {
                list[index] = list[index-1];
                list[index - 1] = nowItem;
                }
                if((index%2) == 0 && isType9%2) {
                list[index] = list[index-1];
                list[index - 1] = nowItem;
                }
                isType9 += 1;
            });
            return list;
        }
    },
    methods: {
        ...mapMutations({
            delCurrentDiaList: "user/delCurrentDiaList"
        }),
        // 牛金豆不足的情况
        notEnoughCreditsHandle () {
            this.$emit('notEnoughCredits'); // 组件抛出去的方法
        },
        isBannerClickHandle(item) {
            this.isShow = false;
            this.$emit('isBannerClick', item);
        },
        popupClose () {
            this.scrollTopValue = 0;
            this.isScrollTop = false;
            this.isShow = false;
            this.delCurrentDiaList('specialLis');
            this.$emit('close');
        },
        popupShow () {
            this.isShow = true;
            this.isScrollTop = true;
            this.scrollTopValue = 1;
        },
        async initShow(id, coupon_id = null) {
            this.id = id;
            this.coupon_id = coupon_id;
            this.configData = null;
            this.goods = [];
            this.pageNum = 1;
            this.groupId_index = 0;
            this.isScroll = true;
            this.isRequestNum = 0;
            this.initGoodsTheme();
        },
        async initGoodsTheme () {
            if (this.isLoading) return;
            this.isLoading = true;
            const params = {
                id: this.id,
                coupon_id: this.coupon_id,
                page: this.pageNum,
                size: 10
            };
            if (!this.configData || this.goods_lx_type == 1) {
                const res = await goodsTheme(params);
                if (res.code != 1) return this.isLoading = false;
                if (this.pageNum == 1) this.goods = [];
                this.configData = res.data;
                const { bg_color, bg_img, share_word, share_img } = res.data;
                this.subjectColor = bg_color;
                this.bg_img = bg_img;
                this.$emit('specialLisShare', {  share_word, share_img });
            }
            const { goods_lx_type, list, total_count } = this.configData;
            this.goods_lx_type = goods_lx_type;
            switch (goods_lx_type) {
                case 1:
                    // 自选
                    this.goods = this.goods.concat(list); // 追加新数据
                    this.isLoading = false;
                    this.pageNum += 1;
                    if (!list.length) this.isScroll = false;
                    break;
                case 2:
                case 3:
                    // 拼多多 - 京东
                    this.requestList();
                    break;
            }
            if(!this.isShow) this.popupShow();
        },
        async requestList () {
            // 设置列表数据
            if (this.pageNum == 1 && !this.groupId_index) {
                this.goods = [];
                this.groupId_index = 0;
                this.pageNum = 1;
            }
            // 获取配置的京东/拼多多的请求类型及参数
            const { queryApi, params, groupId, type } = getApiParams(
                this.configData, { pageNum: this.pageNum, groupId_index: this.groupId_index }
            );
            queryApi(params).then(res => {
                const { list, total_count } = res.data;
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = (this.pageNum * params.size) < total_count;
                if (!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                    // 无下一页 - 京东
                    this.groupId_index += 1;
                    this.pageNum = 0;
                }
                this.isScroll = (list.length || isNextPage);
                this.pageNum += 1;
                this.goods = this.goods.concat(list); // 追加新数据
                this.isLoading = false;
                // 请求列表俩次为空时 停止请求
                if (!list.length && isNextPage && this.isRequestNum < 2) {
                    this.isRequestNum += 1;
                    this.initGoodsTheme();
                    return;
                }
                this.isRequestNum = 0;
            }).catch(() => this.isLoading = false);
        },
        goProductListHandle () {
            this.popupClose();
            this.$go(`/pages/userModule/productList/index`);
        },
        scrollToLowerHandle (event) {
            if (!this.isScroll) return;
            this.initGoodsTheme();
        },
    }
}
</script>
<style lang="scss" scoped>
.detail_box {
    position: relative;
    height: 90vh;
    display: flex;
    flex-direction: column;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    // padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
    // /* 兼容 IOS<11.2 */
    // padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
    box-sizing: border-box;
    .close_icon {
        width: 52rpx;
        height: 52rpx;
        flex: 0 0 52rpx;
        padding: 36rpx 16rpx 16rpx 66rpx;
    }
    .share_icon{
        position: relative;
        width: 214rpx;
        height: 58rpx;
        z-index: 0;
        margin-left: 16rpx;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/2416/6598ac8034251.png") 0 0 / 100% 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .share_btn{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    .top_img {
        width: 100%;
        margin-top: calc(0px - var(--margin));
        margin-bottom: 10rpx;
    }
}
.detail_cont {
    background: var(--bg);
    border-radius: 48rpx 48rpx 0rpx 0rpx;
    position: relative;
    flex: 1;
    overflow: scroll;
    box-sizing: border-box;
}

.empty_box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin-top: 178rpx;
    .empty_img {
        width: 358rpx;
        height: 330rpx;
    }
    .empty_lab-img {
        width: 434rpx;
        height: 40rpx;
        margin-top: 29rpx;
    }
    .empty_timer {
        font-size: 26rpx;
        text-align: center;
        color: #c1c1c1;
        margin-top: 16rpx;
    }
    .empty_btn {
        padding: 0 33rpx;
        height: 72rpx;
        line-height: 72rpx;
        border: 2rpx solid #f84842;
        border-radius: 46rpx;
        font-size: 26rpx;
        font-weight: 600;
        color: #f84842;
        margin-top: 64rpx;
    }
}
.loading_box {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .noMore_txt {
        font-size: 28rpx;
        padding: 30rpx 0;
        color: gray;
        text-align: center;
    }
}
</style>
