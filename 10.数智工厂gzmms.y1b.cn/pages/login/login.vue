<template>
<view class="container">
	<image src="/static/login/login_bg.png" mode="'scaleToFill'" class="cont_bg"></image>
	<view class="top_box">
		<!-- left-icon="home" -->
		<!-- <uni-nav-bar
			status-bar
			title="登录"
			:border="false"
			backgroundColor="background-color:rgba(0,0,0,0),"
			@clickLeft="handleHome"
		/> -->
		<view class="left-text">
			<view class="hello">Hi，欢迎登录~</view>
			<view class="admin_title">{{ adminTitle }}</view>
		</view>
		<view class="welcome-img">
			<image src="/static/login/welcom_icon.png" mode=""></image>
		</view>
	</view>
	<view class="bottom">
		<uv-form labelPosition="left" :model="formData" ref="uForm" errorType="toast">
			<view class="form">
				<!-- <view class="circle"></view> -->
				<!-- <view class="avatar-box">
					<uv-form-item prop="avatarUrl">
						<view class="avatar-btn-box">
							<view class="avatar-img">
								<uv-image
									src="@/static/images/login/defult_avatarUrl.png"
									width="128rpx"
									height="128rpx"
									radius="50%"
									fit="cover"
									:src="formData.avatarUrl ? formData.avatarUrl : imgUrl"
									class="avatar-img"
								></uv-image>
							</view>
							<button openType="chooseAvatar" @chooseavatar="chooseavatar" class="avatar-btn"></button>
						</view>
						<text v-if="!formData.avatarUrl">点击获取头像</text>
					</uv-form-item>
				</view> -->
				<view class="form-hint">为保护企业的数据安全，请再次确认身份信息</view>
				<!-- <view class="nickname-box input-box">
					<uv-form-item prop="nickname">
						<uv-input
							v-model="formData.nickname"
							placeholder="点击获取微信名字"
							:customStyle="{ backgroundColor: '#F6F9FE', color: '#82A5FF' }"
							border="none"
							type="nickname"
							color="#82A5FF"
							maxlength="16"
						>
							<template slot="prefix">
								<uv-image :src="`${imgBaseUrl}login/nickname_icon@2x.png`" width="40rpx" height="40rpx"></uv-image>
							</template>
						</uv-input>
					</uv-form-item>
				</view> -->
				<template v-if="loginType === 2">
					<view class="mobile input-box">
						<uv-form-item prop="username" :customStyle="{ padding: '36rpx 0'}">
							<uv-input
								v-model="formData.username"
								placeholder="请输入手机号/账号名"
								border="none"
								:customStyle="{ backgroundColor: '#f6f9fe' }"
								color="#82A5FF"
								maxlength="16"
							>
								<template slot="prefix">
									<uv-image
										:src="
											formData.username
												? `${imgBaseUrl}login/user_blue@2x.png`
												: `${imgBaseUrl}login/user_gray@2x.png`
										"
										width="40rpx"
										height="40rpx"
									></uv-image>
								</template>
							</uv-input>
						</uv-form-item>
					</view>
					<view class="password input-box">
						<uv-form-item prop="password" :customStyle="{ padding: '36rpx 0'}">
							<uv-input
								v-model="formData.password"
								placeholder="请输入密码"
								border="none"
								:customStyle="{ backgroundColor: '#f6f9fe' }"
								password
								color="#82A5FF"
								maxlength="16"
							>
								<template slot="prefix">
									<uv-image
										:src="
											formData.password
												? `${imgBaseUrl}login/password_blue@2x.png`
												: `${imgBaseUrl}login/password_gray@2x.png`
										"
										width="40rpx"
										height="40rpx"
									></uv-image>
								</template>
							</uv-input>
						</uv-form-item>
					</view>
					<view class="btn-box login_btn">
						<uv-button
							type="primary"
							text="登录"
							@click="handleLogin"
							shape="circle"
							:loading="btnLoading"
							color="linear-gradient(91deg,#6ba0ff 2%, #2d67ef 98%)"
							:custom-style="{height: '86rpx'}"
							fontSize="16"
						></uv-button>
					</view>
				</template>
				<template v-else>
					<view class="btn-box">
						<uv-button
							type="primary"
							shape="circle"
							text="手机号一键登录"
							open-type="getPhoneNumber"
							@getphonenumber="getPhoneNumber"
							:loading="btnLoading"
							:custom-style="{height: '86rpx'}"
							color="linear-gradient(91deg,#6ba0ff 2%, #2d67ef 98%)"
							fontSize="16"
						></uv-button>
					</view>
				</template>
				<view class="change_text" @click="swichLoginType">{{ changeContent }}</view>
			</view>
		</uv-form>
	</view>
	<view class="explain-hint">公司内部物料管理系统，采用手机号白名单验证登录机制，仅限内部员工使用</view>
</view>
</template>

<script>
import { mapActions } from "vuex";
import myMixin from "@/mixin/index.js";
const tabbarPage = ["/pages/tabBar/home/index", "/pages/tabBar/mine/index", "/pages/tabBar/workbench/index"];
export default {
	mixins: [myMixin],
	data() {
		return {
			imgUrl: "/static/images/login/defult_avatarUrl.png",
			formData: {
				// avatarUrl: "",
				// nickname: "",
				username: "",
				password: "",
			},
			loginType: 1,
			page: "", // 记录跳转来的页面路径
			query: "", //记录跳转来的参数
			btnLoading: false, //按钮加载状态
			rules: {
				// avatarUrl: {
				// 	type: "string",
				// 	required: true,
				// 	message: "请输入头像",
				// 	trigger: ["change"],
				// },
				// nickname: {
				// 	type: "string",
				// 	required: true,
				// 	message: "请输入微信昵称",
				// 	trigger: ["blur"],
				// },
				username: {
					type: "string",
					max: 16,
					required: true,
					message: "请输入手机号或者账号名",
					trigger: ["blur"],
				},
				password: {
					type: "string",
					max: 16,
					required: true,
					message: "请输入密码",
					trigger: ["blur"],
				},
			},
		};
	},
	onReady() {
		//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
		this.$refs.uForm.setRules(this.rules);
	},
	onLoad(options) {
		if (options.router) this.page = decodeURIComponent(options.router);
		this.query = options.q || "";
	},
	computed: {
		changeContent() {
			return this.loginType == 1 ? "点击切换账号密码登录" : "点击切换微信手机号一键登录";
		},
	},
	methods: {
		...mapActions({
			login: "user/wxloginUser",
			loginMobile: "user/wxloginMobile",
		}),
		async getPhoneNumber(e) {
			console.log("e", e);
			if (e.errMsg == "getPhoneNumber:ok") {
				let mobile_code = e.code;
				this.btnLoading = true;
				try {
					const resul = await this.loginMobile(mobile_code);
					uni.showToast({
						icon: "success",
						title: "登录成功",
						mask: true,
						duration: 1000,
					});
					this.goToPage();
				} finally {
					this.btnLoading = false;
				}
				return;
			}
			uni.showToast({
				icon: "none",
				title: "您拒绝了手机号登录,可以使用账号登录",
				mask: true,
				duration: 2000,
			});
		},
		// 点击切换登录方式
		swichLoginType() {
			this.loginType = this.loginType === 1 ? 2 : 1;
		},
		// 点击home
		handleHome() {
			console.log("点击home");
		},
		chooseavatar(event) {
			// this.selectImage(event.detail.avatarUrl)
			this.formData.avatarUrl = event.detail.avatarUrl;
		},
		handleLogin() {
			this.$refs.uForm.validate().then(async (res) => {
				this.btnLoading = true;
				try {
					const resul = await this.login(this.formData);
					uni.showToast({
						icon: "success",
						title: "登录成功",
						mask: true,
						duration: 1000,
					});
					this.goToPage();
				} finally {
					this.btnLoading = false;
				}
			}).catch((errors) => {
				// uni.$uv.toast('校验失败',3000)
			});
		},
		goToPage() {
			setTimeout(() => {
				// uni.redirectTo({
				// 	url: `/pages/common/switch/switch?q=${this.query}`,
				// });
				// return;
				let navigate_type = tabbarPage.includes(this.page) ? "switchTab" : "redirectTo";
				uni[navigate_type]({
					url: `${this.page}?q=${this.query}`,
					fail(err) {
						console.log("err", err);
					},
				});
			}, 1000);
		}
	}
};
</script>
<style lang="scss">
.container {
	height: 100vh;
	position: relative;
	z-index: 0;
	background: #F0F6FF;
	overflow: hidden;
	.cont_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
	}

	.explain-hint {
		font-size: 24rpx;
		color: #6f6f6f;
		letter-spacing: 0.96rpx;
		margin: 50rpx 38rpx 0;
	}

	.change_text {
		color: #4470DE;
		font-size: 24rpx;
		text-align: center;
		margin-top: 16rpx;
	}

	.top_box {
		margin-top: 226rpx;
		position: relative;
		z-index: 0;
		.left-text {
			padding-left: 40rpx;
			padding: 44rpx 0 98rpx 40rpx;
			font-weight: 600;
			line-height: 66rpx;
			.hello {
				color: #000018;
				font-size: 56rpx;
			}
			.admin_title {
				color: #2665fe;
				font-size: 48rpx;
				margin-top: 50rpx;
			}
		}
		.welcome-img {
			width: 414rpx;
			height: 322rpx;
			position: absolute;
			top: 0;
			right: 0;
			z-index: -1;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	.bottom {
		height: 660rpx;
		position: relative;
		margin: 0 30rpx;
		.left-img {
			width: 270rpx;
			height: 272rpx;
			position: absolute;
			left: 0;
			top: -320rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.form {
			background-color: #ffffff;
			border-radius: 40rpx;
			padding: 60rpx 48rpx 50rpx;
			.circle {
				width: 128rpx;
				height: 128rpx;
				background-color: #fff;
				position: absolute;
				top: -54rpx;
				left: 50%;
				border-radius: 128px 0;
				transform: rotate(45deg);
				margin-left: -64rpx;
			}

			.avatar-box {
				text-align: center;
				/* 自身高度的一半 +  u-form-item自带的padding 10px*/
				margin-top: -84rpx;
				.avatar-btn-box {
					position: relative;
					width: 128rpx;
					height: 128rpx;
					border-radius: 50%;
					overflow: hidden;
					margin: 0 auto;
					margin-bottom: 18rpx;
					border: 4rpx solid #fff;
					display: flex;
					align-items: center;
					justify-content: center;

					.avatar-img {
						position: absolute;
						inset: 0;
						z-index: 11;
						pointer-events: none;
					}

					.avatar-btn {
						position: absolute;
						inset: 0;
					}
				}
			}

			.form-hint {
				text-align: center;
				font-size: 28rpx;
				color: #c2c2c2;
				margin-bottom: 50rpx;
				white-space: nowrap;
			}

			.input-box {
				margin-bottom: 30rpx;
				background: #f6f9fe;
				border: 2rpx solid #ffffff;
				border-radius: 20rpx;
				padding-left: 24rpx;
				box-shadow: 0rpx 6rpx 12rpx 0rpx rgba(206,219,254,0.20);
			}

			.btn-box {
				text-align: center;
				margin-top: 121rpx;
				&.login_btn {
					margin-top: 80rpx;
				}
			}
		}
	}
}
</style>
