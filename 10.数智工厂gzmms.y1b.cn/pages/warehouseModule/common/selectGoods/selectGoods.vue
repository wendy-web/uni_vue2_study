<template>
	<view class="container">
		<uv-sticky offsetTop="0">
			<view class="search-container">
				<uv-search
					:showAction="true"
					actionText="搜索"
					:animation="true"
					bgColor="#F8FAFF"
					borderColor="#AEC2FF"
					@search="handleSearch"
					@custom="handleSearch"
					v-model="searchQuery.keyword"
				>
					<template v-slot:suffix>
						<uv-icon name="scan" size="30" @click.stop="handleScan"></uv-icon>
					</template>
				</uv-search>
				<wsearch-btn @reset="handleReset"></wsearch-btn>
			</view>
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="list">
				<uv-checkbox-group :value="checkboxValue" shape="circle" placement="column" iconPlacement="right" size="22">
					<uv-checkbox
						:customStyle="{ backgroundColor: '#fff', padding: '0 20rpx', marginBottom: '20rpx', boxSizing: 'border-box' }"
						v-for="(item, index) in dataList"
						:key="item.stock_id"
						:name="item.stock_id"
						@change="checkGroupChange($event, item)"
						:disabled="uniqueList.includes(item.stock_id)"
					>
						<view class="item">
							<view class="item-header">
								<view class="item-warehouse">{{ item.warehouse_name }}</view>
								<view class="item-stock">库存{{ item.stock }}</view>
							</view>
							<view class="item-content ">
								<view class="goods-name flex-between">
									<text>{{ item.title }}</text>
									<text style="margin-left: 10rpx;color: red;" v-if="item.ws_code"> {{ item.ws_code }}</text>
								</view>
								<view class="content-row">
									<text class="row-label">条码：</text>
									<text class="row-value">{{ item.barcode }}</text>
								</view>
								<view class="content-row">
									<text class="row-label">单位：</text>
									<text class="row-value">{{ item.unit || "-" }}</text>
								</view>
								<view class="content-row">
									<text class="row-label">品牌：</text>
									<text class="row-value">{{ item.brand || "-" }}</text>
								</view>
								<view class="content-row">
									<text class="row-label">规格型号：</text>
									<text class="row-value">{{ item.spec || "-" }}</text>
								</view>
								<!-- 	<view class="content-row">
									<text class="row-label">批次/日期：</text>
									<text class="row-value">{{ item.batch_number || "-" }}</text>
								</view> -->
								<view class="content-flex">
									<view class="flex-box">
										<text class="row-label">入库日期：</text>
										<text class="row-value">{{ item.in_wh_date || '-' }}</text>
									</view>
									<view class="flex-box">
										<text class="row-label">批次/日期：</text>
										<text class="row-value">{{ item.batch_number || '-' }}</text>
									</view>
								</view>
								<view class="content-flex">
									<view class="flex-box">
										<text class="row-label">生产日期：</text>
										<text class="row-value">{{ item.pro_time || "-" }}</text>
									</view>
									<view class="flex-box">
										<text class="row-label">到期日期：</text>
										<text class="row-value">{{ item.exp_time || "-" }}</text>
									</view>
								</view>
							</view>
						</view>
					</uv-checkbox>
				</uv-checkbox-group>
			</view>
		</mescroll-body>
		<view class="footer-btn">
			<view class="footer-btn-item">
				<uv-button text="取消" :custom-style="{ borderRadius: '10rpx' }" @click="onCancel"></uv-button>
			</view>
			<view class="footer-btn-item">
				<uv-button
					text="确认选择"
					type="primary"
					:custom-style="{ borderRadius: '10rpx' }"
					@click="onConfirm"
				></uv-button>
			</view>
		</view>
	</view>
</template>

<script>
import { getInstockApi, getLabelInfoXcxApi } from "@/api/modules/common.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
let eventChannel = undefined;
export default {
	mixins: [MescrollMixin], // 使用mixin
	// 这里存放数据
	data() {
		return {
			checkboxValue: [], //唯一值stock_id数组
			selectValue: [], //选择的数据
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
				keyword: "",
			},
			uniqueList: [],
			detailIdsList: [],
			alreadyEventChannel: false, //是否已经对上级页面传递的参数进行了处理
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		eventChannel = this.getOpenerEventChannel();
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 方法集合
	methods: {
		// 点击扫描图标
		handleScan() {
			// 允许从相机和相册扫码
			uni.scanCode({
				success: async (res) => {
					console.log("res", res);
					if (res.scanType === "QR_CODE") {
						let content = res.result;
						const scanResult = await getLabelInfoXcxApi({ content });
						this.searchQuery.keyword = scanResult.data.barcode;
						this.handleSearch();
					} else {
						uni.showToast({
							title: "您扫描的不是货品二维码~",
							icon: "none",
							duration: 2000,
						});
					}
				},
				fail: (err) => {
					console.log("err", err);
					let errMsg = err.errMsg;
					if (errMsg === "scanCode:fail") {
						uni.showToast({
							title: "扫描失败了~,请扫描货品二维码~",
							icon: "none",
							duration: 2000,
						});
					} else if (errMsg === "scanCode:fail cancel") {
						uni.showToast({
							title: "您取消了扫码~",
							icon: "none",
							duration: 1500,
						});
					}
				},
			});
		},

		eventChannelOn() {
			return new Promise((resolve, reject) => {
				if (eventChannel.on) {
					eventChannel.on("acceptData", (data) => {
						console.log("acceptData", data);
						this.uniqueList = data.uniqueList;
						this.detailIdsList = data.detailIdsList;
						this.warehouse_id = data.warehouse_id || 0;
						console.log("dataBarcdoe", data.barcode);
						if (data.barcode) {
							this.searchQuery.keyword = data.barcode;
							// this.handleSearch();
						}
						resolve("success");
					});
				} else {
					resolve("noEvent");
				}
			});
		},

		async upCallback(page) {
			// if (eventChannel.on) {
			// 	await eventChannel.on("acceptData", (data) => {
			// 		console.log("acceptData", data);
			// 		this.uniqueList = data.uniqueList;
			// 		this.detailIdsList = data.detailIdsList;
			// 		console.log("dataBarcdoe", data.barcode);
			// 		if (data.barcode) {
			// 			this.searchQuery.keyword = data.barcode;
			// 			// this.handleSearch();
			// 		}
			// 	});
			// }
			if (!this.alreadyEventChannel) {
				await this.eventChannelOn();
				this.alreadyEventChannel = true;
			}

			// return;
			let data = {
				page: page.num,
				size: page.size,
				warehouse_id: this.warehouse_id,
				...this.searchQuery,
			};
			if (!this.warehouse_id) {
				delete data.warehouse_id;
			}
			// console.log("data", data);
			try {
				const result = await getInstockApi(data);
				let res = result.data;
				const total = res.total;
				// console.log("total", total);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				let list = res.list;
				console.log("detailIdsList", this.detailIdsList);
				if (this.detailIdsList.length > 0) {
					list.forEach((element) => {
						let findRes = this.detailIdsList.find((item) => {
							return element.stock_id == item.stock_id;
						});
						if (findRes) {
							element.stock = findRes.old_num;
						}
					});
					console.log("list", list);
				}
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
				console.log("报错了", e);
				//TODO handle the exception
				//联网失败, 结束加载
				this.mescroll.endErr();
			}
		},
		//点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		// 点击重置
		handleReset() {
			this.searchQuery = {
				keyword: "",
			};
			this.handleSearch();
		},
		// 点击选择时触发
		checkGroupChange(e, item) {
			if (e) {
				this.selectValue.push(item);
				this.checkboxValue.push(item.stock_id);
			} else {
				let index = this.checkboxValue.indexOf(item.stock_id);

				if (index !== -1) {
					this.checkboxValue.splice(index, 1);
					this.selectValue.splice(index, 1);
				}
			}
			console.log("checkboxValue", this.checkboxValue);
			console.log("selectValue", this.selectValue);
		},
		// 点击确认选择
		onConfirm() {
			// console.log('checkboxValue',this.checkboxValue);
			eventChannel.emit("someEvent", { selectValue: this.selectValue });
			uni.navigateBack();
		},
		onCancel() {
			uni.navigateBack();
		},
	},
	// 计算属性
	computed: {},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss">
page {
	background-color: #f6f6f6;
}
.container {
	padding-bottom: 120rpx;
	.list {
		.item {
			background-color: #ffffff;
			padding: 20rpx 0rpx;
			// margin-bottom: 20rpx;
			&-header {
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #e5e5e5;
				padding-bottom: 20rpx;
				.item-warehouse {
					font-size: 36rpx;
					font-weight: bold;
				}
				.item-stock {
					font-size: 34rpx;
					color: #5783ff;
				}
			}
			&-content {
				margin-top: 10rpx;
				.goods-name {
					font-size: 30rpx;
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					box-sizing: border-box;
					// margin-right: 50rpx;
				}
				.content-row {
					margin-top: 10rpx;
					margin-right: 50rpx;
					.row-label {
						color: #a3a2a8;
					}
				}
				.content-flex {
					margin-top: 10rpx;
					display: flex;
					justify-content: space-between;
					.flex-box {
						flex: 1;
						flex-shrink: 0;
						// color: #767a82;
						white-space: nowrap;
						&:first-child {
							margin-right: 10rpx;
						}
						.row-label {
							color: #a3a2a8;
						}

					}
				}
			}
		}
	}
	.footer-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		padding-top: 4rpx;
		padding: 4rpx 40rpx 0rpx 40rpx;
		&-item {
			flex: 1;
			&:first-child {
				margin-right: 40rpx;
			}
		}
	}
}
.uv-checkbox__icon-wrap--circle {
	position: absolute;
}
</style>
