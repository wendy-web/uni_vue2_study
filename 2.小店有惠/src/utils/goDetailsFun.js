import { goodsXq } from "@/api/modules/home.js";
import { lxTypeStatusCheckout } from "@/utils/goDetailCommonFun.js";
import { mapGetters, mapMutations } from "vuex";
const goDetailsFun = {
    data() {
        return {}
    },
    computed: {
        ...mapGetters(["userInfo", 'isAutoLogin']),
    },
    methods: {
        ...mapMutations({
            setMiniProgram: "user/setMiniProgram",
        }),
        configurationDiaHandle(item) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const {
                lx_type,
                type,
                type_id,
                type_sid,
                coupon_id_android,
                open_mini_type,
                is_rebate
            } = item;
            switch (type) {
                case 1:
                    this.requestGoodXq_mixins(coupon_id_android, 1);
                    break;
                case 2:
                    // 小程序
                    const openMiniProgram = (open_mini_type == 2) ? this.$openEmbeddedMiniProgram : this.$navigateToMiniProgram;
                    openMiniProgram({
                        appId: type_id,
                        path: type_sid,
                        // envVersion: 'trial',
                        success(res) {
                            // 打开成功
                        }
                    });
                    break;
                case 3:
                    if (is_rebate) return this.rebateDetail(item, 1);
                    if ([2, 3].includes(Number(lx_type))) this.lxTypeJdFun(item);
                    break;
            }

        },
        detailsFun_mixins(item, index = null) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const {
                coupon_id,
                id,
                is_jump,
                lx_type,
                is_banner,
                type,
                type_id,
                type_sid,
                is_rebate
            } = item;
            if (is_rebate == 1) return this.rebateDetail(item); // 去推广详情页
            if ([2, 3].includes(Number(lx_type))) return this.lxTypeJdFun(item, index);
            const item_id = coupon_id || id;
            if (is_jump == 2) return this.goCouponDetails(item_id);
            // 小程序h5的配置
            if ((type == 5) && is_banner) return this.$go(`/pages/webview/index?link=${encodeURIComponent(type_sid)}`);
            if (type == 3) return this.immediateFun(item);
            // 绑定当前的积分
            this.requestGoodXq_mixins(item_id);
            // 兑换成功，当前的兑换人数加一
            if ((item.exch_user_num >= 0) && (index !== null)) {
                goodList[index].exch_user_num = goodList[index].exch_user_num + 1;
                return goodList;
            }
        },
        async rebateDetail(item, is_popover = 0) {
            // 检测商品是否存在进入
            const res = await lxTypeStatusCheckout(item);
            if (res.code != 1) return;
            const { lx_type, goods_sign, skuId, positionId, rebate } = item;
            this.$go(`/pages/cardModule/spreadDetail/index?lx_type=${lx_type}&goods_sign=${goods_sign || 0}&skuId=${skuId ||0}&queryId=${goods_sign || skuId}&positionId=${positionId}&rebate=${rebate}&is_popover=${is_popover}`);
        },
        // 赚钱推广分享页
        async spreadHandle(item) {
            // 检测商品是否存在进入
            const res = await lxTypeStatusCheckout(item);
            if (res.code != 1) return;
            const { goods_sign, rebate, skuId } = item;
            this.$go(`/pages/cardModule/spreadDetail/saveType?goods_sign=${goods_sign || 0}&skuId=${skuId || 0}&rebate=${rebate}`);
        },
        async lxTypeJdFun(item, index) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            let {
                cid1,
                cid3,
                skuId,
                positionId,
                is_flow,
                lx_type,
                goods_sign,
                has_coupon,
                type_id,
                jdShareLink,
                mobile_url
            } = item;
            // feed流
            if (is_flow) {
                let urlPar = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`
                if (lx_type == 3) urlPar = `goods_sign=${goods_sign}`; // 拼多多商品
                this.$go(`/pages/homeModule/feedDetailsList/index?${urlPar}&positionId=${positionId || 0}&has_coupon=${has_coupon}`);
                return;
            }
            let miniPath = '';
            if (lx_type == 3 && mobile_url) miniPath = mobile_url;
            if (lx_type == 2 && jdShareLink) miniPath = jdShareLink;
            if (type_id && miniPath) {
                this.setMiniProgram(lx_type);
                this.$openEmbeddedMiniProgram({
                    appId: type_id,
                    // envVersion:'trial',
                    path: jdShareLink || mobile_url
                });
                return;
            }
            const skuRes = await lxTypeStatusCheckout(item);
            // 商品已下架
            if (skuRes.code == 0 || !skuRes.data) return this.$emit('deleteBysubunionid', index);
            type_id = skuRes.data.type_id;
            mobile_url = skuRes.data.mobile_url;
            jdShareLink = skuRes.data.jdShareLink;
            this.setMiniProgram(type_id);
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                // envVersion:'trial',
                path: jdShareLink || mobile_url
            });
        },
        immediateFun(item) {
            if (!this.isAutoLogin) return this.$go('/pages/login/index');
            const { open_mini_type, type_id, type_sid, deduction_credits } = item;
            if (this.userInfo.credits < deduction_credits) return this.confirmDiaShow = true;
            let openMiniProgram = (open_mini_type == 2) ? this.$openEmbeddedMiniProgram : this.$navigateToMiniProgram;
            this.setMiniProgram(type_id);
            openMiniProgram({
                appId: type_id,
                path: type_sid,
                // envVersion: 'trial',
                success(res) {
                    // 打开成功
                }
            });
            return;
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
                    this.setMiniProgram(type_id);
                    openMiniProgram({
                        appId: type_id,
                        path: type_sid,
                        // envVersion: 'trial',
                        success(res) {
                            // 打开成功
                        }
                    });
                    break;
                case 5:
                    // 小程序h5的跳转
                    this.$go(`/pages/webview/index?link=${encodeURIComponent(type_sid)}`);
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
