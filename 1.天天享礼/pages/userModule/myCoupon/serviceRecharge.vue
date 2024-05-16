
<template>
<view>
<van-popup
	:show="show"
	position="bottom"
	custom-style="overflow: inherit;background: transparent;height:100%"
	round
	safe-area-inset-bottom
	@close="popupClose"
>
<view class="cont_box">
	<view class="cont_top" @click="popupClose">
		<xh-navbar :fixed="false"></xh-navbar>
		<block v-if="!isMcDonaldType">
			<view class="service_title">
				<image class="service_title-icon" :src="subImgUrl + (couponInfo.goods_type ? '/ser_box_icon1.png' : '/ser_box_icon0.png')"
					mode="aspectFit"></image>
				{{ couponInfo.goods_type ? '下单即用 放心购' : '下单充值 秒到账' }}
			</view>
			<view class="close_box">
				<image class="close_box-icon" :src="subImgUrl +'/close.png'" mode="aspectFit" @click="popupClose"></image>
			</view>
		</block>
		<image class="close_icon" mode="aspectFit" v-else
			src="https://file.y1b.cn/store/1-0/23118/654b29f0188a0.png" @click="popupClose"></image>
	</view>
	<view class="service mcdonald" v-if="isMcDonaldType">
		<view class="mc_top box_fl">
			<view class="mc_top-left box_fl">
				<image class="mc_top-img" :src="couponInfo.image" mode="aspectFit"></image>
			</view>
			<view class="mc_top-right">
				<view class="box_fl_end">
					<view v-html="formatPrice(couponInfo.goods_market_price, 3)" style="color: #F84842;"></view>
					<view class="old_price">￥{{ couponInfo.goods_line_price && couponInfo.goods_line_price.toFixed(2) }}</view>
				</view>
				<view class="exclusive_price">专属优惠
					<text class="exclusive_price-value">{{ couponInfo.coupon_face_value }}</text>
				</view>
			</view>
		</view>
		<view class="mc_cont">
			<view class="mc_cont-title">{{ couponInfo.coupon_title }}</view>
			<view class="mc_dot"></view>
			<view class="mc_line fl_bet">
				<view class="mc_line-item">
					<image class="line_item-con" src="https://test-file.y1b.cn/store/1-0/2447/661218d652750.png" mode="aspectFill"></image>
					<view>线上购买</view>
				</view>
				<image class="line_item-lab" src="https://file.y1b.cn/store/1-0/24415/661c8cc139e2b.png" mode="aspectFill"></image>
				<view class="mc_line-item">
					<image class="line_item-con" src="https://test-file.y1b.cn/store/1-0/2447/661231666e8ca.png" mode="aspectFill"></image>
					<view>用券点餐</view>
				</view>
				<image class="line_item-lab" src="https://file.y1b.cn/store/1-0/24415/661c8cc139e2b.png" mode="aspectFill"></image>
				<view class="mc_line-item">
					<image class="line_item-con" src="https://test-file.y1b.cn/store/1-0/2447/6612319b74ac3.png" mode="aspectFill"></image>
					<view>门店取餐</view>
				</view>
			</view>
			<view class="mc_lab fl_bet" @click="isShowServiceInformDia = true">
				先囤后用 · 随时退 · 过期自动退
				<van-icon name="arrow" custom-style="font-weight: 600;" size="26rpx"/>
			</view>
		</view>
		<view class="mc_cont-box" @click="goSelectShopHandle">
			<view class="intro-title fl_bet" v-if="!restaurantStore">
				当前城市未找到门店
				<view style="color: #666">切换
					<van-icon name="arrow" custom-style="font-weight: 600;" size="26rpx" color='#666'/>
				</view>
			</view>
			<block v-else>
				<view class="mc_store-title fl_bet">
					全城适用门店
					<van-icon name="arrow" custom-style="font-weight: 600;" size="26rpx" color='#666'/>
				</view>
				<view class="store_add fl_bet">
					<view class="store_add-left txt_ov_ell1">{{ restaurantStore.restaurant_name }}</view>
					<view class="store_add-right box_fl">距您{{ restaurantStore.distance }}</view>
				</view>
				<view class="store_add-txt">
					{{ restaurantStore.restaurant_address }}
				</view>
			</block>
		</view>
		<view class="mc_cont-box explain" v-if="goodsIntro">
			<u-parse :content="goodsIntro"></u-parse>
		</view>
	</view>

	<view class="service"  v-else>
		<view class="ser_box ser_box_top">
			<image class="shop_bg" :src="subImgUrl +'/shop_bg.png'" mode="aspectFit"></image>
			<image class="shop_img" :src="couponInfo.image" mode="aspectFit"></image>
			<view class="shop_title">
				<view class="shop_title-text">{{couponInfo.goods_name}}</view>
				<view class="shop_title-label">已使用最大优惠</view>
			</view>
			<view class="shop_price">
				<view v-html="formatPrice(couponInfo.goods_market_price, 2)"></view>
				<image class="shop_gf" :src="subImgUrl +'/gf_icon.png'" mode="aspectFit"></image>
			</view>
		</view>
			<view class="ser_box">
				<block v-if="couponInfo.goods_type == 0">
					<view class="recharge-account">
						<text>充值账号</text>
						<text class="icon-star">*</text>
					</view>
					<view class="input-box">
						<input
							class="input-account"
							v-model="account"
							type="number"
							:maxlength='cz_type == 1 ? 11 : -1'
							placeholder-class="place-holder"
							:placeholder="placeholderString"
						/>
					</view>
				</block>
                <!-- <view class="discount_item fl_bet" v-if="couponInfo.zero_credits">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl +'/card_icon5.png'" mode="aspectFill"></image>
                        <view>0豆特权</view>
                    </view>
                    <view class="dis_noPrice">免{{couponInfo.credits}}牛金豆</view>
                </view> -->
                <view class="discount_item fl_bet">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl +'/card_icon6.png'" mode="aspectFill"></image>
                        <view>专属优惠</view>
                    </view>
                    <view class="dis_price">
                        <text style="font-size: 24rpx">- ¥</text> {{couponInfo.coupon_face_value}}
                    </view>
                </view>
                <block v-if="isSelNewPacket && !userInfo.is_vip ">
                    <view class="discount_item fl_bet">
                        <view class="fl_center">
                            <image class="dis_icon" :src="cardImgUrl +'/card_icon1.png'" mode="aspectFill"></image>
                            <view>开通省钱卡</view>
                        </view>
                        <view class="dis_price" style="color: #333;">
                            <text style="font-size: 24rpx">¥</text> 3.90
                        </view>
                    </view>
                    <view class="discount_item new_item fl_bet">
                        <view class="fl_center">
                            <image class="dis_icon" :src="cardImgUrl +'/card_icon2.png'" mode="aspectFill"></image>
                            <view>新人开卡立减</view>
                        </view>
                        <view class="dis_price">
                            <text style="font-size: 24rpx">-¥</text> 3
                        </view>
                    </view>
                </block>
                <view class="discount_item fl_bet" @click="goredPayIndexHandle(false)" v-if="couponInfo.saving_money">
                    <view class="fl_center">
                        <image class="dis_icon" :src="cardImgUrl +'/card_icon3.png'" mode="aspectFill"></image>
                        <view>省钱卡红包</view>
                    </view>
                    <view class="dis_price box_fl">
                        <block v-if="isSelRedPacket">
                            <image
                                class="dis_icon" :src="cardImgUrl +'/card_icon4.png'"
                                mode="aspectFill" style="margin-right: 8rpx;"
                            ></image>
                            <text style="font-size: 24rpx; line-height: 34rpx;">-¥</text> {{ couponInfo.saving_money }}
                        </block>
                        <view class="dis_num" v-else>{{couponInfo.packet_num}}张可用</view>
                        <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="26rpx" name="arrow" color="#999"/>
                    </view>
                </view>
				<view class="buy-price">
					<text>已优惠¥</text>
					<text class="icon-star">{{couponFaceValue}}</text>元
					<text class="price_txt">应付</text>
					<view v-html="formatPrice(showAllPrice, 3)"></view>
				</view>
			</view>
			<view class="ser_box active" v-if="goodsIntro">
				<u-parse :content="goodsIntro"></u-parse>
			</view>
			<view class="ser_box" v-if="exchangeRule">
				<!-- 兑换须知 -->
				<view class="intro-title">兑换须知</view>
				<view class="intro-content">
					<u-parse :content="exchangeRule"></u-parse>
				</view>
			</view>
	</view>
	<view class="buy_btn-box">
		<view class="discount_rem" @click="goredPayIndexHandle(true)">
			<image class="discount_rem-icon" :src="subImgUrl +'/zs_plan.png'" mode="aspectFit"></image>
			<image class="discount_rem_bg" :src="subImgUrl + '/discount_rem_bg.png'" mode="aspectFit"></image>
			<text v-if="isMcDonaldType">
                共优惠¥{{couponInfo.coupon_face_value}}
            </text>
            <block v-else-if="!userInfo.is_vip && !isSelNewPacket && couponInfo.saving_money">
                <text>开通省钱卡更划算</text>
                <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="20rpx" name="arrow" color="#F97F02"/>
            </block>
            <block v-else-if="!isSelRedPacket && couponInfo.saving_money">
                <text>用省钱卡红包再省￥{{ couponInfo.saving_money }}</text>
                <van-icon custom-style="font-weight: 600;margin-left: 10rpx" size="20rpx" name="arrow" color="#F97F02"/>
            </block>
            <text v-else>
                已享最大优惠¥{{couponFaceValue}}
            </text>
		</view>
		<view class="buy_mc-btn fl_center" v-if="isMcDonaldType" @click="mcCheckHandle">
			立即支付 <view class="price" v-html="formatPrice(couponInfo.goods_market_price, 3)"></view>
		</view>
		<view class="buy_btn-cont" v-else>
            <view>
                <view class="box_fl">应付：<view class="price" v-html="formatPrice(showAllPrice, 3)"></view></view>
                <view class="buy_btn-lab" v-if="isSelNewPacket && !userInfo.is_vip">含开卡折扣¥0.90</view>
            </view>
			<view class="buy_btn" @click="checkHandle">去支付</view>
		</view>
	</view>
</view>
</van-popup>
<!-- 返回的弹窗 -->
<continueDia
	:isShow="isShowBackDia"
	:faceValue="couponFaceValue"
	:zeroCredits="couponInfo.zero_credits"
	:creditsValue="couponInfo.credits"
	@close="confirmBackHandle"
	@confirm="closeDiaHandle"
></continueDia>
<!--支付拦截 -->
<continue-pay
	:isShow="isShowContinuePay"
	:orderId="order_id"
	:payValue="couponFaceValue"
	:imgArr="couponInfo.imgArr"
	:remindText="couponInfo.text"
	@close="closePayHandle"
	@confirm="continuePayHandle"
	@againCancel="againCancelHandle"
>
</continue-pay>
<!-- 确认手机号 -->
<continuePhoneRegDia
	:isShow="isShowNumDia"
	:accountNum="account"
	@close ="closeDiaHandle"
	@confirm="confirmNumHandle"
></continuePhoneRegDia>
<!-- 手慢 - 商品被抢 -->
<noProductDia
	:isShow="isShowNoProduct"
	@close="closeNoProductHandle"
	:remindText="showNoProductText"
></noProductDia>

<!-- 服务协议 -->
<serviceInformDia
	:isShow="isShowServiceInformDia"
	@close="isShowServiceInformDia = false"
></serviceInformDia>
</view>
</template>

<script>
import { pay, query } from '@/api/modules/order.js';
import { location, restaurantQuery } from '@/api/modules/takeawayMenu/luckin.js';
import { applyCoupon, buy } from '@/api/modules/user.js';
import { formatPrice, getImgUrl } from '@/utils/auth.js';
import { getUserLocation } from '@/utils/getUserLocation.js';
import { checkRichText, escape2Html } from '@/utils/index.js';
import Toast from '@/wxcomponents/vant_update/toast/toast.js';
import { mapGetters, mapMutations } from "vuex";
import continueDia from './continueDia.vue';
import continuePay from './continuePay.vue';
import continuePhoneRegDia from './continuePhoneRegDia.vue';
import noProductDia from './noProductDia.vue';
import serviceInformDia from './serviceInformDia.vue';
let _request = false;
	export default {
		components: {
			continueDia,
			continuePay,
			continuePhoneRegDia,
			noProductDia,
			serviceInformDia
		},
		data(){
			return {
				show: false,
				account: '',
				couponInfo: {
					goods_name: '',
					goods_market_price: 0,
					coupon_face_value: 0,
					goods_type: 0
				},
				paymentParams: null, //支付参数
				source: 0, // 埋点类别的区分
				cz_type: 0, // 充值类型
				order_id: '',
				placeholderString: '请输入充值账号', //输入框的内容
				isShowBackDia: false, // 关闭弹窗时的询问按钮
				isShowContinuePay: false, //
				isShowNumDia: false, // 手机号码的验证
				isShowNoProduct: false ,// 展示手慢 - 没商品的弹窗
				showNoProductText: '',
				navbarSystem: {},
				alertUsed: 0,
				subImgUrl: `${getImgUrl()}static/subPackages/shopMallModule`,
                cardImgUrl:`${getImgUrl()}static/card/`,
				isMcDonaldType: false,
				isShowServiceInformDia: false,
				lng: 0,
				lat: 0,
				location_province: '',
				location_city: '',
				restaurantStore: null
			}
		},
		watch: {
			restaurant_id(newValue, oldValue) {
				if(!this.isMcDonaldType || !newValue || !oldValue) return;
				this.initLocation(12, newValue);
			}
		},
		computed: {
            ...mapGetters(["userInfo", "isSelRedPacket", 'isSelNewPacket',  'province_name', 'city_name', 'restaurant_id']),
			goodsIntro() {
				if (!this.couponInfo) return
				let {
					goods_instruction
				} = this.couponInfo

				if (goods_instruction) {
					let html = escape2Html(goods_instruction || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			},
			exchangeRule() {
				if (!this.couponInfo) return
				let {
					goods_details
				} = this.couponInfo
				if (goods_details) {
					// return escape2Html(goods_details||'')
					let html = escape2Html(goods_details || '')
					let result = checkRichText(html)
					if (result) {
						return html
					} else {
						return ''
					}
				}
				return ''
			},
            showAllPrice() {
                const { goods_market_price, coupon_face_value, saving_money } = this.couponInfo;
                let allPrice = Number(goods_market_price) - Number(coupon_face_value);
                // 新开通省钱卡 - 金额加上0.9
                if(this.isSelNewPacket && !this.userInfo.is_vip) {
                    allPrice = allPrice + 0.9;
                }
                // 选中红包的金额 进行减去
                if(this.isSelRedPacket) {
                    allPrice = allPrice - Number(saving_money);
                }
                return allPrice.toFixed(2)
            },
            couponFaceValue() {
                const { coupon_face_value, saving_money } = this.couponInfo;
                let value =  Number(coupon_face_value);
                if(this.isSelRedPacket) value = value + Number(saving_money);
                if(!this.userInfo.is_vip && this.isSelNewPacket) value = value - 0.9;
                return value.toFixed(2);
            }
		},
		methods:{
            ...mapMutations({
                setSelRedPacket: 'user/setSelRedPacket',
                setSelNewPacket: 'user/setSelNewPacket',
				setBrandId: 'cart/setBrandId',
				setRestaurantId: 'cart/setRestaurantId',
				setCityName: 'cart/setCityName'
            }),
            formatPrice,
            goredPayIndexHandle(isLab = false){
                const { saving_money } = this.couponInfo;
                if(isLab && this.isSelRedPacket && this.userInfo.is_vip) return;
                this.$go(`/pages/userCard/card/cardVip/redPayIndex?saving_money=${saving_money}&ly_type=0`);
            },
			popupClose(){
               this.show = false;
			   if (this.paymentParams) {
				this.$emit('close');
			   }
			},
			closeDiaHandle() {
				this.isShowBackDia = false;
				this.isShowNumDia = false;
				this.isShowNoProduct = false;
			},
			confirmBackHandle() {
				this.isShowBackDia = false;
				this.show = false;
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url:'/pages/tabBar/shopMall/index'
						})
					}
				});
			},
			popupShow(id, alertUsed, type){
				this.alertUsed = alertUsed;
                this.paymentParams = null;
                this.setSelRedPacket(false);
                this.setSelNewPacket(false);
				this.init(id);
				this.initLocation(type);
			},
			goSelectShopHandle() {
				this.$go(`/pages/userModule/takeawayMenu/mcDonald/selectShop/index?pathSource=back`);
			},
			async initLocation(type, restaurant_id) {
				if(type != 12) return this.isMcDonaldType = false;
				this.setBrandId(5);
				this.isMcDonaldType = true;
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
					restaurant_id: this.restaurant_id || restaurant_id,
					province_name: this.province_name || this.location_province,
					city_name: this.city_name || this.location_city,
					rote: 1,
					location_city: this.location_city,
				};
				const res = await restaurantQuery(params);
				if(res.code != 1 || res.data.upgrade) return;
				this.restaurantStore = res.data;
				const restaurantIdRes = res.data.restaurant_id;
				if(!this.restaurant_id) {
					this.setRestaurantId(restaurantIdRes); // 门店id
				}
			},
			closePayHandle() {
            	this.show = false;
				this.isShowContinuePay = false;
				// 跳转订单支付详情
                this.$go(`/pages/userModule/order/detail?id=${this.order_id}&source=${this.source}&backPath=2&alertUsed=${this.alertUsed}`);
			},
			continuePayHandle() {
				this.isShowContinuePay = false;
			},
			// 再次取消
			againCancelHandle() {
				this.isShowContinuePay = true;
			},
			confirmNumHandle() {
				this.isShowNumDia = false;
				this.checkBuy();
			},
			closeNoProductHandle() {
				// 手慢无 - 返回首页
				this.closeDiaHandle();
				uni.navigateBack({
					fail() {
						uni.switchTab({
							url:'/pages/tabBar/shopMall/index'
						})
					}
				});
			},
			async init(id) {
				const navbarSystem =  uni.getStorageSync('xh-navbar-system');
				this.navbarSystem = JSON.parse(navbarSystem);
				let params = { id };
				const res = await applyCoupon(params);
                let { code, msg, data } = res;
                if (code != 1) return this.$toast(msg);
                this.couponInfo = data;
                // this.setSelRedPacket(Boolean(this.couponInfo.use_saving));
                this.cz_type = data.cz_type; // 充值类型
                if(data.cz_type && data.cz_type_intro) {
                    this.placeholderString = data.cz_type_intro;
                }
                this.show = true;
			},
			// 验证手机号码的正则
			isPhoneReg(num){
				var num_reg = /^1\d{10}$/;
				if(!num_reg.test(num)){
					return false;
				}
				return true;
			},
			async mcCheckHandle() {
				const { refundId, expiredId } = this.couponInfo;
				const tmplIds = [];
				refundId && tmplIds.push(refundId);
				expiredId && tmplIds.push(expiredId);
				const res = await this.$subscribeMessageHandle(tmplIds);
				const expired_power = (res[refundId] == 'accept') ? 1 : 0;
				const refund_power = (res[expiredId] == 'accept') ? 1 : 0;
				this.checkBuy(expired_power, refund_power);
			},
			// 充值类型 1-手机号码充值 2-其它账号充值
			// 【立即购买】时，校验相关信息：
			checkHandle() {
				this.$wxReportEvent('buynow', {source: this.source});
				// 直充类型的判断的验证
				if (this.couponInfo.goods_type == 0) {
					if(!this.account) {
						return this.$toast(this.placeholderString);
					}
					// 手机号码的类型判断
					if(this.cz_type == 1 && !this.isPhoneReg(this.account)) {
						return this.$toast('请输入正确的手机号码');
					}
					this.isShowNumDia = true;
					return;
				}
				this.checkBuy();
			},
			async checkBuy(expired_power = 0, refund_power = 0) {
				if (_request) return _request = true;
				let params = {
					id: this.couponInfo.goods_id, //商品id
					coupon_id: this.couponInfo.coupon_id, //优惠券id
					charge_account: this.account, //充值账号
					goods_market_price: this.couponInfo.goods_market_price * 100, //商品价格
                    use_saving: Number(this.isSelRedPacket),
                    get_saving: Number(this.isSelNewPacket),
					is_order: Number(this.isMcDonaldType),
					expired_power,
					refund_power
				}
				if (this.paymentParams) return this.createPayment(this.paymentParams);
				const res = await buy(params);
				let { code, data, msg } = res;
				_request = false;
				if (code == 1) {
					this.order_id = data.order_id;
					if(this.isMcDonaldType) return this.payOrderRequest();
					this.paymentParams = JSON.parse(data.jspay_info);
					this.createPayment(this.paymentParams)
					return;
				}
				// 价格有变化
				if (code == 2) {
					this.$toast(msg);
					this.couponInfo.goods_market_price = data;
					return;
				}
				// 手太慢，商品被抢光咯
				if (code == 3) {
					this.showNoProductText = msg;
					this.isShowNoProduct = true;
					return;
				}
				this.$toast(msg);
			},
			async payOrderRequest() {
				const res = await pay({ id: this.order_id});
				if(res.code != 1 || !res.data) return this.$toast(res.msg);
				const { jspay_info, order_id } = res.data;
				this.order_id = order_id;
				this.paymentParams = JSON.parse(jspay_info);
				this.createPayment(this.paymentParams);
			},
			// 发起支付
			createPayment(obj) {
				uni.requestPayment({
					'nonceStr': obj.nonceStr,
					'package': obj.package,
					'paySign': obj.paySign,
					'signType': obj.signType,
					'timeStamp': obj.timeStamp,
					success: (res) => {
						_request = false;
						// 支付成功，用order_id 查询结果
						let params = { id: this.order_id };
						query(params).then(res => {
							let {
								code,
								data,
								msg
							} = res;
							if (code == 1) {
								let { pay_amount, status } = data;
								pay_amount = (pay_amount / 100).toFixed(2);
								// 卡券类跳转详情
								if(this.couponInfo.goods_type || this.isMcDonaldType) {
									uni.reLaunch({
										url: `/pages/userModule/order/detail?id=${this.order_id}&payment=${pay_amount}`
									});
									return;
								}
								uni.redirectTo({
									url: `/pages/tabAbout/paySuccess/index?payment=${pay_amount}&status=${status}`
								})
								return
							}
							uni.showModal({
								title: '温馨提示',
								content: msg,
								showCancel: false
							})
						})
					},
					fail: (err) => {
						_request = false;
						if (err.errMsg == 'requestPayment:fail cancel') {
							this.$wxReportEvent('refusetobuy', {source: this.source});
							// 取消支付
							this.isShowContinuePay = true;
						}
						Toast({
							message: err.errMsg,
							position: 'bottom'
						})
					}
				});
			},
		}
	}
</script>

<style lang="scss">
.discount_item {
    font-size: 28rpx;
    color: #333;
    line-height: 40rpx;
    position: relative;
    width: 100%;
    padding: 16rpx 0;
    box-sizing: border-box;
    &.new_item{
        background: linear-gradient(270deg,rgba(248,72,66,0.00) 0%, rgba(248,72,66,0.06) 75%, rgba(248,72,66,0.00));
    }
  .dis_icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 12rpx;
  }
    .dis_price{
        font-size: 32rpx;
        font-weight: 600;
        text-align: right;
        color: #f95731;
        .dis_num{
            height: 38rpx;
            background: #f84842;
            border-radius: 8rpx;
            font-size: 26rpx;
            color: #ffffff;
            line-height: 38rpx;
            padding: 0 8rpx;
            margin-right: 16rpx;
        }
    }
    .dis_noPrice{
        font-size: 28rpx;
        font-weight: 400;
        color: #f95731;
        line-height: 40rpx;
    }
}
.service {
	padding: 80rpx 0 208rpx;
	box-sizing: border-box;
	flex: 1;
	overflow-x: hidden;
	overflow-y: scroll;
	background: #f7f7f7;
	position: relative;
	border-radius: 32rpx 32rpx 0rpx 0rpx;
	margin-top: -80rpx;
	&.mcdonald {
		z-index: 0;
		padding-top: 0;
		margin: 0;
		&::before {
			content: '\3000';
			position: absolute;
			width: 100%;
			min-height: 546rpx;
			top: 0;
			left: 0;
			z-index: -1;
			background: url("https://test-file.y1b.cn/store/1-0/2447/661204293bbcc.png") 0 0 / 100% auto;
		}
	}
}
.service_scroll {
	height: 100%;
	overflow: scroll;
}
.close_box {
	background: #f7f7f7;
	width: 100%;
	height: 80rpx;
	position: relative;
	border-radius: 32rpx 32rpx 0rpx 0rpx;
	z-index: 1;
	.close_box-icon {
		position: absolute;
		top: 0;
		right: 10rpx;
		width: 48rpx;
		height: 48rpx;
		padding: 16rpx;
	}
}
.close_icon {
	width: 48rpx;
	height: 48rpx;
	padding: 24rpx;
	display: block;
	margin: 0 0 0 auto;
}
.cont_box {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.service_title {
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 28rpx;
	color: #ffffff;
	line-height: 40rpx;
	margin-bottom: 24rpx;
	// position: absolute;
	// left: 50%;
	// transform: translateX(-50%);
	.service_title-icon {
		width: 28rpx;
		height: 36rpx;
		margin-right: 12rpx;
	}
}
.ser_box {
	margin: 0 24rpx 20rpx;
	border-radius: 24rpx;
	background: #fff;
	padding: 18rpx 24rpx 40rpx;
	position: relative;
	z-index: 0;
	&.active {
		padding: 0 24rpx;
		overflow: hidden;
	}
	&.ser_box_top {
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.shop_bg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
	width: 100%;
	height: 100%;

}
.shop_img {
	width: 128rpx;
	height: 128rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	background: gray;
}
.shop_title {
	flex: 1;
	align-self: stretch;
	// background: gray;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	.shop_title-text {
		font-size: 28rpx;
		font-family: PingFang SC, PingFang SC-Medium;
		font-weight: 500;
		text-align: left;
		color: #333333;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; /* 这里是超出几行省略 */
		overflow: hidden;
	}
	.shop_title-label {
		display: inline-block;
		height: 28rpx;
		border: 1rpx solid #f84842;
		border-radius: 4rpx;
		font-weight: 400;
		color: #f84842;
		line-height: 28rpx;
		padding: 0 8rpx;
		font-size: 20rpx;
	}
}
.shop_price {
	align-self: start;
	margin-left: 10rpx;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	.shop_gf {
		width: 82rpx;
		height: 32rpx;
		margin-top: 6rpx;
	}
}
.direct-recharge-box {
	box-sizing: border-box;
	background: #ffffff;
	border-radius: 24rpx;
	padding: 9rpx 0 32rpx;
	margin-top: 16rpx;
	margin-bottom: 16rpx;
}
.recharge-account {
	font-size: 26rpx;
	font-weight: 600;
	color: #333333;
	line-height: 36rpx;
    margin-top: 14rpx;
}
.icon-star {
	color: #EF2B20;
}
.input-box {
	display: flex;
	align-items: flex-end;
	box-sizing: border-box;
	padding: 26rpx 0 12rpx;
	position: relative;
	margin-bottom: 32rpx;
	&::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: auto;
		border-bottom: 1rpx solid #F1F1F1;
	}
	.place-holder {
		color: #aaaaaa;
		font-size: 32rpx;
		// font-weight: 600;
		line-height: 44rpx;
	}
	.input-account {
		font-size: 30rpx;
		font-weight: 500;
		color: #333333;
		line-height: 42px;
		width: 100%;
	}
}
.discount-box {
	padding: 0 24rpx;
	height: 100rpx;
	box-sizing: border-box;
	line-height: 36rpx;
	font-size: 26rpx;
	color: #F84842;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 0;
	// margin-top: 32rpx;
	.discount_bg {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	.content {
		font-size: 26rpx;
		font-weight: 500;
		display: flex;
		align-items: center;
		.content_icon {
			width: 48rpx;
			height: 48rpx;
		}
		.content_lab {
			margin: 0 16rpx;
		}
	}

	.discount-price {
		font-size: 28rpx;
		font-weight: 500;
	}
}
.pay-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 30rpx;
	font-weight: 500;
	padding: 19rpx 24rpx 0;
	color: #333333;

	.pay-price {
		font-size: 26rpx;
		font-weight: 500;
		color: #ef2b20;
		display: flex;
		align-items: flex-end;
	}
}
.buy-price {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding-top: 32rpx;
	line-height: 36rpx;
	font-size: 26rpx;
    border-top: 1rpx dashed #e1e1e1;
    margin-top: 20rpx;
	.price_txt {
		margin-left: 20rpx;
	}
}
.intro-title {
	font-size: 30rpx;
	font-weight: 600;
	color: #333333;
	line-height: 42rpx;
}

.intro-content {
	margin-top: 16rpx;
	word-break: break-word;
}
.discount_rem {
	line-height: 68rpx;
	height: 68rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 26rpx;
	color: #f97f02;
	position: relative;
	z-index: 0;
	.discount_rem_bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.discount_rem-icon {
		width: 24rpx;
		height: 24rpx;
		margin-right: 8rpx;
	}
}
.buy_btn-box {
	background: #fff;
	position: absolute;
	bottom: 0;
	width: 100%;
	padding-bottom: constant(safe-area-inset-bottom); /* 兼容 IOS<11.2 */
	padding-bottom: env(safe-area-inset-bottom); /* 兼容 IOS>11.2 */
	.buy_btn-cont {
		margin: 14rpx 40rpx;
        font-size: 26rpx;
		color: #333;
		display: flex;
		justify-content: flex-end;
		align-items: center;
        line-height: 56rpx;
		.price {
			color: #F84842;
		}
	}
    .buy_btn{
        background: linear-gradient(165deg,#f97f02 0%, #f84842 53%, #f84842 53%);
        border-radius: 38rpx;
        height: 80rpx;
        line-height: 80rpx;
        width: 200rpx;
        text-align: center;
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
        margin-left: 40rpx;
    }
    .buy_btn-lab {
        color: #aaaaaa;
        line-height: 26rpx;
    }
}
.mc_top {
	margin: 28rpx 24rpx 30rpx;
	.mc_top-left {
		width: 128rpx;
		height: 128rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
		background: #FFBA00;
		overflow: hidden;
		.mc_top-img {
			width: 100%;
			height: 100%;
		}
	}
	.mc_top-right {
		.old_price {
			font-size: 28rpx;
			text-decoration:  line-through;
			color: rgba(51,51,51,0.65);
			line-height: 40rpx;
			margin-left: 8rpx;
		}
		.exclusive_price {
			font-size: 24rpx;
			text-align: left;
			color: #ffffff;
			line-height: 34rpx;
			position: relative;
			z-index: 0;
			padding: 20rpx 34rpx 0rpx 16rpx;
			display: inline-block;
			&::before {
				position: absolute;
				content: '\3000';
				width: 100%;
				height: 100%;
				left: 0;
				bottom: 0;
				background: url("https://test-file.y1b.cn/store/1-0/2447/66120c5c2d1ac.png") no-repeat 0 0 / 100% auto;
				z-index: -1;
			}
			.exclusive_price-value {
				&::before {
					content: ' - ¥';
					font-size: 20rpx;
					font-weight: bold;
				}
				font-size: 26rpx;

			}
		}

	}
}
.mc_cont-box {
	margin: 20rpx 16rpx 0;
	position: relative;
	z-index: 0;
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx 24rpx;
	&.explain{
		padding: 0rpx 24rpx;
		overflow: hidden;
	}
}
.mc_cont {
	margin: 20rpx 16rpx 0;
	position: relative;
	z-index: 0;
	background: #fff;
	border-radius: 24rpx;
	padding-bottom: 32rpx;
	// &::before {
	// 	content: '\3000';
	// 	position: absolute;
	// 	width: 100%;
	// 	min-height: 100%;
	// 	top: 0;
	// 	left: 0;
	// 	z-index: -1;
	// 	background: url("https://test-file.y1b.cn/store/1-0/2447/661204293bbcc.png") 0 0 / 100% auto;
	// }
	.mc_cont-title {
		padding: 40rpx 154rpx 40rpx 24rpx;
		font-size: 36rpx;
		color: #333;
		line-height: 50rpx;
		font-weight: bold;
		position: relative;
		&::after {
			content: '\3000';
			position: absolute;
			width: 144rpx;
			height: 34rpx;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			background: url("https://test-file.y1b.cn/store/1-0/2447/66121106a6595.png") 0 0 / 100% 100%;
		}
	}
	.mc_dot {
		// width: 100%;
		height: 2rpx;
		margin: 0 40rpx;
		border-top: 10rpx dotted #F9EAC2;
		position: relative;
		z-index: 0;
		&::before {
			content: '\3000';
			position: absolute;
			width: 32rpx;
			height: 32rpx;
			background: #F8ECC9;
			border-radius: 50%;
			top: -21rpx;
			left: -56rpx;
		}
		&::after {
			content: '\3000';
			position: absolute;
			width: 32rpx;
			height: 32rpx;
			background: #F8ECC9;
			border-radius: 50%;
			top: -21rpx;
			right: -56rpx;
		}
	}
	.mc_line{
		margin: 24rpx 24rpx 0;
		background: #f7f8fa;
		border-radius: 12rpx;
		padding: 32rpx 54rpx;
		.mc_line-item {
			font-size: 24rpx;
			color: #333;
			line-height: 34rpx;
			text-align: center;
			.line_item-con {
				width: 36rpx;
				height: 36rpx;
				display: block;
				margin: 0 auto 8rpx;
			}
		}
		.line_item-lab{
			width: 30rpx;
			height: 15rpx;
		}
	}
}
.mc_lab {
	font-size: 26rpx;
	color: #666;
	margin: 32rpx 24rpx 0;
	position: relative;
	padding-left: 32rpx;
	&::before {
		content: '\3000';
		width: 26rpx;
		height: 26rpx;
		position: absolute;
		left: 0;
		background: url("https://test-file.y1b.cn/store/1-0/2447/6612354259744.png") 0 0 / cover;
	}
}
.mc_store-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	position: relative;
	z-index: 0;
	&::before {
		content: '\3000';
		width: 208rpx;
		height: 62rpx;
		position: absolute;
		left: 44rpx;
		top: 50%;
		transform: translateY(-50%);
		background: url("https://test-file.y1b.cn/store/1-0/2447/661239e6e705c.png") 0 0 / cover;

	}
}
.store_add {
	margin-top: 20rpx;
	font-size: 28rpx;
	line-height: 40rpx;
	.store_add-left {
		position: relative;
		padding-right: 56rpx;
		margin-right: 10rpx;
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
.store_add-txt {
	font-size: 26rpx;
	color: #999;
	line-height: 36rpx;
	margin-top: 10rpx;
}
.ul_list {
	margin-top: 24rpx;
	flex-wrap: wrap;
	.ul_list-item {
		width: 50%;
		margin-top: 16rpx;
		&::before {
			content: '· ';
		}
	}
}
.buy_mc-btn {
	margin: 16rpx 24rpx;
	height: 80rpx;
	background: #ffba00;
	border-radius: 40rpx;
	line-height: 80rpx;
	font-size: 28rpx;
	color: #333;
	text-align: center;
	font-weight: bold;
	.price {
		margin-right: 12rpx;
	}
}
.cont_top {
	width: 100%;
	position: relative;
}
</style>
