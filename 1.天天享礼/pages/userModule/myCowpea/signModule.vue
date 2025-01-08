<template>
	<view class="sign-module" @click="getWxMsgId">
		<!-- 背景 -->
		<image class="my-cowpea-card-bg" :src="punch ? singBg : singBg_active" mode="aspectFill"></image>
		<!-- 连续次数 -->
		<view class="continuous-sign">
			已连续签到<text class="sign-num">{{days}}</text>天
		</view>
		<!-- 签到 -->
		<view :class="['sign-title', punch ? '' : 'active']">{{ punch ? '签到' : '已签到'}}</view>
		<!-- 大金豆 -->
		<image class="big-cowpea" :src="takeImgUrl + '/big_cowpea.png'" mode="aspectFill"></image>
		<!-- 每周签到 -->
		<view class="every-week">
			<block v-for="(item,index) in signs"  :key="item.id">
				<!-- 最后一天 已签-->
				<view class="item-today-signed its-opacity" v-if="index === 6&&item.status === 1">
					<!-- 更多豆子 -->
					<image class="my-cowpea-more" :src="takeImgUrl + '/my_cowpea_more.png'" mode="aspectFill"></image>
					<!-- num -->
					<view class="item-today-num">
						+{{item.num}}
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						已签
					</view>
				</view>
				<!-- 最后一天 今天未签-->
				<view class="item-today-unsigned" v-else-if="index === 6&&item.isToday&&item.status === 0" >
					<!-- 更多豆子 -->
					<image class="item-today-more" :src="takeImgUrl + '/my_cowpea_more.png'" mode="aspectFill"></image>
					<!-- num -->
					<view class="item-today-num">
						+{{item.num}}
					</view>
					<!-- 签到 -->
					<view class="item-today-title">
						签到
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						今天
					</view>
				</view>
				<!-- 最后一天 未签-->
				<view class="item-today-signed" v-else-if="index === 6">
					<!-- 更多豆子 -->
					<image class="my-cowpea-more" :src="takeImgUrl + '/my_cowpea_more.png'" mode="aspectFill"></image>
					<!-- num -->
					<view class="item-today-num">
						+{{item.num}}
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						7天
					</view>
				</view>
				<!-- 今天 -->
				<view class="item-today" v-else-if="item.isToday&&item.status === 0"  >
					<!-- 背景 -->
					<image class="sign-bg"  :src="takeImgUrl + '/sign_yq.png'" mode="aspectFill"></image>
					<!-- 豆子 -->
					<image class="item-today-icon" :src="takeImgUrl + '/cowpea_icon.png'" mode="aspectFill"></image>
					<!-- 豆值 -->
					<view class="item-today-num">
						+{{item.num}}
					</view>
					<!-- 签到 -->
					<view class="item-today-title">
						签到
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						今天
					</view>
				</view>
				<!-- 已签 -->
				<view class="item-signed" v-else-if="item.status === 1">
					<!-- 背景 -->
					<image class="sign-bg" :src="takeImgUrl + '/sign_wq.png'" mode="aspectFill"></image>
					<!-- 豆子 -->
					<image class="item-signed-icon" :src="takeImgUrl + '/cowpea_icon.png'" mode="aspectFill"></image>
					<!-- 豆值 -->
					<view class="item-signed-num">
						+{{item.num}}
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						已签
					</view>
				</view>
				<!-- 未签 -->
				<view class="item-unsigned"   v-else>
					<!-- 背景 -->
					<image class="sign-bg" :src="takeImgUrl + '/sign_yq.png'" mode="aspectFill"></image>
					<!-- 豆子 -->
					<image class="item-signed-icon" :src="takeImgUrl + '/cowpea_icon.png'" mode="aspectFill"></image>
					<!-- 豆值 -->
					<view class="item-signed-num">
						+{{item.num}}
					</view>
					<!-- sign title -->
					<view class="sign-mark">
						{{index+1}}天
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {punch,canPunch} from '@/api/modules/user.js';
	import {wxmsgid} from '@/api/modules/index.js';
	import {mapGetters} from 'vuex';
    import { getImgUrl } from '@/utils/auth.js';
	let _firstload = 0
	export default {
		data() {
			return {
	            takeImgUrl: getImgUrl() + 'static/subPackages/userModule/myCowpea',
				days: 0,
                singBg: `${getImgUrl()}static/subPackages/userModule/myCowpea/my_cowpea_card_bg.png`,
                singBg_active: 'https://file.y1b.cn/store/1-0/23911/64fec67e488cb.png',
				signs: [{id:1,status:1,num:5,isToday:false},
				        {id:2,status:1,num:5,isToday:false},
						{id:3,status:1,num:5,isToday:false},
						{id:4,status:1,num:5,isToday:false},
						{id:5,status:1,num:10,isToday:false},
						{id:6,status:1,num:5,isToday:false},
						{id:7,status:0,num:50,isToday:false}],
				punch:false,//是否可以打卡
				punch_day:0,//打卡天数
				isPowerStatus: 0
			}
		},
		computed: {
			...mapGetters(['userInfo']),
		},
		watch:{
			userInfo(newVal,old){
				if(_firstload != 0)return;
				// 更新数据
				this.init()
				_firstload++
			}
		},
		mounted() {
	       this.init()
		},
		onLoad() {
			_firstload = 0
		},
		methods:{
			init(){
				canPunch().then(res=>{
					if(res.code==1){
						_firstload++
					}
					let {punch,day,rules} = res.data
					this.days = day;
					this.punch = punch;
					this.punch_day = day;
					day++
					this.signs = rules.map(function(item){
						let {days,credits} = item
						days = Number(days)
						let obj = {
							id:days,
							status:0,
							isToday:false,
							num:Number(credits)
						}
						/* 已签 */
						if(days<day){
							obj.status = 1
						}else if(days==day&&punch){//今天未签
							obj.status = 0
							obj.isToday = true
						}
						// 今天已签
						if(days==day-1&&!punch){
							obj.isToday = true
							obj.status = 1
						}
						return obj
					})
				})
			},
			async sign(num){
				const res = await punch({is_power: this.isPowerStatus});
				if(res.code != 1) return this.$toast(res.msg);
				this.init()
				this.$emit('showAwardModel',{reward:num});
			},
			// 获取模板id
			getWxMsgId(){
				let { num } = this.signs[this.punch_day];
				let punch = this.punch;
				if(!punch) return;
				wxmsgid().then(res=>{
					const accuentIds = res.data[0];
					if(!accuentIds) return this.sign(num);
					uni.requestSubscribeMessage({
						tmplIds:[accuentIds],
						complete:(event)=>{
							const resultState = event[accuentIds];
							this.isPowerStatus = (resultState == 'accept') ? 1 : 0;
							this.sign(num);
						}
					})
				});
			}
		}
	}
</script>

<style lang="scss">
	.sign-module{
		width: 726rpx;
		height: 298rpx;
		margin: 14rpx auto 26rpx;
		box-sizing: border-box;
		padding-top: 124rpx;
		position: relative;
		.my-cowpea-card-bg{
			width: 726rpx;
			height: 298rpx;
			position: absolute;
			top: 0;
			left: 0;
			// z-index: -1;
		}
		.continuous-sign{
			position: absolute;
			top: 42rpx;
			left: 36rpx;
			font-size: 30rpx;
			font-family: PingFang SC, PingFang SC-6;
			font-weight: 600;
			color: #333333;
		}
		.sign-num{
			margin: 0 8rpx;
		}
		.sign-title{
			font-size: 26rpx;
			font-family: PingFang SC, PingFang SC-6;
			font-weight: 500;
			color: #ffffff;
			position: absolute;
			top: 32rpx;
			left: 360rpx;
            min-width: 80rpx;
            text-align: center;
            &.active {
                color: #D6752C;
                opacity: .6;
            }
		}
		.big-cowpea{
			width: 160rpx;
			height: 174rpx;
			position: absolute;
			top: -60rpx;
			right: 44rpx;
		}
		.every-week{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 146rpx 0 36rpx;
			position: relative;
		}
		.item-signed,.item-unsigned{
			width: 80rpx;
			height: 104rpx;
			position: relative;
			text-align: center;
			box-sizing: border-box;
			padding-top: 12rpx;
		}
		.item-signed{
			opacity: 0.5;
		}
		.sign-bg{
			width: 80rpx;
			height: 104rpx;
			position: absolute;
			top: 0;
			left:0;
			z-index: -1;
		}
		.sign-mark{
			font-size: 22rpx;
			font-weight: 400;
			color: #999999;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: -40rpx;
			white-space: nowrap;
		}
		.item-signed-num{
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			color: #d6752c;
			text-align: center;
		}
		.item-signed-icon{
			width: 44rpx;
			height: 44rpx;
		}
		.item-today{
			width: 80rpx;
			height: 104rpx;
			position: relative;
			box-sizing: border-box;
			padding-top: 36rpx;
		}
		.item-today-icon{
			position: absolute;
			width: 44rpx;
			height: 44rpx;
			left: 50%;
			top: 0;
			transform: translate(-50%,-18rpx);
		}
		.item-today-num{
			font-size: 20rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			text-align: center;
			color: #d6752c;
			margin-bottom: 5rpx;
		}
		.item-today-title{
			font-size: 22rpx;
			font-weight: 400;
			text-align: center;
			color: #f9984f;
		}
		.item-today-signed{
			position: absolute;
			right: 32rpx;
			top: 0;
			width: 86rpx;
			height: 104rpx;
			padding-top: 4rpx;
			box-sizing: border-box;
			text-align:center;
			&.its-opacity{
				opacity: 0.5;
			}
		}
		.my-cowpea-more{
			width: 86rpx;
			height: 66rpx;
		}
		.item-today-num{
			font-size: 20rpx;
			font-weight: 400;
			color: #d6752c;
		}
		.item-today-unsigned{
			position: absolute;
			right: 32rpx;
			top: 0;
			width: 86rpx;
			height: 104rpx;
			box-sizing: border-box;
			padding-top: 40rpx;
			text-align:center;
		}
		.item-today-more{
			width: 86rpx;
			height: 66rpx;
			position: absolute;
			left: 50%;
			top: 0;
			transform: translate(-50%,-28rpx);
		}
	}
</style>