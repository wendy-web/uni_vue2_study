<template>
	<view class="home">
		<mescroll-body :sticky="true" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :up="upOption"  bottom="192rpx">
			<!-- 地图 -->
			<user-map v-if="[0,1].includes(tabIndex)"/>
			<!-- 热力图 -->
			<hot-map v-else-if="tabIndex == 2"/>
			<!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
            <view class="sticky-tabs">
				<me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
			</view>
			<!-- 我的团队 -->
			<team v-if="tabIndex == 1"/>
			<!-- 个人，团队, 勋章与城市-->
			<user v-if="[0,1].includes(tabIndex)"/>
			<!-- 点亮排行 -->
		</mescroll-body>
		<!-- 底部菜单 -->
		<view class="bottom-menu-box">
			<view class="bottom-menu">
				<view class="bottom-menu-btn">游戏点亮</view>
				<view class="bottom-menu-btn">好友助力</view>
			</view>
			<image class="bottom-menu-scan" src="../../../static/home/smdl.png" mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import userMap from './components/userMap.vue'
    import hotMap from './components/hotMap.vue'
	import user from './content/user.vue'
	import team from './content/team.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components:{
			userMap,hotMap,user,team
		},
		data(){
			return {
				upOption: {
					auto: false,
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '刷新试试'
					},
					toTop: {
						src: ''
					},
					isLock: true
				},
				tabIndex:1,
				tabs:[{name:'个人'}, {name:'团队'}, {name:'全民'}]
			}
		},
		methods:{
           /*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.endSuccess()
			},
			// 切换菜单
			tabChange (e) {
				this.tabIndex = e
			}
		}
	}
</script>

<style lang="scss">
 .home{
	 background-color: #232839;
	 .mescroll-uni{
		 background-color: #232839;
	 }
	 /*
	 sticky生效条件：
	 1、父元素不能overflow:hidden或者overflow:auto属性。(mescroll-body设置:sticky="true"即可, mescroll-uni本身没有设置overflow)
	 2、必须指定top、bottom、left、right4个值之一，否则只会处于相对定位
	 3、父元素的高度不能低于sticky元素的高度
	 4、sticky元素仅在其父元素内生效,所以父元素必须是 mescroll
	 */
	 .sticky-tabs{
	 	z-index: 990;
	 	position: sticky;
	 	top: 0;
	 }
	 .bottom-menu{
		 height: 192rpx;
		 background-color: #394A6D;
		 position: fixed;
		 width: 100%;
		 bottom: 0;
		 left: 0;
		 display: flex;
		 justify-content: space-between;
		 box-sizing: border-box;
		 padding: 30rpx 30rpx 54rpx;
		 .bottom-menu-btn{
			 width: 220rpx;
			 height: 76rpx;
			 box-sizing: border-box;
			 border: 2rpx solid #1684fc;
			 border-radius: 40px;
			 color: #91C6FF;
			 font-size: 28rpx;
			 display: flex;
			 align-items: center;
			 justify-content: center;
		 }
	 }
	 .bottom-menu-scan{
		 width: 214rpx;
		 height: 138rpx;
		 position: fixed;
		 bottom: 75rpx;
		 left: 50%;
		 transform: translateX(-50%);
		 z-index: 100;
	 }
 }
</style>
