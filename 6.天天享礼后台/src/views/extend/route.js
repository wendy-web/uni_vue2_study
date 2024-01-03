const Layout = () => import('@/layout/index.vue')

export default {
    name: 'Extend',
    path: '/',
    component: Layout,
    redirect: '/extend',
    meta: {
        title: '推广管理',
        icon: 'fa6-regular:paper-plane',
        order: 9,
    },
    children: [
        {
            name: 'extend',
            path: 'extend',
            component: () => import('./index.vue'),
            meta: {
                title: '列表',
                icon: 'material-symbols:person-pin',
                order: 1,
                requireAuth: true,
                role: ['extend_getlist_1']
            },
        },
    ],
}
