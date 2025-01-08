<template>
	<view class="btn-wrapper">
		<!-- 当前为创建人 -->
		<template v-if="checkAssocTypeFn(1)">
			<!-- 待提审,已撤回,已驳回状态时 -->
			<template v-if="info.status == 0 || info.status == 3 || info.status == 4">
				<view class="footer-btn" v-if="checkBtn('edit')">
					<uv-button
						text="编辑"
						shape="circle"
						color="#6086fc"
						plain
						:customStyle="footerBtn"
						@click="handleEdit"
					></uv-button>
				</view>
				<view class="footer-btn" v-if="checkBtn('submit')">
					<uv-button
						text="提交验收"
						shape="circle"
						color="#6086fc"
						:customStyle="footerBtn"
						@click="submitAudit"
						:disabled="disabledSubmit"
					></uv-button>
				</view>
			</template>
			<!-- 待审核状态时 -->
			<template v-if="info.status == 1">
				<view class="footer-btn" v-if="checkBtn('recall')">
					<uv-button text="撤回" shape="circle" :customStyle="footerBtn" @click="cellRecall"></uv-button>
				</view>
			</template>
		</template>
		<!-- 当前为审核人的时候 -->
		<template v-if="checkAssocTypeFn(2)">
			<!-- 待审核状态时 -->
			<template v-if="info.status == 1">
				<view class="footer-btn" v-if="checkBtn('approve')">
					<uv-button
						text="验收通过"
						shape="circle"
						color="#6086fc"
						:customStyle="footerBtn"
						@click="cellApprove"
						plain
					></uv-button>
				</view>
				<view class="footer-btn" v-if="checkBtn('reject')">
					<uv-button
						text="驳回返工"
						shape="circle"
						color="#f9ae3d"
						:customStyle="footerBtn"
						@click="cellReject"
						plain
					></uv-button>
				</view>
			</template>
		</template>
		<!-- 当前为整改人的时候 -->
		<template v-if="checkAssocTypeFn(6)">
			<!-- 待审核状态时 -->
			<template v-if="info.status == 0">
				<view class="footer-btn" v-if="checkBtn('edit')">
					<uv-button
						text="去整改"
						shape="circle"
						color="#6086fc"
						:customStyle="footerBtn"
						@click="cellRectify"
						plain
					></uv-button>
				</view>
			</template>
		</template>
		<view class="footer-btn">
			<uv-button text="详情" shape="circle" color="#6086fc" :customStyle="footerBtn" @click="toDetail"></uv-button>
		</view>
	</view>
</template>

<script>
import { hasPerm, deviceBtnPermsMap, checkAssocType } from "@/utils/auth.js";
export default {
	props: {
		type: {
			type: Number,
			default: 1,
		},
		info: {
			type: Object,
			// 对象或数组默认值必须从一个工厂函数获取
			default: function () {
				return {};
			},
		},
		disabledSubmit: {
			type: Boolean,
			default: false,
		},
	},
	// 这里存放数据
	data() {
		return {
			footerBtn: {
				width: "180rpx",
				height: "70rpx",
			},
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		checkBtn(signKey) {
			let mapObj = deviceBtnPermsMap.get(this.type);
			let signValue = mapObj ? mapObj[signKey] : [];
			return hasPerm(signValue);
		},

		/** 判断身份标识  */
		checkAssocTypeFn(checkNum) {
			let assoc_type = this.info.assoc_type;
			let result = false;
			if (Array.isArray(assoc_type)) {
				result = checkAssocType(assoc_type, checkNum);
			} else {
				result = assoc_type == checkNum ? true : false;
			}
			return result;
		},
		//点击编辑按钮
		handleEdit() {
			let { id } = this.info;
			this.$emit("tapEdit", { id });
		},
		// 点击撤回按钮
		cellRecall() {
			let { id } = this.info;
			this.$emit("tapRecall", { id });
		},
		//点击提审按钮
		submitAudit() {
			let { id } = this.info;
			this.$emit("tapSubmit", { id });
		},
		// 点击去整改
		cellRectify() {
			let { id } = this.info;
			this.$emit("tapRectify", { id });
		},
		// 点击详情
		toDetail() {
			let { id } = this.info;
			this.$emit("tapDetail", { id });
		},
		cellApprove() {
			let { id } = this.info;
			this.$emit("tapDetail", { id });
		},
		cellReject() {
			let { id } = this.info;
			this.$emit("tapDetail", { id });
		},
	},
};
</script>
<style lang="scss">
.btn-wrapper {
	width: 100%;
	display: flex;
	justify-content: flex-end;
	// padding: 30rpx;
	padding-bottom: 20rpx;
	border-top: 2rpx solid #f7f7f7;
	flex-wrap: wrap;
	justify-content: flex-end;
	.footer-btn {
		width: 180rpx;
		height: 60rpx;
		// margin-right: 40rpx;
		margin-bottom: 20rpx;
		&:not(first-child) {
			margin-left: 20rpx;
		}
	}
}
</style>
