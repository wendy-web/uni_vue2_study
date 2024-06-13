import { bysubunionid } from '@/api/modules/jsShop.js';
import { goodsPromotion } from '@/api/modules/pddShop.js';
import {
    couponDetails,
    exchange,
    fromUrl
} from '@/api/modules/shopMall.js';
import {
    mapGetters,
    mapMutations
} from 'vuex';
const goDetailsFun = {
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['userInfo', 'isAutoLogin', 'diaList'])
    },
    methods: {
        ...mapMutations({
            setMiniProgram: "user/setMiniProgram",
            setDiaList: "user/setDiaList",
        }),
        // 图文的详情跳转事件
        async textDetailsFun_mixins(item) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            const {
                type,
                open_mini_type,
                lx_type,
                is_main,
                main_url,
                article_url,
                video_id,
                video_account_id,
                type_id,
                type_sid,
                qz_url,
                coupon_id_android,
                positionId,
                configDia,
                is_popover,
                is_cinema,
                isNavFromUrl,
                is_jl,
                is_zt,
                isCodeErrorShow
            } = item;
            // configDia 配置弹窗的事件
            // 京东的商品
            if ((lx_type == 2 || lx_type == 3) && [12].includes(type)) return this.lxTypeJdFun(item, {});
            switch (type) {
                case 1:
                    return this.goCouponDetails(coupon_id_android, is_popover);
                    break;
                    //公众号
                case 2:
                    let link = is_main === 1 ? article_url : main_url;
                    this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
                    break;
                case 3:
                    //视频号
                    if (wx.openChannelsActivity) {
                        wx.openChannelsActivity({
                            finderUserName: video_id,
                            feedId: video_account_id,
                        });
                    } else {
                        wx.showModal({
                            icon: 'none',
                            title: '当前微信版本过低',
                            content: '升级后再使用,微信版本要求>=8.0.10'
                        });
                    }
                    break;
                case 4:
                    // 小程序配置内部页面 - 专题已捡漏页面
                    if (is_jl || is_zt) {
                        return this.jlZtOpenFun(item);
                    }
                    // 小程序
                    let openMiniProgram = wx.navigateToMiniProgram;
                    if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                        openMiniProgram = wx.openEmbeddedMiniProgram;
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
                case 5:
                    // 千猪外链
                    if (qz_url) {
                        const bgColor = this.getWebviewBgColor(qz_url);
                        this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}&bgColor=${bgColor}`);
                    }
                    break;
                case 6:
                    // 京东商品——半屏小程序拉起
                    if (configDia) {
                        const {
                            is_jump,
                            cid1,
                            skuId,
                            cid3,
                            positionId,
                            lx_type,
                            goods_sign,
                            has_coupon
                        } = item;
                        if (is_jump == 1) {
                            let urlPar = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`
                            if (lx_type == 3) urlPar = `goods_sign=${goods_sign}`; // 拼多多商品
                            this.$go(`/pages/shopMallModule/feedDetailsList/index?${urlPar}&positionId=${positionId || 0}&has_coupon=${has_coupon}`);
                            return;
                        }
                        this.lxTypeJdFun({
                            ...item,
                            skuId: type_id,
                            is_popover: 1
                        }, {});
                        return;
                    }
                    // 京东电商 _ typeIndex指定栏目
                    this.$go(`/pages/userModule/productList/index?typeIndex=${type_id || 0}`);
                    break;
                case 7:
                    if (configDia) {
                        // 领券中心 - 弹窗事件
                        this.$go(`/pages/userModule/productList/index?typeIndex=${type_id || 0}`);
                        return;
                    }
                    console.log('this.', this.userInfo.buy_vip);
                    if (this.userInfo.buy_vip) {
                        return this.$go('/pages/discounts/discounts/index');
                    }
                    this.$toast('维护中，敬请留意');
                    // 惠生活
                    // uni.switchTab({
                    //     url: `/pages/tabBar/discounts/index`
                    // });
                    break;
                case 8:
                    // 跳转瑞幸点单 - 入口标识：第一次进入为1； 0：否；1：是
                    this.$go(`/pages/userModule/takeawayMenu/luckin/index?brand_id=13&rote=1`);
                    break;
                case 9:
                    // 小程序的内部页面
                    // this.$go(qz_url);
                    switch (is_main) {
                        case 1:
                            this.$go(qz_url);
                            break;
                        case 2:
                            this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}`);
                            break;
                    }
                    break;
                case 10:
                    // 从图文管理的模式进入
                    if (isNavFromUrl) {
                        // 乐维娃娃机
                        fromUrl().then(res => {
                            if (res.code == 1 && res.data) {
                                this.$go(`/pages/webview/webview?link=${encodeURIComponent(res.data)}`);
                                return;
                            }
                            this.$toast(res.msg);
                        });
                        return;
                    }
                    // 推券弹窗
                    if (this.$refs.recommendDia) {
                        this.$refs.recommendDia.initGtData(item);
                        // 扫码异常打开推券的弹窗
                        if (isCodeErrorShow) {
                            setTimeout(() => {
                                this.setDiaList('codeError');
                            }, 0);
                        }
                    };
                    break;
                case 11:
                    // 专题页面 - open_mini_type打开半屏的弹窗 - (配置弹窗)
                    if (open_mini_type == 2 && this.$refs.specialLisMiniPage) {
                        setTimeout(() => {
                            this.setDiaList('specialLis');
                        }, 0);
                        return this.$refs.specialLisMiniPage.initShow(type_id);
                    };
                    this.$go(`/pages/userModule/allowance/specialList/index?id=${type_id || 0}`);
                    break;
                case 13:
                    // 接入移动积分
                    this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}`);
                    break;
            }
        },
        // 列表的跳转事件
        async detailsFun_mixins(
            item, { listIndex = null, index = null },
            isBolCredits
        ) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            const _that = this;
            const {
                coupon_id,
                id,
                type,
                open_mini_type,
                is_jump,
                lx_type,
                dl_lx_type,
                is_popover,
                is_jl,
                is_zt,
                is_banner
            } = item;
            // 接入移动积分
            if (type == 11 && is_banner) return this.$go(`/pages/webview/webview?link=${encodeURIComponent(item.qz_url)}`);
            // 小程序配置内部页面 - 专题已捡漏页面
            if (is_jl || is_zt) return this.jlZtOpenFun(item);
            // 京东的商品
            if (lx_type == 2 || lx_type == 3) return this.lxTypeJdFun(item, { listIndex, index }, isBolCredits);
            // 拼多多
            const item_id = coupon_id || id;
            if (is_jump == 2 || [1, 11, 12].includes(type)) return this.goCouponDetails(item_id, is_popover);

            // 小程序的直接跳转
            if (item.type == 4) return this.immediateFun(item);
            const detailData = await couponDetails({ id: item_id });
            let {
                activity_id,
                activity_enter_num,
                activity_num,
                stock_num,
                status,
                start_time,
                end_time,
                type_id,
                type_sid,
                is_main,
                article_url,
                main_url,
                video_id,
                video_account_id,
                qz_url
            } = detailData.data;
            // 下架按无库存 _ 或过期，进入详情页展示
            if ((activity_id && activity_enter_num >= activity_num) || (stock_num <= 0) || (status == 0)) {
                this.goCouponDetails(item_id, is_popover);
                return;
            }
            // 秒杀的活动_j结束
            if (start_time && end_time) {
                let currDate = new Date().getTime();
                end_time = new Date(end_time.replace(new RegExp(/-/gm), '/')).getTime();
                if (currDate < end_time) {
                    this.goCouponDetails(item_id, is_popover);
                    return;
                }
            }
            const exchangeData = await exchange({
                id: item_id,
                is_popover,
            });
            if (!exchangeData.code) return;
            let link = is_main === 1 ? article_url : main_url;
            switch (type) {
                // 公众号
                case 2:
                    this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
                    break;
                case 3:
                    //视频号
                    if (wx.openChannelsActivity) {
                        wx.openChannelsActivity({
                            finderUserName: video_id,
                            feedId: video_account_id
                        });
                    } else {
                        wx.showModal({
                            icon: 'none',
                            title: '当前微信版本过低',
                            content: '升级后再使用,微信版本要求>=8.0.10'
                        });
                    }
                    break;
                case 4:
                    let openMiniProgram = wx.navigateToMiniProgram;
                    if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                        openMiniProgram = wx.openEmbeddedMiniProgram;
                    }
                    openMiniProgram({
                        appId: type_id,
                        path: type_sid,
                        // envVersion: 'trial',
                        fail: function(error) {
                            _that.$emit('notOpenMini');
                        },
                        success: function(res) {}
                    });
                    break;
                case 5:
                    // 千猪外链
                    if (qz_url) {
                        const bgColor = this.getWebviewBgColor(qz_url);
                        this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}&bgColor=${bgColor}`);
                    }
                    break;
                case 6:
                    // 小程序内页
                    this.pageToUrl(detailData.data);
                    break;
                case 8:
                    // tag 0： 战马、 1： 红牛 跳转至公众号
                    if (this.userInfo.tag <= 1) {
                        return this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
                    }
                    // 乐维娃娃机
                    fromUrl().then(res => {
                        if (res.code == 1 && res.data) {
                            this.$go(`/pages/webview/webview?link=${encodeURIComponent(res.data)}`);
                            return;
                        }
                        this.$toast(res.msg);
                    });
                    break;
                case 10:
                    // 广告位 - 打开半屏推券的使用
                    this.$emit('isBannerClick', {
                        ...item,
                        end_time
                    });
                    break;
                case 11:
                    // 移动积分 - 进入详情
                    // this.goCouponDetails(item_id, is_popover);
            }
        },
        // 小程序内页
        pageToUrl(pageData) {
            const {
                page_index,
                eliteId_index,
                type_sid
            } = pageData;
            switch (page_index) {
                case 1:
                    this.$go('/pages/discounts/discounts/index');
                    // uni.switchTab({
                    //     url: `/pages/tabBar/discounts/index`
                    // });
                    break;
                case 2:
                    uni.switchTab({
                        url: `/pages/tabBar/task/index`
                    });
                    break;
                case 3:
                    // 领券中心的域名
                    this.$go(`/pages/userModule/productList/index?typeIndex=${eliteId_index}`);
                    break;
                case 4:
                    // 跳转瑞幸点单 - 入口标识：第一次进入为1； 0：否；1：是
                    this.$go(`/pages/userModule/takeawayMenu/luckin/index?brand_id=13&rote=1&product_id=${type_sid || 0}`);
                    break;
                case 5:
                    this.$go(type_sid);
                    break;
                case 6:
                    // 麦当劳
                    this.$go(`/pages/userModule/takeawayMenu/mcDonald/index?brand_id=5&rote=1&product_id=${type_sid || 0}`);
                    break;
                case 7:
                    // 肯德基
                    this.$go(`/pages/userModule/takeawayMenu/kfc/index?brand_id=97&rote=1&product_id=${type_sid || 0}`);
                    break;
            }
        },
        getWebviewBgColor(qz_url) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            // kfc 肯德基
            // cinema 电影
            // starbucks 星巴克
            let bgColor = '';
            let type = 0;
            /cinema/.test(qz_url) && (type = 1);
            /kfc/.test(qz_url) && (type = 2);
            /starbucks/.test(qz_url) && (type = 3);
            switch (type) {
                case 1:
                    bgColor = '#FCDB28';
                    break;
                case 2:
                    bgColor = '#A80116';
                    break;
                case 3:
                    bgColor = '#006442';
                    break;
            }
            return bgColor;
        },
        // isBolCredits ; 是否需要判断当前用户的牛金豆的情况
        async lxTypeJdFun(item, { listIndex, index }, isBolCredits = false) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            // is_flow
            // 0-半屏打开小程序 （type_id:小程序APPID，jdShareLink: 京东的跳转链接， mobile_url：拼多多的跳转链接）
            // 1-跳转feed流页面，请求关键词搜索商品接口，传参cid1
            let {
                lx_type,
                is_flow,
                cid1,
                skuId,
                cid3,
                credits,
                positionId,
                isJdLink,
                link,
                is_popover = 0,
                goods_sign,
                has_coupon,
                type_id,
                jdShareLink,
                mobile_url,
                active_id,
                tag
            } = item;
            // 牛金豆不足:进行弹窗的展示
            if (!this.userInfo.is_vip && isBolCredits && (credits > this.userInfo.credits)) {
                this.$emit('notEnoughCredits'); // 组件抛出去的方法
                this.exchangeFailedShow = true; // 混入方法的参数赋值
                return;
            }
            if (is_flow == 1) {
                let urlPar = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`
                if (lx_type == 3) urlPar = `goods_sign=${goods_sign}`; // 拼多多商品
                this.$go(`/pages/shopMallModule/feedDetailsList/index?${urlPar}&positionId=${positionId || 0}&has_coupon=${has_coupon}`);
                return;
            }
            const params = {
                positionId,
                tag: tag || 0,
                active_id: active_id || 0
            };
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
            // 商品已下架
            if (skuRes.code == 0) {
                this.$toast(skuRes.msg);
                this.$emit('deleteBysubunionid', { listIndex, index });
                return;
            }
            // 半屏的中转详情页面
            if (is_flow == 2) {
                this.$go(`/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${goods_sign || skuId}&positionId=${positionId}&active_id=${active_id || 0}&tag=${tag || 0}`);
                return;
            }
            type_id = skuRes.data.type_id;
            mobile_url = skuRes.data.mobile_url;
            jdShareLink = skuRes.data.jdShareLink;
            this.setMiniProgram(lx_type);
            this.$openEmbeddedMiniProgram({
                appId: type_id,
                path: jdShareLink || mobile_url
            });

        },
        // 红包的跳转
        async redPacketFun(id) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            const detailData = await couponDetails({ id });
            let {
                type,
                activity_id,
                activity_enter_num,
                activity_num,
                stock_num,
                status,
                start_time,
                end_time,
                type_id,
                type_sid,
                is_main,
                article_url,
                main_url,
                video_id,
                video_account_id,
                qz_url,
                open_mini_type
            } = detailData.data;
            // 下架按无库存 _ 或过期，进入详情页展示
            if ((activity_id && activity_enter_num >= activity_num) || (stock_num <= 0) || (status == 0)) {
                this.goCouponDetails(id);
                return;
            }
            // 秒杀的活动_j结束
            if (start_time && end_time) {
                let currDate = new Date().getTime();
                end_time = new Date(end_time.replace(new RegExp(/-/gm), '/')).getTime();
                if (currDate < end_time) {
                    this.goCouponDetails(id);
                    return;
                }
            }
            const exchangeData = await exchange({ id });
            if (!exchangeData.code) return;
            switch (type) {
                // 公众号
                case 2:
                    let link = is_main === 1 ? article_url : main_url;
                    this.$go(`/pages/webview/webview?link=${encodeURIComponent(link)}`);
                    break;
                case 3:
                    //视频号
                    if (wx.openChannelsActivity) {
                        wx.openChannelsActivity({
                            finderUserName: video_id,
                            feedId: video_account_id
                        });
                    } else {
                        wx.showModal({
                            icon: 'none',
                            title: '当前微信版本过低',
                            content: '升级后再使用,微信版本要求>=8.0.10'
                        });
                    }
                    break;
                case 4:
                    let openMiniProgram = wx.navigateToMiniProgram;
                    if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                        openMiniProgram = wx.openEmbeddedMiniProgram;
                    }
                    openMiniProgram({
                        appId: type_id,
                        path: type_sid,
                        success(res) {}
                    });
                    break;
                case 5:
                    // 千猪外链
                    if (qz_url) {
                        const bgColor = this.getWebviewBgColor(qz_url);
                        this.$go(`/pages/webview/webview?link=${encodeURIComponent(qz_url)}&bgColor=${bgColor}`);
                    }
                    break;
                case 6:
                    // 小程序内页
                    this.pageToUrl(detailData.data);
                    break;
            }

        },
        async immediateFun(item) {
            let {
                id,
                coupon_id,
                stock_num,
                status,
                is_popover,
                open_mini_type,
                type_id,
                type_sid
            } = item;
            const item_id = coupon_id || id;
            if (!type_id || !type_sid) {
                const detailData = await couponDetails({ id: item_id });
                type_id = detailData.data.type_id;
                type_sid = detailData.data.type_sid;
                stock_num = detailData.data.stock_num;
            }
            if ((stock_num <= 0) || (status == 0)) {
                return this.goCouponDetails(item_id, is_popover);
            }
            let openMiniProgram = wx.navigateToMiniProgram;
            if (open_mini_type == 2 && wx.canIUse('openEmbeddedMiniProgram')) {
                openMiniProgram = wx.openEmbeddedMiniProgram;
            }
            openMiniProgram({
                appId: type_id,
                path: type_sid,
                // envVersion: 'trial',
                fail: function(error) {
                    _that.$emit('notOpenMini');
                },
                success: function(res) {}
            });
            const exchangeData = await exchange({
                id: item_id,
                is_popover,
            });

        },
        goCouponDetails(id, is_popover) {
            if (!this.isAutoLogin) return this.$go('/pages/tabAbout/login/index');
            this.$go(`/pages/shopMallModule/couponDetails/index?id=${id}&is_popover=${is_popover || 0}`);
        },
        jlZtOpenFun(item) {
            const { is_zt, is_jl, open_mini_type, type_sid } = item;
            // 小程序配置内部页面 - 专题
            if (is_zt && open_mini_type == 2) {
                this.$emit('openSpecialListMini', type_sid); // 组件抛出去的方法
                return;
            }
            // 小程序配置内部页面 - 捡漏
            if (is_jl && open_mini_type == 2) {
                this.$emit('openRepairGetMini'); // 组件抛出去的方法
                return;
            }
            this.$go(type_sid);
        }
    },
    mounted() {}
}
export default goDetailsFun;
