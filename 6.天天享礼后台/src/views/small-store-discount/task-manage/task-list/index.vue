<template>
  <CommonPage :show-header="false">
    <CrudTable
      ref="$table"
      v-model:query-items="queryItems"
      :scroll-x="1200"
      :columns="columns"
      :get-data="http.getList"
      :is-pagination="false"
    >
      <template #queryBar>
        <QueryBarItem label="任务名称" :label-width="65">
          <n-input
            v-model:value="queryItems.title"
            type="text"
            placeholder="请输任务名称"
            @keydown.enter="$table?.handleSearch"
          />
        </QueryBarItem>
        <QueryBarItem label="启用状态" :label-width="65">
          <n-select v-model:value="queryItems.use" :options="options" />
        </QueryBarItem>
      </template>
    </CrudTable>
  </CommonPage>
  <!-- 登录APP -->
  <login ref="loginRef" />
  <!-- 关注公众号 -->
  <follow-official-account ref="followOfficialAccountRef" />
  <!-- 观看视频 -->
  <watch-video ref="watchVideoRef" />
  <!-- 每日打卡 -->
  <clock-every-day ref="clockEveryDayRef" />
</template>

<script setup>
import login from './popup/login.vue'
import followOfficialAccount from './popup/followOfficialAccount.vue'
import watchVideo from './popup/watchVideo.vue'
import clockEveryDay from './popup/clockEveryDay.vue'
import { NButton, NSwitch } from 'naive-ui'
import { renderIcon } from '@/utils'
import { useMessage } from 'naive-ui'
import http from './api'
import { usePermissionStore } from '@/store'
const permissionStore = usePermissionStore()

import { resolveDirective, withDirectives } from 'vue'
const has = resolveDirective('has')
defineOptions({ name: 'taskManage' })

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})
/**启用状态下拉列表 */
const options = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '关闭',
    value: 0,
  },
]

onMounted(() => {
  refresh()
})

function refresh() {
  $table.value?.handleSearch()
}
const operateList = {
  title: '操作',
  key: 'actions',
  align: 'center',
  fixed: 'right',
  render(row) {
    return [
      withDirectives(
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            secondary: true,
            onClick: () => opera(row, 1),
          },
          { default: () => '查看', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
        ),
        [[has, 'xq']]
      ),
      withDirectives(
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            style: 'margin-left: 15px;',
            onClick: () => opera(row, 2),
          },
          { default: () => '编辑', icon: renderIcon('material-symbols:edit-outline', { size: 14 }) }
        ),
        [[has, 'edit']]
      ),
    ]
  },
}
const columns = [
  { title: '任务名称', key: 'title', align: 'center' },
  { title: '创建时间', key: 'create_time', align: 'center' },
  { title: '修改时间', key: 'update_time', align: 'center' },
  { title: '修改人', key: 'update_user', align: 'center' },
]
if (permissionStore.isRolesFun('disable')) {
  columns.push({
    title: '启用状态',
    key: 'use',
    align: 'center',
    render(row) {
      return h(NSwitch, {
        size: 'small',
        rubberBand: false,
        value: Boolean(row['use']),
        loading: !!row.publishing,
        onUpdateValue: () => handlePublish(row),
      })
    },
  })
}
columns.push(operateList)

//提示展示
const loginRef = ref()
//关注公众号
const followOfficialAccountRef = ref()
// 观看视频
const watchVideoRef = ref()
//每日打卡
const clockEveryDayRef = ref()
/** 查看 编辑 */
function opera(row, type) {
  switch (row.style) {
    //登录
    case 1:
      loginRef.value.show(row, type)
      break
    //关注
    case 2:
      followOfficialAccountRef.value.show(row, type)
      break
    //观看
    case 3:
      watchVideoRef.value.show(row, type)
      break
    //打卡
    case 4:
      clockEveryDayRef.value.show(row, type)
      break
  }
}
//状态启用
function handlePublish(row) {
  http
    .use({
      id: row.id,
      use: Number(!Boolean(row.use)),
    })
    .then((res) => {
      if (res.code == 1) {
        message.success(res.msg)
        $table.value?.handleSearch()
      } else {
        message.error(res.msg)
      }
    })
}
</script>
