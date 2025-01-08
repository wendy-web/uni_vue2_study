<template>
	<view class="box" @click="showAd">
		<view class="flex-row-between">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<image class="icon-beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="ad-container flex-row-between">
			<van-image class="bg-video-reward" use-loading-slot lazy-load width="700rpx" height="400rpx"
				:src="taskReward.image">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
			<!-- <view class="content">
				<view class="name">看视频赚牛金豆</view>
				<view class="sub-name">完整观看，即可获得牛金豆</view>
				<view class="btn">播放拿奖</view>
			</view>
			<van-image custom-class="btn-play-video" use-loading-slot lazy-load width="106rpx" height="104rpx"
				:src="imgUrl+'/task/btn_play_video.png'">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image> -->
		</view>
	</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
import { canVideo } from '@/api/modules/task.js';
import { mapGetters } from 'vuex';
export default {
    props: {
        taskReward: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            imgUrl: getImgUrl()
        }
    },
    computed: {
        ...mapGetters(['isAutoLogin'])
    },
    methods: {
        showAd() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$wxReportEvent('watchingvideo');
            canVideo().then(res => {
                if (res.code == 1) {
                    this.$emit('showAd')
                    return
                }
                wx.showToast({
                    icon: 'none',
                    title: res.msg
                })

            })
        }
    }
}
</script>

<style lang="scss">
.box {
    box-sizing: border-box;
    margin: 0rpx 24rpx 65rpx 24rpx;
    display: flex;
    flex-direction: column;
}

.ad-container {
    width: 700rpx;
    height: 400rpx;
    position: relative;
    border-radius: 24rpx;
    margin-top: 40rpx;
    padding: 16rpx 64rpx;
    box-sizing: border-box;

}

.content {
    box-sizing: border-box;
    z-index: 1;
    margin-top: 32rpx;
}

.name {
    font-size: 30rpx;
    font-weight: 500;
    color: #333333;
}

.sub-name {
    font-size: 26rpx;
    color: #999999;
    margin-top: 16rpx;
}

.bg-video-reward {
    width: 700rpx;
    height: 400rpx;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: -1;
}

.video {
    width: 670rpx;
    height: 360rpx;
    border-radius: 24rpx;
}

.btn {
    width: 156rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #ffe4e2;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #f2554d;
    letter-spacing: 0.58px;
    text-align: center;
    margin-top: 60rpx;
}

.btn-play-video {
    width: 106rpx;
    height: 104rpx;
    margin-top: 26rpx;
}
</style>
