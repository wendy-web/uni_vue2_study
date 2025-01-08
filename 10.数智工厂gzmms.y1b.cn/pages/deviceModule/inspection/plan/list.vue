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
			<wdrop-type
				ref="dropMenuRef"
				pickerTitle="选择执行人"
				@statusChange="handleStatus"
				@dateChange="handleDate"
				@deptChange="handleDept"
				@directorChange="directorChange"
				@checkChange="checkChange"
				:showFastBtn="true"
				:status-list="statusList"
				:filtrateList="filtrateList"
				:isAdvent="searchQuery.is_advent"
			></wdrop-type>
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="width-full all-p-lr-20">
				<view class="width-full contentBox position-r"
					v-for="(item, index) in dataList" :key="index"
					@click="toDetail(item.id)"
				>
					<view class="width-full all-p-lr-30 display_row_between_center"
						style="border-bottom: 2rpx solid #efefef; height: 92rpx"
					>
						<view class="t-c-000018 f-s-32 t-w-bold">{{ item.plan_details_no }}</view>
						<view class="display_row_center">
							<text style="color: red;" class="all-m-r-10 f-s-26" v-if="item.overdue_day > 0">（逾期{{ item.overdue_day }}天）</text>
							<text style="color: #03B37B;" class="all-m-r-10 f-s-26" v-if="carryOutShow(item)">{{ item.execute_notice_day }}天后执行</text>
							<uv-tags
								:text="statusList[item.status].label"
								:type="statusList[item.status].type"
								plain v-if="statusList[item.status]"
							></uv-tags>
							<uv-icon name="arrow-right" size="20"></uv-icon>
						</view>
					</view>
					<view class="width-full all-p-t-20 all-p-lr-30 display_column_center f-s-28">
						<view class="width-full display_row_center f-s-28">
							<view class="plan-time-label">执行时间</view>
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
								<text class="t-c-272727">{{ item.executor_names }}</text>
							</view>
							<view class="width-full all-m-b-20 display_row_center">
								<text class="t-c-6F6F6F">循环周期：</text>
								<text class="t-c-272727">{{ getCycleName(item.cycle_type) }}</text>
							</view>
							<view class="width-full display_row_center">
								<text class="t-c-6F6F6F">上次执行时间：</text>
								<text class="t-c-272727">{{ item.last_start_time || "--" }}</text>
							</view>
						</view>
						<view class="width-full display_row_between_center all-p-tb-30">
							<view class="flex_full display_row_center">
								<image class="addressIcon" src="@/static/otherImg/planIcon0.png"></image>
								<text class="all-m-l-5 f-s-28" style="color: #898989">{{ item.use_places || "--" }}</text>
							</view>
							<template v-if="item.status == 1">
								<view class="rightButBox" @click.stop="executePlanTap(item)" v-if="checkBtn('detail')">执行计划</view>
							</template>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>
<script>
import { getInspectionPlanListApi } from "@/api/device/inspection/plan.js";
import wdropType from "@/components/wdrop-menu/wdrop-type.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { deviceBtnPermsMap, hasPerm } from "@/utils/auth.js";
import { deviceScan, getInspecCycleName, getRulePlanTime } from "@/utils/device.js";
export default {
	mixins: [MescrollMixin],
	components: {
      wdropType
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
				noMoreSize: 3,
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
			searchQuery: {
				keyword: "",
				is_advent: 0
			},
			statusList: [
				{
					status: 0,
					label: '未开始',
					type: 'primary'
				},
				{
					status: 1,
					label: '待检查',
					type: 'warning'
				},
				{
					status: 2,
					label: '检查中',
					type: 'success'
				},
				{
					status: 3,
					label: '待审核',
					type: 'info'
				},
				{
					status: 4,
					label: '停用',
					type: 'error'
				},
			],
			filtrateList: [
				{
					label: "执行时间",
					value: 1,
				},
				{
					label: "状态",
					value: 3,
				},
				{
					label: "部门",
					value: 4,
				},
				{
					label: "执行人",
					value: 5,
				},
				{
					label: "临期",
					value: 6,
					is_advent: 0
				}
			],
			authBack: false
		};
	},
	onLoad(options) {
		if(options.asset_no) this.searchQuery.keyword = options.asset_no;
		// 是否临期
		if(options.is_advent) this.searchQuery.is_advent = Number(options.is_advent);
		if(options.status) this.searchQuery.status = options.status;
		if(options.eq_id) this.searchQuery.eq_id = Number(options.eq_id);
		if(options.authBack) this.authBack = Boolean(options.authBack);
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	methods: {
		carryOutShow(item) {
			const { notice_day, execute_notice_day, status } = item;
			return (notice_day >= 0) && (execute_notice_day > 0) && (status != 4);
		},
		checkBtn(signKey) {
			let mapObj = deviceBtnPermsMap.get(2);
			let signValue = mapObj ? mapObj[signKey] : [];
			return hasPerm(signValue);
		},
		toDetail(id) {
			let checkRes = this.checkBtn("detail");
			if (!checkRes) {
				wx.showModal({
					title: "温馨提示",
					content: "很抱歉,您没有操作权限!",
					showCancel: false,
					confirmText: "我知道了",
				});
				return;
			}
			uni.navigateTo({
				url: `./detail?id=${id}`,
			});
		},
		getPlanTime(data) {
			return getRulePlanTime(data);
		},
		getCycleName(cycle_type) {
			return getInspecCycleName(cycle_type);
		},
		async handleScan() {
			const scanResult = await deviceScan();
			console.log("scanResult", scanResult);
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},
		// 状态的更改 - 筛选
		handleStatus(e) {
			this.searchQuery.status = e.status;
			this.handleSearch();
		},
		// 日期更改筛选
		handleDate(e) {
			this.searchQuery.plan_start_time_start = e.start_time;
			this.searchQuery.plan_start_time_end = e.end_time;
			this.handleSearch();
		},
		// 部门
		handleDept(e) {
			this.searchQuery.use_dept_id = e.dept_id;
			this.handleSearch();
		},
		// 执行人
		directorChange(event) {
			this.searchQuery.executor_uid = event.director_id;
			this.handleSearch();
		},
		// 临期
		checkChange(event) {
			this.searchQuery.is_advent = event.check;
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
				const result = await getInspectionPlanListApi(data, this.authBack);
				console.log("点巡检计划列表页", result);
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
			this.$refs.dropMenuRef.reset();
			this.handleSearch();
		},
		// 跳转到点巡检执行新增
		executePlanTap(item) {
			uni.navigateTo({
				url: `/pages/deviceModule/inspection/record/add?planId=${item.id}`,
			});
		},
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
	&:not(:last-child) {
      margin-bottom: 30rpx;
    }
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
