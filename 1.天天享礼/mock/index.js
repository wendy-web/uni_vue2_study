import { getBaseUrl } from '@/utils/auth';
import './mode/home.js'; // 首页的mock数据
import './mode/task.js'; // 首页的mock数据
const Mock = require('./module/WxMock');
const BASEURL = getBaseUrl();

// 领红包任务
Mock.mock(`${BASEURL}/api/task/scheduleActivity`, {
    statusCode: 200,
    'data|1': [{
        code: 1,
        data: {
            enter_num: 1,
            num: 20,
            start_time: '2023-01-04',
            end_time: '2023-11-28',
            app_id: '900',
            path: '11'

        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});

// 商品卷类型
Mock.mock(`${BASEURL}/api/profile/myCoupon`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "total": 7,
            "per_page": 10,
            "current_page": 1,
            "last_page": 1,
            "data": [{
                    "id": 497,
                    "coupon_id": 123,
                    "title": "视频观看券",
                    "expire_time": "2023-03-31 13:44:28",
                    "image": "https://test-file.y1b.cn/store/1-0/23325/641e731017309.png",
                    "status": 2,
                    "face_value": "8.00",
                    "type": 1,
                    "is_main": 1,
                    "article_url": "https://mp.weixin.qq.com/s?__biz=Mzg5OTkwOTAyNw==&amp;amp;mid=2247483657&amp;amp;idx=1&amp;amp;sn=ee9ca98df99dc75bf5cfef3666a3c732&amp;amp;chksm=c04d55c5f73adcd3a6d587c60cfa63858775a0e30cddea550f2f53696c160d4a884a2d0d58c7#rd",
                    "main_url": "",
                    "type_id": "",
                    "type_sid": "",
                    "video_id": "sphWlHsY8O6FFnH",
                    "video_account_id": "export/UzFfAgtgekIEAQAAAAAAxgQ5snG_YgAAAAstQy6ubaLX4KHWvLEZgBPE96EASXg3L9KAzNPgMJpJQK0zyfnm2nTUOlOtXcFK",
                    "is_order": 1,
                    "order_id": 134
                },
                {
                    "id": 497,
                    "coupon_id": 123,
                    "title": "视频观看券",
                    "expire_time": "2023-03-31 13:44:28",
                    "image": "https://test-file.y1b.cn/store/1-0/23325/641e731017309.png",
                    "status": 3,
                    "face_value": "8.00",
                    "type": 1,
                    "is_main": 1,
                    "article_url": "https://mp.weixin.qq.com/s?__biz=Mzg5OTkwOTAyNw==&amp;amp;mid=2247483657&amp;amp;idx=1&amp;amp;sn=ee9ca98df99dc75bf5cfef3666a3c732&amp;amp;chksm=c04d55c5f73adcd3a6d587c60cfa63858775a0e30cddea550f2f53696c160d4a884a2d0d58c7#rd",
                    "main_url": "",
                    "type_id": "",
                    "type_sid": "",
                    "video_id": "sphWlHsY8O6FFnH",
                    "video_account_id": "export/UzFfAgtgekIEAQAAAAAAxgQ5snG_YgAAAAstQy6ubaLX4KHWvLEZgBPE96EASXg3L9KAzNPgMJpJQK0zyfnm2nTUOlOtXcFK",
                    "is_order": 1,
                    "order_id": 134
                },
                {
                    "id": 146,
                    "coupon_id": 123,
                    "title": "视频观看券",
                    "expire_time": "2023-03-31 13:51:03",
                    "image": "https://test-file.y1b.cn/store/1-0/23325/641e731017309.png",
                    "status": 0,
                    "face_value": "8.00",
                    "type": 1,
                    "is_main": 1,
                    "article_url": "https://mp.weixin.qq.com/s?__biz=Mzg5OTkwOTAyNw==&amp;amp;mid=2247483657&amp;amp;idx=1&amp;amp;sn=ee9ca98df99dc75bf5cfef3666a3c732&amp;amp;chksm=c04d55c5f73adcd3a6d587c60cfa63858775a0e30cddea550f2f53696c160d4a884a2d0d58c7#rd",
                    "main_url": "",
                    "type_id": "",
                    "type_sid": "",
                    "video_id": "sphWlHsY8O6FFnH",
                    "video_account_id": "export/UzFfAgtgekIEAQAAAAAAxgQ5snG_YgAAAAstQy6ubaLX4KHWvLEZgBPE96EASXg3L9KAzNPgMJpJQK0zyfnm2nTUOlOtXcFK",
                    "is_order": 0,
                    "order_id": 0
                },
            ]
        },
        "msg": "success",
        "time": 0.012170076370239258
    }],
});

// 订单支付
Mock.mock(`${BASEURL}/api/shop/pay`, {
    statusCode: 200,
    'data|1': [{
        "code": "0",
        "data": '',
        "msg": "订单已取消",
        "time": 0.012170076370239258
    }],
});
// 订单列表
Mock.mock(`${BASEURL}/api/profile/myOrder`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        data: {
            "total": 5,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "data": [{
                    "amount": 5000,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": "OFFLINE",
                    "cid1": null,
                    "cid3": null,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 600,
                    "coupon_id": 99,
                    "create_time": "2024-07-13 10:07:43",
                    "expire_time": "2024-07-13 10:17:43",
                    "goods_id": 126,
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23217/63ef187ae7242.jpg",
                    "goods_sign": null,
                    "goods_sku_name": "e袋洗充值卡50元",
                    "goods_type": 0,
                    "id": 24770,
                    "leshua_order_code": null,
                    "off_time": null,
                    "pay_amount": 4400,
                    "pay_way": "WXZF",
                    "qr_codes": null,
                    "restaurant_name": null,
                    "result_code": "0",
                    "send_time": null,
                    "skuId": null,
                    "status": 0,
                    "third_order_id": "20240713100743231167",
                    "ticket_id": 3210
                },
                {
                    "amount": 3980,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": 29,
                    "cid1": 15901,
                    "cid3": 15908,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 0,
                    "coupon_id": null,
                    "create_time": "2024-07-08 18:40:35",
                    "expire_time": "2024-07-08 18:40:35",
                    "goods_id": null,
                    "goods_imgs": "https://img14.360buyimg.com/pop/jfs/t1/243261/10/6571/46932/660a5958F202641c5/4daba2234e33a193.jpg",
                    "goods_sign": null,
                    "goods_sku_name": "植护悦色蓝色压花纸面巾 140*175/4层 320张 3包/袋",
                    "goods_type": 5,
                    "id": 24434,
                    "jdShareLink": "/pages/order/detail/detail?id=294861247387",
                    "leshua_order_code": "3100984667",
                    "lx_type": 2,
                    "off_time": null,
                    "orderNo": "294861247387",
                    "pay_amount": 980,
                    "pay_way": "jd",
                    "qr_codes": null,
                    "queryId": "3as8Hwr7dPloUqg3xa",
                    "restaurant_name": null,
                    "result_code": null,
                    "send_time": null,
                    "skuId": "3as8Hwr7dPloUqg3xa",
                    "status": 2,
                    "third_order_id": "1013518480128466944",
                    "ticket_id": null,
                    "type_id": "wx91d27dbf599dff74",
                    "profit_money": 1.5
                },
                {
                    "amount": 1500,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": "OFFLINE",
                    "cid1": null,
                    "cid3": null,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 500,
                    "coupon_id": 3,
                    "create_time": "2024-07-08 13:57:08",
                    "expire_time": "2024-07-08 14:07:08",
                    "goods_id": 346,
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23120/63c9ebaf14c27.png",
                    "goods_sign": null,
                    "goods_sku_name": "饿了么超级会员月卡",
                    "goods_type": 1,
                    "id": 24249,
                    "leshua_order_code": null,
                    "off_time": null,
                    "pay_amount": 1000,
                    "pay_way": "WXZF",
                    "qr_codes": null,
                    "restaurant_name": null,
                    "result_code": "0",
                    "send_time": null,
                    "skuId": null,
                    "status": 1,
                    "third_order_id": "20240708135708556954",
                    "ticket_id": 3207
                },
                {
                    "amount": 1500,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": "OFFLINE",
                    "cid1": null,
                    "cid3": null,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 500,
                    "coupon_id": 3,
                    "create_time": "2024-07-08 13:57:08",
                    "expire_time": "2024-07-08 14:07:08",
                    "goods_id": 346,
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23120/63c9ebaf14c27.png",
                    "goods_sign": null,
                    "goods_sku_name": "饿了么超级会员月卡",
                    "goods_type": 1,
                    "id": 24249,
                    "leshua_order_code": null,
                    "off_time": null,
                    "pay_amount": 1000,
                    "pay_way": "WXZF",
                    "qr_codes": null,
                    "restaurant_name": null,
                    "result_code": "0",
                    "send_time": null,
                    "skuId": null,
                    "status": 0,
                    "third_order_id": "20240708135708556954",
                    "ticket_id": 3207
                },
                {
                    "amount": 1500,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": "OFFLINE",
                    "cid1": null,
                    "cid3": null,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 500,
                    "coupon_id": 3,
                    "create_time": "2024-07-08 13:57:08",
                    "expire_time": "2024-07-08 14:07:08",
                    "goods_id": 346,
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23120/63c9ebaf14c27.png",
                    "goods_sign": null,
                    "goods_sku_name": "饿了么超级会员月卡",
                    "goods_type": 1,
                    "id": 24249,
                    "leshua_order_code": null,
                    "off_time": null,
                    "pay_amount": 1000,
                    "pay_way": "WXZF",
                    "qr_codes": null,
                    "restaurant_name": null,
                    "result_code": "0",
                    "send_time": null,
                    "skuId": null,
                    "status": 1,
                    "third_order_id": "20240708135708556954",
                    "ticket_id": 3207
                },
                {
                    "amount": 1500,
                    "card_deadline": null,
                    "card_status": null,
                    "channel_flag": "OFFLINE",
                    "cid1": null,
                    "cid3": null,
                    "codes": null,
                    "complete_time": null,
                    "coupon_amount": 500,
                    "coupon_id": 3,
                    "create_time": "2024-07-08 13:57:08",
                    "expire_time": "2024-07-08 14:07:08",
                    "goods_id": 346,
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23120/63c9ebaf14c27.png",
                    "goods_sign": null,
                    "goods_sku_name": "饿了么超级会员月卡",
                    "goods_type": 1,
                    "id": 24249,
                    "leshua_order_code": null,
                    "off_time": null,
                    "pay_amount": 1000,
                    "pay_way": "WXZF",
                    "qr_codes": null,
                    "restaurant_name": null,
                    "result_code": "0",
                    "send_time": null,
                    "skuId": null,
                    "status": 1,
                    "third_order_id": "20240708135708556954",
                    "ticket_id": 3207
                }
            ]
        },
        "msg": "success",
        "time": 0.0072901248931884766
    }],
});
// 订单详情
Mock.mock(`${BASEURL}/api/profile/myOrderDetail`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "id": 158,
            "goods_sku_name": "周黑鸭10元代金券--mock",
            "goods_market_price": 1000,
            "goods_imgs": "https://file.y1b.cn/store/1-0/23210/63e5ebe9ced63.jpg",
            "goods_type": 1,
            "create_time": "2023-03-25 16:25:07",
            "coupon_title": "周黑鸭满10减7元优惠券----wendy",
            "coupon_face_value": "7.00",
            "third_order_id": "20230325162507305107",
            "charge_account": null,
            "card_code_link": null,
            "card_qr_link": null,
            "card_number": null,
            "card_pwd": null,
            "card_deadline": null,
            "card_status": null,
            "pay_way": "WXZF",
            "pay_time": null,
            "status": 5,
            "complete_time": null,
            "goods_instruction": "&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;1.有效期：&lt;/strong&gt;&lt;/span&gt;&lt;span style=&quot;color: rgb(225, 60, 57); font-size: 14px;&quot;&gt;&lt;strong&gt;请在购买后24小时内兑换使用&lt;/strong&gt;&lt;/span&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;；&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.购买后在【订单详情】中查看券码；&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;3.兑换流程如遇问题，可咨询客服。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;strong&gt;兑换流程：&lt;/strong&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;color: rgb(225, 60, 57);&quot;&gt;&lt;strong&gt;【周黑鸭官方旗舰店】公众号—菜单栏【进入商城】—选择商品加入购物车—购物车—结算—优惠券—输入兑换码&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;兑换完成后点击代金券上立即使用即可购买对应产品，仅限立即使用中产品可用。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;温馨提示：&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;1.如有质量问题，请在购买后24小时内联系客服，过期作废，非质量问题无法退换，介意勿拍。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.代金券仅购买原价商品时可用，每个订单限用1张，不与其他优惠叠加，代金券仅限大陆地区使用。&lt;/span&gt;&lt;/p&gt;",
            "goods_details": "&lt;p&gt;&lt;br&gt;&lt;/p&gt;",
            "order_guide": "&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;1.有效期：&lt;/strong&gt;&lt;/span&gt;&lt;span style=&quot;color: rgb(225, 60, 57); font-size: 14px;&quot;&gt;&lt;strong&gt;请在购买后24小时内兑换使用&lt;/strong&gt;&lt;/span&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;；&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.购买后在【订单详情】中查看券码；&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;3.兑换流程如遇问题，可咨询客服。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;strong&gt;兑换流程：&lt;/strong&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;color: rgb(225, 60, 57);&quot;&gt;&lt;strong&gt;【周黑鸭官方旗舰店】公众号—菜单栏【进入商城】—选择商品加入购物车—购物车—结算—优惠券—输入兑换码&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;兑换完成后点击代金券上立即使用即可购买对应产品，仅限立即使用中产品可用。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;温馨提示：&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;1.如有质量问题，请在购买后24小时内联系客服，过期作废，非质量问题无法退换，介意勿拍。&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.代金券仅购买原价商品时可用，每个订单限用1张，不与其他优惠叠加，代金券仅限大陆地区使用。&lt;/span&gt;&lt;/p&gt;"
        },
        "msg": "success",
        "time": 0.005298137664794922
    }],
});
Mock.mock(`${BASEURL}/api/shop/applyCoupon`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "coupon_id": 146,
            "coupon_title": "优酷视频VIP月卡17元优惠券",
            "coupon_face_value": "17.00",
            "goods_id": 119,
            "goods_market_price": 30,
            "goods_name": "优酷黄金会员VIP月卡",
            "goods_instruction": "&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;1.本商品仅支持手机号充值，请确保充值账号填写无误，因官方平台明确售出后不得退换，经充值成功将不支持退换，介意慎拍；&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.充值如遇问题，可联系客服咨询；&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;3.有效期：以官方约定为准；&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;4.一经售出，均不退不换，介意慎拍！&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;温馨提示：&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;&lt;strong&gt;1.优酷会员支持手机、电脑、ipad上使用，不支持TV电视端，酷喵VIP会员支持手机、电脑、ipad、电视端使用；&lt;/strong&gt;&lt;/span&gt;&lt;/p&gt;&lt;p style=&quot;text-align: start;&quot;&gt;&lt;span style=&quot;font-size: 14px;&quot;&gt;2.本商品仅支持在中国境内使用。&lt;/span&gt;&lt;/p&gt;",
            "goods_type": 0,
            "goods_details": "&lt;p&gt;&lt;br&gt;&lt;/p&gt;",
            "cz_type": 2,
            "cz_type_intro": "其他账号充值"
        },
        "msg": "success",
        "time": 0.007318019866943359
    }],
});
Mock.mock(`${BASEURL}/api/index/banner`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": [{
            "image": "https://file.y1b.cn/store/1-0/23216/63ee065407676.png",
            "title": "",
            "coupon_id": 7
        }],
        "msg": "success",
        "time": 0.0035109519958496094
    }],
});


// 收益列表
Mock.mock(`${BASEURL}/api/profit/profitList`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        data: {
            "total": 5,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "list": [{
                    "create_time": "2024-07-08 18:40:35",
                    "id": 127,
                    "note": "",
                    "profit": 3.3,
                    "profit_status": 1,
                    "third_order_id": "1013518480128466944",
                    "title": "会员笔笔返",
                    "vip_order": 1
                },
                {
                    "create_time": "2024-07-08 18:40:35",
                    "id": 1297,
                    "note": "",
                    "profit": 3.3,
                    "profit_status": 0,
                    "third_order_id": "1013518480128466944",
                    "title": "会员笔笔返",
                    "vip_order": 1
                }
            ]
        },
        "msg": "success",
        "time": 0.0072901248931884766
    }],
});


// 领取收益
Mock.mock(`${BASEURL}/api/profit/profitGet`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        data: {
            "total": 5,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "list": []
        },
        "msg": "success",
        "time": 0.0072901248931884766
    }],
});
