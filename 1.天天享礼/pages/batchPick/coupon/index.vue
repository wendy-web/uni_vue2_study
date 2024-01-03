
<template>
	<view class="batch-pick-coupon">
		
		<mescroll-uni ref="mescrollRef"   @init="mescrollInit"
								:down="downOption" @emptyclick="downCallback" @down="downCallback" :up="upOption" @up="upCallback" :safearea="true">
		
		  <!-- 卡劵item -->
		  <view class="card-item" v-for="item in listData" :key="item.id">
		  	<view class="card-name">
		  		{{item.product_title}}
		  	</view>
			<view class="card-time">
				有效期至：{{item.expire_time}}
			</view>
			<!-- 右边信息 -->
			<view class="card-r-info">
				<view class="card-price" :class="{'expire':item.status == 3}">
					<text class="sign">¥</text>{{item.face_value}}
				</view>
				<view class="to-expire" v-if="item.status == 3">
					{{item.statusText}}
				</view>
				<view class="to-use" v-else @click="goDetails(item)">
					去使用
				</view>
			</view>
			<!-- 左上角icon -->
			<image class="left-horn-icon" :src="item.brand_logo+'&corner.png'" mode="aspectFill"></image>
			<!-- 背景 -->
			<image  class="card-bg" :src="item.status == 3?'../static/card_bg_expire.png':'../static/card_bg.png'" mode="aspectFill"></image>
		  </view>
								
		</mescroll-uni>
		
	</view>

</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
    import {allCardList} from '@/api/modules/batchPick.js'
	export default {
		mixins: [MescrollMixin],
		data(){
			return {
				downOption: {
					auto: true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: true, // 不自动加载
					noMoreSize:1, 
					empty: {
						use:true,
						icon:null,
						tip:"暂无相关数据",
						btnText:'刷新试试'
					},
					toTop: {
						src: ''
					},
					textNoMore: '- 快去获得更多券吧 -'
				},
			   //列表数据
			   listData: []
			}
		},
		methods:{
			/*下拉刷新的回调 */
			downCallback() {
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				
				const API =  allCardList
				
				let parmas = {
					page:page.num
				}
				
				//获取数据next:NEXT,
				API(parmas).then(res => {
				    
					const {data:list} = res.data
					
					let data =  {
						list: list||[]
					};
					
					//设置列表数据
					if (page.num == 1) {
						this.listData = []; //如果是第一页需手动制空列表
					}
					
					const _statusText = ['未使用','已领取','已使用','已过期']
					
					data.list = data.list.map(function(item){
						
						let statusText = _statusText[item.status]
						
						return {
							...item,
							statusText
						}
						
					})
					
					//填充数据
					this.listData = this.listData.concat(data.list);
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endSuccess(0);
				});
				
			},
			goDetails({id}){
				uni.navigateTo({
					url:'/pages/batchPick/details/index?id='+id
				})
			}
		}
	}
	
</script>

<style lang="scss">
	
	page{
		background-color: #F5F5F5;
	}

.card-item{
	margin: 24rpx;
	position: relative;
	height: 168rpx;
	box-sizing: border-box;
	padding: 40rpx 0 40rpx 56rpx;
	overflow: hidden;
}

.card-name{
	font-size: 28rpx;
	font-weight: 700;
	color: #333333;
	position: relative;
	z-index: 1;
	margin-bottom: 14rpx;
	position: relative;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	width: 70%;
}
.card-time{
	font-size: 22rpx;
	font-weight: 400;
	color: #999999;
	position: relative;
	z-index: 1;
}
.card-r-info{
	position: absolute;
	width: 168rpx;
	height: 168rpx;
	right: 0;
	top: 0;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.left-horn-icon{
	position: absolute;
	left: 0;
	top: 0;
	width: 82rpx;
	height: 90rpx;
	z-index: 1;
}
.card-bg{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 168rpx;
}
.card-price{
	font-size: 48rpx;
	font-weight: 700;
	color: #ffffff;
}	
.card-price.expire{
	color: #AAAAAA;
}
.sign{
	font-size: 32rpx;
}
.to-use{
	width: 120rpx;
	height: 42rpx;
	border: 2rpx solid #ffffff;
	border-radius: 11px;
	font-size: 24rpx;
	font-weight: 400;
	color: #ffffff;
	text-align: center;
	line-height: 42rpx;
	margin-top: 20rpx;
}
.to-expire{
	width: 120rpx;
	height: 42rpx;
	border: 2rpx solid #AAAAAA;
	border-radius: 11px;
	font-size: 24rpx;
	font-weight: 400;
	color: #AAAAAA;
	text-align: center;
	line-height: 42rpx;
	margin-top: 20rpx;
}
	
</style>
