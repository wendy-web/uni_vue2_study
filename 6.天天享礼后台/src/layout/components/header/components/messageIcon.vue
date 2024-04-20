<template>
  <n-float-button position="relative" mr-20 width="30" height="30" @click="openMessage">
    <n-badge :value="appStore.delistCount" :offset="[6, -8]" :max="99">
      <icon-majesticons:message />
    </n-badge>
  </n-float-button>
</template>

<script setup>
import { useAppStore } from '@/store';
import http from '../api';
const appStore = useAppStore()
const emit = defineEmits(['openMsg'])
function openMessage() {
  emit('openMsg')
}
onMounted(() => {
  updateDelistCount()
})
async function updateDelistCount() {
  const res = await http.delistCount()
  if (res.code != 1) return
  appStore.setDelistCount(res.data || 0)
}
defineExpose({
  updateDelistCount,
})
</script>
