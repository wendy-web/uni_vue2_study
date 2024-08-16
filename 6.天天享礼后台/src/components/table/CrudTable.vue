<template>
  <QueryBar
    v-if="$slots.queryBar"
    mb-30
    :is-export="extraParams.isExport"
    :is-import="extraParams.isImport"
    :is-import2="extraParams.isImport2"
    :is-api="isApi"
    @search="handleSearch"
    @reset="handleReset"
    @export="handleExport"
    @finishImport="finishImportHandle"
  >
    <slot name="queryBar" />
  </QueryBar>

  <n-data-table
    ref="QueryTableRef"
    :remote="remote"
    :loading="loading"
    :scroll-x="scrollX"
    :columns="columnsRef"
    :data="tableData"
    :children-key="childrenKey"
    :checked-row-keys="checkedRowKeys"
    :row-key="(row) => row[rowKey]"
    :max-height="maxHeight"
    :pagination="isPagination && isShowListPagination ? pagination : false"
    @update:checked-row-keys="onChecked"
    @update:page="onPageChange"
    @click="itemClick"
    @update:sorter="sorterHandle"
  />
</template>

<script setup>
const props = defineProps({
  /**
   * @remote true: 后端分页  false： 前端分页
   */
  isApi: {
    type: String,
    default: '',
  },
  remote: {
    type: Boolean,
    default: true,
  },
  /**
   * @remote 是否分页
   */
  isPagination: {
    type: Boolean,
    default: true,
  },
  scrollX: {
    type: Number,
    default: 1200,
  },
  maxHeight: {
    type: Number,
    default: NaN,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  columns: {
    type: Array,
    required: true,
  },
  /** queryBar中的参数 */
  queryItems: {
    type: Object,
    default() {
      return {}
    },
  },
  /** 补充参数（可选） */
  extraParams: {
    type: Object,
    default() {
      return {}
    },
  },
  /**
   * ! 约定接口入参出参
   * * 分页模式需约定分页接口入参
   *    @pageSize 分页参数：一页展示多少条，默认10
   *    @pageNo   分页参数：页码，默认1
   * * 需约定接口出参
   *    @pageData 分页模式必须,非分页模式如果没有pageData则取上一层data
   *    @total    分页模式必须，非分页模式如果没有total则取上一层data.length
   */
  getData: {
    type: Function,
    required: true,
  },
  checkedRowKeys: {
    type: Array,
    default() {
      return []
    },
  },
  listData: {
    type: Array,
    default: [],
  },
  addKey: {
    type: Object,
    default: null,
  },
  childrenKey: {
    type: String,
    default: 'child',
  },
  editKeyValue: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits([
  'update:queryItems',
  'onChecked',
  'export',
  'getDataCallback',
  'finishImport',
  'onItemClick',
  'onAddKeyClick',
])
const loading = ref(false)
const initQuery = { ...props.queryItems }
const tableData = ref([])
const pagination = reactive({ page: 1, pageSize: 10 })
// apios/Group/queueEdit
watch(
  () => props.editKeyValue,
  async (newValue, oldValue) => {
    if (!newValue) return
    const { index, key, value } = newValue
    tableData.value[index][key] = value
  },
  {
    deep: true,
    // immediate: true,
  }
)
async function handleQuery(params = null) {
  try {
    loading.value = true
    let paginationParams = {}
    // 如果非分页模式或者使用前端分页,则无需传分页参数;
    isShowListPagination.value = true
    if (props.isPagination && props.remote) {
      paginationParams = { page: pagination.page, size: pagination.pageSize }
    }
    const { data } = await props.getData({ ...props.queryItems, ...props.extraParams, ...paginationParams, ...params })
    tableData.value = data?.list || data
    // 添加一个键值对的默认类型
    if (props.addKey) {
      const keyValue = Object.keys(props.addKey)[0]
      const defaultValue = Object.values(props.addKey)[0]
      tableData.value.forEach((res) => (res[keyValue] = defaultValue))
    }
    let itemCount = data?.total?.count || data.total_count || 0
    if (pagination.page !== 1 && !itemCount) {
      itemCount = pagination.itemCount
    }
    pagination.itemCount = itemCount
    pagination.prefix = (PaginationInfo) => {
      return `共：${PaginationInfo.itemCount}条`
    }
    emit('getDataCallback', data)
  } catch (error) {
    tableData.value = []
    pagination.itemCount = 0
    pagination.prefix = () => {
      return '共：0条'
    }
  } finally {
    loading.value = false
  }
}
// 根据参数搜索 - 重新访问列表
function handleSearch(params = null) {
  pagination.page = 1
  handleQuery(params)
}
const isShowListPagination = ref(true)
function showGetList(filterList) {
  pagination.page = 1
  isShowListPagination.value = false
  if (props.listData.length) tableData.value = filterList
}

function handleRefreshCurr() {
  handleQuery()
}
const columnsRef = ref(props.columns)
function sorterHandle(sorter) {
  columnsRef.value.forEach((column) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) return
    if (!sorter) return (column.sortOrder = false)
    if (column.key === sorter.columnKey) {
      const params = { level: 2 }
      column.sortOrder = sorter.order
      if (!column.pid) return
      params.pid = column.pid
      if (sorter.order == 'descend') {
        params.level = 1
      }
      handleQuery(params)
      // return
    } else {
      column.sortOrder = false
    }
  })
  // console.log('columnsRef.value', columnsRef.value)
}
function finishImportHandle() {
  emit('finishImport')
}
async function handleReset() {
  const queryItems = { ...props.queryItems }
  for (const key in queryItems) {
    if (typeof queryItems[key] === 'object') {
      queryItems[key] = null
      continue
    }
    queryItems[key] = ''
  }
  emit('update:queryItems', { ...queryItems, ...initQuery })
  await nextTick()
  pagination.page = 1
  handleQuery()
}
function onPageChange(currentPage) {
  pagination.page = currentPage
  const params = {}
  const sortFindIndex = columnsRef.value.findIndex((column) => {
    if (!['descend', 'ascend'].includes(column.sortOrder)) return false
    params.level = 2
    params.pid = column.pid
    if (column.sortOrder == 'descend') {
      params.level = 1
    }
    return true
  })
  if (!props.remote) return
  handleQuery(params)
}
let addKeyList = []
function onChecked(rowKeys, rows) {
  const rowKeysList = rowKeys
  if (props.columns.some((item) => item.type === 'selection')) {
    if (props.addKey) {
      const keyValue = Object.keys(props.addKey)[0]
      addKeyList = rows.map((res) => {
        return {
          [keyValue]: res[keyValue],
          id: res.id,
        }
      })
    }
    emit('onChecked', rowKeysList, addKeyList, rows)
  }
}
// 当前列表选中的行
function itemClick(event) {
  const rowIndex = event.target.parentNode.rowIndex
  if (rowIndex === undefined) return
  emit('onItemClick', tableData.value[rowIndex])
}
async function handleExport() {
  let paginationParams = {}
  // 如果非分页模式或者使用前端分页,则无需传分页参数
  if (props.isPagination && props.remote) {
    paginationParams = { page: pagination.page, size: pagination.pageSize }
  }
  let param = { ...props.queryItems, ...paginationParams }
  emit('export', param)
}
function addKeyChange(value, index, rows) {
  const keyValue = Object.keys(props.addKey)[0]
  const id = rows.id
  addKeyList.forEach((res) => {
    if (res.id == id) res[keyValue] = value
  })
  tableData.value[index][keyValue] = value
  emit('onAddKeyCheck', addKeyList, rows)
  //   添加当前选中行的信息
}
function rowKeyChangeValue(key, value, index, rows) {
  const keyValue = key
  tableData.value[index][keyValue] = value
  //   添加当前选中行的信息
}
function getTableData() {
  return tableData.value
}

defineExpose({
  handleSearch,
  handleReset,
  handleRefreshCurr,
  handleExport,
  addKeyChange,
  rowKeyChangeValue,
  getTableData,
  tableData,
  showGetList,
})
</script>
