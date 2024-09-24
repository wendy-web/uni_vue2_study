<!-- 领料出库单列表页 -->
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
import type { FormInstance, TableInstance } from "element-plus";
import { hiprint } from "vue-plugin-hiprint";
import { useRouter } from "vue-router";
// 导入API
import {
  approveGetSupApi,
  approveGetSupWhApi,
  delGetSupApi,
  getGetSupListApi,
  recallGetSupApi,
  rejectGetSupApi,
  rejectGetSupWhApi,
  submitGetSupApi,
  voidGetSupApi,
} from "@/api/storage/get-supplier";
// 导入类型
import type { IGetSupItem } from "@/api/storage/get-supplier/types";
import { isLastPage } from "@/utils/lastPage";
import { formartDate } from "@/utils/validate";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useAdaptiveConfig } from "@/hooks/table";
// 引入获取部门列表的hooks
import { approveLogHooks, deptListHooks, userListHooks } from "@/hooks";
// 引入流程组件
import assignFlow from "./components/assignFlow.vue";
// 引入指定领取人组件
import assignReceiver from "./components/assignReceiver.vue";
import { useOrderList } from "./utils/hook";
import moban from "./utils/moban.json";

defineOptions({
  name: "StoGetSupList",
});

const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns, checkAssocType } = useOrderList();
const router = useRouter();

const { departmentList } = deptListHooks();
const { lookApproveLog } = approveLogHooks();
const { userList } = userListHooks();
const state = reactive({
  formData: {
    keyword: "",
    dept_id: 0,
    time: "",
    page: 1,
    size: 10,
    status: undefined, //0待提审,1待审核,3已完成,4已撤回,5已驳回,6已作废,7已审批(个人),8待领料,9已确认(个人)
  },
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
      label: "已审核",
    },
    {
      value: 8,
      label: "待领料",
    },
    {
      value: 10,
      label: "待确认",
    },
  ],
  tableData: [] as IGetSupItem[],
  tableLoading: false,
  total: 1,
  assignFlowVisible: false,
});
const { formData, options, tableData, tableLoading, total, assignFlowVisible } = toRefs(state);
const form = ref<FormInstance>();
// 指定领取人弹窗开关
const assignReceiverVisible = ref(false);

/** 传递给流程组件的数据 */
const assignFlowInfo = ref({
  id: 0,
  type: 4,
  status: 0,
  is_force_receive: 0,
});

// 指定领取人弹窗信息
const assignInfo = ref({
  wh_rec_no: "", //单号
  assign_name: [] as number[],
  // receive_status: 0,
  is_part_issue: 0,
  status: 0,
  order_id: 0,
  ct_uid: 0,
});

const selectCodeData = ref<IGetSupItem[]>([]);
const prueTableRef = ref();
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

const handlePrint = () => {
  let len = selectCodeData.value.length;
  if (len === 0) {
    ElMessage.warning("请选择要打印的数据");
    return;
  } else if (len > 10) {
    ElMessage.warning("一次只能打印10条数据");
    return;
  }

  let list = selectCodeData.value.map((item) => {
    return {
      table_title: "领料出库单",
      barcode: item.wh_rec_no,
      table_no: "领料出库单号:",
      table_username: `制单人:${item.ct_name}`,
      out_time: `出库日期:${formartDate(item.out_time)}`,
      rec_type_name: `领料类型:${item.rec_type_name}`,
      rp_uname: `领料申请人:${item.rp_names}`,
      ar_names: `指定领取人:${item.ar_names}`,
      order_note: `单据备注:${item.note ?? ""}`,
      table: item.details,
    };
  });

  let printData = list;
  let hiprintTemplate = new hiprint.PrintTemplate({ template: moban });
  // 打印
  hiprintTemplate.print(
    printData,
    {},
    {
      callback: () => {
        console.log("浏览器打印窗口已打开");
        let iframe_el = document.querySelector("#hiwprint_iframe") as HTMLIFrameElement;
        if (iframe_el && iframe_el.contentWindow) {
          iframe_el.contentWindow.onafterprint = function () {
            console.log("打印窗口关闭了");
          };
        }
      },
    },
  );
};
// 勾选触发事件
function changeSelect(selection: IGetSupItem[]) {
  selectCodeData.value = selection;
}

// 打开指定领取人弹窗
const openAssignReceiver = (row: IGetSupItem) => {
  assignInfo.value = {
    wh_rec_no: row.wh_rec_no,
    // assign_name: row.
    assign_name: row.ar_uid ? row.ar_uid.map((item) => Number(item)) : [],
    status: row.status,
    // receive_status: row.receiver_confirm_status,
    is_part_issue: row.is_part_issue,
    order_id: row.id,
    ct_uid: row.ct_uid,
  };
  console.log(" assignInfo.value", assignInfo.value);
  assignReceiverVisible.value = true;
};

// 点击查看审批日志
async function showApproveLog(row: IGetSupItem) {
  let { id, status, wh_rec_no, is_force_receive } = row;
  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  assignFlowInfo.value = {
    id,
    type: 4,
    status,
    is_force_receive,
  };
  assignFlowVisible.value = true;
  // let data = {
  //   document_type: 3,
  //   document_id: id,
  //   order_no: wh_rec_no,
  // };
  // lookApproveLog(data);
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
    const result = await getGetSupListApi(data);
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
  tableRef.value.clearSelection();
  getData();
};

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/storage/get-supplier/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/storage/get-supplier/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: any) => {
  console.log(row.id);
  router.push({
    path: "/storage/get-supplier/detail",
    query: {
      // assoc_type: row.assoc_type,
      id: row.id,
      is_ct_user: row.is_ct_user,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async (row: any) => {
  console.log("点击提审");
  try {
    const result = await submitGetSupApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: any) => {
  try {
    const result = await recallGetSupApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 单元格点击作废
const handleVoid = (row: any) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.wh_rec_no}】领料出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidGetSupApi({ id: row.id });
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
  ElMessageBox.confirm(`您确定要删除【${row.wh_rec_no}】领料出库单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delGetSupApi({ id: row.id });
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
const cellApprove = async (row: any) => {
  console.log("点击通过", row.id);
  // try {
  //   const result = await approveGetSupApi({ id: row.id });
  //   ElMessage.success(result.msg);
  //   getData();
  // } catch (error) {}
  ElMessageBox.prompt("请输入审批通过内容", "审批通过内容：", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    // inputPattern: /[\s\S]/,
    customClass: "",
    inputValue: "同意",
    inputType: "textarea",
    inputValidator: (val) => {
      if (val.trim().length < 1) {
        return false;
      } else {
        return true;
      }
    },
    inputErrorMessage: "请输入通过内容",
  })
    .then(async ({ value }) => {
      value = value.trim();
      if (value) {
        let data = {
          approve_note: value,
          id: row.id,
        };
        try {
          const result = await approveGetSupApi(data);
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
          const result = await rejectGetSupApi(data);
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

// 单元格仓库确认人点击通过
// const cellwhApprove = async (row: any) => {
//   console.log("仓库确认点击通过", row.id);
//   try {
//     const result = await approveGetSupWhApi({ id: row.id });
//     ElMessage.success(result.msg);
//     getData();
//   } catch (error) {}
// };

// 单元格仓库确认人点击驳回
const cellwhReject = (row: any) => {
  console.log("仓库确认点击驳回,输入驳回原因", row.id);
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
          const result = await rejectGetSupWhApi(data);
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
      <el-form :model="formData" ref="form" :inline="true">
        <el-form-item label="关键字" prop="keyword" class="w-[246px]">
          <el-input v-model="formData.keyword" placeholder="制单人"></el-input>
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
          <el-button :icon="Refresh" @click="handleReset(form)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <pure-table-bar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button
            type="success"
            size="default"
            :icon="Plus"
            class="mb-[10px]"
            @click="handleAdd"
            v-hasPerm="['sto:getsup:add']"
          >
            新建领料出库单
          </el-button>
          <el-tooltip effect="dark" content="一次最多只能打印10条勾选数据" placement="top-start">
            <el-button type="primary" @click="handlePrint" class="ml-[14px]">
              <template #icon>
                <i-ep-Printer></i-ep-Printer>
              </template>
              打印选中详情
            </el-button>
          </el-tooltip>
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
            adaptive
            :adaptiveConfig="adaptiveConfig"
            :max-height="maxHeight"
            ref="prueTableRef"
            row-key="id"
            @selection-change="changeSelect"
          >
            <template #receiver="{ row }">
              <el-text
                type="primary"
                class="cursor-pointer"
                tag="ins"
                v-if="
                  row.is_ct_user == 1 && !row.is_have_received && row.status != 3 && row.status != 6
                "
                @click="openAssignReceiver(row)"
              >
                {{ row.ar_names }}
              </el-text>
              <span v-else>{{ row.ar_names }}</span>
            </template>
            <template #status="{ row }">
              <div @click="showApproveLog(row)" class="hover:cursor-pointer">
                <el-tag v-if="row.status == 0">待提审</el-tag>
                <template v-else-if="row.status == 1">
                  <!-- <el-tag v-if="row.assoc_type == 3" type="success" effect="plain"> -->
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
                <el-tag type="warning" v-else-if="row.status == 8">
                  <span-msg msg="待领料"></span-msg>
                </el-tag>
                <el-tag  v-else-if="row.status == 10">
                  <span-msg msg="待确认"></span-msg>
                </el-tag>
              </div>
            </template>
            <!-- <template #receiver_confirm_status="{ row }">
              <el-text
                type="info"
                tag="ins"
                class="cursor-pointer"
                v-if="!row.receiver_confirm_status"
                @click="openReceiveStatus(row)"
              >
                待确认
              </el-text>
              <el-text
                type="primary"
                tag="ins"
                class="cursor-pointer"
                v-else
                @click="openReceiveStatus(row)"
              >
                已确认
              </el-text>
            </template> -->
            <template #operation="{ row }">
              <el-button
                size="default"
                type="primary"
                link
                :icon="Document"
                @click="cellDetail(row)"
                v-hasPerm="['sto:getsup:detail']"
              >
                详情
              </el-button>
              <!-- 当前为创建人 -->
              <template v-if="row.is_ct_user == 1">
                <!-- 待提审,已撤回,已驳回状态时 -->
                <template v-if="row.status == 0 || row.status == 4 || row.status == 5">
                  <el-button
                    size="default"
                    link
                    :icon="Edit"
                    @click="cellEdit(row)"
                    v-hasPerm="['sto:getsup:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['sto:getsup:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="handleVoid(row)"
                    v-hasPerm="['sto:getsup:void']"
                  >
                    作废
                  </el-button>
                </template>
                <!-- 待审核和待领料状态时 -->
                <template v-else-if="row.status == 1 || row.status == 8">
                  <template v-if="!row.is_part_issue">
                    <el-button
                      type="info"
                      size="default"
                      link
                      :icon="RefreshLeft"
                      @click="cellRecall(row)"
                      v-hasPerm="['sto:getsup:recall']"
                    >
                      撤回
                    </el-button>
                  </template>
                </template>
                <!-- 已作废状态时 -->
                <template v-else-if="row.status == 6">
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="cellDel(row)"
                    v-hasPerm="['sto:getsup:del']"
                  >
                    删除
                  </el-button>
                </template>
              </template>
              <!-- 当前为审核人的时候 -->
              <!-- <template v-if="row.assoc_type == 2"> -->
              <template v-if="checkAssocType(row.assoc_type, 2)">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 1">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellApprove(row)"
                    v-hasPerm="['sto:getsup:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['sto:getsup:reject']"
                  >
                    驳回
                  </el-button>
                </template>
              </template>
              <!-- 当前为仓库待确认的时候,即为仓库确认人且状态为8时 -->
              <!-- <template v-if="row.assoc_type == 5"> -->
              <template v-if="checkAssocType(row.assoc_type, 5) && row.status == 8">
                <el-button
                  type="success"
                  size="default"
                  link
                  :icon="CircleCheck"
                  @click="cellDetail(row)"
                  v-hasPerm="['sto:getsup:whapprove']"
                >
                  仓库发料
                </el-button>
                <el-button
                  type="warning"
                  size="default"
                  link
                  :icon="CircleClose"
                  @click="cellwhReject(row)"
                  v-hasPerm="['sto:getsup:whreject']"
                >
                  仓库驳回
                </el-button>
              </template>
              <!-- 当前身份是已发料且单据状态为10时 -->
              <template v-if="checkAssocType(row.assoc_type, 6) && row.status == 10">
                <el-button
                  type="warning"
                  link
                  @click="cellDetail(row)"
                  v-hasPerm="['sto:getsup:giverecall']"
                >
                  发料撤回
                </el-button>
              </template>
              <!-- 当前为领取确认人(指定领料人) 并且 单据状态为10的时候 -->
              <!-- <template v-if="row.assoc_type == 8 && row.status == 10"> -->
              <template v-if="checkAssocType(row.assoc_type, 8) && row.status == 10">
                <el-button
                  link
                  class="underline"
                  type="success"
                  @click="cellDetail(row)"
                  v-hasPerm="['sto:getsup:receive']"
                >
                  领取确认
                </el-button>
              </template>
              <!-- 当前是制单人且存在部分领料,且状态不为3时 -->
              <template v-if="row.is_ct_user == 1 && row.is_have_received == 1 && row.status != 3">
                <el-button
                  type="warning"
                  link
                  @click="cellDetail(row)"
                  v-hasPerm="['sto:getsup:over']"
                >
                  领料完结
                </el-button>
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
      <assignReceiver
        v-model:visible="assignReceiverVisible"
        :assign-info="assignInfo"
        @refreshList="handleSearch"
        :userList="userList"
      ></assignReceiver>
      <el-dialog title="审批流程" width="60%" top="30vh" v-model="assignFlowVisible">
        <assignFlow v-bind="assignFlowInfo" v-if="assignFlowVisible"></assignFlow>
        <span slot="footer" class="flex justify-center pt-[40px]">
          <el-button size="large" class="w-[120px]" @click="assignFlowVisible = false">
            关闭
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
