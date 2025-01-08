<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
				<view class="">
					<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
					<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">设备信息</text>
				</view>
				<slot name="status"></slot>
			</view>
			<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备名称：</text>
					<text class="t-c-272727">{{ formData.bar_title }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">设备编码：</text>
					<text class="t-c-272727">{{ formData.asset_no }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用部门：</text>
					<text class="t-c-272727">{{ formData.use_dept_names || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F" space="nbsp">型      号：</text>
					<text class="t-c-272727">{{ formData.spec || "--" }}</text>
				</view>
				<view class="width-full all-m-b-20 display_row_center">
					<text class="t-c-6F6F6F">使用位置：</text>
					<text class="t-c-272727">{{ formData.use_places || "-" }}</text>
				</view>
				<view class="all-p-t-20 t-c-0171FD text-align-c" @click="lookMoreHandle">查看更多 ></view>
			</view>
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
	},
	data() {
		return {
			formData: {},
			equipment: {}
		};
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				console.log('newValue', newValue)
				const { asset_no, bar_title, use_dept_names, spec, use_places, equipment } = newValue;
				this.formData = {
					asset_no,
					bar_title,
					use_dept_names,
					spec,
					use_places
				};
				this.equipment = equipment;
			},
		},
	},
	methods: {
		lookMoreHandle() {
			uni.navigateTo({
				url: `/pages/deviceModule/maintain/plan/detailMore`,
				success: (res) => {
					res.eventChannel.emit("detailData", this.equipment);
				}
			});
		}
	}
};
</script>
<style lang="scss"></style>
