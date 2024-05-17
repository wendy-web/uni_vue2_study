<template>
<view class="pay-success">
	<mescroll-body
		ref="mescrollRef"
		height="100"
		@init="mescrollInit"
		@down="downCallback"
		@up="upCallback"
		:up="upOption"
		:down="downOption"
	>
		<!-- 支付金额 -->
		<view class="order-price">
			<text class="op-unit">￥</text>
			<text class="op-num">{{payment}}</text>
		</view>
		<!-- 支付状态 -->
		<view class="pay-status">
			<van-icon name="checked" color="#EF2B20" />
			<text class="ps-label">支付成功</text>
		</view>
		<!-- tools -->
		<view class="tools">
			<view class="tools-btn left" @click="goTomyOrder">查看订单</view>
			<view class="tools-btn right" @click="goHome">去逛逛</view>
		</view>
		<!-- 猜你喜欢的优惠券列表 -->
		<view class="you_like-title" v-if="goods.length">
			<image class="left-icon" :src="imgUrl +'static/shopMall/love_left_icon.png'" mode="aspectFill"></image>
			猜你喜欢
			<image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
		</view>
		<good-list
			:list="goods"
			:isJdModel="true"
			:isBolCredits="true"
			:isJdLink="true"
			@notEnoughCredits="notEnoughCreditsHandle"
		></good-list>
	</mescroll-body>
</view>
</template>

<script>
	import { groupRecommend } from '@/api/modules/index.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getImgUrl } from '@/utils/auth.js';
export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{
			goodList
		},
		data(){
			return {
				imgUrl: getImgUrl(),
				upOption: {
					auto: true,
					// textNoMore: '',
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 2 // 每页数据的数量
					},
					empty: {
						use: false,
					},
				},
				downOption: {
					use: false,
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				groupRecommendData: null,
				isRecommendRequest: false,
				goods: [],
				pageNum: 1,
				groupId_index: 0,
				payment:'',
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({ title: ''});
			if(options.payment){
				this.payment = options.payment;
			}
		},
		mounted() {
			/*优惠券推荐*/
		},
		methods:{
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},

			upCallback(page) {
				this.requestRem(page);
			},
			async requestRem(page) {
				if(!this.groupRecommendData) {
					const recRes = await groupRecommend({ page: 9 });
					if(recRes.code != 1 || !recRes.data) return this.mescroll.endSuccess(0);
					this.groupRecommendData = recRes.data;
				}
				const {
					id,
					cid,
					cid2,
					cid3,
					eliteId,
					groupId,
					type
				} = this.groupRecommendData;
				let pageNum = this.pageNum;
				// const pageNum = page.num;
				let params = {
					id,
					page: pageNum,
					size: 10,
				}
				let queryApi = goodsQuery;
				// type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
				switch(type) {
					case 1:
						queryApi = material;
						params.eliteId = eliteId;
						params.groupId = groupId;
						params.size = 10;
						break;
					case 2:
						queryApi = jingfen;
						params.eliteId = eliteId;
						params.groupId = groupId;
						params.size = 20;
						break;
					case 3:
						queryApi = goodsQuery;
						params.cid1 = cid;
						params.cid2 = cid2;
						params.cid3 = cid3;
						break;
					case 4:
						queryApi = jingfen;
						const groupId_index = this.groupId_index;
						params.eliteId = eliteId;
						params.groupId = groupId[groupId_index];
						params.size = 20;
						break;
				};
				queryApi(params).then(res=>{
					const {
						list,
						total_count
					} = res.data;
					// 设置列表数据
					if( page.num == 1 ) {
						this.goods = [];
						this.pageNum = 1;
						this.lastOddItem = null;
					}; //如果是第一页需手动制空列表
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (pageNum * params.size) <= total_count;
					if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
						// 无下一页
						this.groupId_index += 1;
						this.mescroll.endSuccess(total_count, true);
						this.pageNum = 0;
					} else {
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					if(list.length == 0 && (pageNum * params.size) < total_count){
						this.mescroll.triggerUpScroll();
					}
					if(this.lastOddItem) {
						this.goods.push(this.lastOddItem);
						this.lastOddItem = null;
					}
					this.pageNum += 1;
					this.goods = this.goods.concat(list); // 追加新数据
					const goodLength = this.goods.length;
					if(goodLength % 2 && goodLength > 6) {
						this.lastOddItem = this.goods.pop();
					}
				}).catch(()=>{
					//联网失败, 结束加载
					// this.mescroll.endErr();
				});
			},
			goTomyOrder(){
				uni.redirectTo({
					url:'/pages/userModule/order/index'
				})
			},
			goHome(){
				uni.switchTab({
					url:'/pages/tabBar/shopMall/index'
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
		font-family: PingFang TC, PingFang TC-6;
	}
	.order-price{
		text-align: center;
		padding-top: 32rpx;
	}
	.op-unit{
		font-size: 40rpx;
		font-weight: 500;
		color: #333333;
		position: relative;
		top:-14rpx;
	}
	.op-num{
		font-size: 64rpx;
		font-family: Barlow, Barlow-6;
		font-weight: 500;
		text-align: center;
		color: #333333;
	}
	.pay-status{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-family: PingFang SC, PingFang SC-6;
		font-weight: 500;
		color: #333333;
		padding-top: 24rpx;
	}
	.ps-label{
		margin-left: 16rpx;
	}
	.tools{
		margin: 24rpx 175rpx 72rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tools-btn{
		width: 176rpx;
		height: 64rpx;
		border: 1rpx solid;
		border-radius: 20px;
		box-sizing: border-box;
		font-size: 28rpx;
		text-align: center;
		line-height: 62rpx;
	}
	.left{
		font-weight: 400;
		color: #666666;
		border-color: #E1E1E1;
	}
	.right{
		font-weight: 400;
		color: #EF2B20;
		border-color: #EF2B20;
	}
</style>
