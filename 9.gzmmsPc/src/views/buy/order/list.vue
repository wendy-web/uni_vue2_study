<script setup lang="ts">
import {
  CircleCheck,
  CircleClose,
  Delete,
  Document,
  Edit,
  Plus,
  Position,
  Refresh,
  RefreshLeft,
  Search,
} from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import type { Column } from "element-plus";
import { useRouter } from "vue-router";
// 引入获取采购单列表API,作废API,删除API
import {
  approveOrderApi,
  delOrderApi,
  getOrderListApi,
  recallOrderApi,
  rejectOrderApi,
  submitOrderApi,
  voidOrderApi,
} from "@/api/buy/order/index";
// 引入采购单列表类型
import { IBuyOrderItem } from "@/api/buy/order/types";
import { perms } from "@/utils/auth";
import { isLastPage } from "@/utils/lastPage";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import SpanMsg from "@/components/SpanMsg/index.vue";
import { useListHooks } from "@/hooks/list";
import { useAdaptiveConfig } from "@/hooks/table";
// 引入获取部门列表的hooks
import { approveLogHooks, deptListHooks, sendEmailHooks } from "@/hooks";
// import drawerDetail from "./components/drawerDetail/index.vue";
import printDrawer from "./components/printDrawer/index.vue";
import { useOrderList } from "./utils/hook";
// import type { IDrawerInfo } from "./components/drawerDetail/type";
import type { PrintInfo } from "./utils/types";

defineOptions({
  name: "BuyOrderList",
});

const router = useRouter();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { departmentList } = deptListHooks();
const { lookApproveLog } = approveLogHooks();
const { sendMail } = sendEmailHooks();
const state = reactive({
  formData: {
    keyword: "",
    dept_id: undefined as FormNumType,
    time: "",
    page: 1,
    size: 10,
    status: undefined as FormNumType, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
    demand_dept_ids: [] as number[],
    demand_date: "",
    class_list: [] as string[],
    class_ids: [] as number[],
  },

  tableData: [] as IBuyOrderItem[],
  tableLoading: false,
  total: 1,
  drawerShow: false, // 右侧抽屉控制开关
  // drawerInfo: {} as IDrawerInfo,
  drawerInfo: { procure_no: "", id: 0 } as PrintInfo,
});
const { formData, tableData, tableLoading, total, drawerShow, drawerInfo } = toRefs(state);
// const { tableData, tableLoading, total, drawerShow, drawerInfo } = toRefs(state);

const { columns, searchColumns } = useOrderList({ formData });

useListHooks(formData);

const formRef = ref();

const noProp = ["procure_no"];

const getData = async () => {
  let { time, demand_date, class_ids, ...rest } = formData.value;
  let start_time = "";
  let end_time = "";
  let demand_date_start = "";
  let demand_date_end = "";
  // console.log("formData.value", formData.value);
  if (time) {
    start_time = time[0];
    end_time = time[1];
  }
  if (demand_date) {
    demand_date_start = demand_date[0];
    demand_date_end = demand_date[1];
  }
  let data = {
    start_time,
    end_time,
    demand_date_start,
    demand_date_end,
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getOrderListApi(data);
    tableData.value = result.data.list;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
};

// 点击表格整行
function handleRowClick(row: IBuyOrderItem, column: Column, event: Event) {
  // console.log("column",column)
  let permsRes = perms(["buy:order:detail"]);
  console.log("permsRes", permsRes);

  let noPropRes = noProp.includes(column.property);
  if (noPropRes) return;
  // status和operation插槽, property是undefined
  if (column.property && permsRes) {
    drawerShow.value = true;
    console.log("row", row);
    // drawerInfo.value = {
    //   procure_no: row.procure_no,
    //   id: row.id,
    //   ct_name: row.ct_name,
    //   create_time: row.create_time,
    //   status: row.status,
    // };
    drawerInfo.value = {
      procure_no: row.procure_no,
      id: row.id,
    };
  }
}
// 设置表格整行样式
function getRowClass(row: any) {
  let permsRes = perms(["buy:order:detail"]);
  if (permsRes) return "cursor-pointer";

  return "";
}

// 点击查看审批日志
async function showApproveLog(row: IBuyOrderItem) {
  let { status, id, procure_no } = row;
  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  let data = {
    document_type: 8,
    document_id: id,
    order_no: procure_no,
  };
  lookApproveLog(data);
}

// 点击查询
const handleSearch = () => {
  formData.value.page = 1;
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formData.value.status = undefined;
  getData();
};

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/buy/order/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: IBuyOrderItem) => {
  router.push({
    path: "/buy/order/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: IBuyOrderItem) => {
  console.log(row.id, row.assoc_type);
  router.push({
    path: "/buy/order/detail",
    query: {
      assoc_type: row.assoc_type,
      id: row.id,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async (row: IBuyOrderItem) => {
  console.log("点击提审");
  try {
    const result = await submitOrderApi({ id: row.id });
    ElMessage.success(result.msg);
    if (result.data.status === 2) {
      sendMail(row.id);
    }
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: IBuyOrderItem) => {
  try {
    const result = await recallOrderApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = (row: IBuyOrderItem) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.procure_no}】采购单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidOrderApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击删除
const cellDel = (row: IBuyOrderItem) => {
  ElMessageBox.confirm(`您确定要删除【${row.procure_no}】采购单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delOrderApi({ id: row.id });
      ElMessage.success(result.msg);
      let lastPage = isLastPage({
        total: total.value,
        page: formData.value.page,
        size: formData.value.size,
      });
      if (lastPage) {
        formData.value.page--;
      }
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击通过
const cellApprove = async (row: IBuyOrderItem) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveOrderApi({ id: row.id });
    ElMessage.success(result.msg);
    if (result.data.status === 2) {
      sendMail(row.id);
    }
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: IBuyOrderItem) => {
  console.log("点击驳回,输入驳回原因", row.id);
  ElMessageBox.prompt("请输入驳回原因", "驳回原因：", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    // inputPattern: /[\s\S]/,
    customClass: "",
    inputType: "textarea",
    inputValidator: (val) => {
      if (val.trim().length < 1) {
        return false;
      } else {
        return true;
      }
    },
    inputErrorMessage: "请输入驳回原因",
  })
    .then(async ({ value }) => {
      value = value.trim();
      if (value) {
        let data = {
          reason: value,
          id: row.id,
        };
        try {
          const result = await rejectOrderApi(data);
          ElMessage.success(result.msg);
          getData();
        } catch (error) {
          console.log(error);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onActivated(() => {
  getData();
});
onDeactivated(() => {});
</script>

<template>
  <div class="app-container">
    <div class="search-card !pr-[20px] !pb-4">
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 6 }"
        ref="formRef"
      >
        <template #plus-field-demand_dept_ids>
          <dept-select
            :department-list="departmentList"
            v-model="formData.demand_dept_ids"
            :multiple="true"
          ></dept-select>
        </template>
        <template #plus-field-dept_id>
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </template>

        <template #footer>
          <!-- <template #footer> -->
          <div style="display: flex">
            <el-button type="primary" :icon="Search" @click="handleSearch" v-deBounce>
              搜索
            </el-button>
            <el-button :icon="Refresh" @click="handleReset(formRef?.plusFormInstance.formInstance)">
              重置
            </el-button>
          </div>
        </template>
      </PlusSearch>
      <!-- <el-form :model="formData" ref="form" :inline="true">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formData.keyword" placeholder="制单人姓名/采购单号"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept_id">
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" clearable filterable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker
            v-model="formData.time"
            type="daterange"
            placeholder="请选择时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search" v-deBounce>查询</el-button>
          <el-button :icon="Refresh" @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button
            type="success"
            size="default"
            :icon="Plus"
            class="mb-[10px]"
            @click="handleAdd"
            v-hasPerm="['buy:order:add']"
          >
            新建采购单
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size as any"
            stripe
            border
            header-cell-class-name="table-row-header"
            @row-click="handleRowClick"
            :row-class-name="getRowClass"
            adaptive
            :adaptiveConfig="adaptiveConfig"
            :max-height="maxHeight"
          >
            <template #status="{ row, $index }">
              <div @click="showApproveLog(row)" class="hover:cursor-pointer">
                <el-tag v-if="row.status == 0">待提审</el-tag>
                <template v-else-if="row.status == 1">
                  <el-tag v-if="row.assoc_type == 3" type="success" effect="plain">
                    <span-msg msg="已审核"></span-msg>
                  </el-tag>
                  <el-tag v-else effect="plain">
                    <span-msg msg="待审核"></span-msg>
                  </el-tag>
                </template>
                <el-tag v-else-if="row.status == 2" effect="dark">
                  <span-msg msg="待入库"></span-msg>
                </el-tag>
                <el-tag type="success" v-else-if="row.status == 3">
                  <span-msg msg="已完成"></span-msg>
                </el-tag>
                <el-tag type="info" v-else-if="row.status == 4">
                  <span-msg msg="已撤回"></span-msg>
                </el-tag>
                <el-tag type="warning" v-else-if="row.status == 5">
                  <span-msg msg="已驳回"></span-msg>
                </el-tag>
                <el-tag type="danger" v-else>
                  <span-msg msg="已作废"></span-msg>
                </el-tag>
              </div>
            </template>
            <template #operation="{ row, $index }">
              <el-button
                size="default"
                type="primary"
                link
                :icon="Document"
                @click="cellDetail(row)"
                v-hasPerm="['buy:order:detail']"
              >
                详情
              </el-button>
              <!-- 当前为创建人 -->
              <template v-if="row.assoc_type == 1">
                <!-- 待提审,已撤回,已驳回状态时 -->
                <template v-if="row.status == 0 || row.status == 4 || row.status == 5">
                  <el-button
                    size="default"
                    link
                    :icon="Edit"
                    @click="cellEdit(row)"
                    v-hasPerm="['buy:order:edit']"
                    class="ml-0"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['buy:order:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="handleVoid(row)"
                    v-hasPerm="['buy:order:void']"
                  >
                    作废
                  </el-button>
                </template>
                <!-- 待审核状态时 -->
                <template v-else-if="row.status == 1">
                  <el-button
                    type="info"
                    size="default"
                    link
                    :icon="RefreshLeft"
                    @click="cellRecall(row)"
                    v-hasPerm="['buy:order:recall']"
                  >
                    撤回
                  </el-button>
                </template>
                <!-- 已作废状态时 -->
                <template v-else-if="row.status == 6">
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="cellDel(row)"
                    v-hasPerm="['buy:order:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <!-- 当前为审核人的时候 -->
              <template v-if="row.assoc_type == 2">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 1">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellApprove(row)"
                    v-hasPerm="['buy:order:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['buy:order:reject']"
                  >
                    驳回
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="formData.page"
        v-model:limit="formData.size"
        @pagination="handleQuery"
      />
    </div>

    <!-- <drawerDetail v-model:visible="drawerShow" :info="drawerInfo"></drawerDetail> -->
    <printDrawer v-model:visible="drawerShow" v-bind="drawerInfo"></printDrawer>
  </div>
</template>

<style scoped lang="scss">
/* 修改子组件的 样式 */
:deep(.el-drawer__header .el-drawer__title) {
  font-weight: 700;
  color: var(--el-color-black);
}
</style>
