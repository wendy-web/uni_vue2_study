<template>
<view class="box" v-if="isShow">
	<ad :unit-id="unitId" @load="adLoad" @error="adError" @close="adClose" ad-intervals="30"></ad>
</view>
</template>

<script>
	export default {
		props: {
			unitId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				isShow: true
			}
		},
		mounted() {
		},
		methods: {
			adLoad() {
				// console.log('Banner 广告加载成功');
				this.isShow = true;
			},
			adError(err) {
			    // console.log('Banner 广告加载失败', err);
				this.isShow = false;

			},
			adClose() {
			    // console.log('Banner 广告关闭');
				this.isShow = false;
			}

		},
	}
</script>

<style lang="scss">
	.box {
		margin: 40rpx 24rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}
</style>
