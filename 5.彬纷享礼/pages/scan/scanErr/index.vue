<template>
	<view>
		<!-- 红牛未中奖弹窗 -->
		<xh-msg-dialog ref="xhMsgDialog" @closeNotice="closeNotice" @again="again" buttonText="继续扫码" />
		<war-horse-msg ref="warHorseMsg" @closeNotice="closeNotice" @again="again" />
	</view>
</template>

<script>
	import warHorseMsg from './warHorseMsg.vue'
	export default {
		components: {
			warHorseMsg
		},
		onLoad(o) {
			let {
				type
			} = o
			if (type === 'zm') {
				this.$refs.warHorseMsg.popupShow(o);
			} else {
				this.$refs.xhMsgDialog.show(o, 'again');
			}
		},
		methods: {
			closeNotice() {
				this.$reLaunch({
					url: '/pages/tabBar/personal/index'
				})
			},
			again() {
				this.$navigateBack({
					fail: () => {
						this.$reLaunch({
							url: '/pages/tabBar/personal/index'
						})
					}
				})
			}
		}

	}
</script>

<style>
</style>