<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">维修处理情况</text>
			</view>
			<uv-form-item label="维修类型:" prop="repair_type" required :borderBottom="false" @click="selTypeHandle">
				<uv-input v-model="repairTypeText" :disabled="disabled" placeholder="请选择" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="故障原因:" prop="fault_reason" required :borderBottom="false" @click="selFaultReasonHandle">
				<uv-input v-model="faultReasonText" :disabled="disabled" placeholder="请选择" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="故障类型:" prop="fault_type" required :borderBottom="false" @click="selFaultTypeHandle">
				<uv-input v-model="faultTypeText" :disabled="disabled" placeholder="请选择" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="维修负责人:" prop="repair_director" required @click="selectExecuteUser(1)">
				<uv-input
					v-model="formData.repair_director_text"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选维修负责人"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="其他维修人员:" prop="other_repair_director" @click="selectExecuteUser(2)">
				<uv-input
					v-model="formData.other_repair_director_text"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选维修人员"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="维修开始时间:" prop="repair_start_time" required @click="showTimeSelect(1)">
				<uv-input
					v-model="formData.repair_start_time"
					:disabled="disabled"
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择开始时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="维修结束时间:" prop="repair_end_time" @click="showTimeSelect(2)">
				<uv-input
					v-model="formData.repair_end_time"
					:disabled="editRepairEndTime"
					:disabledColor="editRepairEndTime ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择结束时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>

			<uv-form-item label="是否停机:" prop="is_stop" :borderBottom="false">
				<uv-switch v-model="formData.is_stop" :disabled="disabled" inactive-color="#8C8C8C" size="16"></uv-switch>
			</uv-form-item>
			<uv-form-item label="累计误时(分):" prop="stop_time">
				<uv-input
					v-model="formData.stop_time"
					:disabled="disabled"
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请输入累计误时"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="外委单位:" prop="outsourcing_id" :borderBottom="false" @click="selOutHandle">
				<uv-input v-model="outsourcingIdText" :disabled="disabled" placeholder="请选择外委单位" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>

			<uv-form-item label="维修费用(元):" :borderBottom="false">
				<uv-input v-model="formData.repair_price" :disabled="disabled" placeholder="请输入维修费用"></uv-input>
			</uv-form-item>
			<uv-form-item label="维修描述:" :borderBottom="false" required>
				<uv-input v-model="formData.repair_note" :disabled="disabled" placeholder="请输入维修描述"></uv-input>
			</uv-form-item>
			<uv-form-item label="维修图片:" label-width="200" labelPosition="top">
				<view style="margin-top: 8rpx">
					<uv-upload
						:fileList="fileList2"
						name="2"
						:maxCount="4"
						multiple
						:previewFullImage="true"
						@afterRead="afterRead"
						@delete="deletePic"
						:disabled="disabled"
					></uv-upload>
				</view>
			</uv-form-item>
		</uv-form>
		<!-- 维修类型 -->
		<uv-picker ref="typePicker" :columns="[typeColumns]" keyName="label" @confirm="confirmTypeHandle($event, 'repair_type', typeColumns)"></uv-picker>
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			:minDate="minDateValue"
			mode="datetime"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
		<!-- 选择故障类型 -->
		<selectType ref="selectTypeRefs" labelText="label" :faultTypeOptions="faultTypeOptions" @confirm="confirmSelHandle"></selectType>
		<!-- 故障原因 -->
		<selectType
			ref="selectReasonRefs" titleText="选择故障原因"
			labelText="name" :faultTypeOptions="reasonOptions"
			@confirm="confirmReasonSelHandle"></selectType>
		<uv-picker ref="outPicker" :columns="[outsourcingList]" keyName="name" @confirm="confirmTypeHandle($event, 'outsourcing_id', outsourcingList)"></uv-picker>
	</view>
</template>
<script>
import { getReBaseSelect, getRepairReasonList } from "@/api/device/maintain/repair.js";
import { baseUrl } from "@/api/http/xhHttp.js";
import { checkAssocType, checkBtn } from '@/utils/auth.js';
import dayJs from "@/utils/dayjs.min.js";
import { getRulePlanTime, uploadFilePromise } from "@/utils/device.js";
import { checkIsBeforeDate } from "@/utils/validate";
import selectType from "./selectType.vue";
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
	components: {
		selectType
	},
	data() {
		return {
			formData: {
				repair_type: '',
				fault_reason: '',
				fault_type: '',
				repair_director: '',
				repair_director_text: '',
				other_repair_director: '',
				other_repair_director_text: '',
				repair_start_time: dayJs().format("YYYY-MM-DD HH:mm"),
				repair_end_time: '',
				is_stop: false,
				stop_time: '',
				outsourcing_id: '',
				repair_price: '',
				repair_note: '',
				repair_picture: '',
			},
			minDateValue: '',
			selectTimeType: 1, // 1是选择任务开始时间 2是选择任务结束时间
			selectDirectorType: 1, // 1是主维修负责人 2是其他负责人
			datetimeValue: Number(new Date()),
			fileList2: [],
			// 维修类型 1 常见故障维修 2 突发性故障维修3 = 计划项目维修 4 = 不正当使用维修
			typeColumns: [
				{
					label: '常见故障维修',
					id: 1
				},
				{
					label: '突发性故障维修',
					id: 2
				},
				{
					label: '计划项目维修',
					id: 3
				},
				{
					label: '不正当使用维修',
					id: 4
				}
			],
			// 故障类型 1 电气故障 2 机械故障 3 其他故障
			faultTypeOptions: [
				{
					label: '电气故障',
					id: 1
				},
				{
					label: '机械故障',
					id: 2
				},
				{
					label: '其他故障',
					id: 3
				}
			],
			reasonOptions: [],
			outsourcingList: [],
			repair_picture: []

		};
	},
	async mounted() {
		this.getReBaseSelectInit();
		const res = await getRepairReasonList();
		this.reasonOptions = res.data.list;
	},
	computed: {
		editRepairEndTime() {
			return this.disabled && !(checkBtn('submit', 1) && checkAssocType(this.info.assoc_type, 1) && [0, 3, 4].includes(this.info.status));
		},
		repairTypeText() {
			return this.typeColumns.find(res => res.id == this.formData.repair_type)?.label;
		},
		outsourcingIdText() {
			return this.outsourcingList.find(res => res.id == this.formData.outsourcing_id)?.name;
		},
		faultTypeList() {
			if(!this.formData.fault_type) return [];
			return (this.formData.fault_type.split(',') || []).map(res => Number(res));
		},
		faultTypeText() {
			let showFaultType = '';
			if(!this.faultTypeList) return [];
			this.faultTypeOptions.map(res => {
				if(this.faultTypeList.includes(res.id)) showFaultType += `${res.label},`;
			});
			return showFaultType;
		},
		faultReasonList() {
			if(!this.formData.fault_reason) return [];
			return (this.formData.fault_reason.split(',') || []).map(res => Number(res));
		},
		faultReasonText() {
			let showReasonType = '';
			if(!this.faultReasonList) return '';
			this.reasonOptions.map(res => {
				if(this.faultReasonList.includes(res.id)) showReasonType += `${res.name},`;
			});
			console.log('showReasonType', showReasonType)
			return showReasonType;
		}
	},
	methods: {
		upDateForm(info) {
			const {
				repair_type,
				fault_reason,
				fault_type,
				repair_director,
				repair_director_text,
				other_repair_director,
				other_repair_director_text,
				repair_start_time,
				repair_end_time,
				is_stop,
				stop_time,
				outsourcing_id,
				repair_price,
				repair_note,
				repair_picture,
			} = info;
			this.formData =  {
				repair_type,
				fault_reason,
				fault_type,
				repair_director: repair_director,
				repair_director_text,
				other_repair_director,
				other_repair_director_text,
				repair_start_time: repair_start_time || '',
				repair_end_time,
				is_stop: Boolean(is_stop),
				stop_time,
				outsourcing_id,
				repair_price,
				repair_note,
			}
			if(!repair_picture) return;
			this.repair_picture =repair_picture;
			this.fileList2 = repair_picture.map((item) => { return { url: baseUrl + item }});
		},
		async getReBaseSelectInit() {
			const res = await getReBaseSelect();
			const { outsourcing_list } = res.data;
			this.outsourcingList = outsourcing_list;
		},
		confirmSelHandle(confirmList) {
			this.formData.fault_type = confirmList.join(',');
		},
		selFaultTypeHandle() {
			if(this.disabled) return;
			this.$refs.selectTypeRefs.open(this.faultTypeList);
		},
		confirmReasonSelHandle(confirmList) {
			this.formData.fault_reason = confirmList.join(',');
		},
		selFaultReasonHandle() {
			if(this.disabled) return;
			this.$refs.selectReasonRefs.open(this.faultReasonList);
		},
		// 选择类型
		selTypeHandle() {
			if(this.disabled) return;
			this.$refs.typePicker.setIndexs([this.formData.repair_type - 1],true);
			this.$refs.typePicker.open();
		},
		// 选择外委单位
		selOutHandle() {
			if(this.disabled) return;
			const setFindIndex = this.outsourcingList.findIndex(res => res.id == this.formData.outsourcing_id);
			this.$refs.outPicker.setIndexs([setFindIndex],true);
			this.$refs.outPicker.open();
		},
		confirmTypeHandle(event, keyValue, options) {
			if(!event.value[0]) {
				const [ firstItem ] = options;
				this.formData[keyValue] = firstItem.id;
				return;
			}
			this.formData[keyValue] = event.value[0]?.id;
		},
		async afterRead(event) {
			// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file);
			let fileListLen = this[`fileList${event.name}`].length;
			lists.map((item) => {
				this[`fileList${event.name}`].push({
					...item,
					status: "uploading",
					message: "上传中",
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result = await uploadFilePromise(lists[i].url,true);
				let item = this[`fileList${event.name}`][fileListLen];
				this[`fileList${event.name}`].splice(
					fileListLen,
					1,
					Object.assign(item, {
						status: "success",
						message: "",
						url: baseUrl + result,
						noBaseUrl: result,
					}),
				);
				fileListLen++;
			}
			this.change();
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
			this.change();
		},
		change() {
			this.repair_picture = this.fileList2.map((item) => item.noBaseUrl);
			this.$emit("change", this.repair_picture);
		},
		validateForm(status = 0) {
			if (!this.formData.repair_type) {
				uni.showToast({
					icon: "none",
					title: "请选择维修类型",
				});
				return false;
			}
			if (!this.formData.fault_reason) {
				uni.showToast({
					icon: "none",
					title: "请选择故障原因",
				});
				return false;
			}
			if (!this.formData.fault_type) {
				uni.showToast({
					icon: "none",
					title: "请选择故障类型",
				});
				return false;
			}
			if (!this.formData.repair_director) {
				uni.showToast({
					icon: "none",
					title: "请选择维修负责人",
				});
				return false;
			}
			if (!this.formData.repair_start_time) {
				uni.showToast({
					icon: "none",
					title: "请选择维修开始时间",
				});
				return false;
			}
			// 提交验证 - 需要验证维修结束时间
			if(status && !this.formData.repair_end_time) {
				uni.showToast({
					icon: "none",
					title: "请选择维修结束时间",
				});
				return false;
			}
			if (this.formData.repair_end_time) {
				const checkResult = checkIsBeforeDate(this.formData.repair_end_time, this.formData.repair_start_time);
				if(checkResult) {
					uni.showToast({
						icon: "none",
						title: "结束日期时分不可在开始日期时分之前",
					});
					return false;
				}
			}
			if (!this.formData.repair_note) {
				uni.showToast({
					icon: "none",
					title: "请输入维修描述",
				});
				return false;
			}
			return true;
		},
		// 获取计划执行时间
		getPlanTime(data) {
			return getRulePlanTime(data);
		},
		// 点击选择时间 1: 开始 2：结束
		showTimeSelect(type) {
			if(type == 2 && this.editRepairTime) return;
			if(type == 1 && this.disabled) return;
			this.selectTimeType = type;
			this.minDateValue = (type == 2) ? Date.parse(this.formData.repair_start_time) : '';
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			// if (this.disabled) return;
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			if (this.selectTimeType == 1) {
				this.formData.repair_start_time = time;
			} else {
				this.formData.repair_end_time = time;
			}
		},
		selectExecuteUser(type) {
			if (this.disabled) return;
			this.selectDirectorType = type;
			uni.navigateTo({
				url: "/pages/common/user/user",
				events: {
					someEvent: (data) => {
						// 维修负责人 - 单选
						if(this.selectDirectorType == 1) {
							this.formData.repair_director_text = data.label;
							this.formData.repair_director = data.value;
							return;
						}
						// 其他负责人多选
						this.formData.other_repair_director_text = data.ar_uname.join(",");
						this.formData.other_repair_director = data.ar_uid.join(",");
					},
				},
				success: (res) => {
					let data = {
						isMultiple: type == 2,
						disableList: []
					};
					let checkboxValueList = this.formData.other_repair_director ? this.formData.other_repair_director.split(",") : [];
					checkboxValueList = checkboxValueList.map(res => Number(res));
					if(this.selectDirectorType == 1) {
						data.radioValue = this.formData.repair_director;
						data.radioLabel = this.formData.repair_director_text;
						data.disableList = checkboxValueList;
					} else {
						data.checkboxValue = checkboxValueList;
						data.disableList = [this.formData.repair_director];
						data.labelList = this.formData.other_repair_director_text ? this.formData.other_repair_director_text.split(",") : [];
					}
					res.eventChannel.emit("acceptData", data);
				},
			});
		},
	}
};
</script>
<style lang="scss"></style>
