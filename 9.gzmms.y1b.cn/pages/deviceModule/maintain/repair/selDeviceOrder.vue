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
		<view class="width-full all-p-t-30 all-p-lr-20">
			<uv-checkbox-group
				v-model="selValue"
				placement="column"
				iconPlacement="right"
				@change="changeDeviceHandle"
			>
				<view v-for="(item, index) in dataList" :key="index"
					class="width-full contentBox position-r all-m-b-30 all-p-tb-20 all-p-lr-30"
				>
					<view class="width-full display_row_between_center f-s-28 t-w-bold">
						<view>领用单号 <text class="f-s-24 t-c-aaa all-m-l-10">{{item.wh_rec_no || item.re_no}}</text></view>
						<view>出库日期 <text class="f-s-24 t-c-aaa all-m-l-10">{{ formartDate(item.out_time || item.out_date) }}</text></view>
					</view>
					<view class="width-full display_row_between_center f-s-28 t-w-bold all-m-t-10">
						<view class="display_row_center">
							<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
							<text class="title-label all-m-l-10 t-c-000018 ">备件仓</text>
						</view>
						<view>待用数 <text class="all-m-l-10" style="color: #02A7F0;">{{ item.no_use_num }}</text></view>
					</view>
					<uv-checkbox :name="item[keywordId]">
						<view class="swipe-action all-m-t-20 all-m-r-30">
							<view class="width-full f-s-26 t-w-bold t-c-333 all-m-b-10">{{ item.title }}</view>
							<view class="f-s-24 t-c-aaa all-m-r-10 uv-line-1">
								{{item.barcode}}{{ item.spec ? `/${item.spec}` : '' }}{{ item.brand ? `/${item.brand}` : ''}}
							</view>
						</view>
					</uv-checkbox>
				</view>
			</uv-checkbox-group>
		</view>
	</mescroll-body>
	<view class="footer-btn" v-if="dataList.length">
		<view class="footer-btn-item">
			<uv-button text="取消" plain type="primary" @click="backHandle"></uv-button>
		</view>
		<view class="footer-btn-item">
			<uv-button text="确定" type="primary" @click="confirmHandle"></uv-button>
		</view>
	</view>
</view>
</template>
<script>
import { getDownEqListApi, getWarehouseRecDetailApi } from "@/api/device/maintain/repair.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { deviceScan } from "@/utils/device.js";
import { formartDate } from "@/utils/validate";
export default {
	mixins: [MescrollMixin], // 使用mixin
	data() {
		return {
			dataList: [],
			selValue: [1],
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
			setRequestApi: getWarehouseRecDetailApi,
			equipment_id: 0,
			apiType: '',
		};
	},
	computed: {
		keywordId() {
			return (this.apiType == 'down') ? 'repair_id' : 'rec_detail_id';
		}
	},
	onLoad(option) {
		if(option.apiType) {
			this.setRequestApi = (option.apiType == 'down') ? getDownEqListApi : getWarehouseRecDetailApi;
			this.apiType = option.apiType;
			this.equipment_id = option.equipment_id || 0;
		}
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('acceptData', (data) => {
			this.selValue = data.alertSelList;
		})
	},
	methods: {
		formartDate,
		async handleScan() {
			const scanResult = await deviceScan();
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},
		async upCallback(page) {
			const params = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			}
			if(this.equipment_id) params.eq_id = this.equipment_id;
			const res = await this.setRequestApi(params).catch(() => this.mescroll.endErr());
			if(!res.code || !res.data) return this.mescroll.endSuccess(0);
			let data = res.data;
			this.mescroll.endBySize(data.data.length, data.total); //必传参数(当前页的数据个数, 总数据量)
			if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
			this.dataList = this.dataList.concat(data.data); //追加新数据
		},
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		backHandle() {
			uni.navigateBack();
		},
		confirmHandle() {
			const selListItem = this.dataList.filter((item) => this.selList.includes(item[this.keywordId]));
			const eventChannel = this.getOpenerEventChannel();
			eventChannel && eventChannel.emit('acceptSelectDevice', { selListItem: selListItem, selList: this.selList });
			this.backHandle();
		},
		changeDeviceHandle(event) {
			this.selList = event;
		}
	}
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
}
.container {
	padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.contentBox {
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);
	overflow: hidden;
	.iconBox {
		width: 32rpx;
		height: 32rpx;
	}
}
.item_cont {
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
.uv-radio__label-wrap {
	padding: 0 !important;
}
.footer-btn {
	position: fixed;
	z-index: 199;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #fff;
	display: flex;
	justify-content: center;
	padding: 4rpx 20rpx 0rpx 20rpx;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
	&-item {
		flex: 1;
		&:not(first-child) {
			margin-left: 40rpx;
		}
	}
}
</style>
