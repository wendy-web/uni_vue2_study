export default {
    orders: [{
            id: 1,
            name: '待付款',
            key: 'pending',
            iconClass: 'icon1',
            path: '/pages/userModule/order/index?activeTab=1'
        },
        {
            id: 2,
            name: '已付款',
            key: 'pending_use',
            iconClass: 'icon2',
            path: '/pages/userModule/order/index?activeTab=2'
        },
        {
            id: 3,
            name: '已完成',
            key: 'completed',
            iconClass: 'icon3',
            path: '/pages/userModule/order/index?activeTab=3'
        },
        {
            id: 0,
            name: '我的订单',
            key: 'completed',
            iconClass: 'icon4',
            path: '/pages/userModule/order/index?activeTab=0'
        }
    ],
    /* 菜单 */
    menus: [{
            id: 1,
            name: '我的收藏',
            path: '/pages/userInfo/myCollect/index',
            iconClass: 'icon1'
        },
        {
            id: 2,
            name: '浏览记录',
            path: '/pages/userInfo/lookRecord/index',
            iconClass: 'icon2',
        },
        // {
        //     id: 3,
        //     name: '我的分享',
        //     icon: `https://test-file.y1b.cn/store/1-0/2434/65e5864e033fa.png`,
        //     path: 'share'
        // },
        {
            id: 6,
            name: '优惠雷达',
            icon: `https://file.y1b.cn/store/1-0/2473/66851706f266e.png`,
            path: 'code',
        },
        {
            id: 4,
            name: '联系客服',
            path: '/pages/tabAbout/service/service',
            iconClass: 'icon4',
        },
        {
            id: 5,
            name: '关于我们',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586830b5d6.png`,
            path: '/pages/tabAbout/aboutUs/index',
        }
    ]
}
