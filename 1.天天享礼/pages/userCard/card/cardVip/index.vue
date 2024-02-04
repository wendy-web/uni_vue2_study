<template>
<view class="card">
<mescroll-body
    id="mescrollBody"
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    :down="downOption"
    :up="upOption"
    @up="upCallback"
>
<xh-navbar
  :fixedNum="true"
  titleAlign="titleRight"
  :navberColor="isShowNavBerColor ? '#FFECBD': ''"
>
    <view slot="title" class="nav-custom fl_bet">
        <view class="custom_left box_fl" @click="$topCallBack">省钱卡会员</view>
        <image class="search_icon" mode="aspectFill"
            src="https://file.y1b.cn/store/1-0/231123/655eeada7864e.png"
            @click="toSearchHandle"
        ></image>
    </view>
</xh-navbar>
<image :src="cardVip_bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <!-- 开通 -->
    <view class="car_top-active" @click.stop="goPayDetailHandle">
        <view class="box_fl">
            <!-- 头像 -->
            <view @click.stop="goRecordHandle">
                <van-image
                    class="avatar-icon"
                    height="80rpx"
                    width="80rpx"
                    radius="50%"
                    :src="userInfo.avatar_url || default_avatar"
                    use-loading-slot
                ><van-loading slot="loading" type="spinner" size="20" vertical />
                </van-image>
            </view>
            <view class="nick_cont" @click.stop="goRecordHandle">
                <view class="nick_name">{{ userInfo.nick_name || "未登录" }}</view>
                <view class="nick_lab" v-if="vipObject.over_time">
                    省钱{{['月', '季', '年'][vipObject.card_type || 0]}}卡：{{vipObject.over_time}}到期</view>
            </view>
        </view>
        <view class="car_top-cont fl_bet">
            <view class="top_cont-left" v-if="vipObject.saving_money">
                已为您省了
                <text style="font-size: 48rpx;font-weight: 600;">{{vipObject.saving_money}}</text>元
                <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="28rpx" name="arrow"/>
            </view>
            <view class="car_open-lab" v-else>
                预计月省
                <text style="font-weight: 600; font-size: 48rpx; margin: 0 5rpx">{{vipObject.money || 0}}</text>元+
            </view>
            <view class="top_cont-right" v-if="vipObject.need_xf" @click.stop="goPayHandle">续费</view>
        </view>
    </view>
    <view class="car_red-cont" v-if="packetList.length">
        <view class="red_cont-title fl_bet">
            <view>
                <text style="color: #FE423D;margin-right: 10rpx;" v-if="packetCount">{{ packetCount }}</text>
                {{ packetCount ? '张可用' : '省钱卡红包'}}
            </view>
            <view class="red_cont-right" @click="goRedPacketHandle">
                查看更多
                <van-icon custom-style="font-weight: 600;margin-left: 5rpx" color="#aaa" size="28rpx" name="arrow"/>
            </view>
        </view>
        <scroll-view class="red_cont-box" scroll-x="true">
            <view class="red_item-box">
                <view class="red_item"
                    v-for="(item, index) in packetList" :key="index"
                >
                    <image class="bg_img" :src="cardImgUrl + 'red_num-bg.png'" mode="aspectFill" v-if="!item.status"></image>
                    <image class="bg_img" :src="cardImgUrl + 'red_toUse1.png'" mode="aspectFill" v-else></image>
                    <view class="red_item-price">{{ item.money }}</view>
                    <view class="red_item-time" v-if="!item.status">{{ item.word }}</view>
                </view>
            </view>
        </scroll-view>
    </view>
    <!-- 省钱卡特权 -->
    <prerogativeList titleStyle="center" :isSpread="isSpread" @spread="isSpread = !isSpread"></prerogativeList>
    <view class="cont_bottom" v-if="goods.length">
        <view class="lab_title">省钱卡专享</view>
        <good-list
            :list="goods"
            :isJdLink="true"
        ></good-list>
    </view>
    <paySuccessDia
        :isShow="isOpenVip"
        :isNewPay="true"
        title="开通成功"
        @close="isOpenVip = false"
        @confirm="isOpenVip = false"
    ></paySuccessDia>
    <applySuccessDia
        :isShow="isApplyVip"
        @close="$topCallBack"
    ></applySuccessDia>
    <confirmDia
        :isShow="isShowConfirmDia"
        :content="confirmCont"
        @close="$topCallBack"
    ></confirmDia>
</mescroll-body>
</view>
</template>

<script>
import { groupRecommend } from "@/api/modules/index.js";
import { goodsQuery, jingfen, material } from "@/api/modules/jsShop.js";
import { goodsList, nowPacket, savingInfo, teamBind } from "@/api/modules/packet.js";
import goodList from "@/components/goodList.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl, getUrlKey } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapActions, mapGetters, mapMutations } from "vuex";
import applySuccessDia from '../component/applySuccessDia.vue';
import confirmDia from '../component/confirmDia.vue';
import paySuccessDia from '../component/paySuccessDia.vue';
import prerogativeList from '../component/prerogativeList.vue';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        goodList,
        paySuccessDia,
        applySuccessDia,
        confirmDia,
        prerogativeList
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
            isShowNavBerColor: false,
            vipObject: null,
            packetCount: 0,
            packetList: [],
            downOption: {
                auto: false,
                use: false,
                bgColor: "#ffffff",
            },
            upOption: {
                auto: true, // 不自动加载
                use: true,
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 1, // 每页数据的数量
                },
                noMoreSize: 4,
                // empty:{
                // 	tip: '~ 空空如也 ~', // 提示
                // 	btnText: '去看看'
                // }
            },
            goods: [],
            pageNum: 1,
            groupId_index: 0,
            isOpenVip: false,
            groupRecommendData: null,
            isInitHomeList: true,
            xdyh_teamId: 0,
            isApplyVip: false,
            isShowConfirmDia: false,
            confirmCont: '',
            isSpread: false
        }
    },
    computed: {
        ...mapGetters([
            "userInfo",
            "isAutoLogin",
        ]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        cardVip_bgImg() {
            let url = 'cardVip_bg1.png';;
            return `${this.cardImgUrl}${url}`
        }
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        if(option.q){
            const codeUrl = decodeURIComponent(option.q);
            // const codeUrl = 'ttxl-test.y1b.cn/?xdyh_teamId=16';
            this.xdyh_teamId = getUrlKey(codeUrl, 'xdyh_teamId');
            !this.isAutoLogin && this.setAutoLogin(true);
        }
        if(option.isOpenVip) {
            this.isOpenVip = option.isOpenVip;
        }
    },
    async onShow() {
        if(this.xdyh_teamId) {
            const res = await teamBind({xdyh_teamId: this.xdyh_teamId});
            this.init();
            this.initNowPacket();
            this.xdyh_teamId = null;
            if(res.code != 1) return this.$toast(res.msg, 3000);
            this.getUserInfo();
            if(res.data == 1) {
                return this.isApplyVip = true;
            }
            if(res.data == 3) {
                this.isShowConfirmDia = true;
                this.confirmCont = res.msg;
                return;
            }
            setTimeout(() => {
                this.$toast(res.msg, 3000);
            },1000);
            return;
        }
        this.init();
        this.initNowPacket();
    },
    methods: {
        ...mapMutations({
            setAutoLogin: 'user/setAutoLogin'
        }),
        ...mapActions({
            getUserInfo: "user/getUserInfo",
        }),
        toSearchHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$go(`/pages/userModule/productList/search`);
        },
        async upCallback(page) {
            if(this.isInitHomeList) {
                this.requestGoodsList(page);
                return;
            }
            this.requestRem(page);
        },
        requestGoodsList(page) {
            let params = {
                page: page.num,
                size: 10
            }
            goodsList(params).then(res => {
                const { list, total_count } = res.data;
                // 设置列表数据
                if (page.num == 1) {
                    this.goods = [];
                    this.pageNum = 1;
                }
                this.goods = this.goods.concat(list); // 追加新数据
                this.mescroll.endSuccess(this.goods.length);
                if(page.num * 10 >= total_count) {
                    this.isInitHomeList = false;
                    this.pageNum = 1;
                    this.mescroll.triggerUpScroll();
                }
            }).catch(() => this.mescroll.endErr());
        },
        async requestRem(page) {
            if (!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: 14 });
                if (recRes.code != 1 || !recRes.data)
                return this.mescroll.endSuccess(0);
                this.groupRecommendData = recRes.data;
            }
            const { id, cid, cid2, cid3, eliteId, groupId, type } =this.groupRecommendData;
            let pageNum = this.pageNum;
            let params = {
                id,
                page: pageNum,
                size: 10,
            };
            let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch (type) {
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
            }
            queryApi(params).then((res) => {
                const { list, total_count } = res.data;
                // 设置列表数据
                if (page.num == 1) {
                    this.goods = [];
                    this.pageNum = 1;
                } //如果是第一页需手动制空列表
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = pageNum * params.size < total_count;
                if ( !isNextPage && type == 4 && this.groupId_index < groupId.length - 1 ) {
                    // 无下一页
                    this.groupId_index += 1;
                    this.mescroll.endSuccess(total_count, true);
                    this.pageNum = 0;
                } else {
                    this.mescroll.endSuccess(list.length || total_count, isNextPage);
                }
                this.pageNum += 1;
                this.goods = this.goods.concat(list); // 追加新数据
                if (list.length <= 0 && pageNum * params.size < total_count) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(() => this.mescroll.endErr());
        },
        async init() {
            const res = await savingInfo();
            if(res.code != 1 || !res.data) return;
            this.vipObject = res.data;
        },
        async initNowPacket(){
            const res = await nowPacket();
            if(res.code != 1 || !res.data) return;
            const { total_count, list } = res.data;
            this.packetCount = total_count;
            this.packetList = list;
        },
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop);
            if(scrollTop >= this.navHeight) {
                this.isShowNavBerColor = true;
                return;
            }
            this.isShowNavBerColor = false;
        },
        goRecordHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$go('/pages/userCard/card/cardVip/recordIndex');
        },
        goRedPacketHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$go('/pages/userCard/card/cardVip/redPacket');
        },
        goPayDetailHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            if(this.vipObject.saving_money) {
                this.$go(`/pages/userCard/card/cardVip/payDetail`);
            }
        },
        goPayHandle() {
            const { id, over_time, have_day } = this.vipObject;
            this.$go(`/pages/userCard/card/cardVip/payIndex?goods_id=${id}&over_time=${over_time}&have_day=${have_day}`);
        }
    }
}
</script>

<style lang="scss">
.card{
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    background: #FEF6E5;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
}
.nav-custom{
	flex: 1;
    .search_icon {
		flex: 0 0 64rpx;
		box-sizing: border-box;
		width: 64rpx;
		height: 64rpx;
	}
    .custom_left{
        font-weight: 600;
        color: #333;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/public/img/ttxl/static/images/left_back.png") 0 0 / cover;
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
            display: block;
        }
    }
}
.card_top{
    margin: 58rpx 16rpx 0;
    position: relative;
    z-index: 0;
    font-size: 0;
    padding: 32rpx 32rpx 36rpx;
    .bg_img1{
        position: absolute;
        width: 750rpx;
        height: 36rpx;
        z-index: -1;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
}
.car_top-active {
    margin: 48rpx 24rpx 0;
    position: relative;
    z-index: 0;
    font-size: 0;
    padding: 48rpx 35rpx 36rpx 40rpx;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24116/65a5ebf32ac93.png") 0 0 / 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    &::after {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/23113/6544c55e53a7f.png") 0 0 / 100% 100%;
        position: absolute;
        width: 288rpx;
        height: 230rpx;
        right: -24rpx;
        top: -51rpx;
        z-index: -1;
    }
    .vip_cont-icon {
        position: absolute;
        width: 288rpx;
        height: 230rpx;
        right: 15rpx;
        top: -51rpx;
    }
    .car_top-cont {
        margin-top: 54rpx;
        .top_cont-left{
            line-height: 36rpx;
            font-size: 26rpx;
            color: #333;
        }
        .top_cont-right{
            width: 136rpx;
            height: 68rpx;
            border: 1rpx solid rgba(252,241,215,0.80);
            border-radius: 35rpx;
            line-height: 68rpx;
            text-align: center;
            font-size: 28rpx;
            color: #9a4119;
            position: relative;
            &::before {
                content: '\3000';
                position: absolute;
                z-index: -1;
                top: 4rpx;
                left: 4rpx;
                width: 128rpx;
                height: 60rpx;
                background: rgba(254,250,241,0.68);
                border-radius: 30rpx;
            }
        }
    }
}
.red_cont-box{
    height: 166rpx;
    margin-top: 24rpx;
    background: #fff;
    padding: 32rpx 0;
    border-radius: 24rpx;
}
.red_item-box {
    display: flex;
    flex-wrap: nowrap;
    .red_item {
        width: 194rpx;
        flex: 0 0 194rpx;
        height: 166rpx;
        position: relative;
        z-index: 0;
        text-align: center;
        margin-right: 24rpx;
        &:first-child {
            margin-left: 24rpx;
        }
        &:not(:last-child) {
            margin-right: 24rpx;
        }
    }
    .red_item-price {
        font-size: 44rpx;
        font-weight: 500;
        color: #fe423d;
        line-height: 60rpx;
        margin: 38rpx auto 0;
        &::before {
            content: '￥';
            font-size: 24rpx;
        }
    }
    .red_item-time{
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 13rpx;
        font-size: 28rpx;
        color: #ffffff;
        line-height: 32rpx;
        text-shadow: 2rpx 2rpx 4rpx 0rpx rgba(89,4,0,0.26);
    }
}
.card_top-btn{
    width: 140rpx;
    height: 60rpx;
}
.nick_cont{
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    line-height: 40rpx;
    margin-left: 20rpx;
    .nick_name {
        color: #B75A30;
        line-height: 1;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") 0 0 / 100% 100%;
            width: 28rpx;
            height: 26rpx;
            margin-right: 4rpx;
            display: inline-block;
        }
    }
    .nick_lab{
        font-size: 24rpx;
        font-weight: 400;
        color: #666;
        line-height: 34rpx;
        margin-top: 6rpx;
    }
}
.card_cont{
    background: #fff;
    padding: 72rpx 24rpx 0;
    margin-top: -18rpx;
}
.sel_item{
    position: relative;
    z-index: 0;
    width: 218rpx;
    height: 312rpx;
    font-size: 28rpx;
    text-align: center;
    color: #333;
    &.active {
        .item_price {
            color: #F84842;
        }
        .price_value{
            color: #B07851;
            font-weight: 500;
        }
    }
    .item_time{
        margin: 32rpx auto 10rpx;
        font-weight: 500;
        line-height: 40rpx;
    }
    .price_line {
        font-size: 26rpx;
        text-decoration:  line-through;
        color: #a1a1b1;
        line-height: 36rpx;
        margin-top: 4rpx;
    }
    .price_value{
        position: absolute;
        bottom: 8rpx;
        width: 100%;
        text-align: center;
        left: 0;
    }
}
.lab_title{
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    line-height: 44rpx;
    padding: 40rpx 24rpx 24rpx;
    border-radius: 24rpx 24rpx 0 0;
    position: relative;
}
.red_lab {
    font-size: 26rpx;
    color: #999;
    line-height: 36rpx;
    margin: 25rpx 0 32rpx;
    .red_av {
        width: 32rpx;
        height: 32rpx;
        border-radius: 50%;
        margin-right: 8rpx;
    }
}
.car_red-cont{
    border-radius: 24rpx;
    margin: 56rpx 24rpx 0;
    .red_cont-title{
        font-size: 28rpx;
        font-weight: 600;
        padding: 0 24rpx;
    }
    .red_cont-right{
        font-size: 26rpx;
        color: #aaaaaa;
    }
}
.car_open-lab {
    font-size: 26rpx;
    color: #333;
    margin-top: 6rpx;
    position: relative;
    z-index: 0;
    &::before {
      content: "\3000";
      position: absolute;
      width: 228rpx;
      height: 16rpx;
      background: rgba(255, 255, 255, 0.4);
      bottom: 0;
      z-index: -1;
      left: 50%;
      transform: translateX(-50%);
    }
}
.cont_bottom {
    position: relative;
    z-index: 0;
    margin-top: 56rpx;
    &::before {
        content: '\3000';
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 40rpx;
        background: linear-gradient(180deg,#ffffff, #f5f6fa 19%);
    }
}
</style>
