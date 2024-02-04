<template>
<view class="record">
    <view class="tab_box">
		<selTab v-model="tabIndex" :tabs="recordList"></selTab>
	</view>
    <swiper
		:style="{height: mescrollHeight}"
		:current="tabIndex"
		@change="swiperChange"
		:circular="true" duration="0"
	>
		<swiper-item v-for="(item, index) in recordList" :key="index">
			<recordSwiperItem
				ref="recordSwiperItem"
				:height="mescrollHeight"
				:curTab="index"
				:tabs="item"
			></recordSwiperItem>
		</swiper-item>
	</swiper>
</view>
</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { mapGetters } from "vuex";
import recordSwiperItem from '../component/recordSwiperItem.vue';
import selTab from '../component/selTab.vue';
export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
        selTab,
        recordSwiperItem
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            cardImgUrl:`${getImgUrl()}static/card/`,
            default_avatar: `${getImgUrl()}/static/images/default_avatar_grey.png`,
			tabIndex: 0, // 当前菜单下标
            recordList:[
                {
                    name: '会员卡'
                },
                {
                    name: '加量包'
                },

            ],
        }
    },
    computed: {
        ...mapGetters([]),
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        mescrollHeight() {
            let viewPort = getViewPort();
            let mescrollHeight =  viewPort.windowHeight - uni.upx2px(84);
            return mescrollHeight + 'px';
        },
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
    },
    methods: {
        // 轮播菜单
        swiperChange(e) {
            this.tabIndex = e.detail.current;
            let active_swiper_item = this.$refs.recordSwiperItem[this.tabIndex];
            if (active_swiper_item) {
                active_swiper_item.downCallback();
            }
        }
    }
}
</script>
<style lang="scss">
.tab_box {
    box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0,0,0,0.06);
}
</style>
