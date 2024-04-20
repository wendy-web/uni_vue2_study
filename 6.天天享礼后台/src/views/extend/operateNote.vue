<template>
  <n-drawer v-model:show="showModal" :default-width="drawerWidth" resizable>
    <n-drawer-content :title="modalTitle" closable>
      <div style="display: flex;justify-content: flex-end;padding-bottom: 20px;">
        <n-button type="primary" @click="handleAdd">
          <TheIcon icon="material-symbols:add" :size="18" class="mr-5" /> 添加
        </n-button>
      </div>
      <CrudTable
          ref="$table"
          v-model:query-items="queryItems"
          :scroll-x="1200"
          :columns="columns"
          :get-data="http.noteList"
      >
        <template #queryBar>
          <QueryBarItem label="记录时间" :label-width="80" :content-width="340">
            <n-date-picker
                v-model:formatted-value="queryItems.create_time"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="datetimerange"
                clearable
            />
          </QueryBarItem>
        </template>
      </CrudTable>
    </n-drawer-content>
  </n-drawer>
  <operate-single2 ref="operateSingle2Ref" @refresh="refresh" />
</template>
<script setup>
  import { renderIcon } from '@/utils';
  import { NButton, useMessage, useDialog } from 'naive-ui';
  import { ref } from 'vue';
  import http from './api';
  import operateSingle2 from './operateSingle2.vue';
  /**抽屉宽度 */
  const drawerWidth = window.innerWidth - 220 + 'px'
  /**弹窗显示控制 */
  const showModal = ref(false)
  const modalType = ref(1)
  const modalTitle = ref('查看')
  /**表单 */
  const formRef = ref(null)
  const position_id = ref(null)
  const operateSingle2Ref = ref(null)
  /** 自定义单元格 */
  const dialog = useDialog()
  const queryItems = ref({
    pid: position_id
  })
  const columns = [
    {
      title: '备注',
      key: 'notes',
      align: 'center',
      fixed: 'left',
      size: 'large',
    },
    {
      title: '记录时间',
      key: 'create_time',
      align: 'center',
      fixed: 'left',
      size: 'large',
      width: 322,
    },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      render(row) {
        return [
          h(
              NButton,
              {
                size: 'small',
                type: 'info',
                secondary: true,
                style: { 'margin-right': '10px' },
                onClick: () => editCoupon(row),
              },
              { default: () => '编辑', icon: renderIcon('majesticons:eye-line', { size: 14 }) }
          ),
          h(
              NButton,
              {
                size: 'small',
                type: 'error',
                secondary: true,
                onClick: () => removeCoupon(row),
              },
              { default: () => '删除', icon: renderIcon('material-symbols:cancel-outline-rounded', { size: 14 }) }
          ),
        ]
      },
    },
  ]
  //提示展示
  const message = useMessage()
  const $table = ref(null)
  //新增
  function handleAdd(){
    operateSingle2Ref.value.show(3, data)
  }
  function editCoupon(row){
    operateSingle2Ref.value.show(2, row)
  }
  function refresh() {
    $table.value?.handleSearch()
  }
  const data = ref({})
  //删除
  function removeCoupon(row){
    dialog.warning({
      title: '警告',
      content: '确定删除？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: function () {
        http.noteDel({ id: row.id}).then(function (res) {
          if (res.code == 1) {
            message.success(res.msg)
            refresh()
          } else {
            message.error(res.msg)
          }
        })
      },
    })
  }
  async function show(row) {
    data.value = row
    modalTitle.value = row.name
    position_id.value = row.position_id
    showModal.value = true
    await nextTick()

    $table.value?.handleSearch()
  }
  watch(
    () => showModal.value,
    (newValue) => {
      if (newValue) return
      emit('close')
    }
  )
  /**暴露给父组件使用 */
  defineExpose({
    show,
  })
  /**回调父组件函数注册 */
  const emit = defineEmits(['refresh'])
</script>
<style scoped>
  .type_id {
    position: absolute;
    font-size: 14px;
    color: gray;
    bottom: -70%;
  }
</style>
