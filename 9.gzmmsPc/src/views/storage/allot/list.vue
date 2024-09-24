<script setup lang="ts">
/* 调拨单列表页 */
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
//引入API
import {
  approveRllotApi,
  approveRllotWhApi,
  delRllotApi,
  getRllotListApi,
  recallRllotApi,
  rejectRllotApi,
  rejectRllotWhApi,
  submitRllotApi,
  voidRllotApi,
} from "@/api/storage/allot";
//引入类型
import { IAllotItem } from "@/api/storage/allot/types";
import { isLastPage } from "@/utils/lastPage";
import { formartDate } from "@/utils/validate";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useAdaptiveConfig } from "@/hooks/table";
// 引入获取部门列表的hooks
import { approveLogHooks, deptListHooks } from "@/hooks";
// 引入获取仓库列表的hooks
import { storageListHooks } from "@/hooks";
// 引入审批流程自定义组件
import ApproveFlow from "./components/ApproveFlow.vue";
import { useOrderList } from "./utils/hook";
import moban from "./utils/moban.json";

defineOptions({
  name: "StoAllotList",
});

hiprint.init();

// import { useListHooks } from "@/hooks/list";

// const { formData } = useListHooks();

const { storageFilterList } = storageListHooks(1);
const { storageList } = storageListHooks();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns } = useOrderList();
const router = useRouter();

const { departmentList } = deptListHooks();
const { lookApproveLog } = approveLogHooks();
const state = reactive({
  formData: {
    keyword: "",
    dept_id: undefined,
    time: "",
    page: 1,
    size: 10,
    status: undefined,
    out_wh_name: undefined,
    to_wh_name: undefined,
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
      label: "待调出确认",
    },
    {
      value: 9,
      label: "待调入确认",
    },
  ],
  tableData: [] as IAllotItem[],
  tableLoading: false,
  total: 1,
  approveFlowVisible: false,
});
const { formData, options, tableData, tableLoading, total, approveFlowVisible } = toRefs(state);
// const { options, tableData, tableLoading, total } = toRefs(state);
const form = ref<FormInstance>();
const selectCodeData = ref<IAllotItem[]>([]);
const prueTableRef = ref();
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

/** 传递给流程组件的数据 */
const approveFlowInfo = ref({
  id: 0,
  type: 4,
  status: 0,
  outWhId: 0,
  toWhId: 0,
});

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
      table_title: "调拨单",
      barcode: item.wh_tra_no,
      table_no: "调拨单号:",
      table_username: `制单人:${item.ct_name}`,
      out_wh_name: `调出仓库:${item.out_wh_name}`,
      out_time: `调出日期:${formartDate(item.out_time)}`,
      to_wh_name: `调入仓库:${item.to_wh_name}`,
      in_time: `调入日期:${formartDate(item.in_time)}`,
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
function changeSelect(selection: IAllotItem[]) {
  selectCodeData.value = selection;
}

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击查看审批日志
async function showApproveLog(row: IAllotItem) {
  // let { id, status, wh_tra_no } = row;
  let { id, status, out_wh_id, to_wh_id } = row;

  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  approveFlowInfo.value = {
    id,
    type: 4,
    status,
    outWhId: out_wh_id,
    toWhId: to_wh_id,
  };
  approveFlowVisible.value = true;
  // let data = {
  //   document_type: 5,
  //   document_id: id,
  //   order_no: wh_tra_no,
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
    const result = await getRllotListApi(data);
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
    path: "/storage/allot/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: any) => {
  router.push({
    path: "/storage/allot/add",
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
    path: "/storage/allot/detail",
    query: {
      assoc_type: row.assoc_type,
      id: row.id,
    },
  });
};
// 单元格点击提审
const cellSubmitAudit = async (row: IAllotItem) => {
  console.log("点击提审");
  try {
    const result = await submitRllotApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: IAllotItem) => {
  try {
    const result = await recallRllotApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 单元格点击作废
const handleVoid = (row: IAllotItem) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.wh_tra_no}】调拨单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRllotApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: IAllotItem) => {
  ElMessageBox.confirm(`您确定要删除【${row.wh_tra_no}】调拨单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRllotApi({ id: row.id });
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
const cellApprove = async (row: IAllotItem) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveRllotApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: IAllotItem) => {
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
      console.log(value);
      if (value) {
        let data = {
          reason: value,
          id: row.id,
        };
        try {
          const result = await rejectRllotApi(data);
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
const cellwhApprove = async (row: any, type: number) => {
  let id = row.id;
  let date = type === 1 ? row.out_time : row.in_time;
  const title = type === 1 ? "您确定要调出吗" : "您确定要调入吗";
  const labelText = type === 1 ? "调出时间:" : "调入时间:";
  const buttonText = type === 1 ? "确定调出" : "确定调入";
  const elDate = h(ElDatePicker, {
    style: {
      marginLeft: "10px",
    },
    modelValue: date,
    type: "date",
    placeholder: "请选择调出时间",
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
    title: title,
    message: h("p", null, [h("span", null, labelText), elDate]),
    showCancelButton: true,
    confirmButtonText: buttonText,
    cancelButtonText: "取消",
    closeOnClickModal: false,
    draggable: true,
  }).then(async () => {
    let data = type === 1 ? { out_time: date, id } : { in_time: date, id };
    const result = await approveRllotWhApi(data);
    ElMessage.success(result.msg);
    getData();
  });
};

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
      console.log(value);
      if (value) {
        let data = {
          reason: value,
          id: row.id,
        };
        try {
          const result = await rejectRllotWhApi(data);
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
          <el-input v-model="formData.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item label="调出仓库" prop="out_wh_name">
          <el-select
            v-model="formData.out_wh_name"
            placeholder="请选择调出仓库"
            clearable
            filterable
          >
            <el-option
              v-for="item in storageFilterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调入仓库" class="mx-[10px]" prop="to_wh_name">
          <el-select
            v-model="formData.to_wh_name"
            placeholder="请选择调入仓库"
            clearable
            filterable
          >
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
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
            v-hasPerm="['sto:allot:add']"
          >
            新建调拨单
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
                <el-tag effect="plain" v-else-if="row.status == 8">
                  <span-msg msg="待调出确认"></span-msg>
                </el-tag>
                <el-tag effect="plain" v-else-if="row.status == 9">
                  <span-msg msg="待调入确认"></span-msg>
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
                v-hasPerm="['sto:allot:detail']"
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
                    v-hasPerm="['sto:allot:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['sto:allot:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="handleVoid(row)"
                    v-hasPerm="['sto:allot:void']"
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
                    v-hasPerm="['sto:allot:recall']"
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
                    v-hasPerm="['sto:allot:del']"
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
                    v-hasPerm="['sto:allot:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['sto:allot:reject']"
                  >
                    驳回
                  </el-button>
                </template>
              </template>
              <!-- 当前为调出仓库待确认的时候 -->
              <template v-if="row.assoc_type == 5">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 8">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellwhApprove(row, 1)"
                    v-hasPerm="['sto:allot:whapprove']"
                  >
                    调出确认
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellwhReject(row)"
                    v-hasPerm="['sto:allot:whreject']"
                  >
                    调出驳回
                  </el-button>
                </template>
              </template>
              <template v-if="row.assoc_type == 8">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 9">
                  <el-button
                    type="success"
                    size="default"
                    link
                    :icon="CircleCheck"
                    @click="cellwhApprove(row, 2)"
                    v-hasPerm="['sto:allot:whapprove']"
                  >
                    调入确认
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellwhReject(row)"
                    v-hasPerm="['sto:allot:whreject']"
                  >
                    调入驳回
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
      <el-dialog title="审批流程" width="60%" top="30vh" v-model="approveFlowVisible">
        <ApproveFlow v-bind="approveFlowInfo" v-if="approveFlowVisible"></ApproveFlow>
        <span slot="footer" class="flex justify-center pt-[40px]">
          <el-button size="large" class="w-[120px]" @click="approveFlowVisible = false">
            关闭
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
