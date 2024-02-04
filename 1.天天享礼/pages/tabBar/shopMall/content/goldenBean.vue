<template>
<view id="beanDomBox" :class="['bean',
	userInfo.is_vip ? 'vip_active' : '',
	(iconFindLightIndex >= 0) ? 'list_light-box' : ''
]">
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
		<view :class="['bean_list', (iconFindLightIndex >= 0) ? 'list_light-box' : '']">
			<view v-for="(item,index) in list" :key="index"
				:class="['bean_list-item', (iconFindLightIndex == index) ? 'lightShowIcon' : '']"
				@click="navHandle(item)">
				<view v-if="iconFindLightIndex == index" class="lightShowIcon_box">
					<view
						:class="['light_txt', (iconFindLightIndex%5 < 3) ? 'light_txt-left' : 'light_txt-right']"
						v-if="lightArr.jd_word"
					>
						<image src="https://file.y1b.cn/store/1-0/2419/659cb25974d53.png"
							class="light_img-left" mode="widthFix"
						></image>
						<image src="https://file.y1b.cn/store/1-0/2419/659cb26d94fe1.png"
							class="light_img-right"  mode="widthFix"
						></image>
						{{ lightArr.jd_word }}
					</view>
				</view>
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
				<view :style="{color: item.color || '#666', fontWeight: item.bold ? 600 : 400,position: 'relative'}">{{item.title}}</view>
			</view>
		</view>
	</view>
</view>
</template>

<script>
import { savingInfo } from "@/api/modules/packet.js";
import { textNav } from '@/api/modules/shopMall.js';
import pCountup from '@/components/p-countUp/countUp.vue';
import { getImgUrl } from '@/utils/auth.js';
import goDetailsFun from '@/utils/goDetailsFun';
import { mapGetters, mapMutations } from 'vuex';
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
			vipObject: null,
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
		},
		diaList: {
            handler(newValue, oldValue) {
                if (newValue.length && newValue[0] == "iconFind") {
					this.comFindIconIndex();
				}
            },
            immediate: true
        }
	},
	computed: {
		...mapGetters(['userInfo', 'isAutoLogin', 'lightArr', 'iconFindLightIndex', 'diaList'])
	},
	methods:{
		...mapMutations({
			setIconFindLightIndex: "user/setIconFindLightIndex",
            delCurrentDiaList: "user/delCurrentDiaList",
            setLightArr: "user/setLightArr"
		}),
		async init() {
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
			const textNavRes = await textNav();
			if(textNavRes.code != 1) return;
			this.list = textNavRes.data;
			this.comFindIconIndex();
		},
		comFindIconIndex() {
			if(!this.lightArr || (this.diaList.length && (this.diaList[0] != "iconFind"))) return;
			const { id } = this.lightArr;
			const findLightIndex = this.list.findIndex(res => res.id == id);
			this.setIconFindLightIndex(findLightIndex);
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
			if(this.iconFindLightIndex >= 0) {
				this.setIconFindLightIndex(-1);
				this.delCurrentDiaList();
				this.setLightArr(null);
			}; // 关闭天天过来时高亮展示的样式
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
	margin-top: 30rpx;
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
		margin: 0 54rpx 0 84rpx;
		padding-top: 20rpx;
		position: relative;
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
			width: 26rpx;
			height: 26rpx;
			// z-index: -1;
		}
		&.packet_red::before {
			background-image: url("https://file.y1b.cn/store/1-0/23118/654b06516b55b.png");
		}
	}
	.bean_cont {
		margin: 0 50rpx 0 90rpx;
		position: relative;
		padding-top: 20rpx;
		// z-index: -1;
		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/store/1-0/231229/658e35ae1c017.png") center / contain no-repeat;
			position: absolute;
			left: -52rpx;
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
}
.bean_list-item {
	margin-top: 30rpx;
	// margin-bottom: 24rpx;
	width: 20%;
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
.list_light-box{
	.vip_cont,
	.bean_cont,
	.bean_list-item {
		z-index: -1;
	}
	.lightShowIcon {
	position: relative;
	z-index: 9;
	.light_head {
		position: absolute;
		width: 102rpx;
		height: 100rpx;
		bottom: -50rpx;
		right: -50rpx;
	}
	.lightShowIcon_box {
		position: absolute;
		z-index: 0;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 156rpx;
		height: 156rpx;
		background: #F7F7F7;
		border-radius: 50%;
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.2) inset;
		&::before {
			content: "\3000";
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			border-radius: 50%;
			animation: rippleAnimation 2s ease infinite;
			box-shadow: 0 0 8px rgba(255, 255, 255, 1) inset;
		}
		.light_txt {
			position: absolute;
			height: 78rpx;
			line-height: 84rpx;
			font-size: 28rpx;
			text-align: center;
			min-width: 128rpx;
			text-align: center;
			color: rgba(255,255,255,0.90);
			padding: 0 32rpx 0 40rpx;
			border-radius: 39rpx;
			white-space: nowrap;
			z-index: 0;
			top: 252rpx;
			&::before{
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/2419/659cb751dfad6.png") 0 0 / 100% 100% no-repeat;
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 184rpx;
				z-index: -1;
			}
			&.light_txt-left{
				left: 28rpx;
				&::before {
					transform: scaleX(-1);
				}
			}
			&.light_txt-right {
				right: 26rpx;
			}
			.light_img-left {
				width: 52rpx;
				height: 56rpx;
				position: absolute;
				left: -19rpx;
				bottom: 0;
			}
			.light_img-right{
				width: 38rpx;
				height: 42rpx;
				position: absolute;
				right: 0;
				top: 0;
			}
		}
	}
	}
}
@keyframes rippleAnimation {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	50% {
		transform: scale(1.2);
		opacity: 0.7;
	}
	100% {
		transform: scale(1.3);
		opacity: 0;
	}
}
</style>
