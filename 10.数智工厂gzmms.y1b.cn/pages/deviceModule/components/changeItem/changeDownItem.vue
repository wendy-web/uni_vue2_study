<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-tb-10 display_row_center t-c-fff f-s-28 t-w-bold" style="background-color: #F59A23;">
			换下备件
		</view>
		<view class="width-full all-p-lr-40 t-20 all-p-b-30">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full display_row_spaceAround all-p-t-10 all-p-b-10 uv-border-bottom">
				<uv-icon name="scan" size="26" label="扫码更换" color="primary" labelColor="#3c9cff" @click.stop="handleScanHandle"></uv-icon>
				<uv-button size="small" type="primary" :disabled="disabled" icon="plus" iconSize="12" iconColor="#fff" text="换下在线备件" @click="goToSelDeviceOrder"></uv-button>
			</view>
			<view class="width-full display_row_center all-p-t-10 all-p-b-10 uv-border-bottom" @click="showTimeSelect">
				<text class="all-m-r-10">换下日期: </text>
				<uv-input
					v-model="down_date"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择换下日期"
					suffixIcon="calendar"
					readonly
				></uv-input>
			</view>
			<uv-swipe-action v-if="chage_parts.length">
				<uv-swipe-action-item
					:options="options"
					:disabled="disabled"
					v-for="(item, index) in chage_parts" :key="index"
					@click="handleAction($event, index)"
				>
					<view class="swipe-action uv-border-bottom">
						<view class="width-full all-p-t-30 display_row_center">
							<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
							<text class="title-label all-m-l-10 t-c-000018 t-w-bold f-s-32">备件仓</text>
						</view>
						<view class="width-full f-s-26 t-w-bold t-c-333 all-m-t-10">{{ item.title }}</view>
						<view class="width-full display_row_center all-m-t-10 all-m-b-10">
							<view class="f-s-24 t-c-aaa all-m-r-10 flex_full uv-line-1">
								<!-- {{ item.barcode }} / {{ item.spec || '--' }} -->
								{{item.barcode}}{{ item.spec ? `/${item.spec}` : '' }}{{ item.brand ? `/${item.brand}` : ''}}
							</view>
							<view class="display_row_center" style="width: 200rpx;" v-if="!item.is_have_unique">
								<uv-input
									v-model="item.down_num"
									type="number"
									min="1"
									:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
									placeholder="0"
									customStyle="padding: 0 20rpx;min-width: 80rpx"
								></uv-input>
							</view>
							<view @click="selectIdHandle(item, index)" class="display_row_center" style="width: 200rpx;" v-else>
								<uv-input
									:value="item.unique_label_detail.length"
									type="number"
									disable
									:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
									placeholder="0"
									customStyle="padding: 0 20rpx;min-width: 80rpx"
									suffixIcon="list-dot"
								></uv-input>
							</view>
						</view>
					</view>
				</uv-swipe-action-item>
			</uv-swipe-action>
		</uv-form>
		</view>
		<selectIdListDia ref="selectIdListRef" :listId="listId" :operate_type="2" @selList="selListHandle"></selectIdListDia>
		<!-- 时间的选择 -->
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			mode="date"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
	</view>
</template>
<script>
import { getLabelInfoMroApi } from "@/api/device/maintain/repair.js";
import { deviceScan } from "@/utils/device.js";
import { formartDate } from "@/utils/validate";
import selectIdListDia from "./selectIdListDia.vue";
export default {
	components: {
		selectIdListDia
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		info: {
			type: Object,
			default: {}
		},
		equipment_id: {
			type: [String, Number],
			default: 0
		},
		listId: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			chage_parts: [], //换下
			selectIdIndex: 0,
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#f56c6c'
				}
			}],
			down_date: '',
			datetimeValue: Number(new Date()),
		};
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				this.planData = newValue;
				const { chage_parts, down_date } = newValue;
				this.chage_parts = chage_parts || [];
				this.down_date = down_date || formartDate(new Date());
				if(chage_parts) {
					this.chage_parts = chage_parts.map((item) => {
						const { id, down_num, stock_id, repair_id, unique_label_detail, is_have_unique, title,
							barcode, spec
						 } = item;
						return {
							id,
							parts_id: repair_id,
							down_num,
							down_date: this.down_date,
							stock_id,
							unique_label_detail: unique_label_detail || [],
							is_have_unique,
							repair_id,
							title,
							barcode,
							spec
						}
					});
				}
			}
		}
	},
	computed: {
		alertSelList() {
			if(!this.chage_parts) return [];
			return this.chage_parts.map(res => res.repair_id) || [];
		}
	},
	methods: {
		formartDate,
		// 点击选择时间
		showTimeSelect() {
			if (this.disabled) return;
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			if (this.disabled) return;
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd");
			this.down_date = time;
			this.chage_parts.forEach(element => {
				element.down_date = this.down_date
			});
		},
		async handleScanHandle() {
			const scanResult = await deviceScan();
			const params = {
				content: scanResult,
				document_type: 11,
				data_type: 1, // 明细码和唯一码数据返回类型；0：按照库存所有数据返回：1：只返回一条库存数据；
				operate_type: 2,
				order_id: this.listId ? this.listId : undefined,
				eq_id: this.equipment_id,
			}
			const result = await getLabelInfoMroApi(params);
			console.log('result', result);
			const scanType = result.data.type;
			if(scanType == 1) {
				uni.showToast({
					icon: "none",
					title: "该唯一码不是换下设备",
				});
				return;
			}
			const findData = result.data.list;
			let orderFindRes = this.chage_parts.find((item) => {
				return findData.repair_id == item.repair_id;
			});
			if (!orderFindRes) {
				const { id, stock_id, order_type_text, unique_code, title, barcode, spec, is_have_unique_code } = findData;
				this.chage_parts.unshift({
					...findData,
					parts_id: id,
					down_num: 1,
					type_text: order_type_text,
					down_date: this.down_date,
					stock_id,
					unique_label_detail: [ { unique_code }],
					is_have_unique: is_have_unique_code,
					title,
					barcode,
					spec
				});
				return;
			}
			let unique_label_detail = orderFindRes.unique_label_detail || [];
			let unique_label_list = unique_label_detail.map((el) => el.unique_code);
			if (unique_label_list.includes(findData.unique_code)) {
				// ElMessage.info("该唯一码已添加,请勿重复扫描");
				uni.showToast({
					icon: "none",
					title: "该唯一码已添加,请勿重复扫描",
				});
				return;
			} else {
				orderFindRes.unique_label_detail?.push({
					unique_code: findData.unique_code,
				});
			}
		},
		showUniqueLabel(item) {
			const { unique_label_detail } = item;
			if(!unique_label_detail) return 0;
			return unique_label_detail.length;
		},
		validateForm() {
			if(this.chage_parts.length) {
				const haveNoCode = this.chage_parts.some((item) => item.is_have_unique && (item.unique_label_detail.length == 0));
				if(haveNoCode) {
					uni.showToast({
						icon: "none",
						title: "使用数量不可为0,请检查填写内容",
					});
					return false;
				}
			}
			return true;
		},
		goToSelDeviceOrder() {
			uni.navigateTo({
				url: `/pages/deviceModule/maintain/repair/selDeviceOrder?apiType=down&equipment_id=${this.equipment_id}`,
				events: {
					acceptSelectDevice: (data) => {
						const { selListItem, selList } = data;
						selListItem.map((item) => {
							if(this.alertSelList.includes(item.repair_id)) return;
							const { id, down_num, stock_id, repair_id, is_have_unique, title, barcode, spec } = item;
							this.chage_parts.push({
								id,
								parts_id: repair_id,
								down_num,
								down_date: this.down_date,
								stock_id,
								unique_label_detail: [],
								repair_id,
								is_have_unique,
								title,
								barcode,
								spec
							});
						});
						this.chage_parts = this.chage_parts.filter(res => selList.includes(res.repair_id));
					},
				},
				success: (res) => {
					res.eventChannel.emit('acceptData', { alertSelList: this.alertSelList })
				}
			});
		},
		selectIdHandle(item, index) {
			this.selectIdIndex = index;
			this.$refs.selectIdListRef.open(item);
		},
		selListHandle(selList) {
			const codeList = selList.map(res =>{ return { unique_code: res.code }});
			this.chage_parts[this.selectIdIndex].unique_label_detail = codeList;
		},
		handleAction(event, index) {
			this.chage_parts.splice(index, 1);
		}
	},
};
</script>
<style lang="scss">
.contentBox {
	overflow: hidden;
}
</style>
