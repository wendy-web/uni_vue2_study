<template>
<uv-popup ref="popup" mode="bottom" closeable closeIconPos="top-left">
	<uv-sticky :offset-top="0">
		<view class="width-full all-p-t-30 all-p-b-30 display_column_end text-align-c uv-border-bottom" style="background-color: #fff;width: 100vw;">
			<!-- <uv-icon name="arrow-left" color="#333" size="24" @click="close"></uv-icon> -->
			<text class="width-full position-a t-w-bold">{{titleText}}</text>
			<view class="all-p-r-30" style="z-index: 1;" @click="confirmHandle">确认</view>
		</view>
	</uv-sticky>
	<view class="sel_cont">
		<view class="width-full all-p-lr-30">
			<uv-checkbox-group v-model="checkboxValue" placement="column" @change="changeSelHandle">
				<view class="width-full uv-border-bottom"
					v-for="(item, index) in faultTypeOptions" :key="index">
					<uv-checkbox
						:label="item[labelText]"
						:name="item.id"
						activeColor="#01C29F"
					>
						<view class="width-full all-p-t-20 all-p-b-20 " slot="default">
							{{ item[labelText] }}
						</view>
					</uv-checkbox>
				</view>
			</uv-checkbox-group>
		</view>
	</view>
</uv-popup>
</template>

<script>
export default {
	props: {
		titleText: {
			type: String,
			default: '选择故障类型'
		},
		isShow: {
			type: Boolean,
			default: false,
		},
		faultTypeOptions: {
			type: Array,
			default: []
		},
		labelText: {
			type: String,
			default: 'name'
		}
	},
	// 这里存放数据
	data() {
		return {
			checkboxValue: [],
		};
	},
	methods: {
		close() {
			this.$refs.popup.close();
		},
		open(alertCheck) {
			this.checkboxValue = alertCheck;
			this.$refs.popup.open();
		},
		changeSelHandle(event) {
			this.checkboxValue = event;
		},
		confirmHandle(){
			this.close();
			this.$emit('confirm', this.checkboxValue);
		}
	},
};
</script>
<style lang="scss">
.sel_cont {
	// width: 600rpx;
	// height: calc(100vh - 192rpx);
	overflow: hidden;
	overflow-y: scroll;
	box-sizing: border-box;
	position: relative;
	padding-bottom: env(safe-area-inset-bottom);
	// display: flex;
	// flex-direction: column;
	// align-items: center;
	// .tree-view-sc {
	// 	flex: 1;
	// 	align-self: stretch;
	// 	justify-self: stretch;

	// }
}
.submit-wrapper {
	padding: 40rpx;
}
</style>
