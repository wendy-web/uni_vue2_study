import { getBaseUrl } from '@/utils/auth';
import './mode/home.js'; // 首页的mock数据
import './mode/task.js'; // 首页的mock数据
const Mock = require('./module/WxMock');
const BASEURL = getBaseUrl();


// 商品详情
// Mock.mock(`${BASEURL}/api/index/couponDetails---`, {
//     statusCode: 200,
//     'data|1': [{
//         "code": "1",
//         "data": {
//             "id": 122,
//             "title": "跳转点亮中国小程序",
//             "face_value": "100.00",
//             "credits": 1,
//             "image": "https:\/\/test-file.y1b.cn\/store\/1-0\/23323\/641c04a021611.jpg",
//             "expiry_date": 60,
//             "stock_num": 87,
//             "used_num": 0,
//             "user_num": 100,
//             "exch_user_num": 13,
//             "explain": "&lt;p&gt;65463447437&lt;\/p&gt;",
//             "status": 1,
//             "create_time": "2023-03-23 15:50:23",
//             "update_time": "2023-04-06 17:52:44",
//             "device_type": 2,
//             "cz_type": 1,
//             "cz_type_intro": "请输入手机号码",
//             "act": 1,
//             "type": 4,
//             "is_main": 1,
//             "article_url": "",
//             "main_url": "",
//             "type_id": "wx98a1cc9f6a76fdf3",
//             "type_sid": "pages\/tabBar\/home\/index",
//             "video_id": "",
//             "video_account_id": "",
//             "activity_id": null,
//             "start_time": '2023-03-23 15:50:23',
//             "end_time": '2033-03-23 15:50:23',
//             "seckill_credits": null,
//             "activity_num": null,
//             "activity_enter_num": null,
//             "activity_type": null,
//             "collect": 0
//         },
//         "msg": "",
//         "time": 0.007740020751953125
//     }],
// });



// Mock.mock(`${BASEURL}/api/shop/buy`, {
//     statusCode: 200,
//     'data|1': [{
//         code: "3",
//         data: jspay_info: '{"appId":"wx6deb62d876c03d85","timeStamp":"1681538142","nonceStr":"71352c95a9be4087a94ab563668e04f6","package":"prepay_id=wx15135542273247c7fa6d55d831f5a30000","signType":"RSA","paySign":"Imo5UvROFq1dlVAk1HvJrYISc/C1pFpifDDZiG5zVgZNLTBSggEtA809WjnNbzFaJazdPedvyiml4sjsnS5RbSFbZzhVysX+N8clwB/uqGIL9jWQE7Y4Ksz1MRJ/HGohMoJHzU+5I8oGkSOblue22sH7y59wB02SO2YFSrxeWG98zdP79/+a7CK25XTEJOyCWbiP0cglC/V9Pk7ep3YQNXgaOTK1KYaVyInTA1ZzJFqr7gMQVmfXihE5wrPoAfU2SszbA+O24WlrsUXwLg+MERm+7W1Iz3Dr/SL2QI9OWuJRTfJ1dOX0+UGEHf8a1QfS+0QS3Qtuto6R+Q1XsoiPMA=="}'
//         order_id: "223"
//         msg: '855457578'
//         time: 0.5481669902801514
//     }],
// });

// 秒杀活动
Mock.mock(`${BASEURL}/api/index/limitActivity`, {
    statusCode: 200,
    'data|1': [{
        code: 1,
        data: {
            credits: 1,
            end_time: 0,
            face_value: 1,
            image: 2,
            start_time: 255,
            coupon_id: 5,
            num: 6,
            enter_num: 5,
            id: 5,
            title: 11455
        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});

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
// 订单列表
Mock.mock(`${BASEURL}/api/profile/myOrder`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "total": 5,
            "per_page": 15,
            "current_page": 1,
            "last_page": 1,
            "data": [{
                    "id": 162,
                    "goods_sku_name": "瑞幸咖啡29元饮品券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23216/63edd19d6792e.jpg",
                    "goods_type": 0,
                    "create_time": "2023-03-28 14:32:56",
                    "status": 0,
                    "pay_amount": 1650,
                    "card_deadline": null,
                    "card_status": null
                },
                {
                    "id": 161,
                    "goods_sku_name": "瑞幸咖啡29元饮品券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23216/63edd19d6792e.jpg",
                    "goods_type": 0,
                    "create_time": "2023-03-28 14:25:04",
                    "status": 1,
                    "pay_amount": 1650,
                    "card_deadline": null,
                    "card_status": null
                },
                {
                    "id": 160,
                    "goods_sku_name": "瑞幸咖啡29元饮品券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23216/63edd19d6792e.jpg",
                    "goods_type": 0,
                    "create_time": "2023-03-28 14:23:56",
                    "status": 2,
                    "pay_amount": 1650,
                    "card_deadline": null,
                    "card_status": null
                },
                {
                    "id": 159,
                    "goods_sku_name": "瑞幸咖啡29元饮品券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23216/63edd19d6792e.jpg",
                    "goods_type": 0,
                    "create_time": "2023-03-28 14:08:05",
                    "status": 3,
                    "pay_amount": 1650,
                    "card_deadline": null,
                    "card_status": null
                },
                {
                    "id": 158,
                    "goods_sku_name": "周黑鸭10元代金券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23210/63e5ebe9ced63.jpg",
                    "goods_type": 1,
                    "create_time": "2023-03-25 16:25:07",
                    "status": 4,
                    "pay_amount": 300,
                    "card_deadline": null,
                    "card_status": null
                },
                {
                    "id": 158,
                    "goods_sku_name": "周黑鸭10元代金券",
                    "goods_imgs": "https://file.y1b.cn/store/1-0/23210/63e5ebe9ced63.jpg",
                    "goods_type": 1,
                    "create_time": "2023-03-25 16:25:07",
                    "status": 5,
                    "pay_amount": 300,
                    "card_deadline": null,
                    "card_status": null
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
