<script setup lang="ts">
import { FullScreen } from "@element-plus/icons-vue";
import type { FormInstance, TableInstance } from "element-plus";
import { getCheckListApi, removeCheckApi, revokeCheckApi } from "@/api/product-stock/product-check";
import { useList } from "./utils/hook";

/* 成品库存质量检查页面 */
defineOptions({
  name: "ProductStockProductCheck",
});

const { columns, searchColumns, pagination, formData } = useList(handleSearch);

/** plusform搜索表单的ref */
const plusFormRef = ref();

const tableData = ref<any[]>([]);
const tableLoading = ref(false);
const showInput = ref(false);

const ids = ref<number[]>([]);
const prueTableRef = ref();
const selectTable = ref<any[]>([]);
const pro_ph_no = ref<string>("");

const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
function handleSearch() {
  getData();
}

// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  pro_ph_no.value = "";
  ids.value = [];
  tableRef.value.clearSelection();
  formEl.resetFields();
  getData();
};
const removeCheck = async (list: Array<string | number>) => {
  const { msg } = await removeCheckApi({ ids: list });
  ids.value = [];
  tableRef.value.clearSelection();
  ElMessage.success(msg);
  handleSearch();
};
const revokeCheck = async (list: Array<string | number>) => {
  const { msg } = await revokeCheckApi({ ids: list });
  ElMessage.success(msg);
  handleSearch();
};
// 批量解除限制
const handleCommand = () => {
  if (ids.value.length === 0) {
    return ElMessage.warning("请您至少勾选一条数据");
  }
  removeCheck(ids.value);
};
//单个解除限制
const unfreezeTap = (row: any) => {
  removeCheck([row.id]);
};
//撤回
const withdrawTap = (row: any) => {
  revokeCheck([row.id]);
};
// 勾选触发事件
function changeSelect(selection: any[]) {
  selectTable.value = selection;
  ids.value = selection.map((item) => {
    return item.id;
  });
  console.log("selectData.value", ids.value);
}
async function getData() {
  tableLoading.value = true;
  const { time, stock_type, goods_info, pro_no, delivery_no } = formData.value;
  let params = {
    pro_ph_no: pro_ph_no.value,
    pro_date_start: time ? time[0] : undefined,
    pro_date_end: time ? time[1] : undefined,
    stock_type,
    goods_info,
    pro_no,
    delivery_no,
  };

  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...params,
  };
  const result = await getCheckListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.data;
  pagination.total = result.data.total;
}

onActivated(() => {
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
        ref="plusFormRef"
        @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
        @search="handleSearch"
      >
        <template #plus-field-pro_ph_no>
          <!-- 生产批号 -->
          <div class="diyBox">
            <el-input
              v-model="pro_ph_no"
              style="width: 100%"
              placeholder="请输入生产批号,多单号请用逗号、空格或者回车隔开"
              :suffix-icon="FullScreen"
            />
            <div class="clickBox" @click="showInput = true"></div>
          </div>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <!-- <el-dropdown trigger="click" @command="handleCommand" v-hasPerm="['inout:record:export']"> -->
          <el-button type="primary" @click="handleCommand">解除限制</el-button>
          <!-- </el-dropdown> -->
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
            header-cell-class-name="table-row-header"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
            @selection-change="changeSelect"
            :loading="tableLoading"
          >
            <template #operation="{ row, $index }">
              <el-button
                v-if="row.stock_type == 0"
                type="primary"
                link
                size="default"
                @click="unfreezeTap(row)"
              >
                解除限制
              </el-button>
              <el-button v-else type="primary" link size="default" @click="withdrawTap(row)">
                撤回
              </el-button>
            </template>
            <template #stock_type="{ row }">
              <span :style="`color: ${row.stock_type == 0 ? '#F59A23' : '#409eff'}`">
                {{ row.stock_type == 0 ? "质量检查" : "非限制使用" }}
              </span>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <el-dialog v-model="showInput" title="输入单号" width="500">
      <el-input
        v-model="pro_ph_no"
        style="width: 440px"
        :rows="7"
        type="textarea"
        placeholder="请输入批次信息，多单号请用逗号、空格或者回车隔开"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="pro_ph_no = ''">清空</el-button>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.diyBox {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.clickBox {
  width: 34px;
  height: 30px;
  right: 0px;
  position: absolute;
}
</style>
