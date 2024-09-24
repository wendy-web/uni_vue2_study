<!-- 采购退货单列表页 -->
<template>
  <div class="app-container">
    <div class="search-card">
      <el-form :model="formData" ref="form" :inline="true">
        <el-form-item label="关键字" prop="keyword" class="w-[246px]">
          <el-input v-model="formData.keyword" placeholder="退货单号/采购单号/制单人"></el-input>
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
      <PureTableBar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button
            type="success"
            size="default"
            :icon="Plus"
            class="mb-[10px]"
            @click="handleAdd"
            v-hasPerm="['buy:refund:add']"
          >
            新建采购退货单
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="(size as any)"
            border
            stripe
            header-cell-class-name="table-row-header"
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
                v-hasPerm="['buy:refund:detail']"
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
                    v-hasPerm="['buy:refund:edit']"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    size="default"
                    link
                    :icon="Position"
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['buy:refund:submit']"
                  >
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    size="default"
                    link
                    :icon="Delete"
                    @click="handleVoid(row)"
                    v-hasPerm="['buy:refund:void']"
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
                    v-hasPerm="['buy:refund:recall']"
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
                    v-hasPerm="['buy:refund:del']"
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
                    v-hasPerm="['buy:refund:approve']"
                  >
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    size="default"
                    link
                    :icon="CircleClose"
                    @click="cellReject(row)"
                    v-hasPerm="['buy:refund:reject']"
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
  </div>
</template>
<script lang="ts">
export default {
  name: "BuyRefundList",
};
</script>

<script setup lang="ts">
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";

import PureTableBar from "@/components/PureTableBar/index.vue";
// 引入获取部门列表的hooks
import { deptListHooks, approveLogHooks } from "@/hooks";
import { useAdaptiveConfig } from "@/hooks/table";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  CircleClose,
  CircleCheck,
  Position,
  Document,
  Delete,
  RefreshLeft,
} from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
// 导入api
import {
  getRefundListApi,
  voidRefundApi,
  delRefundApi,
  submitRefunApi,
  recallRefundApi,
  rejectRefundApi,
  approveRefundApi,
} from "@/api/buy/refund";
// 导入类型
import { IRefundItem } from "@/api/buy/refund/types";
import { isLastPage } from "@/utils/lastPage";

import { useRouter } from "vue-router";
import { useOrderList } from "./utils/hook";
import { useListHooks } from "@/hooks/list";

const { formData } = useListHooks();
const { lookApproveLog } = approveLogHooks();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns } = useOrderList();
const router = useRouter();

const { departmentList } = deptListHooks();
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
      label: "已审核",
    },
  ],
  tableData: [] as IRefundItem[],
  tableLoading: false,
  total: 1,
});
// const { formData, options, tableData, tableLoading, total } = toRefs(state);
const { options, tableData, tableLoading, total } = toRefs(state);
const form = ref<FormInstance>();

//分页触发事件
const handleQuery = () => {
  console.log("分页触发");
  getData();
};

// 点击查看审批日志
async function showApproveLog(row: IRefundItem) {
  let { id, status, procure_ret_no } = row;
  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  let data = {
    document_type: 9,
    document_id: id,
    order_no: procure_ret_no,
  };
  lookApproveLog(data);
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
    const result = await getRefundListApi(data);
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
  getData();
};

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/buy/refund/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: IRefundItem) => {
  router.push({
    path: "/buy/refund/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: IRefundItem) => {
  console.log(row.id, row.assoc_type);
  router.push({
    path: "/buy/refund/detail",
    query: {
      assoc_type: row.assoc_type,
      id: row.id,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async (row: IRefundItem) => {
  console.log("点击提审");
  try {
    const result = await submitRefunApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: IRefundItem) => {
  try {
    const result = await recallRefundApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};
// 单元格点击作废
const handleVoid = (row: IRefundItem) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.procure_ret_no}】采购退货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidRefundApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: IRefundItem) => {
  ElMessageBox.confirm(`您确定要删除【${row.procure_ret_no}】采购退货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delRefundApi({ id: row.id });
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
const cellApprove = async (row: IRefundItem) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveRefundApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: IRefundItem) => {
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
          const result = await rejectRefundApi(data);
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
  console.log("我执行");
  getData();
});
</script>

<style scoped lang="scss"></style>
