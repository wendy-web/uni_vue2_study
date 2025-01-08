<template>
<mescroll-uni
    ref="mescrollRef"
    @init="mescrollInit"
    :height="height"
    :down="downOption"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
    @emptyclick="emptyClick"
>
    <block v-if="!curTab">
        <view class="record_item" v-if="validList.length">
            <view class="record_title box_fl">
                <image :src="cardImgUrl + 'valid0.png'" mode="scaleToFill" class="record_title-icon"></image>
                <text>有效订单</text>
            </view>
            <view
                v-for="(item, index) in validList" :key="index"
                :class="['record_list fl_bet', !index ? 'active' : '']"
                @click="orderHandle(item.id)"
            >
                <image :src="cardImgUrl + 'valid_bg.png'" mode="scaleToFill" class="valid_bg"></image>
                <view class="record_list-left">
                    <view class="record_list-txt box_fl">
                        {{item.title}}
                        <view class="record_list-icon" v-if="item.tag == 2">续费</view>
                    </view>
                    <view class="record_list-lab">{{item.pay_time}}</view>
                </view>
                <view class="record_list-right">
                    {{item.status_desc}}
                    <van-icon custom-style="margin-left: 5rpx" color="#aaa" size="28rpx" name="arrow"/>
                </view>
            </view>
        </view>
        <view class="record_item" v-if="noValidList.length">
            <view class="record_title box_fl">
                <image :src="cardImgUrl + 'valid1.png'" mode="scaleToFill" class="record_title-icon"></image>
                <text>已失效订单</text>
            </view>
            <view class="record_list fl_bet"
                v-for="(item, index) in noValidList"
                :key="index"
                @click="orderHandle(item.id)"
            >
                <view class="record_list-left">
                    <view class="record_list-txt box_fl" style="color: #aaa;">
                        {{item.title}}
                        <view class="record_list-icon" v-if="item.tag ==2">续费</view>
                    </view>
                    <view class="record_list-lab">{{item.pay_time}}</view>
                </view>
                <view class="record_list-right">
                    {{item.status_desc}}
                    <van-icon custom-style="margin-left: 5rpx" color="#aaa" size="28rpx" name="arrow"/>
                </view>
            </view>
        </view>
    </block>
    <!-- 加量包 -->
    <view class="record_item" v-else>
        <view :class="['record_list fl_bet',  item.status != 3 ? 'active' : '']"
            v-for="(item, index) in dosingList" :key="index"
            @click="orderHandle(item.id)"
        >
            <view class="record_list-left">
                <view class="record_list-txt">{{item.title}}</view>
                <view class="record_list-lab">{{item.create_time}}</view>
            </view>
            <view class="record_list-right">
                {{item.status_desc}}
                <van-icon custom-style="margin-left: 5rpx" color="#aaa" size="28rpx" name="arrow"/>
            </view>
        </view>
    </view>
</mescroll-uni>
</template>

<script>
import { dosingPacket, mySavings } from "@/api/modules/packet.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import { getImgUrl } from '@/utils/auth.js';
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		data() {
			return {
				imgUrl: getImgUrl(),
                cardImgUrl:`${getImgUrl()}static/card/`,
				downOption: {
					auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false,
					noMoreSize: 4,
					textNoMore: '----- 没有更多了 -----'
				},
                validList: [],
                noValidList: [],
                dosingList: [],
                mescroll: null
			}
		},
		props: {
			curTab: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default () {
					return []
				}
			},
			height: [Number, String] // mescroll的高度
		},
		mounted() {
		},
		methods: {
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			upCallback(page) {
                (this.curTab == 1) ? this.dosingPacketRequest(page) : this.mySavingsRequest(page);
                return;
			},
            mescrollInit(mescroll) {
                this.mescroll = mescroll;
                if(!this.curTab) this.downCallback();
            },
            dosingPacketRequest(page) {
                let params = { size: 10, page: page.num };
                dosingPacket(params).then((res) => {
                    if(res.code != 1) return this.mescroll.endSuccess(0);
                    let { list, total_count } = res.data;
                    // 如果是第一页需手动制空列表
                    if(page.num == 1) this.dosingList = [];
                    this.dosingList = this.dosingList.concat(list); //追加新数据
                    this.mescroll.endBySize(list.length, total_count);
                }).catch((err) => this.mescroll.endErr());
            },
            mySavingsRequest(page) {
                let params = { size: 10, page: page.num };
                mySavings(params).then((res) => {
                    if(res.code != 1) return this.mescroll.endSuccess(0);
                    const { list, list2 , list2_total } = res.data;
                    // 如果是第一页需手动制空列表
                    if(page.num == 1) {
                        this.validList = [];
                        this.noValidList = [];
                    }
                    this.validList = this.validList.concat(list); //追加新数据
                    this.noValidList = this.noValidList.concat(list2); //追加新数据
                    this.mescroll.endBySize(list2.length || list.length, list2_total);
                }).catch((err) => this.mescroll.endErr());
            },
            orderHandle(id) {
                this.$go(`/pages/userCard/card/cardVip/detail?id=${id}&type=${this.curTab}`)
            }
		}
	}
</script>
<style scoped lang="scss">
.record_item{
    padding: 0 32rpx;
    &:not(:last-child) {
        border-bottom: 10rpx solid #f5f6fa;
    }
}
.record_list{
    &:not(:last-child) {
        border-bottom: 2rpx solid #e9e9e9;
    }
}
.record_title {
    padding: 32rpx 0 16rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    line-height: 44rpx;
    .record_title-icon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 8rpx;
    }
}
.record_list{
    font-size: 26rpx;
    padding: 16rpx 0 23rpx;
    position: relative;
    z-index: 0;
    &.active {
        .record_list-right{
            color: #FE423D;
            font-weight: 600;
        }
    }
    .valid_bg{
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 750rpx;
        height: 116rpx;
        z-index: -1;
    }
    .record_list-txt{
        font-size: 28rpx;
        color: #333;
        .record_list-icon{
            width: 72rpx;
            height: 34rpx;
            background: linear-gradient(149deg,#feeabd 9%, #fadb93 36%);
            border-radius: 16rpx 16rpx 16rpx 0;
            line-height: 34rpx;
            text-align: center;
            font-size: 24rpx;
            color: #9a4119;
            margin-left: 8rpx;
        }
    }
    .record_list-lab{
        color: #aaa;
        line-height: 36rpx;
        margin-top: 8rpx;
    }
    .record_list-right {
        color: #999;
    }
}
</style>
