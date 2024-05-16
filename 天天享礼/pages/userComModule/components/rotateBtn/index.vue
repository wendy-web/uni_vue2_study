<template>
	<view class="wrap" @touchstart="startHandle" @touchmove="moveHandle" @touchend="endHandle">
		<image class="qq" src="https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/qq.png"></image>
		<view class="box"
			:style="{
				transform: `perspective(8000rpx) rotateY(${Y}deg)` }">
			<view v-for="(item, i) in list" :key="i" @click.stop="clickHandle(item,index)"
				:style="{transform: `rotateY(${item.deg}deg) translateZ(360rpx)`  }"
				class="itemBox">
				<!-- <view v-for="(item, i) in list" :key="i" @click.stop="clickHandle(item,index)"
					:style="{transform: `rotateY(${deg * (i+1)}deg) translateZ(360rpx)`  }" class="itemBox"> -->
				<!-- <image :src="item.icon"></image>
				<view :class="[index == i ? 'active' : '' ]">{{item.title}}</view> -->
				<view class="testBox"
					:class="[ index == i ? '' : 'test2', i == rightIndex ? 'rightSty' : '', i == leftIndex ? 'leftSty' : '' ]">
					<image :src="item.selectIcon" v-if="index == i"></image>
					<image :src="item.icon" v-else></image>
					<view :class="[index == i ? 'active' : '' ]">{{item.title}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			dataList: {
				type: Array,
				default: function(){
					return [
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/map.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/map_select.png',
							path: '/pages/tabbar/map',
							mode: 'navigateTo', // switchTab
							title: '电子地图',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/coupon.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/coupon_select.png',
							path: '/pages/list/coupon_centre',
							mode: 'navigateTo', // switchTab
							title: '领券中心',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mem.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mem_select.png',
							path: '/pages/member/equity',
							mode: 'navigateTo', // switchTab
							title: '会员权益',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/point.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/point_select.png',
							path: '/pages/tabbar/ticketUp',
							mode: 'navigateTo', // switchTab
							title: '自助积分',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/activty.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/activty_select.png',
							path: '/pages/activity/list',
							mode: 'navigateTo', // switchTab
							title: '活动报名',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall_select.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall.png',
							path: '/pages/tabbar/mall',
							mode: 'navigateTo', // switchTab
							title: '商场信息',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/map.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/map_select.png',
							path: '/pages/tabbar/map',
							mode: 'navigateTo', // switchTab
							title: '电子地图',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/coupon.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/coupon_select.png',
							path: '/pages/list/coupon_centre',
							mode: 'navigateTo', // switchTab
							title: '领券中心',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mem.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mem_select.png',
							path: '/pages/member/equity',
							mode: 'navigateTo', // switchTab
							title: '会员权益',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/point.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/point_select.png',
							path: '/pages/tabbar/ticketUp',
							mode: 'navigateTo', // switchTab
							title: '自助积分',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/activty.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/activty_select.png',
							path: '/pages/activity/list',
							mode: 'navigateTo', // switchTab
							title: '活动报名',
							deg: 0
						},
						{
							icon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall_select.png',
							selectIcon: 'https://ruiheng1201.oss-cn-beijing.aliyuncs.com/app/dev/images/20210224/mall.png',
							path: '/pages/tabbar/mall',
							mode: 'navigateTo', // switchTab
							title: '商场信息',
							deg: 0
						}
					]
				}
			},
			leftAndright1Deg: {
				type: Number,
				default:15
			},
			leftAndright2Deg: {
				type: Number,
				default:20
			},
		},
		data () {
			return {
				deg: 0,
				Y: 0,
				clientX: 0, //
				moveX: 0,
				direction: -1, // 1 == 向左  2==向右
				difference: 0, // 滑动距离
				index: 0, //
				isStart: false,
				list: [],
				leftIndex: null, // 左边第一个元素 （以当前index为准）
				leftIndex2: null, // 左边第二元素
				rightIndex: null,
				rightIndex2: null,
				oneDeg: 15, // 左侧/右侧第一个偏移度数
				towDeg: 20  // 左侧/右侧第er个偏移度数
			}
		},
		created(){
			this.list = JSON.parse(JSON.stringify(this.dataList))
			this.oneDeg = this.leftAndright1Deg
			this.towDeg = this.leftAndright2Deg
			this.deg = 360 / this.list.length;
			this.list.forEach((item, index) => {
				item.deg = this.deg* (index +1)
			})
		},
		beforeMount(){},
		mounted(){
			let selft = this
			this.deg = 360 / this.list.length;
			this.index = this.list.length - 1
			this.setStyle(this.index)
		},
		methods:{
			startHandle(e){
				if(this.isStart) return;
				this.isStart = true
				this.clientX = e.changedTouches[0].clientX
			},
			moveHandle(e){
				let clientX = e.changedTouches[0].clientX
				this.difference = Math.abs(this.clientX - clientX)
				if(this.clientX >clientX){ // 向左转
					this.direction = 1
				}else if(this.clientX <clientX){ // 向右转
					this.direction = 2
				}
			},
			endHandle(e){
				if(this.difference < 20){ // 滑动距离过小, 不做处理
					this.isStart = false
					return
				}
				if(this.direction == 1){// 向左转
					this.Y -= this.deg
					this.index = (this.index +1) % this.list.length
				}else if(this.direction == 2){ // 向右转
					this.Y += this.deg
					if(this.index == 0) this.index = this.list.length;
					this.index = (this.index -1) % this.list.length
				}
				this.difference = 0
				this.direction = -1
				setTimeout(_ =>{
					this.isStart = false
				}, 500)
				this.setStyle(this.index)
				this.$emit('change', this.index)
			},
			clickHandle(item,index){
				let i = ''
				let list = this.list
				for(let j=0;j<list.length; j++){
					if(list[j].title == item.title){
						i = j
						break
					}
				}
				if(i == index){
					this.$emit('gotoHandle',index)
				}
			},
			setStyle(index){
				// 计算右侧第一个元素下标
				this.rightIndex = (this.index +1) % this.list.length
				// 计算右侧第二个元素下标
				if(this.rightIndex == this.list.length -1){
					this.rightIndex2 = 0
				}else{
					this.rightIndex2 = this.rightIndex + 1
				}
				// 计算左侧第一个元素下标
				if(this.index == 0){
					this.leftIndex = this.list.length-1;
				}else{
					this.leftIndex = (this.index -1) % this.list.length;
				}
				// 计算左侧第二个元素下标
				if(this.leftIndex == 0){
					this.leftIndex2 = this.list.length -1
				}else{
					this.leftIndex2 = this.leftIndex -1
				}
				this.list.forEach((item, index) =>{
					let deg = this.deg* (index +1)
					let leftOneDeg = deg -this.oneDeg
					let rightOneDeg = deg +this.oneDeg
					let leftTwoDeg = deg -this.towDeg
					let rightTwoDeg = deg +this.towDeg
					if(index == this.rightIndex ){
						item.deg = leftOneDeg
					}else if(index == this.leftIndex){
						item.deg = rightOneDeg
					}else if(index == this.rightIndex2){
						item.deg = rightTwoDeg
					}else if(index == this.leftIndex2){
						item.deg = leftTwoDeg
					}
					else{
						item.deg = deg
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		width: 100vw;
		height: 24vh;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(#33334B, #17182D);
		position: relative;
		.qq{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 760rpx;
			height: 200rpx;
		}
	}
	.box{
		width: 100rpx;
		height: 100rpx;
		position: relative;
		box-sizing: border-box;
		transform-style: preserve-3d;
		transform: perspective(600rpx) translateY(0);
		transition: all .5s;
		.itemBox{
			width: 100rpx;
			height: 100rpx;
			position: absolute;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			perspective: 100;
			.testBox{
				width: 100rpx;
				height: 100rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				image{
					width: 80rpx;
					height: 80rpx;
				}
				view{
					font-size: 24rpx;
					color: #6262AF;
					transition: all .5s;
				}
				.active{
					color: #AC8861;
				}
			}
			.test2{
				transform: rotateY(180deg);
			}
			.leftSty{
				transform: rotateY(0deg);
			}
			.rightSty{
				transform: rotateY(0deg);
			}
		}
	}
</style>
