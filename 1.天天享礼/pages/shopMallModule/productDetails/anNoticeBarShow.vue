<template>
<view v-if="isShow" class="an-notice-box">
    <swiper
        :vertical="true"
        :autoplay="true"
        :interval="3000"
        :duration="1000"
        style="height: 100%;"
        :current="myIndex"
        @change="swiperChangeHandle"
    >
        <swiper-item v-for="item in list" :key="item.id">
            <view class="an_notice_cont box_fl">
                <van-image class="user-icon" height="52rpx" width="52rpx" :src="item.avatar_url" radius="50%"
                    use-loading-slot><van-loading slot="loading" type="spinner" size="20" vertical />
                </van-image>
                <view class="nk-name txt_ov_ell1">
                    <text>{{item.nick_name}}</text>
                    <text class="nk-tips" v-if="isSearch || (isHome && !config.face_value)">刚刚购买了该优惠券</text>
                    <text class="nk-tips" v-else>刚刚{{ isShowGetText ? '领取' : '兑换' }}了该优惠券</text>
                </view>
            </view>
        </swiper-item>
    </swiper>
</view>
</template>
<script>
export default {
    props: {
        config: {
			type: Object,
			default () {
				return {
				}
			}
		},
        isShow: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default () {
                return []
            }
        },
        isSearch: {
            type: Boolean,
            default: false
        },
        isHome: {
            type: Boolean,
            default: false
        },
        isShowGetText: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            myIndex: 0
        };
    },
    methods: {
        swiperChangeHandle(event) {
            const current = event.detail.current;
            if(current >= (this.list.length - 1)) {
                setTimeout(() => this.$emit('swiperEnd'), 3000);
            }
        }
    },
}
</script>
<style lang="scss">
.an-notice-box {
    width: 350rpx;
    height: 52rpx;
    overflow: hidden;
    border-radius: 36px;
    position: relative;
    z-index: 0;
    color: #fff;
    &::before {
        content: '\3000';
        position: absolute;
        width: 100%;
        height: 52rpx;
        background: rgba(0,0,0,0.55);
    }
    .user-icon {
        width: 52rpx;
        height: 52rpx;
        margin-right: 15rpx;
        opacity: 0.6;
    }
    .nk-name {
        font-size: 22rpx;
    }

    .nk-tips {
        margin-left: 8rpx;
    }
}
.an_notice_cont {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}
</style>
