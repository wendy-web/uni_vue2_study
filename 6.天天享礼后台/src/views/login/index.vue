<template>
  <AppPage :show-footer="true" bg-cover :style="{ backgroundImage: `url(${bgImg})` }">
    <div
      style="transform: translateY(25px)"
      class="m-auto p-15 f-c-c min-w-345 max-w-700 rounded-10 card-shadow bg-white bg-opacity-60"
    >
      <div w-380 hidden md:block px-20 py-35>
        <img src="@/assets/images/login_banner.webp" w-full alt="login_banner" />
      </div>

      <div w-320 flex-col px-20 py-35>
        <h5 f-c-c text-24 font-normal color="#6a6a6a"><icon-custom-logo mr-10 text-50 color-primary />{{ title }}</h5>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.username"
            autofocus
            class="text-16 items-center h-50 pl-10"
            :maxlength="20"
          />
        </div>
        <div mt-30>
          <n-input
            v-model:value="loginInfo.password"
            class="text-16 items-center h-50 pl-10"
            type="password"
            show-password-on="mousedown"
            :maxlength="20"
            @keydown.enter="handleLogin"
          />
        </div>
        <div mt-30 flex justify-between items-center>
          <n-image height="35" preview-disabled :src="codeURL" @click="getCaptcha" />
          <div w-100><n-input v-model:value="loginInfo.code" type="text" placeholder="验证码" /></div>
        </div>

        <div mt-20>
          <n-checkbox :checked="isRemember" label="记住我" :on-update:checked="(val) => (isRemember = val)" />
        </div>

        <div mt-20>
          <n-button w-full h-50 rounded-5 text-16 type="primary" :loading="loading" @click="handleLogin">
            登录
          </n-button>
        </div>
      </div>
    </div>
  </AppPage>
</template>

<script setup>
import { lStorage, setToken } from '@/utils'
import { useStorage } from '@vueuse/core'
import bgImg from '@/assets/images/login_bg.webp'
import api from './api'
import { addDynamicRoutes } from '@/router'
import { useUserStore } from '@/store'

const title = import.meta.env.VITE_TITLE

const router = useRouter()
const { query } = useRoute()
const userStore = useUserStore()

const loginInfo = ref({
  username: '',
  password: '',
  code: '',
})

initLoginInfo()

function initLoginInfo() {
  const localLoginInfo = lStorage.get('loginInfo')
  if (localLoginInfo) {
    loginInfo.value.username = localLoginInfo.username || ''
    loginInfo.value.password = localLoginInfo.password || ''
  }
}

const isRemember = useStorage('isRemember', false)
const loading = ref(false)
async function handleLogin() {
  const { username, password, code } = loginInfo.value
  if (!username || !password) {
    $message.warning('请输入用户名和密码')
    return
  }
  if (!code) {
    $message.warning('验证码不能为空')
    return
  }
  try {
    loading.value = true
    $message.loading('正在验证...')
    const res = await api.login({ username, password: password.toString(), code })
    $message.success('登录成功')
    setToken('FICTITIOUS ORDERS')
    userStore.setUserInfo(res.data)
    if (isRemember.value) {
      lStorage.set('loginInfo', { username, password })
    } else {
      lStorage.remove('loginInfo')
    }
    await addDynamicRoutes()
    if (query.redirect) {
      const path = query.redirect
      Reflect.deleteProperty(query, 'redirect')
      router.push({ path, query })
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    $message.removeMessage()
  }
  loading.value = false
}

//获取验证码
const codeURL = ref('')
//默认执行一次
getCaptcha()
function getCaptcha() {
  codeURL.value = 'https://ttxl-test.y1b.cn/apios/index/captcha?' + Date.now()
}
</script>
