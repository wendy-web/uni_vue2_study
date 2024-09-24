<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-tb-30 flex-between" style="border-bottom: 2rpx solid #efefef">
			<view class="">
				<image class="iconBox" src="/static/otherImg/equipmentImg1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">设备信息</text>
			</view>
			<slot name="status"></slot>
		</view>
		<view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28">
			<view class="width-full all-m-b-20 display_row_center" @click="goToDeviceHandle">
				<text class="t-c-6F6F6F">设备名称：</text>
				<uv-input
					v-model="formData.bar_title"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择资产名称"
					suffixIcon="search"
				></uv-input>
			</view>
			<view class="width-full all-m-b-20 display_row_center">
				<text class="t-c-6F6F6F">设备编码：</text>
				<text class="t-c-272727">{{ formData.barcode }}</text>
			</view>
			<view class="width-full all-m-b-20 display_row_center">
				<text class="t-c-6F6F6F">设备型号：</text>
				<text class="t-c-272727">{{ formData.spec || "--" }}</text>
			</view>
			<view class="width-full all-m-b-20 display_row_center">
				<text class="t-c-6F6F6F">使用部门：</text>
				<text class="t-c-272727">{{ formData.use_dept_text || "--" }}</text>
			</view>
			<view class="width-full all-m-b-20 display_row_center">
				<text class="t-c-6F6F6F">使用位置：</text>
				<text class="t-c-272727">{{ formData.save_addr_text || "-" }}</text>
			</view>
		</view>
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
		}
	},
	data() {
		return {
			formData: {
				equipment_id: 0,
				bar_title: '',
				barcode: '',
				spec: '',
				use_dept_text: '',
				save_addr_text: ''
			}
		};
	},
	methods: {
		goToDeviceHandle() {
			if(this.disabled) return;
			const { equipment_id } = this.info;
			uni.navigateTo({
				url: `./selDevice?equipmentId=${equipment_id}`,
				events: {
					acceptChangeDevice: (data) => {
						console.log(data);
						const { id, selItem } = data;
						const { bar_title, barcode, spec, use_dept_text, save_addr_text } = selItem;
						this.formData = {
							equipment_id: id,
							bar_title,
							barcode,
							spec,
							use_dept_text,
							save_addr_text
						};
						this.$emit('changeEqId', selItem);
					},
				}
			});
		}
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				console.log('newValue', newValue)
				const { equipment_id, bar_title, barcode, spec, use_dept_text, save_addr_text } = newValue;
				this.formData = {
					equipment_id,
					bar_title,
					barcode,
					spec,
					use_dept_text,
					save_addr_text
				};
			},
		},
	},
};
</script>
<style lang="scss"></style>
