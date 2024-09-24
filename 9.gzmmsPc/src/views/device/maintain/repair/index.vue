<script setup lang="ts">
/* 设备维修单列表-页面 */
import {
  getRepairApproveApi,
  getRepairDelApi,
  getRepairListApi,
  getRepairRecallApi,
  getRepairRejectApi,
  getRepairSubmitApi,
  getRepairVoidApi,
} from "@/api/device/maintain/repair/index";
import type { RepairItemType } from "@/api/device/maintain/repair/types";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { useListHooks } from "@/hooks/list";
import { isArray } from "@pureadmin/utils";
import dayjs from "dayjs";
import type { FormInstance, TableColumnCtx } from "element-plus";
import type { FieldValues } from "plus-pro-components";
import { useRouter } from "vue-router";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceMaintainRepair",
});

const router = useRouter();

const {
  formData,
  columns,
  searchColumns,
  pagination,
  getReBase,
  getBase,
  treeData,
  departmentList,
  placeList,
  checkAssocType,
  submitColumns,
  submitRules,
  submitFormData,
  submitVisible,
} = useList();

useListHooks(formData);

const plusFormRef = ref();
const tableData = ref<RepairItemType[]>([]);
const prueTableRef = ref();

const listId = ref(0);

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formData.value.status = undefined;
  getData();
};

// 点击新建
function handleAdd() {
  router.push({
    path: "/device/maintain/repair/add",
  });
}

async function getData() {
  let { create_time, ...rest } = formData.value;
  let data = {
    ...rest,
    page: pagination.currentPage,
    size: pagination.pageSize,
    create_time_start: isArray(create_time) ? create_time[0] : "",
    create_time_end: isArray(create_time) ? create_time[1] : "",
  };
  const result = await getRepairListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

// 单元格点击详情
function cellDetail(row: RepairItemType) {
  router.push({
    path: "/device/maintain/repair/detail",
    query: {
      id: row.id,
      assoc_type: row.assoc_type.join(","),
    },
  });
}
// 单元格点击编辑
function cellEdit(row: RepairItemType) {
  router.push({
    path: "/device/maintain/repair/add",
    query: {
      id: row.id,
    },
  });
}
// 单元格点击提交验收
async function cellSubmit(row: RepairItemType) {
  listId.value = row.id;
  submitVisible.value = true;
  submitFormData.value.repair_start_time = row.repair_start_time
    ? row.repair_start_time
    : dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.repair_end_time = row.repair_end_time
    ? row.repair_end_time
    : dayjs().format("YYYY-MM-DD HH:mm");
}

async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getRepairSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getData();
}

// 单元格点击作废
async function cellVoid(row: RepairItemType) {
  ElMessageBox.confirm(`您确定要作废【${row.repair_no}】维修单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const reuslt = await getRepairVoidApi({ id: row.id });
      ElMessage.success(reuslt.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

// 单元格点击撤回
async function cellRecall(row: RepairItemType) {
  const reuslt = await getRepairRecallApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

// 单元格点击验收通过
async function cellApprove(row: RepairItemType) {
  const reuslt = await getRepairApproveApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

// 单元格点击驳回返工
async function cellReject(row: RepairItemType) {
  const reuslt = await getRepairRejectApi({ id: row.id });
  ElMessage.success(reuslt.msg);
  getData();
}

// 单元格点击删除
function cellDel(row: RepairItemType) {
  ElMessageBox.confirm(`确认要删除维修单号为：【${row.repair_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await getRepairDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

interface Product {
  stop_time: string;
  repair_price: string;
}

interface SummaryMethodProps<T = Product> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const len = columns.length;
  const sums: string[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      //如果是第一列，则最后一行展示为“总计”两个字
      sums[index] = "合计";
    } else {
      let propList = ["stop_time", "repair_price"];
      if (propList.includes(column.property)) {
        const values = data.map((item) => item[column.property as keyof Product]);
        if (!values.every((value) => Number.isNaN(value))) {
          let totalRes = values.reduce((prev, curr) => {
            const prevValue = Number(prev);
            const value = Number(curr);
            if (!Number.isNaN(value)) {
              return prevValue + value;
            } else {
              return prevValue;
            }
          }, 0);
          if (column.property === "total_stock_price") {
            sums[index] = totalRes.toFixed(3);
          } else {
            sums[index] = totalRes.toFixed(0);
          }
        }
      } else {
        sums[index] = "";
      }
    }
  });

  return sums;
};

onActivated(() => {
  getData();
  getBase();
  getReBase();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="5"
        :colProps="{ span: 6 }"
        ref="plusFormRef"
      >
        <template #plus-field-equipment_type>
          <TreeSelect :list="treeData" v-model="formData.equipment_type"></TreeSelect>
        </template>
        <template #plus-field-save_addr>
          <!-- 选择使用位置 -->
          <PlaceSelect :placeList="placeList" v-model="formData.save_addr"></PlaceSelect>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
        </template>
        <template #footer="{ handleUnfold, isShowUnfold }">
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
          >
            <template #fold>
              <el-button @click="handleUnfold">
                <template #icon>
                  <i-ep-ArrowUp v-if="isShowUnfold"></i-ep-ArrowUp>
                  <i-ep-ArrowDown v-else></i-ep-ArrowDown>
                </template>
                {{ isShowUnfold ? "收起" : "展开" }}
              </el-button>
            </template>
          </FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="handleAdd" v-hasPerm="['maintain:repair:addedit']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建
          </el-button>
          <!-- <el-button type="primary" @click="">删除</el-button> -->
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
            show-summary
            :summary-method="getSummaries"
          >
            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['maintain:repair:detail']"
              >
                详情
              </el-button>
              <!-- 当前是创建人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <!-- 如果是待提审,已撤回,已驳回状态时, 显示编辑和提审和作废  -->
                <template v-if="row.status === 0 || row.status === 3 || row.status === 4">
                  <el-button
                    type="primary"
                    link
                    @click="cellEdit(row)"
                    v-hasPerm="['maintain:repair:addedit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="cellSubmit(row)"
                    v-hasPerm="['maintain:repair:submit']"
                  >
                    提交验收
                  </el-button>
                  <el-button
                    type="info"
                    link
                    @click="cellVoid(row)"
                    v-hasPerm="['maintain:repair:void']"
                  >
                    作废
                  </el-button>
                </template>
                <!-- 如果是待审核状态时,显示撤回按钮 -->
                <template v-else-if="row.status === 1">
                  <el-button
                    type="info"
                    link
                    @click="cellRecall(row)"
                    v-hasPerm="['maintain:repair:recall']"
                  >
                    撤回
                  </el-button>
                </template>
                <!-- 如果是待审核状态时, 显示删除按钮 -->
                <template v-else-if="row.status === 5">
                  <el-button
                    type="info"
                    link
                    @click="cellDel(row)"
                    v-hasPerm="['maintain:repair:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <!-- 当前是审核人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 2)">
                <!-- 如果是待审核状态 -->
                <template v-if="row.status === 1">
                  <el-button
                    type="success"
                    link
                    @click="cellApprove(row)"
                    v-hasPerm="['maintain:repair:approve']"
                  >
                    验收通过
                  </el-button>
                  <el-button
                    type="info"
                    link
                    @click="cellReject(row)"
                    v-hasPerm="['maintain:repair:reject']"
                  >
                    驳回返工
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <PlusDialogForm
      v-model:visible="submitVisible"
      v-model="submitFormData"
      :form="{ labelWidth: '120', columns: submitColumns, rules: submitRules }"
      :dialog="{
        top: '20vh',
        title: '提交验收',
        cancelText: '取消',
        confirmText: '提交',
        draggable: true,
      }"
      @confirm="submitConfirm"
    />
  </div>
</template>
<style lang="scss" scoped></style>
