<script setup lang="ts">
import type { FormInstance } from "element-plus";
import {
  getProductInListApi,
  handManualCreate,
  manualEdit,
  productInAddApi,
  productInApproveApi,
  productInDelApi,
  productInSubmitApi,
} from "@/api/product-stock/product-in";
import type { ProductInListType } from "@/api/product-stock/product-in/types";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCellOmit } from "@/hooks/table";
import addVue from "./components/add.vue";
import addhandVue from "./components/addhand.vue";
import detailVue from "./components/detail.vue";
import editVue from "./components/edit.vue";
import { useList } from "./utils/hook";

/* 成品入库管理页面 */
defineOptions({
  name: "ProductStockProductIn",
});

const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["goods_name"],
  type: 1,
});
const { columns, searchColumns, pagination, formData, factoryCodeList, getFactoryCodeList } =
  useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<ProductInListType[]>([]);
const tableLoading = ref(false);
/** 详情抽屉开关 */
const detailVisible = ref(false);
/** 编辑抽屉开关 */
const editVisible = ref(false);
/** 记录idanji的id */
const listId = ref(0);
/** 区分自动0手动1类型 */
const in_type = ref(0);

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
  const result = await getProductInListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

/** 点击自动新增入库 */
function automaticAdd() {
  showMeterConfig();
}

const addInStorageRef = ref();
function showMeterConfig() {
  addDialog({
    top: "10vh",
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    title: "新增自动入库",
    contentRenderer: () =>
      h(addVue, {
        ref: addInStorageRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const vaildateRes = await addInStorageRef.value?.validatorForm();
      console.log("vaildateRes", vaildateRes);
      if (!vaildateRes) return;
      let { ws_code_ids, ...rest } = addInStorageRef.value?.addFormData;
      let data = {
        ws_code_ids: ws_code_ids.length > 0 ? ws_code_ids.join(",") : undefined,
        ...rest,
      };
      updateDialog(true, "btnLoading");
      try {
        const result = await productInAddApi(data);
        ElMessage.success(result.msg);
        getData();
      } finally {
        updateDialog(false, "btnLoading");
      }
      done();
    },
  });
}

/** 点击手动新增入库 */
function handMovementAdd() {
  showHandAddConfig("", "");
}
const addHandInStorageRef = ref();
function showHandAddConfig(title: string | undefined, id: "") {
  addDialog({
    top: "10vh",
    width: "90%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    title: title ? title : "新增手动入库",
    contentRenderer: () =>
      h(addhandVue, {
        ref: addHandInStorageRef,
        id: id,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const vaildateRes = await addHandInStorageRef.value?.validatorForm();
      if (!vaildateRes) return;
      const tablesubmit = await addHandInStorageRef.value?.submitForm();
      if (!tablesubmit) return;
      let tableFarmData: any = addHandInStorageRef.value?.tableFarm;
      let needList: any = tableFarmData.tableData;
      let canSbumit: boolean = false;
      let indexNums: Number = 0
      needList.forEach((element: { in_num: any; box_serial_number_start: any; box_serial_number_end: any; }, index: Number) => {
        if (element.in_num != (element.box_serial_number_end - element.box_serial_number_start + 1)) {
          canSbumit = true;
          indexNums = Number(index) + 1
          return;
        }
      });
      if (canSbumit) {
        let showText = `第${indexNums}行：入库数量与箱序列号范围不一致(入库数量 = 结束箱号 - 开始箱号 + 1)`
        ElMessage.warning(showText);
        return
      }
      let into_infoList: any[] = [];
      needList.forEach(
        (element: {
          in_num: any;
          batch_no: any;
          box_serial_number_start: any;
          box_serial_number_end: any;
          ws_code_id: any;
          ws_code: any;
          ws_code_name: any;
          site: any;
        }) => {
          const {
            in_num,
            batch_no,
            box_serial_number_start,
            box_serial_number_end,
            ws_code_id,
            ws_code,
            ws_code_name,
            site,
          } = element;
          let item: any = {
            in_num,
            batch_no,
            box_serial_number_start,
            box_serial_number_end,
            ws_code_id,
            ws_code,
            ws_code_name,
            site,
          };
          into_infoList.push(item);
        },
      );
      let rest: any = addHandInStorageRef.value?.addFormData;
      let params: any = {
        ...rest,
        into_info: into_infoList,
      };
      let editId = addHandInStorageRef.value?.editId;
      let API = handManualCreate;
      if (editId) {
        params.id = editId;
        API = manualEdit;
      }
      updateDialog(true, "btnLoading");
      try {
        const result = await API(params);
        ElMessage.success(result.msg);
        if (editId) {
          getData();
        } else {
          const resultTwe = await productInSubmitApi({ id: result.data.id });
          ElMessage.success(resultTwe.msg);
          getData();
        }
      } finally {
        updateDialog(false, "btnLoading");
      }
      done();
    },
  });
}

/** 单元格点击编辑 */
function cellEdit(row: ProductInListType) {
  if (row.in_type == 1) {
    showHandAddConfig("编辑手动入库", row.id);
    return;
  }
  listId.value = row.id;
  editVisible.value = true;
}

/** 单元格点击详情 */
function cellDetail(row: ProductInListType) {
  listId.value = row.id;
  in_type.value = row.in_type;
  detailVisible.value = true;
}
/** 单元格点击删除 */
function cellDel(row: ProductInListType) {
  ElMessageBox.confirm(`确认要删除入库单号为：【${row.pro_in_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await productInDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}
/** 单元格点击提审 */
function cellSubmit(id: number | string) {
  ElMessageBox.confirm(`确定要提交审核该入库单吗?`, "提审提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      const result = await productInSubmitApi({ id: id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}
/** 单元格点击审核 */
function cellApprove(row: ProductInListType) {
  ElMessageBox.confirm(`确定要审核该入库单吗?`, "审核提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      const result = await productInApproveApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
}

onActivated(() => {
  getFactoryCodeList();
  getData();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch v-model="formData" :columns="searchColumns" :showNumber="5" ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)" @search="handleSearch"></PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button type="primary" @click="automaticAdd">新增自动入库</el-button>
          <el-button type="primary" @click="handMovementAdd">新增手动入库</el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table ref="prueTableRef" row-key="id" :data="tableData" :columns="dynamicColumns" :size="size" adaptive
            :adaptiveConfig="{ offsetBottom: 120 }" header-cell-class-name="table-row-header"
            :cell-class-name="handleCellClass" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave"
            :pagination="pagination" :paginationSmall="size === 'small' ? true : false" @page-size-change="getData()"
            @page-current-change="getData()" :loading="tableLoading">
            <template #in_type="{ row }">
              <span :style="`color: ${row.in_type == 1 ? '#8080FF' : '#C280FF'}`">
                {{ row.in_type == 1 ? "手动入库" : "自动入库" }}
              </span>
            </template>
            <template #operation="{ row }">
              <el-button type="primary" link @click="cellDetail(row)">详情</el-button>
              <template v-if="row.status !== 3">
                <el-button type="primary" link @click="cellEdit(row)">编辑</el-button>
              </template>
              <template v-if="row.status === 0">
                <!-- 待提审状态时 -->
                <el-button type="primary" link @click="cellSubmit(row.id)">提审</el-button>
              </template>
              <template v-if="row.status === 1">
                <!-- 待审核状态时 -->
                <el-button type="primary" link @click="cellApprove(row)">审核</el-button>
              </template>
              <template v-if="row.status === -2">
                <!-- 待入库时 -->
                <el-button type="danger" link @click="cellDel(row)">删除</el-button>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <detailVue v-model:visible="detailVisible" :listId="listId" :in_type="in_type"></detailVue>
    <editVue v-model:visible="editVisible" :listId="listId" @refresh="getData"></editVue>
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0;
}

:deep(.el-table td.cell-overflow > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
