<template>
	<view class="record-bottled">
		<!-- icon -->
		<image class="nav-icon" src="https://file.y1b.cn/public/hn29th/record/icon_01.png" mode="aspectFill" />
		<!-- 背景 -->
		<image class="page-bg" src="https://file.y1b.cn/public/hn29th/record/icon_03.png" mode="aspectFill" />
		<!-- 导航 -->
		<xh-navbar navber-color="transparent" left-image="/static/images/left_black_arrow.png" :is-no-occupant="true">
			<view slot="title" class="record-title">
				扫码记录
			</view>
		</xh-navbar>
		<mescroll-body ref="mescrollRef" :top="navHeight+'px'" :sticky="true" @init="mescrollInit" @down="downCallback"
			@up="upCallback">
			<view class="sr-date-select">
				<view class="sr-date-btn" @click="showCalendar">
					<van-icon name="calendar-o" color="#000000" size="30rpx" />
					<view class="notice">日期筛选</view>
					<image class="sr-date-icon" :class="{'open':isOpen}" src="/pages/zm/static/date_select_icon.png"
						mode="widthFix">
					</image>
				</view>
				<view class="sr-date-btn-text" v-if="select_time.length>0">
					<view class="select-date-text">
						{{select_time[0]}}~{{select_time[1]}}
					</view>
					<image @click="reset" class="reset-icon" src="/pages/zm/static/close.png"></image>
				</view>
			</view>
			<!-- 数据列表 -->
			<view class="sr-scan-item" v-for="(item,index) in listData" :key="index">
				<view class="sr-scan-item-header">
					<text>{{item.title}}</text>
					<text class="sr-scan-item-num">+1</text>
				</view>
				<view class="sr-scan-item-time">
					{{item.create_time}}
				</view>
			</view>
		</mescroll-body>
		<!-- 时间范围 -->
		<van-calendar :show="isOpen" type="range" allow-same-day :default-date="[Date.now(),Date.now()]"
			@close="onClose" confirm-disabled-text="请选择结束时间" :min-date="minDate" :max-date="maxDate"
			@confirm="onConfirm" />
	</view>
</template>

<script>
	import mixin from "./common/mixin.js"
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		getNavbarData
	} from "@/utils/xhNavbar.js"
	export default {
		mixins: [MescrollMixin, mixin],
		data() {
			return {
				navHeight: 100,
			}
		},
		async onLoad() {
			let data = await getNavbarData()
			this.navHeight = data.navBarHeight + data.statusBarHeight
		}
	}
</script>

<style lang="scss">
	@import "./common/index.less";

	.record-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #000000;
		letter-spacing: 1.58rpx;
	}

	.nav-icon {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 168rpx;
		z-index: 1;
	}

	.page-bg {
		position: fixed;
		right: 0;
		top: 168rpx;
		width: 520rpx;
		height: 1456rpx;
		z-index: -1;
	}
</style>