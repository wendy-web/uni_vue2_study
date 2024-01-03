import Layout from '@/layouts'

const creditCard = {
    path: '/creditCard',
    redirect: '/creditCard/home',
    component: Layout,
    meta: {
        keepAlive: false
    },
    children: [{
            path: 'home',
            name: 'ZXHome',
            component: () =>
                import ('@/views/creditCard/home/index'),
            meta: { title: '', keepAlive: false }
        },
        {
            path: 'ZXPlan',
            name: 'ZXPlan',
            component: () =>
                import ('@/views/creditCard/plan/index'),
            meta: { title: '', keepAlive: false }
        },
        {
            path: 'ZXSign',
            name: 'ZXSign',
            component: () =>
                import ('@/views/creditCard/signUp/index'),
            meta: { title: '', keepAlive: false }
        },
        {
            path: 'ZXInvite',
            name: 'ZXInvite',
            component: () =>
                import ('@/views/creditCard/invite/index'),
            meta: { title: '', keepAlive: false }
        },
        // ZXInviteDetail
        {
            path: 'ZXInviteDetail',
            name: 'ZXInviteDetail',
            component: () =>
                import ('@/views/creditCard/invite/detail'),
            meta: { title: '', keepAlive: false }
        },
        {
            path: 'demo',
            name: 'demo',
            component: () =>
                import ('@/views/creditCard/demo2/index'),
            meta: { title: '', keepAlive: false }
        },
    ]
}
export default creditCard
