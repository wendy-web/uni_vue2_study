export default {
    orders: [{
            id: 0,
            name: '待付款',
            key: 'order_pay',
            icon: '/static/images/mine/icon_order_pay.png',
            path: '/pages/mineModule/order/index?activeTab=1'
        },
        {
            id: 1,
            name: '待使用',
            key: 'order_use',
            icon: '/static/images/mine/icon_order_use.png',
            path: '/pages/mineModule/order/index?activeTab=2'
        },
        {
            id: 2,
            name: '已完成',
            key: '',
            icon: '/static/images/mine/icon_order_complete.png',
            path: '/pages/mineModule/order/index?activeTab=3'
        }
    ],
    /*菜单*/
    menus: [{
            id: 1,
            name: '我的收藏',
            icon: '/static/images/mine/icon_collect.png',
            path: '/pages/mineModule/myCollect/index'
        },
        {
            id: 4,
            name: '赚钱教程',
            icon: '/static/images/mine/icon_money.png',
            path: '/pages/mineModule/makeMoney/index'
        },
        {
            id: 2,
            name: '联系客服',
            icon: '/static/images/mine/icon_contact_service.png',
            path: '/pages/mineModule/service/service'
        },
        {
            id: 3,
            name: '关于我们',
            icon: '/static/images/mine/icon_about_us.png',
            path: '/pages/mineModule/aboutUs/index'
        }
    ]
}
