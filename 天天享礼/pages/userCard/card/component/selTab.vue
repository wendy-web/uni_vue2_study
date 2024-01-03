
<template>
<view class="me-tabs" :style="{height: tabHeightVal, top:topFixed, 'margin-top':topMargin}">
    <scroll-view v-if="tabs.length" :id="viewId" :scroll-left="scrollLeft" scroll-x scroll-with-animation :scroll-animation-duration="300">
        <view class="tabs-item" :class="{'tabs-flex':!isScroll, 'tabs-scroll':isScroll}">
            <!-- tab -->
            <view class="tab-item" :style="{width: tabWidthVal, height: tabHeightVal, 'line-height':tabHeightVal}"
                v-for="(tab, i) in tabs" :class="{'active': value===i}" :key="i" @click="tabClick(i)">
                {{ tab.name }}
            </view>
            <!-- 下划线 -->
            <view class="tabs-line" :style="{left:lineLeft}">
            </view>
        </view>
    </scroll-view>
</view>
</template>

<script>
    export default {
        props:{
            tabs: {
                type: Array,
                default: []
            },
            value: {
                type: [String, Number],
                default: 0
            },
            tabWidth: Number,
            height: {
                type: Number,
                default: 84
            },
            top: { // 顶部偏移的距离,默认单位rpx (当fixed=true时,已加上windowTop)
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                viewId: 'id_' + Math.random().toString(36).substr(2,16),
                scrollLeft: 0,
                windowWidth: 0,
                windowTop: 0,
            }
        },
        computed: {
            isScroll(){
                return this.tabWidth && this.tabs.length // 指定了tabWidth的宽度,则支持水平滑动
            },
            tabHeightPx(){
                return uni.upx2px(this.height)
            },
            tabHeightVal(){
                return this.tabHeightPx+'px'
            },
            tabWidthPx(){
                return uni.upx2px(this.tabWidth)
            },
            tabWidthVal(){
                return this.isScroll ? this.tabWidthPx+'px' : ''
            },
            lineLeft() {
                if (this.isScroll) {
                    return this.tabWidthPx * this.value + this.tabWidthPx/2 + 'px' // 需转为px (用rpx的话iOS真机显示有误差)
                } else{
                    return 100/this.tabs.length*(this.value + 1) - 100/(this.tabs.length*2) + '%'
                }
            },
            topFixed(){
                return this.fixed ? this.windowTop + uni.upx2px(this.top) + 'px' : 0
            },
            topMargin(){
                return this.fixed ? 0 : this.top + 'rpx'
            }
        },
        watch: {
            tabs() {
                this.warpWidth = null; // 重新计算容器宽度
                this.scrollCenter(); // 水平滚动到中间
            },
            value() {
                this.scrollCenter(); // 水平滚动到中间
            }
        },
        created() {
            let sys = uni.getSystemInfoSync();
            this.windowWidth = sys.windowWidth
            this.windowTop = sys.windowTop
        },
        mounted() {
            this.scrollCenter() // 滚动到当前下标
        },
        methods: {
            tabClick(i){
                if(this.value!=i){
                    this.$emit("input",i);
                    this.$emit("change",i);
                }
            },
            async scrollCenter(){
                if(!this.isScroll) return;
                if(!this.warpWidth){ // tabs容器的宽度
                    let rect = await this.initWarpRect()
                    this.warpWidth = rect ? rect.width : this.windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
                }
                let tabLeft = this.tabWidthPx * this.value + this.tabWidthPx/2; // 当前tab中心点到左边的距离
                let diff = tabLeft - this.warpWidth/2 // 如果超过tabs容器的一半,则滚动差值
                this.scrollLeft = diff;
                // #ifdef MP-TOUTIAO
                this.scrollTimer && clearTimeout(this.scrollTimer)
                this.scrollTimer = setTimeout(()=>{ // 字节跳动小程序,需延时再次设置scrollLeft,否则tab切换跨度较大时不生效
                    this.scrollLeft = Math.ceil(diff)
                },400)
                // #endif
            },
            initWarpRect(){
                return new Promise(resolve=>{
                    setTimeout(()=>{ // 延时确保dom已渲染, 不使用$nextclick
                        let query = uni.createSelectorQuery();
                        // #ifndef MP-ALIPAY
                        query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                        // #endif
                        query.select('#'+this.viewId).boundingClientRect(data => {
                            resolve(data)
                        }).exec();
                    },20)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me-tabs{
        position: relative;
        font-size: 24rpx;
        box-sizing: border-box;
        overflow-y: hidden;
        background-color: #fff;
        &.tabs-fixed{
            z-index: 990;
            position: fixed;
            left: 0;
            width: 100%;
        }
        .tabs-item{
            position: relative;
            white-space: nowrap;
            padding-bottom: 30rpx;
            box-sizing: border-box;
            .tab-item{
                position: relative;
                text-align: center;
                box-sizing: border-box;
				color: #666;
				font-size:28rpx;
                &.active{
                    font-weight: bold;
                    color: #333;
                }
            }
        }
        // 平分的方式显示item
        .tabs-flex{
            display: flex;
            .tab-item{
                flex: 1;
            }
        }
        .tabs-scroll{
            .tab-item{
                display: inline-block;
            }
        }
        .tabs-line{
            z-index: 1;
            position: absolute;
            bottom: 30rpx;
            transform: translateX(-50%);
            transition: left .3s;
			display: flex;
			justify-content: center;
            width: 52rpx;
            height: 4rpx;
            background: linear-gradient(176deg,#fff16b 0%, #ffde39 100%);
            border-radius: 2rpx;
            box-shadow: 2rpx 2rpx 8rpx 0rpx rgba(234,204,36,0.50); 
        }
		.icon-curve{
			width: 30rpx;
			height: 14rpx;
		}
    }
</style>
