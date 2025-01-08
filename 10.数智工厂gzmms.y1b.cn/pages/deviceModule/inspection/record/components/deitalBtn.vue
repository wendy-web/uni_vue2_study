<template>
	<view class="footer-btn">
		<view class="footer-btn-item">
			<uv-button text="返回" @click="onCancel"></uv-button>
		</view>
		<template v-if="!loading">
			<!-- 当前为创建人 -->
			<template v-if="checkAssocTypeFn(1)">
				<!-- 待提审,已撤回,已驳回状态时 -->
				<template v-if="status == 0 || status == 3 || status == 4">
					<view class="footer-btn-item" v-if="checkBtn('submit')">
						<uv-button text="提交验收" type="primary" @click="onSubmit" :disabled="disabled"></uv-button>
					</view>
				</template>
				<!-- 待审核状态时 -->
				<template v-if="status == 1">
					<view class="footer-btn-item" v-if="checkBtn('recall')">
						<uv-button text="撤回" @click="onRecall"></uv-button>
					</view>
				</template>
			</template>
			<!-- 当前为审核人的时候 -->
			<template v-if="checkAssocTypeFn(2)">
				<!-- 待审核状态时 -->
				<template v-if="status == 1">
					<view class="footer-btn-item" v-if="checkBtn('approve')">
						<uv-button text="验收通过" type="primary" @click="onApprove"></uv-button>
					</view>
					<view class="footer-btn-item" v-if="checkBtn('reject')">
						<uv-button type="warning" plain text="驳回返工" @click="onReject"></uv-button>
					</view>
				</template>
			</template>
		</template>
	</view>
</template>

<script>
import { checkAssocType, deviceBtnPermsMap, hasPerm } from "@/utils/auth.js";
export default {
	props: {
		loading: {
			type: Boolean,
			default: false,
		},
		type: {
			type: Number,
			default: 1,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		status: {
			type: Number,
			default: 0,
		},
		assoc_type: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},
	data() {
		return {};
	},
	mounted() {},
	methods: {
		checkBtn(signKey) {
			let mapObj = deviceBtnPermsMap.get(this.type);
			let signValue = mapObj ? mapObj[signKey] : [];
			return hasPerm(signValue);
		},

		/** 判断身份标识  */
		checkAssocTypeFn(checkNum) {
			let assoc_type = this.assoc_type;
			console.log("assoc_type", assoc_type);
			let result = false;
			if (Array.isArray(assoc_type)) {
				result = checkAssocType(assoc_type, checkNum);
			} else {
				result = assoc_type == checkNum ? true : false;
			}
			return result;
		},
		onCancel() {
			uni.navigateBack();
		},
		onSubmit() {
			this.$emit("submit");
		},
		onRecall() {
			this.$emit("recall");
		},
		onApprove() {
			this.$emit("approve");
		},
		onReject() {
			this.$emit("reject");
		},
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
