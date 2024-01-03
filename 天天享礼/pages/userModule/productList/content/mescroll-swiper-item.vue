<template>
<mescroll-uni @init="mescrollInit" :height="height" :disable-scroll="disableScroll" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
<!-- 数据列表 -->
    <good-list
        :list="goods"
        :isJdCenter="true"
        :isBolCredits="true"
        :isJdLink="true"
        @notEnoughCredits="notEnoughCreditsHandle"
    ></good-list>
</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
	import goodList from '@/components/goodList.vue';
	import {
		material,
		jingfen,
		goodsQuery
	} from '@/api/modules/jsShop.js';
    import {
		goodsRecommend,
		goodsSearch,
	} from '@/api/modules/pddShop.js';
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			goodList
		},
		data() {
			return {
				downOption:{
					auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
					use: false
				},
				upOption:{
					auto:false, // 不自动加载
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1 // 每页数据的数量
					},
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					// empty:{
					// 	tip: '~ 空空如也 ~', // 提示
					// 	btnText: '去看看'
					// }
				},
				goods: [], //列表数据
				lastOddItem: null,
				pageNum: 1
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
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
			},
			// 列表访问初始化
			init_groupIdIndex() {
				this.tabs[this.index]._groupIdIndex = 0;
				this.goods = [];
				this.pageNum = 1;
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			async upCallback(page) {
				let curTab = this.tabs[this.index];
                // 拼多多列表
				const {
					id,
					cid,
					cid2,
					cid3,
					eliteId,
					groupId,
					type,
                    lx_type
				} = curTab;
				let pageNum = this.pageNum;
				let params = {
					id,
					page: pageNum,
					size: 10,
				}
				let queryApi = goodsQuery;
				// type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
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
						if(!this.tabs[this.index]._groupIdIndex) {
							this.tabs[this.index]._groupIdIndex = 0;
						}
						const _groupIdIndex = this.tabs[this.index]._groupIdIndex;
						params.eliteId = eliteId;
						params.groupId = groupId[_groupIdIndex];
						params.size = 20;
						break;
				};
				queryApi(params).then(res=>{
					const {
						list,
						total_count
					} = res.data;
					// 设置列表数据
					if( page.num == 1 ) {
						this.goods = [];
						this.tabs[this.index]._groupIdIndex = 0;
						this.pageNum = 1;
						this.lastOddItem = null;
					}; //如果是第一页需手动制空列表
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (pageNum * params.size) < total_count;
					if(!isNextPage && type == 4 && this.tabs[this.index]._groupIdIndex < (groupId.length - 1)) {
						// 无下一页
						this.tabs[this.index]._groupIdIndex += 1;
						this.mescroll.endSuccess(total_count, true);
						this.pageNum = 0;
					} else {
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					if(list.length == 0 && (pageNum * params.size) < total_count){
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
				}).catch(()=>{
					//联网失败, 结束加载
					this.mescroll.endErr();
				});
			},
			//点击空布局按钮的回调
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
                    console.log('res', res);
                    // 设置列表数据
					if( page.num == 1 ) {
						this.goods = [];
						this.tabs[this.index]._groupIdIndex = 0;
						this.pageNum = 1;
						this.lastOddItem = null;
					}; //如果是第一页需手动制空列表
                    const {
						list,
						total_count
					} = res.data;
                    this.pageNum += 1;
					this.goods = this.goods.concat(list); // 追加新数据
                    mescroll.endBySize(list.length, total_count);
                }).catch(()=>{
                    //联网失败, 结束加载
                    this.mescroll.endErr();
                });
            }
		},
	}
</script>
