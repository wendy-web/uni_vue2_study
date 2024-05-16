<template>
<view class="search_box fl_center" @click="toSearchHandle">
    <swiper
        v-if="textList.length"
        class="search_txt"
        style="height: 100%"
        :autoplay="true"
        interval="3000"
        :duration="300"
        :circular="true"
        :vertical="true"
        :current="currentIndex"
        :disable-touch="false"
        @animationfinish="animationfinishHandle"
    >
        <swiper-item
            v-for="(item, index) in textList"
            :key="index"
            class="swiper_item txt_ov_ell1"
            catchtouchmove="onTouchMove"
        >{{ item }}</swiper-item>
    </swiper>
</view>
</template>
<script>
import { mapGetters } from "vuex";
export default {
    props: {
        textList: {
            type: Array,
            default: []
        },
        source: {
            type: String,
            default: ''
        },
        isSwiperTxt: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentIndex: 0
        };
    },
    computed: {
        ...mapGetters(['isAutoLogin']),
    },
    async mounted() {
    },
    methods: {
        animationfinishHandle(event) {
            this.currentIndex = event.detail.current;
        },
        toSearchHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            let placeholderValue = "";
            if (this.textList.length && this.isSwiperTxt) {
                placeholderValue = this.textList[this.currentIndex];
                placeholderValue = encodeURIComponent(placeholderValue);
            }
            // 去领券中心的搜索页
            this.$go(`/pages/userModule/productList/search?placeholderValue=${placeholderValue}&source=${this.source}`);
        }
    }
}
</script>
<style lang="scss" scope>
.search_box {
    height: 64rpx;
    background: rgba(255, 255, 255, 0.5);
    border: 1rpx solid #ffffff;
    border-radius: 33rpx;
    transition: all 0.5s;
    &::before {
        content: "\3000";
        background: url("https://file.y1b.cn/store/1-0/23118/654b2aa94ed31.png") center / 32rpx 32rpx no-repeat;
		display: inline-block;
        width: 64rpx;
        height: 64rpx;
        padding: 18rpx;
        flex: 0 0 64rpx;
        box-sizing: border-box;
    }
    .search_icon {
        flex: 0 0 64rpx;
        box-sizing: border-box;
        width: 64rpx;
        height: 64rpx;
        padding: 18rpx;
    }
    .search_txt {
        font-size: 26rpx;
        color: #999;
        line-height: 64rpx;
        word-break: break-all;
        width: calc(100% - 64rpx);
    }
    .swiper_item {
        height: 64rpx;
    }
}
</style>
