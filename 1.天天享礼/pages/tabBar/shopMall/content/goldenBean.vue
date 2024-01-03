<template>
<view id="beanDomBox"
	:class="['bean', userInfo.is_vip ? 'vip_active' : '']"
>
	<!-- vip的呈现样式 -->
	<view :class="['vip_cont fl_bet', vipObject.packet_num ? 'packet_red' : '']" v-if="userInfo.is_vip">
		<block v-if="vipObject.packet_num">{{ vipObject.packet_num }}张红包可用</block>
		<block v-else>累计已省 {{ vipObject.saving_money || 0}} 元</block>
		<image
			src="https://file.y1b.cn/store/1-0/23118/654aff55216ef.png"
			class="cont_right-img" mode="widthFix"
			@click="gotoVipHandle"
		></image>
	</view>
	<view class="bean_cont fl_bet" v-else>
		<p-countup id="credits" :num="num" width="12" height='26' color="#FE9B22" fontSize="20" fontWeight="600">
		</p-countup>
		<view class="cont_right" @click="goToTask"></view>
	</view>
	<view class="bean_list-box">
		<view class="bean_list">
			<view class="bean_list-item"
				v-for="(item,index) in list" :key="index"
				@click="navHandle(item)"
			>
                <view class="list_img">
				    <image class="bean_small_icon" :src="item.tag" mode="aspectFill"></image>
                    <van-image
                        height="88rpx"
                        width="88rpx"
                        :src="item.image"
                        use-loading-slot
                        fit="contain"
                    ><van-loading slot="loading" type="spinner" size="12" vertical />
                    </van-image>
                </view>
				<view>{{item.title}}</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import pCountup from '@/components/p-countUp/countUp.vue';
import { mapGetters } from 'vuex';
import { textNav } from '@/api/modules/shopMall.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { getImgUrl } from '@/utils/auth.js';
import { savingInfo } from "@/api/modules/packet.js";
export default {
	mixins: [goDetailsFun],
	components: {
		pCountup
	},
	props: {
		num: {
			type: Number,
			default: 0
		}
	},
	data(){
		return {
			creditsDom: null,
			list: [
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				},
				{
					title: '加载中...'
				}
			],
			luckyBrandId: 0,
			imgUrl: getImgUrl(),
			vipObject: null
		}
	},
	watch: {
		'userInfo.is_vip': {
			handler:async function (newValue, oldValue) {
				if(!newValue) return;
				const res = await savingInfo();
				if(res.code != 1 || !res.data) return;
				this.vipObject = res.data;
			},
			deep: true
		}
	},
	computed: {
		...mapGetters(['userInfo', 'isAutoLogin'])
	},
	methods:{
		async init() {
			const textNavRes = await textNav();
			if(textNavRes.code == 1){
				this.list = textNavRes.data;
			}
			let query = uni.createSelectorQuery().in(this)
			query.select('#credits').boundingClientRect()
			query.exec((res) => {
				const creditsDom = res[0];
				this.creditsDom = creditsDom;
			});
			setTimeout(async () => {
				const domBoxRes = await this.warpRectDom('beanDomBox');
				this.$emit('heightUpdate', domBoxRes.height + uni.upx2px(30))
			}, 2000);
		},
		warpRectDom(idName) {
			return new Promise(resolve => {
				setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
						// #endif
					query.select('#'+idName).boundingClientRect(data => {
						resolve(data)
					}).exec();
				}, 20)
			})
		},
		getCreditsDom() {
			return this.creditsDom;
		},
		goToTask() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
			this.$emit('goTask');
		},
		gotoVipHandle() {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
			this.$go('/pages/userCard/card/cardVip/index');
		},
		navHandle(item){
			this.textDetailsFun_mixins({
				...item,
				isNavFromUrl: true
			});
		}
	}
}
</script>
<style lang="scss">
.bean {
	width: 100%;
	position: relative;
	z-index: 0;
	margin-top: 30rpx;
	overflow: hidden;
	&::before {
		content: '\3000';
		background: url("https://file.y1b.cn/store/1-0/23826/64e9689de3190.png") 0 0 / 100% 100% no-repeat;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: 0;
		width: 718rpx;
		height: 100%;
		z-index: -1;
	}
	&::after {
		content: '\3000';
		background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/credit_icon.png") 0 0 / cover no-repeat;
		width: 212rpx;
		height: 64rpx;
		position: absolute;
		top: 11rpx;
		left: 62rpx;
		z-index: -1;
	}
	&.vip_active{
		&::before {
			background-image: url("https://file.y1b.cn/store/1-0/23118/654afbb14f36f.png");
		}
		&::after{
			background: none;
		}
	}
	.credit_icon {
		width: 212rpx;
		height: 64rpx;
		position: absolute;
		top: 11rpx;
		left: 62rpx;
		z-index: -1;
	}
	.bean_bg-icon {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: -1;
		height: 92rpx;
	}
	.vip_cont {
		margin: 20rpx 54rpx 0 84rpx;
		position: relative;
		z-index: 0;
		font-size: 30rpx;
		font-weight: 600;
		color: #b75a30;
		.cont_right-img {
			width: 142rpx;
			height: 32rpx;
		}
		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/public/img/ttxl/static/card/card_icon.png") center / contain no-repeat;
			position: absolute;
			left: -34rpx;
			top: 50%;
			transform: translateY(-50%);
			width: 26rpx;
			height: 26rpx;
			z-index: -1;
		}
		&.packet_red::before {
			background-image: url("https://file.y1b.cn/store/1-0/23118/654b06516b55b.png");
		}
	}
	.bean_cont {
		margin: 20rpx 50rpx 0 90rpx;
		position: relative;
		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/store/1-0/231229/658e35ae1c017.png") center / contain no-repeat;
			position: absolute;
			left: -52rpx;
			top: 0;
			width: 52rpx;
			height: 48rpx;
		}
		.bean_num {
			width: 116rpx;
			height: 66rpx;
			font-size: 48rpx;
			font-weight: 500;
			color: #84372e;
			line-height: 66rpx;
		}
		.cont_right {
			&::before {
				content: '\3000';
				background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/cont_right-txt.png") center / contain no-repeat;
				display: inline-block;
				width: 116rpx;
				height: 28rpx;
				margin-right: 10rpx;
				padding-top: 10rpx;
			}
			&::after {
				content: '\3000';
				background: url("https://file.y1b.cn/public/img/ttxl/static/shopMall/golden_right-icon.png") center / contain no-repeat;
				display: inline-block;
				width: 22rpx;
				height: 22rpx;
			}
		}
	}
}
.bean_list-box {
	width: 100%;
	box-sizing: border-box;
	min-height: 358rpx;
	padding: 10rpx 32rpx 22rpx;
}
.bean_list{
	display: flex;
	align-items: center;
	font-size: 24rpx;
	text-align: center;
	color: #666;
	line-height: 34rpx;
	flex-wrap: wrap;
	position: relative;
	padding-top: 20rpx;
	.bean_list-item {
		margin-top: 30rpx;
		// margin-bottom: 24rpx;
		width: 25%;
		flex: 0 0 20%;
		position: relative;
	}
	.bean_small_icon {
		position: absolute;
		right: -20rpx;
		top: -18rpx;
		width: 64rpx;
		height: 40rpx;
        z-index: 1;
	}
	.list_img {
		width: 88rpx;
		height: 88rpx;
        font-size: 0;
        position: relative;
		margin: 0 auto 2rpx;
	}
}
</style>
