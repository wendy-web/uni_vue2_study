<template>
	<view class="width-full contentBox position-r all-m-b-30 info-item">
		<uv-form labelPosition="left" :model="formData" labelWidth="200rpx" ref="formRef">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon0.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">故障信息</text>
			</view>
			<uv-form-item label="发生时间:" prop="occurrence_time" required @click="showTimeSelect">
				<uv-input
					v-model="formData.occurrence_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择发生时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="班次:" prop="class_type" required :borderBottom="false" @click="selTypeHandle(1)">
				<uv-input
					v-model="classTypeText"
					placeholder="请选择班次"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					readonly
				>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="报修人:" prop="repair_user_id" required @click="selectExecuteUser">
				<uv-input
					v-model="formData.repair_user_id_text"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选报修人"
					suffixIcon="search"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="设备部位:" :borderBottom="false">
				<uv-input v-model="formData.fault_body" :disabled="disabled" placeholder="请输入"></uv-input>
			</uv-form-item>
			<uv-form-item label="所属产线:" :borderBottom="false" @click="selTypeHandle(2)">
				<uv-input v-model="productText" :disabled="disabled" placeholder="请选择所属产线" readonly>
					<template v-slot:suffix>
						<uv-icon name="arrow-right"></uv-icon>
					</template>
				</uv-input>
			</uv-form-item>
			<uv-form-item label="故障描述:" :borderBottom="false" required>
				<uv-input v-model="formData.fault_note" :disabled="disabled" placeholder="请输入"></uv-input>
			</uv-form-item>
			<uv-form-item label="故障图片:" label-width="200" labelPosition="top">
				<view style="margin-top: 8rpx">
					<uv-upload
						:fileList="fileList2"
						accept="image"
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
		<!-- 班次 -->
		<uv-picker ref="classPicker" :columns="[classTypeOptions]" keyName="label" @confirm="confirmTypeHandle($event, 'class_type', classTypeOptions)"></uv-picker>
		<!-- 所属产线 -->
		<uv-picker ref="productPicker" :columns="[productLineOptions]" keyName="name" @confirm="confirmTypeHandle($event, 'product_line', productLineOptions)"></uv-picker>
		<!-- 时间的选择 -->
		<uv-datetime-picker
			ref="datetimePicker"
			:maxDate="datetimeValue"
			v-model="datetimeValue"
			mode="datetime"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
	</view>
</template>

<script>
import { baseUrl } from "@/api/http/xhHttp.js";
import dayJs from "@/utils/dayjs.min.js";
import { getRulePlanTime, uploadFilePromise } from "@/utils/device.js";
import { mapGetters } from "vuex";
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
		classTypeOptions: {
			type: Array,
			default: []
		},
		productLineOptions: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			formData: {
				class_type: '',
				occurrence_time: dayJs().format("YYYY-MM-DD HH:mm"),
				repair_user_id: '',
				repair_user_id_text: '',
				fault_body: '',
				product_line: '',
				fault_note: '',
			},
			datetimeValue: Number(new Date()),
			fileList2: [],
			fault_picture: [],
		};
	},
	computed: {
		...mapGetters(["userInfo"]),
		defaultUser() {
			return `${this.userInfo.name}`;
		},
		defaultUid() {
			return this.userInfo.id;
		},
		classTypeText() {
			return this.classTypeOptions.find(res => res.value == this.formData.class_type)?.label;
		},
		productText() {
			return this.productLineOptions.find(res => res.id == this.formData.product_line)?.name;
		}
	},
	methods: {
		upDateForm(info) {
			const { occurrence_time, repair_user_id, repair_user_id_text, fault_body, product_line, fault_note, fault_picture, class_type} = info;
			this.formData = {
				class_type,
				occurrence_time,
				repair_user_id: repair_user_id,
				repair_user_id_text,
				fault_body,
				product_line,
				fault_note,
			};
			if(!fault_picture) return;
			this.fault_picture = fault_picture;
			this.fileList2 = fault_picture.map((item) => { return { url: baseUrl + item }});
		},
		// picker的选择
		selTypeHandle(type) {
			if(this.disabled) return;
			if(type == 1) {
				const setFindIndex = this.classTypeOptions.findIndex(res => res.id == this.formData.class_type);
				this.$refs.classPicker.setIndexs([setFindIndex],true);
				this.$refs.classPicker.open();
				return;
			}
			const setFindIndex = this.productLineOptions.findIndex(res => res.id == this.formData.product_line);
			this.$refs.productPicker.setIndexs([setFindIndex],true);
			this.$refs.productPicker.open();
		},
		confirmTypeHandle(event, keyValue, options) {
			if(!event.value[0]) {
				const [ firstItem ] = options;
				this.formData[keyValue] = firstItem.id || firstItem.value;
				return;
			}
			this.formData[keyValue] = event.value[0]?.id || event.value[0]?.value;
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
			this.fault_picture = this.fileList2.map((item) => item.noBaseUrl);
			this.$emit("change", this.fault_picture);
		},
		validateForm() {
			if (!this.formData.occurrence_time) {
				uni.showToast({
					icon: "none",
					title: "请选择发生时间",
				});
				return false;
			}
			if (!this.formData.class_type) {
				uni.showToast({
					icon: "none",
					title: "请选择班次",
				});
				return false;
			}
			if (!this.formData.repair_user_id) {
				uni.showToast({
					icon: "none",
					title: "请选择报修人",
				});
				return false;
			}
			if (!this.formData.fault_note) {
				uni.showToast({
					icon: "none",
					title: "请输入故障描述",
				});
				return false;
			}
			return true;
		},
		// 获取计划执行时间
		getPlanTime(data) {
			return getRulePlanTime(data);
		},
		// 点击选择时间
		showTimeSelect() {
			if (this.disabled) return;
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			if (this.disabled) return;
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			this.formData.occurrence_time = time;
		},
		selectExecuteUser() {
			if (this.disabled) return;
			uni.navigateTo({
				url: "/pages/common/user/user",
				events: {
					someEvent: (data) => {
						this.formData.repair_user_id_text = data.label;
						this.formData.repair_user_id = data.value;
					},
				},
				success: (res) => {
					let data = {
						isMultiple: false,
						radioValue: this.formData.repair_user_id,
						radioLabel: this.formData.repair_user_id_text
					};
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptData", data);
				},
			});
		},
	}
};
</script>
<style lang="scss"></style>
