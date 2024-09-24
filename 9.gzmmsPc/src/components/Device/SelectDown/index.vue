<script setup lang="ts">
/* 选择换下备件组件 */
import type { FormInstance, TableInstance } from "element-plus";
import { getDownEqListApi } from "@/api/device/common";
import type { ReBaseSelecModule } from "@/api/device/common/types";
import { useSelectDown } from "./hook";

interface Props {
  ids: number[];
  /** 设备id */
  eqId: number;
}

const props = defineProps<Props>();
const model = defineModel({ required: true, default: false });
const emit = defineEmits(["change"]);

const { columns, searchColumns, pagination } = useSelectDown();

const formData = ref({
  keyword: "",
  out_time: "",
});
const formRef = ref();
const tableData = ref<ReBaseSelecModule.DownListType[]>([]);
const selectData = ref<ReBaseSelecModule.DownListType[]>([]); //勾选的数据列表
const selectList = ref<number[]>([]); //勾选的数据id列表
const idsList = ref<number[]>([]);
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
  formData.value.keyword = "";
  pagination.currentPage = 1;
  model.value = false;
};

// 点击取消 关闭弹窗
const clickColse = () => {
  model.value = false;
};

function changeSelect(selection: ReBaseSelecModule.DownListType[]) {
  selectData.value = selection;
}
// 按钮选择单元格事件
const toggleSelection = (row: ReBaseSelecModule.DownListType) => {
  //   console.log("selectTableRef.value", selectTableRef.value);
  //@ts-expect-error
  selectTableRef.value!.toggleRowSelection(row, undefined);
};

// 点击确认选择
const clickSubmit = () => {
  btnLoading.value = true;
  selectList.value = selectData.value.map((item) => {
    return item.id;
  });
  if (selectList.value.length === 0) {
    btnLoading.value = false;
    return;
  }

  // let arr = selectData.value.map((item) => {
  //   return {
  //     ...item,
  //     down_num: item.online_num,
  //   };
  // });
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
    if (idsList.value.includes(item.repair_id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

const setStatus = () => {
  tableData.value.forEach((item, index) => {
    if (selectList.value.includes(item.repair_id)) {
      item.select_status = true;
    }
  });
  selectTableRef.value!.clearSelection();
  selectList.value = [];
};

defineExpose({
  setStatus: setStatus,
});

async function getData() {
  let { keyword, out_time } = formData.value;
  let data = {
    eq_id: props.eqId,
    keyword,
    page: pagination.currentPage,
    size: pagination.pageSize,
    out_time_start: out_time ? out_time[0] : "",
    out_time_end: out_time ? out_time[1] : "",
  };
  const result = await getDownEqListApi(data);
  tableData.value = result.data.data;
  pagination.total = result.data.total;
  checkId()
}

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
      title="选择换下备件"
      v-model="model"
      direction="rtl"
      size="60%"
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
        row-key="id"
        @selection-change="changeSelect"
        :data="tableData"
        :columns="columns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 200 }"
        header-cell-class-name="table-gray-header"
        :pagination="pagination"
        @page-size-change="getData()"
        @page-current-change="getData()"
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
  margin-bottom: 0;
}
</style>
