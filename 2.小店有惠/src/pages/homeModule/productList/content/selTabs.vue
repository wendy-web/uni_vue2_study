<template>
<view class="tabList">
	<view v-for="(item, index) in selTabList" :key="index"
		:class="['list_item', item.id == selTabID ? 'active' : '']"
		@click="selTabHandle(item.id)"
	>
		<block v-if="item.id != 3">{{ item.label }}</block>
		<view v-else class="switch_box">
			<view
				v-for="(item, index) in platformList" :key="index"
				:class="['switch_box-item', (platformType == item.id) && 'active']"
				@click="platformChangeHandle(item.id)"
			>
				{{ item.text }}
			</view>
			<view :class="['switch_box-active', (platformType == 2) && 'active']" ></view>
		</view>
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
			platformType: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				platformList: [
					{
						id: 1,
						text: '拼多多'
					},
					{
						id: 2,
						text: '京东'
					}
				]
			}
		},
		async mounted() {
		},
		methods: {
			selTabHandle(id) {
				if(id == 3) return;
				this.$emit('selTab', id);
			},
			platformChangeHandle(id) {
				if(this.platformType == id) return;
				this.$emit('changeCheck', id);
			}
		}
	}
</script>

<style scoped lang="scss">
.tabList {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 26rpx;
	text-align: center;
	color: #333;
	line-height: 40rpx;
	padding: 15rpx 22rpx 14rpx 80rpx;
    border-radius: 32rpx 32rpx 0rpx 0rpx;
	.list_item {
		display: flex;
		justify-content: center;
		position: relative;
		&.active {
			color: #F84842;
		}
	}
}
.switch_box {
	height: 52rpx;
	background: #f1f1f1;
	border-radius: 26rpx;
	box-sizing: border-box;
	font-size: 26rpx;
	text-align: center;
	color: #b1b1b1;
	display: flex;
	padding: 4rpx;
	position: relative;
	z-index: 0;
	&-item {
		width: 102rpx;
		height: 44rpx;
		&.active {
			color: #EF2B20;
		}
	}
	&-active {
		position: absolute;
		width: 102rpx;
		height: 44rpx;
		background: #ffffff;
		border-radius: 26rpx;
		z-index: -1;
		transition: all .3s;
		transform: translateX(0);
		&.active {
			transform: translateX(100%);
		}
	}
}
</style>
