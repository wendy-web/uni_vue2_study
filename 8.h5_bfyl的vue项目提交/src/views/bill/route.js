import Layout from '@/layouts'
const home =
{
  path: '/bill',
  redirect: '/bill/2023',
  component: Layout,
  meta: {
    keepAlive: false,
    hidden: true
  },
  children: [
    {
      path: '2023',
      name: 'Bill2023',
      component: () => import('@/views/bill/2023/index'),
      meta: { title: '', keepAlive: false }
    },
    {
      path: 'service',
      name: 'Service',
      component: () => import('@/views/bill/2023/service'),
      meta: { title: '', keepAlive: false }
    },
    { path: '*', redirect: '/bill/2023', hidden: true }
  ]
}

export default home
