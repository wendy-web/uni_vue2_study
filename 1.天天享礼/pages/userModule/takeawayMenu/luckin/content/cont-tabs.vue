<template>
<view class="cont-tabs" id="contBox">
	<view class="remind_box fl_center">
		<image class="remind_icon" :src="takeImgUrl +'/lucky_remind.png'" mode="aspectFill"></image>
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
		<view class="tabs-item">
			<!-- tab -->
			<view class="tab-item"
				v-for="(tab, i) in tabs"
				:key="i"
				:id="'tabItemId'+i"
			>
				<view
					:class="['cont_title', opacityIndex == i ? 'title_active' : '']"
				>{{ tab.title }}</view>
				<view class="cont_list">
					<listItem
						:list="tab.detail"
						:tabIndex="i"
						@selCom="selComHandle"
					>
					</listItem>
				</view>
			</view>
			<view class="add_label">
				本产品为第三方代点餐服务,即第三方人员代下单服务与瑞幸官方无关!
			</view>
		</view>
	</scroll-view>
</view>
</template>

<script>
import listItem from './listItem.vue';
import { getImgUrl } from '@/utils/auth.js';
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
		itemDomFun(){
			this.initWarpRect('contBox').then(res =>  this.topValue = res.top );
			this.tabs.forEach((res, index) => {
				const tabItemId = `tabItemId${index}`;
				this.initWarpRect(tabItemId).then(result => {
					res.top = result.top + this.scrollTopHeight;
					res.height = result.height;
					if(index == 0) {
						// 底部边距的
						res._top = result.height + uni.upx2px(24);
					} else {
						res._top = result.height + uni.upx2px(24) + this.tabs[index-1]._top;
					}
				});
			});
		},
		initWarpRect(id) {
			return new Promise(resolve => {
				setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query.select('#' + (id || this.viewId)).boundingClientRect(data => {
						resolve(data)
					}).exec();
				}, 20)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/static/css/mixin.scss';
.cont-tabs {
	position: relative;
	font-size: 30rpx;
	font-weight: 500;
	box-sizing: border-box;
	color: #333;
	height: 100%;
	border-radius: 24rpx;
	overflow: hidden;
	padding-top: 84rpx;
	.tabs-item {
		position: relative;
		z-index: 0;
		white-space: nowrap;
		box-sizing: border-box;
	}
}
.remind_box{
	width: 100%;
	height: 60rpx;
	background: rgba(0,34,171,0.05);
	border-radius: 24rpx;
	font-size: 26rpx;
	color: $luckyColor;
	line-height: 60rpx;
	position: absolute;
	top: 0;
	left: 0;
	.remind_icon{
		width: 28rpx;
		height: 22rpx;
		margin-right: 12rpx;
	}
}
.tab-item {
	position: relative;
	box-sizing: border-box;
	margin-bottom: 24rpx;
	width: 562rpx;
	background: #fff;
	border-radius: 24rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	.cont_title {
		line-height: 42rpx;
		padding: 32rpx;
		position: sticky;
		top: 0;
		background: #F5F5F5;
		border-radius: 0 0 24rpx 24rpx;
		overflow: hidden;
		z-index: 1;
		&.title_active {
			opacity: 0;
		}
		&::before {
			content: '\3000';
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			background: #fff;
			border-radius: 24rpx;

		}
	}
	.cont_list{
		padding:0 32rpx;
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
