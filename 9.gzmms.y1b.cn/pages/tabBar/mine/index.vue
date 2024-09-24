<template>
	<view class="container" :style="temp">
		<view class="top">
			<uni-nav-bar status-bar title="个人中心" backgroundColor="transparent" color="#fff" :border="false" />
			<!-- <view class="circle-box"></view> -->
		</view>
		<view class="width-full position-a backBox"></view>
		<view class="info display_column_center">
			<view class="avatar position-r">
				<uv-avatar :src="avatar" size="80"></uv-avatar>
				<image class="position-a editImg" src="../../../static/otherImg/myselfImg_0.png"></image>
			</view>
			<view v-if="!userInfo" class="width-full nickname">
				<view class="login-btn">
					<uv-button type="primary" @click="goAuthorize">去登录</uv-button>
				</view>
			</view>
			<view class="width-full list f-s-32">
				<view class="item">
					<text class="t-c-5B5B5B">手机/账号</text>
					<text class="t-c-000018">{{ mobile }}</text>
				</view>
				<view class="item">
					<text class="t-c-5B5B5B">姓名</text>
					<text class="t-c-000018">{{ userInfo.name || "-" }}</text>
				</view>
				<view class="item">
					<text class="t-c-5B5B5B">部门</text>
					<text class="t-c-000018">{{ userInfo.dept_name || "-" }}</text>
				</view>
				<view class="item">
					<text class="t-c-5B5B5B">关于我们</text>
				</view>
				<view class="item" style="border-bottom: none">
					<text class="t-c-5B5B5B">当前版本</text>
					<text class="t-c-000018">V1.0.3></text>
				</view>
			</view>
			<view class="feetBox">
				<uv-button type="primary" text="切换系统" :custom-style="customStyle" @click="toSwitch"></uv-button>
				<!-- <uv-button type="primary" text="退出登录" :custom-style="customStyle1"></uv-button> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapActions
	} from "vuex";
	export default {
		data() {
			return {
				customStyle: {
					width: '622rpx',
					height: '86rpx',
					background: 'linear-gradient(91deg,#9bc7ff 2%, #0171fd 98%)',
					border: 'none',
					borderRadius: '44rpx'
				},
				customStyle1: {
					width: '622rpx',
					height: '86rpx',
					color: '#137BFE',
					marginTop: '30rpx',
					background: '#fff',
					border: 'none',
					borderRadius: '44rpx'
				},
				avatarUrl: "",
				btnStyle: {
					width: "120rpx",
				},
			};
		},
		computed: {
			...mapGetters(["userInfo"]),
			avatar() {
				if (this.userInfo?.head_url) {
					return "https://gzmms.y1b.cn" + this.userInfo.head_url;
				} else {
					return this.avatarUrl;
				}
			},
			mobile() {
				if (this.userInfo?.user) {
					let user = this.userInfo.user;
					return user.length === 11 ? this.geTel(user) : user;
				} else {
					return "-";
				}
			},
		},
		onReady() {},
		onShow() {
			// 获取用户信息
			// this.getUserInfo()
		},
		mounted() {
			this.$nextTick(() => {
				if (this.userInfo) {
					console.log("userInfo:", this.userInfo);
				}
			});
		},
		methods: {
			toSwitch() {
				uni.navigateTo({
					url: "/pages/common/switch/switch"
				})
			},
			geTel(tel) {
				var reg = /^(\d{3})\d{4}(\d{4})$/;
				return tel.replace(reg, "$1****$2");
			},
			goAuthorize() {
				uni.redirectTo({
					url: "/pages/login/login",
					fail(err) {
						console.log(err);
					},
				});
			},
		},
	};
</script>

<style lang="scss">
	page {
		background-color: #E9F3FF;
	}

	.container {
		padding: 0 10rpx;
		box-sizing: border-box;

		.top {
			.circle-box {
				width: 228rpx;
				height: 194rpx;
				border: solid 40rpx #d2ddff;
				border-radius: 50%;
				position: absolute;
				right: -114rpx;
				top: -97rpx;
				z-index: 10;
			}
		}

		.backBox {
			height: 634rpx;
			left: 0;
			top: 0;
			z-index: -1;
			background: #045AC5;
		}

		.info {
			margin-top: 130rpx;
			padding: 0rpx 32rpx;
			height: calc(100vh - var(--status-bar-height) - 88rpx - 130rpx - 100rpx);
			background-color: #F6FAFF;
			// border-top-left-radius: 20rpx;
			// border-top-right-radius: 20rpx;
			border-radius: 20rpx;
			position: relative;

			.avatar {
				// position: absolute;
				// top: -80rpx;
				// left: 50%;
				// transform: translateX(-50%);
				margin-top: -80rpx;

				.editImg {
					width: 36rpx;
					height: 36rpx;
					right: 2rpx;
					bottom: 10rpx;
				}
			}

			.nickname {
				padding-top: 94rpx;
				text-align: center;
				display: flex;
				justify-content: center;

				.login-btn {
					width: 240rpx;
				}
			}

			.list {
				margin-top: 60rpx;
				padding: 0 20rpx;

				.item {
					height: 90rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1px solid #E6E6E6;
					padding: 0 16rpx 0rpx 18rpx;
				}
			}

			.feetBox {
				margin-top: 150rpx;
			}
		}
	}
</style>