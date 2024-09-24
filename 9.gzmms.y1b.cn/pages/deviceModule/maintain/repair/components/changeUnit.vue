<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-t-30 display_row_center">
			<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
			<text class="title-label all-m-l-10 t-c-000018 t-w-bold f-s-32">更换备件</text>
		</view>
		<view class="width-full all-p-lr-40 all-m-t-20 all-p-b-30">
			<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
				<uv-form-item label="是否更换备件:" label-width="120" required>
					<uv-radio-group
						v-model="is_replace"
						size="16"
						iconSize="16"
						labelSize="18"
						:disabled="disabled"
						@change="isReportChange"
					>
						<uv-radio
							:customStyle="{
								margin: '8px',
							}"
							v-for="(item, index) in list"
							:key="index"
							:label="item.label"
							:name="item.value"
						></uv-radio>
					</uv-radio-group>
				</uv-form-item>
			</uv-form>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		isReplace: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			is_replace: 0, // 是否更换备件
			list: [
				{
					label: "否",
					value: 0,
				},
				{
					label: "是",
					value: 1,
				},
			],
		};
	},
	watch: {
		isReplace: {
			immediate: true,
			handler(newVal) {
				this.is_replace = newVal;
			},
		},
	},
	methods: {
		isReportChange(val) {
			this.is_replace = val;
			this.$emit("changeReport", val);
		}
	},
};
</script>
<style lang="scss"></style>
