import { getBaseUrl } from '@/utils/auth';
const Mock = require('../module/WxMock');
const BASEURL = getBaseUrl();
// 首页排行榜
Mock.mock(`${BASEURL}/api/index/ranking`, {
    statusCode: 200,
    'data|1': [{
        code: 1,
        data: {
            exchangeRankList: [{
                    image: '',
                    title: '11',
                    coupon_id: 1
                },
                {
                    image: '',
                    title: '12221',
                    coupon_id: 2
                },
                {
                    image: '',
                    title: '11',
                    coupon_id: 3
                }
            ],
            bestValueList: [{
                    image: '',
                    title: '11',
                    coupon_id: 1
                },
                {
                    image: '',
                    title: '12221',
                    coupon_id: 2
                },
                {
                    image: '',
                    title: '11',
                    coupon_id: 3
                }
            ]
        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});
// 更新的
Mock.mock(`${BASEURL}/api/user/getCredits`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "bfxl": {
                "credits": "1",
                "isReg": 1
            },
            "bfzx": {
                "credits": "0",
                "isReg": 1
            },
            "bfyl": {
                "credits": "33",
                "isReg": 1
            }
        },
        "msg": "",
        "time": 0.008987903594970703
    }],
});

// 牛金豆
Mock.mock(`${BASEURL}/api/user/decCredits`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "user": {
                "id": 68,
                "credits": "2"
            },
            num: 12
        },
        "msg": "积分不足无法升级",
        "time": 0.015094995498657227
    }],
});