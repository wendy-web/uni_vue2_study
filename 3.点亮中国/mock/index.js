const Mock = require('./WxMock');
import { BASEURL } from '@/config';

// 点赞
Mock.mock(`${BASEURL}/api/commonweal/like`, {
    statusCode: 200,
    'data|1': [{
        ret: 0,
        msg: '点赞成功',
        code: "1",
        data: "",
        time: 0.14038801193237305
    }, ],
});
// 公益的详情页 -
Mock.mock(`${BASEURL}/api/commonweal/getUserDetail`, {
    statusCode: 200,
    'data|1': [{
        code: "1",
        data: {
            id: 1,
            image: "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
            title: "帮助乡村儿童温暖过冬",
            intro: "壹基金温暖包计划为乡村儿童送上棉衣、棉鞋、帽子、围巾等帮助他们温暖过冬",
            explain: "温暖包实际发放以“壹基金温暖包计划”2022发放计划为准",
            donate: [], // 捐献轮播记录
            plan_love: 1241000,
            love: 1639,
            plan_num: 340,
            num: 311,
            status: 1, // 0 温暖包的内容 1 阅读包的内容
            progress_title: "",
            progress_subtitle: "340名儿童已收到温暖包",
            progress_content: "3456人参与温暖包计划，累计捐献1,241,000能量。为xx省xx市 xx小学捐出124,000元",
            like_num: 1,
            donate_total: {
                num: 3,
                love: "7"
            },
            content: "https://file.y1b.cn/api3/litchina/commonweal/item_1/detail.png",
            introduce: `
					<h5>项目介绍</h5>
					<div>我国困境儿童现状</div>
					<div>截至2018年8月底，全国共有全国共有农村留守儿童697万 人， 其中，96%的农村留守儿童由（外）祖父母隔代照料。全国事实 无人抚养儿童大约50万左右，普遍存在生活保障标准相对较低、 很难得到有效的监护、部分儿童存在心理问题等方面的问题。</div>
				`,
            institution: `
					<h5>机构介绍内容标题</h5>
					<div>名称：深圳壹基金公益基金会</div>
					<div>机构简介</div>
					<div>壹基金最早由李连杰先生于2007年创立，以“尽我所能、人人公 益”为愿景，专注于灾害救助、儿童关怀与发展、公益支持与创新 三大领域。2010年12月，深圳壹基金公益基金会作为第一家民间 公募基金会在深圳注册，是5A级社会组织，连续十年保持信息公 开透明度满分，两度获得慈善领域政府最高奖“中华慈善奖”，并 获得“先进基层党组织”“鹏城慈善40年致敬单位”“深圳青年五四 奖章”等荣誉。 自发起到2021年底，壹基金共获得超过71亿人次捐赠支持及信任 托付，收到善款和物资捐赠超过32亿元，帮助了超过2500万人次 改善困境、过上更有尊严的生活。这个过程中，壹基金联合全国 超过2000家社会组织和230万人次志愿者一起行动，带动更多人 参与公益。</div>
					h5>机构介绍内容标题</h5>
					<div>名称：深圳壹基金公益基金会</div>
					<div>机构简介</div>
					<div>壹基金最早由李连杰先生于2007年创立，以“尽我所能、人人公 益”为愿景，专注于灾害救助、儿童关怀与发展、公益支持与创新 三大领域。2010年12月，深圳壹基金公益基金会作为第一家民间 公募基金会在深圳注册，是5A级社会组织，连续十年保持信息公 开透明度满分，两度获得慈善领域政府最高奖“中华慈善奖”，并 获得“先进基层党组织”“鹏城慈善40年致敬单位”“深圳青年五四 奖章”等荣誉。 自发起到2021年底，壹基金共获得超过71亿人次捐赠支持及信任 托付，收到善款和物资捐赠超过32亿元，帮助了超过2500万人次 改善困境、过上更有尊严的生活。这个过程中，壹基金联合全国 超过2000家社会组织和230万人次志愿者一起行动，带动更多人 参与公益。</div>
				`,
            perform: [{
                id: 1,
                title: "",
                content: "执行说明文本",
                images: [
                    "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
                    "https://file.y1b.cn/api3/litchina/city/guangdong/shaoguan.png",
                    "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
                    "https://file.y1b.cn/api3/litchina/city/guangdong/shaoguan.png"
                ],
                create_time: "2023-03-07 16:58:16"
            }],
            like_status: 0
        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});
// https://bfzx-test.y1b.cn/api/commonweal/donate
Mock.mock(`${BASEURL}/api/commonweal/donate2`, {
    statusCode: 200,
    'data|1': [{
        code: "1",
        data: {
            id: 1,
            image: "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
            title: "帮助乡村儿童温暖过冬",
            intro: "壹基金温暖包计划为乡村儿童送上棉衣、棉鞋、帽子、围巾等帮助他们温暖过冬",
            explain: "温暖包实际发放以“壹基金温暖包计划”2022发放计划为准",
            donate: [], // 捐献轮播记录
            plan_love: 1241000,
            love: 1639,
            plan_num: 340,
            num: 311,
            status: 1, // 0 温暖包的内容 1 阅读包的内容
            progress_title: "1121",
            progress_subtitle: "340名儿童已收到温暖包",
            progress_content: "3456人参与温暖包计划，累计捐献1,241,000能量。为xx省xx市 xx小学捐出124,000元",
            like_num: 1,
            donate_total: {
                num: 3,
                love: "7"
            },
            content: "https://file.y1b.cn/api3/litchina/commonweal/item_1/detail.png",
            introduce: `
					<h5>项目介绍</h5>
					<div>我国困境儿童现状</div>
					<div>截至2018年8月底，全国共有全国共有农村留守儿童697万 人， 其中，96%的农村留守儿童由（外）祖父母隔代照料。全国事实 无人抚养儿童大约50万左右，普遍存在生活保障标准相对较低、 很难得到有效的监护、部分儿童存在心理问题等方面的问题。</div>
				`,
            institution: `
					<h5>机构介绍内容标题</h5>
					<div>名称：深圳壹基金公益基金会</div>
					<div>机构简介</div>
					<div>壹基金最早由李连杰先生于2007年创立，以“尽我所能、人人公 益”为愿景，专注于灾害救助、儿童关怀与发展、公益支持与创新 三大领域。2010年12月，深圳壹基金公益基金会作为第一家民间 公募基金会在深圳注册，是5A级社会组织，连续十年保持信息公 开透明度满分，两度获得慈善领域政府最高奖“中华慈善奖”，并 获得“先进基层党组织”“鹏城慈善40年致敬单位”“深圳青年五四 奖章”等荣誉。 自发起到2021年底，壹基金共获得超过71亿人次捐赠支持及信任 托付，收到善款和物资捐赠超过32亿元，帮助了超过2500万人次 改善困境、过上更有尊严的生活。这个过程中，壹基金联合全国 超过2000家社会组织和230万人次志愿者一起行动，带动更多人 参与公益。</div>
					h5>机构介绍内容标题</h5>
					<div>名称：深圳壹基金公益基金会</div>
					<div>机构简介</div>
					<div>壹基金最早由李连杰先生于2007年创立，以“尽我所能、人人公 益”为愿景，专注于灾害救助、儿童关怀与发展、公益支持与创新 三大领域。2010年12月，深圳壹基金公益基金会作为第一家民间 公募基金会在深圳注册，是5A级社会组织，连续十年保持信息公 开透明度满分，两度获得慈善领域政府最高奖“中华慈善奖”，并 获得“先进基层党组织”“鹏城慈善40年致敬单位”“深圳青年五四 奖章”等荣誉。 自发起到2021年底，壹基金共获得超过71亿人次捐赠支持及信任 托付，收到善款和物资捐赠超过32亿元，帮助了超过2500万人次 改善困境、过上更有尊严的生活。这个过程中，壹基金联合全国 超过2000家社会组织和230万人次志愿者一起行动，带动更多人 参与公益。</div>
				`,
            perform: [{
                id: 1,
                title: "执行情况- title",
                content: "执行说明文本",
                images: [
                    "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
                    "https://file.y1b.cn/api3/litchina/city/guangdong/shaoguan.png",
                    "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
                    "https://file.y1b.cn/api3/litchina/city/guangdong/shaoguan.png"
                ],
                create_time: "2023-03-07 16:58:16"
            }],
            like_status: 0
        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});

Mock.mock(`${BASEURL}/api/commonweal/getDonateUserTop`, {
    statusCode: 200,
    'data|1': [{
        code: "1",
        data: {
            list: [1, 2, 2, 5, 4454, 445, 44]
        },
        msg: "",
        time: 0.012407064437866211
    }, ],
});

// 成就的list
Mock.mock(`${BASEURL}/api/commonweal/getUserCertList`, {
    statusCode: 200,
    'data|1': [{
        "code": "1",
        "data": {
            "total": {
                "com_cert_num": 17,
                "com_num": 2
            },
            "list": [{
                    "id": 1,
                    "image": "https://file.y1b.cn/store/1-0/23322/641aab252eb51.jpg",
                    "title": "乡村儿童阅读包计划 - -温暖包",
                    "intro": "致力于让乡村儿童读更多的书，看更广的世界",
                    "explain": "阅读包实际发放以“壹基金阅读包”2023发放计划为准",
                    "plan_love": 876000,
                    "love": 8358,
                    "plan_num": 800,
                    "num": 2,
                    "status": 0, // 0 温暖包的内容 1 是阅读包的内容
                    "start_time": "2023-03-27",
                    "end_time": "2023-06-30",
                    "donate_love": 3,
                    "donate_list": [{
                        "id": 54871,
                        "com_id": 2,
                        "image": "https://file.y1b.cn/api3/227733/20230307/a64069f1f79ecc.jpeg",
                        "name": "wendy",
                        "uid": 227733,
                        "team_id": null,
                        "love": 3,
                        "create_time": "2023-03-31 16:53:43"
                    }]
                },
                {
                    "id": 1,
                    "image": "https://file.y1b.cn/api3/litchina/commonweal/item_1/cover.png",
                    "title": "帮助 ---- 阅读包",
                    "intro": "壹基金温暖包计划为乡村儿童送上棉衣、棉鞋、帽子、围巾等帮助他们温暖过冬",
                    "explain": "温暖包实际发放以“壹基金温暖包计划”2022发放计划为准",
                    "plan_love": 1241000,
                    "love": 68458,
                    "plan_num": 340,
                    "num": 18,
                    "status": 1,
                    "start_time": null,
                    "end_time": null,
                    "donate_love": 46,
                    "donate_list": [{
                        "id": 41358,
                        "com_id": 1,
                        "image": "https://file.y1b.cn/api3/227733/20230307/a64069f1f79ecc.jpeg",
                        "name": "wendy",
                        "uid": 227733,
                        "team_id": null,
                        "love": 3,
                        "create_time": "2023-03-13 15:17:20"
                    }, ]
                }
            ],
            "next": 2,
            "limit": "10"
        },
        "msg": "",
        "time": 0.007619142532348633
    }],
});