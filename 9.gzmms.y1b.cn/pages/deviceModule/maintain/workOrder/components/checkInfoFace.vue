<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">保养处理情况</text>
			</view>
			<uv-form-item label="任务开始时间:" prop="maintenance_start_time" required @click="showTimeSelect(1)">
				<uv-input
					v-model="formData.maintenance_start_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择开始时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="任务结束时间:" prop="complete_time" @click="showTimeSelect(2)">
				<uv-input
					v-model="formData.complete_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择结束时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="保养负责人:" prop="director_uid">
				<uv-input
					v-model="formData.director_names"
					disabled="true"
					disabledColor="#F5F7FA"
					placeholder="请选维修负责人"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="其他保养人员:" prop="other_uid">
				<uv-input
					v-model="formData.other_names"
					disabled="true"
					disabledColor="#F5F7FA"
					placeholder="请选报修人"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>

			<uv-form-item label="外委单位:" prop="outsourced_units" :borderBottom="false" @click="selOutHandle">
				<uv-input v-model="outsourcingIdText" placeholder="请选择外委单位" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="保养费用(元):" :borderBottom="false">
				<uv-input v-model="formData.maintenance_cost" :disabled="disabled" placeholder="请输入维修费用"></uv-input>
			</uv-form-item>
			<uv-form-item label="保养描述:" :borderBottom="false">
				<uv-input v-model="formData.maintenance_desc" :disabled="disabled" placeholder="请输入维修描述"></uv-input>
			</uv-form-item>
			<uv-form-item label="保养图片:" label-width="200" labelPosition="top">
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
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			:minDate="minDateValue"
			mode="datetime"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
		<!-- 外委单位 -->
		<uv-picker ref="outPicker"
			:columns="[outsourcingList]"
			keyName="name"
			@confirm="confirmTypeHandle"
		></uv-picker>
	</view>
</template>
<script>
import { getReBaseSelect } from "@/api/device/maintain/repair.js";
import { baseUrl } from "@/api/http/xhHttp.js";
import dayJs from "@/utils/dayjs.min.js";
import { getRulePlanTime, uploadFilePromise } from "@/utils/device.js";
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
	// 这里存放数据
	data() {
		return {
			formData: {
				maintenance_start_time: dayJs().format("YYYY-MM-DD HH:mm"), // 任务开始时间
				complete_time: "", //任务结束时间
				director_uid: '',
				director_names: "",
				other_uid: "",
				other_names: '',
				outsourced_units: '',
				maintenance_cost: '',
				maintenance_desc: ''
			},
			selectTimeType: 1, //1是选择任务开始时间 2是选择任务结束时间
			datetimeValue: Number(new Date()),
			planData: {},
			fileList2: [],
			img_info: [],
			outsourcingList: [],
			minDateValue: '',
			plan_start_time: ''
		};
	},

	mounted() {
		this.getReBaseSelectInit();
	},
	computed: {
		outsourcingIdText() {
			return this.outsourcingList.find(res => res.id == this.formData.outsourced_units)?.name;
		},
	},
	methods: {
		confirmTypeHandle(event) {
			if(!event.value[0]) {
				const [ firstItem ] = this.outsourcingList;
				this.formData[keyValue] = firstItem.id;
				return;
			}
			this.formData.outsourced_units = event.value[0]?.id;
		},
		async getReBaseSelectInit() {
			const res = await getReBaseSelect();
			const { outsourcing_list } = res.data;
			this.outsourcingList = outsourcing_list;
		},
		// 选择外委单位
		selOutHandle() {
			if(this.disabled) return;
			const setFindIndex = this.outsourcingList.findIndex(res => res.id == this.formData.outsourced_units);
			this.$refs.outPicker.setIndexs([setFindIndex],true);
			this.$refs.outPicker.open();
		},
		upDateForm(info) {
			const { plan_start_time, complete_time, director_names, director_uid, other_uid, other_names,
				outsourced_units, maintenance_cost, maintenance_desc, img_info } = info;
			this.formData = {
				maintenance_start_time: plan_start_time,
				complete_time,
				director_uid,
				director_names,
				other_uid,
				other_names,
				outsourced_units,
				maintenance_cost,
				maintenance_desc,
			};
			this.plan_start_time = plan_start_time;
			this.minDateValue = Date.parse(plan_start_time)
			if(!img_info) return;
			this.img_info = img_info;
			this.fileList2 = img_info.map((item) => { return { url: baseUrl + item }});
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
			this.img_info = this.fileList2.map((item) => item.url);
			this.$emit("change", this.img_info);
		},
		validateForm() {
			if (!this.formData.maintenance_start_time) {
				uni.showToast({
					icon: "none",
					title: "请选择任务开始时间",
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
			if (this.disabled) return;
			this.selectTimeType = type;
			this.$refs.datetimePicker.open();
			this.minDateValue = (type == 2) ? Date.parse(this.formData.maintenance_start_time) : Date.parse(this.plan_start_time);
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			if (this.disabled) return;
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			if (this.selectTimeType == 1) {
				this.formData.maintenance_start_time = time;
			} else {
				this.formData.complete_time = time;
			}
		}
	}
};
</script>
<style lang="scss"></style>
