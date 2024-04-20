import api from '@/api';
import { asyncRoutes, basicRoutes } from '@/router/routes';
import { defineStore } from 'pinia';

function hasPermission(route, role) {
  // * 不需要权限直接返回true
  if (!route.meta?.requireAuth) return true

  const routeRole = route.meta?.role ? route.meta.role : []

  // * 登录用户没有角色或者路由没有设置角色判定为没有权限
  if (!role.length || !routeRole.length) return false

  // * 路由指定的角色包含任一登录用户角色则判定有权限
  return role.some((item) => routeRole.includes(item))
}

function filterAsyncRoutes(routes = [], role) {
  const ret = []
  routes.forEach((route) => {
    if (hasPermission(route, role)) {
      const curRoute = {
        ...route,
        children: [],
      }
      if (route.children && route.children.length) {
        curRoute.children = filterAsyncRoutes(route.children, role)
      } else {
        Reflect.deleteProperty(curRoute, 'children')
      }
      ret.push(curRoute)
    }
  })
  return ret
}

export const usePermissionStore = defineStore('permission', {
  state() {
    return {
      accessRoutes: [],
      permsRoles: ['0', 'import'],
    }
  },
  getters: {
    routes() {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus() {
      return this.routes.filter((route) => route.name && !route.isHidden)
    },
  },
  actions: {
    generateRoutes(role = []) {
      const accessRoutes = filterAsyncRoutes(asyncRoutes, role)
      this.accessRoutes = accessRoutes
      return accessRoutes
    },
    resetPermission() {
      this.$reset()
    },
    async getCurrentPermsRoles(role) {
      return new Promise(async (resolve, reject) => {
        const res = await api.getPower({ role })
        const permsRoles = res.data.data
        console.log('当前role： ', role, permsRoles)
        this.permsRoles = permsRoles
        resolve(res)
      })
    },
    isRolesFun(hasValue) {
      return this.permsRoles.includes(hasValue)
    },

    isIncludeRoles(value = ['xq', 'edit', 'delete']) {
      const fIndex = value.findIndex((res) => this.permsRoles.includes(res))
      return value.length && fIndex >= 0
    },
  },
})
