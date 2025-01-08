<template>
<view class="cont-tabs" id="contBox">
	<view class="remind_box fl_center">
		<image class="remind_icon" :src="takeImgUrl + '/mdl_remind.png'" mode="aspectFill"></image>
		自助点餐，不支持外卖
	</view>
	<scroll-view
		v-if="tabs.length"
		:id="viewId"
		:scroll-top="scrollTop"
		scroll-y
		scroll-with-animation
		:scroll-animation-duration="300"
		style="height: 100%"
		:enhanced="true"
		@scroll="scrollHandle"
		:scroll-into-view="scrollTopId"
	>
		<view class="tabs-item" :style="{ '--padding': isShowComBuy ? '106rpx' : '0rpx' }">
			<!-- tab -->
			<view class="tab-item"
				v-for="(tab, i) in tabs"
				:key="i"
				:id="'tabItemId'+i"
			>
				<view
					:class="['cont_title', 'box_fl', opacityIndex == i ? 'title_active' : '']"
				>{{ tab.title }}</view>
				<view class="cont_list">
					<listItem
						:list="tab.detail"
						:tabIndex="i"
						@selCom="selComHandle"
						@selAddCom="selAddComHandle"
						@selSubCom="selSubComHandle"
					>
					</listItem>
				</view>
			</view>
			<view class="add_label">
				本产品为第三方代点餐服务,即第三方人员代下单服务与麦当劳官方无关!
			</view>
		</view>
	</scroll-view>
</view>
</template>

<script>
import { getImgUrl, warpRectDom } from '@/utils/auth.js';
import listItem from './listItem.vue';
export default {
	props: {
		tabs: {
			type: Array,
			default () {
				return []
			}
		},
		value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
			type: [String, Number],
			default: 0
		},
		// 是否展示底部的购物组件 - 为底下留白
		isShowComBuy: {
			type: Boolean,
			default: false
		}
	},
	components: {
		listItem
	},
	computed: {
		scrollTopId() {
			return `tabItemId${this.value}`
		}
	},
	data() {
		return {
			viewId: 'id_' + Math.random().toString(36).substr(2, 16),
			scrollTop: 0,
			topValue: 0,
			isScroll: true,
			scrollTopHeight: 0,
			itemHeight: uni.upx2px(184 + 109), // 单个商品类目与标题头的高度
			opacityIndex: -1,
            takeImgUrl: getImgUrl() + 'static/subPackages/userModule/takeawayMenu',
		}
	},
	watch: {
		tabs() {
			this.$nextTick(()=>{
				setTimeout(() => {
					this.itemDomFun();
				}, 1000);
			});
			if(this.isFirst) {
				this.isFirst = false;
			}
		},
		value(newValue, oldValue) {
			this.isScroll = false;
			setTimeout(() => {
				this.isScroll = true;
			}, 3000);
		}
	},
	created() {
	},
	methods: {
		warpRectDom,
		scrollHandle(event){
			const { scrollTop } = event.detail;
			this.scrollTopHeight = scrollTop;
			if(!this.isScroll) return;
			let currentIndex = this.tabs.findIndex(event => scrollTop < event._top);
			let opacityIndex = this.tabs.findIndex(event => scrollTop <= event._top && (scrollTop > (event._top - this.itemHeight)));
			this.opacityIndex = opacityIndex;
			this.$emit('scroll', currentIndex);
		},
		selComHandle(item, tabIndex, index) {
			this.$emit('selCom', item, tabIndex, index);
		},
		selAddComHandle(item, tabIndex, index) {
			this.$emit('selAddCom', item, tabIndex, index);
		},
		selSubComHandle(item, tabIndex, index) {
			this.$emit('selSubCom', item, tabIndex, index);
		},
		itemDomFun(){
			this.warpRectDom('contBox').then(res =>  this.topValue = res.top );
			this.tabs.forEach((res, index) => {
				const tabItemId = `tabItemId${index}`;
				this.warpRectDom(tabItemId).then(result => {
					res.top = result.top + this.scrollTopHeight;
					res.height = result.height;
					if(index == 0) {
						// 底部边距的
						res._top = result.height ;
					} else {
						res._top = result.height + this.tabs[index-1]._top;
					}
				});
			});
		}
	}
}
</script>

<style lang="scss" scoped>
.cont-tabs {
	position: relative;
	font-size: 30rpx;
	font-weight: 500;
	box-sizing: border-box;
	color: #333;
	height: 100%;
	overflow: hidden;
	padding-top: 84rpx;
	.tabs-item {
		position: relative;
		z-index: 0;
		white-space: nowrap;
		box-sizing: border-box;
		// 102是底部的add_label的文本留白
		padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
		/* 兼容 IOS<11.2 */
		padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
		/* 兼容 IOS>11.2 */
	}
}
.remind_box{
	width: 100%;
	height: 60rpx;
	font-size: 26rpx;
	line-height: 60rpx;
	box-sizing: border-box;
	position: absolute;
	top: 0;
	left: 0;
	background: rgba(255,184,0,0.08);
	border: 2rpx solid rgba(255,184,0,0.60);
	border-radius: 24rpx;
	color: #333;
	.remind_icon{
		width: 28rpx;
		height: 22rpx;
		margin-right: 12rpx;
	}
}
.tab-item {
	position: relative;
	box-sizing: border-box;
	width: 568rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	box-sizing: border-box;
	.cont_title {
		position: sticky;
		top: 0;
		overflow: hidden;
		z-index: 1;
		background: #fff;
		font-size: 30rpx;
		font-weight: 600;
		color: #333333;
		line-height: 42rpx;
		// padding: 8rpx 0 24rpx;
		&::before {
			content: '\3000';
			display: block;
			width: 6rpx;
			height: 30rpx;
			background: linear-gradient(180deg,#ffdd4a, #ffbc0d);
			margin-right: 16rpx;
		}
		&.title_active {
			opacity: 0;
		}
	}
	.cont_list{
		overflow: hidden;
	}
}
.add_label {
    font-size: 24rpx;
    text-align: center;
    color: #aaaaaa;
    line-height: 34rpx;
    padding: 0 34rpx;
	width: 562rpx;
	white-space: normal;
	box-sizing: border-box;
  }
</style>
