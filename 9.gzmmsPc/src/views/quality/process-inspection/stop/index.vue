<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="6"
        :colProps="{ xs: 24, sm: 12, md: 6, lg: 6, xl: 6 }"
        ref="plusFormRef"
        @reset="handleReset"
        @search="getData"
      ></PlusSearch>
    </div>

    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="getData">
        <template #buttons="scope">
          <el-button type="primary" @click="handleAdd" :icon="Plus" v-hasPerm="['pi:stop:add']">
            新建
          </el-button>
          <!-- <el-button type="primary" @click="">生成报告</el-button> -->
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
          >
            <template #operation="{ row }">
              <el-button type="info" link @click="goInfo(row)" v-hasPerm="['pi:stop:detail']">
                详情
              </el-button>
              <template v-if="[CHECKRET.PARTCHECK, CHECKRET.UNCHECK].includes(row.check_ret)">
                <el-button
                  type="primary"
                  link
                  @click="goCheck(row)"
                  v-hasPerm="['pi:stop:execute']"
                >
                  执行检测
                </el-button>
              </template>
              <template v-if="[CHECKRET.UNCHECK].includes(row.check_ret)">
                <el-button
                  type="danger"
                  link
                  @click="handleDelete(row)"
                  v-hasPerm="['pi:start:delfile']"
                >
                  删除
                </el-button>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
    <Create ref="createRef" @refresh="getData" />
    <Tools ref="ToolsRef" @refresh="getData" />
  </div>
</template>
<script setup lang="tsx" name="ProcessInspectionStop">
import { Plus } from "@element-plus/icons-vue";
import { ref } from "vue";
import { del, getList } from "@/api/quality/process-inspection/stop/index";
import { CHECKRET, List } from "@/api/quality/process-inspection/stop/types";
import Tools from "./components/Tools.vue";
import Create from "./components/create.vue";

const plusFormRef = ref();
const formData = ref({
  order_no: "",
  line_id: "",
  check_ret: "",
  check_date_start: "",
  check_date_end: "",
});

const searchColumns: PlusColumnList = [
  {
    label: "车间",
    prop: "order_no",
    labelWidth: 50,
    fieldProps: {
      placeholder: "请输入关键词",
    },
  },
  {
    label: "线别",
    prop: "line_id",
    labelWidth: 50,
    fieldProps: {
      placeholder: "请输入关键词",
    },
  },
  {
    label: "检验日期",
    prop: "check_date_arr",
    valueType: "date-picker",
    fieldProps: {
      placeholder: "请选择日期",
      type: "daterange",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD",
    },
  },
];

const handleReset = () => {
  plusFormRef.value.resetFields();
};

const tableData = ref<List[]>([]);
const tableLoading = ref(false);
/** 表格分页配置 */
const pagination = reactive({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true,
  pageSizes: [10, 20, 40, 50],
});
const columns: TableColumnList = [
  {
    label: "单据编号",
    prop: "order_no",
    align: "center",
    cellRenderer: ({ row }) => (
      <el-button
        type="primary"
        link
        onClick={() => {
          goInfo(row);
        }}
      >
        {row.order_no}
      </el-button>
    ),
  },
  {
    label: "车间",
    prop: "workshop_name",
    align: "center",
  },
  {
    label: "线别",
    prop: "line_name",
    align: "center",
  },
  {
    label: "CIP项目",
    prop: "pro_name",
    align: "center",
  },
  {
    label: "检测日期",
    prop: "check_date",
    align: "center",
  },
  {
    label: "检测状态",
    prop: "check_ret",
    align: "center",
    cellRenderer: ({ row }) => {
      if (!row.check_ret) row.check_ret = 0;
      return ["未检测", "已检测", "部分检测"][row.check_ret];
    },
  },
  {
    label: "制单人",
    prop: "ct_name",
    align: "center",
  },
  {
    label: "创建时间",
    prop: "create_time",
    minWidth: 180,
    align: "center",
  },
  {
    label: "备注",
    prop: "remark",
    align: "center",
  },
  {
    label: "操作",
    slot: "operation",
    align: "center",
    minWidth: 160,
    fixed: "right",
  },
];

const getData = async () => {
  let params = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  tableLoading.value = true;
  const { data } = await getList(params);
  tableData.value = data.list;
  pagination.total = data.total;
  tableLoading.value = false;
};
/**自动调用一次 */
getData();

const createRef = ref();
const handleAdd = () => {
  createRef.value.show();
};

const handleDelete = (row: List) => {
  ElMessageBox.confirm(`确认要删除单据编号为：【${row.order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    let result = await del(row.id);
    ElMessage.success(result.msg);
    getData();
  });
};

const ToolsRef = ref();
const goCheck = (row: List) => {
  ToolsRef.value.show(row.id, 1);
};
const goInfo = (row: List) => {
  ToolsRef.value.show(row.id, 0);
};
</script>

<style lang="scss" scoped></style>
