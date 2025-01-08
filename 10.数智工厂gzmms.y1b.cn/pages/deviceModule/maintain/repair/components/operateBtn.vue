<template>
	<view class="footer-btn">
		<block v-if="operateType == 3">
			<view class="footer-btn-item">
				<uv-button text="返回" plain @click="onBack"></uv-button>
			</view>
			<template v-if="checkAssocType(info.assoc_type, 1) && info.status != 2">
				<block v-if="[0, 3, 4].includes(info.status)">
					<view class="footer-btn-item" v-if="isShowSubmitBtn">
						<uv-button text="提交验收" type="primary" @click="onSubmit"></uv-button>
					</view>
					<view class="footer-btn-item" v-if="isShowVoidBtn">
						<uv-button text="作废" type="warning" @click="cancelHandle"></uv-button>
					</view>
				</block>
				<view class="footer-btn-item" v-if="info.status == 1 && isShowRecallBtn">
					<uv-button text="撤回" type="warning" @click="revokeHandle"></uv-button>
				</view>
				<view class="footer-btn-item" v-if="info.status == 5 && isShowDelBtn">
					<uv-button text="删除" type="error" @click="deleteHandle"></uv-button>
				</view>
			</template>
			<template v-if="checkAssocType(info.assoc_type, 2) && info.status == 1">
				<view class="footer-btn-item" v-if="isShowApproveBtn">
					<uv-button text="通过" type="success" @click="passHandle"></uv-button>
				</view>
				<view class="footer-btn-item" v-if="isShowRejectBtn">
					<uv-button text="驳回" type="warning" @click="rejectHandle"></uv-button>
				</view>
			</template>
		</block>
		<block v-else>
			<view class="footer-btn-item">
				<uv-button text="确定保存" plain type="primary" @click="onSave"></uv-button>
			</view>
			<view class="footer-btn-item" v-if="isShowSubmitBtn">
				<uv-button text="提交验收" type="primary" @click="onSubmit" :disabled="disabled"></uv-button>
			</view>
		</block>
	</view>
</template>
<script>
import { checkAssocType, checkBtn } from '@/utils/auth.js';
import { cancelRequest, deleteRequest, passRequest, rejectRequest, revokeRequest } from '../index';
export default {
	props: {
		operateType: {
			type: Number,
			default: 1
		},
		info: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
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
	data() {
		return {};
	},
	methods: {
		checkAssocType,
		onBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		onBackRedirectTo() {
			uni.redirectTo({
				url: "./list",
			});
		},
		onSave() {
			this.$emit("save");
		},
		onSubmit() {
			this.$emit("submit");
		},
		// 作废
		async cancelHandle() {
			await cancelRequest(this.info);
			this.onBackRedirectTo();
		},
		// 撤回
		async revokeHandle() {
			await revokeRequest(this.info);
			this.onBackRedirectTo();
		},
		// 通过
		async passHandle() {
			await passRequest(this.info);
			this.onBackRedirectTo();
		},
		// 删除
		async deleteHandle() {
			await deleteRequest(this.info);
			this.onBackRedirectTo();
		},
		// 驳回
		async rejectHandle() {
			await rejectRequest(this.info);
			this.onBackRedirectTo();
		}
	},
};
</script>
<style lang="scss">
.footer-btn {
	position: fixed;
	z-index: 199;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: center;
	padding: 4rpx 20rpx 0rpx 20rpx;
	padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
	&-item {
		flex: 1;
		&:not(first-child) {
			margin-left: 40rpx;
		}
	}
}
</style>
