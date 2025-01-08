<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-t-30 display_row_center">
			<image class="iconBox" src="/static/otherImg/planFarmTitleIcon2.png"></image>
			<text class="title-label all-m-l-10 t-c-000018 t-w-bold f-s-32">现场照片</text>
			<text class="red-text" v-if="is_must_pho">*</text>
		</view>
		<view class="width-full all-p-lr-40 all-m-t-20 all-p-b-30">
			<uv-form-item label-width="0">
				<uv-upload
					:fileList="fileList1"
					name="1"
					:maxCount="4"
					multiple
					:previewFullImage="true"
					@afterRead="afterRead"
					@delete="deletePic"
					:disabled="disabled"
					:deletable="!disabled"
					capture="camera"
				></uv-upload>
			</uv-form-item>
		</view>
		<view class="width-full all-p-lr-40 all-m-t-20 all-p-b-30">
			<uv-form-item label="是否上报整改:" label-width="120" required>
				<uv-radio-group
					v-model="fromData.is_report_rectify"
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
			<template v-if="fromData.is_report_rectify">
				<uv-form-item label="整改问题:" required>
					<uv-textarea v-model="fromData.rectify_problem" placeholder="请输入内容" :disabled="disabled"></uv-textarea>
				</uv-form-item>
				<uv-form-item label="整改负责人" required @click="selectExecuteUser()">
					<uv-input
						v-model="fromData.rectify_name"
						disabled
						:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
						placeholder="请选择整改负责人"
						suffixIcon="search"
					></uv-input>
				</uv-form-item>
			</template>
		</view>
	</view>
</template>

<script>
import { baseUrl } from "@/api/http/xhHttp.js";
import { uploadFilePromise } from "@/utils/device.js";
import { getUserLocation } from '@/utils/getUserLocation.js';
import { mapGetters } from "vuex";
export default {
	props: {
		is_must_pho: {
			type: Number,
			default: 1,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		is_report: {
			type: Number,
			default: 0,
		},
	},
	// 这里存放数据
	data() {
		return {
			fromData: {
				rectify_uid: "", //整改负责人
				rectify_name: "", //整改负责人名称
				rectify_problem: "", //整改问题
				is_report_rectify: 0, //是否上报整改
			},
			fileList1: [],
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
			picture: [],
			longitude: '',
			latitude: '',

		};
	},
	async mounted() {
		this.fromData.rectify_name = this.defaultUser;
		this.fromData.rectify_uid = this.defaultUid;
		const res = await getUserLocation();
		console.log('res', res);
		const { longitude, latitude } = res.data;
		this.longitude = longitude;
        this.latitude = latitude;
	},

	watch: {
		is_report: {
			immediate: true,
			handler(newVal) {
				console.log("newVal-is_report", newVal);
				this.fromData.is_report_rectify = newVal;
			},
		},
	},
	// 计算属性
	computed: {
		...mapGetters(["userInfo"]),
		defaultUser() {
			return `${this.userInfo.name}`;
		},
		defaultUid() {
			return this.userInfo.id;
		},
	},

	// 方法集合
	methods: {
		validateForm() {
			if (this.is_must_pho && !this.picture.length) {
				uni.showToast({
					icon: "none",
					title: "请上传现场照片",
				});
				return false;
			}
			if (this.fromData.is_report_rectify === 1) {
				if (!this.fromData.rectify_uid) {
					uni.showToast({
						icon: "none",
						title: "请选择整改负责人",
					});
					return false;
				}
				if (!this.fromData.rectify_problem) {
					uni.showToast({
						icon: "none",
						title: "请输入整改问题",
					});
					return false;
				}
			}
			return true;
		},
		isReportChange(val) {
			this.$emit("changeReport", val);
		},

		// 点击选择整改负责人
		selectExecuteUser(type) {
			if (this.disabled) return;
			uni.navigateTo({
				url: "/pages/common/user/user",
				events: {
					someEvent: (data) => {
						console.log("someEvent", data);
						this.fromData.rectify_uid = data.value;
						this.fromData.rectify_name = data.label;
					},
				},
				success: (res) => {
					let radioLabel = "";
					let radioValue = "";
					let data = {
						isMultiple: false,
						radioLabel,
						radioValue,
						checkboxValue: [],
						labelList: [],
					};

					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptData", data);
				},
			});
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
			this.change();
		},
		change() {
			// this.picture = this.fileList1.map((item) => item.url);
			this.picture = this.fileList1.map((item) => item.noBaseUrl);
			console.log("picture---change", this.picture);
			this.$emit("changeUpload", this.picture);
		},
		// 新增图片
		async afterRead(event) {
			console.log("event", event);
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
			// latitude: 22.71991 longitude: 114.24779
			for (let i = 0; i < lists.length; i++) {
				const result = await uploadFilePromise(lists[i].url, true, { latitude: this.latitude, longitude: this.longitude });
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
	},
};
</script>
<style lang="scss"></style>
