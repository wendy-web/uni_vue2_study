<template>
<view class="detail">
<mescroll-body
  :sticky="true"
  ref="mescrollRef"
  @init="mescrollInit"
  @down="downCallback"
  @up="upCallback"
  :up="upOption"
  :down="downOption"
>
<xh-navbar
  :leftImage="imgUrl+'/static/images/left_back.png'"
  @leftCallBack="$topCallBack"
  :fixed="true"
  title="省钱明细"
  titleColor="#333"
  :navberColor="isShowNavBerColor ? '#F8F0C4': ''"
></xh-navbar>
    <image :src="cardVip_bgImg" :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <image :src="cardImgUrl + 'payDetail_vip.png'" mode="widthFix" class="payDetail_vip"></image>
    <view class="card_top fl_al_start1">
        <image :src="cardImgUrl + 'payDetail_icon.png'" mode="scaleToFill" class="top_icon"></image>
        <view> 累计已省
            <view v-html="formatPrice(totalSavingMoney)" class="detail_price"></view>
        </view>
    </view>
    <view class="card_cont" v-if="detailList.length">
        <block
            v-for="(item, index) in detailList"
            :key="index"
        >
            <view class="lab_title fl_bet">
                <view class="lab_title-left">{{item.date}}</view>
                <view class="lab_title-right">
                    共省 <text style="color: #FE423D;">{{item.total_saving_money }}</text> 元
                </view>
            </view>
            <view class="item_list-box" >
                <view class="item_list fl_bet"
                    v-for="(itemList, idx) in item.list"
                    :key="idx"
                >
                    <view class="item_list-left box_fl">
                        <view class="item_list-img">
                            <van-image
                                height="80rpx"
                                width="80rpx"
                                :src="itemList.goods_imgs || haiWeiObj[itemList.pay_way]"
                                use-loading-slot
                                use-error-slot
                            >
                                <van-loading slot="loading" type="spinner" size="30" vertical />
                                <van-icon slot="error" color="#edeef1" size="30" name="photo-fail" />
                            </van-image>
                        </view>
                        <view class="fl_col_sp_bt txt_lab">
                            <view class="txt_ov_ell1">{{itemList.goods_sku_name}}</view>
                            <view class="item_lab">{{ itemList.create_time }}</view>
                        </view>
                    </view>
                    <view class="item_list-right fl_col_sp_bt">
                        <view style="font-weight: bold;">省{{itemList.saving_money}}元</view>
                        <view v-if="Number(itemList.packet_money)" style="color: #999;">
                            红包抵{{itemList.packet_money}}元
                        </view>
                    </view>
                </view>
            </view>
        </block>
    </view>
</mescroll-body>
</view>
</template>
<script>
import { savingDetail } from "@/api/modules/packet.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapGetters } from "vuex";
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
            isShowNavBerColor: false,
            upOption: {
            },
            downOption: {
            },
            detailList: [],
            totalSavingMoney: 0,
            haiWeiObj: {
                'HW_wallace': 'https://file.y1b.cn/store/1-0/23124/656d7cf501530.png',
                'HW_burger': 'https://file.y1b.cn/store/1-0/23124/656d7d3a90115.png',
                'HW_pizza': 'https://file.y1b.cn/store/1-0/23124/656d7d1c22d7c.png',
                'HW_heytea': 'https://file.y1b.cn/store/1-0/23124/656d7d4cccc81.png',
                'HW_nayuki': 'https://file.y1b.cn/store/1-0/23124/656d7d5ece54d.png',
                'xl_hf': 'https://file.y1b.cn/store/1-0/2416/6598c9ea9fb0a.png'
            }
        }
    },
    computed: {
        ...mapGetters([]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        cardVip_bgImg() {
            let url = 'payDetail_bg.png';
            return `${this.cardImgUrl}${url}`
        }
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
    },
    methods: {
        async upCallback(page) {
            let params = {
                size: 10,
                page: page.num,
            }
            savingDetail(params).then((res) => {
                if(res.code != 1) return this.mescroll.endSuccess(0);
                const { list, total_saving_moneys } = res.data;
                this.totalSavingMoney = total_saving_moneys;
                // 如果是第一页需手动制空列表
                if(page.num == 1) this.detailList = [];
                this.detailList = this.detailList.concat(list); //追加新数据
                this.mescroll.endSuccess(list.length);
            }).catch((err) => {
                this.mescroll.endErr();
            });
        },
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop);
            // console.log('scrollTop :>> ', scrollTop);
            if(scrollTop >= this.navHeight) {
                this.isShowNavBerColor = true;
                return;
            }
            this.isShowNavBerColor = false;
        },
        formatPrice(price) {
            // 先转类型为数字，再保留2位小数
            price = Number(price).toFixed(2);
            if (!price) return;
            let splitPrice = price.split(".");
            return `
                <span style="font-weight:500;font-size: 24px">
                    ¥${splitPrice[0]}.
                    <span style="font-size: 15px;">${splitPrice[1]}</span>
                </span>`;
        },
    }
}
</script>

<style lang="scss">
.detail{
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    background: linear-gradient(180deg,#ffffff, #f5f6fa 21%);
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
    .payDetail_vip {
        width: 300rpx;
        height: 286rpx;
        position: absolute;
        z-index: -1;
        right: 32rpx;
        top: 126rpx;
    }
}
.card_top{
    position: relative;
    padding: 44rpx 34rpx 24rpx;
    font-size: 32rpx;
    color: #333333;
    line-height: 44rpx;
    .top_icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
    }
    .detail_price{
        margin-top: 18rpx;
    }
}

.card_cont{
    padding: 32rpx 24rpx 0;
    background: linear-gradient(180deg,#ffffff, #f5f6fa 21%);
    border-radius: 40rpx;
}
.lab_title{
    margin-bottom: 24rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
    line-height: 42rpx;
    padding: 0 16rpx;
    .lab_title-left{
        position: relative;
        z-index: 0;
        &::before {
            content: '\3000';
            width: 64rpx;
            height: 8rpx;
            background: #ffad5d;
            border-radius: 4rpx;
            filter: blur(1rpx);
            position: absolute;
            z-index: -1;
            left: 0;
            bottom: 0;
        }
    }
}
.item_list-box {
    background: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    margin-bottom: 48rpx;
}
.item_list{
    padding: 0 32rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333;
    line-height: 40rpx;
    margin: 40rpx auto;
    overflow: hidden;
    .item_list-img {
        width: 80rpx;
        height: 80rpx;
        margin-right: 16rpx;
    }
    .item_lab{
        font-size: 26rpx;
        font-weight: 400;
        color: #aaa;
        line-height: 36rpx;
    }
}
.item_list-left{
    flex: 1;
    overflow: hidden;
    .txt_lab {
        flex: 1;
        overflow: hidden;
    }
}
.item_list-right {
    font-size: 26rpx;
    white-space: nowrap;
    text-align: right;
    margin-left: 10rpx;
}
</style>
