import { getBaseUrl } from '@/utils/auth';
const Mock = require('../module/WxMock');
const BASEURL = getBaseUrl();

Mock.mock(`${BASEURL}/api/task/expireOrder`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "id": 195,
            "create_time": "2023-04-17 10:48:55",
            "expire_time": "2023-04-17 14:58:55"
        },
        "msg": "success",
        "time": 0.005257844924926758
    }],
});