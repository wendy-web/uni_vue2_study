<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="领料单列表"
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
				:status="searchQuery.status"
				:statusList="statusList"
			></wdrop-menu>
		</uv-sticky>
		<movable-area class="movable-area" v-if="checkBtn(['sto:getsup:add'])">
			<movable-view direction="all" x="640rpx" y="840rpx">
				<navigator url="../add/add" class="movable-view">
					<image src="@/static/images/add_blue@2x.png" mode="" class="add-img"></image>
				</navigator>
			</movable-view>
		</movable-area>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="list-wrapper">
				<uv-swipe-action>
					<template v-for="(item, index) in dataList">
						<uv-swipe-action-item
							:options="options"
							:key="item.id"
							@click="handleAction($event, item)"
							:disabled="item.is_ct_user != 1 || item.status != 6 || !checkBtn(['sto:getsup:del'])"
						>
							<!-- <wlist-item :type="6" :info="item" @click.native="tapDetail(item)"> -->
							<wlist-item :type="6" :info="item" @tapDetail="tapDetail">
								<template v-slot:operation>
									<view class="flex flex-wrap">
										<!-- 当前为创建人 -->
										<template v-if="item.is_ct_user == 1">
											<!-- 待提审,已撤回,已驳回状态时 -->
											<template v-if="item.status == 0 || item.status == 4 || item.status == 5">
												<view class="footer-btn" v-if="checkBtn(['sto:getsup:edit'])">
													<uv-button
														text="编辑"
														shape="circle"
														color="#6086fc"
														plain
														:customStyle="footerBtn"
														@click="tapEdite(item)"
													></uv-button>
												</view>
												<view class="footer-btn" v-if="checkBtn(['sto:getsup:void'])">
													<uv-button
														text="作废"
														shape="circle"
														:customStyle="footerBtn"
														@click="tapVoid(item)"
													></uv-button>
												</view>
												<view class="footer-btn mr-0" v-if="checkBtn(['sto:getsup:submit'])">
													<uv-button
														text="提审" 
														shape="circle"
														color="#6086fc"
														:customStyle="footerBtn"
														@click="tapSubmit(item)"
													></uv-button>
												</view>
											</template>
											<!-- 待审核和待领料状态时 -->
											<template v-else-if="item.status == 1 || item.status == 8">
												<template v-if="!item.is_part_issue">
													<view class="footer-btn" v-if="checkBtn(['sto:getsup:recall'])">
														<uv-button
															text="撤回"
															shape="circle"
															plain
															:customStyle="footerBtn"
															@click="tapRecall(item)"
														></uv-button>
													</view>
												</template>
											</template>
										</template>
										<!-- 当前为审核人的时候 -->
										<template v-if="checkAssocType(item.assoc_type, 2)">
											<!-- <template > -->
											<!-- 待审核状态时 -->
											<template v-if="item.status == 1">
												<view class="footer-btn" v-if="checkBtn(['sto:getsup:approve'])">
													<uv-button
														text="通过"
														shape="circle"
														color="#6086fc"
														:customStyle="footerBtn"
														@click="tapApprove(item)"
														plain
													></uv-button>
												</view>
												<view class="footer-btn" v-if="checkBtn(['sto:getsup:reject'])">
													<uv-button
														text="驳回"
														shape="circle"
														color="#f9ae3d"
														plain
														:customStyle="footerBtn"
														@click="tapReject(item)"
													></uv-button>
												</view>
											</template>
										</template>
										<!-- 当前为仓库待确认的时候 -->
										<template v-if="item.status == 8">
											<view class="footer-btn" v-if="checkBtn(['sto:getsup:whapprove'])">
												<uv-button
													text="仓库发料"
													shape="circle"
													color="#6086fc"
													plain
													:customStyle="footerBtn"
													@click="tapDetail(item)"
												></uv-button>
											</view>
										</template>
										<view class="footer-btn mr-0" v-if="checkBtn(['sto:getsup:detail'])">
											<uv-button
												text="详情"
												shape="circle"
												color="#6086fc"
												:customStyle="footerBtn"
												@click="tapDetail(item)"
											></uv-button>
										</view>
									</view>
								</template>
							</wlist-item>
						</uv-swipe-action-item>
						<gray-gap></gray-gap>
					</template>
				</uv-swipe-action>
			</view>
		</mescroll-body>
		<uv-popup ref="popup" mode="bottom" @close="approveLogClose" :round="10" closeable>
			<wapprove-list headerIcon></wapprove-list>
			<view class="close-btn">
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
		<uv-modal
			ref="passModal"
			title="请输入通过内容"
			showCancelButton
			:closeOnClickOverlay="false"
			asyncClose
			@confirm="passConfirm"
		>
			<uv-textarea v-model="approve_note" count placeholder="请输入内容"></uv-textarea>
		</uv-modal>
		<uv-toast ref="toast"></uv-toast>
	</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import ListMixin from "@/mixin/list_mixin.js";
import { checkAssocType as checkAssocTypeFn } from "../index.js";
import {
	getGetSupListApi,
	submitGetSupApi,
	recallGetSupApi,
	voidGetSupApi,
	delGetSupApi,
	rejectGetSupApi,
	approveGetSupApi,
} from "@/api/modules/getSupplier.js";
import { hasPerm } from "@/utils/auth.js";
export default {
	mixins: [MescrollMixin, ListMixin], // 使用mixin
	// 这里存放数据
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
			statusList: [
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
					label: "已审批",
					value: 7,
				},
				{
					label: "待领料",
					value: 8,
				},
				{
					label: "待确认",
					value: 10,
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
			approve_note: "同意", //审批通过时的内容 默认 同意
			pass_id: 0,
		};
	},

	// 生命周期 - 监听页面加载
	onLoad(options) {
		console.log("options", options.status);
		this.searchQuery.status = options.status;
	},
	// 生命周期 - 监听页面显示
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	// 方法集合
	methods: {
		checkBtn(sign) {
			return hasPerm(sign);
		},
		checkAssocType(assocType, query) {
			return checkAssocTypeFn(assocType, query);
		},
		// 上拉加载
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				...this.searchQuery,
			};
			try {
				const result = await getGetSupListApi(data);
				console.log("领料出库单列表页", result);
				let res = result.data;
				const total = res.total;
				console.log("total", total);
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
		// 触发去详情
		tapDetail(e) {
			let checkDetail = this.checkBtn(["sto:getsup:detail"]);
			console.log("checkDetail", checkDetail);
			if (!checkDetail) {
				wx.showModal({
					title: "温馨提示",
					content: "很抱歉,您没有操作权限!",
					showCancel: false,
					confirmText: "我知道了",
				});
				return;
			}

			console.log("e", e);
			let id = e.id;
			uni.navigateTo({
				url: `/pages/warehouseModule/getSupplier/detail/detail?order_id=${id}`,
			});
		},
		// 触发提交审核
		async tapSubmit(e) {
			let id = e.id;
			// uni.$uv.toast("点击提审,id:" + id);

			const result = await submitGetSupApi({ id });
			this.showToastRefresh(result.msg);
		},
		// 触发点击作废
		tapVoid(item) {
			let { id, wh_rec_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要作废【${wh_rec_no}】领料出库单吗?`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await voidGetSupApi({ id });
						this.showToastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		// 点击编辑
		tapEdite(item) {
			let { id } = item;
			console.log("id", id);
			uni.navigateTo({
				url: `../add/add?id=${id}`,
			});
		},
		// 触发点击撤回
		async tapRecall(e) {
			let id = e.id;
			const result = await recallGetSupApi({ id });
			this.showToastRefresh(result.msg);
		},
		// 触发点击通过
		tapApprove(e) {
			let id = e.id;
			this.pass_id = id;
			this.$refs.passModal.open();
		},
		async passConfirm() {
			let data = {
				approve_note: this.approve_note,
				id: this.pass_id,
			};
			const result = await approveGetSupApi(data);
			this.$refs.passModal.close();
			this.approve_note = "同意";
			this.pass_id = 0;
			this.showToastRefresh(result.msg);
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
			const result = await rejectGetSupApi(data);
			this.$refs.modal.close();
			this.rejectValue = "";
			this.rejectId = 0;
			this.showToastRefresh(result.msg);
		},
		// 滑动单元格点击
		handleAction(name, item) {
			console.log("item", item);
			let { id, wh_rec_no } = item;
			uni.showModal({
				title: "温馨提示",
				content: `您确定要删除【${wh_rec_no}】的领料出库单吗`,
				success: async (res) => {
					if (res.confirm) {
						console.log("用户点击确定");
						let result = await delGetSupApi({ id });
						this.showToastRefresh(result.msg);
					} else if (res.cancel) {
						console.log("用户点击取消");
					}
				},
			});
		},
		/**@example 显示消息提示框并且刷新列表
		 * @param {String} msg 传入接口返回的消息,默认空字符串
		 * @param {Number} duration 提示的延迟时间 默认2000
		 * @param {String} type 提示的类型 默认 success
		 */
		showToastRefresh(msg = "", duration = 2000, type = "success") {
			this.$refs.toast.show({
				type,
				message: msg,
				duration,
			});
			this.mescroll.resetUpScroll(false);
		},
	},
	// 计算属性
	computed: {
		/* uv-button的样式 */
		footerBtn() {
			return {
				width: "180rpx",
				height: "70rpx",
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
.flex-wrap {
	flex-wrap: wrap;
	justify-content: flex-end;
}
.footer-btn {
	width: 180rpx;
	height: 60rpx;
	margin-right: 40rpx;
	margin-bottom: 20rpx;
	&.mr-0 {
		margin-right: 0;
	}
	&:last-child {
		// margin-right: 0;
	}
}
/* 浮动按钮 */
.movable-area {
	position: fixed;
	top: 380rpx;
	left: 0;
	width: 100%;
	height: 70vh;
	pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
	z-index: 99;
	.movable-view {
		pointer-events: auto; //可以点击
		width: 72rpx;
		height: 72rpx;

		.add-img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
