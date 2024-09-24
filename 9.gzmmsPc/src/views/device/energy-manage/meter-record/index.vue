<script setup lang="ts">
/* 点巡检管理-抄表记录-列表页面 */
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { getEquipmentSelectApi } from "@/api/device/common/index";
import {
  getMeterRecordAddApi,
  getMeterRecordDelApi,
  getMeterRecordDetailApi,
  getMeterRecordEditApi,
  getMeterRecordListApi,
} from "@/api/device/inspection/meter-record/index";
import type { MeterRecoedItemType } from "@/api/device/inspection/meter-record/types";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceEnergyManageMeterRecord",
});

const {
  columns,
  searchColumns,
  pagination,
  addFormColumns,
  getBase,
  treeData,
  placeList,
  formData,
  addFormData,
  addRules,
  deviceEquipmentData,
  selectEquipment,
  dialogType,
} = useList();

const formRef = ref();
const tableData = ref<MeterRecoedItemType[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();
const equipment_type = ref("");

const PlusAddFormRef = ref();
const addFormRef = computed(() => {
  return PlusAddFormRef.value.formInstance as FormInstance;
});

/** 抄表弹窗表单控制开关 */
const dialogVisible = ref(false);
const dialogTitle = computed(() => {
  return dialogType.value === 1 ? "新增抄表数据" : "编辑抄表数据";
});

const listId = ref(0);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

async function getData() {
  let { create_time, this_meter_time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
    this_meter_time_start: isArray(this_meter_time) ? this_meter_time[0] : "",
    this_meter_time_end: isArray(this_meter_time) ? this_meter_time[1] : "",
    ...rest,
  };
  tableLoading.value = true;
  const reuslt = await getMeterRecordListApi(data);
  tableLoading.value = false;
  tableData.value = reuslt.data.list;
  pagination.total = reuslt.data.total;
}

const handleAdd = () => {
  listId.value = 0;
  dialogType.value = 1;
  dialogVisible.value = true;
  nextTick(() => {
    addFormRef.value.resetFields();
    resetAddFormData();
  });
};

function cellEdit(row: MeterRecoedItemType) {
  dialogType.value = 2;
  listId.value = row.id;
  addFormData.value.equipment_type_id = row.equipment_type_id;
  addFormData.value.equipment_id = row.equipment_id;
  addFormData.value.is_produce = row.is_produce;
  addFormData.value.use_addr = row.use_addr;
  addFormData.value.save_addr_text = row.use_places;
  addFormData.value.class_no = row.class_no;
  addFormData.value.class_type = row.class_type;
  addFormData.value.last_meter_time = row.last_meter_time;
  addFormData.value.this_meter_time = row.this_meter_time;
  addFormData.value.start_num = row.start_num;
  addFormData.value.end_num = row.end_num;
  addFormData.value.purpose = row.purpose;
  addFormData.value.dosage_num = row.dosage_num;
  addFormData.value.meter_readings_id = row.meter_readings_id;
  addFormData.value.note = row.note;
  addFormData.value.equipment_name = row.bar_title;

  dialogVisible.value = true;
}

function resetAddFormData() {
  addFormData.value.equipment_type_id = undefined;
  addFormData.value.equipment_id = undefined;
  addFormData.value.is_produce = undefined;
  addFormData.value.use_addr = "";
  addFormData.value.save_addr_text = "";
  addFormData.value.class_no = undefined;
  addFormData.value.class_type = undefined;
  addFormData.value.last_meter_time = "";
  addFormData.value.this_meter_time = "";
  addFormData.value.start_num = "";
  addFormData.value.end_num = "";
  addFormData.value.purpose = undefined;
  addFormData.value.dosage_num = "";
  addFormData.value.meter_readings_id = undefined;
  addFormData.value.note = "";
}

function cellDel(row: MeterRecoedItemType) {
  ElMessageBox.confirm(`确认要删除抄表流水号为：【${row.serial_number_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await getMeterRecordDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

function nodeChange(name: string, idList: number[]) {
  if (idList.length > 0) {
    equipment_type.value = idList.reverse().join(",");
    getEquipmentList();
  }
}
/** 根据资产类型获取设备档案列表 */
async function getEquipmentList() {
  let data = {
    equipment_type: equipment_type.value,
    page: 1,
    size: 1000,
  };
  const result = await getEquipmentSelectApi(data);
  deviceEquipmentData.value = result.data.list;
  console.log("addFormData.value.equipment_type_id ", addFormData.value.equipment_type_id);
  selectEquipment.value = true;
  console.log("🚀 ~ getEquipmentList ~ selectEquipment.value:", selectEquipment.value);
}

function handleAddChange(values: FieldValues, column: PlusColumn) {
  // console.log("🚀 ~ handleAddChange ~ column:", column);
  // console.log("🚀 ~ handleAddChange ~ values:", values);
  if (column.prop === "equipment_id") {
    let addr_info = deviceEquipmentData.value.find((item) => item.id === values.equipment_id);
    addFormData.value.use_addr = addr_info?.save_addr as string;
    addFormData.value.save_addr_text = addr_info?.save_addr_text as string;
    console.log("🚀 ~ handleAddChange ~  addFormData.value:", addFormData.value);
  }
}

async function handleAddConfirm() {
  const validateRes = await addFormRef.value.validate();
  if (!validateRes) return;
  let { save_addr_text, equipment_name, ...rest } = addFormData.value;

  let data = listId.value
    ? {
        id: listId.value,
        ...rest,
      }
    : {
        ...rest,
      };
  const result = listId.value
    ? await getMeterRecordEditApi(data)
    : await getMeterRecordAddApi(data);
  dialogVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

onActivated(() => {
  getBase();
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
        <template #plus-field-equipment_type_id>
          <TreeSelect :list="treeData" v-model="formData.equipment_type_id"></TreeSelect>
        </template>
        <template #plus-field-use_addr_id>
          <!-- 选择使用位置 -->
          <PlaceSelect :placeList="placeList" v-model="formData.use_addr_id"></PlaceSelect>
        </template>
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleAdd" v-hasPerm="['energy:meterrecord:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新增抄表
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            :data="tableData"
            :columns="dynamicColumns"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            header-cell-class-name="table-gray-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            :loading="tableLoading"
          >
            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellEdit(row)"
                v-hasPerm="['energy:meterrecord:edit']"
              >
                编辑
              </el-button>
              <el-button
                type="info"
                link
                @click="cellDel(row)"
                v-hasPerm="['energy:meterrecord:del']"
              >
                删除
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      ref="PlusAddFormRef"
      :dialog="{
        title: dialogTitle,
        cancelText: '取消',
        confirmText: '确定',
        draggable: true,
      }"
      v-model:visible="dialogVisible"
      v-model="addFormData"
      :form="{
        columns: addFormColumns,
        rules: addRules,
        colProps: { span: 12 },
        rowProps: { gutter: 20 },
        labelWidth: '110',
        labelPosition: 'right',
      }"
      @change="handleAddChange"
      @confirm="handleAddConfirm"
    >
      <template #plus-field-equipment_type_id>
        <TreeSelect
          :list="treeData"
          v-model="addFormData.equipment_type_id"
          @nodeChange="nodeChange"
        ></TreeSelect>
      </template>
    </PlusDialogForm>
  </div>
</template>
<style lang="scss" scoped>
// :deep(.el-form-item__content) {
//   flex: 1 !important;
//   .flex {
//     margin-left: 20px;
//   }
// }
</style>
