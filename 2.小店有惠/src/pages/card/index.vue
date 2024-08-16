<template>
<view class="demo_bottom">
<mescroll-body
    :sticky="true"
    ref="mescrollRef"
    @init="mescrollInit"
    @down="downCallback"
    @up="upCallback"
    :up="upOption"
    :down="downOption"
>
    <xhNavbar
        :fixedNum="true"
        :fixed="true"
        navbarColor="#fff"
        :title="showNavTitle"
        :titleAlign="isTeam ? 'titleRight' : 'titleCenter'"
        :overFlow="!isTeam"
    >
    <block v-if="isTeam">
        <view slot="title" class="nav_title fl_start" :style="{ '--opacity': (searchTop - 3) * (1/43) + '' }">
            <image class="img-avatar" mode="aspectFill" lazy-load
                :src="userInfo.avatar_url || default_url"></image>
            <text class="nick_name">{{ userInfo.nick_name || "" }}</text>
            <!-- 团长角标 -->
            <image class="icon-captain" src="/static/images/mine/icon_captain.png" mode="aspectFit" lazy-load
                v-if="isTeam"></image>
        </view>
        <view slot="title_cont" class="search_box fl_bet"
            :style="{ top: searchTop +'px', width: searchWidth + 'px', left: searchLeft + 'px'}"
        >
            <view class="nav_search fl_center" @click="toSearchHandle">
                <image class="search_icon" mode="aspectFit" src="@/static/images/home/search_icon.png"></image>
                <view class="search_txt">搜你想推广的商品 </view>
            </view>
            <view class="search_icon-btn" @click="toSearchHandle">搜索</view>
        </view>
    </block>
    </xhNavbar>
    <!-- 非团长信息 -->
    <view class="content_card" v-if="!isTeam">
        <view class="entry_btn-box heartBeat">
            <view class="entry_btn" @click="applyRequest">
                {{ !isApplyStatus ? '立即报名成为团长' : '审核中' }}
                <text class="entry_icon">钱多！事少！收益稳!</text>
            </view>
            <!-- 暂时关闭手机号的验收 -->
            <van-button type="danger"
                open-type="getPhoneNumber"
                @getphonenumber="applyHandle"
                :custom-style="btnStyle"
                class="btn_phone" block
                color="transparent"
                custom-style="height:134rpx;opacity:0"
                v-if="!isApplyStatus&&isAgreement&&!userInfo.mobile"
            ></van-button>
        </view>
        <view class="agree_text fl_center">
            <van-checkbox checked-color="#F04037" icon-size="12px" style="--checkbox-label-margin:5px;"
                :value="isAgreement" @change="changeHandle">
                报名即表示阅读并同意
            </van-checkbox>
            <text style="color:#FF4F3E" @click="$agreementLookHandle('/agreement/team-agreement.html')">
            《团长服务协议》</text>
        </view>
        <!-- 关于团长 -->
        <view class="about">
            <view class="about_title">
                <image class="about_title-bg" mode="aspectFill"
                    src="https://file.y1b.cn/store/1-0/24131/65ba37b77b9ad.png"
                ></image>
                <text>关于团长</text>
            </view>
            <view class="cont_title">{{textList[0].title}}</view>
            <view class="cont_txt"
                v-for="(item, index) in textList[0].content" :key="index"
            >{{item}}</view>
            <!-- 分割线 -->
            <view class="about_division">
                <view class="about_division-bg"></view>
            </view>
            <view class="cont_title">成为团长的{{reasonList.length}}大理由</view>
            <view class="about_reason">
                <view class="about_reason-item" v-for="item in reasonList" :key="item.id">
                    <image class="about_reason-icon" mode="aspectFill"
                        :src="item.icon"></image>
                    <text>{{item.text}}</text>
                </view>
            </view>
        </view>
        <!-- 作为团长 -->
        <view class="leader">
            <view class="cont_title">{{textList[1].title}}</view>
            <view class="cont_txtList">
                <view class="cont_txtList-item"
                    v-for="(item, index) in textList[1].content" :key="index"
                >{{item}}</view>
            </view>
            <view class="leader_title">
                <text class="headline_text">想赚的更多，你能做</text>
            </view>
            <view class="leader_cont">
                <view class="leader_cont-item">
                    <view class="leader_cont-title">拓宽用户渠道</view>
                    <view class="leader_cont-text">选择不同渠道的优质用户，定向邀请顾客</view>
                </view>
                <view class="leader_cont-item">
                    <view class="leader_cont-title">建立社群</view>
                    <view class="leader_cont-text">维护社群关系，保证群内活跃</view>
                </view>
            </view>
        </view>
        <view class="leader">
            <view class="cont_title">{{text2List.htitle}}</view>
            <view class="cont_txtList">
                <block v-for="(item, index) in text2List.contents" :key="index">
                    <view class="cont_txtList-item"> {{item.title}} </view>
                    <view class="cont_txtList-lab"> {{item.content}} </view>
                </block>
            </view>
        </view>
    </view>
    <!-- 团长 - 商品列表 -->
    <view class="content_team" :style="{ marginTop: paddingBottomHeight + 'px' }" v-else>
        <view class="income_box">
            <view class="income_cont" id="incomeDomBox" @click="goToCardEarnings">
                <view class="ib-head">
                    <view class="ib-title">累计收益(元)</view>
                    <view class="ib-content">
                        <view v-html="formatPrice(vipObject.total_profit || 0)"></view>
                        <view class="ib-tips" v-if="vipObject.read">你有{{vipObject.read}}笔收益到账</view>
                    </view>
                    </view>
                    <view class="ib-bottom">
                    <view>今日预估：¥{{ vipObject.day_profit || 0 }}</view>
                    <view class="withdrawn">已提现：¥{{vipObject.tx_amount || 0}}</view>
                </view>
            </view>
        </view>
        <!-- sticky吸顶悬浮的菜单, 父元素必须是 mescroll -->
        <view class="sticky-tabs" :style="{ top: stickyTop +'px'}" v-if="tabs.length > 1">
            <tabs v-model="tabIndex" :height="tabsHeight" :tabs="tabs" @change="tabChange"></tabs>
        </view>
        <view class="list_box" :style="{ minHeight: isShowMinHight && swiperHeight }">
            <view class="list_item fl_center"
                v-for="(item, index) in currentShowList" :key="index"
                @click="couponDetailHandle(item, index)"
            >
            <image :src="item.imgs[0] || item.picList[0] || item.image" mode="scaleToFill" class="item_left"></image>
            <view class="item_right fl_col_sp_bt">
                <view class="item_title-box">
                    <view class="item_title txt_ov_ell2">
                        <view class="item_title-value">
                            {{ item.lx_type == 2 ? '京东' : '拼多多' }}
                        </view>
                        {{ item.goods_name || item.title }}
                    </view>
                    <view class="item_lab-box">
                        <view class="face_value" v-if="item.face_value">{{item.face_value}}元券</view>
                        <view class="item_lab" v-if="(item.lx_type == 2) && item.inOrderCount30Days">
                            月售{{item.inOrderCount30Days}}
                        </view>
                        <view class="item_lab" v-if="(item.lx_type == 3) && item.sales_tip">
                            已售{{item.sales_tip}}
                        </view>
                    </view>
                </view>
                <view class="fl_bet">
                    <view :class="['item_price fl_center', item.face_value ? 'active' : '']">
                        <view v-html="formatItemPrice(item.price, 1)"></view>
                        <view class="item_price-lab" v-if="item.face_value">¥{{item.sale_price}}</view>
                    </view>
                    <view class="item_btn fl_center" @click.stop="spreadHandle(item, index)">
                        <view v-html="formatItemPrice(item.rebateMoney, 2)"></view>
                    </view>
                </view>
            </view>
            </view>
        </view>
    </view>
</mescroll-body>
<view class="fix_btn" v-if="userInfo.is_team" @click="isShowImg = true"></view>
<navbar
    :currentID="1"
    @domObjHeight="domObjHeightHandle"
    @current="currentHandle"
></navbar>
<!-- 报名成功 -->
<report-success-dia
    :isShow="isShowSuccess"
    title="已报名，正在审核中"
    label="1-3个工作日内审核完毕"
    @close="closeSuccessHandle"
></report-success-dia>
<!-- 审核成功 -->
<report-success-dia
    :isShow="isShowResult"
    title="审核成功"
    label="恭喜您成为团长"
    btnText="马上推广赚钱"
    @close="closeSuccessHandle"
></report-success-dia>
<!-- 弹窗管理 -->
<configurationDia
    ref="configurationDia"
    :isShow="isShowConfig"
    @close="closeShowConfig"
    :config="config"
    @popoverRember="requestPopoverRember"
    :remainTime="remainTime"
    :currentPageNum="currentPageNum"
></configurationDia>
<showImg-dia
    :isShow="isShowImg"
    @close="isShowImg = false"
></showImg-dia>
</view>
</template>
<script>
import { apply, applyInfo, inviteXq, isSend, msgTemplate, wordConfig } from "@/api/modules/card.js";
import { goodsGroup, goodsList } from "@/api/modules/home.js";
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import configurationFun from '@/components/configurationDia/configurationFun.js';
import configurationDia from '@/components/configurationDia/index.vue';
import reportSuccessDia from '@/components/reportSuccessDia.vue';
import showImgDia from '@/components/showImgDia.vue';
import tabs from "@/components/tabs/index.vue";
import { getNavbarData } from "@/components/xhNavbar/xhNavbar.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getBaseUrl } from "@/utils/auth.js";
import { lxTypeStatusCheckout } from "@/utils/goDetailCommonFun.js";
import { formatAmount } from '@/utils/index.js';
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
    mixins: [MescrollMixin, configurationFun], // 使用mixin
    components: {
        reportSuccessDia,
        showImgDia,
        configurationDia,
        tabs
    },
    data() {
        return {
            default_url: "https://file.y1b.cn/store/1-0/24131/65ba392989ede.png",
            loading: false,
            finished: false,
            upOption: {
                auto: false, // 不自动加载
                page: {
                    num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
                    size: 2
                }
            },
            currIndex: 0,
            stickyTop: 0,
            tabsHeight: 88,
            reasonList:[
                {
                    id: 0,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3cedf3991.png',
                    text: '收益高'
                },
                {
                    id: 1,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3d03ae567.png',
                    text: '长久生意'
                },
                {
                    id: 2,
                    icon: 'https://file.y1b.cn/store/1-0/24131/65ba3d22bfa62.png',
                    text: '拥有副业'
                }
            ],
            isApplyStatus: 0,
            isShowResult: false,
            isShowSuccess: false,
            textList: [],
            text2List: [],
            peopleNums: 0,
            showTitleBg: false,
            timer: null,
            isShowImg: false,
            showLeadDotStorageKey: `${getBaseUrl()}_showLeadDot_day`,
            tabs: [],
            tabIndex: 0,
            tabGoodList: [],
            goodPageNum: 1,
            isAgreement: false,
            optionsParams: null,
            scroll_top: 0,
            fixationValue: uni.upx2px(96),
            domBoxResHeight: 0,
            tabHeightValue: 0, // 底部导航栏的高度
            isShowMinHight: true,
        }
    },
    watch: {
        isApplyStatus(newValue, oldValue) {
            if(newValue == 1 && !this.userInfo.is_team) {
                this.setTimeApplyInfo();
            }
        },
        isAutoLogin(newValue, oldValue) {
            if(newValue) this.downCallback();
        }
    },
    computed: {
        ...mapGetters(["vipObject", 'userInfo', 'diaList', 'isAutoLogin']),
        showNavTitle() {
            return this.userInfo.is_team ? '' : '报名团长';
        },
        topBoxHeight() {
            return uni.upx2px(96) + this.domBoxResHeight;
        },
        swiperHeight() {
            let minHeight = (uni.getSystemInfoSync().windowHeight - uni.upx2px(64) - this.tabHeightValue - this.stickyTop) + 'px';
            if(!this.isShowMinHight)  minHeight = '0px';
            return minHeight;
        },
        // 单个列表对应的分组请求
        shopGroup() {
            let shopGroup = this.tabs[this.tabIndex]?.shopGroup;
            shopGroup && (shopGroup = shopGroup.map((item) => {
                return {
                    ...item,
                    pageNum: 1,
                    groupId_index: 0
                };
            }));
            return shopGroup;
        },
        paddingBottomHeight() {
            return this.userInfo.is_team ? uni.upx2px(96) : 0;
        },
        isTeam() {
            return this.userInfo.is_team;
        },
        currentShowList() {
            return this.tabs[this.tabIndex]?.goods;
        },
        searchTop() {
            let initSearchTop = uni.upx2px(92);
            let differentValue = uni.upx2px(92) - uni.upx2px(6);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchTopValue = uni.upx2px(92) - scrollValue;
            if(searchTopValue < 0) {
                initSearchTop = uni.upx2px(6);
            } else if(searchTopValue > uni.upx2px(92)) {
                initSearchTop = uni.upx2px(92);
            } else {
                initSearchTop = searchTopValue
            }
            return initSearchTop;
        },
        searchWidth() {
            const titleBoxWidth = uni.upx2px(502);
            let differentValue = uni.upx2px(702) - uni.upx2px(502);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchWidthValue = uni.upx2px(702) - scrollValue;
            let value = 0;
            if(searchWidthValue < titleBoxWidth) {
                value = titleBoxWidth
            } else if(searchWidthValue > uni.upx2px(702)) {
                value = uni.upx2px(702)
            } else {
                value = searchWidthValue
            }
            return value;
        },
        searchLeft() {
            const titleBoxLeft = uni.upx2px(24);
            let differentValue = uni.upx2px(24  ) - uni.upx2px(24);
            let scrollValue = (differentValue / this.fixationValue) * this.scroll_top;
            const searchLeftValue =  uni.upx2px(24) + scrollValue;
            let value = 0;
            if(searchLeftValue > titleBoxLeft) {
                value = titleBoxLeft;
            } else if(searchLeftValue < uni.upx2px(24)) {
                value = uni.upx2px(24);
            } else {
                value = searchLeftValue;
            }
            return value;
        }
    },
    async onLoad(options) {
        if(options.optionsParams) {
            this.optionsParams = JSON.parse(options.optionsParams);
        }
        setTimeout(async () => {
            const domBoxRes = await this.warpRectDom('incomeDomBox');
            if(domBoxRes) this.domBoxResHeight = domBoxRes.height + uni.upx2px(42);
        }, 2000);
        const res = await getNavbarData();
        let { navBarHeight, statusBarHeight } = res;
        this.stickyTop = navBarHeight + statusBarHeight;
    },
    async onShow() {
        const res = await inviteXq();
        if(res.code != 1) return;
        const { peopleNums } = res.data;
        this.peopleNums = peopleNums;

    },
    // 页面的滚动事件
    onPageScroll(event) {
        const scroll_top = Math.ceil(event.scrollTop);
        this.scroll_top = scroll_top;
        this.showTitleBg = (scroll_top > 0);

    },
    methods: {
        ...mapActions({
            getUserInfo: "user/getUserInfo",
            getVipObject: "user/getVipObject",
            updateMobile: "user/updateMobile",
        }),
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
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
        changeHandle(event) {
            this.isAgreement = event.detail.value;
        },
        // 切换菜单
        tabChange (index, item) {
            this.isShowMinHight = true;
            this.tabIndex = index;
            // 当前菜单的数据
            let curTab = this.tabs[index];
            curTab.pageNum = 1;
            curTab.groupId_index = 0;
            curTab.isRequestShopGroup = false;
            curTab.shopGroup_index = -1;
            // 没有初始化,则初始化
            this.mescroll.resetUpScroll();
            this.$nextTick(() => {
                this.mescroll.scrollTo(this.topBoxHeight, 0); // 恢复滚动条的位置
            });
		},
        downCallback(page) {
            this.tabIndex = 0;
            this.tabs = [];
            this.getUserInfo();
            // if(!this.isAutoLogin) return;
            if(!this.isAutoLogin) return; // 未登录禁止加载使用
            if(!this.isTeam) {
                this.applyInfoRequest();
                this.wordConfigInit();
                return this.mescroll.endSuccess(0);
            }
            this.getVipObject();
            this.mescroll.resetUpScroll();
        },
        async upCallback(page) {
            if (!this.tabs.length) {
                let res = await goodsGroup({ is_rebate: 1 });
                this.tabs = res.data.map((item) => {
                    return {
                        ...item,
                        goods: null,
                        pageNum: 1,
                        shopGroup_index: -1,
                        isRequestShopGroup: false
                    };
                });
            }
            if(!this.tabs.length) {
                this.isShowMinHight = false;
                return this.mescroll.endSuccess(0);
            };
            const currentTabItem = this.tabs[this.tabIndex];
            let { id, pageNum, goods, shopGroup_index, shopGroup, isRequestShopGroup } = currentTabItem;
            if(isRequestShopGroup) return this.requestShopGroup(page);
            if([2, 3].includes(Number(currentTabItem.lx_type))) return this.requestRem(page);
            const params = {
                page: pageNum,
                size: 10,
                id,
                is_rebate: 1,
                groupId_index: 0
            }
            const res = await goodsList(params).catch(() => this.mescroll.endErr());
            if(page.num == 1 || pageNum == 1) goods = [];
            if(res.code != 1 || !res.data) {
                this.mescroll.endSuccess(goods?.length || 0);
                if(shopGroup.length) {
                    this.tabs[this.tabIndex].shopGroup_index = 0;
                    this.tabs[this.tabIndex].isRequestShopGroup = true;
                    // this.requestShopGroup(page);
                    this.mescroll.triggerUpScroll();
                    return;
                }
                this.isShowMinHight = false;
                return;
            };
            const { list, total_count } = res.data;
            const isNextPage = (pageNum * params.size) < total_count;
            currentTabItem.goods = goods.concat(list);
            // pageNum += 1;
            currentTabItem.pageNum = pageNum + 1;
            this.tabs[this.tabIndex] =  currentTabItem;
            // 更改商品列表的下拉触底的加载
            this.mescroll.endSuccess(list.length, isNextPage);
            // 请
            if(!isNextPage && shopGroup.length) {
                this.tabs[this.tabIndex].shopGroup_index = 0;
                this.tabs[this.tabIndex].isRequestShopGroup = true;
                // this.requestShopGroup(page);
                this.mescroll.triggerUpScroll();
                return;
            }
            if(isNextPage && !list.length) {
                this.mescroll.triggerUpScroll();
            }
        },
        async requestShopGroup(page) {
            const currentTabItem = this.tabs[this.tabIndex];
            let { shopGroup_index, goods  } = currentTabItem;
            if(shopGroup_index > this.shopGroup.length - 1) return this.mescroll.endSuccess(0);
            const currentShopGroup = this.shopGroup[shopGroup_index];
            let {
                groupId,
                type,
                pageNum,
                groupId_index
            } = currentShopGroup;
            const { params, queryApi } = this.getRequestCont(currentShopGroup);
            const res = await queryApi({ ...params, level: 1 }).catch(() => this.mescroll.endErr());
            if(res.code != 1 || !res.data) {
                this.mescroll.endSuccess(goods?.length || 0);
                shopGroup_index += 1;
                currentTabItem.shopGroup_index = shopGroup_index;
                this.mescroll.triggerUpScroll();
                this.isShowMinHight = false;
                return;
            };
            const { list, total_count } = res.data;
            if(page.num == 1) goods = [];
            // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            let isNextPage = (pageNum * params.size) < total_count;
            pageNum += 1;
            currentTabItem.goods = goods.concat(list); // 追加新数据
            if(!isNextPage && type == 4 && groupId_index < (groupId.length - 1)) {
                // 无下一页
                groupId_index += 1;
                this.mescroll.endSuccess(total_count, true);
                pageNum = 1;
            } else {
                this.mescroll.endSuccess(list.length || total_count, isNextPage);
            }
            // this.shopGroup.pageNum = pageNum;
            this.shopGroup[shopGroup_index].pageNum = pageNum;
            this.shopGroup.groupId_index = groupId_index;
            this.tabs[this.tabIndex] = currentTabItem;
            if(list.length && isNextPage) return;
            // 没有下一页 - 加载列表的另一项
            if(!isNextPage) {
                shopGroup_index += 1;
                currentTabItem.shopGroup_index = shopGroup_index;
            }
            this.mescroll.triggerUpScroll();

        },
        getRequestCont(currentTabItem) {
            let {
                id,
                cid,
                cid2,
                cid3,
                eliteId,
                groupId,
                type,
                positionId,
                lx_type,
                pageNum,
                groupId_index
            } = currentTabItem;
            let params = {
                id,
                positionId,
                page: pageNum,
                size: 10,
                is_rebate: 1
            }
			let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch(type) {
                case 1:
                    // 拼多多接口的访问
                    if (lx_type == 3) {
                        queryApi = goodsRecommend;
                        params.positionId = positionId;
                    } else {
                        queryApi = material;
                        params.eliteId = eliteId;
                        params.groupId = groupId;
                        params.size = 10;
                    }
                    break;
                case 2:
                    if (lx_type == 3) {
                        queryApi = goodsSearch;
                        params.positionId = positionId;
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
                    params.eliteId = eliteId;
                    params.groupId = groupId[groupId_index];
                    params.size = 20;
                    break;
            };
            return {
                queryApi,
                params
            }
        },
        async requestRem(page) {
            const currentTabItem = this.tabs[this.tabIndex];
            let {
                groupId,
                type,
                pageNum,
                goods,
                groupId_index,
                shopGroup_index,
                shopGroup
            } = currentTabItem;
            // 返回请求的参数
            const { params, queryApi } = this.getRequestCont(currentTabItem);
            const res = await queryApi(params).catch(() => this.mescroll.endErr());
            // this.isShowMinHight = false;
            // this.mescroll.endSuccess(goods?.length || 0);
            // return;
            if(res.code != 1 || !res.data) {
                this.mescroll.endSuccess(goods?.length || 0);
                if(shopGroup.length) {
                    this.tabs[this.tabIndex].shopGroup_index = 0;
                    this.tabs[this.tabIndex].isRequestShopGroup = true;
                    // this.requestShopGroup(page);
                    this.mescroll.triggerUpScroll();
                    return;
                }
                this.isShowMinHight = false;
                return;
            };
            const { list, total_count } = res.data;
            if(page.num == 1 || pageNum == 1) goods = [];
            // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            let isNextPage = (pageNum * params.size) < total_count;
            pageNum += 1;
            currentTabItem.goods = goods.concat(list); // 追加新数据
            if(!isNextPage && type == 4 && groupId_index < (groupId.length - 1)) {
                // 无下一页
                groupId_index += 1;
                this.mescroll.endSuccess(total_count, true);
                pageNum = 1;
            } else if(!isNextPage && shopGroup.length) {
                this.tabs[this.tabIndex].shopGroup_index = 0;
                this.tabs[this.tabIndex].isRequestShopGroup = true;
                // this.requestShopGroup(page);
                this.mescroll.endSuccess(total_count, true);
                this.mescroll.triggerUpScroll();
            } else {
                this.mescroll.endSuccess(list.length || total_count, isNextPage);
            }
            currentTabItem.pageNum = pageNum;
            currentTabItem.groupId_index = groupId_index;
            this.tabs[this.tabIndex] = currentTabItem;
            if(list.length && isNextPage) return;
            if(!isNextPage) {
                this.mescroll.triggerUpScroll();
            }
		},
        async couponDetailHandle(item, index) {
            const res = await lxTypeStatusCheckout(item);
            if (res.code != 1) return this.tabGoodList.splice(index, 1);
            const { lx_type, goods_sign, skuId, positionId, rebate } = item;
            this.$go(`/pages/cardModule/spreadDetail/index?lx_type=${lx_type}&goods_sign=${goods_sign || 0}&skuId=${skuId ||0}&queryId=${goods_sign || skuId}&positionId=${positionId}&rebate=${rebate}`)
        },
        async spreadHandle(item) {
            const res = await lxTypeStatusCheckout(item);
            if (res.code != 1) return this.tabGoodList.splice(index, 1);
            const { goods_sign, rebate, skuId, inOrderCount30Days, sales_tip, lx_type } = item;
            const saleNum = (lx_type == 2) ? inOrderCount30Days : sales_tip;
            let pathUrl =`/pages/cardModule/spreadDetail/saveType?goods_sign=${goods_sign || 0}&skuId=${skuId || 0}&rebate=${rebate}`;
            saleNum && (pathUrl += `&saleNum=${saleNum}`);
            this.$go(pathUrl);
        },
        // 进入商品的搜索
        toSearchHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            // 去领券中心的搜索页
            this.$go(`/pages/homeModule/productList/search?is_rebate=1`);
        },
        formatPrice(price) {
            price = Number(price).toFixed(2);
            let splitPrice = price.split(".");
            let amount = formatAmount(splitPrice[0]);
            return `<span style="font-weight:500;font-size: 28px">${amount}.<span style="font-size: 18px;">${splitPrice[1]}</span></span>`;
        },
        formatItemPrice(price = 0, type) {
            let dom= '';
            switch(type) {
                case 1:
                    dom = `<span style="font-weight:600;font-size: 13px;">¥<span style="font-size: 18px;">${price}</span></span>`;
                    break;
                default:
                    dom = `<span style="font-weight:600;font-size: 10px;">¥<span style="font-size: 20px;">${price}</span></span>`;
                    break;
            }
            return dom;
        },
        currentHandle() {
            this.mescroll.scrollTo(0, 0);
        },
        setIndexHandle(index) {
            this.currIndex = index;
        },
        // 非团长时的配置文案
        async wordConfigInit() {
            const res = await wordConfig();
            if(res.code != 1) return;
            const { text, text2 } = res.data;
            this.textList = text;
            this.text2List = text2;
        },
        async applyInfoRequest(showToast = false) {
            const res = await applyInfo();
            if(res.code!= 1) return;
            this.isApplyStatus = res.data;
            if(this.isApplyStatus == 2) {
                this.isShowSuccess = false;
                this.isShowResult = true;
                return;
            }
            if(this.isApplyStatus && showToast) {
                this.$toast('报名审核中');
            }
        },
        setTimeApplyInfo() {
            this.timer = setTimeout(async () => {
                const res = await applyInfo();
                if(res.code!= 1) return;
                if(res.data == 2) {
                    this.isShowSuccess = false;
                    this.isShowResult = true;
                    return;
                }
                this.setTimeApplyInfo();
            }, 1000);
        },
        domObjHeightHandle(height) {
            this.tabHeightValue = height;
        },
        async goToCardEarnings() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            const msgRes = await msgTemplate();
            if(msgRes.code == 1 && msgRes.data) {
                const { settle, events, withdraw} = msgRes.data;
                let tmplIds = [];
                (!this.vipObject.is_send && settle) && tmplIds.push(settle);
                (!this.vipObject.is_events && events) && tmplIds.push(events);
                (!this.vipObject.is_withdraw && withdraw) && tmplIds.push(withdraw);
                tmplIds = tmplIds.filter(item => !!item);
                const subRes = await this.$subscribeMessageHandle(tmplIds);
                const settleResult = subRes[settle];
                const eventsResult = subRes[events];
                const withdrawResult = subRes[withdraw];
                const params = {
                    is_send: 0,
                    is_events: 0,
                    is_withdraw: 0
                }
                if(settleResult == 'accept') params.is_send = 1;
                if(eventsResult == 'accept') params.is_events = 1;
                if(withdrawResult == 'accept') params.is_withdraw = 1;
                isSend(params);
            }
            this.$go("/pages/cardModule/cardEarnings/index");
        },
        inviteHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$go('/pages/cardModule/invite/index');
        },
        inviteListHandle() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            this.$go('/pages/cardModule/invite/inviteList');
        },
        async applyHandle(event) {
            this.$wxReportEvent('amaster'); // 报名团长 - 进行埋点的添加
			if(event.detail.errMsg !== 'getPhoneNumber:ok') return this.$toast('报名团长需要你授权手机号');
            const phoneCode = event.detail.code;
            if(phoneCode) {
                this.applyRequest();
                this.updateMobile({
                    code: phoneCode,
                    hideModel: true
                });
                return;
            }
            this.applyRequest();
            // this.$toast('报名团长需要你授权手机号');
        },
        async applyRequest() {
            if(!this.isAutoLogin) return this.$go('/pages/login/index');
            if(!this.isAgreement) return this.$toast('请勾选团长服务协议');
            // 已提交审核 - 审核中
            if(this.isApplyStatus) return this.applyInfoRequest(true);
            const res = await apply();
            if(res.code!= 1) return this.$toast(res.msg, 4000);
            this.isShowSuccess = true;
            this.isApplyStatus = 1;
        },
        async closeDia() {
            this.getVipObject();
            this.isShowSuccess = false;
            this.isShowResult = false;
            await this.getUserInfo();
            this.downCallback();
            if(this.isTeam && this.optionsParams) {
                const { lx_type, queryId, positionId, rebate, is_popover  } = this.optionsParams;
                this.$go(`/pages/cardModule/spreadDetail/index?lx_type=${lx_type}&queryId=${queryId}&positionId=${positionId}&rebate=${rebate}&is_popover=${is_popover}`);
            }
        },
        async closeSuccessHandle(){
            const msgRes = await msgTemplate();
            if(msgRes.code != 1) return this.$toast(msgRes.msg);
            const { team_apply, settle, events } = msgRes.data;
            // 收益、审核、活动
            const tmplIds = [team_apply, settle, events].filter(item => !!item);
            const res = await this.$subscribeMessageHandle(tmplIds); // 消息订阅的通知
            this.closeDia();
        }
    },
    onHide() {
        this.timer = null;
        clearTimeout(this.timer);
    }
}
</script>
<style lang="scss">
$bgColor: #FDF7DA;
.content_card {
    background: $bgColor;
    position: relative;
    z-index: 0;
    overflow: hidden;
    box-shadow: 0rpx 38rpx 16rpx 0rpx $bgColor;
    &::before {
        content: '\3000';
        background: url("https://file.y1b.cn/store/1-0/24528/665536041cfe7.png") 0 0 / 100% 100%;
        width: 100%;
        height: 660rpx;
        z-index: 0;
        display: block;
    }
    .card_banner {
        width: 750rpx;
        height: 660rpx;
    }
    .entry_btn-box{
        position: relative;
        width: 644rpx;
        height: 134rpx;
        line-height: 134rpx;
        z-index: 0;
        margin: auto;
        font-size: 36rpx;
        font-weight: 600;
        text-align: center;
        color: #bb0000;
        margin-top: -20rpx;
        &::before {
            content: '\3000';
            background: url("https://file.y1b.cn/store/1-0/231116/6555d9415011b.png") 0 0 / 100% 100%;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        .btn_phone{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .entry_icon {
            position: absolute;
            right: 18rpx;
            width: 220rpx;
            height: 28rpx;
            background: #fb3c0d;
            border-radius: 25rpx 20rpx 20rpx 0rpx;
            font-size: 20rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 28rpx;
        }
    }
    .agree_text {
        font-size: 24rpx;
        font-weight: 400;
        text-align: center;
        color: rgba(102,102,102,0.85);
        line-height: 34rpx;
        margin-top: -4rpx;
    }
    .cont_title {
        height: 56rpx;
        font-size: 40rpx;
        font-weight: 600;
        text-align: center;
        color: #bb0000;
        line-height: 56rpx;
        margin-top: 16rpx;
    }
    .cont_txt {
        margin: 24rpx 38rpx 34rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 40rpx;
    }
    .about {
        margin: 48rpx 24rpx 0;
        position: relative;
        background: #fff;
        border-radius: 16rpx;
        .about_title {
            position: relative;
            width: 302rpx;
            height: 55rpx;
            top: -14rpx;
            z-index: 0;
            margin: 0 auto;
            font-size: 28rpx;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: 55rpx;
            .about_title-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            }

        }
        .about_division {
            position: relative;
            height: 40rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20rpx 0;
            &::before,
            &::after {
                content: '\3000';
                position: absolute;
                width: 40rpx;
                height: 40rpx;
                background: $bgColor;
                top: 0;
                border-radius: 50%;
            }
            &::before {
                left: -20rpx;
            }
            &::after {
                right: -20rpx;
            }
            .about_division-bg{
                width: 634rpx;
                border-bottom: 2rpx dashed rgba(255,21,10,0.50);
            }
        }
        .about_reason {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding:24rpx 20rpx 40rpx;
            .about_reason-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 28rpx;
                font-weight: 400;
                color: #980000;
                line-height: 40rpx;
                .about_reason-icon {
                    width: 88rpx;
                    height: 88rpx;
                    margin-bottom: 12rpx;
                }
            }
        }
    }
    .leader {
        background: #ffffff;
        border-radius: 16rpx;
        margin: 32rpx 24rpx 0;
        overflow: hidden;
        .cont_title {
            margin-top: 40rpx;
        }
        .cont_txtList {
            margin: 24rpx 32rpx 0rpx;
            .cont_txtList-item {
                font-size: 28rpx;
                color: #333;
                line-height: 40rpx;
                margin-bottom: 8rpx;
            }
            .cont_txtList-lab {
                font-size: 28rpx;
                color: #999;
                margin-bottom: 28rpx;
            }
        }
        .leader_cont {
            margin: 0 32rpx;
            counter-reset: leaderNum;
            .leader_cont-item {
                font-weight: 500;
                color: #bb0000;
                padding-left: 51rpx;
                position: relative;
                &::before {
                    content: counter(leaderNum);
                    counter-increment: leaderNum;
                    position: absolute;
                    top: 8rpx;
                    left: 0rpx;
                    width: 34rpx;
                    height: 34rpx;
                    line-height: 34rpx;
                    background: #ffd2d5;
                    border-radius: 4rpx;
                    font-size: 26rpx;
                    text-align: center;
                }
                &:not(:last-child)::after {
                    content: '\3000';
                    position: absolute;
                    top: 50%;
                    left: 16rpx;
                    width: 2rpx;
                    height: 80%;
                    background: linear-gradient(to bottom,transparent 0%,transparent 50%,#FFD2D5 50%,#FFD2D5 100%);
                    background-size: 2rpx 4rpx;
                    background-repeat: repeat-y;
                }
                .leader_cont-title {
                    font-size: 36rpx;
                    line-height: 50rpx;
                    font-weight: bold;
                }

                .leader_cont-text {
                    font-size: 28rpx;
                    font-weight: 400;
                    color: #333333;
                    line-height: 40rpx;
                    margin: 10rpx 0 40rpx;
                }
            }
        }
    }
}
.nav_custom {
    flex: 1;
    font-size: 36rpx;
    line-height: 50rpx;
    color: #333;
    display: inline-block;
    text-align: center;
}
.content_team {
    // overflow: hidden;
    // padding-bottom: calc(125rpx + constant(safe-area-inset-bottom));
    // padding-bottom: calc(125rpx + env(safe-area-inset-bottom));
}
.leader {
    border-radius: 24rpx;
    margin: 24rpx 24rpx 0;
    overflow: hidden;
    color: #666;
    position: relative;
    z-index: 0;
    &:last-child {
        margin-bottom: 28rpx;
    }
    .leader_title {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 32rpx 0;
        font-size: 40rpx;
        text-align: center;
        color: #bb0000;
        font-weight: bold;
    }
    .headline_text {
        margin: 40rpx 0 32rpx;
        position: relative;
        display: inline-block;
        margin: auto;
        &::before,
        &::after {
            content: '\3000';
            position: absolute;
            top: 50%;
            margin-top: -4rpx;
            width: 82rpx;
            height: 8rpx;
        }
        &::before{
            background: linear-gradient(to left, #b31717,#fff);
            left: 0;
            margin-left: -98rpx;
        }
        &::after{
            background: linear-gradient(to right, #b31717,#fff);
            right: 0;
            margin-right: -98rpx;
        }
    }
    .leader_cont {
        margin: 0 32rpx;
        counter-reset: leaderNum;
        .leader_cont-item {
            font-weight: 500;
            padding-left: 51rpx;
            position: relative;
            &::before {
                content: counter(leaderNum);
                counter-increment: leaderNum;
                position: absolute;
                top: 8rpx;
                left: 0rpx;
                width: 34rpx;
                height: 34rpx;
                line-height: 34rpx;
                background: rgba(255,255,255,0.30);
                border-radius: 4rpx;
                font-size: 26rpx;
                text-align: center;
            }
            &:not(:last-child)::after {
                content: '\3000';
                position: absolute;
                top: 50%;
                left: 16rpx;
                width: 2rpx;
                height: 80%;
                background: linear-gradient(to bottom,transparent 0%,transparent 50%, #fff 50%,#fff 100%);
                background-size: 2rpx 4rpx;
                background-repeat: repeat-y;
            }
            .leader_cont-title {
                font-size: 36rpx;
                line-height: 50rpx;
            }

            .leader_cont-text {
                font-size: 28rpx;
                font-weight: 400;
                line-height: 40rpx;
                margin: 10rpx 0 40rpx;
                opacity: 0.6;
            }
        }
    }
}
.code_box{
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
}

.nav_title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: 600;
    font-size: 38rpx;
    color: #272e40;
    opacity: var(--opacity);
    .img-avatar {
        width: 56rpx;
        height: 56rpx;
        flex: 0 0 56rpx;
        background: #e9e9e9;
        border-radius: 50%;
        margin-left: 12rpx;
    }
    .nick_name {
        margin: 0 16rpx;
    }
    .icon-captain {
        width: 82rpx;
        height: 38rpx;
    }
}

.search_icon{
    width: 28rpx;
    height: 28rpx;
    margin-right: 16rpx;
}
.search_txt {
    font-size: 26rpx;
    color: #999;
    line-height: 64rpx;
    word-break: break-all;
    width: calc(100% - 64rpx);
    text-align: left;
}
.search_box {
    position: absolute;
    left: 16rpx;
    right: 16rpx;
    // bottom: -84rpx;
    .nav_search{
        flex: 1;
        height: 64rpx;
        background: #f1f1f1;
        border-radius: 12rpx;
        padding: 0 20rpx;
        box-sizing: border-box;
        margin-right: 28rpx;
    }
    .search_icon-btn {
        font-size: 32rpx;
        color: #333;
    }
}
.income_box {
    border-bottom: 10rpx solid #f5f6fa;
}
.income_cont {
    position: relative;
    height: 224rpx;
    box-sizing: border-box;
    z-index: 0;
    padding: 28rpx 40rpx 10rpx 40rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0 16rpx 32rpx;
    background: linear-gradient(45deg,#f04037, #f06437);
    border-radius: 16rpx;
    color: #fff;
    &::before {
      content: '\3000';
      background: url("https://file.y1b.cn/store/1-0/2479/668cb030d41b1.png") 0 0 / 100% 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }
    .income-box-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .check-detail {
      width: 136rpx;
      height: 52rpx;
      line-height: 52rpx;
      text-align: center;
      box-sizing: border-box;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.78),
        rgba(255, 255, 255, 0.9)
      );
      border-radius: 12rpx 0px 0px 12rpx;
      position: absolute;
      right: 0;
      top: 48rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #f1534b;
    }

    .ib-head {
      z-index: 1;
      .ib-title {
        font-size: 28rpx;
        position: relative;
        display: inline-block;
        opacity: 0.6;
      }

      .ib-content {
        position: relative;
        display: flex;
        margin-top: 8rpx;

        .ib-num {
          font-size: 56rpx;
          font-weight: 500;
        }

        .ib-tips {
          height: 36rpx;
          font-size: 20rpx;
          font-weight: 500;
          background: rgba(255, 198, 84, 0.85);
          border-radius: 18rpx 24rpx 24rpx 0px;
          padding: 0rpx 12rpx;
          display: flex;
          align-items: center;
          margin-left: 4rpx;
        }
      }
    }

    .ib-bottom {
      z-index: 1;
      display: flex;
      opacity: 0.85;
      font-size: 30rpx;

      .withdrawn {
        margin-left: 24rpx;
        padding-left: 24rpx;
        position: relative;
        // border-left: 2rpx solid #ffffff;
      }

      .withdrawn::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(50%, -50%);
        width: 2rpx;
        height: 20rpx;
        background: #ffffff;
      }
    }
}
.list_box {
    border-top: 10rpx solid #f5f6fa;
    padding-bottom: 46rpx;
    overflow: hidden;
    .list_item {
        width: 100%;
        border-radius: 40rpx;
        padding: 0 16rpx 36rpx;
        box-sizing: border-box;
        margin-top: 32rpx;
        .item_left {
            width: 240rpx;
            height: 240rpx;
            border-radius: 24rpx;
            margin-right: 24rpx;
            flex: 0 0 240rpx;
        }
    .item_right{
      flex: 1;
      align-self: stretch;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 1rpx;
        // box-shadow: 0rpx rpx 1rpx 0rpx #C9C9C9;
        background: rgba(#B9B9B9, .5);
        bottom: -36rpx;
        left: 0;
      }
      .item_title-box {
        width: 100%;
      }
      .fl_bet{
         white-space: nowrap;
      }
      .item_title{
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        line-height: 48rpx;
        height: 96rpx;
        .item_title-value {
            padding: 2rpx 10rpx;
            font-size: 24rpx;
            font-weight: 600;
            color: #fff;
            line-height: 36rpx;
            position: relative;
            z-index: 0;
            margin-right: 8rpx;
            display: inline;
            &::before {
                content: "\3000";
                background: url("https://file.y1b.cn/store/1-0/2465/665fffdf7025d.png") 0 0 / 100% 100% no-repeat;
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
            }

        }
      }
      .item_lab-box {
        margin-top: 12rpx;
        display: flex;
        .face_value {
            line-height: 36rpx;
            background: rgba(245,84,54,0.12);
            border-radius: 4rpx;
            padding: 0 10rpx;
            margin-right: 12rpx;
            font-size: 26rpx;
            font-weight: bold;
            text-align: left;
            color: #f55436;
        }
      }
      .item_lab{
        font-size: 26rpx;
        color: #aaa;
        line-height: 36rpx;
      }
      .item_price{
        font-size: 26rpx;
        text-align: center;
        color: #e7331b;
        line-height: 50rpx;
        font-weight: bold;
        position: relative;
        z-index: 0;
        align-self: stretch;
        &.active::before {
            content: '券后';
            font-size: 26rpx;
            margin-right: 8rpx;
            font-weight: normal;
        }
        .item_price-lab {
            margin-left: 8rpx;
            opacity: 0.45;
            font-size: 26rpx;
            text-decoration:  line-through;
        }
        &::after {
            content: '\3000';
            width: 412rpx;
            height: 100%;
            background: linear-gradient(90deg,rgba(255,242,242,0.00), #fde1e0 90%);
            position: absolute;
            top: 0;
            left: 0;
            z-index: -1;
        }
      }
      .item_btn {
        padding: 0 12rpx;
        height: 64rpx;
        background: #EF2B20;
        border-radius: 12rpx;
        color: #fff;
        position: relative;
        line-height: 64rpx;
        &::before {
            content: '赚';
            font-size: 26rpx;
            margin-right: 10rpx;
        }
      }
    }
  }
}
.fix_btn {
    position: fixed;
    width: 72rpx;
    height: 192rpx;
    bottom: 344rpx;
    left: 0;
    background: url("https://file.y1b.cn/store/1-0/2465/66600817cbed7.png") 0 0 / cover;
}
.sticky-tabs{
    z-index: 99;
    position: sticky;
    top: var(--window-top);
    background-color: #fff;
    // border-top: 10rpx solid #f5f6fa;
}
</style>
