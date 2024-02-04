<template>
<mescroll-uni
	@init="mescrollInit"
	:height="height"
	:disable-scroll="disableScroll"
	:down="downOption"
	@down="downCallback"
	:up="upOption"
	@up="upCallback"
	@emptyclick="emptyClick"
>
    <good-list :list="goods"></good-list>
</mescroll-uni>
</template>
<script>
import { goodsList } from '@/api/modules/cash.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import goodList from './goodList.vue';
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
					noMoreSize: 4,
				},
				goods: [], //列表数据
				pageNum: 1,
				first_tag: 0,
				isFirst_tag: false,
				shopGroupIndex: -1,
			}
		},
		props:{
			i: Number,
			index: {
				type: Number,
				default: 0
			},
			tabs: {
				type: Array,
				default:[]
			},
			height: [Number,String],
			disableScroll: Boolean,
		},
		watch: {
			goods(newValue, oldValue) {
				if(oldValue.length == newValue.length) return;
				if(newValue.length < 6) {
					this.mescroll.triggerUpScroll();
				}
			},
		},
		computed: {
			shopGroup() {
				return this.tabs[this.index].shopGroup;
			}
		},
		methods: {
			downCallback() {
				this.mescroll.resetUpScroll();
			},
			async upCallback(page) {
				// 列表的京东与拼多多的请求
				if(this.shopGroupIndex >= 0) return this.requestShopGroup(page);
				let curTab = this.tabs[this.index];
				const { id, index } = curTab;
				let pageNum = this.pageNum;
				const params = {
					id,
					index,
					page: pageNum,
					size: 10,
				};
				if(index == 1 && this.first_tag)  {
					params.first_tag = this.first_tag;
				}
				goodsList(params).then(res=>{
					const { list, total_count, first_tag } = res.data;
					if(!this.first_tag && first_tag && index == 1) {
						this.isFirst_tag = true
					}

					this.first_tag = first_tag;
					this.pageNum += 1;
					if( page.num == 1 ) {
						this.goods = [];
						this.pageNum = 1;
					};
					let isNextPage = (pageNum * params.size) < total_count;
					if(!isNextPage) {
						// 无下一页 - 请求列表的数据
						if(!this.isFirst_tag) {
							this.shopGroupIndex = 0;
						} else {
							this.isFirst_tag = false
						}
						this.mescroll.endSuccess(total_count, true);
						this.pageNum = 1;
						this.mescroll.triggerUpScroll();
					} else {
						this.mescroll.endSuccess(list.length, isNextPage);
					}
					// if(list.length == 0 && (pageNum * params.size) < total_count){
					// 	this.mescroll.triggerUpScroll();
					// }
					this.goods = this.goods.concat(list); // 追加新数据
					// this.mescroll.endSuccess(list.length, isNextPage);
				}).catch(()=>this.mescroll.endErr());
			},
			requestShopGroup(page){
				console.log('this.shopGroup', this.shopGroup,this.shopGroupIndex);
				if(!this.shopGroup.length) return this.mescroll.endSuccess(0);
				let shopGroupItem = this.shopGroup[this.shopGroupIndex];
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
				let pageNum = this.pageNum;
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
						if(!this.shopGroup[this.shopGroupIndex]._groupIdIndex) {
							this.shopGroup[this.shopGroupIndex]._groupIdIndex = 0;
						}
						const _groupIdIndex = this.shopGroup[this.shopGroupIndex]._groupIdIndex;
						params.eliteId = eliteId;
						params.groupId = groupId[_groupIdIndex];
						params.size = 20;
						break;
				};
				queryApi(params).then(res=>{
					const { list, total_count } = res.data;
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (pageNum * params.size) < total_count;
					this.pageNum += 1;
					if(!isNextPage && type == 4 && this.shopGroup[this.shopGroupIndex]._groupIdIndex < (groupId.length - 1)) {
						// 无下一页
						this.shopGroup[this.shopGroupIndex]._groupIdIndex += 1;
						this.mescroll.endSuccess(total_count, true);
						this.pageNum = 1;
					} else if(!isNextPage && (this.shopGroupIndex < (this.shopGroup.length - 1))) {
						this.shopGroupIndex += 1;
						this.pageNum = 1;
						// this.mescroll.triggerUpScroll();
						this.mescroll.endSuccess(total_count, true);
						this.mescroll.triggerUpScroll();
					} else {
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					if(list.length == 0 && isNextPage){
						this.mescroll.triggerUpScroll();
					}
					this.goods = this.goods.concat(list); // 追加新数据
				}).catch(()=>this.mescroll.endErr());
			},
			// 点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				});
			}
		},
	}
</script>
