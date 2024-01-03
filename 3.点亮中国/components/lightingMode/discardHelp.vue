<template>
	<view class="discard-help">
		<van-popup :show="show"  custom-style="background-color: transparent;" :close-on-click-overlay="false"  :z-index="10000">
			<view class="discard-help-box">
				<!-- 背景 -->
               <van-image  width="604rpx" height="634rpx" src="https://file.y1b.cn/public/img/dlzg/fqzl.png" fit="cover" use-loading-slot>
                	<van-loading slot="loading" type="spinner" size="20" vertical />
               </van-image>
               <!-- info -->
			   <view class="discard-help-info">
			   	   确定要放弃助力你的好友吗？
			   </view>
			   <!-- 创建团队 -->
			   <view class="create-team-btn">
				   <view class="ctb-item">
				     	<van-button round color="#F68C28" plain  size="normal" block @click="close">残忍放弃</van-button>
				   </view>
				   <view class="ctb-item">
				     	<van-button round color="linear-gradient(180deg,#fda80c, #f5882e)" size="normal" block @click="immediateHelp">继续助力</van-button>
				   </view>
			   </view>
			</view>
		</van-popup>
	</view>
</template>

<script>
	import {lit} from '@/api/modules/help.js'
	import {getUserLocation} from '@/utils/getUserLocation.js'
	//請求參數
    let _parmas;
	export default {
		data(){
			return {
				show:false
			}
		},
		methods:{
			popupShow(config){
				_parmas = config
				this.show = true
			},
			popupClose(){
				this.show = false
			},
			close(){
				this.show = false
				//引导页
				this.$emit('showGuide')
			},
			immediateHelp(){
				getUserLocation().then(res=>{
					let {longitude,latitude} = res.data
					lit({
						uid:_parmas.uid,
						longitude,
						latitude
					}).then(res=>{
						if(res.code == 1){
							this.show = false
							this.$emit('helpSuccess',res.data)
							return
						}
						uni.showToast({
							icon:'none',
							title:res.msg
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.discard-help{
		
		.discard-help-box{
			position: relative;
			width: 604rpx;
			height: 634rpx;
			font-size: 0;
		}
		
		.discard-help-info{
			font-size: 36rpx;
			font-weight: 400;
			color: #000018;
			position: absolute;
			top: 78rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
		
		.ctb-item{
			width: 240rpx;
		}
		
		.create-team-btn{
			position: absolute;
			bottom: 50rpx;
			left: 40rpx;
			right: 40rpx;
			display: flex;
			justify-content: space-between;
		}
		

	}


</style>