<template>
<view class="currency-list">
	<mescroll-uni ref="mescrollRef" height="100%" @init="mescrollInit" :up="upOption" :down="downOption"
		@down="downCallback" @emptyclick="emptyClick">
		<!-- 品牌或活动 -->
		<view class="currency-item" v-for="(item,index) in config" hover-class="currency-item-hover" :key="index">
			<easy-loadimage :link="item.link" imageClass="news-imageclass" mode="aspectFill"
				@imageClick="previewImage" :image-src="item.img"></easy-loadimage>
			<view class="currency-item-info" @click="previewImage(item.link)">
				<!-- 主标题 -->
				<view class="currency-item-title">
					<view>{{item.title}}</view>
					<!-- 					<view>
						{{activeIndexText[index]}}
					</view> -->
				</view>
				<!-- 副标题 -->
				<view class="currency-item-small">
					{{item.digest}}
				</view>
			</view>
		</view>
		<view class="banner-ad" v-if="isAd">
			<!-- 视频广告 -->
			<ad unit-id="adunit-e3c4adfda6df676d" ad-type="video" ad-theme="white"></ad>
			<!-- banner广告 -->
			<!-- <ad unit-id="adunit-4df581ce4afefb6d"></ad> -->
			<!-- 原生模板 -->
			<xh-banner-ads :isFillet="false" unit-id="adunit-b793e54ad6d19f17" />
		</view>
	</mescroll-uni>
</view>
</template>
<script>
	import {
		mapActions
	} from 'vuex';
	// 引入mescroll-mixins.js
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import {
		filterAdData
	} from '@/utils/index.js';

	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				mescroll: null, // mescroll实例对象 (此行可删,mixins已默认)
				// 列表数据
				dataList: [],
				banner: [],
				// activeIndexText: ['(活动一)', '(活动二)'],
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
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				}
			};
		},
		props: {
			config: {
				type: Array,
				default: function() {
					return [];
				}
			},
			isAd: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			...mapActions({
				getAdData: 'personal/getAdData'
			}),
			/*mescroll组件初始化的回调,可获取到mescroll对象 (此处可删,mixins已默认)*/
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			/*下拉刷新的回调, 有三种处理方式:*/
			downCallback() {
				//拉取数据
				this.getAdData(false).then(() => {
					this.mescroll.endSuccess();
				}).catch((err) => {
					this.mescroll.endErr();
				});
			},
			/*空布局回调*/
			emptyClick() {

			},
			previewImage(link) { //查看详情
				//预览集合
				let _urls = filterAdData(this.config, 'link');
				//判断是否有link
				if (link) {
					uni.previewImage({
						current: link,
						urls: _urls // 需要预览的图片http链接列表
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.currency-list {
		height: 100%;
		.currency-item {
			background-color: #FFFFFF;
			border-radius: 5px;
			position: relative;
			overflow: hidden;
			z-index: 1;
			transform: translate3d(0, 0, 0);
			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
			transition: box-shadow 0.3s;
			padding: 20rpx;
			margin: 25rpx 25rpx;
			display: flex;
		}

		.currency-item-info {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding: 15rpx 0;
		}

		.currency-item-hover {
			box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
		}

		.currency-item-title {
			font-size: 30rpx;
			color: #333;
			margin: 5rpx 0;
			-webkit-line-clamp: 2;
			/*文本占的行数,如果要设置2行加...则设置为2*/
		}

		.currency-item-small {
			font-size: 24rpx;
			color: #999;
			-webkit-line-clamp: 1;
			/*文本占的行数,如果要设置2行加...则设置为2*/
		}

		.currency-item-title,
		.currency-item-small {
			overflow: hidden;
			/*超出隐藏*/
			text-overflow: ellipsis;
			/*文本溢出时显示省略标记*/
			display: -webkit-box;
			/*设置弹性盒模型*/
			-webkit-box-orient: vertical;
			/*子代元素垂直显示*/
		}

		.ios-bottom {
			height: 40rpx;
			margin-top: -25rpx;
		}

		.banner-ad {
			width: 100%;
			// position: absolute;
			// left: 0;
			// bottom: 0;
			margin-top: 100rpx;
		}
	}
</style>
