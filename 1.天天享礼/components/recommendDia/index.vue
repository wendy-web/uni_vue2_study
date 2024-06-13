<template>
<view @touchmove.stop>
<van-popup
    :show="isShow"
    @close="popupClose(true)"
    position="bottom"
    custom-style="overflow: inherit; background: transparent; max-height:84vh;"
    round
    safe-area-inset-bottom
    duration="5"
    :transition-appear="true"
    :lock-scroll="false"
    @touchmove.native.stop.prevent
>
<!-- @touchmove.native.stop.prevent -->
<!-- :catchtouchmove="true" -->
<view class="detail_box ani_bottom_active">
    <image class="close_icon" :src="imgUrl +'static/images/close_back.png'" mode="aspectFill" @click="popupClose(true)"></image>
    <image
        :class="['lab_title', isOver ? 'active' : '']"
        src="https://file.y1b.cn/store/1-0/24523/664efdd6ea603.png"
        mode="aspectFill" @click="popupClose(true)"
    ></image>
    <scroll-view
        :scroll-y="true"
        class="detail_cont"
        @scrolltolower="scrollToLowerHandle"
        @scroll="scrollHandle"
        :lower-threshold="100"
    >
        <view class="rec_detail-box" v-if="!isOver">
            <view class="rec_detail fl_ard">
                <view class="rec_detail-left fl_center">
                    <view class="detail_num">{{ max_coupon_money }}</view>
                </view>
                <view class="rec_detail-right">
                    <view>优惠券<text style="font-size: 26rpx;font-weight: 400;">(全场通用)</text></view>
                    <view class="cd_txt" v-if="isShowRemainTime">
                        <van-count-down
                            @finish="countFinished"
                            :time="remainTime"
                            millisecond
                            use-slot
                            format="mm:ss"
                            @change="onChangeHandle"
                            style="--count-down-text-color:#fff;--count-down-font-size:26rpx;"
                            class="cd_time-con"
                            :auto-start="false"
                        >
                            还剩
                            <text class="item">{{ timeData.hours }}</text>:
                            <text class="item">{{ timeData.minutes }}</text>:
                            <text class="item">{{ timeData.seconds }}</text>.
                            <text class="item">{{ timeData.milliseconds }}</text>
                            结束
                        </van-count-down>
                    </view>
                </view>
            </view>
            <view :class="['scroll_top-sticky', isShowSticky ? 'active' : '']">
                <view class="scroll_top_coupon">
                    <image class="scroll_top_icon" src="https://file.y1b.cn/store/1-0/24523/664f093341eba.png" mode="aspectFill"></image>
                    优惠券{{ max_coupon_money }}元 </view>
                <view class="cd_txt">
                    还剩
                    <text class="item">{{ timeData.hours }}</text>:
                    <text class="item">{{ timeData.minutes }}</text>:
                    <text class="item">{{ timeData.seconds }}</text>.
                    <text class="item">{{ timeData.milliseconds }}</text>
                    结束
                </view>
            </view>
            <!-- 悬浮的倒计时 -->
            <!-- <view class="timer_fixed fl_ard" v-if="isShowRemainTime">
                <view class="timer_fixed-left">{{ max_coupon_money }}</view>
                <view class="timer_fixed-right">
                    <view>
                        <text class="item_num">{{ timeData.hours }}</text>:
                        <text class="item_num">{{ timeData.minutes }}</text>:
                        <text class="item_num">{{ timeData.seconds }}</text>.
                        <text class="item">{{ timeData.milliseconds }}</text>
                    </view>
                    <view>后结束</view>
                </view>
            </view> -->
            <view class="dia_cont">
                <view class="good-list" v-if="goods.length">
                    <view :class="['good-list-item', (item.is_expand == 1) ? 'active' : '']"
                        v-for="(item, index) in goods" :key="index"
                        @click="itemHandle(item, index)"
                    >
                        <view class="good-img">
                            <van-image height="354rpx" width="354rpx" radius="8px 8px 0 0" :src="item.image" use-loading-slot>
                                <van-loading slot="loading" type="spinner" size="20" vertical />
                            </van-image>
                        </view>
                        <view class="good_name_box txt_ov_ell2">
                            <view class="good_name_lab" v-if="parseInt(item.face_value)">
                                抵¥{{ ((item.face_value <= max_coupon_money) || item.is_expand) ? parseInt(item.face_value) : max_coupon_money }}券
                            </view>
                            {{item.title}}
                        </view>
                        <view class="total_cont box_fl">
                            <view class="use_cont-left" v-if="item.after_pay">先用后付</view>
                            <text class="item_total" v-if="item.inOrderCount30Days">月售{{ item.inOrderCount30Days }}</text>
                            <text class="item_total" v-if="item.sales_tip">已售{{ item.sales_tip }}</text>

                        </view>
                        <!-- <view class="list_price box_fl">
                            <view>
                                抵用后 ￥
                                <text style="font-size: 32rpx;">{{ item.lowestCouponPrice }}</text>
                            </view>
                            <view class="price_line">¥{{ item.face_value + item.lowestCouponPrice }}</view>
                        </view> -->
                        <view class="price_btn">
                            {{ ((item.face_value <= max_coupon_money) || item.is_expand) ? `使用${item.face_value}元券购买` : `免费膨胀至${item.face_value}元` }}
                            <!-- {{ !item.is_expand ? `免费膨胀至${item.face_value}元` : `领${item.face_value}元券` }} -->
                        </view>
                    </view>
                </view>
                <view class="empty_box fl_col_sp_st" v-else-if="!isLoading">
                    <view class="empty_timer">暂无相关商品</view>
                    <view class="empty_btn" @click="goProductListHandle">领取更多优惠</view>
                </view>
                <view class="loading_box">
                    <van-loading size="14px" color="gray" v-if="isLoading">加载中...</van-loading>
                    <view class="noMore_txt" v-else-if="!isScroll"> - 我也是有底线的 - </view>
                </view>
            </view>
        </view>
        <view class="empty_box fl_col_sp_st" v-else>
            <image class="empty_lab-img" src="https://file.y1b.cn/store/1-0/24524/665011208735a.png" mode="heightFix"></image>
            <view class="empty_timer">{{ showOverTime }}前有效</view>
            <view class="empty_btn" @click="goProductListHandle">领取更多优惠</view>
        </view>
    </scroll-view>
</view>
</van-popup>
<expandDia
    :isShow="isShowExpand"
    :couponPrice="max_coupon_money"
    :expandFaceValue="expandFaceValue"
    @close="isShowExpand = false"
    @expand="expandHandle"
    @goToUse="goToUseHandle"
></expandDia>
</view>
</template>
<script>
import {
bysubunionid,
goodsQuery,
goodsRecommended,
jingfen,
material,
} from '@/api/modules/jsShop.js';
import {
goodsPromotion,
goodsRecommend,
goodsSearch
} from '@/api/modules/pddShop.js';
import { getImgUrl } from '@/utils/auth.js';
import { parseTime } from '@/utils/index.js';
import { mapGetters, mapMutations } from "vuex";
import expandDia from "./expandDia.vue";
let interstitialAd = null;
export default {
    components:{
        expandDia
    },
    computed: {
        ...mapGetters(["gift", "userInfo", "diaList"]),
    },
    watch: {
        diaList(newValue, oldValue) {
            if(newValue.length && (newValue[0] == 'recommend')) {
                this.isShow = true;
            }
        },
        isShow(newValue, oldValue) {
            if(newValue) return setTimeout(() => this.startTime(), 100);
            setTimeout(() => this.resetTime(), 100);
        }
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            isShow: false,
            isOver: false,
            couponPrice: 0,
            expandFaceValue: 31,
            remainTime: 0,
            timeData: null,
            jdDate: null,
            pageNum: 1, // 页面num
            groupId_index: 0,
            goods: [],
            isScroll: true,
            isLoading: false,
            isShowRemainTime: true,
            showOverTime: '',
            isShowExpand: false,
            expandIndex: 0,
            isCodeErrorShow: false, // 扫码异常展示推券的事件区分
            isClickList: false, // 未点击过商品列表
            is_advertise: 0,
            max_coupon_money: 0,
            stickyTop: uni.upx2px(294),
            isShowSticky: false
        }
    },
    mounted() {
        interstitialAd = wx.createInterstitialAd({
            adUnitId: 'adunit-ea094960cd12b9c4'
        })
        interstitialAd.onLoad(() => interstitialAd.initFinish = true);
        interstitialAd.onError((err) => { })
        interstitialAd.onClose(() => {
            this.$emit('close');
        })
    },
    methods: {
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        itemHandle(item, index) {
            this.isClickList = true;
            // is_expand 0:开始膨胀；1：已膨胀； 2：无需要膨胀
            const { face_value } = item;
            this.expandIndex = index;
            if(face_value > this.max_coupon_money && !item.is_expand) {
                this.expandFaceValue = face_value;
                this.isShowExpand = true;
                return;
            }
            this.openEmbeddedRequest(item);
        },
        // 已膨胀事件
        expandHandle() {
            this.goods[this.expandIndex].is_expand = 1;
        },
        goToUseHandle() {
            this.isShowExpand = false;
            const item = this.goods[this.expandIndex];
            this.openEmbeddedRequest(item);
        },
        async openEmbeddedRequest(item){
            const { skuId, positionId, lx_type, goods_sign, is_flow } = item;
            let apiRequest = '';
            const params = { positionId };
            if (lx_type == 3) {
                apiRequest = goodsPromotion;
                params.goods_sign = goods_sign;
            } else {
                apiRequest = bysubunionid;
                params.skuId = skuId;
                if(!this.isShowRemainTime) params.is_popover = 1;
            }
            const skuRes = await apiRequest(params);
            if (skuRes.code == 0) return this.$toast(skuRes.msg);
            if (is_flow == 2) {
                this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&positionId=${positionId}`);
                return;
            }
            const {
                type_id,
                jdShareLink,
                mobile_url
            } = skuRes.data;
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                path: jdShareLink || mobile_url
            });
        },
        popupClose(isClick = false) {
            this.isShow = false;
            // 扫码异常关闭弹窗时 - 展示插屏广告
            if(this.is_advertise && isClick) {
                this.$wxReportEvent("closetq");
                if (!this.isClickList && interstitialAd && interstitialAd.initFinish) {
                    setTimeout(() => interstitialAd.show(), 100);
                    return;
                }
                this.$emit('close');
                return;
            }
            this.$emit('close');
        },
        popupShow() {
            if(this.diaList.length) {
                this.setDiaList('recommend');
                return;
            }
            this.isShow = true;
        },
        onChangeHandle(event) {
            // return;
            let {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            } = event.detail;
            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds
            milliseconds = Math.floor(milliseconds / 100);
            this.timeData = {
                hours,
                minutes,
                seconds,
                milliseconds,
                days
            }
        },
        // 倒计时结束
        countFinished(e) {
            // this.isOver = true;
        },
        resetTime() {
            // 时间重置
            const countDown = this.selectComponent('.cd_time-con');
            countDown && countDown.reset();
        },
        startTime() {
            const countDown = this.selectComponent('.cd_time-con');
            countDown && countDown.start();
        },
        async initShow(jdDate = null){
            this.isClickList = false;
            if(jdDate) {
                this.jdDate = jdDate;
                this.isShowRemainTime = false;
            } else {
                this.isShowRemainTime = true;
                const res = await goodsRecommended();
                if(res.code != 1) return;
                const {
                    over,
                    end_time,
                    group
                } = res.data;
                const cur_date = new Date().getTime();
                const over_time = new Date(end_time?.replace(new RegExp(/-/gm), '/')).getTime(); // 开始时间戳
                this.isOver = Boolean(over);
                this.showOverTime = parseTime(over_time, "{y}年{m}月{d}日 {h}:{i}");
                this.remainTime = over_time - cur_date;
                this.jdDate = group;
            }
            this.goods = [];
            this.pageNum = 1;
            this.isCodeErrorShow = false;
            const { coupon, max_coupon_money, is_advertise } = this.jdDate;
            this.couponPrice = coupon && coupon[0];
            this.max_coupon_money = max_coupon_money;
            // this.max_coupon_money = 11;
            this.is_advertise = is_advertise;
            this.popupShow();
            this.requestRem();
        },
        goProductListHandle() {
            this.popupClose();
            this.$switchTab(`pages/tabBar/shopMall/index`);
            // this.$go(`/pages/userModule/productList/index`);
        },
        scrollToLowerHandle(event) {
            if(!this.isScroll || this.goods.length < 5) return;
            this.requestRem();
        },
        scrollHandle(event) {
            const { scrollTop } = event.detail;
            this.isShowSticky = scrollTop > this.stickyTop;
        },
        // 弹窗进入 初始化
        initGtData(data) {
            this.isClickList = false;
            this.pageNum = 1;
            this.goods = [];
            this.isCodeErrorShow = false;
            if(!data) return;
            const {
                group_id,
                group_cid,
                group_cid2,
                group_cid3,
                eliteId,
                groupId,
                group_type,
                end_time,
                coupon,
                over,
                interval_time,
                isCodeErrorShow,
                goods_lx_type,
                positionId,
                is_advertise,
                max_coupon_money
            } = data;
            this.is_advertise = is_advertise;
            this.isCodeErrorShow = isCodeErrorShow;
            if(end_time || interval_time) {
                const cur_date = new Date().getTime();
                let over_time = new Date(end_time?.replace(new RegExp(/-/gm), '/')).getTime(); // 结束时间戳
                // if(interval_time) {
                //     over_time = cur_date + (interval_time*60*60*1000);
                // }
                this.remainTime = over_time - cur_date;
                this.showOverTime = parseTime(over_time, "{y}年{m}月{d}日 {h}:{i}");
                this.isShowRemainTime = true;
            } else {
                this.isShowRemainTime = false
            }
            // if(!over) this.popupClose(); // 倒计时结束
            this.isOver = Boolean(over) || (this.remainTime <= 0);
            this.couponPrice = coupon && coupon[0];
            this.max_coupon_money = max_coupon_money;
            // this.max_coupon_money = 11;
            this.jdDate = {
                id: group_id,
                cid: group_cid,
                cid2: group_cid2,
                cid3: group_cid3,
                eliteId,
                groupId,
                type: group_type,
                lx_type: goods_lx_type,
                positionId
            };
            this.popupShow();
            this.requestRem();
        },
        async requestRem() {
            if(this.isLoading) return;
            this.isLoading = true;
            const {
                id,
                cid,
                cid2,
                cid3,
                eliteId,
                groupId,
                type,
                lx_type,
                positionId
            } = this.jdDate;
            let params = {
                id,
                page: this.pageNum,
                size: 10,
            }
            let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch(type) {
                case 1:
                    if (lx_type == 2) {
                        queryApi = goodsRecommend;
                        params.positionId = positionId;
                    } else {
                        queryApi = material;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 10;
                    }
                    break;
                case 2:
                    if (lx_type == 2) {
                        queryApi = goodsSearch;
                        params.positionId = positionId;
                    } else {
                        queryApi = jingfen;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 20;
                    }
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
                this.isLoading = false;
                this.isScroll = Number(total_count);
                // if(this.pageNum == 1) this.goods = [];
                this.pageNum += 1;
                this.goods = this.goods.concat(list); // 追加新数据
                if(!this.isScroll && type != 4) return;
                let isNextPage = Boolean(total_count) && (this.pageNum * params.size) <= total_count;
                if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                    this.groupId_index += 1;
                    this.pageNum = 1;
                    this.requestRem();
                    return;
                }
                if(list.length <= 4  && this.pageNum == 1) return this.requestRem();
                if(isNextPage && (list.length < 5)) {
                    this.requestRem();
                    return;
                }
            }).catch(()=>{
                //联网失败, 结束加载
            }).finally(res => {
                this.isLoading = false;
            })
        },
    }
}
</script>
<style lang="scss">
.detail_box {
    position: relative;
    height: 84vh;
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
        padding: 16rpx;
        margin: 0 24rpx 0rpx auto;
        display: block;
        position: absolute;
        right: 0;
    }
    .lab_title{
        width: 388rpx;
        height: 92rpx;
        display: block;
        margin: auto;
        &.active {
            opacity: 0;
        }
    }
}

.dia_cont{
    position: relative;
    margin-top: -16rpx;
}
.detail_cont{
    background: #fffae9;
    border-radius: 40rpx 40rpx 0rpx 0rpx;
    position: relative;
    flex: 1;
    overflow: hidden;
    overflow-y: scroll;
    box-sizing: border-box;
    margin-top: 16rpx;
    .scroll_top-sticky {
        position: sticky;
        z-index: 1;
        left: 0;
        top: 0;
        right: 0;
        background: #fffae9;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
        transition: height .3s;
        height: 0;
        overflow: hidden;
        &.active {
            height: auto;
            overflow: initial;
            padding: 32rpx 46rpx;
        }
        &::before {
            content: '\3000';
            position: absolute;
            width: 100%;
            height: 150rpx;
            background: #fffae9;
            top: 0;
            left: 0;
            z-index: -1;
            filter: blur(20rpx);
        }
        &::after {
            content: '\3000';
            position: absolute;
            width: 722rpx;
            height: 76rpx;
            background: #fffae9;
            top: 16rpx;
            left: 14rpx;
            z-index: -1;
            background: #fffae9 url("https://file.y1b.cn/store/1-0/24523/664f07078fb7d.png") 0 0 / 100% 100%;

        }
        .scroll_top_coupon {
            font-size: 32rpx;
            font-weight: 600;
            display: flex;
            align-items: center;
            .scroll_top_icon{
                width: 38rpx;
                height: 28rpx;
                margin-right: 8rpx;
            }
        }
        .cd_txt{
            margin: 0;
        }
    }
}
.rec_detail-box {
}
.rec_detail{
    position: relative;
    z-index: 0;
    color: #fff;
    // margin: 76rpx 0 86rpx;
    padding: 76rpx 0 86rpx;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24523/664efe8d4f955.png") 0 0 / 100% 100%;
        width: 100%;
        height: 294rpx;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
    .rec_detail-left{
        width: 30%;
        text-align: center;
        font-size: 68rpx;
        font-weight: 600;
        line-height: 96rpx;
        position: relative;
        .detail_num {
            position: relative;
            white-space: nowrap;
            // &::before {
            //     content: '\3000';
            //     background: url("https://file.y1b.cn/store/1-0/24119/65a9cd74bec29.png") 0 0 / cover;
            //     width: 64rpx;
            //     height: 32rpx;
            //     position: absolute;
            //     top: 5rpx;
            //     right: -40rpx;
            // }
            &::after {
                content: '元';
                font-size: 28rpx;
            }
        }
    }
    .rec_detail-right{
        width: 60%;
        font-size: 32rpx;
        font-weight: 600;
        line-height: 44rpx;
    }
}
.cd_txt{
    font-weight: 600;
    font-size: 26rpx;
    color: #fff;
    margin-top: 16rpx;
    .item{
      width: 34rpx;
      height: 34rpx;
      background: rgba($color: #000, $alpha: .45);
      border-radius: 6rpx;
      text-align: center;
      line-height: 34rpx;
      margin: 0 8rpx;
      display: inline-block;
      font-size: 24rpx;
    }
    .item_lab{
      margin-left: 16rpx;
    }
}
.good-list {
    position: relative;
    overflow: hidden;
    padding: 14rpx;
    .good-list-item {
        width: 354rpx;
        background-color: #ffffff;
        border-radius: 8px;
        margin-bottom: 16rpx;
        overflow: hidden;
        position: relative;
        z-index: 0;
        &.active::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231212/6577bdf34de59.png") 0 0 / cover;
            width: 174rpx;
            height: 202rpx;
            position: absolute;
            bottom: 0;
            right: 0;
            z-index: -1;
        }
    }

    .good-list-item:nth-child(odd) {
        float: left;
    }

    .good-list-item:nth-child(even) {
        float: right;
    }

    .good-img {
        width: 352rpx;
        height: 352rpx;
        font-size: 0;
        position: relative;
        .img_rem-box {
            height: 56rpx;
            width: 100%;
            position: absolute;
            z-index: 0;
            bottom: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .img_rem-right{
                width: 266rpx;
                height: 56rpx;
                position: relative;
                z-index: 0;
                text-align: center;
                font-size: 28rpx;
                font-weight: 600;
                color: #ffffff;
                line-height: 56rpx;
            }
        }
    }
    .good_name_box {
        margin: 20rpx 16rpx 0;
        font-size: 28rpx;
        min-height: 80rpx;
        height: 80rpx;
        line-height: 40rpx;
        color: #333;
    }
    .list_price{
        font-size: 24rpx;
        font-weight: 600;
        color: #e7331b;
        line-height: 34rpx;
        padding: 0 16rpx;
        margin-top: 18rpx;
        .price_line{
            font-size: 24rpx;
            font-weight: 400;
            color: #aaa;
            margin-left: 16rpx;
            text-decoration: line-through;
        }
    }
    .price_btn{
        width: 322rpx;
        height: 60rpx;
        line-height: 60rpx;
        margin: 16rpx auto 30rpx;
        color: #fff;
        text-align: center;
        font-size: 26rpx;
        position: relative;
        z-index: 0;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231211/65766961d7083.png") 0 0 / 100% 100%;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
        }
    }
}

.empty_box{
    width: 100%;
    box-sizing: border-box;
    margin-top: 178rpx;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/public/img/ttxl/static/images/img_no_data.png") 0 0 / 100%;
        display: block;
        width: 358rpx;
        height: 330rpx;
    }
    .empty_img{
        width: 358rpx;
        height: 330rpx;
    }
    .empty_lab-img{
        width: 434rpx;
        height: 40rpx;
        margin-top: 29rpx;
    }
    .empty_timer{
        font-size: 26rpx;
        text-align: center;
        color: #c1c1c1;
        margin-top: 16rpx;
    }
    .empty_btn{
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
.loading_box{
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
.timer_fixed {
    position: fixed;
    bottom: 146rpx;
    left: 32rpx;
    padding: 4rpx 0;
    z-index: 1;
    border-radius: 20rpx;
    height: 94rpx;
    overflow: hidden;
    .timer_fixed-left {
        font-size: 36rpx;
        font-weight: 600;
        color: #fff;
        padding: 0 12rpx;
        text-align: center;
        height: 100%;
        line-height: 94rpx;
        background: #FFA244;
        box-sizing: border-box;
        margin-right: 20rpx;
        position: relative;
        &::before {
            content: '￥';
            font-size: 24rpx;
        }
        &::after {
            content: '\3000';
            background: url("https://test-file.y1b.cn/store/1-0/2424/65bf2fbb64d36.png") 0 0 / 100% 100%;
            width: 21rpx;
            height: 94rpx;
            position: absolute;
            top:0;
            right: -20rpx;
        }
    }
    .timer_fixed-right {
        height: 100%;
        background: #fff;
        font-size: 22rpx;
        color: #666;
        min-width: 112rpx;
        padding: 0 24rpx 0 12rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }
}
.good_name_lab {
  padding: 0 10rpx 0 20rpx;
  font-size: 24rpx;
  font-weight: 600;
  color: #ffffff;
  line-height: 34rpx;
  position: relative;
  z-index: 0;
  margin-right: 8rpx;
  white-space: nowrap;
  display: inline-block;
  &::before {
    content: "\3000";
    background: url("https://file.y1b.cn/store/1-0/23810/64d44dc19f327.png") 0 0 / 100% 100% no-repeat;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
.total_cont {
    margin: 10rpx 16rpx 28rpx;
    white-space: nowrap;
    font-size: 26rpx;
    height: 34rpx;
    .use_cont-left {
        color: #32a666;
        display: flex;
        align-items: center;
        &::before {
        content: "\3000";
        width: 30rpx;
        height: 30rpx;
        background: url("https://test-file.y1b.cn/store/1-0/24312/65f023e89516c.png")  0 0 / 100% 100% no-repeat;
        margin-right: 5rpx;
        }
    }
    .item_total {
        margin-left: 10rpx;
        color: #aaa;
    }
}
</style>
