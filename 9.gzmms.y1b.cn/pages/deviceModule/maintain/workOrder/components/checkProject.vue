<template>
<view class="width-full contentBox position-r all-m-b-30 info-item">
	<uv-form labelPosition="left" :model="formData" labelWidth="150rpx" ref="formRef">
		<view class="width-full all-p-t-30 display_row_center">
			<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
			<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">保养项目</text>
		</view>
		<block v-for="(item, index) in maintenance_project" :key="index">
			<view class="width-full all-p-t-10 all-p-b-20 display_column_center uv-border-bottom">
				<view class="width-full all-m-b-20 all-p-tb-10 display_row_center f-s-32">
					<uv-tags text="1" bgColor="#F2F2F2" borderColor="#F2F2F2" color="#333" size="mini"></uv-tags>
					<text class="t-c-272727 all-m-l-10 t-w-bold">{{ item.name }}</text>
				</view>
				<view class="width-full all-m-b-10 all-p-lr-10 display_row_center f-s-28">
					<text class="t-c-272727">保养部位：</text>
					<text class="t-c-6F6F6F">{{item.maintenance_area }}</text>
				</view>
				<view class="width-full all-p-lr-10 display_row_center f-s-28">
					<text class="t-c-272727">保养要求/标准：</text>
					<text class="t-c-6F6F6F">{{ item.maintenance_requirements }}</text>
				</view>
			</view>
			<uv-form-item label="保养状态:" :borderBottom="false" borderBottom>
				<uv-radio-group v-model="item.is_maintain">
					<view class="all-m-r-30">
						<uv-radio :name="0" label="未保养"></uv-radio>
					</view>
					<uv-radio :name="1" label="已保养"></uv-radio>
				</uv-radio-group>
			</uv-form-item>
			<uv-form-item label="备注说明:" :borderBottom="false">
				<uv-input v-model="item.note" :disabled="disabled" placeholder="请输入"></uv-input>
			</uv-form-item>
		</block>
	</uv-form>
</view>
</template>

<script>
export default {
	props: {
		info: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			maintenance_project: []
		};
	},
	methods: {
		upDateForm(list) {
			this.maintenance_project = list;
		},
		validateForm() {
			const mainSel =  this.maintenance_project.some(res => ![0, 1].includes(res.is_maintain));
			if (mainSel) {
				uni.showToast({
					icon: "none",
					title: "请选择保养状态",
				});
				return false;
			}
			return true;
		}
	}
};
</script>
<style lang="scss"></style>
