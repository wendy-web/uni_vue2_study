import { useUserStore } from '@/store'

export function addBaseParams(params) {
  if (!params.userId) {
    params.userId = useUserStore().userId
  }
}

export function resolveResError(code, message) {
  switch (code) {
    case '0':
      message = message
      break
    case '-1':
      message = message ?? '登录已过期'
      useUserStore().logout()
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  return message
}
