<template>
	<view class="approve-list">
		<view class="approve-header" :class="[!headerIcon ? '' : 'align-center']">
			<image src="https://file.y1b.cn/public/erpxcx_img/common/log_icon@2x.png" class="approve-icon" v-if="!headerIcon"></image>
			<text>审批日志</text>
		</view>
		<uv-steps direction="column" activeIcon="checkmark-circle-fill" inactiveIcon="more-circle">
			<!-- copy了一份uv-steps-item组件,新增了props属性:right-title,right-desc,success,以及它们的样式 -->

			<!-- <uv-steps-item-copy title="天天采购" right-title="天天仓库" desc="提交" right-desc="2022-06-23 12:45:26"></uv-steps-item-copy> -->
			<!-- <uv-steps-item-copy title="采购经理" desc="10:35"></uv-steps-item-copy> -->
			<!-- <uv-steps-item-copy title="制定审批人:财务审计" desc="待审批"></uv-steps-item-copy> -->
			<template v-for="(item, index) in list">
				<uv-steps-item-copy
					:title="item.user.name"
					:desc="item.operation_type"
					:key="item.id"
					:success="success(item.operation_id)"
				></uv-steps-item-copy>
			</template>
		</uv-steps>
		<!-- <view class="reject-content">
			<text>驳回内容内容内容内容内容内容内容驳回内容内容内容内容内容内容内容驳回内容内容内容内容内容内容内容</text>
		</view> -->
	</view>
</template>

<script>
/** 本组件为审批日志列表组件 */
export default {
	props: {
		headerIcon: {
			type: Boolean,
			default: false, //是否显示headerIcon,显示则文本左对齐,不显示则居中
		},
		info: {
			type: Array,
			default: () => [],
		},
	},
	// 这里存放数据
	data() {
		return {
			list: [],
		};
	},
	// 方法集合
	methods: {
		success(operation_id) {
			console.log("operation_id", operation_id);
			const successArr = [1, 3, 8, 12];
			const errArr = [4, 5, 9];
			if (successArr.includes(operation_id)) {
				return true;
			} else {
				return false;
			}
		},
	},
	// 计算属性
	computed: {},
	watch: {
		info: {
			immediate: true, //初始化时让handler调用一下
			handler(newValue, oldValue) {
				this.list = newValue;
			},
		},
	},
};
</script>
<style lang="scss">
.approve-list {
	background-color: #fff;
	padding: 30rpx 40rpx;
	.approve-header {
		font-weight: bold;
		margin-bottom: 50rpx;
		.approve-icon {
			width: 40rpx;
			height: 40rpx;
			vertical-align: middle;
			margin-right: 8rpx;
		}
		text {
			vertical-align: middle;
		}
		&.align-center {
			text-align: center;
		}
	}
	.reject-content {
		background-color: #f6f6f6;
		border-radius: 10rpx;
		font-size: 24rpx;
		color: #6f6f6f;
		padding: 10rpx 20rpx;
	}
}
</style>
