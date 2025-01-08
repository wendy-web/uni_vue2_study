<template>
<view class="my-coupon-history">
	<view class="mch-tabs">
		<van-tabs :active="active" @change="tabChange" line-width="52rpx" line-height="6rpx">
			<van-tab v-for="(item,index) in tabs" :key="item.id" :title="item.name" :name="index"/>
		</van-tabs>
	</view>
	<view class="list-box">
		<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
			<block v-for="item in goods" :key="item.id">
				<view class="mc_list fl_bet" v-if="item.is_vip == 2" @click="goToOrderDetail(item.ticket_id)">
					<image class="list-item-bg" src="https://file.y1b.cn/store/1-0/24415/661cea7858f7c.png"></image>
					<view class="com_img fl_center">
						<image class="widHei" :src="item.image" mode="aspectFit"></image>
					</view>
					<view class="list_txt fl_col_sp_bt">
						<view class="item_title maxTwoLine">{{item.title}}</view>
						<view class="item_lab">{{ item.expire_time }}</view>
					</view>
					<view class="list_right fl_col_sp_bt">
						<view class="list_right-free">免费</view>
						<!-- <view>购买详情<van-icon name="arrow"/></view> -->
						<view class="lit-btn">{{ tabs[active].name }}</view>
					</view>
					<view class="list-item-water">{{ tabs[active].name }}</view>
				</view>
				<view class="list-item" v-else>
					<image class="list-item-bg" src="https://file.y1b.cn/store/1-0/23111/6541bd3ba6f01.png"></image>
					<view class="list-item-left">
						<view class="list-item-name maxTwoLine">{{item.title}}</view>
						<view class="list-item-time">有效期至：{{item.expirationDay}}</view>
					</view>
					<view class="list-item-tools">
						<view class="list-item-price">{{item.face_value}}</view>
						<view class="lit-btn">{{ tabs[active].name }}</view>
					</view>
					<view class="list-item-water">{{ tabs[active].name }}</view>
				</view>
			</block>

		</mescroll-uni>
	</view>
</view>
</template>
<script>
import { myCoupon } from '@/api/modules/user.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
export default{
	mixins: [MescrollMixin], // 使用mixin
	data(){
		return {
			active:0,
			tabs:[
				{id:2,name:'已使用', goods: null, num:1, curPageLen:0, hasNext:true},
				{id:3,name:'已失效', goods: null, num:1, curPageLen:0, hasNext:true}
			],
			preIndex:null,
			subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
		}
	},
	computed: {
		goods() {
			return this.tabs[this.active].goods
		}
	},
	methods:{
		downCallback() {
			this.mescroll.resetUpScroll()
		},
		goToOrderDetail(id) {
			if(!id) return;
			this.$go(`/pages/userModule/order/detail?id=${id}`);
		},
		upCallback(page) {
			let key = this.tabs[this.active].id;
			let params = {
				size:10,
				page:page.num,
				status:key,
				ty: 1
			}
			myCoupon(params).then(res=>{
				let list =  res.data ? res.data.data : []
				list = list.map(function(item){
					let expirationDay = item.expire_time.slice(0,10)
					let face_value = Number(item.face_value)
					return {
						...item,
						face_value,
						expirationDay
					}
				})
				// 需先隐藏加载状态
				this.mescroll.endSuccess(list.length);
				// 当前tab数据
				let curTab = this.tabs[this.active]
				// 设置列表数据
				if(page.num == 1) curTab.goods = []; //如果是第一页需手动制空列表
				curTab.goods = curTab.goods.concat(list); //追加新数据
				curTab.num = page.num; // 页码
				curTab.curPageLen = list.length; // 当前页长
				curTab.hasNext = this.mescroll.optUp.hasNext; // 是否还有下一页
			}).catch(err=>this.mescroll.endErr())
		},
		// 切换菜单
		tabChange (e) {
			this.active = e.detail.name
			// 记录切换前滚动条的位置
			if(!this.preIndex) this.preIndex = 0
			let preTab = this.tabs[this.preIndex]
			preTab.y = this.mescroll.getScrollTop()
			this.preIndex = this.active;
			// 当前菜单的数据
			let curTab = this.tabs[this.active]
			if (!curTab.goods) {
				// 没有初始化,则初始化
				this.mescroll.resetUpScroll();
				return
			}
			// 初始化过,则恢复之前的列表数据
			this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
			this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
			this.$nextTick(()=>{
				this.mescroll.scrollTo(curTab.y, 0) // 恢复滚动条的位置
			})
		}
	}
}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.mch-tabs{
		padding: 0 140rpx;
		background-color: #ffffff;
	}
	.list-box{
		position: absolute;
		top: 44px;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
	}
	.list-item {
		position: relative;
		box-sizing: border-box;
		margin: 26rpx 24rpx 24rpx;
		padding: 36rpx 36rpx 24rpx 36rpx;
		display: flex;
		justify-content: space-between;
	}
	.list-item-bg{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		border-radius: 25rpx;
	}
	.list-item-left{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.list-item-name{
		width: calc(100vw - 320rpx);
		font-size: 30rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #333333;
		margin-bottom: 26rpx;
		position: relative;
		z-index: 1;
	}
	.list-item-time{
		font-size: 24rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #999999;
	}
	.list-item-tools{
	    width: 152rpx;
		text-align: center;
	}
	.list-item-price{
		font-size: 56rpx;
		font-family: Barlow, Barlow-6;
		font-weight: 500;
		color: #aaaaaa;
		margin-bottom: 16rpx;
		&::before {
			content: '￥';
			font-size: 30rpx;
		}
	}
	.lit-btn{
		width: 152rpx;
		height: 52rpx;
		border: 2rpx solid #aaaaaa;
		box-sizing: border-box;
		border-radius: 27px;
		font-size: 26rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #aaaaaa;
		line-height: 48rpx;
		margin: auto;
	}
	.list-item-water{
		font-size: 60rpx;
		font-family: PingFang SC, PingFang SC-6;
		font-weight: 500;
		text-align: center;
		color: rgba(51,51,51,0.04);
		position: absolute;
		bottom: 0;
		left: 12rpx;
	}
	.maxTwoLine {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
.mc_list {
	box-sizing: border-box;
	margin: 26rpx 24rpx 22rpx;
	position: relative;
	border-radius: 24rpx;
	z-index: 0;
	padding: 32rpx 0 32rpx 24rpx;
	&::before {
		content: '\3000';
		background: url("https://test-file.y1b.cn/store/1-0/24410/66165e5e5e581.png") 0 0 / cover;
		position: absolute;
		left: 0;
		top: 0;
		width: 176rpx;
		height: 40rpx;
		z-index: 1;
	}
	.com_img {
		width: 144rpx;
		height: 144rpx;
		margin-right: 16rpx;
		background: rgba($color: #E5E5EA, $alpha: .6);
		border-radius: 12rpx;
	}
	.list_txt {
		flex: 1;
		align-self: stretch;
		margin-right: 30rpx;
		.item_title {
			color: #333;
			font-size: 30rpx;
		}
		.item_lab {
			font-size: 26rpx;
			color: #999;
			line-height: 36rpx;
			&::after {
				content: '前使用';
				margin-left: 8rpx;
			}
		}
	}
	.list_right {
		align-self: stretch;
		font-size: 24rpx;
		text-align: center;
		color: #999;
		line-height: 34rpx;
		flex: 0 0 210rpx;
		.list_right-free {
			font-size: 36rpx;
			font-weight: bold;
			line-height: 50rpx;
		}
	}
}
.mc_store {
	padding: 20rpx;
	background: #fff;
	border: 2rpx solid #f1f1f1;
	border-radius: 16rpx;
	margin: 0 24rpx 24rpx;
	.intro-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		line-height: 42rpx;
	}
}
.store_add {
	font-size: 28rpx;
	.store_add-left {
		position: relative;
		padding-right: 56rpx;
		margin-right: 10rpx;
		line-height: 40rpx;
		&::after {
			content: '最近';
			position: absolute;
			right: 0;
			font-size: 24rpx;
			color: #f97f02;
		}
	}
	.store_add-right {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		&::before {
			content: '\3000';
			width: 26rpx;
			height: 26rpx;
			background: url("https://test-file.y1b.cn/store/1-0/2447/66123c68ccd59.png") 0 0 / cover;
			margin-right: 8rpx;
		}
	}
}
</style>
