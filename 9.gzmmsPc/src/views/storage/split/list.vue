<script setup lang="ts">
// 拆装单页面
import PureTableBar from "@/components/PureTableBar/index.vue";
import type { FormInstance } from "element-plus";
import { useAdaptiveConfig } from "@/hooks/table";
import { useSplitList } from "./utils/hook";
import { useRouter } from "vue-router";
// 引入api,
import {
  getSplitListApi,
  submitSplitApi,
  recallSplitApi,
  voidSplitApi,
  delSplitApi,
  rejectSplitApi,
  approveSplitApi,
  rejectSplitWhApi,
  approveSplitWhApi,
} from "@/api/storage/split/index";
import type { IlistData } from "@/api/storage/split/types";
// 引入获取仓库列表的hooks
import { storageListHooks, approveLogHooks } from "@/hooks";
import { isLastPage } from "@/utils/lastPage";
import { useListHooks } from "@/hooks/list";

defineOptions({
  name: "StoSplitList",
});
const { lookApproveLog } = approveLogHooks();
const { storageList } = storageListHooks();
const router = useRouter();
const { columns } = useSplitList();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const state = reactive({
  formData: {
    keyword: "",
    warehouse_id: undefined,
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
      label: "待确认",
    },
    {
      value: 9,
      label: "已确认",
    },
  ],
  tableData: [] as IlistData[],
  tableLoading: false,
  total: 1,
});
const { formData, options, tableData, tableLoading, total } = toRefs(state);
useListHooks(formData);

const formRef = ref<FormInstance>();

async function getData() {
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
    const result = await getSplitListApi(data);
    tableData.value = result.data.data;
    if (formData.value.page == 1) {
      total.value = result.data.total;
    }
  } finally {
    tableLoading.value = false;
  }
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

// 点击查看审批日志
async function showApproveLog(row: IlistData) {
  let { id, status, split_assemble_no } = row;

  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  let data = {
    document_type: 11,
    document_id: id,
    order_no: split_assemble_no,
  };
  lookApproveLog(data);
}

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/storage/split/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: IlistData) => {
  console.log(row.id);
  router.push({
    path: "/storage/split/detail",
    query: {
      assoc_type: row.assoc_type,
      id: row.id,
    },
  });
};

// 单元格点击编辑
const cellEdit = (row: IlistData) => {
  router.push({
    path: "/storage/split/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
};
// 单元格点击提审
const cellSubmitAudit = async (row: IlistData) => {
  console.log("点击提审");
  try {
    const result = await submitSplitApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: IlistData) => {
  try {
    const result = await recallSplitApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = (row: IlistData) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.split_assemble_no}】拆装单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidSplitApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};
// 单元格点击删除
const cellDel = (row: IlistData) => {
  ElMessageBox.confirm(`您确定要删除【${row.split_assemble_no}】拆装单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delSplitApi({ id: row.id });
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
const cellApprove = async (row: IlistData) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveSplitApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: IlistData) => {
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
          const result = await rejectSplitApi(data);
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
const cellwhApprove = async (row: any) => {
  console.log("仓库确认点击通过", row.id);
  try {
    const result = await approveSplitWhApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
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
          const result = await rejectSplitWhApi(data);
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
          <el-input v-model="formData.keyword" placeholder="拆装单号/制单人"></el-input>
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
        <el-form-item label="拆装仓库" prop="warehouse_id">
          <el-select
            v-model="formData.warehouse_id"
            placeholder="请选择拆装仓库"
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
        <el-form-item label="拆装日期" prop="time">
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
          <el-button type="primary" @click="handleSearch" v-deBounce>
            <template #icon>
              <i-ep-Search></i-ep-Search>
            </template>
            查询
          </el-button>
          <el-button @click="handleReset(formRef)">
            <template #icon>
              <i-ep-Refresh></i-ep-Refresh>
            </template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-card">
      <pure-table-bar :columns="columns" @refresh="handleSearch">
        <template #buttons>
          <el-button
            type="success"
            class="mb-[10px]"
            @click="handleAdd"
            v-hasPerm="['buy:split:add']"
          >
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建拆装单
          </el-button>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            stripe
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="(size as any)"
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
                <el-tag type="danger" v-else-if="row.status == 6">
                  <span-msg msg="已作废"></span-msg>
                </el-tag>
                <el-tag  v-else-if="row.status == 8">
                  <span-msg msg="待确认"></span-msg>
                </el-tag>
              </div>
            </template>
            <template #operation="{ row, $index }">
              <el-button
                size="default"
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['buy:split:detail']"
              >
                <template #icon>
                  <i-ep-Document></i-ep-Document>
                </template>
                详情
              </el-button>
              <!-- 当前为创建人 -->
              <template v-if="row.assoc_type == 1">
                <!-- 待提审,已撤回,已驳回状态时 -->
                <template v-if="row.status == 0 || row.status == 4 || row.status == 5">
                  <el-button link @click="cellEdit(row)" v-hasPerm="['buy:split:edit']">
                    <template #icon>
                      <i-ep-Edit></i-ep-Edit>
                    </template>
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['buy:split:submit']"
                  >
                    <i-ep-Position></i-ep-Position>
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    link
                    @click="handleVoid(row)"
                    v-hasPerm="['buy:split:void']"
                  >
                    <template #icon>
                      <i-ep-Delete></i-ep-Delete>
                    </template>
                    作废
                  </el-button>
                </template>
                <!-- 待审核状态时 -->
                <template v-else-if="row.status == 1">
                  <el-button
                    type="info"
                    link
                    @click="cellRecall(row)"
                    v-hasPerm="['buy:split:recall']"
                  >
                    <template #icon>
                      <i-ep-RefreshLeft></i-ep-RefreshLeft>
                    </template>
                    撤回
                  </el-button>
                </template>
                <!-- 已作废状态时 -->
                <template v-else-if="row.status == 6">
                  <el-button type="danger" link @click="cellDel(row)" v-hasPerm="['buy:split:del']">
                    <template #icon>
                      <i-ep-Delete></i-ep-Delete>
                    </template>
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
                    link
                    @click="cellApprove(row)"
                    v-hasPerm="['buy:split:approve']"
                  >
                    <template #icon>
                      <i-ep-CircleCheck></i-ep-CircleCheck>
                    </template>
                    通过
                  </el-button>
                  <el-button
                    type="warning"
                    link
                    @click="cellReject(row)"
                    v-hasPerm="['buy:split:reject']"
                  >
                    <template #icon>
                      <i-ep-CircleClose></i-ep-CircleClose>
                    </template>
                    驳回
                  </el-button>
                </template>
              </template>
              <!-- 当前为仓库待确认的时候,即为仓库确认人 -->
              <template v-if="row.assoc_type == 5">
                <!-- 待审核状态时 -->
                <template v-if="row.status == 8">
                  <el-button
                    type="success"
                    link
                    @click="cellwhApprove(row)"
                    v-hasPerm="['buy:split:whapprove']"
                  >
                    <template #icon>
                      <i-ep-CircleCheck></i-ep-CircleCheck>
                    </template>
                    仓库确认
                  </el-button>
                  <el-button
                    type="warning"
                    link
                    @click="cellwhReject(row)"
                    v-hasPerm="['buy:split:whreject']"
                  >
                    <template #icon>
                      <i-ep-CircleClose></i-ep-CircleClose>
                    </template>
                    仓库驳回
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
  </div>
</template>
<style lang="scss" scoped></style>
