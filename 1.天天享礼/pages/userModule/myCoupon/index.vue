<template>
	<view class="my-coupon">
		<!-- 专属优惠券 -->
		<xh-navbar
			title="专属优惠券"
			titleColor="#333"
			:leftImage="imgUrl+'/static/images/left_back.png'"
			@leftCallBack="$leftBack"
			navberColor="#F7F7F7"
            :fixedNum="9"
		></xh-navbar>
		<view class="my-coupon-box"
            :style="{ top: navHeight +'px'}">
			<mescroll-uni
				:fixed="false"
				ref="mescrollRef"
				@init="mescrollInit"
				@down="downCallback"
				@up="upCallback"
				:up="upOption"
			>
				<!-- 数据列表 -->
				<view class="list-item" @click="toUseHandle(item)"
					v-for="item in listData" :key="item.id"
				>
					<!-- 背景 -->
					<image class="list-item-bg" v-if="item.status == 2"
						src="https://file.y1b.cn/store/1-0/23713/64afe7c401657.png"
					></image>
					<image class="list-item-bg" v-else
						src="https://file.y1b.cn/store/1-0/23713/64afe7a5d374e.png"
					></image>
					<!-- 优惠券名称 -->
					<view class="list-item-left">
						<view>
							<view class="list-item-name maxTwoLine">
								{{item.title}}
							</view>
							<view class="list-item-name-tips"></view>
						</view>
						<!-- 倒计时 -->
						<view class="count-down" v-if="item.timeType === 1">
							<van-count-down :time="item.difference" format="剩余HH:mm:ss" />
						</view>
						<!-- 明天过期 -->
						<view class="tomorrow" v-else-if="item.timeType === 2">
							明天过期
						</view>
						<!-- 有效期 -->
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
						<view class="lit-btn" v-if="item.status == 0 || item.status == 1">
							去使用
						</view>
						<view class="lit-btn active_btn" v-else>
							使用中
						</view>
					</view>
				</view>
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
		<!-- 查看历史记录 -->
		<view class="look-history" @click="lookHistory">
			查看历史记录
			<van-icon name="arrow" />
			<view class="van-submit-bar__safe"></view>
		</view>
		<service-recharge ref="serviceRecharge" />
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
import exchangeFailed from '@/components/serviceCredits/exchangeFailed.vue';
import serviceCredits from '@/components/serviceCredits/index.vue';
import serviceCreditsFun from '@/components/serviceCredits/serviceCreditsFun.js';
import getViewPort from "@/utils/getViewPort.js";
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
                navHeight: 0
			}
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
			goodListClickHandle() {
				this.isGoodListTo = true;
			},
			upCallback(page) {
				//当前时间
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
						//过期时间
						let expirationTime = new Date(item.expire_time.replace(/\-/g, '/')).getTime()
						let expirationDay = item.expire_time.slice(0, 10)
						//剩余时间 毫秒
						let difference = expirationTime - currTime;
						//是否在今天
						let isToday = parseTime(currTime, '{y}-{m}-{d}') === expirationDay
						//类型
						let timeType = 0
						//小于一天倒计时
						if (difference > 0 && difference < 24 * 60 * 60 * 1000 && isToday) {
							timeType = 1
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
					if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
					this.listData = this.listData.concat(list); //追加新数据
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
			lookHistory() {
                this.$go('/pages/userInfo/myCouponHistory/index');
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
						// 商品券
						if(is_order && order_id) return this.$go(`/pages/userModule/order/payDetail?id=${order_id}&alertUsed=${this.alertUsed}`);
						this.$refs.serviceRecharge.popupShow(id, this.alertUsed);
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
								complete(res) {
									console.log(res)
								}
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
	.my-coupon {
		.my-coupon-box {
			position: fixed;
			top: 184rpx;
			bottom: 120rpx;
			left: 0;
			width: 100%;
			height: auto;
		}

		.list-item {
			width: 706rpx;
			height: 211rpx;
			box-sizing: border-box;
			margin: 0 auto 22rpx;
			position: relative;
			padding: 36rpx 36rpx 24rpx 36rpx;
			display: flex;
			justify-content: space-between;
		}

		.list-item-bg {
			width: 706rpx;
			height: 211rpx;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			border-radius: 25rpx;
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
			color: #333333;
			position: relative;
			// &::after{
			// 	content: '';
			// 	position: absolute;
			// 	width: 24rpx;
			// 	height: 2rpx;
			// 	background-color: #ef2b20;
			// 	border-radius: 2px;
			// 	left: 0;
			// 	bottom: 0rpx;
			// }
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
			// width: 152rpx;
			// position: absolute;
			// right: 32rpx;
			// bottom: 23.5rpx;
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
		}

		.van-count-down {
			font-size: 24rpx;
			font-family: PingFang SC, PingFang SC-5;
			font-weight: 400;
			color: #f2554d;
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
	}
</style>
