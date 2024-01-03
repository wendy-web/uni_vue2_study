import { getToken, isNullOrWhitespace } from '@/utils' //refreshAccessToken
import { usePermissionStore } from '@/store'
const WHITE_LIST = ['/login', '/404']
// const permissionStore = usePermissionStore()
export function createPermissionGuard(router) {
  router.beforeEach(async (to) => {
    const token = getToken()

    /** 没有token的情况 */
    if (isNullOrWhitespace(token)) {
      if (WHITE_LIST.includes(to.path)) return true
      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }

    /** 有token的情况 */
    if (to.path === '/login') {
      return { path: '/' }
    }
    if (to.meta.role && to.meta.role[0]) {
      const role = to.meta.role[0]
      if (role == 'power') return true
      const permissionStore = usePermissionStore()
      await permissionStore.getCurrentPermsRoles(role)
    }

    // refreshAccessToken()
    return true
  })
}
