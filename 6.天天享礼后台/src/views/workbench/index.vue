<template>
  <AppPage :show-footer="true">
    <n-card rounded-10>
      <div flex>
        <n-input-group mb-10>
          <n-input v-model:value="username" :style="{ width: '200px' }" />
          <n-button type="info" @click="getList"> 搜索 </n-button>
        </n-input-group>
        <n-button type="success" @click="createUser"> 新增 </n-button>
      </div>
      <n-data-table :columns="columns" :data="list" :render-cell="renderCell" :pagination="false" />
    </n-card>
    <!-- 操作弹窗 -->
    <operat-account ref="operatA" @refresh="getList" />
  </AppPage>
</template>

<script setup>
import { NButton, useDialog, useMessage } from 'naive-ui';
import { h, onMounted } from 'vue';
import API from './api';
import operatAccount from './operatAccount.vue';

/**搜索 */
const username = ref('')
/**表格数据 */
const list = ref([])
/**页面初始化完的时候加载数据 */
onMounted(function () {
  getList()
})
/**获取表格数据 */
function getList() {
  API.getList({
    username: username.value,
  }).then((res) => {
    list.value = res.data.list
  })
}
/**表格 单元格 */
const columns = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: '账户名称',
    key: 'username',
  },
  {
    title: '创建时间',
    key: 'create_time',
  },
  {
    title: '修改时间',
    key: 'update_time',
  },
  {
    title: '操作',
    key: 'tools',
  },
]
/** 自定义单元格 */
const dialog = useDialog()
//提示展示
const message = useMessage()
function renderCell(value, rowData, column) {
  // console.log(value, rowData, column)
  if (column.key === 'tools') {
    return h('div', [
      h(
        NButton,
        {
          type: 'success',
          style: { marginRight: '15px' },
          onClick: function () {
            operatA.value.show(rowData)
          },
        },
        { default: () => '编辑' }
      ),
      h(
        NButton,
        {
          type: 'error',
          onClick: function () {
            dialog.warning({
              title: '警告',
              content: '确定删除？',
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: function () {
                API.deleteUser({ uid: rowData.id }).then(function (res) {
                  if (res.code == 1) {
                    message.success(res.msg)
                    getList()
                  } else {
                    message.error(res.msg)
                  }
                })
              },
            })
          },
        },
        { default: () => '删除' }
      ),
    ])
  }
  return value
}
/*新增编辑弹窗 */
const operatA = ref(null)
/**新增用户 */
function createUser() {
  operatA.value.show()
}
</script>
