export default {
    orders: [{
            id: 1,
            name: '待付款',
            key: 'pending',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586970c2ab.png`,
            path: '/pages/userModule/order/index?activeTab=1'
        },
        {
            id: 2,
            name: '已付款',
            key: 'pending_use',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586aea239b.png`,
            path: '/pages/userModule/order/index?activeTab=2'
        },
        {
            id: 3,
            name: '已完成',
            key: 'completed',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586c1945d9.png`,
            path: '/pages/userModule/order/index?activeTab=3'
        },
        {
            id: 0,
            name: '我的订单',
            key: 'completed',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586d9aa7ee.png`,
            path: '/pages/userModule/order/index?activeTab=0'
        }
    ],
    /* 菜单 */
    menus: [{
            id: 3,
            name: '我的分享',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e5864e033fa.png`,
            path: 'share'
        },
        {
            id: 4,
            name: '联系客服',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e5865ebb9b6.png`,
            path: '/pages/tabAbout/service/service'
        },
        {
            id: 5,
            name: '关于我们',
            icon: `https://test-file.y1b.cn/store/1-0/2434/65e586830b5d6.png`,
            path: '/pages/tabAbout/aboutUs/index'
        }
    ]
}
