<template>
<view class="my-coupon">
	<xh-navbar
		title="专属卡券" titleColor="#333"
		:leftImage="imgUrl+'/static/images/left_back.png'"
		navberColor="#F7F7F7" :fixedNum="9"
		@leftCallBack="$leftBack"
	></xh-navbar>
	<view class="my-coupon-box" :style="{ top: navHeight +'px'}">
		<mescroll-uni
			:fixed="false"
			ref="mescrollRef"
			@init="mescrollInit"
			@down="downCallback"
			@up="upCallback"
			:up="upOption">
			<!-- 数据列表 -->
			<block v-for="item in listData" :key="item.id">
				<view class="mc_list" v-if="item.is_vip == 2">
					<view class="mc_list-cont fl_al_start" @click="goToOrderDetail(item.ticket_id)">
						<view class="com_img fl_center">
							<image class="widHei" :src="item.image" mode="aspectFit"></image>
						</view>
						<view class="list_txt fl_col_sp_bt">
							<view class="item_title maxTwoLine">{{item.title}}</view>
							<view class="item_lab">{{ item.expire_time }}</view>
						</view>
						<view class="list_right fl_col_sp_bt">
							<view class="list_right-free">免费</view>
							<view>购买详情<van-icon name="arrow"/></view>
						</view>
					</view>
					<view class="mc_store">
						<view class="intro-title fl_bet" v-if="!restaurantStore" @click="goSelectShopHandle(item)">
							当前城市未找到门店
							<view style="color: #666">切换
								<van-icon name="arrow" custom-style="font-weight: 600;" size="26rpx"/>
							</view>
						</view>
						<block v-else>
							<view class="store_add fl_bet">
								<view class="store_add-left txt_ov_ell1">{{restaurantStore.restaurant_name}}</view>
								<view class="store_add-right box_fl">距您{{restaurantStore.distance}}</view>
							</view>
							<view class="store_add-btn" @click="useMcHandle(item)">去当前门店使用</view>
						</block>
					</view>
				</view>

				<view class="list-item" v-else @click="toUseHandle(item)">
					<image class="list-item-bg"
						:src="item.status == 2 ? use_bg : useIng_bg"></image>
					<!-- 优惠券名称 -->
					<view class="list-item-left">
						<view>
							<view class="list-item-name maxTwoLine">{{item.title}}</view>
							<view class="list-item-name-tips"></view>
						</view>
						<view class="count-down" v-if="item.timeType === 1">
							<van-count-down :time="item.difference" format="剩余HH:mm:ss" />
						</view>
						<view class="tomorrow" v-else-if="item.timeType === 2"> 明天过期 </view>
						<view class="valid-time" v-else-if="item.timeType === 3">
							<text class="valid-time-label">有效期至：</text>
							<text>{{item.expirationDay}}</text>
						</view>
						<view class="count-down" v-else-if="item.timeType === 4">
							<view class="count-down-text">剩余00:00:00</view>
						</view>
					</view>
					<!-- 价值 -->
					<view class="list-item-tools">
						<view class="list-item-price">
							<text class="lip-unit">￥</text>
							<text>{{Number(item.face_value)}}</text>
						</view>
						<view class="lit-btn" v-if="[0, 1].includes(item.status)">去使用</view>
						<view class="lit-btn active_btn" v-else>使用中</view>
					</view>
				</view>
			</block>

			<!-- 列表为空时呈现 -->
			<view class="empty_box fl_col_cen" v-if="isEmpty">
				<image class="empty_box_img" :src="empty.icon" mode="widthFix"></image>
				<view>{{ empty.tip }}</view>
			</view>
			<view class="you_like-title" id="stickyTitleId" v-if="goods.length">
				<image class="left-icon" :src="imgUrl +'static/shopMall/love_left_icon.png'" mode="aspectFill"></image>
				猜你喜欢
				<image class="right-icon" :src="imgUrl + 'static/shopMall/love_right_icon.png'" mode="aspectFill"></image>
			</view>
			<good-list
				:list="goods"
				:isBolCredits="true"
				:isJdLink="true"
				@goodListClick="goodListClickHandle"
				@notEnoughCredits="notEnoughCreditsHandle"
			></good-list>
		</mescroll-uni>
	</view>
	<service-recharge ref="serviceRecharge" @close="closeServiceHandle" />
	<!-- 牛金豆不足的情况 -->
	<exchangeFailed
		:isShow="exchangeFailedShow"
		@goTask="goTaskHandle"
		@close="exchangeFailedShow=false"
	></exchangeFailed>
	<!-- 赚取牛金豆 -->
	<serviceCredits
		ref="serviceCredits"
		:isShow="serviceCreditsShow"
		@showAdPlay="showAdPlayHandle"
		@close="closeHandle"
	></serviceCredits>
	<privacyOpen ref="privacyOpen"></privacyOpen>
</view>
</template>
<script>
import { myCoupon } from '@/api/modules/user.js';
import goodList from '@/components/goodList.vue';
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
import { getImgUrl } from '@/utils/auth.js';
import { parseTime } from '@/utils/index.js';
import serviceRecharge from './serviceRecharge.vue';
// 牛金豆不足混入的组件与方法
import { groupRecommend } from '@/api/modules/index.js';
import { goodsQuery, jingfen, material } from '@/api/modules/jsShop.js';
import {
location,
restaurantQuery
} from '@/api/modules/takeawayMenu/luckin.js';
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import getViewPort from "@/utils/getViewPort.js";
import { mapGetters, mapMutations } from "vuex";
	export default {
		mixins: [MescrollMixin, serviceCreditsFun],
		components: {
			serviceRecharge,
			exchangeFailed,
			serviceCredits,
			goodList
		},
		data() {
			return {
				imgUrl: getImgUrl(),
				listData: [],
				isEmpty: false,
				empty: {
					tip: '暂无可使用优惠券~', // 提示
					icon: `${getImgUrl()}/static/images/img_no_data.png`
				},
				upOption: {
					auto: false,
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 1 // 每页数据的数量
					},
					noMoreSize: 10000,
					empty: {
						use: false,
					}
				},
				applyCouponId: 0,
				alertUsed: 0,
				groupRecommendData: null,
				isRecommendRequest: false,
				goods: [],
				pageNum: 1,
				groupId_index: 0,
				isGoodListTo: false,
				lastOddItem: null,
                navHeight: 0,
				use_bg: 'https://file.y1b.cn/store/1-0/23713/64afe7c401657.png',
				useIng_bg: 'https://file.y1b.cn/store/1-0/23713/64afe7a5d374e.png',
				restaurantStore: null,
				lng: 0,
				lat: 0,
				location_province: '',
				location_city: '',
			}
		},
		computed: {
            ...mapGetters(['province_name', 'city_name', 'restaurant_id']),
		},
		watch: {
			goods(newValue) {
				if(newValue.length <=4) {
					this.mescroll.triggerUpScroll();
				}
			}
		},
		onShow() {
			if (this.listData.length && !this.isGoodListTo) {
				let mescrollRef = this.$refs.mescrollRef;
				this.isRecommendRequest = false;
				this.pageNum = 1;
				this.groupId_index = 0;
				mescrollRef.mescroll.resetUpScroll();
				this.mescroll.scrollTo(0,0);
			}
			this.isGoodListTo = false;
		},
		onLoad(option) {
			if(option && option.applyCouponId){
				this.applyCouponId = option.applyCouponId;
			}
			if(option.alertUsed){
				this.alertUsed = option.alertUsed;
			}
            let viewPort = getViewPort();
            this.navHeight = viewPort.navHeight
		},

		methods: {
			...mapMutations({
				setBrandId: 'cart/setBrandId',
				setCityName: 'cart/setCityName',
            }),
			closeServiceHandle() {
				let mescrollRef = this.$refs.mescrollRef;
				this.isRecommendRequest = false;
				this.pageNum = 1;
				this.groupId_index = 0;
				mescrollRef.mescroll.resetUpScroll();
				this.mescroll.scrollTo(0,0);
			},
			goodListClickHandle() {
				this.isGoodListTo = true;
			},
			useMcHandle(item) {
				const { goods_id, ticket_id } = item;
				this.$go(`/pages/userModule/takeawayMenu/mcDonald/index?brand_id=5&rote=1&isBack=1&product_id=${goods_id || 0}&ticket_id=${ticket_id}`);
			},
			goSelectShopHandle(item) {
				const { goods_id, ticket_id } = item;
				this.$go(`/pages/userModule/takeawayMenu/mcDonald/selectShop/index?product_id=${goods_id || 0}&ticket_id=${ticket_id}`);
			},
			goToOrderDetail(id) {
				if(!id) return;
				this.$go(`/pages/userModule/order/detail?id=${id}`);
			},
			upCallback(page) {
				// 当前时间
				let currTime = new Date().getTime()
				let params = {
					size: 10,
					page: page.num,
				}
				// 是否请求推荐列表，我的收藏列表请求完毕后进行其他接的请求事件
				if(this.isRecommendRequest) return this.requestRem(page);
				myCoupon(params).then(res => {
					let list = res.data ? res.data.data : []
					list = list.map(function(item) {
						// 过期时间
						let expirationTime = new Date(item.expire_time.replace(/\-/g, '/')).getTime();
						let expirationDay = item.expire_time.slice(0, 10);
						// 剩余时间 毫秒
						let difference = expirationTime - currTime;
						// 是否在今天
						let isToday = parseTime(currTime, '{y}-{m}-{d}') === expirationDay
						// 类型
						let timeType = 0
						// 小于一天倒计时
						if (difference > 0 && difference < 24 * 60 * 60 * 1000 && isToday) {
							timeType = 1;
						} else if (difference > 0 && difference <= 24 * 60 * 60 * 1000) {
							timeType = 2
						}else {
							timeType = 3
						}
						// 倒计时结束，但是优惠券正在使用
						if(difference <= 0 && item.is_order) {
							timeType = 4;
						}
						return {
							...item,
							timeType,
							difference,
							expirationDay
						}
					});
					//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
					this.mescroll.endSuccess(params.size, true);
					//设置列表数据
					if (page.num == 1) this.listData = []; // 如果是第一页需手动制空列表
					this.listData = this.listData.concat(list); //追加新数据
					// 获取当前定位的地址
					if ((page.num == 1) && this.listData.length) {
						const isVip = this.listData.findIndex(item => (item.is_vip == 2) || item.type == 12);
						if(isVip>= 0 && !this.restaurantStore) this.initLocation();
					}
					if(!this.listData.length) this.isEmpty = true;
					// 加载另一个
					if(list.length < params.size) {
						this.isRecommendRequest = true;
						this.requestRem(page);
						return;
					}
					// 抽奖直接跳转过——展示优惠券弹窗
					if(this.applyCouponId) {
						const newArr = this.listData.filter(item => item.id == this.applyCouponId);
						this.applyCouponId = null;
						newArr[0] && this.toUseHandle(newArr[0]);
					}
				}).catch(err =>  this.mescroll.endErr());
			},
			async initLocation() {
				this.setBrandId(5);
				const locRes = await getUserLocation(false, false);
				if(!locRes) return;
				this.lng = locRes.data.longitude;
				this.lat = locRes.data.latitude;
				let lng = this.lng;
				let lat = this.lat;
				if(!this.location_province || !this.location_city) {
					const resInfo = await location({ lng, lat });
					if(resInfo.code != 1) return;
					const { cityInfo } = resInfo.data;
					this.location_city = cityInfo.city;
					this.location_province = cityInfo.province;
				}
				this.setCityName(this.location_city);
				const params = {
					brand_id: 5,
					lng,
					lat,
					restaurant_id: this.restaurant_id,
					province_name: this.province_name || this.location_province,
					city_name: this.location_city,
					rote: 1,
					location_city: this.location_city,
				};
				const res = await restaurantQuery(params);
				if(res.code != 1 || res.data.upgrade) return;
				this.restaurantStore = res.data;
			},
			async requestRem(page) {
				if(!this.groupRecommendData) {
					const recRes = await groupRecommend({ page: 6 });
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
				}).catch(()=>this.mescroll.endErr());
			},
			// 牛金豆不足的情况
			notEnoughCreditsHandle() {
				this.exchangeFailedShow = true;
			},
			toUseHandle(data) {
				this.$wxReportEvent('immediateuse');
				let {
					id,
					type,
					is_main,
					article_url,
					main_url,
					video_account_id,
					video_id,
					type_id,
					type_sid,
					order_id,
					is_order,
					coupon_id,
					open_mini_type,
					qz_url
				} = data;
				switch (type) {
					case 1:
					case 12:
						// 商品券
						if(is_order && order_id) return this.$go(`/pages/userModule/order/detail?id=${order_id}&alertUsed=${this.alertUsed}`);
						this.$refs.serviceRecharge.popupShow(id, this.alertUsed, type);
						break;
					case 2:
						// 公众号
						let link = is_main === 1 ? article_url : main_url;
						this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`)
						break;
					case 3:
						// 视频号
						if (wx.openChannelsActivity) {
							wx.openChannelsActivity({
								finderUserName: video_id,
								feedId: video_account_id,
							})
						} else {
							wx.showModal({
								icon: 'none',
								title: '当前微信版本过低',
								content: '升级后再使用,微信版本要求>=8.0.10'
							})
						}
						break;
					case 4:
						// 小程序
						let openMiniProgram = wx.navigateToMiniProgram;
						if(open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
							openMiniProgram =  wx.openEmbeddedMiniProgram;
						}
						openMiniProgram({
							appId: type_id,
							path: type_sid,
							// envVersion: 'trial',
							success(res) {
								// 打开成功
							}
						});
						break;
					case 6:
						// 小程序内页
						this.$go(`/pages/shopMallModule/couponDetails/index?id=${coupon_id}`);
						break;
					case 11:
						// 移动积分商品的跳转
						this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}`)
						break;
				}
			}
		}
	};
</script>
<style lang="scss">
page {
	background-color: #f7f7f7;
	font-family: PingFang SC, PingFang SC-5;
}
.my-coupon-box {
	position: fixed;
	top: 184rpx;
	bottom: 120rpx;
	left: 0;
	width: 100%;
	height: auto;
}
.list-item {
	box-sizing: border-box;
	margin: 0 24rpx 22rpx;
	position: relative;
	padding: 36rpx 36rpx 24rpx 36rpx;
	display: flex;
	justify-content: space-between;
}

.list-item-bg {
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
	border-radius: 25rpx;
	width: 100%;
	height: 100%;
}

.list-item-left {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.list-item-name {
	width: calc(100vw - 320rpx);
	font-size: 30rpx;
	font-weight: 400;
	color: #333;
	position: relative;
}

.list-item-name-tips {
	width: 24rpx;
	height: 2rpx;
	background-color: #ef2b20;
	border-radius: 2px;
	margin-top: 10rpx;
}

.valid-time {
	font-size: 24rpx;
	font-weight: 400;
	color: #999999;
}

.list-item-tools {
	text-align: center;
}

.list-item-price {
	font-size: 56rpx;
	font-family: Barlow, Barlow-6;
	font-weight: 500;
	color: #ef2b20;
	margin-bottom: 16rpx;
}

.lip-unit {
	font-size: 30rpx;
	margin-right: -5rpx;
}

.lit-btn {
	height: 52rpx;
	padding: 0 37rpx;
	border-radius: 26rpx;
	font-size: 26rpx;
	font-weight: 500;
	color: #f04037;
	line-height: 48rpx;
	border: 2rpx solid #f04037;
	box-sizing: border-box;
	&.active_btn {
		border-color: transparent;
		background: linear-gradient(135deg,#f96a02, #f04037);
		color: #fff;
		box-shadow: none;
	}
}

.tomorrow,
.count-down {
	font-size: 24rpx;
	font-family: PingFang SC, PingFang SC-5;
	font-weight: 400;
	color: #f2554d;
	display: flex;
	align-items: center;
	line-height: 1;
	.van-count-down {
		font-size: 24rpx;
		font-family: PingFang SC, PingFang SC-5;
		font-weight: 400;
		color: #f2554d;
	}
}

.look-history {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	font-size: 26rpx;
	font-family: PingFang SC, PingFang SC-5;
	font-weight: 400;
	text-align: center;
	color: #999999;
	padding-top: 30rpx;
}

.van-submit-bar__safe {
	padding-bottom: 30rpx;
	height: constant(safe-area-inset-bottom);
	height: env(safe-area-inset-bottom);
	box-sizing: border-box;
}

.maxTwoLine {
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	line-clamp: 2;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.mc_list {
	box-sizing: border-box;
	margin: 0 24rpx 22rpx;
	position: relative;
	background: #fffbf9;
	border: 2rpx solid rgba(247,215,206,0.60);
	border-radius: 24rpx;
	// overflow: hidden;
	// box-shadow: ;
	// box-shadow: 10px 10px 5px #888888;
	z-index: 0;
	&::before {
		content: '\3000';
        width: 30rpx;
        height: 17rpx;
        background:  #f7f7f7;
		border: 2rpx solid rgba(247,215,206,0.60);
        position: absolute;
        top: -2rpx;
        right: 201rpx;
        border-radius: 0 0 15rpx 15rpx;
		border-top: none;
	}
	&::after {
		content: '\3000';
        width: 30rpx;
        height: 17rpx;
        background:  #f7f7f7;
		border: 2rpx solid rgba(247,215,206,0.60);
        position: absolute;
        bottom: -2rpx;
        right: 201rpx;
        border-radius: 15rpx 15rpx 0 0;
		border-bottom: none;
	}
}
.mc_list-cont {
	padding: 32rpx 24rpx;
	position: relative;
	z-index: 0;
	&::before {
		content: '\3000';
		background: url("https://test-file.y1b.cn/store/1-0/24410/66165e5e5e581.png") 0 0 / cover;
		position: absolute;
		left: 0;
		top: 0;
		width: 176rpx;
		height: 40rpx;
		z-index: 1;
	}
	&::after {
		content: '\3000';
		background: url("https://test-file.y1b.cn/store/1-0/24410/66165eb050e90.png") 0 0 / cover;
		position: absolute;
		left: 0;
		bottom: 0;
		width: 662rpx;
		height: 84rpx;
		z-index: -1;
	}
	.com_img {
		width: 144rpx;
		height: 144rpx;
		margin-right: 16rpx;
		background: #ffba00;
		border-radius: 12rpx;
	}
	.list_txt {
		flex: 1;
		align-self: stretch;
		.item_title {
			font-weight: 600;
			color: #333;
			font-size: 30rpx;
			line-height: 42rpx;
		}
		.item_lab {
			font-size: 26rpx;
			color: #f84842;
			line-height: 36rpx;
			&::after {
				content: '前使用';
				margin-left: 8rpx;
				color: #666;
			}
		}
	}
	.list_right {
		align-self: stretch;
		font-size: 24rpx;
		text-align: center;
		color: #999;
		line-height: 34rpx;
		.list_right-free {
			font-size: 36rpx;
			font-weight: bold;
			color: #ef2b20;
			line-height: 50rpx;
		}
	}
}
.mc_store {
	padding: 20rpx;
	background: #fff;
	border: 1rpx solid #f1f1f1;
	border-radius: 16rpx;
	margin: 0 24rpx 24rpx;
	.intro-title {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		line-height: 42rpx;
	}
}
.store_add {
	font-size: 28rpx;
	.store_add-left {
		position: relative;
		padding-right: 56rpx;
		margin-right: 10rpx;
		line-height: 40rpx;
		&::after {
			content: '最近';
			position: absolute;
			right: 0;
			font-size: 24rpx;
			color: #f97f02;
		}
	}
	.store_add-right {
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		&::before {
			content: '\3000';
			width: 26rpx;
			height: 26rpx;
			background: url("https://test-file.y1b.cn/store/1-0/2447/66123c68ccd59.png") 0 0 / cover;
			margin-right: 8rpx;
		}
	}
}
.store_add-btn {
	line-height: 80rpx;
	background: #f84842;
	border-radius: 16rpx;
	font-size: 28rpx;
	font-weight: bold;
	text-align: center;
	color: #fff;
	margin-top: 26rpx;
}
</style>
