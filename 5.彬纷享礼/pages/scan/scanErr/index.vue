<template>
<view>
	<!-- 红牛未中奖弹窗 -->
	<xh-msg-dialog ref="xhMsgDialog" @closeNotice="closeNotice" @again="again"
		buttonText="继续扫码" :buttonRightText="buttonRightText"
		@onWelfare="onWelfareHandle"
	/>
	<war-horse-msg ref="warHorseMsg" @closeNotice="closeNotice" @again="again" />
</view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import warHorseMsg from './warHorseMsg.vue';
	export default {
		components: {
			warHorseMsg
		},
		computed: {
			...mapGetters(['ttxlJumpConfig']),
		},
		watch: {
			ttxlJumpConfig: {
				handler:async function (newValue, oldValue) {
					if(!newValue) return;
					const code_welfare = newValue['code_welfare'];
					if(code_welfare) this.buttonRightText = code_welfare.title;
				},
				deep: true,
				immediate: true
			},
		},
		data() {
			return {
				buttonRightText: ''
			}
		},
		onLoad(options){
			let { type } = options;
			if (type === 'zm') return this.$refs.warHorseMsg.popupShow(options);
			this.$refs.xhMsgDialog.show(options, 'again');
			// this.$refs.xhMsgDialog.show({
			// 	msg: '二维码已被他人扫描'
			// }, 'again');
		},
		methods: {
			...mapActions({
				getConfig: 'config/getConfig',
			}),
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
			},
			onWelfareHandle() {
				this.$ttxlUserPosition('code_welfare');
			}
		},
		onUnload() {
			console.log('onUnload', )
			this.getConfig();
		}

	}
</script>

<style>
</style>
