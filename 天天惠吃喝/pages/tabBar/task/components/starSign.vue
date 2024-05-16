<template>
	<view class="box">
		<view class="flex-row-between">
			<view class="title">{{taskReward.title}}</view>
			<view class="flex-row-between">
				<image class="icon-beans" :src="imgUrl+'/task/icon_beans.png'" mode="aspectFit" lazy-load></image>
				<view class="subtitle">{{taskReward.subtitle}}</view>
			</view>
		</view>
		<view class="content" @click="checkGender(true)">
			<!-- 背景图 -->
			<van-image class="bg-star-sign" use-loading-slot lazy-load width="702rpx" height="562rpx"
				:src="taskReward.image">
				<van-loading slot="loading" type="spinner" size="20" vertical />
			</van-image>
		</view>
		<!-- 性别弹窗 -->
		<van-popup :show="genderShow" @close="onClose" closeable round>
			<view class="gender-pop">
				<view class="gender-title">怎么称呼</view>
				<view class="gender-item" @click="selectGender(1)">
					<image class="icon-gender" mode="aspectFit" :src="imgUrl+'/task/icon_gender_boy.png'"></image>
					<view>先生</view>
				</view>
				<view class="gender-item" @click="selectGender(2)">
					<image class="icon-gender" mode="aspectFit" :src="imgUrl+'/task/icon_gender_girl.png'"></image>
					<view>女士</view>
				</view>
			</view>
		</van-popup>
		<!-- 生日、星座picker弹窗 -->
		<van-popup :show="birthShow" @close="onClose" round position="bottom" custom-style="width:100%">
			<view class="birth-pop">
				<van-datetime-picker type="date" :value="currentDate" :min-date="minDate" :max-date="maxDate"
					:formatter="formatter" visible-item-count="3" @change="dateChange" @confirm="dateConfirm"
					@cancel="birthShow=false" />
				<view class="star-sign-name">
					<view>{{starSignName}}</view>
					<image class="icon-omega" mode="aspectFit" :src="imgUrl+'/task/icon_omega.png'"></image>
				</view>
			</view>
		</van-popup>

	</view>
</template>

<script>
	import {
setConstellation,
setGender
} from '@/api/modules/task.js';
import { getImgUrl } from '@/utils/auth.js';
import { parseTime } from '@/utils/index.js';
import { mapGetters } from 'vuex';
import { getAstro } from '../utils/index.js';
	let _request = false;
	export default {
		props: {
			userInfo: Object,
			taskReward: {
				type: Object,
				default: () => {}
			}
		},
        computed: {
			...mapGetters(['isAutoLogin'])
		},
		data() {
			return {
				genderShow: false, //性别选择弹窗
				birthShow: false, //生日星座弹窗
				currentDate: new Date('1990/06/15').getTime(),
				minDate: new Date('1900/01/01').getTime(),
				maxDate: new Date().getTime(),
				starSignName: '', //星座名
				isConfirmed: false, //点击日期确认，未确认，从性别开始选择
				gender: '', //性别
				constellation: '', //星座对应数字，后台传参
				birthday: '', //生日
				imgUrl: getImgUrl()
			}
		},
		// computed:{
		// 	starSignName:
		// },
		methods: {
			init() {
				let date = parseTime(new Date(), "{y}年{m}月{d}日");
				this.dateToStar(date)
			},
			formatter(type, value) {
				if (type === 'year') {
					return `${value}年`;
				}
				if (type === 'month') {
					return `${value}月`;
				}
				if (type === 'day') {
					return `${value}日`;
				}
				return value;
			},
			selectGender(num) {
				// 防止重复请求
				if (_request) return _request = true;
				this.gender = num;
				let params = {
					gender: num
				}
				setGender(params).then(res => {
					_request = false;
					let {
						code,
						msg
					} = res;
					if (code == 1) {
						this.$emit("getUserInfo")
						this.userInfo.gender = num;
						this.checkGender();
						return
					}
					return this.$emit("showToast", {
						msg,
						position: 'bottom'
					})
				}).catch(err => {
					_request = false;
				})

			},
			onClose() {
				this.genderShow = false;
				this.birthShow = false;
			},
			checkGender(isBgClick = false) {
                if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
				isBgClick && this.$wxReportEvent('constellation');
				let {
					gender,
					constellation
				} = this.userInfo;
				if (gender == 0) {
					this.birthShow = false;
					this.genderShow = true;
					return;
				}
				if (constellation == 0) {
					this.genderShow = false;
					this.birthShow = true;
					return;
				}
				uni.showModal({
					title: '提示',
					content: '性别和星座都设置了',
					showCancel: false
				})
			},
			showBirth() {
				this.birthShow = true;
			},
			dateChange(e) {
				let arr = e.detail.getValues();
				let date = arr.join("");
				this.dateToStar(date)
			},
			dateConfirm(e) {
				let { detail } = e;
				let date = new Date(detail);
				let format_date = parseTime(detail, "{y}年{m}月{d}日");
				this.birthday = parseTime(detail, "{y}-{m}-{d}")

				let time_stamp = date.getTime();
				this.isConfirmed = true;
				this.dateToStar(format_date)


				// 防止重复请求
				if (_request) return _request = true;
				let params = {
					constellation: this.constellation,
					birthday: this.birthday
				}
				setConstellation(params).then(res => {
					_request = false;
					let {
						code,
						msg
					} = res;
					if (code == 1) {
						this.$emit("starSignSuccess")
						this.birthShow = false;
						this.userInfo.constellation = this.constellation;
						// this.checkGender();
						return
					}
					return this.$emit("showToast", {
						msg,
						position: 'bottom'
					})
				}).catch(err => {
					_request = false;
				})
			},
			//日期换算星座
			dateToStar(date) {
				let obj = getAstro(date);
				if (obj) {
					this.starSignName = obj.name;
					this.constellation = obj.index;
					// obj.index 是传给后台的
				}
			}
		}
	}
</script>

<style lang="scss">
	.box {
		box-sizing: border-box;
		margin: 64rpx 24rpx;
	}

	.content {
		box-sizing: border-box;
		width: 702rpx;
		height: 562rpx;
		position: relative;
		margin-top: 32rpx;
		padding-bottom: 6rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		z-index: 1;
	}

	.bg-star-sign {
		width: 702rpx;
		height: 562rpx;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}

	.btn {
		width: 276rpx;
		height: 72rpx;
	}

	.gender-pop {
		width: 530rpx;
		height: 328rpx;
		background: #ffffff;
		border-radius: 24rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.gender-title {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		font-weight: 400;
		color: #333333;
		letter-spacing: 0.66px;
		text-align: center;
	}

	.gender-item {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 434rpx;
		height: 80rpx;
		border: 1rpx solid #e1e1e1;
		border-radius: 16rpx;
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
		line-height: 40rpx;
		letter-spacing: 0.62px;
		margin-top: 20rpx;
	}

	.icon-gender {
		width: 40rpx;
		height: 40rpx;
	}

	.birth-pop {
		width: 100%;
		height: 478rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 40rpx;
	}

	.star-sign-name {
		width: 622rpx;
		height: 76rpx;
		line-height: 76rpx;
		text-align: center;
		margin: 0 auto;
		background: #ffffff;
		border: 1rpx solid rgba(202, 151, 103, 0.50);
		border-radius: 16rpx;
		font-size: 24rpx;
		font-weight: 500;
		color: #333333;
		letter-spacing: 0.52px;
		position: relative;
		z-index: 2;

		.icon-omega {
			z-index: -1;
			width: 118rpx;
			height: 76rpx;
			position: absolute;
			top: 0;
			right: 190rpx;
			margin: 0 auto;
		}
	}
</style>
