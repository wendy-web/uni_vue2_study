<template>
<view class="container">
	<uv-sticky offsetTop="0">
		<view class="search-container-d">
			<uv-search
				:showAction="true"
				actionText="搜索"
				:animation="true"
				:actionStyle="{ color: '#fff' }"
				bgColor="#F8FAFF"
				borderColor="#AEC2FF"
				@search="handleSearch"
				@custom="handleSearch"
				v-model="searchQuery.keyword"
				placeholder="请输入设备编码/名称/型号/品牌"
			>
				<template v-slot:suffix>
					<uv-icon name="scan" size="20" @click.stop="handleScan"></uv-icon>
				</template>
			</uv-search>
			<wsearch-btn @reset="handleReset" color="#fff"></wsearch-btn>
		</view>
	</uv-sticky>
	<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
		<view class="width-full all-p-tb-30 all-p-lr-20">
			<uv-radio-group
				v-model="radioValueId"
				placement="column"
				iconPlacement="right"
				@change="changeDeviceHandle"
			>
				<view v-for="(item, index) in dataList" :key="index"
					class="width-full contentBox position-r all-m-b-30 all-p-tb-20 all-p-lr-30">
					<uv-radio :name="item.id">
						<view class="width-full display_column_center f-s-28 display-block item_cont" slot="default">
							<view class="f-s-28 t-w-bold all-m-b-10">{{ item.bar_title }}</view>
							<view class="width-full all-m-b-10 display_row_center t-c-aaa">
								<text class="lab_left">设备编码</text>：
								<text>{{ item.asset_no }}</text>
							</view>
							<view class="width-full all-m-b-10 display_row_center t-c-aaa">
								<text class="lab_left">型码</text>：
								<text>{{ item.spec }}</text>
							</view>
							<view class="width-full all-m-b-10 display_row_center t-c-aaa">
								<text class="lab_left">使用部门</text>：
								<text>{{ item.use_dept_text}}</text>
							</view>
							<view class="width-full all-m-b-10 display_row_center t-c-aaa">
								<text class="lab_left">使用位置</text>：
								<text>{{ item.save_addr }}</text>
							</view>
						</view>
					</uv-radio>
				</view>
			</uv-radio-group>
		</view>
	</mescroll-body>
</view>
</template>
<script>
import { getEquipmentListApi } from "@/api/device/archive/equipment.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { deviceScan } from "@/utils/device.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			dataList: [],
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
					time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 3,
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
			searchQuery: {
				keyword: "",
			},
			radioValueId: 0,
		};
	},
	onLoad(options) {
		if(options.equipmentId) this.radioValueId = Number(options.equipmentId);
	},
	methods: {
		goToAddHandle() {
			uni.navigateTo({
				url: `/pages/deviceModule/maintain/repair/add`,
			});
		},
		async handleScan() {
			const scanResult = await deviceScan();
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},
		// 上拉加载
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
				point_check_status: 0,
			};
			try {
				const result = await getEquipmentListApi(data);
				let res = result.data;
				const total = res.total;
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
				//联网失败, 结束加载
				this.mescroll.endErr();
			}
		},
		// 点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		changeDeviceHandle(event) {
			this.radioValueId = event;
			const eventChannel = this.getOpenerEventChannel();
			const selItem = this.dataList.find(res => res.id == event);
			eventChannel && eventChannel.emit('acceptChangeDevice', { id: event, selItem });
			uni.navigateBack();
		}
	}
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
}
.contentBox {
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);
	overflow: hidden;
}
.item_cont{
	// border-bottom: 2rpx dashed #f3f3f3;
	// border-top: 2rpx dashed #f3f3f3;
	// background: #fbfbfb;
	.lab_left {
		flex: 0 0 120rpx;
		white-space: nowrap;
		text-align: justify;
		text-align-last: justify;
	}
}
</style>
