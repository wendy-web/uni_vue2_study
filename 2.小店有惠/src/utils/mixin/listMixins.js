import { goodsGroup, goodsList } from "@/api/modules/home.js";
import getQueryApi from "@/utils/queryListApi.js";
const listMixin = {
    data() {
        return {
            tabs: [],
			tabIndex: 0,
			tabGoodList: [],
            isRequestNum: 0,
        }
    },
    watch: {
    },
    mounted() {
    },
    onLoad() {
    },
    methods: {
        // 下拉刷新
        downCallback() {
            this.tabIndex = 0;
            this.goodPageNum = 1;
            this.tabs = [];
            this.isRequestNum = 0;
            this.mescroll.resetUpScroll();
        },
        async upCallback(page) {
            if (!this.tabs.length) {
                let res = await goodsGroup({ is_rebate: this.is_rebate });
                if(res.code != 1) return this.mescroll.endSuccess();
                this.tabGoodList = [];
                this.tabs = res.data.map((item) => {
                    return {
                        ...item,
                        goods: []
                    };
                });
            }
            if(!this.tabs.length) return this.mescroll.endSuccess(0);
            const itemTab = this.tabs[this.tabIndex];
            if([2, 3].includes(Number(itemTab.lx_type))) return this.requestRem(page);
            const params = {
                page: this.goodPageNum,
                size: 10,
                id: this.tabs[this.tabIndex].id,
                is_rebate: this.is_rebate
            }
            goodsList(params).then((res) => {
                const {list, total_count} = res.data;
                if(page.num == 1) this.tabGoodList = []; // 如果是第一页需手动制空列表
                this.tabGoodList = this.tabGoodList.concat(list);
                // 更改商品列表的下拉触底的加载
                this.mescroll.endBySize(list.length, total_count);
                const isNextPage = (this.goodPageNum * params.size) < total_count;
                this.goodPageNum += 1;
                // 没有下一页
                if(!isNextPage && (this.tabIndex < this.tabs.length - 1)) {
                    this.tabIndex += 1;
                    this.goodPageNum = 1;
                    this.mescroll.triggerUpScroll();
                }
                if(isNextPage && !list.length) {
                    this.mescroll.triggerUpScroll();
                }
            }).catch(() =>  this.mescroll.endErr());
        },
        async requestRem(page) {
            const curTab = this.tabs[this.tabIndex];
            const { groupId, type } = curTab;
            let { params, queryApi } = getQueryApi(curTab);
            params.is_rebate = this.is_rebate;
            const res = await queryApi(params).catch(() => this.mescroll.endErr());
            const { list, total_count } = res.data;
            if( page.num == 1 ) this.tabGoodList = [];
            // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
            let isNextPage = (this.goodPageNum * params.size) < total_count;
            this.goodPageNum += 1;
            this.tabGoodList = this.tabGoodList.concat(list); // 追加新数据

            if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
                // 无下一页
                this.groupId_index += 1;
                this.mescroll.endSuccess(total_count, true);
                this.goodPageNum = 1;
            } else {
                this.mescroll.endSuccess(list.length || total_count, isNextPage);
            }
            if((list.length == 0) && isNextPage){
                this.mescroll.triggerUpScroll();
            }
            if(!isNextPage && (this.tabIndex < this.tabs.length - 1)) {
                this.tabIndex += 1;
                this.goodPageNum = 1;
                this.groupId_index = 0;
                this.mescroll.triggerUpScroll();
            }
            if (list.length <= 0 && isNextPage && this.isRequestNum < 2) {
                this.isRequestNum += 1;
                this.mescroll.triggerUpScroll();
                return;
            }
            this.isRequestNum = 0;
        },
    }
}
export default listMixin;
