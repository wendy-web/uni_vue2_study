<template>
	<view class="batch-pick-user" >
	 <!-- 底色 -->
	 <view class="page-color" :style="bgColor"></view>
	 <image class="user-top-bg" src="../static/user_top_bg.png" mode="aspectFill"></image>
	 <mescroll-uni ref="mescrollRef" :fixed="true" @emptyclick="downCallback"  @init="mescrollInit" @down="downCallback" :down="downOption" :up="upOption" @up="upCallback" :safearea="true">
		    <view :style="'padding-top:'+topHeight"></view>
			<!-- 用户信息 -->
			<view class="user-info bpu-card">
				<!-- 用户头像 -->
				<image v-if="userInfo.avatar_url" class="user-avatar" :src="userInfo.avatar_url" mode="widthFix"></image>
				<image v-else class="user-avatar" @click="authorized" src="../static/unlisted_user.png" mode="widthFix"></image>
				<block v-if="isAutoLogin">
					<view class="user-name">
						{{userInfo.nick_name}}
					</view>
					<view class="user-id">
						ID:{{userInfo.id}}
					</view>
				</block>
				<view class="unauthorized" v-else @click="authorized">点击登录</view>
				<!-- more -->
				<van-icon class="more" name="ellipsis" @click="showMore"/>
				<!-- 弹窗 -->
				<view class="more-pop-up" v-if="showMorePopup">
					<view class="mpu-item" @click="jump('/pages/batchPick/coupon/index')">
						我的卡券
					</view>
					<view class="mpu-item" @click="goServer">
						联系客服
					</view>
					<view class="mpu-item" @click="aboutUs">
						关于我们
					</view>
				</view>
			</view>
			<!-- 扫一扫 -->
			<view class="scan-bpu-card-box">
				<view class="scan-bpu-card">
					<text class="scan-text">扫一扫</text>
					<image class="scan-icon" src="../static/scan.png" mode="aspectFill" @click="scan"></image>
				</view>
			</view>
			<!-- 卡列表 -->
			<view class="card-list" v-if="listData.length">
				<view class="card-head-box">
					<view class="card-head">
						我的礼品卡
					</view>
				</view>
				<view class="card-item" v-for="(item,index) in listData" :key="item.id">
					<view class="card-serial-no">
						卡{{index+1}}
					</view>
					<view class="card-box" @click="goDetails(item)">
						<view class="card-icon">
							<van-image  width="52rpx" height="52rpx" :src="item.brand_logo" fit="contain" lazy-load use-loading-slot>
								<van-loading slot="loading" type="spinner" size="20" vertical />
							</van-image>
						</view>
						<view class="card-info">
							<view class="card-name">
								{{item.product_title}}
							</view>
							<view class="card-small-name">
								¥{{item.face_value}}
							</view>
						</view>
						<van-icon class="go-details" name="arrow" />
					</view>
				</view>
			</view>
			<!-- 黑幕 -->
			<view class="intangible" v-if="showMorePopup" @click="showMorePopup = false"></view>
		</mescroll-uni>
	</view>
</template>

<script>
	import { getNavbarData } from '@/components/xhNavbar/xhNavbar.js';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import { mapGetters } from 'vuex';
	import {validCardList} from '@/api/modules/batchPick.js';
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data(){
			return {
				topHeight:0,
				downOption: {
					use:true,
					textColor: '#999',
					auto: true
				},
				upOption: {
					use:true,
					auto: true, // 不自动加载
					noMoreSize: 1,
					empty: {
						use:false,
						icon:null,
						tip:"暂无相关数据",
						btnText:'刷新试试'
					},
					toTop: {
						src: ''
					},
					textNoMore: '- 快去获得更多券吧 -'
				},
				showMorePopup:false,
				listData:[]
			}
		},
		computed:{
			...mapGetters(['userInfo', 'isAutoLogin']),
			bgColor(){
				return this.listData.length===0?'background-color: #F5F5F5;':'background-color: #ffffff;'
			}
		},
		watch:{
			userInfo(j,k){
				this.upCallback({num:1})
			}
		},
		onLoad(o){
			getNavbarData().then(res => {
				let {navBarHeight,statusBarHeight} = res
				this.topHeight = navBarHeight+statusBarHeight + 'px'
			})
		},
		onHide() {
			this.showMorePopup = false
		},
		methods:{
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				const API =  validCardList
				let parmas = {
					page:page.num
					// limit:10
				}
				API(parmas).then(res => {
					const {data:list} = res.data
					let data =  {
						list: list||[]
					};
					//设置列表数据
					if (page.num == 1) {
						this.listData = []; //如果是第一页需手动制空列表
					}
					//填充数据
					this.listData = this.listData.concat(data.list);
					this.mescroll.endSuccess(data.list.length);
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endSuccess(0);
				});
			},
			showMore(){
				this.showMorePopup = !this.showMorePopup
			},
			goDetails({id}){
				uni.navigateTo({
					url:'/pages/batchPick/details/index?id='+id
				})
			},
			scan(){
				wx.scanCode({
					success(res){
						let result = res.result
						    //result = res.result.split('?')
							// if(result.length<1||result[0]!=='https://ttxl-test.y1b.cn'){
							// 	uni.showModal({
							// 		title:'温馨提示',
							// 		content:'非礼品卡二维码，请重扫码'
							// 	})
							// 	return
							// }
						uni.navigateTo({
							url:'/pages/batchPick/receive/index?code='+encodeURIComponent(result)
						})
					}
				})
			},
			jump(url){
				//跳转对应页面
				uni.navigateTo({
					url
				})
			},
			aboutUs(){
				this.$go('/pages/tabAbout/aboutUs/index');
			},
			authorized(){
				uni.reLaunch({
					url:'/pages/tabAbout/login/index'
				});
			},
			goServer(){
				this.$go('/pages/tabAbout/service/service');
			}
		}
	}
</script>

<style>
	.page-color{
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		right: 0;
		width: 100%;
		height: auto;
		z-index: -1;
	}
	.user-top-bg{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 412rpx;
		z-index: -1;
	}
	.bpu-card{
		background: #ffffff;
		border-radius: 11px;
		margin: 0 24rpx;
	}
	.user-info{
		padding-top: 96rpx;
		padding-bottom: 32rpx;
		margin-top: 64rpx;
		box-shadow: 0px 6px 10px 0px rgba(51,51,51,0.02); 
/* 		position: relative;
		z-index: 2; */
		text-align: center;
	}
	.user-name{
		font-size: 32rpx;
		font-weight: 700;
		text-align: center;
		color: #333333;
	}
	.user-id{
		font-size: 24rpx;
		font-weight: 400;
		text-align: center;
		color: #999999;
		margin-top: 5rpx;
	}
	.user-avatar{
		width: 128rpx;
		height: 128rpx;
		box-shadow: 0px 0px 16px 0px rgba(51,51,51,0.08);
		border-radius: 50%;
		position: absolute;
		transform: translate(-50%,-125%);
		left: 50%;
	}
	
	
	.more{
		font-size: 40rpx;
		position: absolute;
		right: 48rpx;
		margin-top: -160rpx;
		color: #AAAAAA;
	}
	
	.unauthorized{
		font-size: 32rpx;
		font-weight: 700;
		color: #333333;
		text-align: center;
		padding-bottom: 30rpx;
	}
	
	.scan-bpu-card-box{
		background-color: #f5f5f5;
	}
	
	.scan-bpu-card{
		display: flex;
		justify-content: space-between;
		margin-top: 24rpx;
		padding: 16rpx 24rpx;
		background-color: rgba(255, 255, 255, .7);
		border-radius: 0 0 11px 11px;
		margin: 0 48rpx;
	}
	
	.scan-icon{
		width: 38rpx;
		height: 36rpx;
	}
	
	.scan-text{
		font-size: 28rpx;
		font-weight: 400;
		color: #333333;
	}
	
	.card-list{
		background-color: #ffffff;
		padding-bottom: 40rpx;
	}
	
	.card-head-box{
		background-color: #f5f5f5;
		padding-top: 32rpx;
	}
	
	.card-head{
		padding-top: 40rpx;
		padding-left: 24rpx;
		font-size: 32rpx;
		font-weight: 700;
		color: #333333;
		letter-spacing: 0.7rpx;
		border-radius: 24px 24px 0px 0px;
		background-color: #ffffff;
	}
	
	.card-item{
		margin: 32rpx 24rpx 0;
	}
	.card-serial-no{
		font-size: 28rpx;
		font-weight: 400;
		color: #666666;
		margin-bottom: 16rpx;
	}
	.card-box{
		background-color: #F6F9FA;
		border-radius: 11px;
		display: flex;
		align-items: center;
		padding: 40rpx 32rpx;
		position: relative;
	}
	
	.card-info{
		margin-left: 18rpx;
	}
	.card-name{
		font-size: 26rpx;
		font-weight: 700;
		color: #333333;
		position: relative;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
	}
	.card-small-name{
		font-size: 22rpx;
		font-weight: 400;
		color: #999999;
		margin-top: 16rpx;
		width: 300rpx;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.card-icon{
		width: 108rpx;
		height: 108rpx;
		background-color: #ffffff;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0;
	}
	
	.go-details{
		position: absolute;
		top: 50%;
		right: 24rpx;
		transform: translateY(-50%);
		width: 30rpx;
		height: 30rpx;
		border-radius: 50%;
		font-size: 36rpx;
		color: #999999;
	}
	
	.more-pop-up{
		position: absolute;
		width: 248rpx;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0px 2px 20px 0px rgba(51,51,51,0.16); 
		right: 56rpx;
		margin-top: -125rpx;
		animation: morePop 0.3s linear 0s 1 both;
		z-index: 2;
	}
	.mpu-item{
		font-size: 26rpx;
		font-weight: 400;
		text-align: left;
		color: #333333;
		padding: 24rpx 0 24rpx 24rpx;
		position: relative;
	}
	
	.mpu-item::after{
		content: '';
		position: absolute;
		height: 1rpx;
		left: 24rpx;
		right: 24rpx;
		background-color: #F1F1F1;
		bottom: 0;
	}
	
	.intangible{
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0);
	}
	
	@keyframes morePop {
		0%{
		   transform: scale(0);	
		   transform-origin: right top;
		}
		100%{
			transform: scale(1);	
			transform-origin: right top;
		}
	}
	
	
	
</style>