<script setup lang="ts">
// 其他入库单列表页
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
import type { Column, FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import {
  approveOtherInApi,
  approveOtherInWhApi,
  delOtherInApi,
  getOtherInListApi,
  recallOtherInApi,
  rejcetOtherInWhApi,
  rejectOtherInApi,
  submitOtherInApi,
  voidOtherInApi,
} from "@/api/storage/other-in";
import { IOtherInItem } from "@/api/storage/other-in/types";
import { checkAssocType, perms } from "@/utils/auth";
import { isLastPage } from "@/utils/lastPage";
// 引入审批流程自定义组件
// import ApproveFlow from "./components/ApproveFlow.vue";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useListHooks } from "@/hooks/list";
import { useAdaptiveConfig } from "@/hooks/table";
import { deptListHooks } from "@/hooks";
// 引入获取仓库列表的hooks
import { storageListHooks } from "@/hooks";
import printDrawer from "./components/printDrawer/index.vue";
import { useOtherInList } from "./utils/hooks";

defineOptions({
  name: "StoOtherInList",
});

const { formData } = useListHooks();
const router = useRouter();
const { departmentList } = deptListHooks();
const { options, tableLoading, columns } = useOtherInList();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { storageList } = storageListHooks();

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
/** 表格数据 */
const tableData = ref<IOtherInItem[]>([]);
/** 表格总数 */
const total = ref(1);
const approveFlowVisible = ref(false);
/** 传递给流程组件的数据 */
const approveFlowInfo = ref({
  id: 0,
  type: 4,
  status: 0,
  whId: 0,
});

const drawerInfo = ref({
  id: 0,
  procure_no: "",
  wh_in_no: "",
  in_time: "",
  in_wh_name: "",
});
const drawerVisible = ref(false);

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
    const result = await getOtherInListApi(data);
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

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击查看审批日志
async function showApproveLog(row: IOtherInItem) {
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
        orderType: 3,
        whId: in_wh_id,
        status,
        pageType: 4,
      }),
  });

  // approveFlowInfo.value = {
  //   id,
  //   type: 4,
  //   status,
  //   whId: in_wh_id,
  // };

  // approveFlowVisible.value = true;

  // let data = {
  //   document_type: 1,
  //   document_id: id,
  //   order_no: wh_in_no,
  // };
  // lookApproveLog(data);
}

/** 点击新建 */
const handleAdd = () => {
  router.push({
    path: "/storage/other-in/add",
    query: {
      editFrom: 1,
    },
  });
};
/** 单元格点击详情 */
const cellDetail = (row: IOtherInItem) => {
  router.push({
    path: "/storage/other-in/detail",
    query: {
      id: row.id,
    },
  });
};

/** 单元格点击编辑 */
const cellEdit = (row: IOtherInItem) => {
  router.push({
    path: "/storage/other-in/add",
    query: {
      editFrom: 1,
      id: row.id,
      procure_no: row.procure_no || undefined,
    },
  });
};

/** 单元格点击提审 */
const cellSubmitAudit = async (row: IOtherInItem) => {
  const result = await submitOtherInApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

/** 单元格点击作废 */
const cellVoid = async (row: IOtherInItem) => {
  ElMessageBox.confirm(`您确定要作废【${row.wh_in_no}】其他入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      let result = await voidOtherInApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

/** 单元格点击撤回 */
const cellRecall = async (row: IOtherInItem) => {
  const result = await recallOtherInApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

/** 单元格点击删除 */
const cellDel = (row: IOtherInItem) => {
  ElMessageBox.confirm(`您确定要删除【${row.wh_in_no}】其他入库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delOtherInApi({ id: row.id });
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

/** 单元格点击审核通过 */
const cellApprove = async (row: IOtherInItem) => {
  const result = await approveOtherInApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

/** 单元格点击审核驳回 */
const cellReject = async (row: IOtherInItem) => {
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
  }).then(async ({ value }) => {
    value = value.trim();
    if (value) {
      let data = {
        reason: value,
        id: row.id,
      };
      try {
        const result = await rejectOtherInApi(data);
        ElMessage.success(result.msg);
        getData();
      } catch (error) {
        console.log(error);
      }
    }
  });
};

/** 单元格点击仓库通过 */
const cellwhApprove = async (row: IOtherInItem) => {
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
    const result = await approveOtherInWhApi(data);
    ElMessage.success(result.msg);
    getData();
  });
};

/** 单元格点击仓库驳回 */
const cellwhReject = async (row: IOtherInItem) => {
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
  }).then(async ({ value }) => {
    value = value.trim();
    if (value) {
      let data = {
        reason: value,
        id: row.id,
      };
      try {
        const result = await rejcetOtherInWhApi(data);
        ElMessage.success(result.msg);
        getData();
      } catch (error) {
        console.log(error);
      }
    }
  });
};

// 点击表格整行
function handleRowClick(row: IOtherInItem, column: Column, event: Event) {
  let permsRes = perms(["sto:otherin:detail"]);
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
  let permsRes = perms(["sto:otherin:detail"]);
  if (permsRes) return "cursor-pointer";
  return "";
}

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
              v-hasPerm="['sto:otherin:add']"
            >
              新建其他入库单
            </el-button>
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
            @row-click="handleRowClick"
            :row-class-name="getRowClass"
            :size="size as any"
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
                v-hasPerm="['sto:otherin:detail']"
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
                    v-hasPerm="['sto:otherin:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['sto:otherin:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="cellVoid(row)"
                    v-hasPerm="['sto:otherin:void']"
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
                    v-hasPerm="['sto:otherin:recall']"
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
                    v-hasPerm="['sto:otherin:del']"
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
                    v-hasPerm="['sto:otherin:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['sto:otherin:reject']"
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
                    v-hasPerm="['sto:otherin:whapprove']"
                  >
                    入库确认
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellwhReject(row)"
                    v-hasPerm="['sto:otherin:whreject']"
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
<style lang="scss" scoped></style>
./utils/hooks
