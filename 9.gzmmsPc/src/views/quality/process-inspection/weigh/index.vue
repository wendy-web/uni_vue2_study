<script setup lang="ts">
/* 空罐顶盖重量检测列表页 */
import { Plus } from "@element-plus/icons-vue";
import type { Column, FormInstance, TableInstance } from "element-plus";
import { debounce, isArray } from "@pureadmin/utils";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRouter } from "vue-router";

/** 空罐顶盖重量检测列表页 */
import { createApi, getListApi, makeReportApi } from "@/api/quality/process-inspection/weigh/index";
import { useCommonHooks } from "@/hooks/quality";
import { useList } from "./utils/hook";

defineOptions({
  name: "ProcessInspectionWeigh",
});
const router = useRouter();
const { startDownloadUrl } = useCommonHooks();

/** plusform搜索表单的ref */
const plusFormRef = ref();
/** 表单的ref */
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const tableData = ref([]);
const tableLoading = ref(false);
/** puretable的ref */
const prueTableRef = ref();
/** 表格的ref */
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
const listId = ref(0);
/** add表单的ref */
const dialogTitle = ref("新增");
const dialogFormRef = ref();
const addFormRef = computed(() => {
  return dialogFormRef.value.formInstance as FormInstance;
});

const ids = ref<number[]>([]);
const {
  formData,
  searchColumns,
  columns,
  pagination,
  addFormData,
  addFormColumns,
  addFormRules,
  addVisible,
  initBaseData,
  weightColumns,
  weightFormRules,
  weightTableData,
  weightTableFormRef,
  addTableForm,
} = useList(handleSearch);

/** 点击生成报告 */
function cellGenerateReport() {
  if (ids.value.length === 0) {
    return ElMessage.warning("请您至少勾选一条数据");
  }
  startDownloadUrl(makeReportApi, { id: ids.value });
}

// 勾选触发事件
function changeSelect(selection: any[]) {
  ids.value = selection.map((item) => {
    return item.id;
  });
}

// /** 监听表单的变化 */
const handleChange = (values: FieldValues, column: PlusColumn) => {};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  getData();
};

// 点击搜索
function handleSearch() {
  getData();
}
// 表格行-点击事件
const handleRowClick = (row: any, column: Column) => {
  // 点击单据编号 打开详情不可编辑
  if (column.property === "order_no") {
    router.push({
      path: "/quality/process-inspection/weigh/add",
      query: {
        pageType: 3,
        id: row.id,
        assocType: row.assoc_type,
      },
    });
    return;
  }
  // 弹窗显示：检验信息和附件
};

// 点击新建-弹窗
const handleAdd = () => {
  // 初始化下拉数据
  initBaseData();
  listId.value = 0;
  // 初始化表单
  addFormData.value.supplier_name = "";
  addFormData.value.supplier_id = "";
  addFormData.value.remark = "";
  addFormData.value.check_date = "";
  addFormData.value.weight.forEach((item: any) => {
    item.vals = "";
  });
  dialogTitle.value = "新增空罐+顶盖称重";
  addVisible.value = true;
  console.log("点击新增");
};
/** 新建/编辑弹窗点击确定 */
const addConfirm = debounce(addConfirmHandle, 1000, true);

async function addConfirmHandle() {
  const vaildateRes = await addFormRef.value
    ?.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  let weight_all_vals = addFormData.value.weight.every((item: any) => {
    return item.vals;
  });
  if (!vaildateRes) return;
  console.log("lvalid:", vaildateRes);
  console.log("weight_all_vals:", weight_all_vals);
  if (!weight_all_vals) {
    ElMessage.warning("请填写10个称重数据");
    return;
  }

  const result = await createApi({ ...addFormData.value });
  addVisible.value = false;
  ElMessage.success(result.msg);
  getData();
}
// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/quality/process-inspection/weigh/add",
    query: {
      pageType: 2,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};
// 单元格点击删除
// const cellDel = (row: any) => {
//   ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     type: "warning",
//   })
//     .then(async () => {
//       let result = await deleteOrderApi({ id: row.id });
//       ElMessage.success(result.msg);
//       getData();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
const cellDetail = (row: any) => {
  router.push({
    path: "/quality/process-inspection/weigh/add",
    query: {
      pageType: 3,
      id: row.id,
      assocType: row.assoc_type,
    },
  });
};

async function getData() {
  try {
    let { check_date_arr, ...rest } = formData.value;

    let data = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      check_date_start: isArray(check_date_arr) ? check_date_arr[0] : "",
      check_date_end: isArray(check_date_arr) ? check_date_arr[1] : "",
      ...rest,
    };
    tableLoading.value = true;
    const result = await getListApi(data);
    tableData.value = result.data.list;
    pagination.total = result.data.total;
    tableLoading.value = false;
  } catch (error) {
    tableLoading.value = false;
  }
}
watch(
  () => addFormData.value.weight,
  (data) => {
    if (data) {
      // 重量变化计算 平均值，最高值，差值
      // 初始化一个对象，用来存储最大值、最小值、和、平均值
      const result = data.reduce(
        (acc, item) => {
          const value = Number(item.vals);
          // 更新最大值
          if (value > acc.max_weight) acc.max_weight = value;
          // 更新最小值
          if (value < acc.min_weight) acc.min_weight = value;
          // 累加和
          acc.sum += value;
          return acc;
        },
        { max_weight: -Infinity, min_weight: Infinity, sum: 0, avg_weight: 0, diff_weight: 0 },
      );
      // 计算平均值
      result.avg_weight = result.sum / data.length;
      // 计算差值
      result.diff_weight = result.max_weight - result.min_weight;
      let { max_weight, min_weight, avg_weight, diff_weight } = result;
      addFormData.value.max_weight = max_weight;
      addFormData.value.min_weight = min_weight;
      addFormData.value.avg_weight = avg_weight;
      addFormData.value.diff_weight = diff_weight;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

onActivated(() => {
  // 获取列表数据
  getData();
});
</script>
<template>
  <div class="app-container h-[calc(100vh-200px)]">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        ref="plusFormRef"
        @change="handleChange"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      ></PlusSearch>
    </div>

    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons="scope">
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['pi:weigh:add']">
            新建
          </el-button>
          <el-button type="primary" @click="cellGenerateReport" v-hasPerm="['pi:weigh:report']">
            导出数据
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            row-key="id"
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            @page-size-change="getData()"
            @page-current-change="getData()"
            @row-click="handleRowClick"
            @selection-change="changeSelect"
          >
            <template #weight="{ row }">
              <div class="flex overflow-x-auto">
                <div
                  class="border min-w-[90px] h-full py-[10px]"
                  v-for="item in row.weight"
                  :key="item"
                >
                  {{ item.vals }}
                </div>
              </div>
            </template>

            <template #operation="{ row }">
              <el-button
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['pi:weigh:detail']"
              >
                详情
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <!-- 新建弹窗 -->
    <PlusDialog
      class="w-[450px] m-auto"
      v-model="addVisible"
      :title="dialogTitle"
      cancel-text="取消"
      confirm-text="确定"
      width="880px"
      @confirm="addConfirm"
    >
      <div class="flex justify-between">
        <div class="rounded flex-shrink-0 w-[60%] mr-[10px]">
          <PlusForm
            v-model="addFormData"
            :group="addFormColumns"
            :rules="addFormRules"
            :hasFooter="false"
            labelPosition="right"
            ref="dialogFormRef"
          >
            <template #group-header="{ title, icon }">
              <div class="custom-group-header">
                <span class="font-bold">
                  {{ title }}
                </span>
              </div>
            </template>
          </PlusForm>
        </div>
        <div class="border rounded w-[40%]">
          <div class="font-bold p-[10px]">称重数据</div>
          <el-form
            :model="addTableForm"
            ref="weightTableFormRef"
            :rules="weightFormRules"
            :validate-on-rule-change="false"
          >
            <PureTable
              ref="addPrueTableRef"
              row-key="index"
              alignWhole="center"
              :data="weightTableData"
              :columns="weightColumns"
              border
            >
              <template #vals="{ row, $index, column }">
                <el-form-item
                  :prop="`weightTableData.${$index}.vals`"
                  :rules="weightFormRules.vals"
                >
                  <el-input v-model="row.vals" type="number" placeholder="请输入重量" />
                </el-form-item>
              </template>
            </PureTable>
          </el-form>
        </div>
      </div>
    </PlusDialog>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles//common.scss";
</style>
