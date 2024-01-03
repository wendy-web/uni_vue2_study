const Layout = () => import('@/layout/index.vue')

export default {
    name: 'authority',
    path: '/',
    component: Layout,
    redirect: '/workbench',
    meta: {
        title: '权限管理',
        icon: 'material-symbols:brightness-7-rounded',
        role: ['power'],
        requireAuth: true,
        order: 8,
    },
    children: [
        {
            name: 'Power',
            path: 'power/list',
            component: () =>
                import ('@/views/authority/power/index.vue'),
            meta: {
                title: '列表',
                icon: 'icon-park-solid:align-text-both-one',
                order: 1,
                keepAlive: true,
            },
        },
        {
            name: 'PowerGroup',
            path: 'PowerGroup/list',
            component: () =>
                import ('@/views/authority/power-group/index.vue'),
            meta: {
                title: '权限组',
                icon: 'uis:grid',
                order: 2,
                keepAlive: true,
            },
        },
    ],
}
