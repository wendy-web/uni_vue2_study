<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  getWaterMeterListApi,
  waterMeterAddApi,
  waterMeterEditApi,
} from "@/api/energy/water-meter/gather/index";
import placeSelectVue from "@/components/DeptSelect/PlaceSelect.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import addMeterConfigVue from "@/views/energy/components/addMeterConfig/index.vue";
import readingDetailVue from "@/views/energy/components/readingDetail/index.vue";
import { useList } from "./utils/hook";

/* 水表采集配置 */
defineOptions({
  name: "EnergyWaterMeterGather",
});

const { columns, searchColumns, pagination, formData, getPlaceList, placeList, getRelData } =
  useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const dialogFormRef = ref();
/** 新建表单的ref */
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const listId = ref(0); //编辑时记录的单据id
const relId = ref(0); //编辑时记录的采集id
const meterConfigTitle = ref("新增仪表配置");

/** 读数明细开关 */
const readingDetailVisible = ref(false);
const readingDetailInfo = ref();

function handleSearch() {
  getData();
}
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

async function getData() {
  tableLoading.value = true;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  const result = await getWaterMeterListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}
/** 点击新建 */

function handleAdd() {
  listId.value = 0;
  relId.value = 0;
  meterConfigTitle.value = "新增仪表配置";
  showMeterConfig();
}

const addMeterConfigRef = ref();
function showMeterConfig() {
  addDialog({
    top: "10vh",
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    title: meterConfigTitle.value,
    contentRenderer: () =>
      h(addMeterConfigVue, {
        ref: addMeterConfigRef,
        orderType: 1,
        relId: relId.value,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const vaildateRes = await addMeterConfigRef.value?.validatorForm();
      console.log("vaildateRes", vaildateRes);
      if (!vaildateRes) return;
      updateDialog(true, "btnLoading");
      let { eq_name, director_uid, ...rest } = addMeterConfigRef.value?.addFormData;
      let data = {
        ...rest,
        director_uid: director_uid.join(","),
      };
      console.log("🚀 ~ beforeSure: ~ data:", data);
      try {
        const result = listId.value
          ? await waterMeterEditApi({ ...data, id: listId.value })
          : await waterMeterAddApi(data);
        ElMessage.success(result.msg);
        getData();
      } finally {
        updateDialog(false, "btnLoading");
      }
      done();
    },
  });
}

/** 点击读数明细 */
function cellReadDetail(row: any) {
  console.log("点击读数明细");
  readingDetailInfo.value = {
    id: row.id,
    bar_title: row.bar_title,
    asset_no: row.asset_no,
    save_addr_text: row.use_addr,
    rel_name: row.rel_name,
  };
  readingDetailVisible.value = true;
}

/** 点击编辑 */
function cellEdit(row: any) {
  console.log("点击编辑");
  meterConfigTitle.value = "编辑仪表配置";
  listId.value = row.id;
  relId.value = row.rel_id;
  let data = {
    rel_id: row.rel_id,
    rel_name: row.rel_name,
    auto_rule_type: row.auto_rule_type,
    eq_type: row.eq_type,
    director_uid: row.director_uid
      ? row.director_uid.split(",").map((el: string) => Number(el))
      : [],
    eq_id: row.eq_id,
    eq_name: row.bar_title,
  };
  showMeterConfig();
  nextTick(() => {
    addMeterConfigRef.value!.setFormData(data);
  });
}

onActivated(() => {
  getRelData(1);
  getPlaceList();
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :col-props="{
          span: 5,
        }"
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      >
        <template #plus-field-use_addr_id>
          <!-- 选择使用位置 -->
          <placeSelectVue :placeList="placeList" v-model="formData.use_addr_id"></placeSelectVue>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleAdd" v-hasPerm="['watermeter:gather:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新增仪表配置
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
                @click="cellReadDetail(row)"
                v-hasPerm="['watermeter:gather:info']"
              >
                读数明细
              </el-button>
              <el-button
                type="primary"
                link
                @click="cellEdit(row)"
                v-hasPerm="['watermeter:gather:edit']"
              >
                编辑配置
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <readingDetailVue
      v-model="readingDetailVisible"
      :info="readingDetailInfo"
      :order-type="1"
    ></readingDetailVue>
  </div>
</template>
<style lang="scss" scoped></style>
