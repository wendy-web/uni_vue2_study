import API from '../xhHttp.js';

// 申请团长
export function apply(data) {
    return API.request({
        url: '/api/Team_apply/apply',
        method: 'post',
        data
    });
}
// 团长申请结果查询
export function applyInfo(data) {
    return API.request({
        url: '/api/team_apply/applyInfo',
        method: 'post',
        data
    });
}
// 团长信息
export function teamInfo(data) {
    return API.request({
        url: '/api/Team_apply/teamInfo',
        method: 'post',
        data
    });
}
// 申请补卡
export function applyCard(data) {
    return API.request({
        url: '/api/Team_apply/applyCard',
        method: 'post',
        data
    });
}
// 邀请记录
export function cardGrant(data) {
    return API.request({
        url: '/api/Team_apply/cardGrant',
        method: 'post',
        data
    });
}
// 收益走势图
export function profitChart(data) {
    return API.request({
        url: '/api/team_apply/profitChart',
        method: 'post',
        data
    });
}
// 收益明细
export function profitDetail(data) {
    return API.request({
        url: '/api/team_apply/profitDetail',
        method: 'post',
        data
    });
}
// 申请提现
export function withdraw(data) {
    return API.request({
        url: '/api/team_apply/withdraw',
        method: 'post',
        data
    });
}

// 提现记录
export function withdrawLog(data) {
    return API.request({
        url: '/api/team_apply/withdrawLog',
        method: 'post',
        data
    });
}

// 消息模板id
export function msgTemplate(data) {
    return API.request({
        url: '/api/team_apply/msgTemplate',
        method: 'post',
        data
    });
}

// 收益授权
export function isSend(data) {
    return API.request({
        url: '/api/team_apply/stop',
        method: 'post',
        data
    });
}

// 文案配置
export function wordConfig(data) {
    return API.request({
        url: '/api/team_apply/wordConfig',
        method: 'post',
        data
    });
}

// 邀请信息
export function inviteXq(data) {
    return API.request({
        url: '/api/team_apply/inviteXq',
        method: 'post',
        data
    });
}

// 详情内容获取
export function goodsDetails(data) {
    return API.request({
        url: '/api/pinduoduo/goodsDetails',
        method: 'post',
        data
    });
}

// 分享
export function goodsExtend(data) {
    return API.request({
        url: `/api/pinduoduo/goodsExtend`,
        method: 'post',
        data
    });
}

// 身份证验证
export function idcardVerify(data) {
    return API.request({
        url: `/api/Team_apply/idcardVerify`,
        method: 'post',
        data
    });
}
