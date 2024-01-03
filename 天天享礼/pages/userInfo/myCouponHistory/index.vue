<template>
	<view class="my-coupon-history">
		<!-- 导航栏 -->
		<view class="mch-tabs">
			<van-tabs :active="active" @change="tabChange" line-width="52rpx" line-height="6rpx">
			  <van-tab v-for="(item,index) in tabs" :key="item.id" :title="item.name" :name="index"/>
			</van-tabs>
		</view>
		<view class="list-box">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<!-- 列表 -->
				<view class="list-item" v-for="item in goods" :key="item.id">
					<!-- 背景 -->
					<image class="list-item-bg" src="https://file.y1b.cn/store/1-0/23111/6541bd3ba6f01.png"></image>
					<view class="list-item-left">
						<!-- 标题 -->
						<view class="list-item-name maxTwoLine">
							{{item.title}}
						</view>
						<!-- 有效期 -->
						<view class="list-item-time">
							有效期至：{{item.expirationDay}}
						</view>
					</view>
					<!-- tools -->
					<view class="list-item-tools">
						<view class="list-item-price">
							<text class="lip-unit">￥</text>
							<text>{{item.face_value}}</text>
						</view>
						<view class="lit-btn">
							{{active===0?'已使用':'已失效'}}
						</view>
					</view>
					<!-- 水印 -->
					<view class="list-item-water">
						{{active===0?'已使用':'已失效'}}
					</view>
				</view>
			</mescroll-uni>
		</view>

	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {myCoupon} from '@/api/modules/user.js';
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
			// 列表数据
			goods() {
				return this.tabs[this.active].goods
			}
		},
		methods:{
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
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
				}).catch(err=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				})
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
					this.mescroll.resetUpScroll()
				} else{
					// 初始化过,则恢复之前的列表数据
					this.mescroll.setPageNum(curTab.num + 1); // 恢复当前页码
					this.mescroll.endSuccess(curTab.curPageLen, curTab.hasNext); // 恢复是否有下一页或显示空布局
					this.$nextTick(()=>{
						this.mescroll.scrollTo(curTab.y, 0) // 恢复滚动条的位置
					})
				}
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
	.list-item{
		width: 702rpx;
		height: 211rpx;
		position: relative;
		box-sizing: border-box;
		margin: 26rpx auto 24rpx;
		padding: 36rpx 36rpx 24rpx 36rpx;
		display: flex;
		justify-content: space-between;
	}
	.list-item-bg{
		width: 702rpx;
		height: 211rpx;
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
  //       position: absolute;
		// right: 32rpx;
		// bottom: 22rpx;
		text-align: center;
	}
	.list-item-price{
		font-size: 56rpx;
		font-family: Barlow, Barlow-6;
		font-weight: 500;
		color: #aaaaaa;
		margin-bottom: 16rpx;
	}
	.lip-unit{
		font-size: 30rpx;
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
</style>