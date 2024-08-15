import { groupRecommend } from "@/api/modules/index.js";
import { guessList } from "@/api/modules/jsShop.js";
import { goodsList } from "@/api/modules/packet.js";
import { getApiParams } from '@/api/modules/requestConfiguration/lxType.js';
const groupRecommendMixin = {
    data() {
        return {
            groupRecommendData: null,
            pageNum: 1,
            groupId_index: 0,
            lastOddItem: null,
            goods: [],
            currentGroupPage: '', // 当前页面的路径
            currentGroupPageObj: {},
            currentGroupPageNum: 0,
            currentGroupPageList: [{
                    routeText: '个人中心 - 我的',
                    route: 'pages/tabBar/user/index',
                    pageNum: 2, // 用于请求的参数传递
                    is_home: 2
                },
                {
                    routeText: '我的收藏',
                    route: 'pages/userInfo/myCollect/index',
                    pageNum: 3, // 用于请求的参数传递
                },
                {
                    routeText: '我的牛金豆',
                    route: 'pages/userModule/myCowpea/index',
                    pageNum: 4, // 用于请求的参数传递
                    is_home: 3
                },
                {
                    routeText: '我的订单',
                    route: 'pages/userModule/order/index',
                    pageNum: 5, // 用于请求的参数传递
                    is_home: 4
                },
                {
                    routeText: '省钱卡会员',
                    route: 'pages/tabBar/card/index',
                    pageNum: 14, // 用于请求的参数传递
                    is_home: 7
                },
                {
                    routeText: '专属卡券',
                    route: 'pages/userModule/myCoupon/index',
                    pageNum: 6, // 用于请求的参数传递
                },
                {
                    routeText: '搜索页',
                    route: 'pages/userModule/productList/search',
                    pageNum: 7, // 用于请求的参数传递
                },
                {
                    routeText: '搜索结果',
                    route: 'pages/userModule/productList/searchResult',
                    pageNum: 8, // 用于请求的参数传递
                },
                {
                    routeText: '支付成功',
                    route: 'pages/tabAbout/paySuccess/index',
                    pageNum: 9, // 用于请求的参数传递
                },
            ],
            isRequestGuessList: false,
            guessListParams: {
                index: 1,
                pageNum: 1,
                sizeNum: 10,
                empty_num: 0,
                is_first: 0,
                is_home: 1, // 0：领券中心;  1：首页进入；2：我的；3：牛金豆签到；4：我的订单；5：领现金活动；6：半屏推券 7：省钱卡专享
            },
            isRequestNum: 0,
            isInitHomeList: true,
        }
    },
    watch: {
        goods(newValue, oldValue) {
            if (oldValue.length == newValue.length) return;
            // 我的订单页面 - 不做更新
            if ((newValue.length <= 4) && this.currentGroupPageNum && (this.currentGroupPageNum != 5)) {
                this.mescroll.triggerUpScroll();
            }
        },
    },
    // 组件的使用
    mounted() {
        const pageList = getCurrentPages();
        const currentGroupPageObj = pageList[pageList.length - 1];
        this.currentPage = currentGroupPageObj.route;
        this.currentGroupPageObj = this.currentGroupPageList.find(res => res.route == this.currentPage);
        if (!this.currentGroupPageObj) return;
        this.currentGroupPageNum = this.currentGroupPageObj.pageNum;
    },
    onLoad() {
        const pageList = getCurrentPages();
        const currentGroupPageObj = pageList[pageList.length - 1];
        this.currentPage = currentGroupPageObj.route;
        this.currentGroupPageObj = this.currentGroupPageList.find(res => res.route == this.currentPage);
        if (!this.currentGroupPageObj) return;
        this.currentGroupPageNum = this.currentGroupPageObj.pageNum;
    },
    methods: {
        // 省钱卡专享商品
        async requestGoodsList(page) {
            let params = { page: page.num, size: 10 }
            const res = await goodsList(params).catch(() => this.mescroll.endErr());
            const { list, total_count } = res.data;
            // 设置列表数据
            if (page.num == 1) {
                this.goods = [];
                this.pageNum = 1;
            }
            this.goods = this.goods.concat(list); // 追加新数据
            const isNextPage = (page.num * params.size) < total_count;
            if (isNextPage) {
                this.mescroll.endSuccess(params.size, isNextPage);
                if (this.goods.length && !list.length) this.mescroll.triggerUpScroll();
                return;
            }
            this.mescroll.endSuccess(list.length || params.size);
            if (this.currentGroupPageObj.is_home) {
                this.isRequestGuessList = true;
                this.guessListParams = {
                    index: 1,
                    pageNum: 1,
                    sizeNum: 10,
                    empty_num: 0,
                    is_first: 0,
                    is_home: this.currentGroupPageObj.is_home,
                }
            }
            this.isInitHomeList = false;
            this.pageNum = 1;
            this.mescroll.triggerUpScroll();
        },
        async requestGoodList(page) {
            if (!this.currentGroupPageNum) return this.mescroll.endSuccess();
            if (page.num == 1) {
                this.pageNum = 1;
                this.lastOddItem = null;
                this.isRequestNum = 0;
                this.goods = [];
                this.groupRecommendData = null;
                if (this.currentGroupPageObj.is_home) {
                    this.isRequestGuessList = true;
                    this.guessListParams = {
                        index: 1,
                        pageNum: 1,
                        sizeNum: 10,
                        empty_num: 0,
                        is_first: 0,
                        is_home: this.currentGroupPageObj.is_home,
                    }
                }
            }
            if (this.isRequestGuessList) return this.guessListFun(page);
            this.requestRem(page);
        },
        async guessListFun(page) {
            const res = await guessList(this.guessListParams);
            if (res.code != 1 || (res.data && res.data.stop) || !res.data) {
                this.isRequestGuessList = false;
                this.isInitHomeList = false;
                this.mescroll.endSuccess(10, true);
                this.mescroll.triggerUpScroll();
                return;
            }
            if (page.num == 1) this.goods = [];
            const { index, list, pageNum, is_first, empty_num } = res.data;
            this.guessListParams = {
                ...this.guessListParams,
                index,
                pageNum,
                empty_num,
                is_first
            }
            this.goods = this.goods.concat(list); // 追加新数据
            this.mescroll.endSuccess(10, true);
        },
        async requestRem(page) {
            if (!this.groupRecommendData) {
                const recRes = await groupRecommend({ page: this.currentGroupPageNum });
                if (recRes.code != 1 || !recRes.data) return this.mescroll.endSuccess(0);
                this.groupRecommendData = recRes.data;
            }
            // 获取配置的京东/拼多多的请求类型及参数
            const { queryApi, params, groupId, type } = getApiParams(
                this.groupRecommendData, { pageNum: this.pageNum, groupId_index: this.groupId_index }
            );
            queryApi(params).then((res) => {
                const { list, total_count } = res.data;
                // 设置列表数据 - 第一页并且不配置个性化推荐的使用页面
                if (page.num == 1 && (!this.currentGroupPageObj.is_home)) this.goods = [];
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = this.pageNum * params.size < total_count;
                if (!isNextPage && (type == 4) && (this.groupId_index < (groupId.length - 1))) {
                    // 无下一页
                    this.groupId_index += 1;
                    this.mescroll.endSuccess(total_count, true);
                    this.pageNum = 0;
                } else {
                    this.mescroll.endSuccess(list.length || total_count, isNextPage);
                }
                if (this.lastOddItem) {
                    this.goods.push(this.lastOddItem);
                    this.lastOddItem = null;
                }
                this.pageNum += 1;
                this.goods = this.goods.concat(list); // 追加新数据
                const goodLength = this.goods.length;
                if (goodLength % 2 && goodLength > 6) {
                    this.lastOddItem = this.goods.pop();
                }
                if (list.length <= 0 && isNextPage && this.isRequestNum < 2) {
                    this.isRequestNum += 1;
                    this.mescroll.triggerUpScroll();
                    return;
                }
                this.isRequestNum = 0;
            }).catch(() => this.mescroll.endErr());
        }
    }
}
export default groupRecommendMixin;
