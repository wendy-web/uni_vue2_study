{
  /* <n-button quaternary v-has="'import'">按钮</n-button> */
}
import { usePermissionStore } from '@/store'
export function btnPerms(app) {
  app.directive('has', {
    mounted(el, binding) {
      if (!permsJudge(binding.value)) {
        el.parentNode.removeChild(el)
      }

      function permsJudge(value) {
        const permissionStore = usePermissionStore()
        let perms = permissionStore.permsRoles
        // console.log(perms, '=====================')
        return perms.includes(value)
      }
    },
  })
}
