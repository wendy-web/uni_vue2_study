import { getImgUrl } from '@/utils/auth.js';
export default {
    orders: [{
            id: 1,
            name: '待付款',
            key: 'pending',
            icon: `/static/user/order1.png`,
            path: '/pages/userModule/order/index?activeTab=1'
        },
        {
            id: 2,
            name: '已付款',
            key: 'pending_use',
            icon: `/static/user/order2.png`,
            path: '/pages/userModule/order/index?activeTab=2'
        },
        {
            id: 3,
            name: '已完成',
            key: 'completed',
            icon: `/static/user/order3.png`,
            path: '/pages/userModule/order/index?activeTab=3'
        },
        {
            id: 0,
            name: '我的订单',
            key: 'completed',
            icon: `/static/user/order4.png`,
            path: '/pages/userModule/order/index?activeTab=0'
        }
    ],
    /*菜单*/
    menus: [{
            id: 1,
            name: '我的收藏',
            icon: `/static/user/icon_01.png`,
            path: '/pages/userInfo/myCollect/index'
        },
        {
            id: 2,
            name: '浏览记录',
            icon: `/static/user/icon_02.png`,
            path: '/pages/userInfo/lookRecord/index'
        },
        {
            id: 3,
            name: '我的分享',
            icon: `/static/user/icon_03.png`,
            path: 'share'
        },
        {
            id: 4,
            name: '联系客服',
            icon: `/static/user/icon_04.png`,
            path: '/pages/tabAbout/service/service'
        },
        {
            id: 5,
            name: '关于我们',
            icon: `/static/user/icon_05.png`,
            path: '/pages/tabAbout/aboutUs/index'
        }
    ]
}
