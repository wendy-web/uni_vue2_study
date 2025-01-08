<template>
	<!-- <page-container :show="pageContainerShow" :duration="false" :overlay="false" z-index="99999" @afterleave="close"> -->
	<uv-popup
		ref="popup"
		mode="right"
		:overlay="false"
		duration="0"
		custom-style="width: 100vw;height:100vh;background-color:#f6f6f6;overflow:auto"
		zIndex="10001"
	>
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="选择盘点货品"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<view class="wait-container">
			<view class="search-container wait-search">
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
			<view class="wait-list">
				<!-- 待盘商品列表头部 -->
				<view class="list-header">
					<view class="list-header-left">
						<image
							src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
							class="header-left-img"
						></image>
						<text>待盘商品列表</text>
					</view>
					<view class="list-header-right">
						<text>库存数：</text>
						<uv-input
							v-model="stockTypeValue"
							readonly
							placeholder="请选择库存数"
							@click.native="showPicker"
							:custom-style="{ width: '140rpx' }"
						>
							<template v-slot:suffix>
								<uv-icon name="arrow-right"></uv-icon>
							</template>
						</uv-input>
					</view>
				</view>
				<mescroll-uni @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
					<view class="wait-list-main">
						<uv-checkbox-group :value="checkboxValue" shape="circle" placement="column" iconPlacement="right" size="20">
							<view class="wait-list-item" v-for="(item, index) in waitList" :key="item.stock_id">
								<view class="item-header">
									<view class="header-subitem">
										<text>盘前数量：</text>
										<text>{{ item.stock }}</text>
									</view>
								</view>
								<uv-checkbox
									:name="item.stock_id"
									:disabled="uniqueList.includes(item.stock_id)"
									@change="checkGroupChange($event, item)"
								>
									<view class="goods-item">
										<view class="goods-name">
											<text>{{ item.title }}</text>
										</view>
										<view class="goods-subitem">
											<text>条码：</text>
											<text>{{ item.barcode }}</text>
										</view>
										<view class="goods-subitem">
											<text>规格：</text>
											<text>{{ item.spec || "-" }}</text>
										</view>
										<view class="goods-subitem">
											<text>单位：</text>
											<text>{{ item.measure_name }}</text>
										</view>
										<view class="goods-subitem">
											<text>分类：</text>
											<text>{{ item.class_name }}</text>
										</view>
										<!-- 		<view class="item-others">
								<view class="item-others-item">
									<text>UGREEN绿联gfdgjklfdsjgkljk</text>
								</view>
								<view class="item-others-item">
									<text>规格2米gfdgjklfdsjgkljk</text>
								</view>
								<view class="item-others-item">
									<text>单位:罐2米gfdgjklfdsjgkljk</text>
								</view>
							</view> -->
										<view class="goods-subitem">
											<text>批次/日期：</text>
											<text>{{ item.batch_number }}</text>
										</view>
										<!-- <view class="goods-subitem">
											<text>备注：</text>
											<text>{{ item.note }}</text>
										</view> -->
									</view>
								</uv-checkbox>
								<!-- <view class="item-edit" v-if="!uniqueList.includes(item.stock_id)">
									<uv-button
										text="编辑内容"
										type="primary"
										plain
										:custom-style="{ borderRadius: '10rpx', height: '60rpx' }"
										@click="openPopup(item)"
									></uv-button>
								</view> -->
							</view>
						</uv-checkbox-group>
					</view>
				</mescroll-uni>
			</view>

			<view class="wait-footer-btn">
				<view class="wait-btn">
					<view class="wait-btn-all">
						<uv-checkbox-group activeColor="#1AAD19" shape="circle" size="20">
							<uv-checkbox name="all" label="全选" @change="selectAll" :checked="checkAll"></uv-checkbox>
						</uv-checkbox-group>
					</view>
					<view class="wait-btn-item">
						<uv-button text="设置为已盘" type="primary" :customStyle="btnStyle" @click="batchSetting"></uv-button>
					</view>
					<view class="wait-btn-item">
						<uv-button text="取消" :customStyle="btnStyle" @click="close"></uv-button>
					</view>
				</view>
			</view>
			<uv-picker
				ref="stockPicker"
				:columns="pickerColumns"
				@confirm="confirmStock"
				keyName="label"
				title="注意:此操作会重置待盘列表数据"
			></uv-picker>
		</view>
	</uv-popup>
	<!-- </page-container> -->
</template>

<script>
import inputnumPopup from "./inputnumPopup.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getInstockApi,getLabelInfoXcxApi } from "@/api/modules/common.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		inputnumPopup,
	},
	props: {
		warehouse_id: {
			type: Number,
			default: 0,
		},
		uniqueList: {
			type: Array,
			default: () => [],
		},
		waitInfo: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 5, // 每页数据的数量
					time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
			// picker数据
			pickerColumns: [
				[
					{
						label: "大于0",
						value: 0,
					},
					{
						label: "等于0",
						value: 2,
					},
					{
						label: "全部",
						value: 1,
					},
				],
			],
			btnStyle: {
				borderRadius: "10rpx",
			},
			checkboxValue: [], //勾选绑定数据 只有stock_id
			checkAll: false, //全选状态
			waitList: [], // 模板使用的数据列表
			originalGoods: [], //原本的全部数据
			stockTypeValue: "大于0",
			stockType: 1, //库存类型 1大于0 2等于0 3全部
			selectValue: [], //勾选的数据
			itemInfo: {}, //暂存点击编辑内容时的货品信息数据
			searchQuery: {
				keyword: "",
				is_all: 0,
			},
			pageContainerShow: true,
		};
	},
	computed: {
		totalNum() {
			return this.waitList.length;
		},
	},
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
		back() {
			this.close();
		},
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				warehouse_id: this.warehouse_id,
				...this.searchQuery,
			};
			console.log("data", data);
			try {
				const result = await getInstockApi(data);
				console.log("待盘列表", result);
				let res = result.data;
				const total = res.total;
				this.$emit("totalChange", total);
				// console.log("total", total);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.waitList = []; //如果是第一页需手动制空列表
				this.waitList = this.waitList.concat(res.list); //追加新数据
				if (this.checkboxValue.length != this.waitList.length) {
					this.checkAll = false;
				}
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
		open() {
			this.pageContainerShow = true;
			this.$refs.popup.open();
			this.handleSearch()
		},
		close() {
			this.reset();
			this.searchQuery.keyword = "";
			this.searchQuery.is_all = 0;
			this.pageContainerShow = false;
			this.$refs.popup.close();
			this.$emit("close");
		},
		reset() {
			this.checkAll = false;
			this.checkboxValue = [];
			this.selectValue = [];
		},
		// 点击显示选择库存类型的picker
		showPicker() {
			this.$refs.stockPicker.open();
		},
		confirmStock(e) {
			console.log("e", e);
			let val = e.value[0];
			this.searchQuery.is_all = val.value;
			this.stockTypeValue = val.label;
			this.reset();
			this.handleSearch();
		},
		// 点击全选
		selectAll(val) {
			this.checkAll = val;
			let arr = this.waitList.map((item) => {
				return item.stock_id;
			});
			this.checkboxValue = val ? arr : [];
			this.selectValue = val ? this.waitList : [];
		},
		// 选中/或者取消选中时触发
		checkGroupChange(e, item) {
			if (e) {
				this.selectValue.push(item);
				this.checkboxValue.push(item.stock_id);
			} else {
				let index = this.checkboxValue.indexOf(item.stock_id);
				if (index !== -1) {
					this.selectValue.splice(index, 1);
					this.checkboxValue.splice(index, 1);
				}
			}
			this.checkAll = this.checkboxValue.length === this.waitList.length;
		},
		// 点击取消
		cancel() {
			uni.navigateBack();
		},
		//点击批量设置
		batchSetting() {
			if (!this.checkboxValue.length) {
				uni.$uv.toast("请先选择货品");
			} else {
				console.log("checkboxValue", this.checkboxValue);
				console.log("selectValue", this.selectValue);
				this.$emit("confirm", this.selectValue);
				this.close();
			}
		},
	},
	watch: {
		warehouse_id: {
			handler(newValue) {
				if (newValue) {
					this.handleSearch();
				}
			},
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: #f6f6f6;
}
.wait-container {
	.wait-search{
		position: sticky;
		top: 0;
		z-index: 99;
	}
	.wait-list {
		width: 100%;
		padding-bottom: 180rpx;
		/* 已盘商品列表头部 */
		.list-header {
			position: sticky;
			top: 0;
			z-index: 99;
			background-color: #fff;
			height: 84rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-left: 30rpx;
			padding-right: 10rpx;
			border-bottom: 1rpx solid #e5e5e5;
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
				font-size: 28rpx;
				&-item {
					margin-right: 20rpx;
				}
			}
		}
		.wait-list-main {
			margin: 80rpx 0;
			margin-top: 340rpx;
		}
		.wait-list-item {
			padding: 20rpx 30rpx;
			// padding-bottom: 40rpx;
			background-color: #fff;
			position: relative;
			margin-bottom: 30rpx;
			.item-header {
				margin-bottom: 20rpx;
				display: flex;
				justify-content: space-between;
				.header-subitem {
					font-size: 28rpx;
					text {
						&:first-child {
							color: #707072;
						}
					}
				}
			}
			.item-edit {
				position: absolute;
				bottom: 8rpx;
				right: 20rpx;
			}
			.goods-item {
				.goods-name {
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 28rpx;
				}
				/* 商品样式 */
				.goods-subitem {
					font-size: 24rpx;
					margin-top: 10rpx;
				}

				.item-others {
					display: flex;
					align-items: center;
					margin-bottom: 20rpx;
					&-item {
						background-color: #ecf0ff;
						max-width: 212rpx;
						height: 48rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						border-radius: 10rpx;
						line-height: 48rpx;
						text-align: center;
						font-size: 28rpx;
						color: #707072;
						padding: 0 20rpx;
						margin-right: 20rpx;

						&:last-child {
							margin-right: 0;
						}
					}
				}
			}
		}
	}
	.wait-footer-btn {
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background-color: #ffffff;
		padding: 4rpx 20rpx 0rpx 20rpx;
		.wait-btn {
			display: flex;
			align-items: center;
			&-all {
				margin-right: 40rpx;
			}
			&-item {
				flex: 1;
				&:last-child {
					margin-left: 40rpx;
				}
			}
		}
	}
}
</style>
