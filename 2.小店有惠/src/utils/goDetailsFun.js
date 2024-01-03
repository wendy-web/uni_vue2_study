import { goodsXq } from "@/api/modules/home.js";
import { mapGetters } from "vuex";
import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
const goDetailsFun = {
    data() {
        return {}
    },
    computed: {
        ...mapGetters(["userInfo", 'isAutoLogin']),
    },
    methods: {
        detailsFun_mixins(item, index = null) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const {
                coupon_id,
                id,
                is_jump,
                lx_type
            } = item;
            if ([2, 3].includes(Number(lx_type))) return this.lxTypeJdFun(item, index);
            const item_id = coupon_id || id;
            if (is_jump == 2) {
                return this.goCouponDetails(item_id);
            }
            // 绑定当前的积分
            this.requestGoodXq_mixins(item_id);
            // 兑换成功，当前的兑换人数加一
            if ((item.exch_user_num >= 0) && (index !== null)) {
                goodList[index].exch_user_num = goodList[index].exch_user_num + 1;
                return goodList;
            }
        },
        async lxTypeJdFun(item, index) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const {
                cid1,
                cid3,
                skuId,
                positionId,
                isJdLink,
                link,
                is_popover = 0,
                is_flow,
                lx_type,
                goods_sign,
                has_coupon
            } = item;
            // feed流
            if (is_flow) {
                let urlPar = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`
                if (lx_type == 3) urlPar = `goods_sign=${goods_sign}`; // 拼多多商品
                this.$go(`/pages/homeModule/feedDetailsList/index?${urlPar}&positionId=${positionId || 0}&has_coupon=${has_coupon}`);
                return;
            }

            const params = { positionId };
            let api = '';
            if (lx_type == 3) {
                api = goodsPromotion;
                params.goods_sign = goods_sign;
            } else {
                api = bysubunionid;
                params.skuId = skuId;
                params.is_popover = is_popover;
                params.has_coupon = has_coupon || 0;
                isJdLink && (params.link = link);
            }
            const skuRes = await api(params);
            console.log('skuRes', skuRes.data)
                // 商品已下架
            if (skuRes.code == 0) {
                this.$toast(skuRes.msg);
                this.$emit('deleteBysubunionid', index);
                return;
            }
            const { type_id, jdShareLink, mobile_url } = skuRes.data;
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                // envVersion:'trial',
                path: jdShareLink || mobile_url
            });
        },
        async requestGoodXq_mixins(item_id, is_popover) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const detailData = await goodsXq({ id: item_id });
            let {
                type,
                type_id,
                type_sid,
                is_main,
                article_url,
                main_url,
                video_id,
                video_account_id,
                qz_url,
                open_mini_type,
                deduction_credits
            } = detailData.data;
            console.log('deduction_credits :>> ', deduction_credits, this.userInfo.credits);
            // 牛金豆不足，并且type类型存在
            if (this.userInfo.credits < deduction_credits && type && !is_popover) {
                this.confirmDiaShow = true;
                return;
            }
            switch (type) {
                //公众号
                case 1:
                    let link = is_main === 1 ? article_url : main_url;
                    uni.navigateTo({
                        url: `/pages/webview/index?link=${encodeURIComponent(link)}`
                    });
                    break;
                case 2:
                    //视频号
                    if (wx.openChannelsActivity) {
                        wx.openChannelsActivity({
                            finderUserName: video_id,
                            feedId: video_account_id,
                            complete(res) {
                                console.log(res);
                            }
                        });
                    } else {
                        wx.showModal({
                            icon: 'none',
                            title: '当前微信版本过低',
                            content: '升级后再使用,微信版本要求>=8.0.10'
                        });
                    }
                    break;
                case 3:
                    // 小程序
                    let openMiniProgram = wx.navigateToMiniProgram;
                    if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                        openMiniProgram = wx.openEmbeddedMiniProgram;
                    }
                    console.log('tiaoz :>> ', type_id, type_sid);
                    openMiniProgram({
                        appId: type_id,
                        path: type_sid,
                        // envVersion: 'trial',
                        success(res) {
                            // 打开成功
                        }
                    });
                    break;
                default:
                    this.goCouponDetails(item_id, is_popover);
                    break;
            }
        },
        goCouponDetails(id, is_popover = 0) {
            this.$go(`/pages/homeModule/productDetails/index?id=${id}&is_popover=${is_popover}`);
        }
    },
    mounted() {}
}
export default goDetailsFun;
