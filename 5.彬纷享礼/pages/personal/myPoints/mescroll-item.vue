<template>
	<!-- 当mescroll-body写在子组件时,父页面需引入mescroll-comp.js的mixins -->
	<mescroll-body ref="mescrollRef" top="472" @init="mescrollInit" @down="downCallback" @up="upCallback">
		<!-- 数据列表 -->
		<view class="mp-scan-item" v-for="(item,index) in listData" :key="index">
			<view class="mp-scan-item-header">
				<text>{{item.desc}}</text>
				<view class="msi-h-right"> 
					<text class="point-record-num" :class="Number(item.change)<0?'reduce':'add'">{{item.change|point}}</text>
					<image class="point-record-icon" src="../static/my-points-mini-icon.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="mp-scan-item-tiem">
				{{item.create_time}}
			</view>
		</view>
	</mescroll-body>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {getcreditslog} from '@/api/homeApi.js';
	
	export default {
		mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
		data() {
			return {
				listData: []
			};
		},
		filters:{
			point(val){
				return Number(val)>0?('+'+val):(''+val);
			}
		},
		methods: {
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				getcreditslog({
					next:page.num
				}).then(res=>{
					let data = res.data||{list:[]};
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if(page.num == 1) this.listData = []; //如果是第一页需手动制空列表
					this.listData=this.listData.concat(data.list); //追加新数据
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
			}
		}
	};
</script>
<style lang="scss">
	.mp-scan-item{
		margin-bottom: 40rpx;
		padding:0 40rpx 40rpx;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			width: 90%;
			transform: translateX(-50%);
			border-bottom: 2rpx dashed #e2e2e2;
		}
		.mp-scan-item-header{
			display: flex;
			justify-content: space-between;
			font-size: 28rpx;
			color: #333333;
			font-weight: 700;
		}
		.mp-scan-item-tiem{
			margin-top: 10rpx;
			color: #999;
			font-size: 24rpx;
		}
		.msi-h-right{
			display: flex;
			align-items: flex-start;
		}
		.point-record-num{
           font-size: 28rpx;
		   font-weight: 700;
		   margin-right: 5rpx;
		}
		.reduce{
			color: #FD433F;
		}
		.add{
			color: #189947;
		}
		.point-record-icon{
			height: 44rpx;
			width: 47rpx;
		}
	}
</style>
