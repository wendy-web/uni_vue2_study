<template>
	<!-- 插屏失败弹窗 -->
	<view :class="customClass" v-if="isShow">
		<official-account @load="load" @error="onErrors"></official-account>
	</view>
</template>

<script>
	export default {
		props: {
			customClass: {
				type: String,
				default: 'official-account'
			},
			eventName: {
				type: String,
				default: 'followwoa_1'
			}
		},
		data() {
			return {
				isShow: true
			};
		},
		methods: {
			load(e) {
				console.log('official-account load', e)
			},
			onErrors(e) {
				this.isShow = false
				console.log('official-account onError', e)
			}
		}
	};
</script>

<style lang="scss">
	.official-account {
		margin-top: 20rpx;
	}

	.official-account-home {
		margin: 20rpx;
		border-radius: 10px;
		box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.16);
		overflow: hidden;
		position: relative;
	}

	.official-account-scan {
		border-radius: 5px;
		overflow: hidden;
		margin: 0 20rpx 20rpx;
		position: relative;
	}

	.take {
		position: absolute;
		z-index: -1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
	}
</style>
