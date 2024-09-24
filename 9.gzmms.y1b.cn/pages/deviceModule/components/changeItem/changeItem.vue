<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-tb-10 display_row_center t-c-fff f-s-28 t-w-bold" style="background-color: #01C29F;">
			换上备件
		</view>
		<view class="width-full all-p-lr-40 t-20 all-p-b-30">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full display_row_spaceAround all-p-t-10 all-p-b-10 uv-border-bottom">
				<uv-icon name="scan" size="26" label="扫码更换" color="primary" labelColor="#3c9cff" @click.stop="handleScanHandle"></uv-icon>
				<uv-button size="small" type="primary" :disabled="disabled" icon="plus" iconSize="12" iconColor="#fff" text="关联领用单" @click="goToSelDeviceOrder"></uv-button>
			</view>
			<view class="width-full display_row_center all-p-t-10 all-p-b-10 uv-border-bottom" @click="showTimeSelect">
				<text class="all-m-r-10">换上日期: </text>
				<uv-input
					v-model="chage_date"
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					:disabled="disabled"
					placeholder="请选择换上日期"
					suffixIcon="calendar"
					readonly
				></uv-input>
			</view>
			<uv-swipe-action>
				<uv-swipe-action-item
					:options="options"
					:disabled="disabled"
					v-for="(item, index) in repair_parts" :key="index"
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
								<!-- {{item.barcode}}/{{ item.spec || '--' }} -->
								{{item.barcode}}{{ item.spec ? `/${item.spec}` : '' }}{{ item.brand ? `/${item.brand}` : ''}}
							</view>
							<view class="display_row_center" style="width: 200rpx;" v-if="!item.is_have_unique">
								<uv-input
									v-model="item.use_num"
									type="number"
									min="1"
									:disabled="disabled"
									:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
									placeholder="0"
									customStyle="padding: 0 20rpx;min-width: 80rpx"
								></uv-input>
							</view>
							<view @click="selectIdHandle(item, index)" class="display_row_center" style="width: 200rpx;" v-else>
								<uv-input
									:value="item.unique_label_detail.length"
									type="number"
									disabled
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
		<selectIdListDia ref="selectIdListRef" :listId="listId" :operate_type="1" @selList="selListHandle"></selectIdListDia>
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
		listId: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			repair_parts: [],
			selectIdIndex: 0,
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#f56c6c'
				}
			}],
			equipment_id: 0,
			chage_date: '',
			datetimeValue: Number(new Date()),
		};
	},
	watch: {
		info: {
			immediate: true,
			handler(newValue, oldValue) {
				if(!newValue) return;
				this.planData = newValue;
				const { repair_parts, equipment_id, chage_date } = newValue;
				this.equipment_id = equipment_id;
				this.chage_date = chage_date || formartDate(new Date());
				// console.log('this.chage_date', this.chage_date)
				if(repair_parts){
					this.repair_parts = repair_parts.map((item) => {
						const { re_no, rec_detail_id, goods_id, out_time, warehouse_id, warehouse_name, barcode, title, spec, brand,
							class_name, measure_name, received_num,	price, in_wh_date, sup_name, use_num, is_have_unique, stock_id, use_addr, unique_label_detail
						} = item;
						return {
							barcode,
							brand,
							chage_date: this.chage_date,
							class_name,
							eq_id: this.equipment_id,
							in_wh_date,
							is_have_unique,
							measure_name,
							out_date: out_time,
							out_ware: warehouse_name,
							out_ware_id: warehouse_id,
							price,
							re_no,
							rec_detail_id,
							received_num,
							spec,
							stock_id,
							sup_name,
							title,
							use_addr: use_addr || '',
							goods_id,
							use_num: use_num || 1,
							unique_label_detail: unique_label_detail || [],
						}
					});
				}
			}
		}
	},
	computed: {
		alertSelList() {
			if(!this.repair_parts) return [];
			return this.repair_parts.map(res => res.rec_detail_id) || [];
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
			this.chage_date = time;
			this.repair_parts.forEach(element => {
				element.chage_date = this.chage_date
			});
		},
		async handleScanHandle() {
			const scanResult = await deviceScan();
			const params = {
				content: scanResult,
				document_type: 11,
				data_type: 1, //明细码和唯一码数据返回类型；0：按照库存所有数据返回：1：只返回一条库存数据；
				operate_type: 1,
				order_id: this.listId ? this.listId : undefined,
				eq_id: this.equipment_id,
			}
			const result = await getLabelInfoMroApi(params);
			console.log('result', result);
  			const scanType = result.data.type;
			if(scanType != 1) {
				uni.showToast({
					icon: "none",
					title: "该唯一码不是换上设备",
				});
				return;
			}
			const findData = result.data.list;
			let orderFindRes = this.repair_parts.find((item) => {
				return findData.rec_detail_id == item.rec_detail_id;
			});
			if (!orderFindRes) {
				const { wh_rec_no, rec_detail_id, goods_id, out_time, warehouse_id, warehouse_name, barcode, title, spec, brand,
					class_name, measure_name, received_num,	price, in_wh_date, sup_name, use_num, stock_id, use_addr, unique_code,
					is_have_unique_code
				} = findData;
				this.repair_parts.unshift({
					barcode,
					brand,
					chage_date: this.chage_date,
					class_name,
					eq_id: this.equipment_id,
					in_wh_date,
					is_have_unique: is_have_unique_code,
					measure_name,
					out_date: out_time,
					out_ware: warehouse_name,
					out_ware_id: warehouse_id,
					price,
					re_no: wh_rec_no,
					rec_detail_id,
					received_num,
					spec,
					stock_id,
					sup_name,
					title,
					use_addr: use_addr || '',
					goods_id,
					use_num: use_num || 1,
					unique_label_detail: [ {
						unique_code
					}],
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
			if(this.repair_parts.length) {
				const haveNoCode = this.repair_parts.some((item) => item.is_have_unique && (item.unique_label_detail.length == 0));
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
				url: `/pages/deviceModule/maintain/repair/selDeviceOrder`,
				events: {
					acceptSelectDevice: (data) => {
						const { selListItem, selList } = data;
						selListItem.map((item) => {
							if(this.alertSelList.includes(item.rec_detail_id)) return;
							const { wh_rec_no, rec_detail_id, goods_id, out_time, warehouse_id, warehouse_name, barcode, title, spec, brand,
								class_name, measure_name, received_num,	price, in_wh_date, sup_name, use_num, is_have_unique, stock_id, use_addr
							} = item;
							// this.repair_parts.push({...item, unique_label_detail: []});
							this.repair_parts.push({
								barcode,
								brand,
								chage_date: this.chage_date,
								class_name,
								eq_id: this.equipment_id,
								in_wh_date,
								is_have_unique,
								measure_name,
								out_date: out_time,
								out_ware: warehouse_name,
								out_ware_id: warehouse_id,
								price,
								re_no: wh_rec_no,
								rec_detail_id,
								received_num,
								spec,
								stock_id,
								sup_name,
								title,
								use_addr: use_addr || '',
								goods_id,
								use_num: use_num || 1,
								unique_label_detail: [],
							});
						});
						this.repair_parts = this.repair_parts.filter(res => selList.includes(res.rec_detail_id));
					},
				},
				success: (res) => {
					res.eventChannel.emit('acceptData', { alertSelList: this.alertSelList })
				}
			});
		},
		selectIdHandle(item, index) {
			if(this.disabled) return;
			this.selectIdIndex = index;
			this.$refs.selectIdListRef.open(item);
		},
		selListHandle(selList) {
			// const { code } = selList;
			const codeList = selList.map(res =>{ return { unique_code: res.code }});
			this.repair_parts[this.selectIdIndex].unique_label_detail = codeList;
		},
		handleAction(event, index) {
			this.repair_parts.splice(index, 1);
		}
	},
};
</script>
<style lang="scss">
.contentBox {
	overflow: hidden;
}
</style>
