<template>
<mescroll-uni @init="mescrollInit" :height="height" :disable-scroll="disableScroll" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
<!-- 数据列表 -->
    <good-list
        :list="goods"
        :isJdCenter="true"
        :isBolCredits="true"
        :isJdLink="true"
		:isShowProfit="true"
        @notEnoughCredits="notEnoughCreditsHandle"
    ></good-list>
</mescroll-uni>
</template>

<script>
	import {
	goodsQuery,
	guessList
} from '@/api/modules/jsShop.js';
import {
	goodsRecommend,
	goodsSearch,
} from '@/api/modules/pddShop.js';
import { getApiParams } from '@/api/modules/requestConfiguration/lxType.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			goodList
		},
		data() {
			return {
				downOption: {
					auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
					use: false
				},
				upOption: {
					auto: false,
					page: {
						num: 0,
						size: 1
					},
					noMoreSize: 4,
				},
				goods: [], //列表数据
				lastOddItem: null,
				pageNum: 1,
				isAdvertiseStop: false,
				guessListParams: {
					index: 1,
					pageNum: 1,
					sizeNum: 10,
					empty_num: 0,
					is_first: 0
				},
				isRequestEmptyNum: 0,
				isRequestNum: 0,
			}
		},
		props:{
			i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
				type: Number,
				default(){
					return 0
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			},
			height: [Number,String], // mescroll的高度
			disableScroll: Boolean // 是否禁止滚动, 默认false
		},
		watch: {
			goods(newValue, oldValue) {
				if(oldValue.length == newValue.length) return;
				if(newValue.length < 6) {
					this.mescroll.triggerUpScroll();
				}
			},
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback(page) {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			// 列表访问初始化
			init_groupIdIndex() {
				this.tabs[this.index].groupId_index = 0;
				this.goods = [];
				this.pageNum = 1;
                this.isRequestNum = 0;
				this.isAdvertiseStop = false;
				this.guessListParams = {
					index: 1,
					pageNum: 1,
					sizeNum: 10,
					empty_num: 0,
					is_first: 0
				}
			},
			async guessListFun(page) {
				const res = await guessList(this.guessListParams);
				if(res.code != 1 || (res.data && res.data.stop)) {
					this.isAdvertiseStop = true;
					this.mescroll.endSuccess(10, true);
					this.mescroll.triggerUpScroll();
					return;
				}
				const { index, list, pageNum, is_first, empty_num } = res.data;
				if( page.num == 1 ) this.goods = [];
				this.guessListParams = {
					...this.guessListParams,
					index,
					pageNum,
					empty_num,
					is_first
				}
				this.goods = this.goods.concat(list); // 追加新数据
				this.mescroll.endSuccess(10, true);
				// 连续三次请求为空时 - 结束个人性推荐的请求
				if(!list.length) {
					this.isRequestEmptyNum += 1;
					if(this.isRequestEmptyNum >= 3) {
						this.isAdvertiseStop = true;
					}
					this.mescroll.triggerUpScroll();
					return;
				}
				this.isRequestEmptyNum = 0;
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				let curTab = this.tabs[this.index];
                // 拼多多列表
				const { is_advertise, groupId_index } = curTab;
				// 浏览记录推品
				if(is_advertise && !this.isAdvertiseStop) return this.guessListFun(page);
				// 获取配置的京东/拼多多的请求类型及参数
				const { queryApi, params, groupId, type } = getApiParams(
					curTab, { pageNum: this.pageNum, groupId_index }, false
				);
				queryApi(params).then(res => {
					const { list, total_count } = res.data;
					// 设置列表数据
					if(page.num == 1 ) {
						this.goods = [];
						this.tabs[this.index].groupId_index = 0;
						this.pageNum = 1;
						this.lastOddItem = null;
					}; //如果是第一页需手动制空列表
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (this.pageNum * params.size) < total_count;
					if(!isNextPage && (type == 4 )&& groupId_index < (groupId.length - 1)) {
						// 无下一页
						this.tabs[this.index].groupId_index += 1;
						this.mescroll.endSuccess(total_count, true);
						this.pageNum = 0;
					} else {
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					if(list.length == 0 && (this.pageNum * params.size) < total_count){
						this.mescroll.triggerUpScroll();
					}
					if(this.lastOddItem) {
						this.goods.push(this.lastOddItem);
						this.lastOddItem = null;
					}
					this.pageNum += 1;
					this.goods = this.goods.concat(list); // 追加新数据
					const goodLength = this.goods.length;
					if(goodLength % 2 && goodLength > 6) {
						this.lastOddItem = this.goods.pop();
					}

					if (list.length <= 1 && isNextPage && this.isRequestNum < 2) {
						this.isRequestNum += 1;
						this.mescroll.triggerUpScroll();
						return;
					}
					this.isRequestNum = 0;
				}).catch(()=> this.mescroll.endErr());
			},
			// 点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				});
			},
			notEnoughCreditsHandle(){
				this.$emit('notEnoughCredits');
			},
            requestPddList(curTab) {
                const { type, id } = curTab;
                let queryApi = goodsQuery;
                let pageNum = this.pageNum;
                let params = {
                    id,
                    page: pageNum,
                    size: 10,
                }
                // type 1-推荐 2 -关键词查询
                switch(type) {
                    case 1:
                        queryApi = goodsRecommend;
                        break;
                    case 2:
                        queryApi = goodsSearch;
                        break;
                };
                queryApi(params).then(res => {
                    // 设置列表数据
					if( page.num == 1 ) {
						this.goods = [];
						this.tabs[this.index].groupId_index = 0;
						this.pageNum = 1;
						this.lastOddItem = null;
					}; // 如果是第一页需手动制空列表
                    const { list, total_count } = res.data;
                    this.pageNum += 1;
					this.goods = this.goods.concat(list); // 追加新数据
                    mescroll.endBySize(list.length, total_count);
                }).catch(() => this.mescroll.endErr());
            }
		},
	}
</script>
