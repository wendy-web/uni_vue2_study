<template>
	<view class="container">
		<mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
			<view class="list">
				<view class="item" v-for="(item, index) in dataList" :key="index" @click="handleToTarget(item)">
					<view class="item-title">{{ documentTitle(item.operate_type) }}</view>
					<view class="item-status warning" v-if="item.operate_type == 0">待审批</view>
					<view class="item-status primary" v-else-if="item.operate_type == 1 || item.operate_type == 2">待处理</view>
					<view class="item-status success" v-else>我发起</view>
					<view class="item-content">
						<view class="sub-item">
							<text class="sub-item-left">单据类型：</text>
							<text>{{ documentType(item.document_type) || item.document_type_name}}</text>
						</view>
						<view class="sub-item">
							<text class="sub-item-left">单号：</text>
							<text>{{ item[documentNo(item.document_type)] || item.order_no }}</text>
						</view>
						<view class="sub-item">
							<text class="sub-item-left">制单人：</text>
							<text>{{ item.create_name || item.ct_name }}</text>
						</view>
						<view class="sub-item">
							<text class="sub-item-left">创建时间：</text>
							<text>{{ item.create_time }}</text>
						</view>
						<template v-if="item.document_type == 5">
							<view class="sub-item">
								<text class="sub-item-left">仓库：</text>
								<text>{{ item.warehouse }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-left">领料申请人：</text>
								<text>{{ item.rp_names }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-left">指定领取人：</text>
								<text>{{ item.ar_names }}</text>
							</view>
						</template>
            			<!-- 如果是物料系统 显示商品信息 -->
						<view class="sub-item" v-if="moduleType == 0">
							<text class="sub-item-left">商品信息：</text>
							<text>{{ item.goods_details }}</text>
						</view>
						<template v-else>
							<view class="sub-item">
								<text class="sub-item-left">资产名称：</text>
								<text>{{ item.goods_details }}</text>
							</view>
							<view class="sub-item">
								<text class="sub-item-left">使用部门：</text>
								<text>{{ item.use_dept_names || '--'}}</text>
							</view>
							<template v-if="item.document_type == 14">
								<!-- 如果是维修单显示以下信息 -->
								<view class="sub-item">
									<text class="sub-item-left">维修负责人：</text>
									<text>{{ item.repair_names || '--' }}</text>
								</view>
								<view class="sub-item">
									<text class="sub-item-left">其他维修人：</text>
									<text>{{ item.other_repair_names || '--' }}</text>
								</view>
							</template>
							<template v-else-if="item.document_type == 15">
								<!-- 如果是保养工单显示以下信息 -->
								<view class="sub-item">
									<text class="sub-item-left">保养负责人：</text>
									<text>{{ item.director_names || '--' }}</text>
								</view>
								<view class="sub-item">
									<text class="sub-item-left">其他保养人：</text>
									<text>{{ item.other_names || "--" }}</text>
								</view>
							</template>
							<template v-else-if="item.document_type == 16">
								<!-- 如果是点巡检记录,显示以下信息 -->
								<view class="sub-item">
									<text class="sub-item-left">执行人：</text>
									<text>{{ item.executor_names || "--" }}</text>
								</view>
							</template>
						</template>
						<view class="lookBtn">
							<view hover-class="icon-hover" class="lookBtn-text">点击查看单据详情</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
import { getBacklogApi } from "@/api/modules/home.js";
import myMixin from "@/mixin/index.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { mapGetters } from "vuex";
import { documentDetailMap, documentKeyMap, documentTypeMap } from "../index.js";
export default {
	mixins: [MescrollMixin, myMixin],
	data() {
		return {
			dataList: [],
			upOption: {
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 15, // 每页数据的数量
					time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 10, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				textLoading: "加载中 ...", // 加载中的提示文本
				textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
				stat_type: 0,
			},
		};
	},
	computed: {
		...mapGetters(["moduleType"]),
	},
	onLoad(options) {
		this.stat_type = options.stat_type;
	},
	methods: {
		// 上拉加载
		async upCallback(page) {
			let data = {
				page: page.num,
				size: page.size,
				type: 1,
				stat_type: this.stat_type,
			};
			try {
				const result = await getBacklogApi(data);
				const total = result.data.total;
				// console.log("total", total);
				const res = result.data;
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				this.mescroll.endBySize(res.list.length, total); //必传参数(当前页的数据个数, 总数据量)
				//设置列表数据
				if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
				this.dataList = this.dataList.concat(res.list); //追加新数据
			} catch (e) {
				console.log("错误", e);
				//TODO handle the exception
				//联网失败, 结束加载
				this.mescroll.endErr();
			}
		},
		/** 跳转到目标页面 */
		handleToTarget(item) {
			this.toTarget(item);
			let msgTemplateId = this.msgTemplateId;
			wx.requestSubscribeMessage({
				tmplIds: [msgTemplateId],
				success: (res) => {
					console.log("res", res);
				},
				fail: (err) => {},
			});
		},
		toTarget(item) {
			const { document_type, status, document_id } = item;
			const link = documentDetailMap.get(document_type);
			// if (document_type === 5) {
			// 	uni.navigateTo({
			// 		url: link + `?order_id=${document_id}`,
			// 	});
			// } else {
			// 	uni.navigateTo({
			// 		url: link + `?id=${document_id}`,
			// 	});
			// }
			uni.navigateTo({
				url: link + `?id=${document_id}&status=${status}`,
			});
		},

		documentType(type) {
			return documentTypeMap.get(type);
		},
		documentNo(type) {
			return documentKeyMap.get(type);
		},
		documentTitle(status) {
			switch (status) {
				case 0:
					return "待审批提醒";
				case 1:
					return "待仓库确认提醒";
				case 2:
					return "待确认领料提醒";
				case 3:
					return "我发起";
				default:
					return "";
			}
		},
	},
};
</script>

<style lang="scss">
page {
	background-color: #f5f5f5;
}
$primary: #3c9cff;
$warning: #f9ae3d;
$success: #5ac725;

.warning {
	background-color: $warning;
}
.primary {
	background-color: $primary;
}
.success {
	background-color: $success;
}

.icon-hover {
	color: #fff;
	background-color: #3c9cff60;
	padding: 6rpx 8rpx;
	border-radius: 4rpx;
	font-size: 28rpx;
}

.container {
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	.list {
		.item {
			background-color: #fff;
			padding: 20rpx;
			padding-bottom: 0;
			position: relative;
			margin-bottom: 20rpx;
			.item-title {
				font-weight: bold;
				margin-bottom: 10rpx;
			}
			.item-status {
				position: absolute;
				top: 0;
				right: 0;
				width: 140rpx;
				height: 60rpx;
				// background-color: slateblue;
				color: #fff;
				text-align: center;
				line-height: 60rpx;
				font-size: 26rpx;
				box-shadow: -2px 2px 0 0 #bccbff80;
			}
			.sub-item {
				font-size: 28rpx;
				margin-bottom: 10rpx;
				&-left {
					color: #767a82;
					display: inline-block;
					width: 180rpx;
				}
			}
			.lookBtn {
				border-top: 2rpx solid #e5e5e5;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				color: #3c9cff;
				.lookBtn-text {
					position: relative;
					font-size: 28rpx;
				}
			}
		}
	}
}
</style>
