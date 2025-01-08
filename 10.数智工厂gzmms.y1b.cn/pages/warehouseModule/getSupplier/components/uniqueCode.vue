<template>
	<uv-popup
		ref="popup"
		mode="right"
		customStyle="width:70vw;height:100vh;background-color:#f6f6f6;overflow:auto"
		:safeAreaInsetBottom="false"
	>
		<uni-nav-bar
			background-color="linear-gradient(to left, #DAE3FF, #ECF4FF, #E1E8FF); "
			status-bar
			title="标识明细"
			:border="false"
			fixed
		/>
		<view class="unique-wrapper">
			<!-- 	<uv-checkbox-group v-model="checkboxValue">
				<uv-checkbox
					:customStyle="{ marginBottom: '14px' }"
					v-for="(item, index) in checkboxList"
					:key="index"
					:label="item.unique_code"
					:name="item.unique_code"
				></uv-checkbox>
			</uv-checkbox-group> -->
			<view class="unique-list">
				<view class="unique-item" v-for="(item, index) in checkboxList">
					<text>{{ item.unique_code }}</text>
				</view>
			</view>
		</view>
		<!-- <view class="footer-btn">
			<view class="footer-btn-item">
				<uv-button
					:loading="btnLoading"
					text="取消"
					type="info"
					:custom-style="{ borderRadius: '10rpx' }"
					@click="close"
				></uv-button>
			</view>

			<view class="footer-btn-item">
				<uv-button
					:loading="btnLoading"
					text="确认选择"
					type="primary"
					:custom-style="{ borderRadius: '10rpx' }"
					@click="onConfirm"
				></uv-button>
			</view>
		</view> -->
	</uv-popup>
</template>

<script>
export default {
	props: {
		value: {
			type: String,
			default: "",
		},
	},
	// 这里存放数据
	data() {
		return {
			checkboxValue: [],
			checkboxList: [],
			btnLoading: false,
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		onConfirm() {
			this.$emit("confirm", this.checkboxValue);
		},
		open(data) {
			console.log("执行");
			this.checkboxList = data;
			this.checkboxValue = data.map((item) => item.unique_code);
			this.$refs.popup.open();
		},
		close() {
			this.$refs.popup.close();
		},
	},
};
</script>
<style lang="scss">
.unique-wrapper {
	padding: 40rpx 20rpx;
	padding-bottom: 140rpx;
	.unique-list{
		.unique-item{
			margin-bottom: 14rpx;
		}
	}
}
/* 底部按钮 */
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
		&:last-child {
			margin-left: 20rpx;
		}
	}
}
</style>
