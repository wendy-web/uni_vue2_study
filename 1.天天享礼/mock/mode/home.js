import { getBaseUrl } from '@/utils/auth';
const Mock = require('../module/WxMock');
const BASEURL = getBaseUrl();
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
