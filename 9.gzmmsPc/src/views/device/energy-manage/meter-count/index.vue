<script setup lang="ts">
/* 点巡检管理-表计读数-列表页面 */
import type { FormInstance } from "element-plus";
import { getCountListApi, getCountSaveApi } from "@/api/device/inspection/meter-count/index";
import type { meterCountItemType } from "@/api/device/inspection/meter-count/types";
import Add from "./components/add.vue";
import Detail from "./components/detail.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceEnergyManageMeterCount",
});

const {
  columns,
  pagination,
  editVisible,
  editFormData,
  editColumns,
  editRules,
  getRelation,
  relationgList,
} = useList();

const addRef = ref<InstanceType<typeof Add>>();
const formRef = ref();
const tableData = ref<meterCountItemType[]>([]);
const tableLoading = ref(false);
const prueTableRef = ref();

const addVisible = ref(false);
const detailVisible = ref(false);
const detailInfo = ref();

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
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
  tableLoading.value = true;
  const result = await getCountListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  tableLoading.value = false;
}

/** 点击新增关联 */
function handleAdd() {
  addVisible.value = true;
}

async function addConfirm(data: { eq_id: number; rel_id: number }) {
  console.log("data", data);
  const result = await getCountSaveApi(data);
  addRef.value?.clickColse();
  ElMessage.success(result.msg);
  getData();
}

/** 点击读数明细 */
function cellDetail(row: meterCountItemType) {
  detailInfo.value = {
    watch_id: row.id,
    bar_title: row.bar_title,
    asset_no: row.asset_no,
    save_addr_text: row.save_addr_text,
    rel_id: row.rel_id,
  };
  detailVisible.value = true;
}

/** 点击编辑 */
function cellEdit(row: meterCountItemType) {
  editFormData.value.bar_title = row.bar_title;
  editFormData.value.asset_no = row.asset_no;
  editFormData.value.save_addr_text = row.save_addr_text;
  editFormData.value.rel_id = row.rel_id;
  editFormData.value.eq_id = row.eq_id;
  editFormData.value.id = row.id;
  editVisible.value = true;
}

async function editConfirm() {
  let data = {
    id: editFormData.value.id,
    eq_id: editFormData.value.eq_id,
    rel_id: editFormData.value.rel_id as number,
  };
  const result = await getCountSaveApi(data);
  editVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}

onActivated(() => {
  getRelation();
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleAdd" v-hasPerm="['energy:metercount:addedit']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新增关联
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
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
              <el-button type="primary" link @click="cellDetail(row)" v-hasPerm="['energy:metercount:detail']">读数明细</el-button>
              <el-button type="primary" link @click="cellEdit(row)" v-hasPerm="['energy:metercount:addedit']">编辑</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <Add v-model="addVisible" :list="relationgList" @confirm="addConfirm" ref="addRef"></Add>
    <Detail
      v-model="detailVisible"
      :list="relationgList"
      ref="detailRef"
      :detailInfo="detailInfo"
    ></Detail>
    <PlusDialogForm
      v-model:visible="editVisible"
      v-model="editFormData"
      :form="{ columns: editColumns, rules: editRules, labelWidth: '100' }"
      :dialog="{
        title: '设备关联编辑',
        top: '20vh',
      }"
      @confirm="editConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
