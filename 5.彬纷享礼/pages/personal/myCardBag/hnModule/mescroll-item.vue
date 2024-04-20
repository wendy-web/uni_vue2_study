<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<mescroll-uni :ref="'mescrollRef'+currTabs" :fixed="false" :bottom="currTabs === 0?80:0" @init="mescrollInit"
		:down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
		<!-- 数据列表 -->
		<block v-if="type == 0">
			<block v-for="item in listData" :key="item.id">
				<!-- 未用  -->
				<not-converted v-if="currTabs === 0" :config="item" :key="item.id" @setCheckItem="setCheckItem"
					@directExchange="directExchange" />
				<!-- 已用  -->
				<converted v-else-if="currTabs === 1" :config="item" :key="item.id" />
				<!-- 已过期 -->
				<lost-efficacy v-else :config="item" :key="item.id" />
			</block>
		</block>
		<block v-else-if="type == 1">
			<block v-for="item in listData" :key="item.id">
				<!-- 未用  -->
				<zm-not-converted v-if="currTabs === 0" :config="item" :key="item.id" @setCheckItem="setCheckItem"
					@directExchange="directExchange" />
				<!-- 已用  -->
				<zm-converted v-else-if="currTabs === 1" :config="item" :key="item.id" />
				<!-- 已过期 -->
				<zm-lost-efficacy v-else :config="item" :key="item.id" />
			</block>
		</block>
		<!-- 数据加载完毕 -->
		<!-- 		<view v-if="currTabs===0&&listData.length>4&&isBottom" class="mescroll-bottom">
			  <view class="mescroll-bottom-text">
			  	  ———————— 没有更多了 ————————
			  </view>
		</view> -->
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
	import MescrollMoreItemMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js';
	/*红牛子ITEM组件*/
	import notConverted from './notConverted';
	import converted from './converted';
	import lostEfficacy from './lostEfficacy';
	/*子ITEM组件*/
	/*战马子ITEM组件*/
	import zmNotConverted from '../zmModule/zmNotConverted.vue';
	import zmConverted from '../zmModule/zmConverted.vue';
	import zmLostEfficacy from '../zmModule/zmLostEfficacy.vue';
	import log from '@/utils/log'
	/*子ITEM组件*/
	let _countDownTime = null; //未使用倒计时换倒计时 

	import {
		getcardlog,
		getcardpack,
		setexpire
	} from '@/api/homeApi.js';
	import {
		debounce
	} from "@/utils/index.js"
	import {
		mapActions
	} from 'vuex';
	//兑换最大罐数
	let _maximum = 20;
	//downCount
	let _downCount = 0

	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			notConverted,
			converted,
			lostEfficacy,
			zmNotConverted,
			zmConverted,
			zmLostEfficacy
		},
		data() {
			return {
				downOption: {
					auto: false // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption: {
					auto: false, // 不自动加载
					noMoreSize: 5, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty: {
						tip: '~ 空空如也 ~', // 提示
						btnText: '去新闻页'
					},
					toTop: {
						src: ''
					},
					textNoMore: '----- 没有更多了 -----'
				},
				//列表数据
				listData: [],
				isBottom: false
			};
		},
		props: {
			currTabs: {
				type: Number,
				default: 0
			},
			type: {
				type: Number,
				default: 0
			},
			isCheckAll: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			type() {
				this.mescroll.resetUpScroll();
			}
		},
		mounted() {
			_downCount = 0
		},
		methods: {
			...mapActions({
				getCardTopCount: 'personal/getCardTopCount'
			}),
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper()
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll();
				//更新顶部数据
				if (_downCount == 0) this.refreshTopCount();
				//下拉次数累加
				_downCount++
			},
			clearData() {
				this.listData = []
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				//联网加载数据
				let currTabs = this.currTabs;
				//请求参数处理
				let API = getcardlog,
					pageSize = currTabs === 0 ? _maximum : 10,
					parmas = {
						next: page.num,
						limit: pageSize,
						type: this.type + 1
					};
				/*根据类型请求*/
				if (currTabs === 0) { //未使用
					parmas.use = 0;
				} else if (currTabs === 1) { //已使用
					API = getcardpack;
					delete parmas.type;
					parmas.qr_type = this.type + 1
				} else { //已过期
					parmas.use = 2;
				}

				//获取数据
				API(parmas).then(res => {

					let data = {
						list: res.data.list || []
					};

					//联网成功的回调,隐藏下拉刷新和上拉加载的状态
					this.mescroll.endSuccess(data.list.length);
					//处理到底情况
					if (data.list.length < pageSize) this.isBottom = true;
					//特殊处理
					this.exchangedTransform(data.list);
					//设置列表数据
					if (page.num === 1) {
						this.listData = []; //如果是第一页需手动制空列表
						if (this.currTabs === 0) this.$emit('checkback', {
							isCheckAll: false,
							checkData: []
						});
					}
					//填充数据
					this.listData = this.listData.concat(data.list);
					//告诉父层卡包数据
					if (this.currTabs === 0) {
						this.$emit('showSubmitBar', this.listData.length > 0)
					}
					//递减
					_downCount--
					//请求前
					log.addFilterMsg('myCardBag')
					log.info('myCardBag_parmas', JSON.stringify({
						...parmas,
						currTabs: this.currTabs
					}))
					log.info('myCardBag_res', JSON.stringify(data.list))
				}).catch(err => {
					//联网失败, 结束加载
					this.mescroll.endErr();
					//递减
					_downCount--
				});

			},
			//点击空布局按钮的回调
			emptyClick() {
				this.$reLaunch({
					url: '/pages/tabBar/home/index'
				});
			},
			//处理兑换中
			exchangedTransform(data) {
				//当前时间
				let currTime = new Date().getTime()
				let currTabs = this.currTabs
				let count = 0
				data.forEach(function(item) {
					//将25周年劵统一设置为 prizeratetype = 1
					if ([null, 0].indexOf(item.prizeratetype) > -1) item.prizeratetype = 1
					//未兑换特殊处理
					if (currTabs === 0 && item.expire) {
						item.isCheck = false //可选配置
						let time = item.expire //过期时间
						//过期时间
						let expirationTime = new Date(time.replace(/\-/g, '/')).getTime()
						//剩余时间
						item.remainingTime = expirationTime - currTime
						//open为true 则开启倒计时 小于7天开启倒计时
						item.open = item.remainingTime <= 7 * 24 * 60 * 60 * 1000
						if (item.open) count++
						item.isRequest = false //是否在请求中
					}
				});
				//有数据时开启倒计时
				if (count > 0) this.countDown()
			},
			//兑换中倒计时
			countDown() {

				clearInterval(_countDownTime);

				_countDownTime = setInterval(() => {
					//没有数据时结束倒计时
					if (this.listData.length === 0) return clearInterval(_countDownTime);
					//数据处理
					this.listData.forEach((item, index) => {
						//可以倒计时
						if (item.open) {
							item.remainingTime -= 1000;
						}
						//时间小于或等于0的数据可进行删除
						if (item.remainingTime <= 0 && !item.isRequest) {
							//防止多次调用
							item.isRequest = true;
							//发送给后端
							setexpire({
								id: item.id
							}).then(res => {
								if (res.code == 1) {
									this.refresh()
								}
							});
						}
					});

				}, 1000);
			},
			refresh: debounce(function() {
				this.$emit('refreshCardPackage');
				//刷新下顶部
				this.getCardTopCount();
			}, 800),
			// refreshTopCount: debounce(function() {
			// 	//刷新下顶部
			// 	this.getCardTopCount();
			// }, 500),
			refreshTopCount() {
				//刷新下顶部
				this.getCardTopCount();
			},
			//兑换卷单选
			setCheckItem(val) {

				if (this.isCheckAll && !val.isCheck)
					return this.$emit('xhNotify', {
						type: 'warning',
						message: `亲,一次最多换购${_maximum}罐！`,
						duration: 1500
					});
				//是否是全选状态
				let index = 0;
				let _list = this.listData;
				let checkData = [];
				//处理对应选中状态修改
				for (let i = 0; i < _list.length; i++) {
					let item = _list[i];
					if (item.id === val.id) {
						item.isCheck = !val.isCheck;
					}
					if (item.isCheck) {
						index++;
						checkData.push(item);
					}
				}
				//选中回调
				this.$emit('checkback', {
					isCheckAll: index == _list.length || index == _maximum,
					checkData
				});
			},
			//全选当前列表
			checkAll() {
				let isCheckAll = !this.isCheckAll;
				let _list = this.listData;
				let checkData = [];
				for (let index = 0; index < _list.length; index++) {
					let item = _list[index];
					if (index <= (_maximum - 1)) {
						item.isCheck = isCheckAll;
					} else {
						item.isCheck = false;
					}
					if (item.isCheck) checkData.push(item);
				}
				//选中回调
				this.$emit('checkback', {
					isCheckAll,
					checkData
				});
			},
			//直接兑换
			directExchange(data) {
				this.$emit('directExchange', data);
			}
		},
		beforeDestroy() {
			clearInterval(_countDownTime);
		}
	};
</script>
<style>
	.mescroll-bottom {
		padding-bottom: 44px;
	}

	.mescroll-bottom-text {
		height: 40rpx;
		display: inline-block;
		font-size: 28rpx;
		color: gray;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
</style>