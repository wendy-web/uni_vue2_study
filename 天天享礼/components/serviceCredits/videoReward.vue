<template>
<view class="box" @click="showAd">
	<van-image class="bg-video-reward" use-loading-slot lazy-load width="700rpx" height="400rpx"
		:src="taskReward.image">
		<van-loading slot="loading" type="spinner" size="20" vertical />
	</van-image>
</view>
</template>

<script>
import { canVideo } from '@/api/modules/task.js'
export default {
	props: {
		taskReward: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
		}
	},
	methods: {
		showAd() {
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
	},

}
</script>

<style lang="scss">
.box {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
