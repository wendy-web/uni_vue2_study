<template>
<view :class="['width-full', isShowAddBtn ? 'safe_btn_active' : 'safe_active']">
	<view class="width-full all-p-t-20 position-f" style="top: 0; left: 0; background: #f6f6f6; z-index: 50">
		<scroll-view class="width-full all-scroll-view" :scroll-x="true" style="height: 70rpx">
			<view v-for="(item, index) in scrollList" :key="index"
				class="blockAll scrollBox"
				@click="scrollTap(item.scrollId, index)"
			>
				<view class="display_column_center">
					<view class="scrollTitle">{{ item.name }}</view>
					<view v-if="index == choiceIndex" class="choiceFeetBox"></view>
				</view>
			</view>
		</scroll-view>
	</view>
	<view class="width-full" style="height: 90rpx"></view>
	<view class="width-full all-p-t-30 all-p-lr-20">
		<planInfo :info="planData" ref="planInfoRef" id="one">
			<view slot="status">
				<view>
					<uv-tags text="未开始" size="mini" plain type="primary" v-if="planData.status == 0"></uv-tags>
					<uv-tags text="待保养" size="mini" plain type="warning" v-if="planData.status == 1"></uv-tags>
					<uv-tags text="保养中" size="mini" plain type="success" v-if="planData.status == 2"></uv-tags>
					<uv-tags text="待验证" size="mini" plain v-if="planData.status == 3"></uv-tags>
					<uv-tags text="停用" size="mini" plain type="error" v-if="planData.status == 4"></uv-tags>
				</view>
			</view>
		</planInfo>
		<deviceInfo :info="planData" id="twe"></deviceInfo>
		<standardInfo :info="planData" id="three"></standardInfo>
		<addBtnVue
			@submit="submitHandle"
			:loading="detailLoading"
			v-if="isShowAddBtn"
		></addBtnVue>
	</view>
</view>
</template>
<script>
import { planDetailApi } from "@/api/device/maintain/plan.js";
import addBtnVue from "./components/addBtn.vue";
import deviceInfo from "./components/deviceInfo.vue";
import planInfo from "./components/planInfo.vue";
import standardInfo from "./components/standardInfo.vue";
export default {
	components: {
		planInfo,
		deviceInfo,
		addBtnVue,
		standardInfo
	},
	computed: {
		isShowAddBtn() {
			return [0, 1].includes(this.planData.status) && this.isShowAddWorkBtn
		}
	},
	data() {
		return {
			choiceIndex: 0,
			pageScrollNums: 0, //页面当前滚动
			scrollList: [
				{
					name: "计划信息",
					scrollId: "#one",
				},
				{
					name: "设备信息",
					scrollId: "#twe",
				},
				{
					name: "保养标准",
					scrollId: "#three",
				},
			],
			planData: {},
			elementPositions: {},
			scrollContainerHeight: 0,
			contentHeight: 0,
			scrollStatus: false,
			detailLoading: true,
			isShowAddWorkBtn: false,
		};
	},
	// 生命周期 - 监听页面加载
	onLoad(options) {
		this.listId = options.id ? Number(options.id) : 0;
		this.isShowAddWorkBtn = options.isShowAddWorkBtn ? Boolean(options.isShowAddWorkBtn) : false;
		if(this.listId) this.initData();
		this.$nextTick(() => {
			this.getElementPositions();
			this.getContentHeight();
		});
	},
	onPageScroll(e) {
		if (this.scrollStatus) return;
		this.scrollStatus = true;
		let scrollTop = e.scrollTop;
		for (const key in this.elementPositions) {
			if (scrollTop >= this.elementPositions[key]) {
				let index = this.scrollList.findIndex((item) => item.scrollId == key);
				this.choiceIndex = index;
			} else if (this.contentHeight + scrollTop >= this.scrollContainerHeight) {
				this.choiceIndex = 5;
			}
		}
		this.scrollStatus = false;
	},
	methods: {
		async initData() {
			this.detailLoading = true;
			const result = await planDetailApi({ id: this.listId });
			this.planData = result.data;
			this.detailLoading = false;
		},
		async submitHandle() {
			uni.navigateTo({
				url: `/pages/deviceModule/maintain/workOrder/detail?id=${this.listId}&operateType=1`
			});
		},
		// 滚动到对应位置
		scrollTap(id, indexid) {
			if (this.scrollStatus) return;
			let that = this;
			if (this.choiceIndex == indexid) return;
			const position = this.elementPositions[id];
			that.choiceIndex = indexid;
			if (typeof position === "number") {
				this.scrollStatus = true;
				if (indexid + 1 === this.scrollList.length) {
					uni.pageScrollTo({
						scrollTop: position + this.contentHeight,
						duration: 300,
					});
				} else {
					uni.pageScrollTo({
						scrollTop: position,
						duration: 300,
					});
				}
				setTimeout(() => {
					this.scrollStatus = false;
				}, 500);
			}
		},
		getContentHeight() {
			uni.getSystemInfo({
				success: (info) => {
					this.contentHeight = info.windowHeight - 84;
				},
			});
			const query = uni.createSelectorQuery().in(this);
			query.select(".scrollable-content").boundingClientRect();
			query.exec((results) => {
				this.scrollContainerHeight = results[0].height;
			});
		},
		getElementPositions() {
			const query = uni.createSelectorQuery().in(this); // 限制查询作用域
			const elements = ["#one", "#twe", "#three"];
			elements.forEach((elementId) => {
				query.select(elementId).boundingClientRect(); // 获取元素的位置
			});
			query.exec((results) => {
				results.forEach((result, index) => {
					const elementId = elements[index];
					this.elementPositions[elementId] = result.top - 45; // 存储元素到顶部的距离
				});
			});
		},
	},
};
</script>
<style lang="scss">
page {
	background: #f6f6f6;
}

.info-item {
	padding: 0 30rpx;
	.item-header {
		border-bottom: 2rpx solid #e5e5e5;
		padding-bottom: 20rpx;
	}
}

.scrollBox {
	margin-right: 30rpx;
}

.scrollBox:first-child {
	margin-left: 30rpx;
}

.scrollTitle {
	font-size: 28rpx;
	color: #8b8b8b;
}

.choiceFeetBox {
	width: 56rpx;
	height: 6rpx;
	margin-top: 4rpx;
	background: #0171fd;
}

.contentBox {
	background: #ffffff;
	border-radius: 20rpx;
	box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);

	.statusImg {
		width: 110rpx;
		height: 110rpx;
		right: 0;
		top: 0;
		z-index: 1;
	}

	.iconBox {
		width: 32rpx;
		height: 32rpx;
	}

	.leftTextBox {
		width: 176rpx;
		color: #6f6f6f;
		font-size: 28rpx;
		text-align: right;
	}

	.leftTextBox1 {
		width: 176rpx;
		color: #6f6f6f;
		font-size: 28rpx;
		text-align: right;
		position: relative;
	}

	.leftTextBox1::after {
		position: absolute;
		content: "*";
		color: red;
		left: -15rpx;
		top: 3px;
	}

	.rightBox {
		height: 62rpx;
		color: #6f6f6f;
		font-size: 24rpx;
		background: #fbfbfb;
		border: 2rpx solid #f6f6f6;
		border-radius: 6rpx;
	}

	.rightBox1 {
		height: 62rpx;
		color: #6f6f6f;
		font-size: 24rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.rightIconBox {
		width: 38rpx;
		height: 38rpx;
	}
	.title-label {
		font-size: 28rpx;
		font-weight: 700;
		color: #000018;
		position: relative;
	}

	.titleText {
		font-size: 28rpx;
		font-weight: 700;
		color: #000018;
		position: relative;
	}

	.titleText::after {
		position: absolute;
		top: 3px;
		content: "*";
		color: red;
		margin: 0rpx 0rpx 0rpx 6rpx;
	}

	.choiceBox0 {
		height: 88rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.roundBox {
		width: 32rpx;
		height: 32rpx;
		background: #ffffff;
		border: 2rpx solid #c5c5c5;
		border-radius: 50%;
	}

	.choiceBox1 {
		height: 88rpx;
		background: #fff6f6;
		border: 2rpx solid #ffdede;
		border-radius: 6rpx;
	}

	.choiceBox2 {
		height: 88rpx;
		background: #f5fff7;
		border: 2rpx solid #d6fbd9;
		border-radius: 6rpx;
	}

	.choiceBox3 {
		height: 88rpx;
		background: #fefeff;
		border: 2rpx solid #e3f0ff;
		border-radius: 6rpx;
	}

	.rightBox2 {
		height: 52rpx;
		color: #d4d4d4;
		border: 2rpx solid #f2f2f2;
		border-radius: 6rpx;
	}

	.nameBox {
		height: 176rpx;
		color: #acacac;
		font-size: 24rpx;
		background: #f8f8f8;
		border-radius: 10rpx;
	}
}

.feetBox {
	position: fixed;
	bottom: 0;
	left: 0;
	padding: 40rpx 40rpx 50rpx;
	background: #fff;
	z-index: 20;
}

.feetButBox {
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 80rpx;
	background: #038cf8;
}

.upImgBox {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;

	.fourBox {
		width: 116rpx;
		height: 116rpx;
		color: #acacac;
		background: #efefef;
	}

	.fourBox1 {
		width: 116rpx;
		height: 116rpx;
		background-image: url("/static/otherImg/planFarmIcon3.png");
		background-size: 100% 100%;
	}
}
</style>
