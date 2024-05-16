<template>
<view id="beanDomBox" :class="[
	'bean',
	(iconFindLightIndex >= 0) ? 'list_light-box' : ''
]">
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
				<view :style="{color: item.color || '#333', fontWeight: item.bold ? 600 : 400,position: 'relative'}">{{item.title}}</view>
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
	// margin-top: 20rpx;
	// background: linear-gradient(180deg,#ffffff, rgba(255,255,255,0.04) 50%);
	// background: #fff;
	// border-radius: 28rpx 28rpx 0rpx 0;
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
}
.bean_list-box {
	width: 100%;
	box-sizing: border-box;
	min-height: 340rpx;
	padding: 0 4rpx;
}
.bean_list{
	display: flex;
	align-items: center;
	font-size: 24rpx;
	text-align: center;
	line-height: 34rpx;
	flex-wrap: wrap;
	position: relative;
}
.bean_list-item {
	margin-top: 28rpx;
	// margin-bottom: 24rpx;
	width: 20%;
	flex: 0 0 20%;
	position: relative;
}
.bean_small_icon {
	position: absolute;
	right: -16rpx;
	top: -14rpx;
	width: 64rpx;
	height: 40rpx;
	z-index: 1;
}
.list_img {
	width: 96rpx;
	height: 96rpx;
	font-size: 0;
	position: relative;
	margin: 0 auto 2rpx;
}
.list_light-box {
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
