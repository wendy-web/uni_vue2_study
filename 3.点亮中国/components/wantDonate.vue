<template>
	<view class="want-donate">
		<!-- 立即捐能量 -->
		<van-popup :show="show" position="bottom" round closeable safe-area-inset-bottom @close="popupClose">
			<view class="popup-title">
				捐能量
			</view>
			<view class="popup-stepper-center">
				<van-button icon="minus" type="primary" round color="linear-gradient(90deg,#ec6536 16%, #f0984c 92%)"
					@click="minus" :disabled="form.love<=1" :custom-style="inputCustomStyle" />
				<van-field :value="form.love" input-align="center" type="number" :border="false" @blur="fieldChange"
					custom-style="background-color: transparent;font-size:42rpx;color:#000018;" />
				<van-button icon="plus" type="primary" round color="linear-gradient(90deg,#ec6536 16%, #f0984c 92%)"
					@click="plus" :disabled="form.love>=availableLoveNum" :custom-style="inputCustomStyle" />
			</view>
			<view class="popup-tips">
				当前还有{{availableLoveNum}}能量可捐
				<text class="popup-tips_all" @click="allLoveNumHandle">全部捐出</text>
			</view>
			<view class="popup-donate-btn popup-donate-btn-center">
				<van-button round block color="linear-gradient(90deg,#ec6536 16%, #f0984c 92%)" @tap="donate">
					立即捐能量
				</van-button>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {
		donate,
		getCommonwealWxMsgId
	} from '@/api/modules/love.js';
	import {
		parseTime
	} from '@/utils/index.js';
	import {
		callWxMsgAuth
	} from '@/api/modules/home.js';
	let _teamId = ''
	export default {
		data() {
			return {
				show: false,
				availableLoveNum: 0,
				inputCustomStyle: 'height:72rpx;width:72rpx;padding:0;display:flex;align-items: center;justify-content: center;',
				type: 0,
				form: {
					love: 1,
					com_id: ''
				},
				miniDonatNum: 1,
				isH5: 0
			}
		},
		methods: {
			plus() {
				this.form.love++
			},
			minus() {
				this.form.love--
			},
			showTime({
				type,
				id,
				love,
				teamId,
				miniDonatNum,
				isH5
			}) {
				this.isH5 = isH5;
				this.availableLoveNum = love;
				this.type = type;
				this.form.com_id = Number(id);
				this.form.love = miniDonatNum;
				this.miniDonatNum = miniDonatNum;
				_teamId = teamId;
				this.show = true;
			},
			fieldChange(e) {
				//值
				let num = Number(e.detail.value)
				let availableLoveNum = Number(this.availableLoveNum)
				//非数字处理
				if (/\D/g.test(num) || !num || num < 1) {
					let love = this.form.love
					this.form.love = typeof love == 'number' ? '1' : 1
					return;
				}
				//大于最大值处理
				if (num > this.availableLoveNum) {
					let love = this.form.love;
					this.form.love = typeof love == 'number' ? availableLoveNum + '' : availableLoveNum
					return
				}
				//正常赋值
				this.form.love = num
			},
			popupClose() {
				this.form.love = this.miniDonatNum;
				this.show = false;
			},
			donate() {
				/*项目详情【立即捐能量】 */
				wx.reportEvent("click_projectncenergy", {
					authorized_or_not: 1,
					scenario_value: this.isH5
				});
				let WantDonateDate = uni.getStorageSync('wantDonateDate');
				if (!WantDonateDate || (parseTime(WantDonateDate, '{y}-{m}-{d}') !== parseTime(Date.now(),
					'{y}-{m}-{d}'))) {
					getCommonwealWxMsgId().then(res => {
						if (res.data) {
							uni.requestSubscribeMessage({
								tmplIds: [res.data],
								complete: (e) => {
									this.immediateDonate();
								},
								success(e) {
									/*回调*/
									callWxMsgAuth({
										template: 'jstx'
									}).then(res => {})
								}
							})
							/*记录发起时间*/
							uni.setStorageSync('wantDonateDate', Date.now())
							return;
						}
						this.immediateDonate();
					});
					return;
				}
				this.immediateDonate();
			},
			immediateDonate() {
				let parmas = {
					...this.form
				}
				if (this.type == 1) parmas.team_id = _teamId;
				if (parmas.love < this.miniDonatNum) {
					return uni.showToast({
						icon: 'none',
						title: '本次最小捐献数为' + this.miniDonatNum + ''
					})
				}
				donate(parmas).then(res => {
					console.log('res-------', res)
					if (res.code == 1) {
						this.show = false
						const {
							cert_content,
							cert_date,
							user,
							team,
							share_title
						} = res.data
						const image = parmas.team_id ? team.image : user.avatar_url
						const name = parmas.team_id ? team.name : user.nick_name
						this.$emit('wantDonateBack', {
							image,
							name,
							cert_content,
							share_title,
							time: cert_date
						}, parmas.love)
						return this.popupClose();
					}
					uni.showToast({
						icon: 'none',
						title: res.msg
					});
				});
			},
			allLoveNumHandle() {
				this.form.love = this.availableLoveNum;
			}
		}
	}
</script>

<style lang="scss">
	.want-donate {
		.popup-stepper-center {
			text-align: center;
			width: 418rpx;
			padding: 10rpx;
			background-color: #f1f1f1;
			border-radius: 24px;
			display: flex;
			align-items: center;
			margin: 0 auto;
		}

		.plus,
		.popup-tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
			letter-spacing: 0.19px;
			margin-top: 10rpx;
			margin-bottom: 48rpx;
			text-align: center;
			.popup-tips_all {
				color: #1684FC;
				margin-left: 20rpx;
			}
		}

		.popup-title {
			font-size: 32rpx;
			font-weight: 700;
			color: #000018;
			text-align: center;
			padding-top: 40rpx;
			margin-bottom: 30rpx;
		}

		.popup-donate-btn {
			width: 464rpx;
		}

		.popup-donate-btn-center {
			margin: 0 auto;
			padding-bottom: 60rpx;
		}
	}
</style>
