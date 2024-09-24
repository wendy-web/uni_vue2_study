<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { getCheckDetailList } from "@/api/quality/common";
import type { CheckDetailListType } from "@/api/quality/common/types";
import { useSelect } from "./columns";

interface Props {
  materials_class: number; //原材料类别
  brand: string; //产品大类
  check_time: string; //检验日期
  ids: unknown[];
}

const { columns, searchColumns, pagination } = useSelect();
const props = withDefaults(defineProps<Props>(), {
  materials_class: 0, //0空罐 1顶盖
  brand: "",
  check_time: "",
  ids: () => [],
});
const model = defineModel({ required: true, default: false });
const emit = defineEmits(["change"]);

const formData = ref({
  batch_no: "", //批号
});

const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const tableData = ref<CheckDetailListType[]>([]); //列表分页数据
const allTableData = ref<CheckDetailListType[]>([]); //从接口获取的列表总数据
const selectData = ref<CheckDetailListType[]>([]); //勾选的数据列表
const selectList = ref<unknown[]>([]); //勾选的数据id列表
const idsList = ref<unknown[]>([]);
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
  // pagination.currentPage = 1;
  model.value = false;
};

async function getData() {
  let data = {
    materials_class: props.materials_class,
    brand: props.brand,
    check_time: props.check_time,
    batch_no: formData.value.batch_no,
  };
  const result = await getCheckDetailList(data);
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
    idsList.value = newValue;
    checkId();
  },
  {
    immediate: true,
  },
);
watch(model, (newValue) => {
  if (newValue) {
    getData();
  }
});
</script>
<template>
  <div class="select-wrapper">
    <el-drawer
      title="新增批号"
      v-model="model"
      direction="rtl"
      size="70%"
      :before-close="drawerBeforeClose"
      destroy-on-close
    >
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        ref="plusFormRef"
        class="pb-4"
         @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
      <pure-table
        ref="prueTableRef"
        row-key="unique_id"
        border
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
        <template #operation="{ row }">
          <el-button type="primary" :disabled="row.select_status" @click="toggleSelection(row)">
            {{ row.select_status ? "已添加" : "选择" }}
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
:deep(.plus-search__button__wrapper .el-form-item__content) {
  flex: 1 !important;
  margin-left: 40px;
}
</style>
