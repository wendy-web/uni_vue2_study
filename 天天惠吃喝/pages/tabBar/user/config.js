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
            id: 1,
            name: '服务协议',
            path: 'share'
        },
        {
            id: 2,
            name: '隐私政策',
            path: '/pages/tabAbout/service/service'
        },
        {
            id: 3,
            name: '官方客服',
            lab: '400-870-7076',
            path: '/pages/tabAbout/service/service'
        },
        {
            id: 4,
            name: '版本号',
            lab: '',
            path: '/pages/tabAbout/aboutUs/index'
        }
    ]
}
