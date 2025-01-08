import { bysubunionid } from '@/api/modules/jsShop.js';
import { share } from "@/api/modules/login.js";
import { goodsPromotion } from '@/api/modules/pddShop.js';
const shareMixin = {
    data() {
        return {
            currentSharePage: '', // 当前页面的路径
            currentSharePageNum: 6, // 当前页面的类型page，用于接口获取事件
            currentSharePageObj: {},
            pageShareObj: [{
                    route: 'pages/tabBar/shopMall/index',
                    pageNum: 1,
                    text: '首页',
                    defaultTitle: '领券啦！领了优惠券再下单，又省了一笔钱',
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/202303/share_shopmall.png',
                    isBtnShare: 'specialMini',
                    btnShareObj: null
                },
                {
                    route: 'pages/tabBar/task/index',
                    pageNum: 3,
                    text: '福利中心',
                    defaultTitle: '送你一份优惠券大礼包，第陆位领取手气最佳',
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/img/202303/share_task.png',
                    isBtnShare: 'specialMini',
                    btnShareObj: null
                },
                {
                    route: 'pages/tabBar/user/index',
                    pageNum: 4,
                    text: '我的',
                    defaultTitle: '在吗，优惠天天领，最高99元，立即点击领取→',
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/img/202303/share_user.png',
                    shareRoute: 'pages/tabBar/shopMall/index?', // 分享进入的路径
                    isBtnShare: 'specialMini',
                    btnShareObj: null
                },
                {
                    route: 'pages/userModule/allowance/redPacket/index',
                    pageNum: 6,
                    text: '外卖红包'
                },
                {
                    route: 'pages/userModule/allowance/recharge/index',
                    pageNum: 7,
                    text: '大牌直充'
                },
                {
                    route: 'pages/userModule/allowance/repairGet/index',
                    pageNum: 9,
                    text: '限时捡漏'
                },
                {
                    route: 'pages/userCash/cash/index',
                    pageNum: 12,
                    text: '领现金'
                },
                {
                    route: 'pages/shopMallModule/productDetails/index',
                    pageNum: 13,
                    text: '中转详情页',
                    defaultTitle: '',
                    defaultImg: '',
                    isBtnShare: 'productDetails'
                },
                {
                    route: 'pages/userModule/productList/index',
                    pageNum: 0, // 无后台配置
                    text: '领券中心',
                    defaultTitle: '领券下单更便宜',
                    isBtnShare: 'specialMini',
                    btnShareObj: null
                },
                {
                    route: 'pages/userModule/allowance/specialList/index',
                    pageNum: 0, // 无后台配置
                    text: '专题页面',
                    // pages/userModule/allowance/specialList/index?id=${this.id}
                },
                {
                    route: 'pages/userInfo/myCollect/index',
                    pageNum: 0, // 无后台配置
                    text: '我的收藏',
                    defaultTitle: '领券下单更便宜',
                    isBtnShare: 'cordList'
                },
                {
                    route: 'pages/userInfo/lookRecord/index',
                    pageNum: 0, // 无后台配置
                    text: '浏览记录',
                    defaultTitle: '领券下单更便宜',
                    isBtnShare: 'cordList'
                },
                {
                    route: 'pages/shopMallModule/feedDetailsList/index',
                    pageNum: 0, // 无后台配置
                    text: 'feed流页面',
                    defaultTitle: '领券啦！领了优惠券再下单，又省了一笔钱',
                    isBtnShare: 'feedList'
                },
                {
                    route: 'pages/shopMallModule/couponDetails/index',
                    pageNum: 0, // 无后台配置
                    text: '优惠券详情'
                },


            ],
            getShareCont: {}
        }
    },
    onLoad() {
        const pageList = getCurrentPages();
        const currentPageObj = pageList[pageList.length - 1];
        // 当前的path的路径
        this.currentSharePage = currentPageObj.route;
        // 当前page的默认定义字段
        this.currentSharePageObj = this.pageShareObj.find(res => res.route == this.currentSharePage);
        if (this.currentSharePageObj) {
            const page = this.currentSharePageObj.pageNum;
            this.getShare(page);
        }
        // 当前页面对应的page请求参数

    },
    methods: {
        async getShare(page) {
            const res = await share({ page });
            if (res.code != 1) return;
            this.getShareCont = res.data;
        },
        // 我的收藏与浏览记录的分享 --
        async shareMyCollectBtnFun(data, pathData) {
            let share = {};
            if (data.from == "button") {
                if (data.target.dataset) {
                    let shareItem = data.target.dataset.item;
                    // 进入分享页后返回上一页的页面路径 - 目前取消，默认跳转首页
                    let queryId = '';
                    const { image, skuId, lx_type, coupon_id, goods_sign, positionId, face_value } = shareItem;
                    let title = shareItem.title;
                    face_value && (title = `【${face_value}元券】${title}`);
                    share.title = title;
                    share.imageUrl = image;
                    if ([2, 3].includes(lx_type)) {
                        const params = {};
                        let requestApi = '';
                        if (lx_type == 3) {
                            requestApi = goodsPromotion;
                            params.goods_sign = goods_sign;
                            queryId = goods_sign;
                        } else {
                            requestApi = bysubunionid;
                            params.skuId = skuId;
                            queryId = skuId;
                        }
                        const skuRes = await requestApi(params);
                        if (skuRes.code == 0) {
                            this.$toast(skuRes.msg);
                        } else {
                            share.path = `/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${queryId}&positionId=${positionId}`;
                        }
                    } else {
                        share.path = `/pages/shopMallModule/couponDetails/index?id=${coupon_id}${pathData}`;
                    }

                }
            }
            return share;
        },
        shareFeedBtnFun(data, pathData) {
            let share = {}
            let shareItem = null;
            if (data.from == "button") {
                if (data.target.dataset) {
                    shareItem = data.target.dataset.item;
                }
            } else {
                const current = this.current;
                shareItem = this.feedList[current];
            }
            const {
                image,
                skuId,
                goods_sign,
                lx_type,
                face_value
            } = shareItem;
            let title = shareItem.title;
            let queryId = skuId;
            if (this.shop_type == 3) queryId = goods_sign;
            face_value && (title = `【${face_value}元券】${title}`);
            share.title = title || "领券啦！领了优惠券再下单，又省了一笔钱";
            share.imageUrl = image;
            share.path = `/pages/shopMallModule/productDetails/index?lx_type=${lx_type}&queryId=${queryId}${pathData}`;
            return share;
        },
        // 首页专题分享
        async homeSpecialBtnFun(data, pathData) {
            let share = null;
            let shareId = null;
            if (data.from == "button") {
                if (data.target.dataset) {
                    shareId = data.target.dataset.id;
                    const btnShareObj = this.currentSharePageObj.btnShareObj;
                    const specialUrl = `/pages/userModule/allowance/specialList/index?id=${shareId}`;
                    const { share_title, share_img, } = btnShareObj || {};
                    share = {
                        path: `/pages/tabBar/shopMall/index?specialUrl=${encodeURIComponent(specialUrl)}${pathData}`
                    }
                    share_title && (share.title = share_title);
                    share_img && (share.imageUrl = share_img);
                }
            }
            return share;
        }
    },
    async onShareAppMessage(data) {
        const { share_title, share_img, mlocid, plocid, team_uid, id } = this.getShareCont;
        let pathData = `&team_uid=${team_uid || 0}&mlocid=${mlocid || 0}&plocid=${plocid || 0}`;
        id && (pathData += `&id=${id}`); // 分享代入的id
        const { defaultTitle, defaultImg, shareRoute, isBtnShare } = this.currentSharePageObj;
        let pathUrl = shareRoute || `${this.currentSharePage}?`;
        let share = {
            title: share_title || defaultTitle,
            imageUrl: share_img || defaultImg,
            path: `${pathUrl}${pathData}`
        };
        if (isBtnShare == 'feedList') share = this.shareFeedBtnFun(data, pathData); // feed的分享
        if (isBtnShare == 'cordList') share = this.shareMyCollectBtnFun(data, pathData); // 记录分享
        // 专题半屏弹窗的分享
        if (isBtnShare == 'specialMini') {
            share = {
                ...share,
                ...await this.homeSpecialBtnFun(data, pathData)
            };
        }
        // 中转详情页的配置
        if (isBtnShare == 'productDetails') {
            const { goods_name, banner_image, face_value } = this.config;
            const proData = `&lx_type=${this.lx_type}&queryId=${this.queryId}`
            let title = share_title || goods_name;
            face_value && (title = `【${face_value}元券】${title}`);
            const [firstBannerImage] = banner_image;
            share = {
                title,
                imageUrl: share_img || this.showShareImage || firstBannerImage,
                path: `${share.path}${proData}`
            };
        }
        return share;
    },
}
export default shareMixin;