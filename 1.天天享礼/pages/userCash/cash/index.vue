<template>
<view class="cash">
<mescroll-body
    id="mescrollBody"
    ref="mescrollRef"
    :sticky="true"
    @init="mescrollInit"
    @down="downCallback"
    :down="downOption"
    :up="upOption"
    @up="upCallback"
>
    <xh-navbar
        :fixedNum="true"
        titleAlign="titleRight"
        navbarImageMode="widthFix"
        :navberColor="false ? '#F9344B': '#f7f7f7'"
        :overFlow="true"
        navbarImage="https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png"
    >
        <view slot="title" class="nav-custom fl_bet">
            <view class="custom_left" @click="$topCallBack"></view>
            <view class="title_rule" @click="isRuleShowDia = true">规则</view>
        </view>
    </xh-navbar>
    <image src="https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png"
        :style="{'--margin': navHeight + 'px' }" mode="widthFix" class="nav_bg"></image>
    <openFirstRed
        @goToBuy="goToBuyHandle"
        @openFirstRef="openFirstRefHandle"
        :isShowRed="!isShowStatusAni"
        v-if="[1, 2, 3].includes(enterPageStatus)"
    ></openFirstRed>
    <cashFinishDom45
        @cashFinishDom45Ref="cashFinishDom45RefHandle"
        @goToBuy="goToBuyHandle"
        v-if="[4, 5].includes(enterPageStatus)"
    ></cashFinishDom45>
    <cashFinishDom6 v-if="[6].includes(enterPageStatus)"
        @cashFinishDom6Ref="cashFinishDom6RefHandle"
    ></cashFinishDom6>
    <!-- 活动 -->
    <cashFinishDom7 v-if="[7].includes(enterPageStatus)"
        @cashFinishDom7Ref="cashFinishDom7RefHandle"
    ></cashFinishDom7>

    <!-- 上拉的浮动定位显示 -->
    <view :class="['active_top', showActivityStatusDom ? 'active' : '']"
        :style="{ top: stickyTabTop, '--top': navHeight + 'px' }"
        v-if="showActivityStatusDom">
        <activityStatusDom></activityStatusDom>
    </view>
    <view class="cont_list" v-if="showTabsList.length">
        <view class="tabs_box" v-if="isShowTabDom"
            :style="{ top: stickyActTop}">
            <me-tabs
                v-model="tabIndex"
                :tabs="showTabsList"
                scroll="true"
                :height="tabHeight"
            ></me-tabs>
        </view>
        <view class="good_list-box" :style="{'--minheight': listContHeight}">
            <good-list :list="tabsList[tabIndex].goods"></good-list>
        </view>
    </view>
</mescroll-body>
<firstDia1 @close=""></firstDia1>
<firstRedOpenDia3 @close="closeFirstRedOpenDia3Handle"></firstRedOpenDia3>
<firstFinishDia5 @close="closeFirstFinishDia5Handle" ></firstFinishDia5>
<ruleGetCashDia :isShow="isRuleShowDia" @close="isRuleShowDia = false"></ruleGetCashDia>
</view>
</template>
<script>
import { goodsList, groupList } from '@/api/modules/cash.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getImgUrl } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import activityStatusDom from './component/activityStatusDom.vue';
import cashFinishDom45 from './component/cashFinishDom45.vue';
import cashFinishDom6 from './component/cashFinishDom6.vue';
import cashFinishDom7 from './component/cashFinishDom7.vue';
import firstDia1 from './component/firstDia1.vue';
import firstFinishDia5 from './component/firstFinishDia5.vue';
import firstRedOpenDia3 from './component/firstRedOpenDia3.vue';
import goodList from './component/goodList.vue';
import meTabs from './component/me-tabs.vue';
import openFirstRed from './component/openFirstRed.vue';
import ruleGetCashDia from './component/ruleGetCashDia.vue';
import cashMixin from './static/cashMixin.js'; // 混入分享的混合方法
export default {
    mixins: [MescrollMixin, cashMixin, shareMixin], // 使用mixin
    components: {
        meTabs,
        firstDia1,
        firstFinishDia5,
        openFirstRed,
        cashFinishDom45,
        cashFinishDom6,
        cashFinishDom7,
        activityStatusDom,
        firstRedOpenDia3,
        ruleGetCashDia,
        goodList,
    },
    data() {
        return {
            imgUrl: getImgUrl(),
            isShowNavBerColor: false,
            downOption: {
                auto: false,
                use: true,
                bgColor: "#ffffff",
            },
            upOption: {
                auto: true, // 不自动加载
                use: true,
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 1, // 每页数据的数量
                },
                noMoreSize: 4,
                empty: {
					use: false,
                },
            },
            tabIndex: 0,
            tabHeight: 94,
            topBoxHeight: 172 + 32, // rpx 头部置顶的使用
            openFirstRefHeight: 0, // 开始状态的页面头部显示内容
            cashFinishDom45RefHeight: 0, // 翻倍状态的头部显示内容
            cashFinishDom6RefHeight: 0, // 已翻倍完的头部显示内容
            cashFinishDom7RefHeight: 0, // 结束的头部显示
            activityStatusDomHeight: 236,
            tabsList: [],
            showTabsList: [],
            isShowActive: false, // 跳转使用到
            isShowGetCashDia: false,
            isRuleShowDia: false,
            initTimer: null,
        }
    },
    computed: {
        ...mapGetters(['enterPageStatus']),
        // 列表数据
        goodList() {
            if (this.tabsList.length > 0 ) {
                let item = this.tabsList[this.tabIndex];
                return item.goods;
            }
            return [];
        },
        navHeight() {
            let viewPort = getViewPort();
            return viewPort.navHeight;
        },
        stickyTop(){
            let viewPort = getViewPort();
			return viewPort.navHeight;
        },
        stickyActTop() {
            let stickyTop = this.stickyTop;
            if(![6, 7].includes(this.enterPageStatus)) stickyTop = stickyTop + uni.upx2px(this.activityStatusDomHeight)
            return stickyTop + 'px';
        },
        stickyTabTop() {
            let stickyTop = this.stickyTop;
            return stickyTop + 'px';
        },
        shopGroup() {
            return this.tabsList[this.tabIndex]?.shopGroup;
        },
        showActivityStatusDom() {
            return this.isShowActive && ![6, 7].includes(this.enterPageStatus);
        },
        listContHeight() {
            let viewPort = getViewPort();
            let swiperHeight = viewPort.windowHeight - viewPort.navHeight;
            return swiperHeight + "px";
        },
        isShowTabDom() {
            return this.showTabsList.length > 1;
        },
        scrollFixValue() {
            switch (this.enterPageStatus) {
                case 1:
                case 2:
                case 3:
                    // 开始状态的页面头部显示内容
                    return 32 + (this.openFirstRefHeight - uni.upx2px(this.activityStatusDomHeight));
                    break;
                case 4:
                case 5:
                    // 翻倍状态的头部显示内容
                    return 32 + (this.cashFinishDom45RefHeight - uni.upx2px(this.activityStatusDomHeight));
                    break;
                case 6:
                    return 32 + this.cashFinishDom6RefHeight;
                    break;
                case 7:
                    return this.cashFinishDom7RefHeight;
                    break;
            }
        }
    },
    watch: {
        tabIndex(newValue) {
            this.mescroll.resetUpScroll();
            if(this.showActivityStatusDom || [6, 7].includes(this.enterPageStatus)) return this.goToBuyHandle();
        }
    },
    // 页面周期函数--监听页面加载
    async onLoad(option) {
        this.requestGetLog(); // 获取领取记录
        this.delCurrentDiaList('cashBack');
    },
    async onShow() {
    },
    methods: {
        ...mapMutations({
            setAutoLogin: 'user/setAutoLogin',
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        ...mapActions({
            getUserInfo: "user/getUserInfo",
            initEnterPage: 'cash/initEnterPage',
            requestGetLog: 'cash/requestGetLog',
        }),
        downCallback() {
            this.tabsList = [];
            this.showTabsList = [];
            this.mescroll.resetUpScroll();
        },
        async upCallback(page) {
            const initRes = await this.initEnterPage();
            if(initRes) this.setTimeInit();
            if (!this.tabsList.length) {
                const res = await groupList();
                if(!res.code || !res.data.length) return this.mescroll.endSuccess(0);
                let _tab = res.data.map((item) => {
                    return {
                        ...item,
                        goods: [],
                        shopGroupIndex: -1, // >0;请求京东拼多多的列表
                        pageNum: 1,
                        firstTagRes: 0,
                        isFirst_tag: false

                    };
                });
                this.tabsList = _tab;
                this.showTabsList = res.data;
            }
            const currentItem = this.tabsList[this.tabIndex];
            let {
                id,
                index,
                firstTagRes,
                isFirst_tag,
                pageNum,
                goods,
                shopGroupIndex,
            } = currentItem;
            // 列表的京东与拼多多的请求
            // if(shopGroupIndex >= 0) return this.mescroll.endSuccess(0);
			if(shopGroupIndex >= 0) return this.requestShopGroup(page);
            const params = {
                id,
                index,
                page: pageNum,
                size: 10,
            };
            if(index == 1 && firstTagRes) params.first_tag = firstTagRes;
            goodsList(params).then(res=>{
				const { list, total_count, first_tag } = res.data;
                if(!firstTagRes && first_tag && index == 1) {
                    isFirst_tag = true;
                }
                firstTagRes = first_tag;
				pageNum += 1;
                if(page.num == 1 ) {
                    goods = [];
                    pageNum = 1;
                };
				let isNextPage = (pageNum * params.size) < total_count;
				if(!isNextPage) {
                    // 无下一页 - 请求列表的数据
                    if(!isFirst_tag) {
                        shopGroupIndex = 0;
                    } else {
                        isFirst_tag = false
                    }
                    this.mescroll.endSuccess(total_count, true);
                    pageNum = 1;
                    this.mescroll.triggerUpScroll();
                } else {
                    this.mescroll.endSuccess(list.length, isNextPage);
                }
                goods = goods.concat(list); // 追加新数据
                let currentItem = this.tabsList[this.tabIndex];
                this.tabsList[this.tabIndex] = {
                    ...currentItem,
                    goods,
                    pageNum,
                    firstTagRes,
                    isFirst_tag,
                    shopGroupIndex
                };
                if (list.length <= 6 && isNextPage) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(()=>this.mescroll.endErr());
        },
        requestShopGroup(page){
            const currentItem = this.tabsList[this.tabIndex];
            let {
                pageNum,
                goods,
                shopGroupIndex,
            } = currentItem;
			if(!this.shopGroup.length) return this.mescroll.endSuccess(0);
			let shopGroupItem = this.shopGroup[shopGroupIndex];
            const {
                id,
                cid,
                cid2,
                cid3,
                eliteId,
                groupId,
                type,
                lx_type,
                active_id,
                tag
            } = shopGroupItem;
            let params = {
                id,
                page: pageNum,
                size: 10,
                active_id,
                tag
            }
			let queryApi = goodsQuery;
            switch(type) {
                case 1:
                    if(lx_type == 2) {
                        queryApi = goodsRecommend;
                    } else {
                        queryApi = material;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                    }
                    break;
                case 2:
                    if(lx_type == 2) {
                        queryApi = goodsSearch;
                    } else {
                        queryApi = jingfen;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 20;
                    }
                    break;
                case 3:
                    queryApi = goodsQuery;
                    params.cid1 = cid;
                    params.cid2 = cid2;
                    params.cid3 = cid3;
                    break;
                case 4:
                    queryApi = jingfen;
                    if(!this.shopGroup[shopGroupIndex]._groupIdIndex) {
                    this.shopGroup[shopGroupIndex]._groupIdIndex = 0;
                    }
                    const _groupIdIndex = this.shopGroup[shopGroupIndex]._groupIdIndex;
                    params.eliteId = eliteId;
                    params.groupId = groupId[_groupIdIndex];
                    params.size = 20;
                    break;
			};
			queryApi(params).then(res=>{
                const { list, total_count } = res.data;
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = (pageNum * params.size) < total_count;
                pageNum += 1;
                if(!isNextPage && type == 4 && this.shopGroup[shopGroupIndex]._groupIdIndex < (groupId.length - 1)) {
                    // 无下一页
                    this.shopGroup[shopGroupIndex]._groupIdIndex += 1;
                    this.mescroll.endSuccess(total_count, true);
                    pageNum = 1;
                } else if(!isNextPage && (shopGroupIndex < (shopGroup.length - 1))) {
                    shopGroupIndex += 1;
                    pageNum = 1;
                    // this.mescroll.triggerUpScroll();
                    this.mescroll.endSuccess(total_count, true);
                    this.mescroll.triggerUpScroll();
                } else {
                    this.mescroll.endSuccess(list.length || total_count, isNextPage);
                }
                if(list.length == 0 && isNextPage){
                    this.mescroll.triggerUpScroll();
                }
                goods = goods.concat(list); // 追加新数据
                this.tabsList[this.tabIndex] = {
                    ...currentItem,
                    goods,
                    shopGroupIndex,
                    pageNum
                };
                if (list.length <= 6 && isNextPage) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(()=>this.mescroll.endErr());
		},
        setTimeInit() {
            if(this.initTimer){
                this.initTimer = null;
                clearTimeout(this.initTimer);
            }
            this.initTimer = setTimeout(async () => {
                const initRes = await this.initEnterPage();
                if(initRes) this.setTimeInit();
            }, 1000 * 30);
        },
        openFirstRefHandle(event) {
            console.log('openFirstRef:event', event);
            this.openFirstRefHeight = event.height;
        },
        cashFinishDom45RefHandle(event) {
            console.log('cashFinishDom45Ref:event', event);
            this.cashFinishDom45RefHeight = event.height;
        },
        cashFinishDom6RefHandle(event) {
            console.log('cashFinishDom6Ref:event', event);
            this.cashFinishDom6RefHeight = event.height;
        },
        cashFinishDom7RefHandle(event) {
            console.log('cashFinishDom6Ref:event', event);
            this.cashFinishDom7RefHeight = event.height;
        },
        // 轮播菜单
        swiperChange(event){
            this.tabIndex = event.detail.current;
        },
        async closeFirstRedOpenDia3Handle(isCloseClick) {
            console.log('status: 关闭了状态三的弹窗');
            await this.initEnterPage();
            if(isCloseClick) return; // 关闭弹窗的事件不做处理
            console.log('做去下单的拉取商品的动画scroll—————需滚动到指定的商品区域' );
            this.goToBuyHandle(2000);
        },
        async closeFirstFinishDia5Handle() {
            await this.initEnterPage();
            console.log('status: 关闭了状态5的弹窗');
        },
        onPageScroll(event) {
            const scrollTop = Math.ceil(event.scrollTop);
            this.isShowActive = scrollTop >= this.scrollFixValue;
            this.isShowNavBerColor = (scrollTop >= this.navHeight);
        },
        goToBuyHandle(setTime = 100) {
            setTimeout(() => {
                this.mescroll.scrollTo(this.scrollFixValue); // 滚动到tab的吸顶的效果
            }, setTime);
        }
    }
}
</script>

<style lang="scss">
.cash {
    position: relative;
    z-index: 0;
    box-sizing: border-box;
    background: #f7f7f7;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    .nav_bg {
        width: 100%;
        position: absolute;
        z-index: -1;
        margin-top: calc(0px - var(--margin));
    }
}
.nav-custom{
	flex: 1;
    .title_rule {
		flex: 0 0 136rpx;
		box-sizing: border-box;
        width: 136rpx;
        height: 64rpx;
        line-height: 64rpx;
        background: rgba(255,255,255,0.22);
        border-radius: 32rpx;
        font-size: 28rpx;
        text-align: center;
        color: #ffffff;
	}
    .custom_left {
        width: 128rpx;
        height: 34rpx;
        margin-left: 50rpx;
        position: relative;
        background: url("https://file.y1b.cn/store/1-0/24123/65af146cd8811.png") 0 0 / cover;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/24123/65af12e4a98e3.png") 0 0 / cover;
            position: absolute;
            top: -3rpx;
            left: -50rpx;
            width: 40rpx;
            height: 40rpx;
            margin-right: 10rpx;
        }
    }
}
.active_top{
    position: fixed;
    z-index: 1;
    width: 100%;
    background: #f7f7f7;
    opacity: 0;
    transition: all 2s;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png") 0 0 / cover;
        position: absolute;
        left: 0;
        top: calc(0px - var(--top));
        width: 750rpx;
        height: 402rpx;
        z-index: -1;
    }
    &.active {
        opacity: 1;
    }
}
.tabs_box{
    z-index: 9;
    position: sticky;
    // overflow: hidden;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
}
.tab_box {
    position: relative;
    z-index: 0;
    background-color: #fff;
    border-radius: 40rpx 40rpx 0 0;
}
.good_list-box {
    position: relative;
    z-index: 0;
    min-height: var(--minheight);
    &::before {
        content: '\3000';
        position: absolute;
        top: 0;
        left: 0;
        width: 750rpx;
        height: 1016rpx;
        background: linear-gradient(180deg,#ffffff 6%, rgba(247,247,247,0.00) 23%);
        z-index: -1;
    }
}
.cont_list{
    width: 100%;
    position: relative;
}
</style>
