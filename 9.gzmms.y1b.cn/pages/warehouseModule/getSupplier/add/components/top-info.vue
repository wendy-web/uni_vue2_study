<template>
	<view class="top-info">
		<view class="top-info-item">
			<text class="label-text">出库日期</text>
			<uv-input
				placeholder="请选择日期"
				border="surround"
				v-model="out_time"
				readonly
				:customStyle="{ borderColor: inSelectDate ? '#3c9cff !important' : '' }"
				@click.native="selectDate"
			>
				<template v-slot:suffix>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-input>
		</view>
		<view class="top-info-item">
			<text class="label-text">出库仓库</text>
			<uv-input
				v-model="warehouse_name"
				readonly
				placeholder="请选择出库仓库"
				@click.native="showWarehouse"
				:disabled="goodsLen > 0"
			>
				<template v-slot:suffix>
					<uv-icon name="arrow-right"></uv-icon>
				</template>
			</uv-input>
		</view>
		<view class="top-info-item">
			<text class="label-text">单据备注</text>
			<uv-input placeholder="请输入内容" border="surround" v-model="note"></uv-input>
		</view>
		<view class="top-info-item">
			<text class="label-text">领料类型</text>
			<uv-input
				placeholder="请选择领料类型"
				border="surround"
				v-model="rec_type_name"
				readonly
				:customStyle="{ borderColor: inSelectDate ? '#3c9cff !important' : '' }"
				@click.native="openPicker"
			>
				<template v-slot:suffix>
					<view class="flex">
						<view class="" style="margin-right: 20rpx" @click.stop="clearRecType" v-if="rec_type_name">
							<uv-icon name="close-circle" size="20"></uv-icon>
						</view>
						<uv-icon name="arrow-right"></uv-icon>
					</view>
				</template>
			</uv-input>
		</view>
		<view class="top-info-item">
			<text class="label-text">领料申请人</text>
			<view class="label-value">
				<view class="value-content">
					<uv-tags :text="rp_uname" shape="circle" plain></uv-tags>
				</view>
				<view class="value-add">
					<uv-button
						type="primary"
						icon="plus"
						plain
						:customStyle="{ width: '48rpx', height: '48rpx' }"
						iconSize="14"
						iconColor="#3c9cff"
						@click="selectUser(1)"
					></uv-button>
				</view>
			</view>
		</view>
		<view class="top-info-item">
			<text class="label-text">指定领取人</text>
			<view class="label-value">
				<view class="value-wrapper">
					<view
						class="value-content"
						:class="index === 0 && ar_uname.length > 1 ? 'zero' : ''"
						v-for="(item, index) in ar_uname"
						:key="item"
					>
						<uv-tags :text="item" shape="circle" plain closable @close="delSelectUser(index)"></uv-tags>
					</view>
				</view>

				<view class="value-add">
					<uv-button
						type="primary"
						icon="plus"
						plain
						:customStyle="{ width: '48rpx', height: '48rpx' }"
						iconSize="14"
						iconColor="#3c9cff"
						@click="selectUser(2)"
					></uv-button>
				</view>
			</view>
		</view>
		<view class="top-info-item">
			<text class="label-text">指定审批人</text>
			<view class="label-value">
				<view class="value-content" v-if="ap_uname">
					<uv-tags :text="ap_uname" shape="circle" closable plain @close="delApuname"></uv-tags>
				</view>
				<view class="value-add">
					<uv-button
						type="primary"
						icon="plus"
						plain
						:customStyle="{ width: '48rpx', height: '48rpx' }"
						iconSize="14"
						iconColor="#3c9cff"
						@click="selectUser(3)"
					></uv-button>
				</view>
			</view>
		</view>
		<!-- 选择仓库picker组件 -->
		<uv-picker ref="whPicker" :columns="whPickerColumns" @confirm="warehouseConfirm" keyName="name"></uv-picker>
		<uv-picker ref="picker" :columns="pickerColumns" @confirm="pickerConfirm" keyName="name"></uv-picker>
		<uv-calendars ref="calendars" @confirm="dateConfirm" @close="inSelectDate = false" />
	</view>
</template>

<script>
import dayJs from "@/utils/dayjs.min.js";
import { mapGetters } from "vuex";
import { getRecTypeApi, storageListApi } from "@/api/modules/common.js";
/**
 * 本组件是新建领料单头部信息组件
 * @property {Number} listId 列表传入的id,如果id存在则表示是编辑
 */
export default {
	props: {
		listId: 0,
		goodsLen: 0,
	},
	// 这里存放数据
	data() {
		return {
			whPickerColumns: [], //仓库picker数据
			pickerColumns: [], //picker数据
			out_time: dayJs().format("YYYY-MM-DD"), //出库日期
			note: "", //备注
			inSelectDate: false, //
			rp_uname: "", //领料申请人名称
			rp_uid: undefined, //领料申请人id;
			ar_uname: [], //指定领取人名称
			ar_uid: [], //指定领取人id数组
			ap_uname: "", //指定审批人名称
			ap_uid: undefined, // 指定审批人id
			selectUserType: 1, // 1选择领料申请人,2选择指定领取人,3选择指定审批人
			rec_type: undefined,
			rec_type_name: "",
			warehouse_name: "",
			warehouse_id: 0,
		};
	},
	mounted() {
		if (!this.listId) {
			this.initInfo();
		}
		this.getSupRecType();
		this.getStorageList();
	},
	// 方法集合
	methods: {
		// 仓库选择确认
		warehouseConfirm(e) {
			let value = e.value[0];
			console.log("value", value);
			this.warehouse_name = value.name;
			this.warehouse_id = value.id;
			this.$emit("selelctWh", { warehouse_name: value.name, warehouse_id: value.id });
		},
		// 获取仓库列表数据
		async getStorageList() {
			const result = await storageListApi({ type: 1 });
			this.whPickerColumns.push(result.data.list);
		},
		// 显示选择仓库
		showWarehouse() {
			if (this.goodsLen) {
				uni.$uv.toast("已有选择商品,不可切换仓库");
				return;
			}
			this.$refs.whPicker.open();
		},
		// 清除领料类型
		clearRecType() {
			this.rec_type = undefined;
			this.rec_type_name = "";
		},
		initInfo() {
			this.rp_uname = this.userInfo.name;
			this.rp_uid = this.userInfo.id;
			this.ar_uname.unshift(this.userInfo.name);
			this.ar_uid.unshift(this.userInfo.id);
		},
		async getSupRecType() {
			const result = await getRecTypeApi();
			this.pickerColumns.push(result.data);
			console.log("this.pickerColumns", this.pickerColumns);
		},
		// 点击选择日期
		selectDate() {
			this.$refs.calendars.open();
			this.inSelectDate = true;
		},
		dateConfirm(e) {
			this.out_time = e.fulldate;
		},
		// 点击选择人员
		selectUser(type) {
			this.selectUserType = type;
			uni.navigateTo({
				url: "/pages/common/user/user",
				events: {
					someEvent: (data) => {
						console.log("someEvent", data);
						if (this.selectUserType === 1) {
							this.rp_uname = data.label;
							this.rp_uid = data.value;
						} else if (this.selectUserType === 2) {
							this.ar_uid = [...data.ar_uid];
							this.ar_uname = [...data.ar_uname];
							console.log("this.ar_uname", this.ar_uname);
						} else {
							this.ap_uname = data.label;
							this.ap_uid = data.value;
						}
					},
				},
				success: (res) => {
					let radioLabel = "";
					let radioValue = "";
					if (this.selectUserType === 2) {
						// 如果是选择指定领取人
						radioLabel = "";
						radioValue = "";
					} else if (this.selectUserType === 1) {
						// 如果是选择 领料申请人
						radioLabel = this.rp_uname ? this.rp_uname : this.defaultUser;
						radioValue = this.rp_uid ? this.rp_uid : this.defaultUid;
					} else if (this.selectUserType === 3) {
						// 如果是选择 指定审批人
						radioLabel = this.ap_uname ? this.ap_uname : "";
						radioValue = this.ap_uid ? this.ap_uid : 0;
					}
					let data = {
						isMultiple: this.selectUserType === 2,
						radioLabel,
						radioValue,
						checkboxValue: this.selectUserType === 2 ? this.ar_uid : [],
						labelList: this.selectUserType === 2 ? this.ar_uname : [],
					};
					// 通过eventChannel向被打开页面传送数据
					res.eventChannel.emit("acceptData", data);
				},
			});
		},
		// 删除指定领取人
		delSelectUser(e) {
			let index = e;
			this.ar_uid.splice(index, 1);
			this.ar_uname.splice(index, 1);
		},
		// 删除指定审核人
		delApuname() {
			this.ap_uname = "";
			this.ap_uid = 0;
		},
		// 选择领料类型
		openPicker() {
			this.$refs.picker.open();
		},
		// 领料类型picker确认
		pickerConfirm(e) {
			console.log("e", e);
			this.rec_type_name = e.value[0].name;
			this.rec_type = e.value[0].rec_type;
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
};
</script>
<style lang="scss">
.top-info {
	background-color: #ffffff;
	padding-bottom: 30rpx;
	.top-info-item {
		display: flex;
		align-items: center;
		padding: 20rpx 40rpx;
		padding-bottom: 0;
		min-height: 60rpx;
		.label-text {
			display: inline-block;
			margin-right: 20rpx;
			flex-shrink: 0;
		}
		.label-value {
			// flex: 1;
			display: flex;
			// justify-content: space-between;
			align-items: center;
			.value-wrapper {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.value-content {
					margin-right: 12rpx;
					// margin-bottom: 8rpx;
					&.zero {
						margin-top: 14rpx;
					}
				}
			}
			.value-add {
				margin-left: 40rpx;
			}
		}
	}
}
</style>
