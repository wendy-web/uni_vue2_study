<template>
	<view class="grand-prize">
		<view class="grand-prize-head">
			<image class="grand-prize-banner" :src="grand_prize_souces[cactGetInfo.prizeratetype]" mode="aspectFill">
			</image>
		</view>
		<view v-if="!cactGetInfo.noWin">
			<view class="grand-prize-title">
				{{grand_title[cactGetInfo.prizeratetype]}}
				<!-- 待领取 -->
				<view class="unclaimed" v-if="cactGetInfo.status == 0">
					待领取
				</view>
				<!-- 已领取 -->
				<view class="received" v-else>
					已领取
				</view>
			</view>
			<view class="grand-prize-tips" v-if="!isNoEdit">
				请正确输入中奖者
				<text class="emphasize">姓名、身份证号、手机号码、联系地址</text>
				用于
				<text class="emphasize">红牛公司工作人员与获奖者联系、</text>
				确认奖品领取信息及作为
				<text class="emphasize">奖品领取核对凭证。一经确认不得修改。</text>
				请您保持电话畅通，在您确认中奖信息后，红牛公司将在10个工作日内安排当地分公司给您兑奖，奖品签收需提交本人身份证资料供红牛公司备案。
			</view>
			<view class="grand-prize-box">
				<view class="grand-prize-form">
					<van-cell-group :border="false">
						<van-field :value="cactGetInfo.name" :disabled="isNoEdit" placeholder="请输入真实姓名"
							placeholder-style="color:#4E4E4E;" @change="fieldChange" data-field="name" />
						<van-field :value="cactGetInfo.id_card" :disabled="isNoEdit" placeholder="请输入身份证号码"
							placeholder-style="color:#4E4E4E;" @change="fieldChange" data-field="id_card" />
						<view class="field-tips">
							*用以核对中奖者身份及为中奖者代缴个人所得税
						</view>
						<!-- 授权电话号码 -->
						<view class="authorized-telephone">
							<van-field v-model:value="cactGetInfo.mobile" :disabled="true" placeholder="请输入联系人手机号码"
								placeholder-style="color:#4E4E4E;" />
							<button v-if="!isNoEdit" class="zm-item-btn" open-type="getPhoneNumber"
								@getphonenumber="exchangeBefore"></button>
						</view>
						<van-field :value="cactGetInfo.region" :disabled="isNoEdit" placeholder="城市/区域"
							placeholder-style="color:#4E4E4E;" @change="fieldChange" data-field="region" />
						<van-field :value="cactGetInfo.detailed" :disabled="isNoEdit" placeholder="请输入详细地址"
							placeholder-style="color:#4E4E4E;" @change="fieldChange" data-field="detailed" />
					</van-cell-group>
					<view class="grand-prize-form-tips">
						*当前页面为验证兑奖联系人信息的凭证，若您在活动结束前未提交资料， 视为自愿放弃兑奖机会。
					</view>
				</view>
				<!-- 领取凭证 -->
				<view class="receive-vouchers-title" v-if="cactGetInfo.status == 1">
					领取凭证
				</view>
				<view class="receive-vouchers-list" v-if="cactGetInfo.status == 1">
					<view class="receive-vouchers-item" v-for="(item,index) in cactGetInfo.voucher" :key="index">
						<van-image width="118rpx" height="144rpx" fit="cover" :src="item" radius="6px" use-loading-slot>
							<van-loading slot="loading" type="spinner" size="20" vertical />
						</van-image>
					</view>
				</view>
			</view>
			<!-- 查看获奖名单 -->
			<view class="look-award-list" @click="goGrandPrizeList">
				查看获奖名单<van-icon name="arrow" />
			</view>
			<view class="submit-box" v-if="!isNoEdit">
				<view class="submit">
					<van-button block round type="danger" @click="submitReady" :disabled="isNoSubmit">提交</van-button>
				</view>
			</view>
		</view>
		<!-- 未中奖 -->
		<view v-else class="no-win">
			<image class="no-win-icon" src="/pages/scan/static/grandPrize/no_win_icon.png" mode="aspectFill"></image>
			<view class="no-win-text">
				扫红牛29周年拉环
				<view class="no-win-text">
					就有机会赢得29g足金纪念币哦
				</view>
			</view>
			<view class="look-award-list" @click="goGrandPrizeList">
				查看获奖名单<van-icon name="arrow" />
			</view>
		</view>
		<!-- 二次确认 -->
		<grand-prize-confirm ref="grandPrizeConfirm" @submit="submit" />
	</view>
</template>

<script>
	const grand_prize_souces = {
		6: '/pages/scan/static/grand_prize_banner.png',
		14: '/pages/scan/static/grand_prize_banner_29.png'
	}

	const grand_title = {
		6: '特等奖28g足金纪念金牌',
		14: '特等奖29g足金纪念金牌'
	}

	import {
		cactGetInfo,
		updateInfo
	} from '@/api/homeApi.js';
	import {
		mapGetters,
		mapActions
	} from 'vuex';

	import grandPrizeConfirm from './grandPrizeConfirm.vue'



	export default {
		components: {
			grandPrizeConfirm
		},
		data() {
			return {
				cactGetInfo: {
					id: '',
					uid: '',
					name: '',
					id_card: '',
					mobile: '',
					region: '',
					detailed: '',
					voucher: [],
					status: 0,
					pull_qr: '',
					scan_id: '',
					create_time: '',
					prizeratetype: 14
				},
				grand_title,
				grand_prize_souces,
				isNoEdit: false
			}
		},
		watch: {
			userInfo(j, k) {
				this.cactGetInfo.mobile = j.mobile
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			isNoSubmit() {
				let {
					name,
					id_card,
					mobile,
					region,
					detailed
				} = this.cactGetInfo
				return !name || !id_card || !mobile || !region || !detailed
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			...mapActions({
				updateUserMobile: 'login/updateUserMobile',
				getUserInfo: 'login/getUserInfo'
			}),
			init() {
				cactGetInfo().then(res => {

					if (!res.data || res.data.prizeratetype != 14) {
						this.cactGetInfo = {
							prizeratetype: 14,
							noWin: true
						}
						return
					}


					this.cactGetInfo = res.data

					let {
						id,
						name,
						id_card,
						mobile,
						detailed,
						region,
						voucher,
						status,
						prizeratetype
					} = res.data

					if (!mobile && this.userInfo.mobile) {
						mobile = this.userInfo.mobile
					}

					this.cactGetInfo = {
						id,
						name,
						id_card,
						mobile,
						detailed,
						region,
						voucher,
						status,
						prizeratetype: prizeratetype || 14
					}

					this.isNoEdit = id_card && mobile && detailed && region

				})
			},
			exchangeBefore(e) {
				this.updateUserMobile(e).then(res => {
					//异步更新用户信息
					this.getUserInfo(true);
				});
			},
			fieldChange(e) {
				let {
					detail,
					currentTarget,
					target
				} = e
				let key = (currentTarget || target).dataset.field
				this.cactGetInfo[key] = detail
			},
			submitReady() {

				let {
					name,
					id_card,
				} = this.cactGetInfo

				if (!/^[\u4e00-\u9fa5]{2,}$/.test(name)) {

					uni.showToast({
						icon: 'none',
						title: '请输入合规的姓名'
					})
					return
				}

				if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id_card)) {

					uni.showToast({
						icon: 'none',
						title: '请输入合规的身份证号码'
					})
					return
				}

				this.$refs.grandPrizeConfirm.popupShow()

			},
			goGrandPrizeList() {
				this.$go({
					url: `/pages/scan/grandPrizeList/index?prizeratetype=${this.cactGetInfo.prizeratetype}`
				})
			},
			submit() {

				let {
					id,
					name,
					id_card,
					mobile,
					detailed,
					region
				} = this.cactGetInfo

				updateInfo({
					id,
					name,
					id_card,
					detailed,
					region
				}).then(res => {

					if (res.code == 1) {
						this.init()
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						return
					}

					uni.showToast({
						icon: 'none',
						title: res.msg
					})


				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f3f3f3;
	}

	.grand-prize {

		.grand-prize-head {
			font-size: 0;
		}

		.grand-prize-banner {
			width: 100%;
			height: 384rpx;
		}

		.grand-prize-title {
			padding: 18rpx 38rpx 0;
			font-size: 36rpx;
			font-family: PingFang SC, PingFang SC-Bold;
			font-weight: 700;
			color: #000000;
			position: relative;
		}




		.unclaimed,
		.received {
			width: 112rpx;
			height: 46rpx;
			border-radius: 24px 24px 24px 0px;
			font-size: 24rpx;
			font-weight: 700;
			color: #ffffff;
			text-align: center;
			line-height: 46rpx;
			display: inline-block;
			position: absolute;
			top: 0;
			margin-left: 16rpx;
		}


		.unclaimed {
			background-color: #ce141c;
		}

		.received {
			background-color: #00924E;
		}

		.grand-prize-tips {
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4e4e;
			margin: 16rpx 36rpx 0;
			padding-top: 20rpx;
			border-top: 1rpx dashed #bfbfbf;
		}

		.emphasize {
			color: #CE141C;
		}

		.grand-prize-box {
			margin: 18rpx 20rpx 0;
			background-color: #ffffff;
			border-radius: 10px;
			box-shadow: 0 6rpx 12rpx 0 #cecece;
			overflow: hidden;
		}

		.grand-prize-form {
			padding: 20rpx 0;
		}

		.field-tips {
			font-size: 20rpx;
			font-weight: 400;
			color: #9a9a9a;
			padding: 6rpx 16px 0;
		}

		.authorized-telephone {
			position: relative;
		}

		.zm-item-btn {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			width: auto;
			height: auto;
			z-index: 10;
			background-color: transparent;
			padding: 0;

			&:after {
				border: none;
			}

		}


		.grand-prize-form-tips {
			font-size: 20rpx;
			font-weight: 400;
			color: #ce141c;
			padding: 24rpx 30rpx 20rpx;
		}

		.look-award-list {
			font-size: 28rpx;
			font-weight: 400;
			color: #ce141c;
			padding: 20rpx 0;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 26rpx;
		}

		.submit {
			padding: 20rpx 40rpx 40rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			width: auto;
			z-index: 100;
			background-color: #ffffff;
		}

		.submit-box {
			height: 180rpx;
		}

		.receive-vouchers-title {
			font-size: 28rpx;
			font-weight: 700;
			color: #000000;
			padding-left: 32rpx;
			padding-top: 18rpx;
			padding-bottom: 20rpx;
		}

		.receive-vouchers-list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 32rpx 28rpx;
		}

		.receive-vouchers-item+.receive-vouchers-item {
			margin-left: 78rpx;
		}

		.no-win {
			position: absolute;
			top: 386rpx;
			left: 20rpx;
			right: 20rpx;
			bottom: 20rpx;
			background-color: #fff;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 246rpx;
		}

		.no-win-icon {
			width: 252rpx;
			height: 300rpx;
			margin-bottom: 36rpx;
		}

		.no-win-text {
			font-size: 28rpx;
			font-weight: 400;
			color: #000000;
			text-align: center;
		}
	}
</style>