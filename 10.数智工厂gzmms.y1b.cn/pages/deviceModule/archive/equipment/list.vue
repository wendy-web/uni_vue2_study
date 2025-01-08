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
					placeholder="登记编码/设备编码/条码/名称/品牌/型号"
				>
					<template v-slot:suffix>
						<uv-icon name="scan" size="30" @click.stop="handleScan"></uv-icon>
					</template>
				</uv-search>
				<wsearch-btn @reset="handleReset" color="#fff"></wsearch-btn>
			</view>
			<wdrop-type
				ref="dropMenuRef"
				@statusChange="handleStatus"
				@deptChange="handleDept"
				@deptTypeChange="handleTypeDept"
				:status-list="statusOptions"
				:filtrateList="filtrateList"
			></wdrop-type>
		</uv-sticky>
		<mescroll-body
			@init="mescrollInit"
			@down="downCallback"
			@up="upCallback"
			:up="upOption"
		>
			<view class="width-full all-p-lr-20">
				<view class="width-full contentBox position-r"
					v-for="(item, index) in dataList" :key="index"
					@click="toManage(item)"
				>
					<statusImgVue :status="item.status"></statusImgVue>
					<view class="width-full all-p-lr-30 all-p-tb-30 display_row_center" style="border-bottom: 2rpx solid #efefef">
						<text class="t-c-000018 f-s-32 t-w-bold">{{ item.bar_title }}</text>
					</view>
					<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
						<view class="width-full all-m-b-20 display_row_center">
							<text class="t-c-6F6F6F">设备编码：</text>
							<text class="t-c-272727">{{ item.asset_no }}</text>
						</view>
						<view class="width-full all-m-b-20 display_row_center">
							<text class="t-c-6F6F6F">设备型号：</text>
							<text class="t-c-272727">{{ item.spec || "--" }}</text>
						</view>
						<view class="width-full all-m-b-20 display_row_center">
							<text class="t-c-6F6F6F">使用部门：</text>
							<text class="t-c-272727">{{ item.use_dept_text }}</text>
						</view>
						<view class="width-full display_row_center">
							<text class="t-c-6F6F6F">使用位置：</text>
							<text class="t-c-272727">{{ item.save_addr_text }}</text>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { getEquipmentListApi } from "@/api/device/archive/equipment.js";
import wdropType from "@/components/wdrop-menu/wdrop-type.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { deviceScan } from "@/utils/device.js";
import { mapActions, mapGetters } from "vuex";
import statusImgVue from "./components/statusImg.vue";
export default {
	mixins: [MescrollMixin],
	components: {
		statusImgVue,
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
			filtrateList: [
				{
					label: "类型",
					value: 2,
				},
				{
					label: "状态",
					value: 3,
				},
				{
					label: "部门",
					value: 4,
				}
			],
			canReset: false,
			scrollTopNum: 0
		};
	},
	computed: {
		...mapGetters(['eqipmentStatus']),
		statusOptions(){
			if(!this.eqipmentStatus) return [];
			return this.eqipmentStatus.map(res => ({ label: res.name, status: res.id}))
		}
	},
	onLoad(options) {
		if(!this.eqipmentStatus) this.initGetEqBaseSelect();
	},
	onShow() {
		this.canReset && this.mescroll.resetUpScroll(); // 重置列表数据为第一页
		this.canReset && this.mescroll.scrollTo(0, 0); // 重置列表数据为第一页时,建议把滚动条也重置到顶部,避免无法再次翻页的问题
		this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
		// if(this.canReset) {
		// 	this.mescroll.resetUpScroll();
		// 	setTimeout(() => {
		// 		this.mescroll.scrollTo(this.scrollTopNum, 0);
		// 	}, 500);
		// }
		// this.canReset = true; // 过滤第一次的onShow事件,避免初始化界面时重复触发upCallback, 无需配置auto:false
	},
	methods: {
		...mapActions({
			initGetEqBaseSelect: "device/initGetEqBaseSelect"
		}),
		async handleScan() {
			const scanResult = await deviceScan();
			console.log("scanResult", scanResult);
			this.searchQuery.keyword = scanResult;
			this.handleSearch();
		},
		// 子组件触发部门选择
		handleDept(e) {
			// console.log("e", e);
			this.searchQuery.use_dept_id = e.dept_id;
			console.log("this.searchQuery", this.searchQuery.use_dept_id);
			/* 调起list列表页面自身的handleSearch方法 */
			this.handleSearch();
		},
		handleTypeDept(e) {
			this.searchQuery.equipment_type = e.dept_type_id;
			this.handleSearch();
		},
		handleStatus(e) {
			this.searchQuery.status = e.status;
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
				const result = await getEquipmentListApi(data);
				console.log("固资管理列表页", result);
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
		// 点击搜索触发
		handleSearch() {
			this.mescroll.scrollTo(0);
			this.mescroll.resetUpScroll(false);
		},
		// 点击重置
		handleReset() {
			this.searchQuery = {
				keyword: undefined,
			};
			this.$refs.dropMenuRef.reset();
			this.handleSearch();
		},
		toManage(row) {
			uni.navigateTo({
				url: `./manage?id=${row.id}`,
				success: (res) => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("detailData", row);
				},
			});
		},
		onPageScroll(event) {
			const scrollTopNum = Math.ceil(event.scrollTop);
			this.scrollTopNum = scrollTopNum;
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
	&:not(:last-child) {
      margin-bottom: 30rpx;
    }
}
</style>
