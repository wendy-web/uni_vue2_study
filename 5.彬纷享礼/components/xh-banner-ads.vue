<template>
	<view class="adContainer-box">
		<view v-if="isFillet&&!isError" class="adContainer" hover-class="adContainer-hover">
			<!-- :ad-intervals="intervals" -->
			<ad-custom :unit-id="unitId" @error="adError"></ad-custom>
		</view>
		<view v-else-if="!isError" class="no-fillet">
			<ad-custom :unit-id="unitId" @error="adError"></ad-custom>
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			intervals: {
				type: Number,
				default: 30
			},
			unitId: {
				type: String,
				default: ''
			},
			isFillet: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				isError: false
			};
		},
		methods: {
			adError() { //加载不出来就占茅坑了
				this.isError = true;
			}
		}
	};
</script>

<style>
	.adContainer {
		margin: 0 25rpx;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		z-index: 1;
		transform: translate3d(0, 0, 0);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
	}

	.adContainer-hover {
		box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
	}
</style>
