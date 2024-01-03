<template>
	<view class="ranking-list">
		
		<mescroll-uni ref="mescrollRef" :fixed="false"  @init="mescrollInit"
								:down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
				<view class="ranking-head">
					<view class="ranking-title">
						排行榜
					</view>
					<view class="ranking-time">
						最后更新于{{time}}
					</view>
				</view>				
		  		
				<view class="ranking-table"  v-if="active===1">
						<view class="ranking-row ranking-row-th">
							<view class="ranking-cell01">排名</view>
							<view class="ranking-cell02">昵称</view>
							<view class="ranking-cell03">点亮城市(座)</view>
						</view>
						<view class="ranking-row  ranking-row-tr" v-for="(item,index) in listData" :key="item.id">
							<view class="ranking-cell01">
								<image class="rank-index-icon" v-if="index<=2" :src="'/static/images/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
								<view class="rank-index-text" v-else>{{index+1}}</view>
							</view>
							<view class="ranking-cell02">
								<image class="team-icon" :src="item.avatar_url" mode="aspectFill"></image>
								<view class="team-name">{{item.nick_name||'-'}}</view>
							</view>
							<view class="ranking-cell03">
								<view class="ranking-num">{{item.city_num}}</view>
							</view>
						</view>
					</view>
				<!-- 城市排行榜 -->
				<view class="ranking-table"  v-else>
						<view class="ranking-row ranking-row-th">
							<view class="ranking-cell01">排名</view>
							<view class="ranking-cell04">城市</view>
							<view class="ranking-cell03">点亮次数</view>
						</view>
						<view class="ranking-row  ranking-row-tr" v-for="(item,index) in listData" :key="item.id">
							<view class="ranking-cell01">
								<image class="rank-index-icon" v-if="index<=2" :src="'/static/images/rank0'+(index+1)+'.png'" mode="aspectFill"></image>
								<view class="rank-index-text" v-else>{{index+1}}</view>
							</view>
							<view class="ranking-cell04">
								<view class="team-name">{{item.city||''}}</view>
							</view>
							<view class="ranking-cell03">
								<view class="ranking-num">{{item.lit_num||0}}</view>
							</view>
						</view>
				</view>
		</mescroll-uni>
		<!-- 隐私协议的组件 -->
		<privacy ref="privacy"></privacy>
	</view>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {getAllRank,getCityRank} from '@/api/modules/home.js'
	import {parseTime} from '@/utils/index.js'
	//分页
	let NEXT = 0;
	export default {
		mixins: [MescrollMixin],
		data(){
			return {
				downOption: {
					auto: true // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: true, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty: {
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去新闻页'
					// },
					toTop: {
						src: ''
					},
					textNoMore: '~ 暂无更多信息 ~'
				},
			   //列表数据
			   listData: [],
			   active:1,
			   time:parseTime(Date.now())
			}
		},
		onLoad(o) {
			this.active = +o.active
		},
		onShow() {
			// 隐私协议判断
			this.$refs.privacy.LifetimesShow();
		},
		methods:{
			/*下拉刷新的回调 */
			downCallback() {
				NEXT = 0
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				const API =  this.active == 1?getAllRank:getCityRank
				
				let parmas = {
					limit:10
				}
				
				if(NEXT != 0)parmas.next = NEXT
				
				//获取数据next:NEXT,
				API(parmas).then(res => {
				    
					const {list,next} = res.data
					
					let data =  {
						list: list||[]
					};
			
					//设置列表数据
					if (NEXT == 0) {
						this.listData = []; //如果是第一页需手动制空列表
					}
					NEXT = next
					//填充数据
					this.listData = this.listData.concat(data.list);
					
					if(this.active == 1){
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态
						this.mescroll.endSuccess(data.list.length);
					}else{
						//联网成功的回调,隐藏下拉刷新和上拉加载的状态
						this.mescroll.endSuccess(data.list.length);
					}
					
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
				
			}
		}
	}
	
</script>

<style lang="scss">
	page{
		background-color: #151D41;
	}
	.ranking-list{
		background-color: #2e3c59;
		border-radius: 20px;
		position: absolute;
		width: 100%;
		top: 40rpx;
		bottom: 40rpx;
		left: 0;
		.ranking-head{
			padding: 40rpx 40rpx 28rpx;
			position: relative;
			&::after{
				content: '';
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 2rpx;
				background-color: #7e7e7e;
			}
		}
		.ranking-title{
			font-size: 36rpx;
			font-weight: 700;
			color: #ffffff;
		}
		.ranking-time{
			font-size: 28rpx;
			font-weight: 400;
			color: #c5c5c5;
			margin-top: 10rpx;
		}
		
	}
</style>