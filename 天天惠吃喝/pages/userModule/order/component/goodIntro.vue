<template>
<view>
	<view class="good-intro-box" v-if="content&&content!='<p><br></p>'">
		<view class="title">使用说明</view>
		<view class="content">
			<u-parse :content="content"></u-parse>
		</view>
	</view>
	<view class="good-intro-box" v-if="exchangeRule&&exchangeRule!='<p><br></p>'">
		<view class="title">兑换须知</view>
		<view class="content">
			<u-parse :content="exchangeRule"></u-parse>
		</view>
	</view>
</view>
</template>
<script>
	import uParse from '@/components/u-parse/u-parse.vue';
import {
checkRichText,
escape2Html
} from '@/utils/index.js';
	export default {
		props: {
			orderInfo: {
				type: Object,
				default: () => {}
			}
		},
		components: {
			uParse,
		},
		computed: {
			content() {
				let {
					goods_instruction,
					order_guide
				} = this.orderInfo

				let data = order_guide || goods_instruction

				if (data) {
					let html = escape2Html(data || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			},
			exchangeRule() {
				let {
					goods_details
				} = this.orderInfo
				if (goods_details) {
					let html = escape2Html(goods_details || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			}
		}
	}
</script>

<style lang="scss">
	.good-intro-box {
		box-sizing: border-box;
		padding: 32rpx 24rpx;
		width: 702rpx;
		background: #ffffff;
		border-radius: 24rpx;
		margin-top: 16rpx;
	}

	.title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		line-height: 42rpx;
		margin-bottom: 24rpx;
	}

	.content {
		font-size: 26rpx;
		font-weight: 400;
		color: #666666;
		line-height: 36rpx;
		margin-bottom: 16rpx;
		word-break: break-word;
	}

	.tips {
		width: 654rpx;
		box-sizing: border-box;
		background: #f7f8fa;
		border-radius: 16rpx;
		padding: 16rpx;
		font-size: 24rpx;
		color: #999999;

	}
</style>
