<template>
	<view class="width-full contentBox position-r all-m-b-30">
		<view class="width-full all-p-lr-30 all-p-t-30 display_row_center">
			<image class="iconBox" src="/static/otherImg/equipmentImg2.png"></image>
			<text class="title-label all-m-l-10 t-c-000018 t-w-bold f-s-32">整改情况</text>
			<text class="red-text">*</text>
		</view>
		<view class="width-full all-p-lr-30 all-p-t-30">
			<view class="width-full all-p-t-30 display_row_center">
				<image class="iconBox" src="/static/otherImg/planFarmTitleIcon1.png"></image>
				<text class="all-m-l-10 t-c-000018 f-s-32 t-w-bold">检查项内容</text>
			</view>
			<view class="width-full t-c-000018 all-m-t-30" v-for="(item, index) in rectify_list" :key="index">
				<view class="width-full titleText">{{ index + 1 }}、{{ item.item_content }}</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15">
					<text>检查方法：</text>
					<text class="t-c-6F6F6F">{{ item.method || "--" }}</text>
				</view>
				<view class="width-full display_row_center f-s-24 all-m-t-15">
					<text>标准说明：</text>
					<text class="t-c-6F6F6F">{{ item.std_explain || "--" }}</text>
				</view>
				<template v-if="item.record_method == 0">
					<!-- 0是单选 -->
					<uv-form-item label-width="0">
						<uv-radio-group
							v-model="item.val"
							placement="column"
							size="18"
							iconSize="18"
							:disabled="disabled"
						>
							<uv-radio
								:customStyle="{
									margin: '8px',
									border: '2rpx solid',
									borderColor: newitem.is_normal ? '#FFDEDE ' : '#D6FBD9',
									borderRadius: '8rpx',
									height: '80rpx',
									paddingLeft: '20rpx',
									background: newitem.is_normal ? '#FFF6F6 ' : '#F5FFF7',
								}"
								v-for="(newitem, newindex) in item.result_content"
								:key="newindex"
								:label="newitem.val"
								:name="newindex"
								:disabled="disabled"
							></uv-radio>
						</uv-radio-group>
					</uv-form-item>
				</template>
				<template v-if="item.record_method == 1">
					<uv-form-item label-width="0">
						<!-- 1是多选 -->
						<uv-checkbox-group v-model="item.val" placement="column" :disabled="disabled">
							<uv-checkbox
								:customStyle="{
									margin: '8px',
									border: '2rpx solid',
									borderColor: newitem.is_normal ? '#FFDEDE ' : '#D6FBD9',
									borderRadius: '8rpx',
									height: '80rpx',
									paddingLeft: '20rpx',
									background: newitem.is_normal ? '#FFF6F6 ' : '#F5FFF7',
								}"
								v-for="(newitem, newindex) in item.result_content"
								:key="newindex"
								:label="newitem.val"
								:name="newindex"
								:disabled="disabled"
							></uv-checkbox>
						</uv-checkbox-group>
					</uv-form-item>
				</template>
				<template v-if="item.record_method == 2">
					<!-- 2是输入数值 -->
					<view class="width-full display_row_center f-s-24 all-m-t-15">
						<text>上限：</text>
						<text class="t-c-6F6F6F">{{ item.upper_limit_val }}</text>
					</view>
					<view class="width-full display_row_center f-s-24 all-m-t-15">
						<text>下限：</text>
						<text class="t-c-6F6F6F">{{ item.lower_limit_val }}</text>
					</view>

					<uv-form-item label-width="0">
						<uv-input
							v-model="item.val"
							type="digit"
							placeholder="请输入"
							@blur="handleBlur($event, index)"
							:disabled="disabled"
						></uv-input>
					</uv-form-item>
				</template>
				<template v-if="item.record_method == 3">
					<!-- 3是文本 -->
					<uv-form-item label-width="0">
						<uv-input v-model="item.val" placeholder="请输入" :disabled="disabled"></uv-input>
					</uv-form-item>
				</template>
				<uv-form-item label="备注说明:" label-width="100">
					<uv-input v-model="item.note" placeholder="非必填" :disabled="disabled"></uv-input>
				</uv-form-item>
			</view>
		</view>

		<view class="width-full all-p-lr-40 all-m-t-20 all-p-b-30">
			<uv-form-item label="整改时间:" prop="rectify_time" required @click="showTimeSelect()">
				<uv-input
					v-model="formData.rectify_time"
					disabled
					:disabledColor="disabled ? '#F5F7FA' : '#ffffff'"
					placeholder="请选择整改时间"
					suffixIcon="calendar"
				></uv-input>
			</uv-form-item>
			<uv-form-item label="整改反馈:" prop="rectify_feedback" required>
				<uv-textarea v-model="formData.rectify_feedback" placeholder="请输入内容" :disabled="disabled"></uv-textarea>
			</uv-form-item>
			<uv-form-item label="整改后照片(最多4张):" label-width="200" labelPosition="top" required>
				<div style="margin-top: 8rpx">
					<uv-upload
						:fileList="fileList2"
						name="2"
						:maxCount="4"
						multiple
						:previewFullImage="true"
						@afterRead="afterRead"
						@delete="deletePic"
						:disabled="disabled"
						:deletable="!disabled"
						capture="camera"
					></uv-upload>
				</div>
			</uv-form-item>
		</view>
		<uv-datetime-picker
			ref="datetimePicker"
			v-model="datetimeValue"
			mode="datetime"
			@confirm="timeSelectConfirm"
		></uv-datetime-picker>
	</view>
</template>

<script>
import { changeDetail, changeTable, getCheckTotal } from "../index.js";
import { onlyNumPoint, uploadFilePromise } from "@/utils/device.js";
import { baseUrl } from "@/api/http/xhHttp.js";
export default {
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	// 这里存放数据
	data() {
		return {
			datetimeValue: Number(new Date()),
			formData: {
				rectify_time: "", //整改时间
				rectify_feedback: "", //整改反馈
			},
			fileList2: [],
			rectify_picture: [],
			rectify_list: [],
		};
	},

	mounted() {},
	// 计算属性
	computed: {},
	// 方法集合
	methods: {
		validateRectify() {
			let val_list = this.rectify_list.map((item) => {
				return item.val;
			});
			let someRes = val_list.some((item) => item === undefined || item === "");
			console.log("someRes", someRes);
			if (!this.formData.rectify_time || !this.formData.rectify_feedback || !this.rectify_picture.length || someRes) {
				console.log("请将整改内容填写完整");
				uni.showToast({
					icon: "none",
					title: "请将整改内容填写完整",
				});
				return false;
			}
			let sum = this.abnormalSum();

			if (sum >= 1) {
				uni.showToast({
					icon: "none",
					title: "整改-检查项内容,不可有异常项",
				});
				return false;
			}

			return true;
		},
		abnormalSum() {
			return getCheckTotal(this.rectify_list);
		},

		// checkValFn(item) {
		// 	let findRes = false;
		// 	if (item.record_method === 0) {
		// 		// 如果是单选
		// 		return item.result_content[item.val].is_normal === 1;
		// 	}else if(item.record_method === 1){

		// 	}
		// },

		setRectifyList(list) {
			console.log("setRectifyList", list);
			this.rectify_list = changeDetail(list);
			console.log("this.rectify_list", this.rectify_list);
		},
		// 数值框失去焦点时触发
		handleBlur(e, index) {
			let value = onlyNumPoint(e, 4);
			this.$set(this.rectify_list[index], "val", value);
		},
		// 点击选择时间
		showTimeSelect(type) {
			if (this.disabled) return;
			this.$refs.datetimePicker.open();
		},
		// 选择时间点击确认选择
		timeSelectConfirm(e) {
			let time = uni.$uv.timeFormat(e.value, "yyyy-mm-dd hh:MM");
			this.formData.rectify_time = time;
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
			this.change();
		},
		change() {
			this.rectify_picture = this.fileList2.map((item) => item.url);
			console.log("rectify_---change", this.rectify_picture);
			this.$emit("change", this.rectify_picture);
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
	},
};
</script>
<style lang="scss"></style>
