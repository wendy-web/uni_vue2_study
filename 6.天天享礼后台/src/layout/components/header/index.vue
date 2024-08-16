<template>
  <div flex items-center>
    <MenuCollapse />
    <BreadCrumb ml-15 />
  </div>
  <div ml-auto flex items-center>
    <ThemeMode />
    <!-- <GithubSite /> -->
    <FullScreen />
    <messageIcon ref="messageIconRef" @openMsg="openMsgHandle" />
    <UserAvatar />
    <operateGroup ref="operateGroupRef" @close="updateMess" />
  </div>
</template>

<script setup>
import BreadCrumb from './components/BreadCrumb.vue';
import FullScreen from './components/FullScreen.vue';
// import GithubSite from './components/GithubSite.vue';
import messageIcon from './components/messageIcon.vue';
import operateGroup from './components/operateGroup.vue';

import MenuCollapse from './components/MenuCollapse.vue';
import ThemeMode from './components/ThemeMode.vue';
import UserAvatar from './components/UserAvatar.vue';
// 优惠券操作
const operateGroupRef = ref(null)
const messageIconRef = ref(null)
function openMsgHandle() {
  operateGroupRef.value.show()
}
onMounted(() => {
  refresh()
})
function updateMess() {
  messageIconRef.value.updateDelistCount()
}
function refresh() {
  // $table.value?.handleSearch()
}
</script>
