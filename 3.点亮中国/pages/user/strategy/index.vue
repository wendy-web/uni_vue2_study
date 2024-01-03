<template>
	<view class="strategy">
		<view class="title">
			常见问题
		</view>
		<van-collapse :value="activeNames" accordion  @change="onChange">
		  <van-collapse-item v-for="item in list" :key="item.id" :title="item.title" :name="item.id">
		    <view class="strategy-item" v-for="(item,index) in item.answer"  :key="index">
		    	{{item}}
		    </view>
		  </van-collapse-item>
		</van-collapse>
		<!-- 客服 -->
		<view class="strategy-kefu" @click="goKefu">
			找不到答案？<text class="red">向我提问吧！</text>
		</view>
	</view>
</template>

<script>
	import {getQuestion} from '@/api/modules/home.js'
	export default {
		data(){
			return {
				activeNames: 1,
				list:[]
			}
		},
		onLoad() {
			getQuestion().then(res=>{
				let list = res.data?res.data.list:[]
				this.list = list.map(item=>{
					const {answer,id,title} = item
					return {
						answer:answer.split('|'),
						id,
						title
					}
				})
			})
		},
		methods:{
			 onChange(event) {
			
			     this.activeNames = event.detail
			    
			  },
			  goKefu(){
				  uni.navigateTo({
				  	url:'/pages/user/service/service'
				  })
			  }
		}
	}
</script>

<style>
	page{
		background-color: #F3F3F3;
	}	
	.strategy{
		padding: 20rpx;
	}
	.strategy .title{
		font-size: 32rpx;
		font-weight: 700;
		color: #000018;
		line-height: 100rpx;
		padding-left: 20rpx;
	}
	.strategy .strategy-item{
		text-indent: 2em;
	}
	.strategy-kefu{
		font-size: 25rpx;
		font-weight: 400;
		color: #4e4d52;
		letter-spacing: 0.16rpx;
		text-align: center;
		padding: 30rpx;
	}
	.strategy-kefu .red{
		color: #E3001B;
	}
</style>