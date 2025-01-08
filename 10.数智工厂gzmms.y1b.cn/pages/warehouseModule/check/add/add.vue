<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="新建盘点单"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<view class="top-info">
			<view class="top-info-item">
				<text class="label-text">盘点日期</text>
				<uv-input v-model="inventory_time" readonly placeholder="请选择盘点日期" @click.native="showCalendars">
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</view>
			<view class="top-info-item">
				<text class="label-text">盘点仓库</text>
				<uv-input
					v-model="warehouse_name"
					readonly
					placeholder="请选择盘点仓库"
					@click.native="showWarehouse"
					:disabled="alreadyList.length > 0"
				>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</view>
			<view class="top-info-item">
				<text class="label-text">单据备注</text>
				<uv-input placeholder="请输入内容" border="surround" v-model="note"></uv-input>
			</view>
		</view>
		<!-- 已盘商品列表开始 -->
		<view class="list">
			<!-- 已盘商品列表头部 -->
			<uv-sticky offset-top="88">
				<view class="list-header">
					<view class="list-header-left">
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
							class="header-left-img"
						></image>
						<text>已盘商品列表</text>
					</view>
					<view class="list-header-right">
						<view class="list-header-right-item" @click="toWaitCheck">
							<uv-icon
								custom-prefix="custom-icon"
								name="heziguanligenduoshangpinkeji"
								color="#7898FF"
								size="18"
								label="选择待盘"
								space="10rpx"
							></uv-icon>
						</view>
						<!-- 	<view class="list-header-right-item">
							<uv-icon name="scan" color="#7898FF" size="20" label="商品扫描" space="0"></uv-icon>
						</view> -->
					</view>
				</view>
				<!-- 商品提示 -->
				<view class="goods-header">
					<text>商品信息</text>
					<text>盘盈/亏</text>
				</view>
			</uv-sticky>
			<!-- 商品分组信息 -->
			<uv-swipe-action>
				<template v-for="(item, index) in alreadyList">
					<uv-swipe-action-item
						:options="options"
						:key="item.stock_id"
						:name="index"
						@click="handleSetWait($event, item)"
					>
						<view class="goods-item">
							<view class="item-name">
								<text class="goods-name">{{ item.title }}</text>
								<text class="count-num" :class="{ red: item.diff_num < 0, green: item.diff_num > 0 }">
									{{ item.diff_num }}
								</text>
							</view>
							<view class="item-barcode">
								<text>条码：</text>
								<text>{{ item.barcode }}</text>
							</view>
							<view class="item-barcode">
								<text>备注：</text>
								<text>{{ item.note || "无" }}</text>
							</view>
							<view class="item-num">
								<view class="item-num-group">
									<text class="item-group-label">盘前数量</text>
									<text>{{ item.in_num }}</text>
								</view>
							</view>
							<view class="item-num">
								<view class="item-num-group">
									<text class="item-group-label">盘后数量</text>
									<view class="">
										<uv-number-box
											color="#2979ff"
											iconStyle="color: #2979ff"
											inputWidth="56"
											:min="0"
											integer
											v-model="item.inv_num"
											@change="invnumChange($event, item)"
										></uv-number-box>
									</view>
								</view>
							</view>
							<view class="item-edit">
								<uv-button
									text="编辑内容"
									type="primary"
									plain
									:custom-style="{ borderRadius: '10rpx', height: '60rpx' }"
									@click="openPopup(item)"
								></uv-button>
							</view>
						</view>
					</uv-swipe-action-item>
				</template>
			</uv-swipe-action>
			<!-- <uv-empty icon="https://cdn.uviewui.com/uview/empty/data.png" text="您还没有已盘库存商品"></uv-empty> -->
		</view>
		<view class="footer-num" v-if="total_num > 0">
			<view class="footer-num-item">
				<text>总计：</text>
				<text>{{ total_num }}条</text>
			</view>
			<view class="footer-num-item">
				<text>已盘：</text>
				<text>{{ alreadyNum }}条</text>
			</view>
			<view class="footer-num-item">
				<text>待盘：</text>
				<text>{{ waitNum }}条</text>
			</view>
		</view>
		<view class="footer-btn">
			<view class="footer-btn-item">
				<uv-button text="取消" @click="handleCancel"></uv-button>
			</view>
			<view class="footer-btn-item">
				<uv-button text="下一步" type="primary" @click="handleNext"></uv-button>
			</view>
		</view>
		<!-- 底部按钮和数量结束 -->
		<!-- 日历组件 -->
		<uv-calendars ref="calendars" @confirm="calendarsConfirm" />
		<!-- 选择仓库picker组件 -->
		<uv-picker ref="picker" :columns="pickerColumns" @confirm="warehouseConfirm" keyName="name"></uv-picker>
		<inputnumPopup ref="inputnumPopup" :info="itemInfo" @confirm="editConfirm"></inputnumPopup>

		<page-container :show="pageContainerShow" position="right" :overlay="false" z-index="9999" @afterleave="afterleave">
			<waitCheck
				ref="waitCheckRef"
				:uniqueList="uniqueList"
				:warehouse_id="warehouse_id"
				@confirm="setAlready"
				@totalChange="totalChange"
				@waitNumChange="waitNumChange"
				@close="waitClose"
			></waitCheck>
			<preview ref="previewRef" :preInfo="preInfo" @close="preClose"></preview>
		</page-container>
	</view>
</template>

<script>
import inputnumPopup from "./components/inputnumPopup.vue";
import waitCheck from "./components/waitCheck.vue";
import preview from "./components/preview.vue";
import { storageListApi, getInstockApi } from "@/api/modules/common.js";
import dayJs from "@/utils/dayjs.min.js";
import { detailCheckApi } from "@/api/modules/check.js";
export default {
	components: {
		inputnumPopup,
		waitCheck,
		preview,
	},
	data() {
		return {
			options: [
				{
					text: "删除",
					style: {
						backgroundColor: "#f56c6c",
					},
				},
			],
			btnStyle: {
				width: "200rpx",
				borderRadius: "10rpx",
			},

			inventory_time: dayJs().format("YYYY-MM-DD"), //盘点日期
			note: "", //备注
			warehouse_name: "", //盘点仓库名称
			warehouse_id: 0, //盘点仓库id
			// warehouse_name: "行政舱", //盘点仓库名称--测试用
			// warehouse_id: 3, //盘点仓库id--测试用
			initWaitList: [], //最开始从接口获取的数据
			waitList: [], //待盘数据
			alreadyList: [], //已盘数据
			pickerColumns: [],
			total_num: 0, //总数
			itemInfo: {}, //暂存点击编辑内容时的货品数据信息
			preInfo: {
				goods: [],
			}, //传递给预览组件的数据
			file_info: {
				src: "",
				name: "",
			},
			pageContainerShow: false,
			listId: 0, //列表页传过来的ID
		};
	},
	computed: {
		// 获取已盘总数
		alreadyNum() {
			return this.alreadyList.length;
		},
		// 获取已盘列表的stock_id数组
		uniqueList() {
			return this.alreadyList.map((el) => el.stock_id);
		},
		// 获取待盘数量: 总数 - 已盘数量
		waitNum() {
			let num = this.total_num - this.uniqueList.length;
			return num >= 0 ? num : 0;
		},
	},

	onLoad(options) {
		this.getStorageList();
		if (options.id) {
			this.listId = options.id;
			this.getDetail();
		}
	},
	onUnload() {},
	methods: {
		// 编辑时获取详情信息
		async getDetail() {
			const result = await detailCheckApi({ id: this.listId });
			let res = result.data;
			this.note = res.note;
			this.warehouse_id = res.warehouse_id;
			this.warehouse_name = res.warehouse_name;
			this.inventory_time = res.inventory_time ? dayJs(res.inventory_time).format("YYYY-MM-DD") : "";
			let detail_goods = res.goods;
			let list = detail_goods.map((item) => {
				let changeData = this.changeDetailData(item);
				return changeData;
			});
			this.alreadyList = list;
		},
		// 点击选择待盘
		toWaitCheck() {
			if (!this.warehouse_id) {
				uni.$uv.toast("请先选择盘点仓库", 2000);
				this.showWarehouse()
				return;
			}
			this.pageContainerShow = true;
			this.$refs.waitCheckRef.open();
		},
		// 点击左上角回退按钮
		back() {
			uni.navigateBack();
		},
		afterleave() {
			this.pageContainerShow = false;
		},
		// 监听选择待盘列表的子组件关闭
		waitClose() {
			this.pageContainerShow = false;
		},
		// 监听预览弹窗页面子组件的关闭
		preClose() {
			this.pageContainerShow = false;
		},
		// 监听 待盘列表子组件点击设置已盘 传递的数据
		setAlready(list) {
			// this.alreadyList = this.alreadyList.concat(list);
			list.forEach((item) => {
				this.alreadyList.push({
					goods_id: item.goods_id,
					// goods_all_id: item.id,
					barcode: item.barcode,
					title: item.title,
					spec: item.spec,
					brand: item.brand,
					measure_name: item.measure_name,
					class_name: item.class_name,
					warehouse_id: item.warehouse_id,
					warehouse_name: item.warehouse_name,
					in_num: item.stock,
					inv_num: item.stock,
					ph_no: item.batch_number,
					unique: item.unique,
					note: "",
					diff_num: 0,
					stock_id: item.stock_id,
					ws_code: item.ws_code,
					in_wh_date: item.in_wh_date,
				});
			});
			// this.scrollBottom();
		},
		//监听 待盘列表子组件总数变化的长度数量
		totalChange(value) {
			this.total_num = value;
		},
		// 监听 编辑内容子组件的确定事件
		editConfirm(info) {
			console.log("info", info);
			let index = this.alreadyList.findIndex((el) => el.stock_id == info.stock_id);
			this.$set(this.alreadyList, index, { ...info });
		},
		//监听单个修改盘后数量
		invnumChange(e, row) {
			console.log("e", e);
			let inv_num = e.value;
			let in_num = row.in_num;
			row.diff_num = inv_num - in_num;
		},
		// 点击 下一步
		handleNext() {
			if (this.alreadyList.length === 0) {
				uni.showToast({
					title: "请先选择待盘数据",
					icon: "none",
				});
				return;
			}
			let infoData = {
				inventory_time: this.inventory_time,
				warehouse_name: this.warehouse_name,
				warehouse_id: this.warehouse_id,
				note: this.note,
				goods: this.alreadyList,
				file_info: this.file_info,
				id: this.listId,
			};

			this.preInfo = infoData;
			this.pageContainerShow = true;
			this.$refs.previewRef.open();
		},

		// 获取仓库列表数据
		async getStorageList() {
			const result = await storageListApi({ type: 1 });
			this.pickerColumns.push(result.data.list);
		},

		// 显示选择日历
		showCalendars() {
			this.$refs.calendars.open();
		},
		// 日历选择确认
		calendarsConfirm(e) {
			this.inventory_time = e.fulldate;
		},
		// 显示选择仓库
		showWarehouse() {
			if (this.alreadyList.length > 0) return;
			this.$refs.picker.open();
		},
		// 仓库选择确认
		warehouseConfirm(e) {
			let value = e.value[0];
			console.log("value", value);
			this.warehouse_name = value.name;
			this.warehouse_id = value.id;
		},

		// 点击取消按钮
		handleCancel() {
			uni.navigateBack();
		},
		// 点击显示 编辑内容弹窗
		openPopup(item) {
			this.itemInfo = item;
			this.$refs.inputnumPopup.open();
		},
		// 点击设置待盘事件
		handleSetWait(e, item) {
			if (e.index === 0) {
				let goodsIndex = e.name;
				this.alreadyList.splice(goodsIndex, 1);
			}
		},
		scrollBottom() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select(".list")
					.boundingClientRect((data) => {
						console.log(data);
						uni.pageScrollTo({
							scrollTop: data.bottom,
							duration: 300,
						});
					})
					.exec();
			});
		},
		// 长按事件
		longpress() {
			uni.showModal({
				title: "提示",
				content: "您确定要设置为待盘吗",
				success(res) {
					if (res.confirm) {
						uni.$uv.toast("点击了确定");
					} else if (res.cancel) {
						uni.$uv.toast("点击了取消");
					}
				},
			});
		},
		changeDetailData(data) {
			let {
				goods_id,
				barcode,
				brand,
				class_name,
				measure_name,
				ph_no,
				in_num,
				inv_num,
				spec,
				title,
				unique,
				warehouse_name,
				warehouse_id,
				stock_id,
				ws_code,
				price,
				in_wh_date,
				diff_num,
				note,
			} = data;
			return {
				goods_id,
				barcode,
				title,
				spec,
				brand,
				measure_name,
				class_name,
				in_num,
				inv_num,
				ph_no: ph_no ?? "",
				warehouse_name,
				warehouse_id,
				diff_num,
				note,
				unique,
				stock_id,
				ws_code,
				price,
				in_wh_date,
			};
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
::v-deep .uv-swipe-action-item__content {
	background-color: #f6f6f6 !important;
}
.container {
	.top-info {
		background-color: #ffffff;
		padding-bottom: 30rpx;
		.top-info-item {
			display: flex;
			align-items: center;
			padding: 20rpx 40rpx;
			padding-bottom: 0;
			min-height: 60rpx;
			.label-text {
				display: inline-block;
				margin-right: 20rpx;
				flex-shrink: 0;
			}
		}
	}
	.footer-num {
		position: fixed;
		z-index: 999;
		bottom: 100rpx;
		left: 0;
		right: 0;
		height: 60rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		font-size: 24rpx;
		background-color: #facd91;
	}
	.footer-btn {
		position: fixed;
		z-index: 99;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #ffffff;
		display: flex;
		justify-content: center;
		padding: 4rpx 40rpx 0rpx 40rpx;
		&-item {
			flex: 1;
			&:first-child {
				margin-right: 40rpx;
			}
		}
	}
	.bottom-box {
		position: fixed;
		z-index: 100;
		bottom: 0;
		left: 0;
		right: 0;

		.bottom-num {
			height: 60rpx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20rpx;
			font-size: 24rpx;
			background-color: #facd91;
		}
	}
	/* 已盘商品列表开始 */
	.list {
		margin-top: 30rpx;
		background-color: transparent;
		padding-bottom: 200rpx;
		/* 已盘商品列表头部 */
		.list-header {
			background-color: #fff;
			height: 84rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 40rpx;
			&-left {
				display: flex;
				align-items: center;
				.header-left-img {
					width: 40rpx;
					height: 40rpx;
					margin-right: 16rpx;
				}
				text {
					font-size: 32rpx;
					font-weight: bold;
				}
			}
			&-right {
				display: flex;
				align-items: center;
				&-item {
					margin-right: 20rpx;
				}
			}
		}
		/* 商品提示 */
		.goods-header {
			background-color: #ecf0ff;
			height: 80rpx;
			font-size: 28rpx;
			color: #707072;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 40rpx;
		}
		/* 商品分组信息 */
		.goods-item {
			margin: 0 10rpx;
			padding: 30rpx 20rpx 30rpx 30rpx;
			background-color: #fff;
			margin-bottom: 10rpx;
			position: relative;
			.item-edit {
				position: absolute;
				bottom: 20rpx;
				right: 20rpx;
			}

			/* 商品名称样式 */
			.item-name {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				margin-bottom: 16rpx;

				.goods-name {
					display: block;
					font-weight: bold;
					max-width: 490rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				/* 盘盈盘亏数量样式 */
				.count-num {
					display: block;
					width: 100rpx;
					text-align: center;
					font-weight: bold;
					&.red {
						color: $uni-color-error;
					}
					&.green {
						color: $uni-color-success;
					}
				}
			}

			/* 商品条码样式 */
			.item-barcode {
				font-size: 24rpx;
				color: #a3a2a8;
				margin-bottom: 10rpx;
			}

			/* 盘点数量样式 */
			.item-num {
				margin-top: 10rpx;
				.item-num-group {
					font-size: 28rpx;
					margin-right: 40rpx;
					display: flex;
					align-items: center;
					.item-group-label {
						display: inline-block;
						margin-right: 20rpx;
						color: #6f6f6f;
					}
				}
			}
		}
	}
	/* 已盘商品列表结束 */
}
</style>
