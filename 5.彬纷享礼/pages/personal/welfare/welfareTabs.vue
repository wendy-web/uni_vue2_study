<template>
	<view class="xh-tabs">
		<view class="xh-tabs-item" @click="tabsChange(0)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 0}">
				待领取
				<text class="xh-tab-num" v-if="welfareTop.unused">
					{{welfareTop.unused}}
				</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(1)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 1}">
				已领取
				<text class="xh-tab-num" v-if="welfareTop.used">
					{{welfareTop.used}}
				</text>
			</view>
		</view>
		<view class="xh-tabs-item" @click="tabsChange(2)">
			<view class="label-text" :class="{'xh-tab-active':currTabs == 2}">
				已过期
				<text class="xh-tab-num" v-if="welfareTop.expired">
					{{welfareTop.expired}}
				</text>
			</view>
		</view>
		<!-- cursor -->
		<view class="cursor" :style="{left:(currTabs*33.3 + 9.15)+'%'}"></view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: ['currTabs'],
		filters: {
			numbers(val) {
				return val >= 99 ? '99+' : val;
			}
		},
		computed: {
			...mapGetters(['welfareTop'])
		},
		methods: {
			tabsChange(index) {
				this.$emit('tabsChange', index);
			}
		}
	};
</script>

<style lang="scss">
	/*顶部导航样式*/
	.xh-tabs {
		position: fixed;
		width: 100%;
		left: 0;
		top: 0;
		height: 80rpx;
		background-color: #FFFFFF;
		display: flex;
		z-index: 1;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

		.xh-tabs-item {
			flex: 1;
			color: #999999;
			font-size: RPX(16);
			font-weight: bold;
			@include flex-vh-center;
		}

		.label-text {
			position: relative;
		}

		.cursor {
			position: absolute;
			height: 8rpx;
			width: 15%;
			left: 5%;
			bottom: 0;
			background-color: #E60213;
			transition: 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
			border-radius: 4px;
		}

		.xh-tab-num {
			color: #999999;
			margin-left: RPX(5);
		}

		.xh-tab-active {
			color: #E60213;
			font-size: RPX(16);
		}

		.xh-tab-active>.xh-tab-num {
			color: #E60213;
		}


	}

	/*顶部导航样式*/
</style>
