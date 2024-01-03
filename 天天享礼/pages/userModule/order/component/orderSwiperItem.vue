<template>
<mescroll-uni
	ref="mescrollRef"
	@init="mescrollInit"
	:height="height"
	:down="downOption"
	@down="downCallback"
	:up="upOption"
	@up="upCallback"
>
	<orderListItem
		ref="orderListItem"
		:list="list"
		@updateOrderInfo="downCallback"
		@showTakeCode="(item) => this.$emit('showTakeCode', item)"
	>
	</orderListItem>
	<!-- 列表为空时呈现 -->
	<view class="empty_box fl_col_cen" v-if="isEmpty">
		<image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
		<view>{{ empty.tip }}</view>
	</view>
	<view class="you_like-title" v-if="goods.length">
		<image class="left-icon" :src="imgUrl +'static/shopMall/love_left_icon.png'" mode="aspectFill"></image>
		猜你喜欢
		<image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
	</view>
	<good-list
		:list="goods"
		:isBolCredits="true"
		:isJdLink="true"
		@notEnoughCredits="notEnoughCreditsHandle"
	></good-list>
</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
	import orderListItem from './orderListItem.vue'
	import { getImgUrl } from '@/utils/auth.js';
	import goodList from '@/components/goodList.vue';
	import { orderList as orderListApi } from '@/api/modules/order.js';
	import { groupRecommend } from '@/api/modules/index.js';
	import {
		material,
		jingfen,
		goodsQuery
	} from '@/api/modules/jsShop.js';
	import { orderStatus } from '../static/config';
	let _times = {}
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			orderListItem,
			goodList,
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				groupRecommendData: null,
				isRecommendRequest: false,
				goods: [],
				pageNum: 1,
				groupId_index: 0,
				isEmpty: false,
				empty: {
					tip: '暂无订单数据 ~', // 提示
					icon: `${getImgUrl()}/static/images/img_no_data.png`
				},
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1 // 每页数据的数量
					},
					noMoreSize: 4,
					empty: {
						use: false,
					},
					toTop: {
						src: ''
					},
					textNoMore: '----- 没有更多了 -----'
				},
				list: [] //列表数据
			}
		},
		props: {
			curTab: Number,
			status: {
				type: Number,
				default: -1
			},
			height: [Number, String]
		},
		beforeDestroy() {
			clearInterval(_times[this.curTab]);
		},
		mounted() {
		},
		methods: {
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.$emit('notEnoughCredits');
			},
			/*下拉刷新的回调 */
			downCallback() {
				this.isRecommendRequest = false;
				this.isEmpty = false;
				this.goods = [];
				this.pageNum = 1;
				this.groupId_index = 0;
				this.mescroll.resetUpScroll();
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				let parmas = {
					page: page.num,
					status: this.status
				}
				// 是否请求推荐列表，我的收藏列表请求完毕后进行其他接的请求事件
				if(!this.isRecommendRequest) {
					orderListApi(parmas).then(res => {
						let { code, data } = res;
						if (code == 1) {
							// 处理数据：倒计时
							this.initOrderCountdown(data.data);
							if (page.num == 1) this.list = []; //如果是第一页需手动制空列表
							this.list = this.list.concat(data.data); //追加新数据
							if(!this.list.length) {
								this.isEmpty = true;
								this.mescroll.endSuccess(10, true);
								this.isRecommendRequest = true;
								this.requestRem(page);
								return;
							}
						}
						this.mescroll.endBySize(data.data.length, data.total);
					}).catch(err => this.mescroll.endErr());
					return;
				}
				this.requestRem(page);
			},
			async requestRem(page) {
				if(!this.groupRecommendData) {
					const recRes = await groupRecommend({ page: 5 });
					if(recRes.code != 1 || !recRes.data) return this.mescroll.endSuccess(0);
					this.groupRecommendData = recRes.data;
				}
				const {
					id,
					cid,
					cid2,
					cid3,
					eliteId,
					groupId,
					type
				} = this.groupRecommendData;
				let pageNum = this.pageNum;
				// const pageNum = page.num;
				let params = {
					id,
					page: pageNum,
					size: 10,
				}
				let queryApi = goodsQuery;
				// type 1-猜你喜欢 2-京东精选 3-关键词查询, 4 选品库组合
				switch(type) {
					case 1:
						queryApi = material;
						params.eliteId = eliteId;
						params.groupId = groupId;
						params.size = 10;
						break;
					case 2:
						queryApi = jingfen;
						params.eliteId = eliteId;
						params.groupId = groupId;
						params.size = 20;
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
				};
				queryApi(params).then(res=>{
					const {
						list,
						total_count
					} = res.data;
					// 设置列表数据
					if( page.num == 1 ) {
						this.goods = [];
						this.pageNum = 1;
						this.lastOddItem = null;
					}; //如果是第一页需手动制空列表
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (pageNum * params.size) < total_count;
					if(!isNextPage && type == 4 && this.groupId_index < (groupId.length - 1)) {
						// 无下一页
						this.groupId_index += 1;
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
					// this.mescroll.endErr();
				});
			},
			initOrderCountdown(data) {
				let cur_time = new Date().getTime();
				let curTab = this.curTab;
				let count = 0;
				data.forEach(item => {
					// 订单状态：已完成，判断是否已过期
					item.order_status_name = orderStatus[item.status];
					// 京东商品_统一更改成收货状态
					if(item.goods_type == 5 && [2,3].includes(Number(item.status))) {
						item.order_status_name = '待收货';
					}
					if (item.card_status == 2) {
						item.order_status_name = '已过期'
					}
					if (curTab < 2 && item.status == 0) {
						// 后台接口使用过期时间
						let expire_time = new Date(item.expire_time.replace(new RegExp(/-/gm), '/')).getTime();
						// item.expire_date = parseTime(item.expire_time,"{y}-{m}-{d} {h}:{i}:{s}")
						item.remainTime = expire_time - cur_time;
						item.isRequest = false; //是否在请求中
						item.open = item.remainTime > 0;
						if (item.open) {
							count++;
						} else {
							item.remainTime = null
						}
					}
				})
				if (count) this.countdown();
			},
			countdown() {
				clearInterval(_times[this.curTab]);
				_times[this.curTab] = setInterval(() => {
					if (this.list.length == 0) return clearInterval(_times[this.curTab]);
					this.list.forEach(item => {
						if (item.open) {
							item.remainTime -= 1000;
						}
						if (item.remainTime != null && item.remainTime <= 0 && !item.isRequest) {
							clearInterval(_times[this.curTab]);
							item.isRequest = true;
							this.downCallback()
						}
					});
				}, 1000);
			},
		}
	}
</script>
