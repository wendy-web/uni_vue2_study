<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import {
  ElectricMeterReadSaveApi,
  electricMeterReadDelApi,
  getElectricMeterReadListApi,
} from "@/api/energy/electric-meter/meter-reading/index";
import placeSelectVue from "@/components/DeptSelect/PlaceSelect.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import addMeterDataVue from "@/views/energy/components/addMeterData/index.vue";
import treeVue from "@/views/energy/components/tree/index.vue";
import { useList } from "./utils/hook";

/* 电表抄表记录 */
defineOptions({
  name: "EnergyElectricMeterReadingRecord",
});
const {
  columns,
  searchColumns,
  pagination,
  formData,
  getPlaceList,
  placeList,
  getRelData,
  relList,
} = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const meterDataTitle = ref("新增抄表数据");
const listId = ref(0);
const relId = ref(0);

const treeRef = ref<InstanceType<typeof treeVue>>();

function handleSearch() {
  getData();
}
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  treeRef.value?.onTreeReset();
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
  const result = await getElectricMeterReadListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.data;
  pagination.total = result.data.total;
}

function onTreeSelect(val: number[]) {
  let value = val[0];
  formData.value.rel_id = value;
  getData();
}

/** 点击新建 */
function handleAdd() {
  listId.value = 0;
  relId.value = 0;
  meterDataTitle.value = "新增抄表数据";
  showMeterConfig();
}

const addMeterDataRef = ref();
function showMeterConfig() {
  addDialog({
    top: "10vh",
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    title: meterDataTitle.value,
    contentRenderer: () =>
      h(addMeterDataVue, {
        ref: addMeterDataRef,
        orderType: 0,
        relId: relId.value,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const vaildateRes = await addMeterDataRef.value?.validatorForm();
      console.log("vaildateRes", vaildateRes);
      if (!vaildateRes) return;
      updateDialog(true, "btnLoading");
      let { relValue, ...rest } = addMeterDataRef.value?.addFormData;
      let {
        equipment_type_id,
        equipment_type_name,
        use_addr,
        use_addr_text,
        asset_no,
        bar_title,
        eq_id,
      } = addMeterDataRef.value?.eqipmentInfo;
      let data = {
        ...rest,
        equipment_type_id,
        equipment_type_name,
        equipment_id: eq_id,
        use_addr,
        use_addr_text,
        asset_no,
        bar_title,
        id: listId.value ? listId.value : undefined,
      };
      console.log("🚀 ~ beforeSure: ~ data:", data);
      // return;
      try {
        const result = await ElectricMeterReadSaveApi(data);
        ElMessage.success(result.msg);
        getData();
      } finally {
        updateDialog(false, "btnLoading");
      }
      done();
    },
  });
}

function cellEdit(row: any) {
  meterDataTitle.value = "编辑抄表数据";
  console.log("🚀 ~ cellEdit ~ row:", row);
  listId.value = row.id;
  relId.value = row.rel_id;
  let eqipmentData = {
    asset_no: row.asset_no,
    bar_title: row.bar_title,
    use_addr_text: row.use_addr_text,
    equipment_type_name: row.equipment_type_name,
    equipment_type_id: row.equipment_type_id,
    eq_id: row.equipment_id,
  };

  let data = {
    relValue: {
      is_bind: true,
      id: row.rel_id,
      name: row.rel_name,
    },
    rel_id: row.rel_id,
    rel_name: row.rel_name,
    is_produce: row.is_produce,
    class_no: row.class_no ? row.class_no : undefined,
    class_type: row.class_type ? row.class_type : undefined,
    meter_readings_id: row.meter_readings_id,
    dosage_num: row.dosage_num,
    last_meter_time: row.last_meter_time,
    this_meter_time: row.this_meter_time,
    start_num: row.start_num,
    end_num: row.end_num,
    purpose: row.purpose,
    note: row.note,
  };

  showMeterConfig();
  nextTick(() => {
    addMeterDataRef.value!.setFormData(eqipmentData, data);
  });
}

function cellDel(row: any) {
  ElMessageBox.confirm(`确认要删除抄表流水号为：【${row.serial_number_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await electricMeterReadDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

onActivated(() => {
  getRelData(0);
  getPlaceList();
  getData();
});
</script>
<template>
  <div class="app-container flex">
    <treeVue
      class="min-w-[200px] mr-[10px]"
      :treeData="relList"
      @tree-select="onTreeSelect"
      ref="treeRef"
    ></treeVue>

    <div class="w-[calc(100%-220px)]">
      <div class="app-card">
        <PlusSearch
          v-model="formData"
          :columns="searchColumns"
          :showNumber="5"
          ref="plusFormRef"
          @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
          @search="handleSearch"
        >
          <template #plus-field-save_addr>
            <!-- 选择使用位置 -->
            <placeSelectVue :placeList="placeList" v-model="formData.save_addr"></placeSelectVue>
          </template>
        </PlusSearch>
      </div>
      <div class="app-card">
        <PureTableBar :columns="columns" @refresh="handleSearch">
          <template #buttons>
            <el-button
              type="primary"
              @click="handleAdd"
              v-hasPerm="['electricmeter:meterreading:addedit']"
            >
              <template #icon>
                <i-ep-plus></i-ep-plus>
              </template>
              新增手动抄表
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
                  v-hasPerm="['electricmeter:meterreading:addedit']"
                >
                  编辑
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="cellDel(row)"
                  v-hasPerm="['electricmeter:meterreading:del']"
                >
                  删除
                </el-button>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
