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
		@againPhone="() => this.$emit('againPhone')"
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
		v-if="goods.length"
		:list="goods"
		:isBolCredits="true"
		:isJdLink="true"
		@notEnoughCredits="notEnoughCreditsHandle"
	></good-list>
</mescroll-uni>
</template>

<script>
import { orderList as orderListApi } from '@/api/modules/order.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import { getImgUrl } from '@/utils/auth.js';
import groupRecommendMixin from '@/utils/mixin/groupRecommendMixin.js'; // 混入推荐商品列表的方法
import { orderStatus } from '../static/config';
import orderListItem from './orderListItem.vue';
	let _times = {}
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin, groupRecommendMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			orderListItem,
			goodList,
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				groupRecommendData: null,
				isRecommendRequest: false,
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
								this.requestGoodList(page); // 调用推荐的猜你喜欢的
								return;
							}
						}
						this.mescroll.endBySize(data.data.length, data.total);
					}).catch(err => this.mescroll.endErr());
					return;
				}
				this.requestGoodList(page); // 调用推荐的猜你喜欢的
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
					if(item.pay_way == 'order') {
						if (item.status == 2) item.order_status_name = '待使用';
						if ([3, 4].includes(item.status)) item.order_status_name = '已使用';
					}
					if (curTab < 2 && item.status == 0) {
						// 后台接口使用过期时间
						let expire_time = new Date(item.expire_time.replace(new RegExp(/-/gm), '/')).getTime();
						item.remainTime = expire_time - cur_time;
						item.isRequest = false; // 是否在请求中
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
