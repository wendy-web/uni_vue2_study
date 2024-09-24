<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { getInnerCoatingList } from "@/api/quality/common/index";
import type { InnerCoatingListType } from "@/api/quality/common/types";
import { useSelect } from "./columns";

interface Props {
  ids: string[];
  check_time: string; //检验日期
  supplier_id: number | undefined;
  sku: string;
}

const { columns, searchColumns, pagination } = useSelect();

const props = defineProps<Props>();
const model = defineModel({ required: true, default: false });
const emit = defineEmits(["change"]);

const formData = ref({
  batch_no: "", //批号
  check_time: props.check_time, //检验日期
  supplier_id: props.supplier_id, //供应商id
  sku: props.sku, // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
});

const formRef = ref();
const tableData = ref<InnerCoatingListType[]>([]); //列表分页数据
const allTableData = ref<InnerCoatingListType[]>([]); //从接口获取的列表总数据
const selectData = ref<InnerCoatingListType[]>([]); //勾选的数据列表
const selectList = ref<string[]>([]); //勾选的数据id列表
const idsList = ref<string[]>([]);
const btnLoading = ref(false);
const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const handleSearch = () => {
  getData();
};

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 抽屉弹窗关闭之前的回调
const drawerBeforeClose = () => {
  selectTableRef.value!.clearSelection();
  btnLoading.value = false;
  selectData.value = [];
  formData.value.batch_no = "";
  formData.value.check_time = "";
  // pagination.currentPage = 1;
  model.value = false;
};

async function getData() {
  const result = await getInnerCoatingList({ ...formData.value });
  allTableData.value = result.data;
  setPage();
  checkId();
}
function setPage() {
  //allTableData为全部数据，tableData是目前表格绑定的数据
  tableData.value = allTableData.value.slice(
    (pagination.currentPage - 1) * pagination.pageSize,
    pagination.currentPage * pagination.pageSize,
  );
  // console.log("pageUserList.value", pageUserList.value);
  pagination.total = allTableData.value.length;
}

// 点击取消 关闭弹窗
const clickColse = () => {
  model.value = false;
};

function changeSelect(selection: any[]) {
  selectData.value = selection;
}
// 按钮选择单元格事件
const toggleSelection = (row: any) => {
  //   console.log("selectTableRef.value", selectTableRef.value);
  //@ts-expect-error
  selectTableRef.value!.toggleRowSelection(row, undefined);
};

// 点击确认选择
const clickSubmit = () => {
  btnLoading.value = true;
  selectList.value = selectData.value.map((item) => {
    return item.unique_id;
  });
  if (selectList.value.length === 0) {
    btnLoading.value = false;
    return;
  }

  let arr = selectData.value;
  setTimeout(() => {
    selectTableRef.value!.clearSelection();
    selectList.value = [];
    btnLoading.value = false;
    emit("change", arr);
  }, 200);
};
function checkId() {
  tableData.value.forEach((item) => {
    if (idsList.value.includes(item.unique_id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

const setStatus = () => {
  tableData.value.forEach((item, index) => {
    if (selectList.value.includes(item.unique_id)) {
      item.select_status = true;
    }
  });
  selectTableRef.value!.clearSelection();
  selectList.value = [];
};

defineExpose({
  setStatus: setStatus,
});

watch(
  () => props.ids,
  (newValue) => {
    console.log("🚀 ~ props.ids-newValue:", newValue);
    idsList.value = newValue;
    checkId();
  },
  {
    immediate: true,
  },
);
watch(model, (newValue) => {
  if (newValue) {
    formData.value.check_time = props.check_time;
    formData.value.supplier_id = props.supplier_id;
    formData.value.sku = props.sku;

    getData();
  }
});
</script>
<template>
  <div class="select-wrapper">
    <el-drawer
      title="待新增清单"
      v-model="model"
      direction="rtl"
      size="70%"
      :before-close="drawerBeforeClose"
      destroy-on-close
    >
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 6 }"
        ref="formRef"
        class="pb-4"
      >
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
      <pure-table
        ref="prueTableRef"
        row-key="unique_id"
        @selection-change="changeSelect"
        :data="tableData"
        :columns="columns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 200 }"
        header-cell-class-name="table-gray-header"
        :pagination="pagination"
        @page-size-change="setPage()"
        @page-current-change="setPage()"
      >
        <template #operation="scope">
          <el-button
            type="primary"
            :disabled="scope.row.select_status"
            @click="toggleSelection(scope.row)"
          >
            {{ scope.row.select_status ? "已添加" : "选择" }}
          </el-button>
        </template>
      </pure-table>
      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确认选择
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-drawer__header) {
  color: #000000;
  margin-bottom: 0;
}
</style>
