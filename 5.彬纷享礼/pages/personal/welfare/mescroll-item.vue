<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<mescroll-uni :ref="'mescrollRef'+currTabs" height="100%" @init="mescrollInit" :down="downOption"
		@down="downCallback" :up="upOption" @up="upCallback">
		<!-- 数据列表 -->
		<template v-for="item in listData">
			<!-- 待使用 -->
			<not-converted v-if="currTabs === 0" :config="item" :key="item.id" />
			<!-- 去使用  -->
			<converted v-else-if="currTabs === 1" :config="item" :key="item.id" />
			<!-- 已过期 -->
			<lost-efficacy v-else :config="item" :key="item.id" />
		</template>
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import MescrollMoreItemMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js';
	/*子ITEM组件*/
	import notConverted from './not-converted.vue';
	import converted from './converted.vue';
	import lostEfficacy from './lost-efficacy.vue';

	import {
		getgifts,
		expiregifts
	} from '@/api/homeApi.js';
	import {
		debounce
	} from '@/utils/index.js';
	let _getcount = 0;
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			notConverted,
			converted,
			lostEfficacy
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 空空如也 ~'
					},
					toTop: {
						src: ''
					},
					textNoMore: '———————— 没有更多了 ————————'
				},
				listData: [], //列表数据
				isBottom: false
			};
		},
		created() {
			_getcount = 0;
		},
		props: {
			currTabs: {
				type: Number,
				default: 0
			}
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				this.mescroll.resetUpScroll();
				if (_getcount > 0)
					this.$emit('getTopCount'); //更新顶部数据
				else
					_getcount++;
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {

				//联网加载数据
				let currTabs = this.currTabs;
				//请求参数处理
				let parmas = {
					next: page.num,
					expire: currTabs
				};

				getgifts(parmas).then(res => {

					let data = res.data || {
						list: []
					};

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//设置列表数据
					if (page.num === 1) this.listData = []; //如果是第一页需手动制空列表
					//添加数据
					this.listData = this.listData.concat(data.list);
					//如果是未使用，特殊处理
					if (this.currTabs === 0) this.exchangedTransform();


				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
				});

			},
			exchangedTransform() {
				let today = Date.now();
				//刷新列表
				let refreshList = debounce(() => {
					this.$emit('refreshList');
				}, 1000);
				//处理需要回调的数据
				this.listData.forEach((item, index) => {
					let expire = new Date(item.expire_time.replace(/\-/g, '/')).getTime();
					//type 等于 0 且过期了
					if (item.type === 0 && today >= expire) {
						expiregifts({
							gid: item.id
						}).then(res => {
							refreshList();
						});
					}
				});
			}
		}
	};
</script>
