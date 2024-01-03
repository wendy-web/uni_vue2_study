<template>
	<div class="box">
		<!-- 背景图 -->
		<img class="bg_signup" src="@/static/creditCard/bg_signup.png" />
		<!-- 有礼、中信标识 -->
		<div class="logo-box">
			<img class="icon_bfyl" src="@/static/creditCard/icon_bfyl.png" mode="aspectFit" />
			<span class="icon-x">X</span>
			<img class="icon_citic" src="@/static/creditCard/icon_citic.png" mode="aspectFit" />
		</div>
		<!-- 邀请赚现金券 -->
		<div class="banner-box">
			<div class="banner-tips">每邀请1人成功办理信用卡</div>
			<div>
				<img class="title_earn_cash" src="@/static/creditCard/title_earn_cash.png" mode="aspectFit" />
			</div>
			<img class="banner_cash" src="@/static/creditCard/banner_cash.png" mode="aspectFit" />
		</div>
		<div class="submit_box">
			<div class="cont_item">
				<label for="name" class="cont_lab">姓名</label>
				<input type="text" class="cont_input" id="name" name="name"
					required placeholder="请输入姓名" v-model="nick_name"
					:disabled="isAlreadySubmit"
				/>
			</div>
			<div class="cont_item">
				<label for="tel" class="cont_lab">手机号码</label>
				<input type="tel" id="tel" class="cont_input"
					placeholder="请输入手机号码" v-model="mobile"
					:maxlength="11"
					:disabled="isAlreadySubmit"
				/>
			</div>
			<!-- 报名按钮 -->
			<div class="sign-box" @click="signUp">
				<!-- 背景图 -->
				<img class="bt_btn_signup" src="@/static/creditCard/bt_btn_signup.png" mode="aspectFit" />
				<!-- 标题 -->
				<div class="btn-title">立即报名该计划</div>
				<div class="btn-tips" v-if="userInfo && userInfo.join_num">已有{{userInfo.join_num || 0}}人加入</div>
				<!-- 标识 -->
				<img class="signup_tips" src="@/static/creditCard/signup_tips.png" mode="aspectFit" />
				<img class="icon_finger" src="@/static/creditCard/icon_finger.png" mode="aspectFit" />
			</div>
		</div>
		<!-- 规则说明 -->
		<div class="rule-box">
			<div class="rule-title">规则说明</div>
			<div class="rule-item">1、每邀请一名消费者成功办理信用卡，将获得70元现金券奖励，上不封顶；</div>
			<div class="rule-item">2、奖励在中信银行核验后以现金券的形式发放到账，可在“彬纷有礼APP - 我的 - 现金券”中查看；</div>
			<div class="rule-item">3、本计划仅限于深圳地区，名额有限。</div>
		</div>
		<!-- 报名成功弹窗 -->
		<van-popup v-model="signPopShow" round  :close-on-click-overlay="false">
			<div class="pop-box">
				<div class="pop-title">提交报名成功</div>
				<div class="pop-tips">预计 1 到 3 个工作日内审核完成</div>
				<div class="btn-iknow" @click="onclosePop">我知道了</div>
			</div>

		</van-popup>
		<continuePhoneRegDia
			:isShow="isShowPhoneDia"
			:mobile="mobile"
			@close="isShowPhoneDia = false"
			@confirm="confirmHandle"
		></continuePhoneRegDia>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import { setLocalStorage, checkName, checkUserPhone } from '@/utils/index';
	import { Toast } from "vant";
	import { reqttxl } from '@/api/cardApi.js';
	import continuePhoneRegDia from './continuePhoneRegDia.vue'
	export default {
		components: {
			continuePhoneRegDia
		},
		computed:{
			...mapGetters(['userInfo']),
		},
		data() {
			return {
				signPopShow: false, //报名成功弹窗
				nick_name: '',
				mobile: '',
				isAlreadySubmit: false,
				submitParams: {},
				isShowPhoneDia: false
			}
		},
		created() {
			console.log("报名组件的created");
		},
		methods: {
			...mapActions({
				createQr: 'login/createQr'
			}),
			signUp() {
				const params = this.validateInfo();
      			if(!params) return;
				this.isShowPhoneDia = true;
      			this.submitParams= params;
			},
			async confirmHandle() {
				this.isShowPhoneDia = false;
				setTimeout(() => this.signPopShow = true, 600);
				await reqttxl({
					...this.submitParams,
					route: 'api/Internal/creditCard'
				});
			},
			validateInfo() {
				if(!this.nick_name.trim()) {
					Toast('请输入姓名');
					return false;
				}
				if (!checkName(this.nick_name.trim())) {
					Toast('姓名格式不正确');
					return false;
				}
				if(!this.mobile.trim()) {
					Toast('请输入手机号码');
					return false;
				}
				if(!checkUserPhone(this.mobile.trim())) {
					Toast('手机号码格式有误！');
					return false;
				}
				return {
					nick_name: this.nick_name,
					mobile: this.mobile
				}
			},
			onclosePop() {
				this.signPopShow = false;
				// this.$emit('signSuccess',{name:'阿桑',age:18});
				setLocalStorage('signUpTime',Date.now());
				this.$emit('signSuccess');
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .xh-navber-nav {
		background-image: linear-gradient(to right, #fde9c3 40%, #f8f2d6 60%, #f0ffe9);
	}

	.box {
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		padding: 26px 16px 20px 16px;
		background-color: #f5f7fa;
	}

	.bg_signup {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 654px;
		z-index: -1;
	}

	.logo-box {
		display: flex;
		align-items: center;

		.icon-x {
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: center;
			color: #333333;
			margin: 0 6px;
		}

		.icon_bfyl {
			width: 76px;
			height: 20px;
		}

		.icon_citic {
			width: 63px;
			height: 17px;
		}
	}

	.banner-box {
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		margin-top: 38px;
		width: 100%;
		min-height: 294px;

		.banner-tips {
			font-size: 16px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: left;
			color: #333333;

		}

		.title_earn_cash {
			width: 225px;
			height: 31px;
			margin-top: 14px;
		}

		.banner_cash {
			width: 100%;
			height: 294px;
			position: absolute;
			z-index: -1;
			bottom: 0;
			left: 0;
		}
	}

	// 报名按钮
	.sign-box {
		width: 323px;
		height: 52px;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
		margin: 30px auto 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.btn-title {
			font-size: 18px;
			font-family: HONOR Sans CN, HONOR Sans CN-Black;
			font-weight: 900;
			text-align: center;
			color: #ffffff;
		}

		.btn-tips {
			opacity: 0.6;
			font-size: 13px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #ffffff;
		}

		.bt_btn_signup {
			position: absolute;
			z-index: -1;
			bottom: 0;
			left: 0;
			width: 323px;
			height: 52px;
		}

		.signup_tips {
			width: 136px;
			height: 25px;
			position: absolute;
			top: -16px;
			right: 5px;
		}

		.icon_finger {
			width: 46px;
			height: 53px;
			position: absolute;
			bottom: -25px;
			right: 13px;
		}

	}

	// 规则说明
	.rule-box {
		min-height: 162px;
		background: #ffffff;
		border-radius: 16px;
		box-sizing: border-box;
		padding: 16px;
		margin-top: 33px;

		.rule-title {
			font-size: 16px;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: left;
			color: #333333;
			position: relative;
			margin-left: 10px;
			margin-bottom: 8px;
		}

		.rule-title::before {
			content: "";
			width: 3px;
			height: 15px;
			background: #f3242a;
			border-radius: 2px;
			position: absolute;
			left: -10px;
			top: 0;
			bottom: 0;
			margin: auto 0;
		}

		.rule-item {
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: left;
			color: #666666;
			line-height: 23px;
		}
	}

	// 报名成功弹窗
	.pop-box {
		box-sizing: border-box;
		width: 311px;
		min-height: 190px;
		background: #ffffff;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.pop-title {
			font-size: 18px;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: center;
			color: #333333;
		}

		.pop-tips {
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Regular;
			font-weight: 400;
			text-align: center;
			color: #333333;
			margin-top: 10px;
		}

		.btn-iknow {
			width: 236px;
			height: 40px;
			background: #f3242a;
			border-radius: 20px;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-family: PingFang SC, PingFang SC-Semibold;
			font-weight: 600;
			text-align: center;
			color: #ffffff;
			margin-top: 48px;

		}
	}
	.submit_box {
		background: #fff;
		border-radius: 12px;
		width: 100%;
		.cont_item{
			font-size: 15px;
			display: flex;
			font-weight: 600;
			line-height: 21px;
			margin: 16px 16px 18px;
			.cont_lab{
				min-width: 80px;
			}
			.cont_input{
				text-align: right;
				flex: 1;
			}

		}
	}
	:-webkit-input-placeholder {
    /* Chrome、Safari等Webkit内核浏览器 */
		color: #CCCCCC;
	}

	::-moz-placeholder {
		/* Firefox浏览器 */
		color: #CCCCCC;
	}

	:-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #CCCCCC;
	}

	::-ms-input-placeholder {
		/* Microsoft Edge */
		color: #CCCCCC;
	}

	::placeholder {
		/* 最新标准语法 */
		color: #CCCCCC;
	}
	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0px 1000px #fff inset;
		// 自动填充 class 类名；
		// -webkit-box-shadow：使用盒子阴影遮挡input背景色；
	}
</style>
