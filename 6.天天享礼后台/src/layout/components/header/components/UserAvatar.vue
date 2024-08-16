<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img src="../../../../assets/images/avatar_default.png" mr10 w-35 h-35 rounded-full />
      <!-- <span>{{ userStore.username }}</span> -->
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store';
import { renderIcon } from '@/utils';
import { NAvatar, NText } from 'naive-ui';
const userStore = useUserStore()
// console.log('userStore', userStore)
const options = [
  {
    key: 'header',
    type: 'render',
    render: renderCustomHeader,
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: '14px' }),
  },
]
function renderCustomHeader() {
  return h(
    'div',
    {
      style: 'display: flex; align-items: center; padding: 8px 22px 8px 12px;',
    },
    [
      h(NAvatar, {
        round: true,
        style: 'margin-right: 12px;',
        src: 'https://file.y1b.cn/store/1-0/24527/66544081474e7.png',
      }),
      h('div', null, [
        h('div', null, [h(NText, { depth: 2 }, { default: () => userStore.username })]),
        // h('div', { style: 'font-size: 12px;' }, [h(NText, { depth: 3 }, { default: () => `id: ${userStore.userId}` })]),
      ]),
    ]
  )
}
function handleSelect(key) {
  if (key === 'logout') {
    $dialog.confirm({
      title: '提示',
      type: 'info',
      content: '确认退出？',
      confirm() {
        userStore.logout()
        $message.success('已退出登录')
      },
    })
  }
}
</script>
