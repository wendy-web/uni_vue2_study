import { share } from "@/api/modules/login.js";
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
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/202303/share_shopmall.png'
                },
                {
                    route: 'pages/tabBar/discounts/index',
                    pageNum: 2,
                    text: '惠生活',
                    defaultTitle: '肯德基点餐5折起，天天疯狂星期四',
                    defaultImg: 'https://file.y1b.cn/store/1-0/23527/64719ea4deed0.png'
                },
                {
                    route: 'pages/tabBar/task/index',
                    pageNum: 3,
                    text: '福利中心',
                    defaultTitle: '送你一份优惠券大礼包，第陆位领取手气最佳',
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/img/202303/share_task.png'
                },
                {
                    route: 'pages/tabBar/user/index',
                    pageNum: 4,
                    text: '我的',
                    defaultTitle: '在吗，优惠天天领，最高99元，立即点击领取→',
                    defaultImg: 'https://file.y1b.cn/public/img/ttxl/img/202303/share_user.png',
                    shareRoute: 'pages/tabBar/shopMall/index?', // 分享进入的路径
                },
                {
                    route: 'pages/userModule/takeawayMenu/luckin/index',
                    pageNum: 5,
                    text: '瑞幸点单',
                    defaultTitle: '来杯瑞幸咖啡,开启一天好运',
                    defaultImg: '',
                    shareRoute: 'pages/userModule/takeawayMenu/luckin/index?brand_id=13&rote=1&pathSource=discounts', // 分享进入的路径
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
                    route: 'pages/userModule/takeawayMenu/mcDonald/index',
                    pageNum: 8,
                    text: '麦当劳',
                    defaultTitle: '麦当劳，欢迎您来',
                    defaultImg: '',
                    shareRoute: 'pages/userModule/takeawayMenu/mcDonald/index?brand_id=5&rote=1&pathSource=discounts'
                },
                {
                    route: 'pages/userModule/allowance/repairGet/index',
                    pageNum: 9,
                    text: '限时捡漏'
                },
                {
                    route: 'pages/userModule/takeawayMenu/kfc/index',
                    pageNum: 10,
                    text: '肯德基',
                    shareRoute: 'pages/userModule/takeawayMenu/kfc/index?brand_id=97&rote=1&pathSource=discounts'
                },
                {
                    route: 'pages/userModule/takeawayMenu/starbucks/index',
                    pageNum: 11,
                    text: '星巴克点餐',
                    shareRoute: 'pages/userModule/takeawayMenu/starbucks/index?brand_id=99&rote=1&pathSource=discounts'
                },
                {
                    route: 'pages/userModule/productList/index',
                    pageNum: 0, // 无后台配置
                    text: '领券中心',
                    defaultTitle: '领券下单更便宜',
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
        // 我的收藏与浏览记录的分享
        shareMyCollectBtnFun(data, pathData) {
            let share = {};
            if (data.from == "button") {
                if (data.target.dataset) {
                    let shareItem = data.target.dataset.item;
                    const sourceUrl = "/pages/userModule/productList/index";
                    const { title, image, skuId, cid1, cid3, lx_type, coupon_id, goods_sign, positionId } = shareItem;
                    share.title = title;
                    share.imageUrl = image;
                    if (lx_type == 2) {
                        // 分享进入feed流
                        share.path = `/pages/shopMallModule/feedDetailsList/index?cid1=${cid1}&skuId=${skuId}&cid3=${cid3}&sourceUrl=${sourceUrl}${pathData}`;
                    } else if (lx_type == 3) {
                        // 拼多多
                        share.path = `/pages/shopMallModule/feedDetailsList/index?goods_sign=${goods_sign}&positionId=${positionId || 0}${pathData}`;
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
                title,
                image,
                cid1,
                skuId,
                cid3,
                goods_sign,
                positionId,
            } = shareItem;
            let shareUrl = `cid1=${cid1}&skuId=${skuId}&cid3=${cid3}`;
            if (this.shop_type == 3) shareUrl = `goods_sign=${goods_sign}&positionId=${positionId || 0}`
            share.title = title || "领券啦！领了优惠券再下单，又省了一笔钱";
            share.imageUrl = image;
            share.path = `/pages/shopMallModule/feedDetailsList/index?${shareUrl}${pathData}`;
            return share;
        }
    },
    onShareAppMessage(data) {
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
        if (isBtnShare == 'feedList') share = this.shareFeedBtnFun(data, pathData);
        if (isBtnShare == 'cordList') share = this.shareMyCollectBtnFun(data, pathData);
        return share;
    },
}
export default shareMixin;