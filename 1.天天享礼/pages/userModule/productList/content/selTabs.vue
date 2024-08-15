<template>
<view class="tabList">
	<view v-for="(item, index) in selTabList" :key="index"
		:class="['list_item', item.id == selTabID ? 'active' : '']"
		@click="selTabHandle(item.id)"
	>
		<block v-if="item.id != 3">{{ item.label }}</block>
		<van-checkbox checked-color="#F84842" shape="square" icon-size="12px" style="--checkbox-label-margin: 8rpx; "
            :value="isHasCoupon" @change="changeHandle"
			v-else
			label-position="left"
		>{{ item.label }}</van-checkbox>
	</view>
</view>
</template>

<script>
	export default {
		props: {
			selTabList: {
				type: Array,
				default: []
			},
			selTabID: {
				type: Number,
				default: 0
			},
			isHasCoupon: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
			}
		},
		async mounted() {
		},
		methods: {
			changeHandle(event) {
				this.$emit('changeCheck', event.detail)
			},
			selTabHandle(id) {
				if(id == 3) return;
				this.$emit('selTab', id);
			}
		}
	}
</script>

<style scoped lang="scss">
.tabList {
	display: flex;
	align-items: center;
	justify-content: space-around;
	font-size: 28rpx;
	text-align: center;
	color: #333;
	line-height: 40rpx;
	padding: 16rpx 0;
	background: rgba($color: #f7f7f7, $alpha: 1);
    border-radius: 32rpx 32rpx 0rpx 0rpx;
	.list_item {
		width: 25%;
		display: flex;
		justify-content: center;
		position: relative;
		&.active {
			color: #F84842;
		}
		&:not(:last-child)::after {
			content: '\3000';
			width: 2rpx;
			height: 24rpx;
			background: #e1e1e1;
			position: absolute;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
		}
	}
}
</style>
