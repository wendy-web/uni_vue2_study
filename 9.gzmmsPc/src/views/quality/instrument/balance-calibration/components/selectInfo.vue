<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { getScaledeviceInitApi } from "@/api/quality/instrument/balance-calibration";
import type { ScaledeviceInitType } from "../utils/add";
import { useSelect } from "./columns";

const { columns, searchColumns, pagination } = useSelect();

const test_list = [
  {
    id: 4,
    sort: 1,
    use_place_id: "51,57",
    use_place: "车间/三车间",
    inst_id: 12,
    name: "电子秤",
    productserial_no: "CCBH12345",
    inst_type_no: "YQXH12345",
    max_val: "500.00",
    max_unit: "g",
    e_val: "250.00",
    e_unit: "g",
    d_val: "100.00",
    d_unit: "g",
    weight_val: "150.00",
    weight_unit: "g",
    update_time: "2024-07-30 17:17:02",
    ct_uid: 58,
    ct_name: "test_wang",
    up_uid: 74,
    up_name: "txc_pz",
    create_time: "2024-07-29 15:24:07",
  },
  {
    id: 9999,
    sort: 1,
    use_place_id: "51,57",
    use_place: "车间/三车间",
    inst_id: 12,
    name: "电子秤",
    productserial_no: "CCBH12345",
    inst_type_no: "YQXH12346",
    max_val: "500.00",
    max_unit: "g",
    e_val: "250.00",
    e_unit: "g",
    d_val: "100.00",
    d_unit: "g",
    weight_val: "150.00",
    weight_unit: "g",
    update_time: "2024-07-30 17:17:02",
    ct_uid: 58,
    ct_name: "test_wang",
    up_uid: 74,
    up_name: "txc_pz",
    create_time: "2024-07-29 15:24:07",
  },
  {
    id: 9998,
    sort: 1,
    use_place_id: "51,57",
    use_place: "车间/三车间",
    inst_id: 12,
    name: "电子秤",
    productserial_no: "CCBH12345",
    inst_type_no: "YQXH12346",
    max_val: "500.00",
    max_unit: "g",
    e_val: "250.00",
    e_unit: "g",
    d_val: "100.00",
    d_unit: "g",
    weight_val: "150.00",
    weight_unit: "g",
    update_time: "2024-07-30 17:17:02",
    ct_uid: 58,
    ct_name: "test_wang",
    up_uid: 74,
    up_name: "txc_pz",
    create_time: "2024-07-29 15:24:07",
  },
];

interface Props {
  ids: number[];
  use_place_id: string;
  weight_val: string;
  weight_unit: string;
  max_val: string;
  max_unit: string;
}

const props = defineProps<Props>();
const model = defineModel({ required: true, default: false });
const emit = defineEmits(["change"]);

const formData = ref({
  inst_type_no: "", //型号
  productserial_no: "", //出厂编码
});

const formRef = ref();
const tableData = ref<ScaledeviceInitType[]>([]); //列表分页数据

const selectData = ref<ScaledeviceInitType[]>([]); //勾选的数据列表
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
  pagination.currentPage = 1;
  model.value = false;
};

async function getData() {
  let data = {
    type: 4,
    use_place_id: props.use_place_id,
    weight_val: props.weight_val,
    weight_unit: props.weight_unit,
    max_val: props.max_val,
    max_unit: props.max_unit,
    ...formData.value,
  };
  const result = await getScaledeviceInitApi(data);
  tableData.value = result.data;
  // tableData.value = test_list;
  checkId();
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
    return item.id;
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
    if (idsList.value.includes(item.id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

watch(
  () => props.ids,
  (newValue) => {
    // console.log("🚀 ~ props.ids-newValue:", newValue);
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
      title="天平信息"
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
      <!--  :pagination="pagination"
        @page-size-change="getData()"
        @page-current-change="getData()" -->
      <pure-table
        ref="prueTableRef"
        row-key="id"
        @selection-change="changeSelect"
        :data="tableData"
        :columns="columns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 200 }"
        header-cell-class-name="table-gray-header"
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
