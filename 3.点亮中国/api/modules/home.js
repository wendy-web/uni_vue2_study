import http from '../http.js';

//部分接口缓存时间
const cacheMaxAge = 12000
    //获取个人map数据
export function getUserGeo(data) {
    return http({
        url: '/api/map/getUserGeo',
        method: 'post',
        data,
        isNoLoading: true
    });
}

//获取中国地图json
export function getCoordinates() {
    return http({
        url: '/api/map/getCoordinates',
        method: 'post'
            // ,
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge//缓存有效时间  单位秒
    });
}

//获取个人点亮的城市
export function getUserCity(data) {
    return http({
        url: '/api/city/getUserCity',
        method: 'post',
        data,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

//获取个人点亮的城市
export function getUserCity2(data) {
    return http({
        url: '/api/city/getUserCity2',
        method: 'post',
        data,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
//个人能量获取记录
export function getUserLoveList(data) {
    return http({
        url: '/api/city/getUserLoveList',
        method: 'post',
        data
        // isCache:true,//是否开启缓存
        // type:'cache',//接口类型 cache 属于缓存类型
        // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

//获取个人勋章
export function getUserMedal(data) {
    return http({
        url: '/api/medal/getUserMedalList',
        method: 'post',
        data,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

//获取个人勋章 - 2期
export function getUserMedal2(data) {
    return http({
        url: '/api/medal/getUserMedalList2',
        method: 'post',
        data,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
//获取个人勋章更多
export function getUserMedalDiff(data) {
    return http({
        url: '/api/medal/getUserMedalDiffList',
        method: 'post',
        data
    });
}

/*团队相关*/
//获取团队所有成员
export function getTeamAll(isHome = false) {
    return http({
        url: '/api/team/getTeamAll',
        method: 'post',
        isHome
        // ,
        // isCache:true,//是否开启缓存
        // type:'cache',//接口类型 cache 属于缓存类型
        // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

export function getTeamGeo(data, isHome = false) {
    return http({
        url: '/api/map/getTeamGeo',
        method: 'post',
        data,
        isHome
    });
}
export function getTeamCity(data, isHome = false) {
    return http({
        url: '/api/city/getTeamCity',
        method: 'post',
        data,
        isHome,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
export function getTeamMedal(data, isHome = false) {
    return http({
        url: '/api/medal/getTeamMedalList',
        method: 'post',
        data,
        isHome,
        isNoLoading: true
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
export function getTeamMedalDiff(data) {
    return http({
        url: '/api/medal/getTeamMedalDiffList',
        method: 'post',
        data
    });
}
export function getTeamRank(data, isHome = false) {
    return http({
        url: '/api/city/getTeamRank',
        method: 'post',
        data,
        isNoLoading: true,
        isHome
        // isCache:true,//是否开启缓存
        // type:'cache',//接口类型 cache 属于缓存类型
        // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

//全民相关
export function getAllRank(data) {
    return http({
        url: '/api/city/getAllRank',
        method: 'post',
        data
        // isCache:true,//是否开启缓存
        // type:'cache',//接口类型 cache 属于缓存类型
        // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
// 全民周榜
export function getAllWeekRank(data) {
    return http({
        url: '/api/city/getAllWeekRank',
        method: 'post',
        data
        // isCache:true,//是否开启缓存
        // type:'cache',//接口类型 cache 属于缓存类型
        // cacheMaxAge:3//缓存有效时间  单位秒
    });
}

export function getCityRank(data) {
    return http({
        url: '/api/city/getCityRank',
        method: 'post',
        data
    });
}

export function getAllGeo() {
    return http({
        url: '/api/map/getAllGeo',
        method: 'post'
            // isCache:true,//是否开启缓存
            // type:'cache',//接口类型 cache 属于缓存类型
            // cacheMaxAge:3//缓存有效时间  单位秒
    });
}
//全部城市
export function getAllUserCity() {
    return http({
        url: '/api/city/getAllUserCity',
        method: 'post'
    });
}
export function getAllTeamCity() {
    return http({
        url: '/api/city/getAllTeamCity',
        method: 'post'
    });
}
/*查询勋章分享功能*/
export function getNextUserMedal(data) {
    return http({
        url: '/api/medal/getNextUserMedal',
        method: 'post',
        data
    });
}
export function getNextTeamMedal(data) {
    return http({
        url: '/api/medal/getNextTeamMedal',
        method: 'post',
        data
    });
}
export function getScanWxMsgId() {
    return http({
        url: '/api/tools/getScanWxMsgId',
        method: 'post'
    });
}

export function callWxMsgAuth(data) {
    return http({
        url: '/api/tools/callWxMsgAuth',
        method: 'post',
        data
    });
}

export function getQuestion() {
    return http({
        url: '/api/tools/getQuestion',
        method: 'post'
    });
}

export function geRealtUserMedal() {
    return http({
        url: '/api/medal/getUserMedal',
        method: 'post',
        isNoLoading: true
    });
}

export function getRealTeamMedal(isHome = false) {
    return http({
        url: '/api/medal/getTeamMedal',
        method: 'post',
        isHome,
        isNoLoading: true
    });
}
// 最近点亮
export function getLitCityLog(data) {
    return http({
        url: '/api/city/getLitCityLog',
        method: 'post',
        data
    });
}
//点赞
export function like(data) {
    return http({
        url: '/api/city/like',
        method: 'post',
        data
    });
}
//解锁勋章
export function getMedalCity(data) {
    return http({
        url: '/api/Medal/getUserCity',
        method: 'post',
        data
    });
}

//开始加速
export function begin() {
    return http({
        url: '/api/watch/begin',
        method: 'post'
    });
}

//加速结束
export function finish(data) {
    return http({
        url: '/api/watch/finish',
        method: 'post',
        data
    });
}
// 加速结束，同时解锁3个勋章的形式
export function finish2(data) {
    return http({
        url: '/api/watch/finish2',
        method: 'post',
        data
    });
}

//获取下一个城市
export function getUserNextLitCity(data) {
    return http({
        url: '/api/city/getUserNextLitCity',
        method: 'post',
        data
    });
}

//获取下一个城市
export function getLitWay() {
    return http({
        url: '/api/tools/getLitWay',
        method: 'post'
    });
}
// 获取lightShareTitle
export function lightShareTitle(data) {
    return http({
        url: '/api/City/lightShare',
        method: 'post',
        data
    });
}

// 获取已积攒能量
export function getTotalLoveApi() {
    return http({
        url: '/api/commonweal/collectNum',
        method: 'post',
    });
}

// 点击能量收取
export function collectLoveApi() {
    return http({
        url: '/api/commonweal/collect',
        method: 'post',
    });
}