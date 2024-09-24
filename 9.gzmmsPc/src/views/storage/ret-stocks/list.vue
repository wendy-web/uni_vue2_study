<script setup lang="ts">
import {
  CircleCheck,
  CircleClose,
  Delete,
  Document,
  Edit,
  Position,
  Refresh,
  RefreshLeft,
} from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import {
  getRetStockApproveApi,
  getRetStockDelApi,
  getRetStockRejectApi,
  getRetStockSubmitApi,
  getRetStockVoidApi,
  getRetStockWhApproveApi,
  getRetStockWhRejectApi,
  getRetStocksListApi,
  getRetStocksRecallApi,
} from "@/api/storage/ret-stocks/index";
import type { RetStocksItemType } from "@/api/storage/ret-stocks/types";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
import FormBtn from "@/components/FormBtn/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";
import { useList } from "./utils/hook";

defineOptions({
  name: "StoRetStocksList",
});
const router = useRouter();

const { departmentList } = deptListHooks();
const { searchColumns, pagination, formData, columns, checkAssocType } = useList();

const plusFormRef = ref();
const formRef = computed(() => {
  return plusFormRef.value.formInstance as FormInstance;
});
const prueTableRef = ref();
const tableData = ref<RetStocksItemType[]>([]);
const tableLoading = ref(false);

function showApproveLog(row: RetStocksItemType) {
  let { id, status, ret_wh_id } = row;
  // if (!status) {
  //   ElMessage.info("暂无审批日志");
  //   return;
  // }
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
        orderType: 4,
        whId: ret_wh_id,
        status,
        pageType: 4,
      }),
  });
}

// 点击搜索
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
//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

async function getData() {
  let { time, ...rest } = formData.value;
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    start_time: isArray(time) ? time[0] : "",
    end_time: isArray(time) ? time[1] : "",
    ...rest,
  };
  const result = await getRetStocksListApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

/** 点击新建 */
function handleAdd() {
  router.push({
    path: "/storage/ret-stocks/add",
    query: {
      editFrom: 1,
    },
  });
}
//   单元格点击详情
function cellDetail(row: RetStocksItemType) {
  console.log(row.id);
  router.push({
    path: "/storage/ret-stocks/detail",
    query: {
      id: row.id,
    },
  });
}
// 单元格点击编辑
function cellEdit(row: RetStocksItemType) {
  router.push({
    path: "/storage/ret-stocks/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
}
//   单元格点击提交审核
async function cellSubmitAudit(row: RetStocksItemType) {
  const result = await getRetStockSubmitApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
}

// 单元格点击撤回
const cellRecall = async (row: RetStocksItemType) => {
  const result = await getRetStocksRecallApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

// 单元格点击作废
const handleVoid = (row: RetStocksItemType) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.wh_inv_ret_no}】退库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await getRetStockVoidApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: any) => {
  ElMessageBox.confirm(`您确定要删除【${row.wh_inv_ret_no}】退库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await getRetStockDelApi({ id: row.id });
      ElMessage.success(result.msg);
      getData();
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击通过
const cellApprove = async (row: any) => {
  const result = await getRetStockApproveApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};
// const cellApprove = async (row: any) => {
//   console.log("点击通过", row.id);
//   ElMessageBox.prompt("请输入审批通过内容", "审批通过内容：", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     closeOnClickModal: false,
//     // inputPattern: /[\s\S]/,
//     customClass: "",
//     inputValue: "同意",
//     inputType: "textarea",
//     inputValidator: (val) => {
//       if (val.trim().length < 1) {
//         return false;
//       } else {
//         return true;
//       }
//     },
//     inputErrorMessage: "请输入通过内容",
//   })
//     .then(async ({ value }) => {
//       value = value.trim();
//       if (value) {
//         let data = {
//           approve_note: value,
//           id: row.id,
//         };
//         try {
//           const result = await getRetStockApproveApi(data);
//           ElMessage.success(result.msg);
//           getData();
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// 单元格点击驳回
const cellReject = (row: any) => {
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
          const result = await getRetStockRejectApi(data);
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

const cellwhApprove = async (row: any) => {
  const result = await getRetStockWhApproveApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

const cellwhReject = async (row: any) => {
  const result = await getRetStockWhRejectApi({ id: row.id });
  ElMessage.success(result.msg);
  getData();
};

onActivated(() => {
  getData();
  prueTableRef.value?.setAdaptive();
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <PlusSearch v-model="formData" :columns="searchColumns" :show-number="10" ref="plusFormRef">
        <template #plus-field-dept_id>
          <dept-select :department-list="departmentList" v-model="formData.dept_id"></dept-select>
        </template>
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(plusFormRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
    </div>
    <div class="app-card">
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button
            type="success"
            class="mb-[10px]"
            @click="handleAdd"
            v-hasPerm="['sto:retstocks:add']"
          >
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建退库物资清单
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            border
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="size"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            @page-size-change="getData()"
            @page-current-change="getData()"
          >
            <template #status="{ row }">
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
                <el-tag v-else-if="row.status == 7">
                  <span-msg msg="待确认"></span-msg>
                </el-tag>
              </div>
            </template>
            <template #opreation="{ row }">
              <el-button
                size="default"
                type="primary"
                link
                :icon="Document"
                @click="cellDetail(row)"
                v-hasPerm="['sto:retstocks:detail']"
              >
                详情
              </el-button>
              <!-- 当前为创建人 -->
              <template v-if="checkAssocType(row.assoc_type, 1)">
                <!-- 待提审,已撤回,已驳回状态时 -->
                <template v-if="row.status == 0 || row.status == 4 || row.status == 5">
                  <el-button
                    link
                    @click="cellEdit(row)"
                    :icon="Edit"
                    v-hasPerm="['sto:retstocks:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['sto:retstocks:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    :icon="Delete"
                    link
                    @click="handleVoid(row)"
                    v-hasPerm="['sto:retstocks:void']"
                  >
                    作废
                  </el-button>
                </template>
                <!-- 待审核和待领料状态时 -->
                <template v-else-if="row.status == 1 || row.status == 8">
                  <el-button
                    type="info"
                    link
                    :icon="RefreshLeft"
                    @click="cellRecall(row)"
                    v-hasPerm="['sto:retstocks:recall']"
                  >
                    撤回
                  </el-button>
                </template>
                <!-- 已作废状态时 -->
                <template v-else-if="row.status == 6">
                  <el-button
                    type="danger"
                    link
                    :icon="Delete"
                    @click="cellDel(row)"
                    v-hasPerm="['sto:retstocks:del']"
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
                    link
                    :icon="CircleCheck"
                    @click="cellApprove(row)"
                    v-hasPerm="['sto:retstocks:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['sto:retstocks:reject']"
                  >
                    驳回
                  </el-button>
                </template>
              </template>
              <!-- 当前为仓库确认人的时候 -->
              <template v-if="checkAssocType(row.assoc_type, 5)">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 7">
                  <el-button
                    type="success"
                    link
                    :icon="CircleCheck"
                    @click="cellwhApprove(row)"
                    v-hasPerm="['sto:retstocks:whapprove']"
                  >
                    仓库确认
                  </el-button>
                  <el-button
                    type="warning"
                    link
                    :icon="CircleClose"
                    @click="cellwhReject(row)"
                    v-hasPerm="['sto:retstocks:whreject']"
                  >
                    仓库驳回
                  </el-button>
                </template>
              </template>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
