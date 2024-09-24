<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { GroupedList } from "../utils/add";

interface Props {
  list: GroupedList[];
  /** 是否禁用 */
  disabled?: boolean;
}

const props = defineProps<Props>();

/** 表单数据 */
const formData = ref({
  keyword: "", // 关键字
});

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});

const tableData = ref<GroupedList[]>([]);

function hanleRemove(row: any) {
  console.log("🚀 ~ hanleRemove ~ row:", row);  
  tableData.value = tableData.value.filter((item) => item.unique_id !== row.unique_id);
}

// 点击搜索
// const handleSearch = () => {
//   getData();
// };

// // 点击重置
// const handleReset = (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   formEl.resetFields();
//   getData();
// };
// function getData() {}

defineExpose({
  tableData,
});

watch(
  () => props.list,
  (val) => {
    console.log("🚀 ~ batchDetail-val:", val)
    tableData.value = val;
  },
  {
    immediate: true,
  },
);

const columns: TableColumnList = [
  {
    label: "操作",
    slot: "operation",
    hide: () => props.disabled,
  },
  {
    label: "#",
    type: "index",
  },
  {
    label: "批号",
    prop: "batch_no",
    align: "center",
  },
  {
    label: "托盘号",
    prop: "pack_no",
    align: "center",
  },
  {
    label: "线别",
    prop: "line",
    align: "center",
  },
  {
    label: "彩印铁厂家",
    prop: "print_factor",
    align: "center",
  },
  {
    label: "版本",
    prop: "version",
    align: "center",
  },
];

// const searchColumns: PlusColumnList = [
//   {
//     label: "批号",
//     prop: "batch_no",
//     labelWidth: 60,
//   },
// ];
</script>
<template>
  <div class="container">
    <!-- <PlusSearch
      v-model="formData"
      :columns="searchColumns"
      ref="plusFormRef"
      @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
      @search="handleSearch"
      class="mb-4"
    ></PlusSearch> -->
    <pure-table
      ref="prueTableRef"
      row-key="unique_id"
      :data="tableData"
      :columns="columns"
      header-cell-class-name="table-gray-header"
      height="600"
    >
      <template #operation="{ row }">
        <el-button type="primary" link @click="hanleRemove(row)">移除</el-button>
      </template>
    </pure-table>
  </div>
</template>
<style lang="scss" scoped>
:deep(.plus-search__button__wrapper .el-form-item__content) {
  flex: 1 !important;
  margin-left: 40px;
}
</style>
