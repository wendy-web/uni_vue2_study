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
		</uv-sticky>
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="width-full all-p-tb-30 all-p-lr-20">
				<view
					v-for="(item, index) in dataList"
					:key="index"
					class="width-full contentBox position-r all-m-b-30"
					@click="toManage(item)"
				>
					<statusImgVue :status="item.status"></statusImgVue>
					<!-- 正常状态图片 -->
					<!-- <image v-if="item.status == 1" class="statusImg position-a" src="/static/otherImg/equipmentImg0.png"></image> -->
					<!-- 停用状态图片 -->
					<!-- <image v-if="item.status == 0" class="statusImg position-a" src="/static/otherImg/equipmentImg3.png"></image> -->
					<!-- 报废状态图片 -->
					<!-- <image v-if="item.status == 4" class="statusImg position-a" src="/static/otherImg/equipmentImg4.png"></image> -->
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
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getEquipmentListApi } from "@/api/device/archive/equipment.js";
import statusImgVue from "./components/statusImg.vue";
import { deviceScan } from "@/utils/device.js";
export default {
	mixins: [MescrollMixin], // 使用mixin
	components: {
		statusImgVue,
	},
	// 这里存放数据
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
	onLoad(options) {},
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
		toManage(row) {
			uni.navigateTo({
				url: `./manage?id=${row.id}`,
				success: (res) => {
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("detailData", row);
				},
			});
		},
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

	// .statusImg {
	// 	width: 110rpx;
	// 	height: 110rpx;
	// 	right: 0;
	// 	top: 0;
	// 	z-index: 1;
	// }
}
</style>
