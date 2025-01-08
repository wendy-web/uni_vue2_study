<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="其他出库单列表"
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
							:disabled="item.assoc_type != 1 || item.status != 6 || !checkDelBtn"
						>
							<wlist-item
								:type="5"
								@tapDetail="tapDetail"
								@tapSubmit="tapSubmit"
								@tapVoid="tapVoid($event, item)"
								@tapRecall="tapRecall"
								@tapApprove="tapApprove"
								@tapReject="tapReject"
								:info="item"
								@tapStatus="tapStatus"
							></wlist-item>
						</uv-swipe-action-item>
						<gray-gap></gray-gap>
					</template>
				</uv-swipe-action>
			</view>
		</mescroll-body>
		<uv-popup ref="popup" mode="bottom" @change="popupChange" :round="10" closeable>
			<wapprove-list headerIcon :info="approveLogList" v-if="approveShow"></wapprove-list>
			<view class="approve-close-btn">
				<uv-button text="关闭" shape="circle" @click="approveLogClose"></uv-button>
			</view>
		</uv-popup>
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
	</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import ListMixin from "@/mixin/list_mixin.js";
import myMixin from "@/mixin/index.js";
import {
	getRetGoodsListApi,
	submitRetGoodsApi,
	recallRetGoodsApi,
	voidRetGoodsApi,
	delRetGoodsApi,
	rejectRetGoodsApi,
	approveRetGoodsApi,
} from "@/api/modules/retGoods.js";
import { getapproveLogApi } from "@/api/modules/common.js";
import { btnPermsMap, hasPerm } from "@/utils/auth.js";
export default {
	mixins: [MescrollMixin, ListMixin, myMixin], // 使用mixin
	// 这里存放数据
	data() {
		return {
			statusOptions: [
				{
					value: 0,
					label: "待提审",
				},
				{
					value: 1,
					label: "待审核",
				},
				{
					value: 3,
					label: "已完成",
				},
				{
					value: 4,
					label: "已撤回",
				},
				{
					value: 5,
					label: "已驳回",
				},
				{
					value: 6,
					label: "已作废",
				},
				{
					value: 7,
					label: "已审核",
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
				noMoreSize: 3, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
			},
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {},
	// 生命周期 - 监听页面显示
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	// 方法集合
	methods: {
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			};
			console.log("data", data);
			try {
				const result = await getRetGoodsListApi(data);
				console.log("采购单退货列表页", result);
				let res = result.data;
				const total = res.total;
				// console.log("total", total);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
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
		tapDetail(e) {
			let id = e.id;
			let assoc_type = e.assoc_type;
			// uni.$uv.toast("点击详情");
			uni.navigateTo({
				url: `../detail/detail?id=${id}&assoc_type=${assoc_type}`,
			});
		},
		// 子组件触发 显示审批日志
		async tapStatus(e) {
			console.log("采购单id", e.id);
			// uni.$uv.toast("点击显示审批日志");
			const result = await getapproveLogApi({ document_type: 2, document_id: e.id });
			this.approveLogList = result.data;
			this.$refs.popup.open();
		},
		// 触发提交审核
		async tapSubmit(e) {
			// uni.$uv.toast("点击提审");
			let id = e.id;
			const result = await submitRetGoodsApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击作废
		tapVoid(e, item) {
			// uni.$uv.toast("点击作废");
			let id = e.id;
			let { wh_ret_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废【${wh_ret_no}】退货出库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidRetGoodsApi({ id });
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
			const result = await recallRetGoodsApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击通过
		async tapApprove(e) {
			let id = e.id;
			const result = await approveRetGoodsApi({ id });
			this.toastRefresh(result.msg);
		},
		// 触发点击驳回
		tapReject(e) {
			let id = e.id;
			this.rejectId = id;
			this.$refs.modal.open();
		},
		async rejectConfirm() {
			console.log("点击确认按钮");
			let data = {
				reason: this.rejectValue,
				id: this.rejectId,
			};
			const result = await rejectRetGoodsApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.rejectId = 0;
			this.toastRefresh(result.msg);
		},

		// 滑动单元格点击
		handleAction(name, item) {
			console.log("item", item);
			let { id, wh_ret_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要删除【${wh_ret_no}】退货出库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await delRetGoodsApi({ id });
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
	},
	// 计算属性
	computed: {
		checkDelBtn() {
			let sign = btnPermsMap.get(9)?.del || [];
			return hasPerm(sign);
		},
	},
	onHide() {}, // 生命周期 - 监听页面隐藏
	onUnload() {}, // 生命周期 - 监听页面卸载
};
</script>
<style lang="scss"></style>
