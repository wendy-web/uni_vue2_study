<template>
	<view class="cowpea-record">
		<!-- 导航栏 -->
		<view class="cowpea-record-tabs">
			<van-tabs :active="active" @change="tabChange" line-width="52rpx" line-height="6rpx"  tab-class="cowpea-tabs">
			  <van-tab v-for="(item,index) in tabs" :key="item.id" :title="item.name" :name="index"  />
			</van-tabs>
		</view>
		<view class="list-box">
			<mescroll-uni :fixed="false" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
				<!-- 列表 -->
				<view class="list-item" v-for="item in goods" :key="item.id">
					<view class="list-item-title">
						{{item.name}}
					</view>
					<view class="list-item-time">
						{{item.create_time}}
					</view>
					<!-- 收支 -->
					<view class="collect-branch">
						<view class="cb-num">
							<text>{{item.type==1?'+':'-'}}</text>
							<text class="cb-num-change">{{item.change}}</text>
						</view>
						<text>牛金豆</text>
					</view>
				</view>
			</mescroll-uni>
		</view>

	</view>
</template>

<script>
		import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
		import {creditsLog} from '@/api/modules/user.js'
	export default{
		mixins: [MescrollMixin], // 使用mixin
		data(){
			return {
				active:0,
				tabs:[
					{id:0,name:'全部', goods: null, num:1, curPageLen:0, hasNext:true},
					{id:1,name:'收入', goods: null, num:1, curPageLen:0, hasNext:true},
					{id:2,name:'支出', goods: null, num:1, curPageLen:0, hasNext:true}
					],
				preIndex: null
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
				//参数
				let params = {
					page:page.num,
					size:10,
					type:key
				}
				creditsLog(params).then((res)=>{
					let list = res.data?res.data.data:[]
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
				},200)
				//联网失败, 结束加载
				// this.mescroll.endErr();
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
			},
			getData(){
				let size = Math.random()*10
				let arr = []
				for (let i = 0;i<size;i++) {
					let isFlag = Math.round(Math.random())>0
					arr.push({
						id:Math.random()*10+'_'+i,
						num:isFlag?5:-5,
						name:'兑换「某优惠券名称」',
						time:'2020-12-06 59:59:59'
					})
				}
				return arr
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f7f7f7;
	}
	.van-tabs__scroll{
		background-color: #f7f7f7 !important;
	}
	.cowpea-record-tabs{
		margin: 0 140rpx;
		
	}
	.list-box{
		position: absolute;
		top: 48px;
		bottom: 0;
		left: 0;
		width: 100%;
		height: auto;
		background-color: #ffffff;
		border-radius: 16px 16px 0px 0px;
	}
	
	.list-item{
		padding: 32rpx 24rpx 0;
		margin-bottom: 48rpx;
		position: relative;
	}
	
	.list-item-title{
		font-size: 26rpx;
		font-weight: 400;
		color: #333333;
		margin-bottom: 8rpx;
	}
	.list-item-time{
		font-size: 26rpx;
		font-weight: 400;
		color: #999999;
	}
	
	.collect-branch{
		font-size: 20rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #fec927;
		white-space: nowrap;
		position: absolute;
		right: 24rpx;
		bottom: 24rpx;
		display: flex;
		align-items: center;
	}
	
	.cb-num{
		font-size: 24rpx;
		font-weight: 500;
		color: #fec927;
		margin-right: 4rpx;
		.cb-num-change{
			font-size: 32rpx;
		}
	}

	.van-tab .van-ellipsis{
		font-size: 28rpx;
	}
	.van-tab.van-tab--active .van-ellipsis{
		font-weight: 600;
	}

	
</style>