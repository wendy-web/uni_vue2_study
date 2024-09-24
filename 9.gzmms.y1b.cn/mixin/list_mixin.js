/**
 * @example list列表页面通用的数据和方法,使用的页面有[采购列表,采购退货列表,采购换货列表] 
 */

const listMixin = {
	data() {
		return {
			searchQuery: {
				dept_id: undefined, //部门id
				start_time: undefined, //开始日期
				end_time: undefined, // 结束日期
				keyword: undefined,
				status: undefined, //
			},
			approveLogList: [], //审批日志列表数据
			approveShow: false,
			rejectValue: "", //驳回原因内容
			rejectId: 0, //驳回id
		}
	},
	methods: {
		// 点击回退到上一页面
		back() {
			let currentPages = getCurrentPages();
			if (currentPages.length === 1) {
				uni.switchTab({
					url: "/pages/tabBar/home/index"
				})
				return
			}
			uni.navigateBack({
				delta: 1,
			});
		},
		// 关闭状态栏
		closeStatus() {
			this.$refs.dropMenuRef.closeStatus();
		},
		// 点击重置
		handleReset() {
			console.log("点击重置")
			this.searchQuery = {
				dept_id: undefined, //部门id
				start_time: undefined, //开始日期
				end_time: undefined, // 结束日期
				keyword: undefined,
				status: undefined, //
			};
			this.$refs.dropMenuRef.reset();
			this.handleSearch();
		},
		// 子组件触发状态选择
		handleStatus(e) {
			this.searchQuery.status = e.status;
			this.handleSearch();
		},
		// 子组件触发日期选择
		handleDate(e) {
			this.searchQuery.start_time = e.start_time;
			this.searchQuery.end_time = e.end_time;
			this.handleSearch();
		},
		// 子组件触发部门选择
		handleDept(e) {
			console.log("e", e);
			this.searchQuery.dept_id = e.dept_id;
			console.log("this.searchQuery", this.searchQuery.dept_id);
			/* 调起list列表页面自身的handleSearch方法 */
			this.handleSearch();
		},

		// 审批弹窗打开关闭时
		popupChange() {
			this.approveShow = !this.approveShow;
		},
		// 关闭审批日志
		approveLogClose() {
			console.log("关闭执行");
			this.$refs.popup.close();
		},
	},

}

export default listMixin