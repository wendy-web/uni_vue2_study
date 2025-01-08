<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			:title="pageTitle"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<topInfo ref="infoRef" :listId="listId" @selelctWh="selectWarehouse" :goodsLen="goodsLen"></topInfo>
		<view class="list">
			<view class="list-header">
				<view class="list-header-left">
					<!-- <uv-icon name="list" color="#688BF2" :custom-style="{ marginRight: '10rpx' }"></uv-icon> -->
					<image
						src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
						class="header-left-img"
					></image>
					<text class>领出商品</text>
				</view>
				<view class="list-header-right">
					<uv-button
						type="primary"
						icon="scan"
						text="扫描条码"
						iconColor="#688BF2"
						iconSize="18"
						plain
						:hairline="false"
						:customStyle="{ border: 'none' }"
						@click="handleScan"
					></uv-button>
				</view>
				<view class="list-header-right" @click="handleSelectGoods()">
					<view class="heder-right-item">
						<uv-icon
							custom-prefix="custom-icon"
							name="heziguanligenduoshangpinkeji"
							color="#7898FF"
							size="18"
							label="选择货品"
							space="10rpx"
						></uv-icon>
					</view>
				</view>
			</view>
			<uv-swipe-action>
				<template v-for="(item, index) in selectValue">
					<uv-swipe-action-item :options="options" :key="item.stock_id" :name="index" @click="handleDel">
						<view class="item">
							<view class="item-header">
								<view class="item-warehouse">{{ item.warehouse_name }}</view>
								<view class="item-stock">
									<text>申领数量：</text>
									<uv-number-box
										color="#2979ff"
										iconStyle="color: #2979ff"
										inputWidth="56"
										:min="item.is_have_unique ? 0 : 1"
										:max="item.old_num"
										integer
										v-model="item.rec_num"
										:disabled="item.is_have_unique"
										:showMinus="!item.is_have_unique"
										:showPlus="!item.is_have_unique"
									></uv-number-box>
									<uv-button
										type="primary"
										text="选择编码"
										v-if="item.is_have_unique"
										@click="hanleSelectUnique(item)"
									></uv-button>
								</view>
							</view>
							<view class="item-content">
								<view class="goods-name flex-between">
									<text>{{ item.title }}</text>
									<text style="margin-left: 10rpx;color: red;" v-if="item.ws_code"> {{ item.ws_code }}</text>
								</view>
								<view class="content-note">
									<text class="note-label">备注：</text>
									<view class="note-input">
										<uv-input
											placeholder="请输入内容"
											border="bottom"
											v-model="item.note"
											:customStyle="{ fontSize: '24rpx' }"
										></uv-input>
									</view>
								</view>
								<view class="content-note">
									<text class="note-label">使用地点：</text>
									<view class="note-input" v-if="item.use_place_name.length === 0">
										<uv-input
											placeholder="请选择使用地点"
											border="bottom"
											readonly
											@click.native="showPicker(item, index)"
										></uv-input>
									</view>
									<view class="note-place" v-else @click="showPicker(item, index)">
										<text v-for="(place, index) in item.use_place_name" :key="index">
											{{ place }}
										</text>
									</view>
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
										<text class="row-value">{{ item.in_wh_date || "-" }}</text>
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
					</uv-swipe-action-item>
				</template>
			</uv-swipe-action>
			<uv-empty mode="list" text="未选择货品" v-if="selectValue.length === 0"></uv-empty>
		</view>
		<view class="footer-btn">
			<view class="footer-btn-item">
				<uv-button text="取消" @click="onCancel"></uv-button>
			</view>
			<view class="footer-btn-item">
				<uv-button text="下一步" type="primary" @click="handleNext"></uv-button>
			</view>
		</view>
		<page-container
			:show="pageContainerShow"
			position="right"
			:overlay="false"
			z-index="99999"
			@afterleave="afterleave"
		>
			<preview :preInfo="preInfo" :goods="selectValue" ref="previewRef" @close="preClose"></preview>
		</page-container>
		<selectUnique ref="selectUniqueRef" @change="changeSelectUnique" :listId="listId"></selectUnique>
		<template v-for="(item, index) in selectValue">
			<gq-tree
				:key="item.stock_id"
				:ref="`gqTree${index}`"
				:range="range"
				showParentName
				pidKey="pid"
				childKey="children"
				nameKey="place_name"
				:selectParent="false"
				idKey="id"
				:multiple="true"
				:cascade="true"
				@confirm="treeConfirm"
			></gq-tree>
		</template>
	</view>
</template>

<script>
import { getLabelInfoApi, placeListApi } from "@/api/modules/common.js";
import { detailGetSupApi } from "@/api/modules/getSupplier.js";
import preview from "./components/preview.vue";
import selectUnique from "./components/select-unique.vue";
import topInfo from "./components/top-info.vue";
// import pageContainerVue from "./components/pageContainer.vue";
export default {
	components: {
		topInfo,
		preview,
		selectUnique,
		// pageContainerVue,
	},
	// 这里存放数据
	data() {
		return {
			range: [],
			options: [
				{
					text: "删除",
					style: {
						backgroundColor: "#f56c6c",
					},
				},
			],
			pickerItem: {}, // 点击使用地点时暂存的item
			selectValue: [], //选择的商品数据
			preInfo: {},
			file_info: {
				src: "",
				name: "",
			},
			listId: 0, //列表页传过来的ID
			detailIdsList: [], //详情数组的id和最大值数组
			pageContainerShow: false,
			scanBarcode: "",
			currentStockId: 0, //记录一下点击选择编码时的stockid
			pageTitle: "新建领料单",
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.getData();
		if (options.barcode) {
			// uni.showToast({
			// 	title: "正在跳转选择商品页,请稍等...",
			// 	icon: "none",
			// 	duration: 1500,
			// });
			// uni.$uv.toast("")
			// setTimeout(() => {
			// 	// uni.navigateTo({
			// 	// 	url: `/pages/warehouseModule/common/selectGoods/selectGoods?barcode?=${options.barcode}`,
			// 	// });
			// 	this.handleSelectGoods(options.barcode);
			// }, 1500);
			this.scanBarcode = options.barcode;
			this.handleSelectGoods();
		} else if (options.id) {
			this.listId = options.id;
			this.pageTitle = "编辑领料单";
			this.getDetail();
		}
	},
	// 生命周期 - 监听页面显示
	onShow() {},
	// 方法集合
	methods: {
		// 监听选择编码子组件点击确定后触发的事件
		changeSelectUnique(uniqueCodeList) {
			console.log("changeSelectUnique-uniqueCodeList", uniqueCodeList);
			let findRes = this.selectValue.find((item) => {
				return item.stock_id == this.currentStockId;
			});
			findRes.unique_label_detail = uniqueCodeList.map((item) => {
				let { id } = item;
				let obj = {
					unique_code: item.code,
				};
				return id ? { id, ...obj } : { ...obj };
			});
			console.log("findRes.unique_label_detail", findRes.unique_label_detail);
			findRes.rec_num = uniqueCodeList.length;
		},
		// 唯一编码时点击选择编码
		hanleSelectUnique(row) {
			this.currentStockId = row.stock_id;
			let list = row.unique_label_detail ? row.unique_label_detail.map((el) => el.unique_code) : [];
			this.$refs.selectUniqueRef.open(row.stock_id, list);
		},
		// 点击扫描条码
		handleScan() {
			if (!this.$refs.infoRef.warehouse_id) {
				uni.$uv.toast("请先选择仓库", 1500);
				this.$refs.infoRef.showWarehouse();
				return;
			}
			// 允许从相机和相册扫码
			uni.scanCode({
				success: async (res) => {
					console.log("res", res);
					if (res.scanType === "QR_CODE") {
						let content = res.result;
						console.log("content", content);
						const result = await getLabelInfoApi({
							content,
							warehouse_id: this.$refs.infoRef.warehouse_id,
							order_id: this.listId ? this.listId : undefined,
							document_type: 3, //领料出库单 3
							data_type: 1, //明细码和唯一码数据返回类型；0：按照库存所有数据返回：1：只返回一条库存数据；
						});
						const findList = result.data.list;
						// code_type 条码类型；1：普通条码二维码；2：库存明细二维码；3：唯一标签二维码；
						const codeType = result.data.code_type;

						if (findList.length > 0) {
							let findGoods = findList[0];
							let findBarcode = findList[0].barcode;
							let findRes = this.selectValue.find((item) => {
								return findGoods.stock_id == item.stock_id;
							});

							switch (codeType) {
								case 1:
									this.handleSelectGoods(findBarcode);
									return;
								case 2:
									if (!findRes) {
										this.selectValue.push({
											unique: findGoods.unique,
											goods_id: findGoods.goods_id,
											barcode: findGoods.barcode,
											title: findGoods.title,
											spec: findGoods.spec,
											brand: findGoods.brand,
											measure_name: findGoods.measure_name,
											class_name: findGoods.class_name,
											warehouse_id: findGoods.warehouse_id,
											warehouse_name: findGoods.warehouse_name,
											ph_no: findGoods.batch_number,
											rec_num: findGoods.is_have_unique ? 0 : findGoods.stock,
											note: "",
											old_num: findGoods.stock,
											use_place_id: [],
											use_place_name: [],
											is_have_unique: findGoods.is_have_unique,
											unique_label_detail: [],
											stock_id: findGoods.stock_id,
											ws_code: findGoods.ws_code,
											in_wh_date: findGoods.in_wh_date,
											pro_time: findGoods.pro_time,
											exp_time: findGoods.exp_time,
										});
									} else {
										uni.$uv.toast("已添加该条商品明细,请勿重复扫描", 1500);
									}
									return;
								case 3:
									if (!findRes) {
										this.selectValue.push({
											unique: findGoods.unique,
											goods_id: findGoods.goods_id,
											barcode: findGoods.barcode,
											title: findGoods.title,
											spec: findGoods.spec,
											brand: findGoods.brand,
											measure_name: findGoods.measure_name,
											class_name: findGoods.class_name,
											warehouse_id: findGoods.warehouse_id,
											warehouse_name: findGoods.warehouse_name,
											ph_no: findGoods.batch_number,
											rec_num: 1,
											note: "",
											old_num: findGoods.stock,
											use_place_id: [],
											use_place_name: [],
											stock_id: findGoods.stock_id,
											ws_code: findGoods.ws_code,
											in_wh_date: findGoods.in_wh_date,
											pro_time: findGoods.pro_time,
											exp_time: findGoods.exp_time,
											is_have_unique: true,
											unique_label_detail: [
												{
													unique_code: findGoods.unique_code,
												},
											],
										});
									} else {
										let unique_label_detail = findRes.unique_label_detail || [];
										let unique_label_list = unique_label_detail.map((el) => el.unique_code);
										console.log("🚀 ~ getBarcodeInfo ~ unique_label_list:", unique_label_list);
										if (unique_label_list.includes(findGoods.unique_code)) {
											uni.$uv.toast("该唯一码已添加,请勿重复扫描", 1500);
											return;
										} else {
											findRes.unique_label_detail?.push({
												unique_code: findGoods.unique_code,
											});
											findRes.rec_num = findRes.unique_label_detail?.length;
											console.log("this.selectValue", this.selectValue);
										}
									}
								default:
									break;
							}
						}
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
		// 选择仓库
		selectWarehouse(data) {
			if (this.scanBarcode) {
				this.handleSelectGoods(this.scanBarcode);
				this.scanBarcode = "";
			}
		},
		back() {
			uni.navigateBack();
		},
		afterleave() {
			this.pageContainerShow = false;
		},
		// 监听预览组件的关闭
		preClose() {
			this.pageContainerShow = false;
		},
		// 编辑时获取详情信息
		async getDetail() {
			const result = await detailGetSupApi({ id: this.listId });
			let res = result.data;
			this.$refs.infoRef.warehouse_id = res.warehouse_id;
			this.$refs.infoRef.warehouse_name = res.warehouse_name;
			this.$refs.infoRef.note = res.note;
			this.$refs.infoRef.rec_type_name = res.rec_type_name;
			this.$refs.infoRef.rec_type = res.rec_type;
			this.$refs.infoRef.rp_uname = res.rp_names;
			this.$refs.infoRef.rp_uid = res.rp_uid;
			this.$refs.infoRef.ar_uname = res.ar_names.split(",");
			this.$refs.infoRef.ar_uid = res.ar_uid.split(",").map((item) => Number(item));
			this.$refs.infoRef.ap_uid = res.ap_uid;
			this.$refs.infoRef.ap_uname = res.ap_names;
			let old_goods = res.goods;
			// 将详情返回的商品数据字段 改为需要的字段
			let new_goods = old_goods.map((item) => {
				let changeData = this.changeDetailData(item);
				return changeData;
			});
			this.detailIdsList = new_goods.map((item) => {
				return {
					stock_id: item.stock_id,
					old_num: item.old_num,
				};
			});
			this.selectValue = new_goods;
		},

		// 获取使用地点数据
		async getData() {
			const result = await placeListApi();
			this.range = result.data;
		},
		//点击选择商品
		handleSelectGoods(optionsBarcode) {
			if (!this.$refs.infoRef.warehouse_id) {
				uni.$uv.toast("请先选择仓库", 1500);
				this.$refs.infoRef.showWarehouse();
				return;
			}
			// 模板调用使用 handleSelectGoods() 而不是handleSelectGoods,避免传入默认的$event
			uni.navigateTo({
				url: "/pages/warehouseModule/common/selectGoods/selectGoods",
				events: {
					someEvent: (data) => {
						console.log("someEvent", data);
						let newData = data.selectValue.map((el) => {
							let { stock, batch_number, is_have_unique, ...rest } = el;
							return {
								...rest,
								rec_num: is_have_unique ? 0 : stock,
								ph_no: batch_number,
								old_num: stock,
								use_place_id: [],
								use_place_name: [],
								unique_label_detail: [],
								is_have_unique,
							};
						});
						console.log("newData", newData);
						this.selectValue = this.selectValue.concat(newData);
						console.log("this.selectValue", this.selectValue);
						this.scrollBottom();
					},
				},
				success: (res) => {
					let data = {
						uniqueList: this.uniqueList,
						detailIdsList: this.detailIdsList,
						warehouse_id: this.$refs.infoRef.warehouse_id,
					};
					if (optionsBarcode) {
						data = {
							...data,
							barcode: optionsBarcode,
						};
					}
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptData", data);
				},
			});
		},
		//点击 使用地点 input框
		showPicker(item, index) {
			this.pickerItem = item;
			console.log("this.$refs", this.$refs);
			// this.$refs.picker.open();
			this.$refs[`gqTree${index}`][0]._show();
		},
		// picker选择确认
		pickerConfirm(e) {
			console.log("pickerConfirm", e.value[0].label);
			let label = e.value[0].label;
			let id = e.value[0].id;
			let findIndex = this.selectValue.findIndex((item) => {
				return item.stock_id == this.pickerItem.stock_id;
			});
			this.pickerItem.use_place_id = label;
			if (findIndex !== -1) {
				this.$set(this.selectValue, findIndex, { ...this.pickerItem }); //$set可以触发更新视图
				console.log("this.selectValue", this.selectValue);
				this.pickerItem = {};
			}
		},
		// 选择使用地点确认
		treeConfirm(val) {
			console.log("val", val);
			let use_place_name = val.map((el) => el.name);
			let use_place_id = val.map((el) => el.id);
			let findIndex = this.selectValue.findIndex((item) => {
				return item.stock_id == this.pickerItem.stock_id;
			});
			this.pickerItem.use_place_id = use_place_id;
			this.pickerItem.use_place_name = use_place_name;
			if (findIndex !== -1) {
				this.$set(this.selectValue, findIndex, { ...this.pickerItem }); //$set可以触发更新视图
				console.log("this.selectValue", this.selectValue);
				this.pickerItem = {};
			}
		},
		// 点击选择下一步
		handleNext() {
			if (this.selectValue.length === 0) {
				uni.showToast({
					title: "请先选择商品数据",
					icon: "none",
				});
				return;
			}
			let findRes = this.selectValue.find((item) => {
				return item.rec_num == 0;
			});
			if (findRes) {
				uni.showToast({
					title: "请排查货品数据中有申领数量为0的货品",
					icon: "none",
					duration: 3000,
				});
				return;
			}

			let infoRef = this.$refs.infoRef;
			if (infoRef.ar_uid.length === 0) {
				uni.$uv.toast("请选择指定领取人");
				return;
			}
			let infoData = {
				warehouse_id: infoRef.warehouse_id,
				warehouse_name: infoRef.warehouse_name,
				rec_type_name: infoRef.rec_type_name,
				rec_type: infoRef.rec_type,
				out_time: infoRef.out_time, //出库日期,
				note: infoRef.note, //单据备注
				rp_uname: infoRef.rp_uname, //领料申请人名称
				rp_uid: infoRef.rp_uid, //领料申请人id;
				ar_uname: infoRef.ar_uname, //指定领取人名称
				ar_uid: infoRef.ar_uid.join(","), //指定领取人id数组
				ap_uname: infoRef.ap_uname, //指定审批人名称
				ap_uid: infoRef.ap_uid, //指定审批人id
			};
			this.preInfo = {
				...infoData,
				goods: this.selectValue,
				file_info: this.file_info,
				id: this.listId,
			};
			console.log("this.preInfo", this.preInfo);
			this.pageContainerShow = true;
			this.$refs.previewRef.open();
		},
		// 点击删除
		handleDel(e) {
			console.log("e", e);
			if (e.index === 0) {
				let goodsIndex = e.name;
				this.selectValue.splice(goodsIndex, 1);
			}
		},
		// 点击取消
		onCancel() {
			let currentPages = getCurrentPages();
			if (currentPages.length === 1) {
				uni.switchTab({
					url: "/pages/tabBar/home/index",
				});
				return;
			}
			uni.navigateBack();
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
		changeDetailData(data) {
			let {
				unique,
				goods_id,
				barcode,
				brand,
				class_name,
				title,
				spec,
				measure_name,
				price,
				note,
				ph_no,
				sup_name,
				warehouse_id,
				warehouse_name,
				rec_num,
				stock,
				use_place_id,
				stock_id,
				use_places,
				unique_label_detail,
				is_have_unique,
				ws_code
			} = data;
			let old_num = rec_num + stock;
			return {
				unique,
				goods_id,
				// goods_all_id,
				title,
				barcode,
				spec,
				brand,
				measure_name,
				class_name,
				price,
				rec_num,
				sup_name,
				ph_no: ph_no ?? "",
				warehouse_name,
				warehouse_id,
				note,
				old_num,
				select_status: false,
				stock_id,
				use_place_id: use_place_id ? use_place_id.map((item) => Number(item)) : [],
				use_place_name: use_places ? use_places.split(",") : [],
				unique_label_detail: unique_label_detail ? unique_label_detail : [],
				is_have_unique,
				ws_code
			};
		},
	},
	// 计算属性
	computed: {
		uniqueList() {
			return this.selectValue.map((el) => el.stock_id);
		},
		goodsLen() {
			return this.selectValue.length;
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
::v-deep .uv-swipe-action-item__content {
	background-color: #f6f6f6 !important;
}

.container {
	.list {
		margin-top: 30rpx;
		padding-bottom: 120rpx;
		&-header {
			height: 64rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx;
			background-color: #fff;
			border-bottom: 1rpx solid #e5e5e5;
			position: sticky;
			top: 0rpx;
			z-index: 99;
			&-left {
				display: flex;
				align-items: center;
				padding: 0 20rpx;
				.header-left-img {
					width: 40rpx;
					height: 40rpx;
					margin-right: 16rpx;
				}
			}
			&-right {
				padding-right: 20rpx;
			}
		}
	}
	.item {
		background-color: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;
		&-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.item-warehouse {
				font-weight: bold;
			}
			.item-stock {
				display: flex;
				align-items: center;
			}
		}
		&-content {
			margin-top: 10rpx;
			.goods-name {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.content-row {
				margin-top: 4rpx;
				font-size: 24rpx;
				.row-label {
					color: #a3a2a8;
				}
				.row-value {
				}
			}
			.content-flex {
				margin-top: 10rpx;
				font-size: 24rpx;
				display: flex;
				justify-content: space-between;
				.flex-box {
					flex: 1;
					flex-shrink: 0;
					color: #767a82;
				}
			}
			.content-note {
				margin-top: 4rpx;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				.note-label {
					display: inline-block;
					width: 130rpx;
					color: #a3a2a8;
				}
				.note-input {
					flex: 1;
					padding-right: 100rpx;
				}
				.note-place {
					flex: 1;
					margin-right: 100rpx;
					min-height: 48rpx;
					border-bottom: 1rpx solid #dadbde;
					padding: 12rpx 18rpx;
				}
			}
		}
	}
	.footer-btn {
		position: fixed;
		z-index: 199;
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
}
</style>
