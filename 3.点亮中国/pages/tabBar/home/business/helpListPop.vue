<template>
	<view class="help-list-pop">
		<van-popup :show="show"  @close="popupClose" custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="hlp-box">
				<view class="hlp-box-head">
					<text class="total">{{total}}</text>
					位好友成功助力
				</view>
				<!-- list -->
				<view class="hlp-box-list">
					<mescroll-uni ref="mescrollRef" :fixed="false"  @init="mescrollInit"
					 	:down="downOption" @down="downCallback" :up="upOption" @up="upCallback" safearea>
						   <!-- listItem -->
	                       <view class="list-item" v-for="item in listData" :key="item.id">
							  <image class="user-icon image-round" :src="item.avatar_url" mode="aspectFill"></image>
	                       	  <view class="list-item-top">
	                       	  	 <view class="nick-name">
	                       	  	 	{{item.nick_name}}
	                       	  	 </view>
								 <view class="love">
								 	<text class="love-num">+1</text>
									<image class="lightning" src="/static/home/lightning.png" mode="aspectFill"></image>
								 </view>
	                       	  </view>
							  <view class="dl-city">
							  	点亮【{{item.city}}】
							  </view>
	                       </view>  
					 </mescroll-uni>
				</view>
			   <!-- 更多好友助力 -->
			   <view class="create-team-btn">
			     	<van-button round type="info" color="linear-gradient(180deg,#fda80c, #f5882e)" open-type="share" size="normal" block @click="invite">邀请更多好友</van-button>
			   </view>
			</view>
			<image class="close" src="/static/images/close.png" mode="aspectFill" @click="popupClose"></image>
		</van-popup>
		
	</view>
</template> 

<script>
    import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {getTodayHelpUser} from '@/api/modules/help.js'
	//分页
	let NEXT = 0;
	export default {
		mixins: [MescrollMixin], 
		data(){
			return {
				show:false,
				downOption: {
					use:false
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~'
				},
				listData:[],
				total:0
			}
		}, 
		methods:{
			/*獲取數據*/
			init(){
				NEXT = 0
				this.upCallback()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				
				let parmas = {
					limit:10
				}
				
				if(NEXT != 0)parmas.next = NEXT
				
				//获取数据next:NEXT,
				getTodayHelpUser(parmas).then(res => {
					
					const {total,list,next} = res.data
					
					let data =  {
						list: list||[]
					};
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (NEXT == 0) {
						this.listData = [] //如果是第一页需手动制空列表
						this.total = total&&total.help_num
					}
					NEXT = next
					//填充数据
					this.listData = this.listData.concat(data.list);
					//有數據就顯示彈窗
					if(this.listData.length > 0){
						this.show = true
						return
					}
					this.show = false
					this.$emit('clearHelpMarker')
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
			},
			popupShow(){
				this.show = true
			},
			popupClose(){
				this.show = false
				this.$emit('clearHelpMarker')
			},
			invite(){
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.help-list-pop{
		
		.hlp-box{
			position: relative;
			width: 604rpx;
			height: 936rpx;
			background-color: #ffffff;
			border-radius: 10px;
		}
		
		.hlp-box-head{
			height: 120rpx;
			line-height:120rpx;
			font-size: 32rpx;
			font-weight: 400;
			color: #000018;
			text-align: center;
			.total{
				color: #E3001B;
			}
		}
		
		.hlp-box-list{
			position: absolute;
			top: 120rpx;
			bottom:180rpx;
			left: 30rpx;
			right: 30rpx;
		}
		

	
		
		.close{
			width: 56rpx;
			height: 56rpx;
			display: block;
			margin: 60rpx auto 0;
		}
		
		
		.create-team-btn{
			position: absolute;
			bottom: 50rpx;
			width: 436rpx;
			left: 50%;
			transform: translateX(-50%);
		}
		
		.list-item{
			position: relative;
			padding-left: 66rpx;
			padding-bottom: 24rpx;
			padding-top: 40rpx;
			&::after{
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 2rpx;
				background-color: #DCDCDC;
			}
		}
		
		.user-icon{
			width: 52rpx;
			height: 52rpx;
			position: absolute;
			left: 0;
			top: 40rpx;
		}
		
		.list-item-top{
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.nick-name{
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
		}
		.nick-name{
			font-size: 24rpx;
			font-weight: 400;
			color: #4e4d52;
		}
		.love{
			display: flex;
			align-items: center;
		}
		.love-num{
			font-size: 32rpx;
			font-weight: 400;
			color: #000018;
			margin-right: 12rpx;
		}
		.lightning{
			width: 32rpx;
			height: 40rpx;
		}
		.dl-city{
			font-size: 24rpx;
			font-weight: 400;
			color: #000018;
		}
		

	}


</style>