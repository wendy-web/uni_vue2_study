<template>
	<view class="cash">
		<mescroll-body id="mescrollBody" ref="mescrollRef" :sticky="true" @init="mescrollInit" @down="downCallback"
			:down="downOption" :up="upOption" @up="upCallback">
			<xh-navbar :fixedNum="true" titleAlign="titleRight" navbarImageMode="widthFix"
				:navberColor="false ? '#F9344B': '#f7f7f7'" :overFlow="true"
				navbarImage="https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png">
				<view slot="title" class="nav-custom fl_bet">
					<view class="custom_left" @click="callBackHandle">
						<image :src="title_img" mode="heightFix"
						:class="['custom_left-txt', !isShowTitle ? 'active' : '']" v-if="title_img"></image>
					</view>
					<view class="title_rule fl_center">
						<view class="title_rule-item" @click="goToActivityRecordHandle" v-if="!subIndex">活动记录</view>
						<view class="title_rule-item" @click="isRuleShowDia = true">规则</view>
					</view>
				</view>
			</xh-navbar>
			<image src="https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png" :style="{'--margin': navHeight + 'px' }"
				mode="widthFix" class="nav_bg"></image>
			<!-- 提示 -->
			<view :class="['remind box_fl', showRemindCont ? 'show_height' : 'hide_height']">
				在“【我的】-【免单返现】”也可找到本活动
			</view>
			<!-- 免单领现金的tab的切换 -->
			<airSubTab
				:subIndex="subIndex"
				:subList="subList"
				@selTab="subTabHandle"
				@airSubTabRef="airSubTabRefHandle"
				v-if="subList.length > 1"
			></airSubTab>
			<keep-alive v-if="!subIndex">
				<view class="order_title" @click="addOrderHandle" id="orderTitle">
            		单笔订单实付≥{{ freeEnterArr.order_money || 0 }}元可参与活动
				</view>
				<freeTopDom
					v-if="[2, 3].includes(freeEnterPageStatus)"
					@addOrder="goToBuyHandle"
					@showGiftImg="isShowFreeAwardShowImgDia = true"
					@showFreeOrder="isShowFreeOrderDia= true"
					@freeTopDomRef="freeTopDomRefHandle"
					@getAward="getAwardHandle"
					@goToAct="goToActivityRecordHandle"
				></freeTopDom>
				<freeAccelerateDom
					v-if="speedList.length && ![4, 5].includes(freeEnterPageStatus)"
					:list="speedList"
					@freeAccelerateDomRef="freeAccelerateDomRefHandle"
				></freeAccelerateDom>
				<cashFinishDom7 v-if="[4].includes(freeEnterPageStatus)" @cashFinishDom7Ref="freeFinishDom45RefHandle"></cashFinishDom7>
				<freeFinishDom45 v-if="[5].includes(freeEnterPageStatus)" @freeFinishDom45Ref="freeFinishDom45RefHandle">
				</freeFinishDom45>
			</keep-alive>
			<keep-alive v-else>
				<openFirstRed @goToBuy="goToBuyHandle" @openFirstRef="openFirstRefHandle" :isShowRed="!isShowStatusAni"
					v-if="[1, 2, 3].includes(enterPageStatus)"></openFirstRed>
				<cashFinishDom45 @cashFinishDom45Ref="cashFinishDom45RefHandle" @goToBuy="goToBuyHandle"
					v-if="[4, 5].includes(enterPageStatus)"></cashFinishDom45>
				<cashFinishDom6 v-if="[6].includes(enterPageStatus)" @cashFinishDom6Ref="cashFinishDom6RefHandle">
				</cashFinishDom6>
				<!-- 活动 -->
				<cashFinishDom7
					v-if="[7].includes(enterPageStatus)"
					:isShowScan="subIndex"
					@cashFinishDom7Ref="cashFinishDom7RefHandle"
					@scanResult="scanResultHandle"
				></cashFinishDom7>
			</keep-alive>

			<!-- 上拉的浮动定位显示 -->
			<view :class="['active_top', showActivityStatusDom ? 'active' : '']"
				:style="{ top: stickyTabTop, '--top': navHeight + 'px' }"
				v-if="showActivityStatusDom"
			>
				<activityStatusDom
					@activityStatusDomRef="activityStatusDomRefHandle"
					:subIndex="subIndex"
					:orderNum="freeEnterArr.order_num"
					:actHeight="activityStatusDomHeight"
				></activityStatusDom>
			</view>
			<!-- <me-tabs v-model="tabIndex" :tabs="showTabsList" scroll="true" :height="tabHeight"></me-tabs> -->
			<view class="cont_list" v-if="showTabsList.length">
				<view class="tabs_box" v-if="isShowTabDom" :style="{ top: stickyActTop}">
					<me-tabs v-model="tabIndex" :tabs="showTabsList" scroll="true" :height="tabHeight"></me-tabs>
				</view>
				<!-- 列表长度大于4 才使用最小高度进行加载 -->
				<view class="good_list-box"
					:style="{'--minheight': (tabsList[tabIndex].goods.length > 4 || showActivityStatusDom) ? listContHeight : 'auto'}">
					<good-list :list="tabsList[tabIndex].goods" :subIndex="subIndex"></good-list>
				</view>
			</view>
		</mescroll-body>
		<firstDia1 @closeElseDia="closeElseDiaHandle" @close="closeDiaHandle"></firstDia1>
		<firstRedOpenDia3 @close="closeFirstRedOpenDia3Handle" @closeElseDia="closeElseDiaHandle"></firstRedOpenDia3>
		<firstFinishDia5 @close="closeFirstFinishDia5Handle" @closeElseDia="closeElseDiaHandle"></firstFinishDia5>
		<ruleGetCashDia :isShow="isRuleShowDia" :subIndex="subIndex" @close="isRuleShowDia = false"></ruleGetCashDia>
		<!-- 第一次挽回弹窗的结果 -->
		<backFirstDia :isShow="isShowBackFirstDia" :enterArr="enterArr" @buyOpen="buyOpenHandle"></backFirstDia>
		<backSecondDia :isShow="isShowBackSecondDia" :enterArr="enterArr" @buyOpen="buyOpenHandle"></backSecondDia>
		<!-- 免单中奖的弹窗 -->
		<freeAwardDia
			:isShow="isShowFreeAwardDia"
			:freeAwardObj="freeAwardObj"
			@close="closeFreeAwardDiaHandle"
		></freeAwardDia>
		<freeAwardShowImgDia
			:isShow="isShowFreeAwardShowImgDia"
			@close="isShowFreeAwardShowImgDia = false"
		></freeAwardShowImgDia>
		<freeOrderDia
			:isShow="isShowFreeOrderDia"
			@close="isShowFreeOrderDia = false"
		></freeOrderDia>
		<!-- 免单特权的中奖列表 -->
		<freeAwardLisDia1
			:isShow="isShowFreeAwardLisDia1"
			:freeActiveId="freeEnterArr.active_id"
			@choose="chooseHandle"
			@close="isShowFreeAwardLisDia1 = false"
		></freeAwardLisDia1>
		<!-- 地址的填写 -->
		<freeRepairAddressDia
			:isShow="isShowSelAddDia"
			:selItem="selItem"
			addTitle="填写收货信息，奖品包邮到家"
			submitBtn="已确认收货信息，立即保存"
			@close="isShowSelAddDia = false"
			@submit="submitHandle"
		></freeRepairAddressDia>
	</view>
</template>
<script>
import { activeCk, freeGoodsList, freeGroupList, goodsList, groupList, speedGroup } from '@/api/modules/cash.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import { goodsRecommend, goodsSearch } from '@/api/modules/pddShop.js';
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getBaseUrl, getImgUrl, getStorage, setStorage } from '@/utils/auth.js';
import getViewPort from '@/utils/getViewPort.js';
import { parseTime } from '@/utils/index.js';
import shareMixin from '@/utils/mixin/shareMixin.js'; // 混入分享的混合方法
import { mapActions, mapGetters, mapMutations } from "vuex";
import activityStatusDom from './component/activityStatusDom.vue';
import airSubTab from './component/airSubTab.vue';
import backFirstDia from './component/backFirstDia.vue';
import backSecondDia from './component/backSecondDia.vue';
import cashFinishDom45 from './component/cashFinishDom45.vue';
import cashFinishDom6 from './component/cashFinishDom6.vue';
import cashFinishDom7 from './component/cashFinishDom7.vue';
import firstDia1 from './component/firstDia1.vue';
import firstFinishDia5 from './component/firstFinishDia5.vue';
import firstRedOpenDia3 from './component/firstRedOpenDia3.vue';
import freeAccelerateDom from './component/freeAccelerateDom.vue';
import freeAwardDia from './component/freeAwardDia.vue';
import freeAwardLisDia1 from './component/freeAwardLisDia1.vue';
import freeAwardShowImgDia from './component/freeAwardShowImgDia.vue';
import freeFinishDom45 from './component/freeFinishDom45.vue';
import freeOrderDia from './component/freeOrderDia.vue';
import freeRepairAddressDia from './component/freeRepairAddressDia.vue';
import freeTopDom from './component/freeTopDom.vue';
import goodList from './component/goodList.vue';
import meTabs from './component/me-tabs.vue';
import openFirstRed from './component/openFirstRed.vue';
import ruleGetCashDia from './component/ruleGetCashDia.vue';
import cashMixin from './static/cashMixin.js'; // 混入分享的混合方法
	export default {
		mixins: [MescrollMixin, cashMixin, shareMixin], // 使用mixin
		components: {
			meTabs,
			firstDia1,
			firstFinishDia5,
			openFirstRed,
			cashFinishDom45,
			cashFinishDom6,
			cashFinishDom7,
			freeFinishDom45,
			activityStatusDom,
			firstRedOpenDia3,
			ruleGetCashDia,
			goodList,
			backFirstDia,
			backSecondDia,
			freeTopDom,
			freeAccelerateDom,
			freeAwardDia,
			freeOrderDia,
			freeAwardLisDia1,
			freeAwardShowImgDia,
			airSubTab,
			freeRepairAddressDia
		},
		data() {
			return {
				title_img: '', // 标题头的img
				imgUrl: getImgUrl(),
				isShowNavBerColor: false,
				downOption: {
					auto: true,
					use: true,
					bgColor: "#ffffff",
				},
				upOption: {
					auto: false, // 不自动加载
					use: true,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1, // 每页数据的数量
					},
					noMoreSize: 4,
					empty: {
						use: false,
					},
				},
				airSubTabRefHeight: 0,
				tabIndex: 0, // 免单-领现金切换
				freeOrderTitleRefHeight: 0,
				freeTopDomRefHeight: 0, // 免单头部的dom的高度
				freeAccelerateDomRefHeight: 0, //
				freeFinishDom45RefHeight: 0,



				tabHeight: 94,
				openFirstRefHeight: 0, // 开始状态的页面头部显示内容
				cashFinishDom45RefHeight: 0, // 翻倍状态的头部显示内容
				cashFinishDom6RefHeight: 0, // 已翻倍完的头部显示内容
				cashFinishDom7RefHeight: 0, // 结束的头部显示
				activityStatusDomHeight: 120,
				tabsList: [],
				showTabsList: [],
				isShowActive: false, // 跳转使用到
				isShowGetCashDia: false,
				isRuleShowDia: false,
				initTimer: null,
				isShowBackFirstDia: false,
				isShowBackSecondDia: false,
				showRemindCont: false,
				remindStorageKey: `${getBaseUrl()}_remindCont_cashDay`,
				showRemindTimer: null,
				backFirstStorageKey: `${getBaseUrl()}_back_first_cashDay`,
				backSecondStorageKey: `${getBaseUrl()}_back_second_cashDay`,
				subList: [],
				subIndex: -1,
				isShowFreeAwardLisDia1: false,
				isShowFreeAwardDia: false,
				freeAwardObj: null,
				isShowFreeAwardShowImgDia: false,
				speedList: [],
				isShowFreeOrderDia: false,
				is_close: 0,
				isShowSelAddDia: false,
				selItem: {},
				isShowScrollTitle: false
			}
		},
		computed: {
			...mapGetters([
				'enterPageStatus',
				'enterArr',
				'isMiniProgram',
				'freeEnterPageStatus',
				'freeEnterArr',
			]),
			// 列表数据
			goodList() {
				if (this.tabsList.length > 0) {
					let item = this.tabsList[this.tabIndex];
					return item.goods;
				}
				return [];
			},
			navHeight() {
				let viewPort = getViewPort();
				return viewPort.navHeight;
			},
			stickyTop() {
				let viewPort = getViewPort();
				return viewPort.navHeight;
			},
			stickyActTop() {
				let stickyTop = this.stickyTop;
				// 免单
				if (!this.subIndex && ![4].includes(this.freeEnterPageStatus)) stickyTop = stickyTop + this.activityStatusDomHeight;
				// 领现金
				if (this.subIndex && ![6, 7].includes(this.enterPageStatus)) stickyTop = stickyTop + this.activityStatusDomHeight;
				return stickyTop + 'px';
			},
			stickyTabTop() {
				let stickyTop = this.stickyTop;
				return stickyTop + 'px';
			},
			shopGroup() {
				return this.tabsList[this.tabIndex]?.shopGroup;
			},
			showActivityStatusDom() {
				if(!this.isShowActive) return false;
				if(this.subIndex) return ![6, 7].includes(this.enterPageStatus)
				return ![4].includes(this.freeEnterPageStatus);
			},
			listContHeight() {
				let viewPort = getViewPort();
				let swiperHeight = viewPort.windowHeight - viewPort.navHeight;
				return swiperHeight + "px";
			},
			isShowTabDom() {
				return this.showTabsList.length > 1;
			},
			scrollFixValue() {
				if(this.subIndex) {
					switch (this.enterPageStatus) {
						case 0:
						case 1:
						case 2:
						case 3:
							// 开始状态的页面头部显示内容
							return this.airSubTabRefHeight + uni.upx2px(64) + (this.openFirstRefHeight - this.activityStatusDomHeight);
							break;
						case 4:
						case 5:
							// 翻倍状态的头部显示内容
							return this.airSubTabRefHeight + uni.upx2px(64) + (this.cashFinishDom45RefHeight - this.activityStatusDomHeight);
							break;
						case 6:
							return this.airSubTabRefHeight + uni.upx2px(64) + this.cashFinishDom6RefHeight;
							break;
						case 7:
							return this.airSubTabRefHeight + this.cashFinishDom7RefHeight;
							break;
					}
					return;
				}
				switch (this.freeEnterPageStatus) {
						case 1:
						case 2:
						case 3:
							// 开始状态的页面头部显示内容
							return this.airSubTabRefHeight + this.freeOrderTitleRefHeight + this.freeTopDomRefHeight + this.freeAccelerateDomRefHeight - this.activityStatusDomHeight;
							break;
						case 4:
						case 5:
							return this.airSubTabRefHeight + this.freeOrderTitleRefHeight + this.freeFinishDom45RefHeight;
							break;
					}
				return;
			},
			isShowTitle() {
				return (this.subList.length < 2) || this.isShowScrollTitle;
			}
		},
		watch: {
			tabIndex(newValue) {
				this.mescroll.resetUpScroll();
				if (this.showActivityStatusDom || (this.subIndex && [6, 7].includes(this.enterPageStatus)) || (!this.subIndex && this.freeEnterPageStatus == 4)) return this.goToBuyHandle();
			},
			subIndex:{
				handler: async function(newValue) {
					// 领红包的页面 - 进行状态的监听
					newValue ? this.setTimeInit() : this.clearTimeInit();
				},
			}
		},
		// 页面周期函数--监听页面加载
		async onLoad(option) {
			this.$storageRemove(this.remindStorageKey);
			this.$nextTick(()=>{
				setTimeout(() => this.orderTitleDom(), 1000);
			});
			this.requestGetLog(); // 获取领取记录
			this.delCurrentDiaList('cashBack');
			if(option.is_close) this.is_close = option.is_close;
			if(option.subIndex) {
				this.subIndex = Number(option.subIndex);
				return;
			}
		},
		async onShow() {
			// this.subIndex && this.setTimeInit();
			let cur_date = parseTime(new Date(), "{y}/{m}/{d}");
			const showRemindDay = getStorage(this.remindStorageKey);
			if(showRemindDay) return false;
			this.showRemindTimer = setTimeout(() => {
				this.showRemindCont = true;
				setTimeout(() => {
					this.showRemindCont = false;
					setStorage(this.remindStorageKey, cur_date);
				}, 10000);
			}, 5000);
		},
		methods: {
			...mapMutations({
				setAutoLogin: 'user/setAutoLogin',
				delCurrentDiaList: "user/delCurrentDiaList",
				setEnterPageStatus: 'cash/setEnterPageStatus'
			}),
			...mapActions({
				getUserInfo: "user/getUserInfo",
				initEnterPage: 'cash/initEnterPage',
				initFreeEnterPage: 'cash/initFreeEnterPage',
				requestGetLog: 'cash/requestGetLog',
			}),
			orderTitleDom(){
				this.initWarpRect('orderTitle').then(res=> {
					if(!res) return;
					this.freeOrderTitleRefHeight = res.height;
				});
			},
			initWarpRect(id) {
				return new Promise(resolve => {
				setTimeout(() => { // 延时确保dom已渲染, 不使用$nextclick
					let query = uni.createSelectorQuery();
					// #ifndef MP-ALIPAY
					query = query.in(this) // 支付宝小程序不支持in(this),而字节跳动小程序必须写in(this), 否则都取不到值
					// #endif
					query.select('#' + (id || this.viewId)).boundingClientRect(data => {
					resolve(data)
					}).exec();
				}, 20)
				})
			},
			async initActiveCk() {
				this.subList = [];
				const res = await activeCk();
				if(res.code != 1 || !res.data) return;
				const { have_profit, have_free } = res.data;
				if(have_profit) {
					this.subList.unshift({
						text: '领现金',
						icon: 'https://test-file.y1b.cn/store/1-0/2432/65e2d705a307b.png',
						icon_active: 'https://test-file.y1b.cn/store/1-0/2432/65e2d6f2a23ce.png',
					});
					this.subIndex = 1;
				}
				if(have_free) {
					this.subList.unshift({
						text: '免单特权',
						icon: 'https://test-file.y1b.cn/store/1-0/2432/65e2d4b7b0afc.png',
						icon_active: 'https://test-file.y1b.cn/store/1-0/2432/65e2d4a002f54.png',
					});
					this.subIndex = 0;
				}
			},
			subTabHandle(index) {
				if(this.subIndex == index) return;
				this.subIndex = index;
				this.tabIndex = 0;
				this.tabsList = [];
				this.showTabsList = [];
				this.mescroll.scrollTo(0);
				this.downCallback();
			},
			async downCallback() {
				this.tabsList = [];
				this.showTabsList = [];
				(this.subIndex < 0) && await this.initActiveCk();
				(this.subIndex < 0) && (this.subIndex = 1);
				// 标题头部的呈现
				this.title_img = !this.subIndex ? 'https://test-file.y1b.cn/store/1-0/24312/65f0171b9d916.png': 'https://file.y1b.cn/store/1-0/24123/65af146cd8811.png';
				if(!this.subIndex) {
					const res = await this.initFreeEnterPage(this.is_close);
					let { firstArr } = res;
					// 成功凑单弹窗信息，有就弹窗，无则不展示
					if(this.freeEnterPageStatus == 1)  {
						this.isShowFreeAwardLisDia1 = true;
					} else if(firstArr) {
						this.freeAwardObj = firstArr;
						this.isShowFreeAwardDia = true;
					}
					this.initSpeedGroup();
				} else {
					await this.initEnterPage(this.is_close);
				}
				this.mescroll.resetUpScroll();
			},
			async initSpeedGroup() {
				const speedRes = await speedGroup();
				if(speedRes.code != 1 || !speedRes.data) return;
				this.speedList = speedRes.data;
			},
			chooseHandle() {
				this.isShowFreeAwardLisDia1 = false;
				this.downCallback();
			},
			closeFreeAwardDiaHandle() {
				this.isShowFreeAwardDia = false;
			},
			goToActivityRecordHandle() {
				this.$go(`/pages/userCash/cash/activityRecord?active_id=${this.freeEnterArr.active_id || 0}`)
			},
			// 扫红牛码的使用 - 列表的数据更新
			scanResultHandle() {
				this.is_close = 0;
				this.downCallback();
			},
			async upCallback(page) {
				// 获取tab的列表
				if (!this.tabsList.length) {
					let groupListApi = !this.subIndex ? freeGroupList : groupList;
					const params = {};
					(!this.subIndex) && (params.active_id = this.freeEnterArr.active_id);
					const res = await groupListApi(params);
					if (!res.code || !res.data.length) return this.mescroll.endSuccess(0);
					let _tab = res.data.map((item) => {
						return {
							...item,
							goods: [],
							shopGroupIndex: -1, // >0;请求京东拼多多的列表
							pageNum: 1,
							first_tag: 0,
							isSecondLastPage: false,

						};
					});
					this.tabsList = _tab;
					this.showTabsList = res.data;
				}
				let currentItem = this.tabsList[this.tabIndex];
				let {
					id,
					index,
					pageNum,
					goods,
					shopGroupIndex,
					first_tag,
					isSecondLastPage
				} = currentItem;
				if (page.num == 1) {
					goods = [];
					pageNum = 1;
				};
				// 列表的京东与拼多多的请求
				if (shopGroupIndex >= 0) return this.requestShopGroup(page);
				const params = {
					id,
					index,
					page: pageNum,
					size: 10,
					first_tag
				};
				// 免单的
				if(!this.subIndex) params.active_id = this.freeEnterArr.active_id;
				const freeGoodsListApi = !this.subIndex ? freeGoodsList : goodsList;
				freeGoodsListApi(params).then(res => {
					const {
						list,
						total_count,
						first_tag
					} = res.data;
					// 是否有下一页
					let isNextPage = ((pageNum * params.size) < total_count);
					pageNum += 1;
					goods = goods.concat(list); // 追加新数据
					this.tabsList[this.tabIndex] = {
						...currentItem,
						goods,
						pageNum,
						first_tag,
						shopGroupIndex
					};
					// 有下一页 继续请求
					if (isNextPage) return this.mescroll.endSuccess(list.length, isNextPage);
					this.mescroll.endSuccess(total_count, true);
					this.tabsList[this.tabIndex].pageNum = 1;
					if (index == 1) {
						if (!isSecondLastPage) {
							this.tabsList[this.tabIndex].isSecondLastPage = true;
							this.mescroll.triggerUpScroll();
						} else {
							this.tabsList[this.tabIndex].shopGroupIndex = 0;
							this.mescroll.triggerUpScroll();
						}
					} else {
						this.tabsList[this.tabIndex].shopGroupIndex = 0;
						this.mescroll.triggerUpScroll();
					}
				}).catch(() => this.mescroll.endErr());
			},
			requestShopGroup(page) {
				const currentItem = this.tabsList[this.tabIndex];
				let {
					pageNum,
					goods,
					shopGroupIndex,
				} = currentItem;
				if (!this.shopGroup.length) return this.mescroll.endSuccess(9, false);
				let shopGroupItem = this.shopGroup[shopGroupIndex];
				if (!this.shopGroup[shopGroupIndex]._listLength0) {
					this.shopGroup[shopGroupIndex]._listLength0 = 0;
				}
				if (!this.shopGroup[shopGroupIndex]._listLength6) {
					this.shopGroup[shopGroupIndex]._listLength6 = 0;
				}
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
				let params = {
					id,
					page: pageNum,
					size: 10,
					active_id,
					tag
				}
				let queryApi = goodsQuery;
				switch (type) {
					case 1:
						if (lx_type == 2) {
							queryApi = goodsRecommend;
						} else {
							queryApi = material;
							params.eliteId = eliteId;
							params.groupId = groupId;
						}
						break;
					case 2:
						if (lx_type == 2) {
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
						if (!this.shopGroup[shopGroupIndex]._groupIdIndex) {
							this.shopGroup[shopGroupIndex]._groupIdIndex = 0;
						}
						const _groupIdIndex = this.shopGroup[shopGroupIndex]._groupIdIndex;
						params.eliteId = eliteId;
						params.groupId = groupId[_groupIdIndex];
						params.size = 20;
						break;
				};
				queryApi(params).then(res => {
					const {
						list,
						total_count
					} = res.data;
					// 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					let isNextPage = (pageNum * params.size) < total_count;
					pageNum += 1;
					if (!isNextPage && type == 4 && this.shopGroup[shopGroupIndex]._groupIdIndex < (groupId.length - 1)) {
						// 无下一页
						this.shopGroup[shopGroupIndex]._groupIdIndex += 1;
						this.mescroll.endSuccess(total_count, true);
						pageNum = 1;
					} else if (!isNextPage && (shopGroupIndex < (this.shopGroup.length - 1))) {
						shopGroupIndex += 1;
						pageNum = 1;
						this.mescroll.endSuccess(total_count, true);
						this.mescroll.triggerUpScroll();
					} else {
						if(!list.length) {
							if(this.shopGroup[shopGroupIndex]._listLength0 >= 2) {
								shopGroupIndex += 1;
								pageNum = 1;
							}
							this.shopGroup[shopGroupIndex]._listLength0 +=1;
						} else {
							this.shopGroup[shopGroupIndex]._listLength0 = 0;
						}
						this.mescroll.endSuccess(list.length || total_count, isNextPage);
					}
					goods = goods.concat(list); // 追加新数据
					this.tabsList[this.tabIndex] = {
						...currentItem,
						goods,
						shopGroupIndex,
						pageNum
					};
					if(list.length <= 6) {
						if(this.shopGroup[shopGroupIndex]._listLength6 >= 3) {
							return;
						}
						this.shopGroup[shopGroupIndex]._listLength6 +=1;
					} else {
						this.shopGroup[shopGroupIndex]._listLength6 = 0;
					}
					if (list.length <= 6 && isNextPage) {
						this.mescroll.triggerUpScroll();
					}
				}).catch(() => this.mescroll.endErr());
			},
			setTimeInit() {
				this.clearTimeInit()
				if (this.enterPageStatus >= 6) return;
				this.initTimer = setInterval(async () => {
					await this.initEnterPage(this.is_close);
				}, 1000 * 30);
			},
			clearTimeInit() {
				if (this.initTimer) {
					clearInterval(this.initTimer);
					this.initTimer = null;
				}
			},
			freeAccelerateDomRefHandle(event) {
				if (!event) return;
				this.freeAccelerateDomRefHeight = event.height;
			},
			freeTopDomRefHandle(event) {
				if (!event) return;
				this.freeTopDomRefHeight = event.height;
			},
			airSubTabRefHandle(event) {
				if (!event) return;
				this.airSubTabRefHeight = event.height;
			},
			// 领现金
			openFirstRefHandle(event) {
				if (!event) return;
				this.openFirstRefHeight = event.height;
			},
			cashFinishDom45RefHandle(event) {
				if (!event) return;
				this.cashFinishDom45RefHeight = event.height;
			},
			cashFinishDom6RefHandle(event) {
				if (!event) return;
				this.cashFinishDom6RefHeight = event.height;
			},
			cashFinishDom7RefHandle(event) {
				if (!event) return;
				this.cashFinishDom7RefHeight = event.height;
			},
			freeFinishDom45RefHandle(event) {
				if (!event) return;
				this.freeFinishDom45RefHeight = event.height;
			},
			// activityStatusDomRefHandle(event) {
			// 	if (!event) return;
			// 	this.activityStatusDomHeight = event.height;
			// },
			// 轮播菜单
			swiperChange(event) {
				this.tabIndex = event.detail.current;
			},
			async closeFirstRedOpenDia3Handle(isCloseClick) {
				this.downCallback();
				if (isCloseClick) return; // 关闭弹窗的事件不做处理
				this.goToBuyHandle(2000);
			},
			async closeFirstFinishDia5Handle() {
				await this.initEnterPage();
			},
			onPageScroll(event) {
				const scrollTop = Math.ceil(event.scrollTop);
				this.isShowActive = scrollTop >= Math.floor(this.scrollFixValue);
				this.isShowScrollTitle = scrollTop >= Math.floor(this.airSubTabRefHeight);
				this.isShowNavBerColor = (scrollTop >= this.navHeight);
			},
			goToBuyHandle(setTime = 100) {
				setTimeout(() => {
					this.mescroll.scrollTo(this.scrollFixValue); // 滚动到tab的吸顶的效果
				}, setTime);
			},
			callBackHandle() {
				// 领现金的返回拦截
				if(this.subIndex) {
					const currentDate = new Date();
					let cur_date = parseTime(currentDate, "{y}/{m}/{d}");
					const showBackFirstStorageDay = getStorage(this.backFirstStorageKey);
					const showBackSecondStorageDay = getStorage(this.backSecondStorageKey);
					if([1, 2].includes(this.enterPageStatus) && (!showBackFirstStorageDay || showBackFirstStorageDay != cur_date )) {
						this.isShowBackFirstDia = true;
						setStorage(this.backFirstStorageKey, cur_date);
						return;
					}
					if(this.enterPageStatus == 4 && (!showBackSecondStorageDay || showBackSecondStorageDay != cur_date )) {
						this.isShowBackSecondDia = true;
						setStorage(this.backSecondStorageKey, cur_date);
						return;
					}
				}
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url: '/pages/tabBar/shopMall/index'
						});
					}
				});
			},
			buyOpenHandle() {
				this.isShowBackFirstDia = false;
				this.isShowBackSecondDia = false;
				this.goToBuyHandle();
			},
			closeElseDiaHandle() {
				this.isShowBackFirstDia = false;
				this.isShowBackSecondDia = false;
			},
			closeDiaHandle(){
				this.isShowStatusAni = false;
			},
			getAwardHandle() {
				const { active_id, username, mobile, area, address, area_code, residue_day} = this.freeEnterArr;
				if(!residue_day) return;
				this.selItem = {
					id: active_id,
					username,
					mobile,
					area,
					address,
					area_code
				}
				this.isShowSelAddDia = true;
			},
			submitHandle() {
				this.isShowSelAddDia = false;
				setTimeout(() => {
					this.initFreeEnterPage(this.is_close);
				}, 1500);
			}
		},
		onUnload() {
			this.clearTimeInit()
			clearTimeout(this.showRemindTimer);
			this.showRemindTimer = null;
			if (this.enterPageStatus == 3) {
				this.getProfitHandle(true);
				this.initEnterPage();
			}
			if (!this.isMiniProgram) this.setEnterPageStatus(0);
		},
		onHide() {
			this.clearTimeInit()
			// if (!this.isMiniProgram) this.setEnterPageStatus(0);
		}
	}
</script>
<style lang="scss">
	.cash {
		position: relative;
		z-index: 0;
		box-sizing: border-box;
		background: #f7f7f7;
		// padding-bottom: constant(safe-area-inset-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		.nav_bg {
			width: 100%;
			position: absolute;
			z-index: -1;
			margin-top: calc(0px - var(--margin));
		}
	}
	.nav-custom {
		flex: 1;
		.title_rule {
			// flex: 0 0 136rpx;
			box-sizing: border-box;
			// width: 136rpx;
			height: 64rpx;
			line-height: 64rpx;
			background: rgba(255, 255, 255, 0.22);
			border-radius: 32rpx;
			font-size: 28rpx;
			text-align: center;
			color: #ffffff;
			.title_rule-item{
				padding: 0 26rpx;
				position: relative;
				&:not(:last-child)::before {
					content: '\3000';
					width: 2rpx;
					height: 28rpx;
					background: #ffffff;
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}

		.custom_left {
			position: relative;
			display: flex;
			align-items: center;
			&::before {
				content: '\3000';
				background: url("https://file.y1b.cn/store/1-0/24123/65af12e4a98e3.png") 0 0 / cover;
				display: block;
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
			.custom_left-txt {
				width: 128rpx;
				height: 34rpx;
				transition: all .3s;
				opacity: 1;
				&.active {
					opacity: 0;
				}
			}
		}
	}

	.active_top {
		position: fixed;
		z-index: 1;
		width: 100%;
		background: #f7f7f7;
		opacity: 0;
		transition: all 2s;
		&::before {
			content: '\3000';
			background: url("https://file.y1b.cn/store/1-0/24123/65af121b60f5f.png") 0 0 / cover;
			position: absolute;
			left: 0;
			top: calc(0px - var(--top));
			width: 750rpx;
			height: 402rpx;
			z-index: -1;
		}

		&.active {
			opacity: 1;
		}
	}

	.tabs_box {
		z-index: 9;
		position: sticky;
		// overflow: hidden;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0 0;
	}

	.tab_box {
		position: relative;
		z-index: 0;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
	}

	.good_list-box {
		position: relative;
		z-index: 0;
		min-height: var(--minheight);

		&::before {
			content: '\3000';
			position: absolute;
			top: 0;
			left: 0;
			width: 750rpx;
			height: 1016rpx;
			background: linear-gradient(180deg, #ffffff 6%, rgba(247, 247, 247, 0.00) 23%);
			z-index: -1;
		}
	}

	.cont_list {
		width: 100%;
		position: relative;
	}
	.remind {
		width: 100%;
		background: rgba(255,255,255,0.60);
		font-size: 28rpx;
		color: #333;
		line-height: 40rpx;
		height: 0;
		overflow: hidden;
		transition: all .5s;
		&::before {
			content: '\3000';
			width: 34rpx;
			height: 28rpx;
			display: block;
			background: url("https://test-file.y1b.cn/store/1-0/24219/65d30db97975e.png") 0 0 / cover;
			margin: 0 12rpx 0 32rpx;
		}
		&.show_height {
			height: 64rpx;
		}
		&.hide_height {
			height: 0;
		}
	}
.order_title {
	text-align: center;
	padding: 32rpx 0;
	color: #333;
	font-size: 32rpx;
	color: #9d4218;
	line-height: 44rpx;
}
</style>
