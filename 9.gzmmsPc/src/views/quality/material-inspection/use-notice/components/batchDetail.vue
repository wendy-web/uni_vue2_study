<script setup lang="ts">
import type { FormInstance } from "element-plus";
// import { cloneDeep } from "@pureadmin/utils";
import { GroupedList } from "../utils/add";
import { useDetailSelect } from "./columns";

interface Props {
  list: GroupedList[];
}

const props = defineProps<Props>();

const { columns, searchColumns } = useDetailSelect();

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
// const cloneDeepTableData = ref<GroupedList[]>([]);

function hanleRemove(row: GroupedList) {
  console.log("🚀 ~ hanleRemove ~ row:", row);
  tableData.value = tableData.value.filter((item) => item.check_detail_id !== row.check_detail_id);
}

// 点击搜索
// const handleSearch = () => {
//   getData();
// };

// 点击重置
// const handleReset = (formEl: FormInstance | undefined) => {
//   if (!formEl) return;
//   formEl.resetFields();
//   getData();
// };
function getData() {
  tableData.value = tableData.value.filter((item) => {
    if (formData.value.keyword) {
      return item.batch_no.includes(formData.value.keyword);
    } else {
      return true;
    }
  });
}

defineExpose({
  tableData,
});

watch(
  () => props.list,
  (val) => {
    tableData.value = val;
    // cloneDeepTableData.value = val;
  },
  {
    immediate: true,
  },
);
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
      row-key="check_detail_id"
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
