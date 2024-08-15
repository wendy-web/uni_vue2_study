export const orderStatus = {
    0: "待付款",
    1: "已取消",
    2: "发货中",
    3: "待使用",
    4: "已完成",
    5: "已退款",
}

export const titleObj = {
    0: "待付款",
    1: "已取消",
    2: "待发货",
    3: "待使用",
    4: "已完成",
    5: "已退款",
}
export const orderClass = {
    0: "order-status-0",
    1: "order-status-1",
    2: "order-status-2",
    3: "order-status-0",
    4: "order-status-1",
    5: "order-status-1",
}
export const goodsTypeObj = {
    0: {
        label: '直充',
        icon: '../../static/order/icon_00.png'
    },
    1: {
        label: '卡券',
        icon: '../../static/order/icon_01.png'
    },
    2: {
        label: '千猪电影票',
        icon: '../../static/order/icon_02.png'
    },
    3: {
        label: '千猪肯德基',
        icon: '../../static/order/icon_03.png'
    },
    4: {
        label: '千猪星巴克',
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c97ae962e.png'
    },
    5: {
        label: '京东',
        icon: '../../static/order/icon_05.png'
    },
    6: {
        label: '海威',
        icon: '../../static/order/icon_06.png'
    },
    7: {
        label: '拼多多',
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c932e563c.png'
    },
    // 深爱购 - 展示是直充的类型
    8: {
        label: '直充',
        icon: '../../static/order/icon_00.png'
    },
    // 心链
    9: {
        label: '手机充值',
        icon: '../../static/order/icon_phone.png'
    },
    10: {
        label: '麦当劳兑换券',
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c94cdaf47.png'
    },
    11: {
        label: '库迪咖啡',
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c81e94765.png',
    },
    12: {
        label: '一分购',
        icon: 'https://file.y1b.cn/store/1-0/2459/663c7efbaf104.png'
    }
}
export const haiWeiObj = {
    'HW_ruixing': {
        type: 0,
        icon: '../../static/order/icon_06.png',
        path: '/pages/userModule/takeawayMenu/luckin'
    },
    'HW_mdl': {
        type: 1,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c94cdaf47.png',
        path: '/pages/userModule/takeawayMenu/mcDonald'
    },
    'HW_wallace': {
        type: 2,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c88c6f10c.png',
        product_img: 'https://file.y1b.cn/store/1-0/23124/656d7cf501530.png'
    },
    'HW_burger': {
        type: 3,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c8a8a193a.png',
        product_img: 'https://file.y1b.cn/store/1-0/23124/656d7d3a90115.png'
    },
    'HW_pizza': {
        type: 4,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c8e05bbfb.png',
        product_img: 'https://file.y1b.cn/store/1-0/23124/656d7d1c22d7c.png'
    },
    'HW_heytea': {
        type: 4,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c9000440f.png',
        product_img: 'https://file.y1b.cn/store/1-0/23124/656d7d4cccc81.png'
    },
    'HW_nayuki': {
        type: 4,
        icon: 'https://file.y1b.cn/store/1-0/24424/6628c86e4d157.png',
        product_img: 'https://file.y1b.cn/store/1-0/23124/656d7d5ece54d.png'
    },
    'kudi': {
        product_img: 'https://file.y1b.cn/store/1-0/24424/66285ee803d19.png',
        product_name: '库迪咖啡'
    },
    'xl_hf': {
        product_img: 'https://file.y1b.cn/store/1-0/2416/6598c9ea9fb0a.png',
        product_name: '话费充值'
    }
}

export const jtkDcObj = {
    'rx': {
        product_img: '../../static/order/rx.png',
        product_name: '瑞幸咖啡'
    },
    'mcd': {
        product_img: '../../static/order/mcd.png',
        product_name: '麦当劳'
    },
    'bsk': {
        product_img: '../../static/order/bsk.png',
        product_name: '必胜客'
    },
    'nx': {
        product_img: '../../static/order/nx.png',
        product_name: '奈雪的茶'
    },
    'kudi': {
        product_img: '../../static/order/kudi.png',
        product_name: '库迪咖啡'
    },
    'xbk': {
        product_img: '../../static/order/xbk.png',
        product_name: '星巴克'
    },
    'kfc': {
        product_img: '../../static/order/kfc.png',
        product_name: '肯德基'
    },
    'movie': {
        product_img: '../../static/order/movie.png',
        product_icon: '../../static/order/icon_02.png',
        product_name: '电影'
    },
    'car': {
        product_img: '../../static/order/car.png',
        product_icon: '../../static/order/car_icon.png',
        product_name: '打车出行'
    },
}
export const haiWeiStatus = {
    0: {
        title: '待付款',
        status: ''
    },
    1: {
        title: '已取消',
        status: ''
    },
    2: {
        title: '下单成功',
        status: ''
    },
    3: {
        title: '等待取餐'
    },
    4: {
        title: '已完成'
    },
    5: {
        title: '已退款',
        status: '',
    },
}
