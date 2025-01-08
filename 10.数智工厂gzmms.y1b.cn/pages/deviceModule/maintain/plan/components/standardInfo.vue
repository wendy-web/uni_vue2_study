<template>
<view class="width-full contentBox position-r all-p-b-30 ">
	<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
		<view class="">
			<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
			<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">保养标准</text>
		</view>
		<slot name="status"></slot>
	</view>
	<view class="width-full all-p-t-20 all-p-lr-30 display_column_center"
		v-for="(item, index) in cycleItemList" :key="index"
	>
		<view class="width-full all-p-tb-10 display_row_center uv-border-bottom f-s-32">
			<uv-tags :text="index + 1" bgColor="#F2F2F2" borderColor="#F2F2F2" color="#333" size="mini"></uv-tags>
			<text class="t-c-272727 all-m-l-10 t-w-bold">{{item.name}}</text>
		</view>
		<view class="width-full display_row_center f-s-26 t-c-333"  style="border-bottom: 2rpx solid #efefef">
			<view class="flex_left all-p-tb-10 all-p-lr-10">保养部位</view>
			<view class="all-p-lr-10 all-p-tb-10">{{ item.maintenance_area }}</view>
		</view>
		<view class="width-full display_row_center f-s-26 t-c-333"  style="border-bottom: 2rpx solid #efefef">
			<view class="flex_left all-p-tb-10 all-p-lr-10">保养要求/标准</view>
			<view class="all-p-lr-10 all-p-tb-10">{{ item.maintenance_requirements }}</view>
		</view>
	</view>
</view>
</template>
<script>
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				const { cycle_item } = newValue;
				this.cycleItemList = cycle_item;
			},
		},
	},
	data() {
		return {
			planData: {},
			cycleItemList: []
		};
	},
	methods: {
	}
};
</script>
<style lang="scss">
.flex_left{
	flex:  0 0 200rpx;
	text-align: right;
	border-right: 2rpx solid #efefef;
}
</style>
