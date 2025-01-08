<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="其他入库单列表"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="back"
		/>
		<uv-sticky offsetTop="88">
			<view class="search-container" @click="closeStatus">
				<uv-search
					:showAction="true"
					actionText="搜索"
					:animation="true"
					bgColor="#F8FAFF"
					borderColor="#AEC2FF"
					@search="handleSearch"
					@custom="handleSearch"
					v-model="searchQuery.keyword"
				></uv-search>
				<wsearch-btn @reset="handleReset"></wsearch-btn>
			</view>
			<wdrop-menu
				ref="dropMenuRef"
				@statusChange="handleStatus"
				@dateChange="handleDate"
				@deptChange="handleDept"
				:status-list="statusOptions"
			></wdrop-menu>
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="list-wrapper">
				<uv-swipe-action>
					<template v-for="(item, index) in dataList">
						<uv-swipe-action-item
							:options="options"
							:key="item.id"
							@click="handleAction($event, item)"
							:disabled="item.assoc_type != 1 || item.status != 6"
						>
							<wlist-item
								:type="12"
								@tapDetail="tapDetail"
								@tapSubmit="tapSubmit"
								@tapVoid="tapVoid($event, item)"
								@tapRecall="tapRecall"
								@tapApprove="tapApprove"
								@tapReject="tapReject"
								@tapWhApprove="tapWhApprove"
								@tapWhReject="tapWhReject"
								:info="item"
							></wlist-item>
						</uv-swipe-action-item>
						<gray-gap></gray-gap>
					</template>
				</uv-swipe-action>
			</view>
		</mescroll-body>
		<uv-modal
			ref="modal"
			title="请输入驳回原因"
			showCancelButton
			:closeOnClickOverlay="false"
			asyncClose
			@confirm="rejectConfirm"
		>
			<uv-textarea v-model="rejectValue" count placeholder="请输入内容"></uv-textarea>
		</uv-modal>
		<uv-toast ref="toast"></uv-toast>
		<!-- 入库时间 -->
		<submitDateDia ref="submitDiaRef" @submit="submitWhApprove"></submitDateDia>
		<!-- 驳回原因 -->
		<submitReasonDia ref="submitReasonDiaRef" @submit="submitWhReject"></submitReasonDia>
	</view>
</template>

<script>
import {
	approveOtherInApi,
	delOtherInApi,
	getOtherInListApi,
	recallOtherInApi,
	rejectOtherInApi,
	submitOtherInApi,
	voidOtherInApi,
	whApproveApi,
	whRejectApi
} from "@/api/modules/otherIn.js";
import myMixin from "@/mixin/index.js";
import ListMixin from "@/mixin/list_mixin.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import submitDateDia from '../../components/submitDateDia.vue';
import submitReasonDia from '../../components/submitReasonDia.vue';
export default {
	mixins: [MescrollMixin, ListMixin, myMixin],
	components: {
		submitDateDia,
		submitReasonDia
	},
	data() {
		return {
			statusOptions:[
					{
						label: "待提审",
						value: 0,
					},
					{
						label: "待审核",
						value: 1,
					},
					{
						label: "已完成",
						value: 3,
					},
					{
						label: "已撤回",
						value: 4,
					},
					{
						label: "已驳回",
						value: 5,
					},
					{
						label: "已作废",
						value: 6,
					},
					{
						label: "待仓库确认",
						value: 7,
					},
			],
			options: [
				{
					text: "删除",
					style: {
						backgroundColor: "#f56c6c",
					},
				},
			],
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
		};
	},

	onLoad(options) {},
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	methods: {
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			};
			try {
				const result = await getOtherInListApi(data);
				let res = result.data;
				const total = res.total;
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
				this.mescroll.endErr();
			}
		},
		//点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		tapDetail(e) {
			let id = e.id;
			uni.navigateTo({
				url: `../detail/detail?id=${id}`,
			});
		},
		// 触发提交审核
		async tapSubmit(e) {
			let id = e.id;
			const result = await submitOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击作废
		tapVoid(e, item) {
			let id = e.id;
			let { wh_in_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废【${wh_in_no}】其他入库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidOtherInApi({ id });
						this.toastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		// 触发点击撤回
		async tapRecall(e) {
			let id = e.id;
			const result = await recallOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击通过
		async tapApprove(e) {
			let id = e.id;
			const result = await approveOtherInApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击驳回
		tapReject(e) {
			let id = e.id;
			this.rejectId = id;
			this.$refs.modal.open();
		},
		// 触发入库时间选择
		tapWhApprove(event) {
			let { id, in_time } = event;
			this.$refs.submitDiaRef.open({ id, in_time });
		},
		// 入库弹窗确认
		async submitWhApprove(params) {
			const res = await whApproveApi(params);
			uni.showToast({
				icon: "none",
				title: res.msg,
			});
			this.$refs.submitDiaRef.close();
			this.handleSearch();
		},
		// 触发入库驳回
		tapWhReject(event) {
			let { id } = event;
			this.$refs.submitReasonDiaRef.open({ id });
		},
		async submitWhReject(params) {
			const res = await whRejectApi(params);
			uni.showToast({
				icon: "none",
				title: res.msg,
			});
			this.$refs.submitReasonDiaRef.close();
			this.handleSearch();
		},
		async rejectConfirm() {
			console.log("点击确认按钮");
			let data = {
				reason: this.rejectValue,
				id: this.rejectId,
			};
			const result = await rejectOtherInApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.rejectId = 0;
			this.toastRefresh(result.msg);
		},
		// 滑动单元格点击
		handleAction(name, item) {
			console.log("item", item);
			let { id, wh_in_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要删除【${wh_in_no}】其他入库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await delOtherInApi({ id });
						this.toastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		toastRefresh(msg) {
			this.showToastRefresh(msg, this.mescroll.resetUpScroll(false));
		},
	}
};
</script>
<style lang="scss"></style>
