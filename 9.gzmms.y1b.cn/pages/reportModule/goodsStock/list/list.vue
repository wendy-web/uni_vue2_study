<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="货品库存列表"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<uv-sticky offsetTop="85">
			<view class="search-container">
				<uv-search
					:showAction="true"
					actionText="搜索"
					:animation="true"
					bgColor="#F8FAFF"
					borderColor="#AEC2FF"
					@search="handleSearch"
					@custom="handleSearch"
					v-model="searchQuery.title"
				></uv-search>
				<wsearch-btn @reset="handleReset"></wsearch-btn>
			</view>
			<dropDownVue @changeQuery="getQuery" ref="dropDownRef" :listType="searchQuery.type"></dropDownVue>
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="list-wrapper">
				<view
					class="list-item"
					v-for="(item, index) in dataList"
					:key="item.id"
					@click="open(item.details, item.warehouse.name)"
				>
					<view class="item-header">
						<text class="header-wraehouse">{{ item.warehouse.name }}</text>
						<view class="">
							<text>可用库存</text>
							<text class="header-num">{{ item.stock }}</text>
						</view>
					</view>
					<view class="item-center">
						<text class="center-name">{{ item.goods.title }}</text>
						<text class="center-class">办公用品</text>
					</view>
					<view class="item-info">
						<view class="info-item">
							<text>条码：</text>
							<text>{{ item.goods.barcode }}</text>
						</view>
						<view class="info-item">
							<text>单位：</text>
							<text>{{ item.goods.measure_name }}</text>
						</view>
						<view class="info-item">
							<text>品牌：</text>
							<text>{{ item.goods.brand || "-" }}</text>
						</view>
						<view class="info-item">
							<text>规格型号：</text>
							<text>{{ item.goods.spec || "-" }}</text>
						</view>
					</view>
					<view class="item-info">
						<view class="info-item">
							<text>库存下限：</text>
							<text>{{ item.stock_warning_qty || "-" }}</text>
							<text v-if="item.is_stock_warning" class="show-warning">警</text>
						</view>
						<view class="info-item">
							<text>库存上限：</text>
							<text>{{ item.stock_upper_qty || "-" }}</text>
							<text v-if="item.is_stock_upper_warning" class="show-warning">警</text>
						</view>
					</view>
					<view class="item-info">
						<view class="info-item">
							<text>订货点：</text>
							<text>{{ item.goods_warning_qty || "-" }}</text>
							<text v-if="item.is_goods_warning" class="show-warning">警</text>
						</view>
						<view class="info-item">
							<uv-button
								type="error"
								iconColor="#fff"
								shape="circle"
								icon="bell"
								text="已到期"
								:customStyle="{ height: '50rpx' }"
								v-if="item.is_exp_warning"
							></uv-button>
							<uv-button shape="circle" icon="bell" text="未到期" :customStyle="{ height: '50rpx' }" v-else></uv-button>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<uv-popup ref="popup" mode="right" :overlayStyle="{ top: '98px' }" :customStyle="{ top: '98px' }" bgColor="none">
			<view class="popup-content">
				<view class="popup-list">
					<view class="list-wrapper">
						<view class="list-item" v-for="(item, index) in popup_details.detail" :key="item.id">
							<view class="item-header">
								<text class="header-wraehouse">{{ popup_details.warehouse }}</text>
								<view class="">
									<text>可用库存</text>
									<text class="header-num">{{ item.quantity }}</text>
								</view>
							</view>
							<view class="item-center">
								<text class="center-name">{{ item.title }}</text>
								<text class="center-class">办公用品</text>
							</view>
							<view class="item-info">
								<view class="info-item">
									<text>条码：</text>
									<text>{{ item.barcode }}</text>
								</view>
								<view class="info-item">
									<text>单位：</text>
									<text>{{ item.measure_name || "-" }}</text>
								</view>
								<view class="info-item">
									<text>品牌：</text>
									<text>{{ item.brand || "-" }}</text>
								</view>
								<view class="info-item">
									<text>规格型号：</text>
									<text>{{ item.spec || "-" }}</text>
								</view>
							</view>
							<view class="item-info">
								<view class="info-item">
									<text>生产日期：</text>
									<text>{{ item.pro_time || "-" }}</text>
								</view>
								<view class="info-item">
									<text>批次/日期：</text>
									<text>{{ item.batch_number || "-" }}</text>
								</view>
							</view>
							<view class="item-info">
								<view class="info-item">
									<text>保质期预警(天)：</text>
									<text>{{ item.exp_warning_day || "-" }}</text>
								</view>
								<view class="info-item" :class="item.is_exp_warning ? 'show-error' : ''">
									<text>到期日期：</text>
									<text>{{ formartDate(item.exp_time) || "-" }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="popup-close">
					<uv-button @click="close">关闭</uv-button>
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import dropDownVue from "./component/dropDown.vue";
import { getStockApi } from "@/api/modules/report.js";
import { formartDate as formartDateFn } from "@/utils/validate";
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		dropDownVue,
	},
	// 这里存放数据
	data() {
		return {
			// 列表数据
			dataList: [],
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
					time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
			searchQuery: {
				is_all: 0,
				warehouse_id: undefined,
				class_name: undefined,
				title: "",
				type: 0,
			},
			popup_details: {
				warehouse: "",
				detail: [],
			},
		};
	},
	computed: {},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("options", options);
		if (options.type) {
			this.searchQuery.type = Number(options.type);
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 方法集合
	methods: {
		/** 直接使用 全局方法 编译到小程序报错,故使用此方法转译一次  */
		formartDate(date) {
			return formartDateFn(date);
		},
		back() {
			uni.navigateBack({
				delta: 1,
			});
		},
		// 监听子组件dorpdown触发的选择
		getQuery(e) {
			this.searchQuery = e;
			this.handleSearch();
		},
		//点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		// 点击重置
		handleReset() {
			console.log("点击重置");
			this.searchQuery = {
				is_all: 0,
				warehouse_id: undefined,
				class_name: undefined,
				title: "",
				type: 0,
			};
			this.$refs.dropDownRef.reset();
			this.handleSearch();
		},
		// 上拉加载
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			};
			// console.log("data", data);
			try {
				const result = await getStockApi(data);
				console.log("货品库存列表页", result);
				let res = result.data;
				const total = res.total;
				// console.log("total", total);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.data.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.data); //追加新数据
			} catch (e) {
				console.log("报错了", e);
				//TODO handle the exception
				//联网失败, 结束加载
				this.mescroll.endErr();
			}
		},
		open(details, warehouse) {
			this.popup_details.warehouse = warehouse;
			this.popup_details.detail = details;
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
			this.popup_details = {
				warehouse: "",
				details: [],
			};
		},
	},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss">
page {
	background-color: #f6f6f6;
}
.list-wrapper {
	padding: 10rpx;
	background-color: #ffffff;
	color: #707072;
	.list-item {
		padding: 20rpx;
		background-color: #fcfdff;
		border-radius: 20rpx;
		border: 1rpx solid #bccbff;
		margin-bottom: 20rpx;
		.item-header {
			display: flex;
			justify-content: space-between;
			.header-wraehouse {
				color: #688bf2;
			}
			.header-num {
				color: #000000;
				display: inline-block;
				margin-left: 10rpx;
				font-weight: 700;
				font-size: 36rpx;
			}
		}
		.item-center {
			display: flex;
			justify-content: space-between;
			margin-top: 10rpx;
			.center-class {
				display: inline-block;
				margin-left: 20rpx;
				flex-shrink: 0;
			}
		}
		.item-info {
			display: flex;
			flex-wrap: wrap;
			margin-top: 10rpx;
			align-items: center;
			.info-item {
				margin-right: 20rpx;
				font-size: 26rpx;
				.show-warning {
					background-color: #f7b2b2;
					color: #e45656;
					border-radius: 10rpx;
					display: inline-block;
					padding: 6rpx;
					margin-left: 8rpx;
				}
				&.show-error {
					color: #fff;
					background-color: #e45656;
					padding: 0 4rpx;
				}
			}
		}
		.item-pc {
			margin-top: 10rpx;
		}
	}
}
.popup-content {
	width: 640rpx;
	height: calc(100vh - 88rpx - var(--status-bar-height) - 40rpx);
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.popup-list {
		overflow-y: auto;
	}
	.popup-close {
		padding-bottom: 80rpx;
		flex-shrink: 0;
	}
}
</style>
