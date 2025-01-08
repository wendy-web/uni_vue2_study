<!-- tab组件: <me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs> -->
<template>
    <view class="me-tabs" :class="{'tabs-fixed': fixed}" :style="{height: tabHeightVal, top:topFixed, 'margin-top':topMargin}">
        <scroll-view
            v-if="tabs.length"
            :id="viewId"
            :scroll-left="scrollLeft"
            scroll-x scroll-with-animation
            :scroll-animation-duration="300"
        >
            <view class="tabs-item" :class="{'tabs-flex':!isScroll, 'tabs-scroll':isScroll}">
                <view
                    class="tab-item"
                    :style="{height: tabHeightVal, 'line-height':tabHeightVal}"
                    v-for="(tab, i) in tabs"
                    :class="{'active': value===i}"
                    :key="i"
                    @click="tabClick(i)"
					:id="'tabItemId'+i"
                >
                    {{tab.title}}
                </view>
                <!-- 下划线 -->
                <view class="tabs-line" :style="{left:lineLeft || firstLineLeft}">
					<image class="icon-curve" src="@/static/images/home/icon_red_line.png" mode="aspectFit"></image>
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
                default(){
                    return []
                }
            },
            value: { // 当前显示的下标 (使用v-model语法糖: 1.props需为value; 2.需回调input事件)
                type: [String, Number],
                default: 0
            },
            fixed: Boolean, // 是否悬浮,默认false
            height: { // 高度,单位rpx
                type: Number,
                default: 64
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
                firstLineLeft: 0,
                tabDomList: [],
                lineLeft: 0
            }
        },
        computed: {
            isScroll(){
                return this.tabs.length;
            },
            tabHeightPx(){
                return uni.upx2px(this.height);
            },
            tabHeightVal(){
                return this.tabHeightPx+'px';
            },
            topFixed(){
                return this.fixed ? this.windowTop + uni.upx2px(this.top) + 'px' : 0
            },
            topMargin(){
                return this.fixed ? 0 : this.top + 'rpx'
            }
        },
        watch: {
            tabs(newValue) {
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
            this.tabDomList = this.tabs;
            this.scrollCenter(); // 滚动到当前下标
            this.$nextTick(()=>{
				setTimeout(() => {
					this.itemDomFun();
				}, 2000);
			})
        },
        methods: {
            tabClick(i){
                if(this.value!=i){
                    this.$emit("input",i);
                    this.$emit("change",i);
                }
                if(!this.tabDomList[i].width && !this.tabDomList[i].left) {
                    this.itemDomFun();
					// const tabItemId = `tabItemId${i}`;
					// this.initWarpRect(tabItemId).then(result => {
					// 	this.firstLineLeft = result.left + (result.width) / 2 + 'px';
					// });
                    return;
				}
                const currentDom = this.tabDomList[i];
                this.lineLeft = currentDom.left + (currentDom.width) / 2 + 'px';
            },
            itemDomFun(){
                this.tabDomList = [];
				this.tabs.forEach((res, index) => {
					const tabItemId = `tabItemId${index}`;
					this.initWarpRect(tabItemId).then(result => {
						if((index == this.value) && !this.firstLineLeft){
							this.firstLineLeft =  result.left + result.width / 2 + 'px';
						}
                        let tabDomList_left = 0;
                        if(index == 0) {
							tabDomList_left = 0;
						} else {
							tabDomList_left = this.tabDomList[index-1].left + this.tabDomList[index-1].width;
						}
                        this.tabDomList.push({
                            width: result.width,
						    left: tabDomList_left
                        });
					});
				});
			},
            async scrollCenter(){
                if(!this.isScroll) return;
                if(!this.warpWidth){
                    let rect = await this.initWarpRect()
                    this.warpWidth = rect ? rect.width : this.windowWidth; // 某些情况下取不到宽度,暂时取屏幕宽度
                }
				const currentDom = this.tabDomList[this.value];
                if(!currentDom) return;
				let tabLeft = currentDom.left + currentDom.width / 2; // 当前tab中心点到左边的距离
                let diff = tabLeft - this.warpWidth/2; // 如果超过tabs容器的一半,则滚动差值
                this.scrollLeft = diff;
            },
            initWarpRect(id){
                return new Promise(resolve=>{
                    let query = uni.createSelectorQuery();
                    // #ifndef MP-ALIPAY
                    query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
                    // #endif
                    query.select('#' + (id || this.viewId)).boundingClientRect(data => {
                        resolve(data)
                    }).exec();
                }).catch((e) => {});
            }
        }
    }
</script>

<style lang="scss">
.me-tabs{
    position: relative;
    font-size: 24rpx;
    box-sizing: border-box;
    overflow-y: hidden;
    background-color: #ffffff;
    z-index: 2;
    &.tabs-fixed{
        z-index: 990;
        position: fixed;
        left: 0;
        width: 100%;
    }
    .tabs-item{
        position: relative;
        white-space: nowrap;
        box-sizing: border-box;
        .tab-item{
            position: relative;
            text-align: center;
            box-sizing: border-box;
            color: #666666;
            font-size: 28rpx;
            padding: 0 32rpx;
            &.active{
                color: #EF2B20;;
            }
        }
    }
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
        bottom: 0;
        width: 50rpx;
        transform: translateX(-50%);
        border-radius: 4rpx;
        transition: left .3s;
        height: 14rpx;
        display: flex;
        justify-content: center;
    }
    .icon-curve{
        width: 32rpx;
        height: 14rpx;
    }
}
</style>
