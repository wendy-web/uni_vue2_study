<template>
	<view class="container">
		<uni-nav-bar
			background-color="linear-gradient(180deg, #f3f6fe,#C6D6FF50);"
			status-bar
			:title="adminTitleShow"
			:border="false"
			:titleStyle="{
				fontWeight: 'bold',
				fontSize: '16px'
			}"
			fixed
		/>
		<view class="top-img">
			<image src="https://file.y1b.cn/public/erpxcx_img/home/home_topright@2x.png" mode=""></image>
		</view>
		<skeletons v-if="loading"></skeletons>
		<view class="content" v-else>
			<view class="menu-group" v-for="(item, index) in configList" :key="item.id">
				<view class="group-header">
					<text class="vertical-line"></text>

					<text>{{ item.auth_title }}</text>
				</view>
				<view class="path-item">
					<view
						class="sub-item"
						v-for="(newitem, newindex) in item._children"
						:key="newitem.id"
						@click="toTarget(item.page_path,newitem.page_path)"
					>
						<image
							:src="getImgPath(item.page_path,newitem.page_path)"
							mode=""
							class="path-img"
						></image>
						<text class="path-title">
							{{ newitem.auth_title }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getMenuListApi } from "@/api/modules/home.js";
import myMixin from "@/mixin/index.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { getConfig, getHomeMap } from "./config.js";
import skeletons from "./skeletons.vue";
// let config = getConfig();
let homeMap = getHomeMap();


export default {
	mixins: [myMixin],
	components: {
		skeletons,
	},
	data() {
		return {
			loading: true,
			configList: [],
			imgFilter: "",
		};
	},

	onLoad() {
		// 请求获取菜单面板
		this.getData();
	},

	onShow() {},
	onPullDownRefresh() {
		this.getData();
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	computed: {
		...mapGetters(["moduleType"]),
	},
	methods: {
		...mapMutations({
			setBtnAuths: "user/SETBTNAUTHS",
		}),
		...mapActions({
			login: "user/wxlogin",
		}),
		async getData() {
			try {
				const result = await getMenuListApi();
				let list = result.data.list;
				let hide = result.data.hide;
				this.setBtnAuths(hide);
				this.configList = getConfig(list, this.moduleType);
				homeMap = getHomeMap(this.configList, this.moduleType);
				console.log("homeMap", homeMap);
				this.loading = false;
			} catch (e) {
				//TODO handle the exception
				console.log("获取菜单面板错误", e);
			}
		},
		getImgPath(parent,pagePath) {
			let valueObj = homeMap.get(parent) || {};
			const img = valueObj[pagePath]?.img;
			return img;
		},

		toTarget(parent,pagePath) {
				let valueObj = homeMap.get(parent) || {};
			const page = valueObj[pagePath]?.page;
			console.log("page", page);
			let msgTemplateId = this.msgTemplateId;
			// wx.requestSubscribeMessage({
			// 	tmplIds: [msgTemplateId],
			// 	success: (res) => {
			// 		console.log("res", res);
			// 	},
			// 	fail: (err) => {},
			// });
			uni.navigateTo({
				url: page,
			});
		},
	},
	watch: {
		isShowSetModel(newVal) {
			if (newVal) {
				this.$refs.noSubscribeRef.openModal();
			}
		},
	},
};
</script>
<style></style>
<style lang="scss">
page {
	// background-color: #f3f6fe;
	background: linear-gradient(to bottom, #c6d6ff, #eff3fe, #f3f6fe);
	height: 100vh;
	width: 100%;
	box-sizing: border-box;
}

.container {
	padding: 0 20rpx;
	.top-img {
		width: 208rpx;
		height: 208rpx;
		position: absolute;
		top: 80rpx;
		right: 20rpx;
		z-index: -1;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.content {
		margin-top: 74rpx;

		.menu-group {
			background-color: #ffffff;
			padding: 30rpx 20rpx 0 20rpx;
			border-radius: 20rpx;
			margin-bottom: 30rpx;

			.group-header {
				display: flex;
				align-items: center;
				margin-bottom: 40rpx;

				.vertical-line {
					display: inline-block;
					width: 8rpx;
					height: 32rpx;
					background-color: #9bb2ff;
					margin-right: 10rpx;
				}
			}

			.path-item {
				display: grid;
				grid-template-columns: repeat(5, 20%);
				// padding: 0 20rpx;
				.sub-item {
					margin-bottom: 48rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 12px;
					font-weight: bold;
					.path-img {
						margin-bottom: 10rpx;
						width: 80rpx;
						height: 80rpx;
						&.img-filter {
							filter: saturate(10%);
						}
					}

					.path-title {
						text-align: center;
						white-space: nowrap;
						&.title-filter {
							color: #909399;
						}
					}
				}
			}
		}
	}
}
</style>
