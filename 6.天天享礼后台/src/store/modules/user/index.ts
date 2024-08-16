import api from '@/api';
import { resetRouter } from '@/router';
import { usePermissionStore, useTagsStore } from '@/store';
import { removeToken, toLogin } from '@/utils';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {
        role: ['admin'],
      },
    }
  },
  getters: {
    userId() {
      return this.userInfo?.id
    },
    username() {
      return this.userInfo?.username
    },
    avatar() {
      return this.userInfo?.avatar
    },
    role() {
      return this.userInfo?.role || []
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUser()
        const { id, username, avatar, role } = res.data
        this.userInfo = { id, username, avatar, role }
        return Promise.resolve(res.data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTags } = useTagsStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetTags()
      resetPermission()
      resetRouter()
      this.$reset()
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
