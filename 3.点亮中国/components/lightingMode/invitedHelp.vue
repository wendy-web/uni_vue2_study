<template>
	<view class="invited-popup">
		<van-popup :show="show" @close="popupClose" custom-style="background-color: transparent;"
			:close-on-click-overlay="false" :z-index="10000">
			<view class="invited-popup-box">
				<!-- 背景 -->
				<image class="close_icon" src="/static/images/icon_close.png" mode="aspectFill" @click="popupClose" ></image>
				<van-image width="604rpx" height="724rpx" src="https://file.y1b.cn/public/img/dlzg/yqzl_bg.png"
					fit="cover" use-loading-slot>
					<van-loading slot="loading" type="spinner" size="20" vertical />
				</van-image>
					<button class="create-team-btn" style='font-size: 13px !important;' data-name="help" open-type="share" @click="invite">邀请好友</button>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				show: false,
				scenario_value: 0
			}
		},
		computed: {
			...mapGetters(['isAuthorization']),
		},
		methods: {
			popupShow(scenario_value = 0) {
				this.show = true;
				this.scenario_value = scenario_value
			},
			popupClose() {
				this.show = false
			},
			invite() {
				/*好友助力【邀请好友】 */
				wx.reportEvent("click_invitefriends", {
					authorized_or_not: Number(this.isAuthorization),
					scenario_value: this.scenario_value
				});
				this.show = false;
			}
		}
	}
</script>

<style lang="scss">
	.invited-popup {
		.invited-popup-box {
			position: relative;
			width: 604rpx;
			height: 724rpx;
			font-size: 0;
			.close_icon{
				position: absolute;
				width: 21rpx;
				height: 21rpx;
				top: 14rpx;
				right: 14rpx;
				color: #ccc;
				padding: 10rpx;
				z-index: 1;
			}
		}
		.create-team-btn {
			position: absolute;
			left:0;
			right:0;
			margin: auto;
			bottom: 50rpx;
			width: 296rpx;
			line-height: 72rpx;
			background: linear-gradient(180deg,#ffad08, #f58631);
			border: 4rpx solid #fedbce;
			border-radius: 40rpx;
			color: #fff;
		}
	}
</style>
