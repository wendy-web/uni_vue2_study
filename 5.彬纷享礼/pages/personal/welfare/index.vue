<template>
	<view class="welfare">
		<welfare-tabs :currTabs="currTabs" @tabsChange="tabsChange" />
		<!-- 数据展示 start-->
		<swiper class="page-list" :current="currTabs" @change="swiperChange">
			<swiper-item v-for="(tab,i) in tabs" :key="i">
				<mescroll-item ref="mescrollItem" :currTabs="i" @getTopCount="getTopCount"></mescroll-item>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import welfareTabs from './welfareTabs';
	import mescrollItem from './mescroll-item.vue';
	import {
		mapActions,
		mapGetters
	} from 'vuex';
	let flag = false;

	export default {
		components: {
			welfareTabs,
			mescrollItem
		},
		data() {
			return {
				currTabs: 0,
				topCount: {},
				tabs: [{
					name: '未使用'
				}, {
					name: '已使用'
				}, {
					name: '已过期'
				}]
			};
		},
		onLoad() {
			flag = true;
			this.getTopCount();
		},
		onShow() {
			if (flag) {
				flag = false;
			} else {
				this.refreshList();
			}
		},
		methods: {
			...mapActions({
				getWelfareTop: 'personal/getWelfareTop'
			}),
			//兑换卷类型切换
			tabsChange(index) {
				this.currTabs = index;
			},
			//滑动切换
			swiperChange(data) {
				this.currTabs = data.detail.current; //切换tab
			},
			//刷新列表
			refreshList() {
				this.$refs.mescrollItem[0].downCallback();
				this.$refs.mescrollItem[1].downCallback();
				this.$refs.mescrollItem[2].downCallback();
				this.getTopCount();
			},
			getTopCount() {
				this.getWelfareTop();
			}
		}
	};
</script>

<style lang="scss">
	.welfare {
		.page-list {
			position: fixed;
			width: 100%;
			top: 80rpx;
			bottom: 0;
			height: auto;
			overflow: hidden;
			z-index: 0;
			background-color: #f4f4f4;
		}
	}
</style>
