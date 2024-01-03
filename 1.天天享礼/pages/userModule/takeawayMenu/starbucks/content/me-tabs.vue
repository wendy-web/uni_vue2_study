<template>
<view class="me-tabs" id="tabBox">
	<scroll-view
		v-if="tabs.length"
		:id="viewId"
		:scroll-left="scrollLeft"
		:scroll-top="scrollTop"
		scroll-y
		scroll-with-animation
		:scroll-animation-duration="300"
		style="height: 100%"
	>
		<view class="tabs-item" :style="{ '--padding': isShowComBuy ? '106rpx' : '0rpx' }">
			<view class="tabs-line" :style="{top: lineTop + 'px'}"></view>
			<view class="tab-item txt_ov_ell1"
				v-for="(tab, i) in tabs"
				:class="{'active': value===i}" :key="i" @click="tabClick(i)"
				:id="'tabItemId'+i"
			>
				<view class="tab_txt">{{tab.categoryName}}</view>
			</view>
		</view>
	</scroll-view>
</view>
</template>

<script>
import { getImgUrl } from '@/utils/auth.js';
export default {
    props: {
        tabs: {
            type: Array,
            default () {
                return []
            }
        },
        value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
            type: [String, Number],
            default: 0
        },
        // 是否展示底部的购物组件 - 为底下留白
        isShowComBuy: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            viewId: 'id_' + Math.random().toString(36).substr(2, 16),
            scrollLeft: 0,
            scrollTop: 0,
            windowWidth: 0,
            windowTop: 0,
            topValue: 0,
            lineTop: 0,
            takeImgUrl: getImgUrl() + 'static/subPackages/userModule/takeawayMenu',
        }
    },
    watch: {
        tabs: {
            handler(newVal, oldVal) {
                this.warpWidth = null; // 重新计算容器宽度
                this.$nextTick(()=>{
                    setTimeout(() => {
                        this.itemDomFun();
                        this.scrollCenter(); // 滚动到当前下标;
                    }, 1000)
                });
            },
            deep: false
        },
        value(newValue) {
            this.scrollCenter(); // 水平滚动到中间
            this.setLineTop();
        }
    },
    created() {
        let sys = uni.getSystemInfoSync();
        this.windowWidth = sys.windowWidth;
        this.windowTop = sys.windowTop;
    },
    methods: {
        setLineTop() {
            const currentDom = this.tabs[this.value];
            let topStep = 0;
            if(currentDom && currentDom._top) {
                topStep = currentDom._top;
            }
            topStep = (topStep <= 0) ? 0 : topStep;
            this.lineTop = topStep;
        },
        tabClick(i) {
            const eventId = `coupongrouping_${i + 1}`;
            this.$wxReportEvent(eventId);
            if (this.value != i) {
                this.$emit("input", i);
                this.$emit("change", i);
            }
        },
        async itemDomFun(){
            this.initWarpRect('tabBox').then(res =>  this.topValue = res.top );
            this.tabs.forEach((res, index) => {
                const tabItemId = `tabItemId${index}`;
                this.initWarpRect(tabItemId).then(result => {
                    res.top = result.top;
                    res.height = result.height;
                    if(index == 0) {
                        res._top = 0;
                    } else {
                        res._top = this.tabs[index-1]._top + this.tabs[index-1].height + uni.upx2px(16);
                    }
                });
            });
        },
        async scrollCenter() {
            if (!this.warpWidth) { // tabs容器的宽度
                let rect = await this.initWarpRect();
                this.warpWidth = rect ? rect.width : this.windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
            }
            const currentDom = this.tabs[this.value];
            let diff = 0;
            if(currentDom && currentDom._top) {
                diff = currentDom._top - this.warpWidth / 2; // 如果超过tabs容器的一半,则滚动差值
            }
            this.scrollTop = diff;
            // #ifdef MP-TOUTIAO
            this.scrollTimer && clearTimeout(this.scrollTimer)
            this.scrollTimer = setTimeout(() => { // 字节跳动小程序,需延时再次设置scrollLeft,否则tab切换跨度较大时不生效
                this.scrollTop = Math.ceil(diff)
            }, 400)
            // #endif
        },
        initWarpRect(id) {
            return new Promise(resolve => {
                setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
                    let query = uni.createSelectorQuery();
                    // #ifndef MP-ALIPAY
                    query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                    // #endif
                    query.select('#' + (id || this.viewId)).boundingClientRect(data => {
                        resolve(data)
                    }).exec();
                }, 20)
            })
        }
    }
}
</script>

<style lang="scss">
@import '@/static/css/mixin.scss';
.me-tabs {
	position: relative;
	font-size: 30rpx;
	font-weight: 500;
	box-sizing: border-box;
	overflow-y: hidden;
	color: #333;
	height: 100%;
	.tabs-item {
		position: relative;
		z-index: 0;
		white-space: nowrap;
		box-sizing: border-box;
		// 102是底部的add_label的文本留白
		padding-bottom: calc(var(--padding) + constant(safe-area-inset-bottom));
		/* 兼容 IOS<11.2 */
		padding-bottom: calc(var(--padding) + env(safe-area-inset-bottom));
		/* 兼容 IOS>11.2 */
		.tab-item {
			height: 76rpx;
			position: relative;
			text-align: center;
			font-size: 26rpx;
			color: #666;
			font-weight: 600;
			line-height: 76rpx;
			padding: 0 14rpx;
			box-sizing: border-box;
            margin-bottom: 16rpx;
			&.active {
				font-weight: 400;
				color: #333;
                .tab_txt::before {
                    content: '\3000';
                    position: absolute;
                    z-index: -1;
                    bottom: 0;
                    left: -2rpx;
                    width: 70%;
                    height: 10rpx;
                    background: linear-gradient(270deg,rgba(0,173,129,0.00), #00754a);

                }
			}
			.tab_img-box{
				width: 64rpx;
				height: 64rpx;
				margin-bottom: 8rpx;
				.tab_img{
					width: 100%;
					height: 100%;
				}
			}
			.tab_txt{
                display: inline;
                position: relative;
                z-index: 0;
			}
		}
	}
	// 选中tab的线
	.tabs-line {
		z-index: -1;
		position: absolute;
		left: 0;
		top: 0;
		transition: left .3s;
		width: 100%;
		height: 76rpx;
        background: linear-gradient(270deg,rgba(249,249,249,0.00) 0%, #e5e5e5);
	}
}
</style>
