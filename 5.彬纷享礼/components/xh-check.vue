<template>
	<view class="xh-check" :class="{'xh-check-disabled':disabled}" @click="change">
		<view class="iconfont xh-check-icon" :class="checked?checkedClass:'disabled-icon'"
			:style="{ color: primaryColor, 'font-size': iconSize + 'px' }"></view>
		<view class="xh-check-label" :class="labelClass" :style="{ color: labelColor||primaryColor}">{{label}}</view>
	</view>
</template>

<script>
	export default {
		props: {
			iconSize: {
				type: [Number, String],
				default: 18
			},
			primaryColor: {
				type: String,
				default: '#E02020'
			},
			checkedClass: {
				type: String,
				default: 'icon-chenggong'
			},
			labelColor: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			},
			label: {
				type: [String, Number],
				default: ''
			},
			labelClass: {
				type: String,
				default: ''
			},
			checked: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			change() {
				if (!this.disabled) {
					this.$emit('change', !this.checked);
				}
			}
		}
	};
</script>

<style lang="scss">
	.xh-check {
		display: flex;
		align-items: center;
		padding: 5rpx;

		.xh-check-icon {
			width: 30rpx;
			height: 30rpx;
			border-radius: 50%;
			border: 1px solid transparent;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.disabled-icon {
			border-color: #999999;
		}

		.checked-select {
			border-color: #999;
		}

		.checked-select::after {
			content: '';
			display: block;
			background-image: linear-gradient(#FE8D7C, #FD413D);
			width: 18rpx;
			height: 18rpx;
			border-radius: 50%;
		}
		
		.checked-select-zm {
			border-color: #999;
		}
		
		.checked-select-zm::after {
			content: '';
			display: block;
			background-image: linear-gradient(4deg,#ff6308 3%, #f8bc14 100%);
			width: 18rpx;
			height: 18rpx;
			border-radius: 50%;
		}
	}

	.xh-check.xh-check-disabled {
		opacity: 0.6;
	}
</style>
