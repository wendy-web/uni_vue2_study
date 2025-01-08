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
		<wdrop-type
			ref="dropMenuRef"
			@statusChange="handleStatus"
			@dateChange="handleDate"
			@directorChange="directorChange"
			:status-list="statusList"
			:filtrateList="filtrateList"
		></wdrop-type>
	</uv-sticky>
	<!-- 新增 -->
	<view class="add_box" @click="toDetailHandle(0, 1)" v-if="isShowAddEditBtn">
		<uv-icon name="plus" size="25" color="#fff" bold="true"></uv-icon>
	</view>
	<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
		<view class="width-full all-p-lr-20">
			<view v-for="(item, index) in dataList" :key="index" @click="toDetailHandle(item.id, 3)"
				class="width-full contentBox position-r">
				<view class="width-full all-p-lr-30 all-p-tb-30">
					<view class="width-full display_row_between_center">
						<view class="f-s-36 t-w-bold">{{item.repair_no}}</view>
						<view class="display_row_center">
							<div class="status-box">
								<!-- -1 已删除 0 = 待提审 1 = 待验收 2 = 已完成 3 = 已驳回 4 = 已撤回 5 = 已作废", -->
								<uv-tags
									:text="statusList[item.status].label"
									:type="statusList[item.status].type"
									plain v-if="statusList[item.status]"
								></uv-tags>
							</div>
							<uv-icon name="arrow-right" size="20"></uv-icon>
						</view>
					</view>
					<view class="width-full display_row_between_center all-m-t-10 t-c-333 f-s-28">
						<view>{{item.ct_name}}</view>
						<view>{{item.create_time}}</view>
					</view>
				</view>
				<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28 display-block item_cont">
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">设备编码：</text>
						<text class="t-c-333">{{ item.barcode }}</text>
					</view>
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">资产名称：</text>
						<text class="t-c-272727">{{item.bar_title}}</text>
					</view>
					<view class="width-full all-m-b-20 display_row_center">
						<text class="t-c-6F6F6F">使用位置：</text>
						<text class="t-c-272727">{{item.save_addr_text}}</text>
					</view>
					<view class="width-full display_row_between">
						<view class="width-full all-m-b-20 display_row_center">
							<text class="t-c-6F6F6F">是否停机：</text>
							<text class="t-c-272727">{{ item.is_stop ? '是' : '否'}}</text>
						</view>
						<view class="width-full all-m-b-20 display_row_center">
							<text class="t-c-6F6F6F">累积误时(分)：</text>
							<text style="color: red;">{{ item.stop_time }}</text>
						</view>
					</view>
					<view class="width-full all-m-b-20 display_row">
						<text class="t-c-6F6F6F" style="white-space: nowrap;">故障原因：</text>
						<text class="t-c-272727">{{ item.fault_reason_text }}</text>
					</view>
				</view>
				<!-- 当前是创建人的时候 -->
				<template v-if="checkAssocType(item.assoc_type, 1)">
					<view class="width-full content_row all-m-t-20 all-m-b-20" v-if="item.status != 2">
						<block v-if="[0, 3, 4].includes(item.status)">
							<view @click.stop="submitHandle(item)" v-if="isShowSubmitBtn">
								<uv-button type="primary" size="small" text="提交验收"></uv-button>
							</view>
							<view @click.stop="cancelHandle(item)" class="all-m-l-20" v-if="isShowVoidBtn">
								<uv-button type="warning" size="small" text="作废"></uv-button>
							</view>
							<text class="t-c-272727  all-m-l-20 f-s-28" v-if="isShowAddEditBtn" @click.stop="toDetailHandle(item.id, 2)">编辑</text>
						</block>
						<view @click.stop="revokeHandle(item)" v-if="item.status == 1 && isShowRecallBtn">
							<uv-button type="warning" size="small" text="撤回" class="all-m-r-20" ></uv-button>
						</view>
						<view @click.stop="deleteHandle(item)" v-if="item.status == 5 && isShowDelBtn">
							<uv-button type="error " size="small" text="删除" class="all-m-r-20" ></uv-button>
						</view>
					</view>
				</template>
				<!-- 当前是审核人的时候 -->
				<template v-if="checkAssocType(item.assoc_type, 2)">
					<view class="width-full content_row all-m-t-20 all-m-b-20" v-if="item.status == 1">
						<view @click.stop="passHandle(item)" v-if="isShowApproveBtn">
							<uv-button type="success" size="small" text="通过" class="all-m-r-20" ></uv-button>
						</view>
						<text class="t-c-272727 all-m-r-20 all-m-l-20 f-s-28" @click.stop="rejectHandle(item)" v-if="isShowRejectBtn">驳回</text>
					</view>
				</template>
			</view>
		</view>
	</mescroll-body>
	<submitDia ref="submitDiaRef" @submit="submitParamsHandle"></submitDia>
</view>
</template>
<script>
import {
	commitAcceptOrderApi,
	getRepairListApi
} from "@/api/device/maintain/repair.js";
import wdropType from "@/components/wdrop-menu/wdrop-type.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { checkAssocType, checkBtn } from '@/utils/auth.js';
import { deviceScan } from "@/utils/device.js";
import submitDia from './components/submitDia.vue';
import { cancelRequest, deleteRequest, passRequest, rejectRequest, revokeRequest } from './index';
export default {
	mixins: [MescrollMixin],
	components: {
		submitDia,
		wdropType
	},
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
			statusList: [
				{
					status: 0,
					label: '待提审',
					type: 'primary'
				},
				{
					status: 1,
					label: '待验收',
					type: 'primary'
				},
				{
					status: 2,
					label: '已完成',
					type: 'success'
				},
				{
					status: 3,
					label: '已驳回',
					type: 'warning'
				},
				{
					status: 4,
					label: '已撤回',
					type: 'info'
				},
				{
					status: 5,
					label: '已作废',
					type: 'error'
				}
			],
			filtrateList: [
				{
					label: "创建时间",
					value: 1,
				},
				{
					label: "状态",
					value: 3,
				},
				{
					label: "负责人",
					value: 5,
				}
			],
			authBack: false
		};
	},
	onLoad(options) {
		if(options.asset_no) this.searchQuery.keyword = options.asset_no;
		if(options.status) this.searchQuery.status = options.status;
		if(options.eq_id) this.searchQuery.eq_id = Number(options.eq_id);
		if(options.authBack) this.authBack = Boolean(options.authBack);
	},
	computed: {
		isShowSubmitBtn() {
			return checkBtn('submit', 1);
		},
		isShowVoidBtn() {
			return checkBtn('void', 1);
		},
		isShowAddEditBtn() {
			return checkBtn('addedit', 1);
		},
		isShowRecallBtn() {
			return checkBtn('recall', 1);
		},
		isShowDelBtn() {
			return checkBtn('del', 1);
		},
		isShowApproveBtn() {
			return checkBtn('approve', 1);
		},
		isShowRejectBtn() {
			return checkBtn('reject', 1);
		}
	},
	methods: {
		checkAssocType,
		verifyRole(key) {
			let checkRes = checkBtn(key, 1);
			if (!checkRes) {
				wx.showModal({
					title: "温馨提示",
					content: "很抱歉,您没有操作权限!",
					showCancel: false,
					confirmText: "我知道了",
				});
				return false;
			}
			return true;
		},
		// 提交验证
		submitHandle(item) {
			this.$refs.submitDiaRef.open(item);
		},
		async submitParamsHandle(params) {
			const res = await commitAcceptOrderApi(params);
			uni.showToast({
				icon: "none",
				title: res.msg,
			});
			this.$refs.submitDiaRef.close();
			this.handleSearch();
		},
		// 通过
		async passHandle(item) {
			await passRequest(item);
			this.handleSearch();
		},
		// 作废
		async cancelHandle(item) {
			await cancelRequest(item);
			this.handleSearch();
		},
		// 撤回
		async revokeHandle(item) {
			await revokeRequest(item);
			this.handleSearch();
		},
		// 删除
		async deleteHandle(item) {
			await deleteRequest(item);
			this.handleSearch();
		},
		// 驳回
		async rejectHandle(item) {
			await rejectRequest(item);
			this.handleSearch();
		},
		// 状态的更改 - 筛选
		handleStatus(e) {
			this.searchQuery.status = e.status;
			this.handleSearch();
		},
		// 日期更改筛选
		handleDate(e) {
			this.searchQuery.create_time_start = e.start_time;
			this.searchQuery.create_time_end = e.end_time;
			this.handleSearch();
		},
		// 负责人
		directorChange(event) {
			this.searchQuery.repair_director = event.director_id;
			this.handleSearch();
		},
		toDetailHandle(id, operateType = 1) {
			// 进入类型，1 新建 2 编辑 3查看
			if(!this.verifyRole('detail')) return;
			uni.navigateTo({
				url: `./detail?id=${id}&operateType=${operateType}`
			});
		},
		handleReset() {
			this.searchQuery = {
				keyword: undefined,
			};
			this.$refs.dropMenuRef.reset();
			this.handleSearch();
		},
		async handleScan() {
			const scanResult = await deviceScan();
			console.log("scanResult", scanResult);
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},
		// 上拉加载
		async upCallback(page) {
			const params = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			}
			const res = await getRepairListApi(params, this.authBack).catch(() => this.mescroll.endErr());
			if(!res.code || !res.data) return this.mescroll.endSuccess(0);
			let data = res.data;
			this.mescroll.endBySize(data.list.length, data.total); //必传参数(当前页的数据个数, 总数据量)
			if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
			this.dataList = this.dataList.concat(data.list); //追加新数据
		},
		// 点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
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
	&:not(:last-child) {
      margin-bottom: 30rpx;
    }
}
.item_cont{
	border-bottom: 2rpx dashed #f3f3f3;
	border-top: 2rpx dashed #f3f3f3;
	background: #fbfbfb;
}
.add_box{
	position: fixed;
	right: 20rpx;
	bottom: 15%;
	background: #00C080;
	border-radius: 50%;
	z-index: 9;
	padding: 15rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(#00C080, 0.6);
}
</style>
