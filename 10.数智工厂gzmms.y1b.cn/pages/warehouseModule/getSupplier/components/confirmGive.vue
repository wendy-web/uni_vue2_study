<template>
	<uv-popup
		ref="popup"
		mode="right"
		:overlay="false"
		duration="0"
		custom-style="width: 100vw;height:100vh;background-color:#f6f6f6;overflow:auto"
	>
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="仓库发料"
			:border="false"
			fixed
			left-icon="left"
			@clickLeft="close"
		/>
		<view class="give-list">
			<view class="list-header">
				<image
					src="https://file.y1b.cn/public/erpxcx_img/common/goods_titleicon@2x.png"
					class="list-header-img"
				></image>
				<text>物料明细</text>
			</view>
			<view class="give-item" v-for="(item, index) in goods" :key="index">
				<view class="item-header">
					<view class="item-header-left">{{ item.warehouse_name }}</view>
					<view class="item-header-right">{{ item.ws_code }}</view>
				</view>
				<view class="item-title">
					<text>{{ item.title }}</text>
				</view>
				<view class="item-barcode">
					<text>{{ item.barcode }}</text>
				</view>
				<view class="item-others">
					<view class="item-others-item" v-if="item.brank">{{ item.brank }}</view>
					<view class="item-others-item" v-if="item.spec">{{ item.spec }}</view>
				</view>
				<view class="item-place">
					<text>使用地点：</text>
					<text>{{ item.use_places || "无" }}</text>
				</view>
				<view class="item-flex">
					<view class="flex-box">
						<text>入库日期：</text>
						<text>{{ item.in_wh_date }}</text>
					</view>
					<view class="flex-box">
						<text>批次/日期：</text>
						<text>{{ item.ph_no }}</text>
					</view>
				</view>
				<view class="item-flex">
					<view class="flex-box">
						<text>申请数：</text>
						<text class="blue">{{ item.rec_num }}</text>
					</view>
					<view class="flex-box">
						<text>已发数：</text>
						<text class="green">{{ item.issue_num }}</text>
					</view>
				</view>
				<view class="item-num">
					<text>本次发料</text>
					<view class="">
						<uv-number-box
							color="#2979ff"
							iconStyle="color: #2979ff"
							inputWidth="56"
							:min="item.rec_num - item.issue_num == 0 ? 0 : 1"
							:max="item.rec_num - item.issue_num"
							integer
							v-model="item.this_num"
							:disabled="item.is_have_unique"
							:showMinus="!item.is_have_unique"
							:showPlus="!item.is_have_unique"
						></uv-number-box>
						<view class="apply-detail" @click.stop="lookUnique(item.unique_label_detail, index)">申请明细</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer-btn">
			<view class="footer-btn-item">
				<uv-button
					:loading="btnLoading"
					text="确认发料"
					type="primary"
					:custom-style="{ borderRadius: '10rpx' }"
					@click="onConfirm"
				></uv-button>
			</view>
		</view>
		<uv-toast ref="giveToast"></uv-toast>
		<uniqueCode ref="uniqueCodeRef" @confirm="onUniqueConfirm"></uniqueCode>
	</uv-popup>
</template>

<script>
import { approveGetSupWhApi } from "@/api/modules/getSupplier.js";
import uniqueCode from "./uniqueCode.vue";
export default {
	components: {
		uniqueCode,
	},
	props: {
		goods: {
			type: Array,
			default: () => [],
		},
		order_id: {
			type: Number,
			default: 0,
		},
	},
	// 这里存放数据
	data() {
		return {
			btnLoading: false,
			giveStatus: false,
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		lookUnique(unique_label_detail, index) {
			this.$refs.uniqueCodeRef.open(unique_label_detail);
		},
		open() {
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
			this.$emit("close");
		},
		async onConfirm() {
			let goods = this.goods.map((item) => {
				return {
					id: item.id,
					material_issue_num: item.this_num,
					goods_id: item.goods_id,
					goods_all_id: item.goods_all_id,
				};
			});
			try {
				this.btnLoading = true;
				const result = await approveGetSupWhApi({ id: this.order_id, goods });
				this.$refs.giveToast.show({
					type: "success",
					message: result.msg,
					duration: 1500,
				});
				setTimeout(() => {
					this.close();
					this.$emit("confirm");
				}, 1500);
			} finally {
				this.btnLoading = false;
			}
		},
	},
};
</script>
<style lang="scss">
.give-list {
	background-color: #fff;
	padding: 0 20rpx;
	padding-bottom: 20rpx;
	margin-bottom: 20rpx;
	.list-header {
		height: 104rpx;
		display: flex;
		align-items: center;
		padding-left: 20rpx;
		font-size: 32rpx;
		font-weight: bold;
		background-color: #fff;
		&-img {
			width: 40rpx;
			height: 40rpx;
			margin-right: 16rpx;
		}
	}
	.give-item {
		padding: 20rpx;
		font-size: 28rpx;
		background-color: #fcfdff;
		margin-bottom: 10rpx;
		border: 1rpx solid #bccbff;
		border-radius: 20rpx;
		.item-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 10rpx;
			/* 仓库名称的样式 */
			&-left {
				font-weight: bold;
				color: #688bf2;
			}
		}
		.item-title {
			font-weight: bold;
			max-width: 600rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			margin-bottom: 10rpx;
		}
		.item-barcode {
			color: #767a82;
			margin-bottom: 10rpx;
		}
		.item-others {
			display: flex;
			margin-bottom: 10rpx;
			&-item {
				background-color: #ecf0ff;
				max-width: 280rpx;
				height: 48rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				border-radius: 10rpx;
				line-height: 48rpx;
				text-align: center;
				font-size: 28rpx;
				color: #707072;
				padding: 0 20rpx;
				margin-right: 20rpx;

				&:last-child {
					margin-right: 0;
				}
			}
		}
		.item-place {
			color: #767a82;
			margin-bottom: 10rpx;
		}
		.item-flex {
			margin-bottom: 10rpx;
			display: flex;
			justify-content: space-between;
			.flex-box {
				flex: 1;
				flex-shrink: 0;
				color: #767a82;
				.blue {
					color: #688bf2;
					font-weight: bold;
				}
				.green {
					color: #53c21d;
					font-weight: bold;
				}
			}
		}
		.item-num {
			display: flex;
			justify-content: space-between;
			border-top: 2rpx solid #e5e5e5;
			padding-top: 20rpx;
			.apply-detail {
				color: #3c9cff;
				text-align: center;
				margin-top: 6rpx;
			}
		}
	}
}
.footer-btn {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	padding-top: 4rpx;
	padding: 4rpx 40rpx 0rpx 40rpx;
	&-item {
		flex: 1;
	}
}
</style>
