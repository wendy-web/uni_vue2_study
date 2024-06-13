import { groupRecommend } from "@/api/modules/index.js";
import { goodsQuery, guessList, jingfen, material } from "@/api/modules/jsShop.js";
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
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
                }
            ],
            isRequestGuessList: false,
            guessListParams: {
                index: 1,
                pageNum: 1,
                sizeNum: 10,
                empty_num: 0,
                is_first: 0,
                is_home: 1, // 0：领券中心; 1: 首页； 2：我的；
            },

        }
    },
    watch: {
        goods(newValue) {
            // 我的订单页面 - 不做更新
            if (newValue.length <= 4 && this.currentGroupPageNum && (this.currentGroupPageNum != 5)) {
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
        async requestGoodList(page) {
            if (!this.currentGroupPageNum) return this.mescroll.endSuccess();
            if (page.num == 1) {
                this.pageNum = 1;
                this.lastOddItem = null;
                if (this.currentGroupPageObj.is_home) {
                    this.isRequestGuessList = true;
                    this.guessListParams = {
                        index: 1,
                        pageNum: 1,
                        sizeNum: 10,
                        empty_num: 0,
                        is_first: 0,
                        is_home: this.currentGroupPageObj.is_home, // 0：领券中心; 1: 首页； 2：我的；
                    }
                }
            }
            if (this.isRequestGuessList) return this.guessListFun(page);
            this.requestRem(page);

        },
        async guessListFun(page) {
            const res = await guessList(this.guessListParams);
            if (res.code != 1 || (res.data && res.data.stop)) {
                this.isRequestGuessList = false;
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
                if (recRes.code != 1 || !recRes.data)
                    return this.mescroll.endSuccess(0);
                this.groupRecommendData = recRes.data;
            }
            const { id, cid, cid2, cid3, eliteId, groupId, type, lx_type, positionId } = this.groupRecommendData;
            let pageNum = this.pageNum;
            let params = {
                id,
                page: pageNum,
                size: 10,
            };
            let queryApi = goodsQuery;
            // type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
            switch (type) {
                case 1:
                    // 拼多多接口的访问
                    if (lx_type == 2) {
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
                    if (lx_type == 2) {
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
                    const groupId_index = this.groupId_index;
                    params.eliteId = eliteId;
                    params.groupId = groupId[groupId_index];
                    params.size = 20;
                    break;
            }
            queryApi(params).then((res) => {
                const { list, total_count } = res.data;
                // 设置列表数据 - 第一页并且不配置个性化推荐的使用页面
                if (page.num == 1 && (!this.currentGroupPageObj.is_home)) this.goods = [];
                // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                let isNextPage = pageNum * params.size < total_count;
                if (!isNextPage &&
                    type == 4 &&
                    this.groupId_index < groupId.length - 1
                ) {
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
                if (list.length <= 0 && pageNum * params.size < total_count) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(() => this.mescroll.endErr());
        }
    }
}
export default groupRecommendMixin;
