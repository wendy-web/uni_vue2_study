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
				>
					<template v-slot:suffix>
						<uv-icon name="scan" size="30" @click.stop="handleScan"></uv-icon>
					</template>
				</uv-search>
				<wsearch-btn @reset="handleReset" color="#fff"></wsearch-btn>
			</view>
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="width-full all-p-tb-30 all-p-lr-20">
				<view class="width-full contentBox position-r all-m-b-30" v-for="(item, index) in dataList" :key="index">
					<view
						class="width-full all-p-lr-30 display_row_between_center"
						style="border-bottom: 2rpx solid #efefef; height: 92rpx"
					>
						<view class="t-c-000018 f-s-32 t-w-bold">{{ item.point_no }} ></view>
						<view class="">
							<span class="overdue-hint" v-if="item.overdue_day > 0">（逾期{{ item.overdue_day }}天）</span>
							<div class="status-box">
								<uv-tags text="待提审" type="primary" v-if="item.status == 0" plain></uv-tags>
								<uv-tags text="待审核" type="warning" plain v-else-if="item.status == 1"></uv-tags>
								<uv-tags text="已完成" type="success" plain v-else-if="item.status == 2"></uv-tags>
								<uv-tags text="已驳回" type="error" plain v-else-if="item.status == 3"></uv-tags>
								<uv-tags text="已撤回" type="info" plain v-else-if="item.status == 4"></uv-tags>
								<div style="width: 160rpx; margin-left: -20rpx" v-else-if="item.status == -2">
									<uv-tags text="过期未检" type="error" plain></uv-tags>
								</div>
							</div>
						</view>
					</view>
					<view class="width-full all-p-t-20 all-p-lr-30 f-s-28">
						<view class="width-full display_row_center f-s-28">
							<view class="plan-time-label">计划执行时间</view>
							<text class="all-m-l-25" style="color: #091b31">{{ getPlanTime(item) }}</text>
						</view>
						<view class="width-full all-m-t-20 contentItemBox all-p-lr-24 all-p-tb-20">
							<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">设备编码：</text>
								<text class="t-c-272727">{{ item.asset_no }}</text>
							</view>
							<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">资产名称：</text>
								<text class="t-c-272727">{{ item.bar_title }}</text>
							</view>
							<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">执行人员：</text>
								<text class="t-c-272727">{{ item.executor_user_text }}</text>
							</view>
							<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">创建人：</text>
								<text class="t-c-272727">{{ item.ct_name }}</text>
							</view>
							<!-- 	<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">循环周期：</text>
								<text class="t-c-272727">{{ getCycleName(item.cycle_type) }}</text>
							</view> -->
							<!-- 	<view class="width-full display_row_center">
								<text class="t-c-6F6F6F">上次执行时间：</text>
								<text class="t-c-272727">{{ item.last_start_time || "--" }}</text>
							</view> -->
							<view class="width-full display_row_center">
								<text class="t-c-6F6F6F">整改状态：</text>
								<text class="t-c-272727">{{ checkRectifyText(item.is_report_rectify, item.rectify_status_text) }}</text>
							</view>
						</view>
						<view class="width-full display_row_between_center all-p-tb-30">
							<!-- <view class="flex_full display_row_center">
								<image class="addressIcon" src="@/static/otherImg/planIcon0.png"></image>
								<text class="all-m-l-5 f-s-28" style="color: #898989">{{ item.use_places || "--" }}</text>
							</view> -->
						</view>
						<listBtnVue
							:info="item"
							@tapEdit="cellEdit"
							@tapRectify="cellRectify"
							@tapDetail="cellDetail"
							@tapSubmit="cellSubmit"
							:disabledSubmit="checkSubmit(item.is_report_rectify, item.rectify_status)"
							@tapRecall="cellDetail"
						></listBtnVue>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { getInspecRecordListApi } from "@/api/device/inspection/record.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { deviceScan, getInspecCycleName, getRulePlanTime } from "@/utils/device.js";
import listBtnVue from "./components/listAdd.vue";
export default {
	// 这里存放数据
	mixins: [MescrollMixin], // 使用mixin
	components: {
		listBtnVue,
	},
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
				keyword: "",
			},
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		if(options.asset_no){
			this.searchQuery.keyword = options.asset_no;
		}
		if(options.status) this.searchQuery.status = options.status;
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		// 整改状态文本
		checkRectifyText(is_report_rectify, rectify_status_text) {
			if (is_report_rectify === 1) {
				return rectify_status_text;
			} else {
				return "无需整改";
			}
		},
		/** 检查提交验收按钮是否禁用 */
		checkSubmit(is_report_rectify, rectify_status) {
			if (is_report_rectify === 1) {
				return rectify_status === 1 ? false : true;
			}
			return false;
		},
		getPlanTime(data) {
			return getRulePlanTime(data);
		},
		getCycleName(cycle_type) {
			return getInspecCycleName(cycle_type);
		},
		// 点击编辑
		cellEdit(data) {
			let { id } = data;
			uni.navigateTo({
				url: `./add?id=${id}`,
			});
		},
		cellRectify(data) {
			let { id } = data;
			uni.navigateTo({
				url: `./add?id=${id}&orderType=1`,
			});
		},
		cellDetail(data) {
			let { id } = data;
			uni.navigateTo({
				url: `./detail?id=${id}`,
			});
		},
		cellSubmit(data) {
			let { id } = data;
			console.log("点击提交审核");
			uni.navigateTo({
				url: `./detail?id=${id}`,
			});
		},

		async handleScan() {
			const scanResult = await deviceScan();
			console.log("scanResult", scanResult);
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},

		// 上拉加载
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			};
			try {
				const result = await getInspecRecordListApi(data);
				console.log("点巡检记录列表页", result);
				let res = result.data;
				const total = res.total;
				// console.log("total", total);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
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
			console.log("点击重置");
			this.searchQuery = {
				keyword: undefined,
			};
			// this.$refs.dropMenuRef.reset();
			this.handleSearch();
		},
		// 跳转到点巡检执行新增
		// executePlanTap(item) {
		// 	uni.navigateTo({
		// 		url: `./add?id=${item.id}`,
		// 	});
		// },
		arraignTap() {},
	},
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

	.plan-time-label {
		color: #898989;
		width: 160rpx;
		flex-shrink: 0;
	}

	.status-box {
		display: inline-block;
		width: 130rpx;
		// height: 40rpx;
		font-size: 24rpx;
		margin: 0 auto;
		margin-bottom: 4rpx;
	}

	.right-title-box {
		width: 96rpx;
		height: 40rpx;
		font-size: 24rpx;

		border-radius: 6rpx;
		text-align: center;
		line-height: 40rpx;
		margin: 0 auto;
	}
	.overdue-hint {
		color: #f6001d;
		font-size: 24rpx;
	}

	.rightTitleBox1 {
		background: #fff9fa;
		padding: 6rpx 16rpx;
		font-size: 24rpx;
		color: #e3001b;
		border: 1px solid #e3001b;
		border-radius: 6rpx;
	}

	.contentItemBox {
		background: #f5faff;
		border-radius: 20rpx;
	}

	.addressIcon {
		width: 24rpx;
		height: 30rpx;
		margin-right: 8rpx;
	}

	.rightButBox {
		min-width: 130rpx;
		text-align: center;
		padding: 10rpx 24rpx;
		border-radius: 60rpx;
		background: #0171fd;
		font-size: 28rpx;
		color: #ffffff;
	}
}
</style>
