<script setup lang="ts">
// 采购入库单列表页
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
import { FormInstance } from "element-plus";
import type { Column } from "element-plus";
import { useRouter } from "vue-router";
// 导入API
import {
  approveBuyInApi,
  approveBuyInWhApi,
  delBuyInApi,
  getBuyInListApi,
  recallBuyInApi,
  rejectBuyInApi,
  rejectBuyInWhApi,
  submitBuyInApi,
  voidBuyInApi,
} from "@/api/storage/buy-in/index";
// 导入类型
import { IBuyInItem } from "@/api/storage/buy-in/types";
import { checkAssocType, perms } from "@/utils/auth";
import { isLastPage } from "@/utils/lastPage";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import SpanMsg from "@/components/SpanMsg/index.vue";
import { procureListHooks } from "@/hooks/index";
import { useListHooks } from "@/hooks/list";
import { useAdaptiveConfig } from "@/hooks/table";
// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";
// 引入获取仓库列表的hooks
import { storageListHooks } from "@/hooks";
import printDrawer from "./components/printDrawer/index.vue";
import { useOrderList } from "./utils/hook";

defineOptions({
  name: "StoBuyInList",
});

const { formData } = useListHooks();
const { procureList } = procureListHooks(2);
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns } = useOrderList();
const router = useRouter();

const { departmentList } = deptListHooks();
const { storageList } = storageListHooks();
const state = reactive({
  // formData: {
  //   keyword: "",
  //   dept_id: 0,
  //   time: "",
  //   page: 1,
  //   size: 10,
  //   status: "", //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
  // },
  options: [
    {
      value: 0,
      label: "待提审",
    },
    {
      value: 1,
      label: "待审核",
    },
    // {
    //   value: 2,
    //   label: "待入库",
    // },
    {
      value: 3,
      label: "已完成",
    },
    {
      value: 4,
      label: "已撤回",
    },
    {
      value: 5,
      label: "已驳回",
    },
    {
      value: 6,
      label: "已作废",
    },
    {
      value: 7,
      label: "待仓库确认",
    },
  ],
  tableData: [] as IBuyInItem[],
  tableLoading: false,
  total: 1,
  drawerShow: false,
  drawerInfo: {
    id: 0,
    procure_no: "",
    wh_in_no: "",
    in_time: "",
    in_wh_name: "",
  },
  drawerVisible: false,
});
// const { formData, options, tableData, tableLoading, total, drawerShow, drawerInfo, drawerVisible } =
//   toRefs(state);
const { options, tableData, tableLoading, total, drawerShow, drawerInfo, drawerVisible } =
  toRefs(state);

// const formData = ref({
//   keyword: "",
//   dept_id: undefined as undefined | number,
//   time: "",
//   page: 1,
//   size: 10,
//   in_wh_id: undefined as undefined | number,
//   status: undefined as undefined | number, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
// });
const formRef = ref<FormInstance>();

// 点击表格整行
function handleRowClick(row: IBuyInItem, column: Column, event: Event) {
  let permsRes = perms(["sto:buyin:detail"]);
  // console.log("permsRes", permsRes);
  const noProp = ["procure_no", "wh_in_no"];
  let noPropRes = noProp.includes(column.property);
  // console.log("noPropRes", noPropRes);
  if (noPropRes) return;
  // status和operation插槽, property是undefined
  if (column.property && permsRes) {
    drawerVisible.value = true;
    // console.log("row", row);
    drawerInfo.value = {
      procure_no: row.procure_no,
      wh_in_no: row.wh_in_no,
      id: row.id,
      in_time: row.in_time,
      in_wh_name: row.in_wh_name,
    };
  }
}
// 设置表格整行样式
function getRowClass(row: any) {
  let permsRes = perms(["sto:buyin:detail"]);
  if (permsRes) return "cursor-pointer";

  return "";
}

function handleShowPrint() {
  drawerVisible.value = true;
}

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击查看审批日志
async function showApproveLog(row: IBuyInItem) {
  let { id, status, wh_in_no, in_wh_id } = row;
  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    title: "审批流程",
    showCancel: false,
    top: "20vh",
    contentRenderer: () =>
      h(ApproveFlowGlobal, {
        id,
        orderType: 2,
        whId: in_wh_id,
        status,
        pageType: 4,
      }),
  });
}

const getData = async () => {
  let { time, ...rest } = formData.value;
  let start_time = "";
  let end_time = "";
  // console.log("formData.value", formData.value);
  if (time) {
    start_time = time[0];
    end_time = time[1];
  }
  let data = {
    start_time,
    end_time,
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getBuyInListApi(data);
    tableData.value = result.data.list;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
};

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

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/storage/buy-in/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: IBuyInItem) => {
  router.push({
    path: "/storage/buy-in/add",
    query: {
      editFrom: 1,
      id: row.id,
      procure_no: row.procure_no || undefined,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: IBuyInItem) => {
  router.push({
    path: "/storage/buy-in/detail",
    query: {
      id: row.id,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async (row: IBuyInItem) => {
  console.log("点击提审");
  try {
    const result = await submitBuyInApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: IBuyInItem) => {
  try {
    const result = await recallBuyInApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 单元格点击作废
const handleVoid = (row: IBuyInItem) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.wh_in_no}】采购入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidBuyInApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: IBuyInItem) => {
  ElMessageBox.confirm(`您确定要删除【${row.wh_in_no}】采购入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delBuyInApi({ id: row.id });
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
const cellApprove = async (row: IBuyInItem) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveBuyInApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: IBuyInItem) => {
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
          const result = await rejectBuyInApi(data);
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

const cellwhApprove = (row: IBuyInItem) => {
  console.log("点击仓库确认");

  let date = row.in_time;
  const elDate = h(ElDatePicker, {
    style: {
      marginLeft: "10px",
    },
    modelValue: date,
    type: "date",
    placeholder: "请确认入库时间",
    format: "YYYY-MM-DD",
    valueFormat: "YYYY-MM-DD",
    clearable: false,
    "onUpdate:modelValue": (value: string) => {
      console.log("value", value);
      elDate.component!.props.modelValue = value;
      date = value;
    },
  });
  ElMessageBox({
    title: "请确认入库日期",
    message: h("p", null, [h("span", null, "入库日期"), elDate]),
    showCancelButton: true,
    confirmButtonText: "入库确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    draggable: true,
  }).then(async () => {
    let data = { in_time: date, id: row.id };
    const result = await approveBuyInWhApi(data);
    ElMessage.success(result.msg);
    getData();
  });
};

const cellwhReject = (row: IBuyInItem) => {
  console.log("点击仓库驳回");
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
          const result = await rejectBuyInWhApi(data);
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
</script>
<template>
  <div class="app-container">
    <div class="search-card">
      <el-form :model="formData" ref="formRef" :inline="true">
        <el-form-item label="关键字" prop="keyword" class="w-[246px]">
          <el-input v-model="formData.keyword" placeholder="入库单号/采购单号/制单人"></el-input>
        </el-form-item>
        <el-form-item label="入库仓库" prop="in_wh_id">
          <el-select v-model="formData.in_wh_id" placeholder="请选择入库仓库" clearable filterable>
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.selectStatus"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="dept_id">
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="formData.status"
            placeholder="请选择状态"
            clearable
            filterable
            @change=""
          >
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
          <el-button :icon="Refresh" @click="handleReset(formRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <pure-table-bar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <div class="flex">
            <el-button
              type="success"
              size="default"
              :icon="Plus"
              class="mb-[10px]"
              @click="handleAdd"
              v-hasPerm="['sto:buyin:add']"
            >
              新建采购入库单
            </el-button>
            <!-- <el-button
              size="default"
              type="primary"
              class="mb-[10px]"
              @click="handleShowPrint"
              link
            >
              <template #icon>
                <i-ep-Printer></i-ep-Printer>
              </template>
              打印标签
            </el-button> -->
          </div>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size as any"
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
                  <el-tag v-if="checkAssocType(row.assoc_type, 3)" type="success" effect="plain">
                    <span-msg msg="已审核"></span-msg>
                  </el-tag>
                  <el-tag v-else effect="plain">
                    <span-msg msg="待审核"></span-msg>
                  </el-tag>
                </template>
                <el-tag type="success" v-else-if="row.status == 3">
                  <span-msg msg="已完成"></span-msg>
                </el-tag>
                <el-tag type="info" v-else-if="row.status == 4">
                  <span-msg msg="已撤回"></span-msg>
                </el-tag>
                <el-tag type="warning" v-else-if="row.status == 5">
                  <span-msg msg="已驳回"></span-msg>
                </el-tag>
                <el-tag type="danger" v-else-if="row.status == 6">
                  <span-msg msg="已作废"></span-msg>
                </el-tag>
                <el-tag effect="plain" v-else>
                  <span-msg msg="待入库确认"></span-msg>
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
                v-hasPerm="['sto:buyin:detail']"
              >
                详情
              </el-button>
              <!-- 当前为创建人 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <!-- 待提审,已撤回,已驳回状态时 -->
                <template v-if="row.status == 0 || row.status == 4 || row.status == 5">
                  <el-button
                    size="default"
                    link
                    :icon="Edit"
                    @click="cellEdit(row)"
                    v-hasPerm="['sto:buyin:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['sto:buyin:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="handleVoid(row)"
                    v-hasPerm="['sto:buyin:void']"
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
                    v-hasPerm="['sto:buyin:recall']"
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
                    v-hasPerm="['sto:buyin:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <!-- 当前为审核人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 2)">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 1">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellApprove(row)"
                    v-hasPerm="['sto:buyin:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['sto:buyin:reject']"
                  >
                    驳回
                  </el-button>
                </template>
              </template>
              <!-- 当前为仓库确认人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 5)">
                <template v-if="row.status == 7">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellwhApprove(row)"
                    v-hasPerm="['sto:buyin:whapprove']"
                  >
                    入库确认
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellwhReject(row)"
                    v-hasPerm="['sto:buyin:whreject']"
                  >
                    入库驳回
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </pure-table-bar>
      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="formData.page"
        v-model:limit="formData.size"
        @pagination="handleQuery"
      />
    </div>

    <printDrawer v-model:visible="drawerVisible" v-bind="drawerInfo"></printDrawer>
  </div>
</template>

<style scoped lang="scss"></style>
