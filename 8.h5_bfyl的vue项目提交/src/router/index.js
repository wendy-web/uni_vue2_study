import Vue from 'vue'
import VueRouter from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(VueRouter)

/* Layout */
// import Layout from '@/layouts'

// 解决重复点击路由报错的BUG
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch((err) => err)
// }

// 配置项目路由
export const asyncRoutes = [
  {
    path: '/',
    // redirect: '/bill/2023'
    redirect: '/creditCard/home'
  },
  // {
  //   path: '/index',
  //   // component: () => import('@/layouts/index'),
  //   component: Layout,
  //   meta: {
  //     keepAlive: false
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Index',
  //       component: () => import('@/views/home/index'),
  //       meta: { title: '首页', keepAlive: false }
  //     },
  //   ]
  // },
  {
    path: '/404',
    name: '404',
    component: () => import('@/error-page/404'),
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/creditCard/home', hidden: true }
  // { path: '*', redirect: '/bill/2023', hidden: true }
]

/** 批量导入 */
const contexts = require.context('../views', true, /route\.js$/)
contexts.keys().forEach(key => {
  asyncRoutes.push(contexts(key).default || contexts(key))
})

// console.log('批量导入contexts:', asyncRoutes)

/** 批量导入 */
const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: asyncRoutes
})

const router = createRouter()
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : ''
  next()
})
// console.log('routers:', router)
export default router

