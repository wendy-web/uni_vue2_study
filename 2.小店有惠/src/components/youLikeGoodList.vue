<template>
<view class="you_like pd_32">
	<view class="like-title">
		<view class="like-left">为你推荐</view>
		<view class="like-right" @click="viewMoreHandle">
			查看更多
			<van-icon name="arrow" color="#999" size="14" />
		</view>
	</view>
	<good-list :list="goods" />
</view>
</template>

<script>
import goodList from '@/components/goodList.vue';
import {
	recommend
} from "@/api/modules/myCredit.js";
export default {
	components:{
		goodList
	},
	props: {
		list: {
			type: Array,
			default () {
				return []
			}
		},
	},
	data() {
		return {
			goods: []
		}
	},
	mounted() {
		recommend().then(res => {
			let list = res.data || [];
			this.goods = list.map(function (item) {
              return {
                ...item,
                sale_price: (item.sale_price / 100).toFixed(2),
                price: (item.price / 100).toFixed(2),
              };
            });
		}).catch(err => {
		})
	},
	methods: {
		viewMoreHandle(){
			uni.switchTab({
				url: '/pages/home/index'
			});
			this.$emit('more');
		}
	}
}
</script>

<style lang="scss">
.pd_32{
	padding: 0 32rpx;
}
.like-title{
	margin: 60rpx auto 8rpx;
	display: flex;
	justify-content: space-between;
	.like-left{
		font-size: 32rpx;
		font-weight: 500;
		color: #333333;
		line-height: 44rpx;
	}
	.like-right{
		font-size: 28rpx;
		color: #999999;
		line-height: 40rpx;
	}
}
</style>
