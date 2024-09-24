<script setup lang="ts">
import PureTableBar from "@/components/PureTableBar/index.vue";
import { useList } from "./utils/hook";
import { useAdaptiveConfig } from "@/hooks/table";
import { useRouter } from "vue-router";
// 引入选择部门自定义组件
import DeptSelect from "@/components/DeptSelect/index.vue";
// 引入获取部门列表的hooks
import { deptListHooks, approveLogHooks } from "@/hooks";
import type { FormInstance } from "element-plus";
// 引入api
import {
  getSwapListApi,
  voidSwapApi,
  delSwapApi,
  submitSwapApi,
  recallSwapApi,
  rejectSwapApi,
  approveSwapApi,
} from "@/api/buy/swap/index";
import type { ISwapList } from "@/api/buy/swap/types";
import { isLastPage } from "@/utils/lastPage";
import { useListHooks } from "@/hooks/list";

const { formData } = useListHooks();
defineOptions({
  name: "BuySwapList",
});

const { lookApproveLog } = approveLogHooks();
const { departmentList } = deptListHooks();
const { adaptiveConfig, maxHeight } = useAdaptiveConfig();
const { columns, options } = useList();
const router = useRouter();

// const formData = ref({
//   keyword: "",
//   page: 1,
//   size: 10,
//   time: "",
//   warehouse_id: "",
//   dept_id: "",
//   status: "",
// });
const formRef = ref<FormInstance>();
const tableData = ref<ISwapList[]>([]);
const tableLoading = ref(false);
const total = ref(0);

const getData = async () => {
  let { time, ...rest } = formData.value;
  let start_time = time ? time[0] : "";
  let end_time = time ? time[1] : "";
  let data = {
    start_time,
    end_time,
    ...rest,
  };
  try {
    tableLoading.value = true;
    const result = await getSwapListApi(data);
    tableData.value = result.data.data;
    total.value = result.data.total;
  } finally {
    tableLoading.value = false;
    console.log("tableLoading.value", tableLoading.value);
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

// 分页触发事件
const handleQuery = () => {
  getData();
};

// 点击新建按钮
const handleAdd = () => {
  router.push({
    path: "/buy/swap/add",
    query: {
      editFrom: 1,
    },
  });
};

// 单元格点击详情
const cellDetail = (row: ISwapList) => {
  console.log(row.id, row.assoc_type);
  router.push({
    path: "/buy/swap/detail",
    query: {
      assoc_type: row.assoc_type,
      id: row.id,
    },
  });
};
// 单元格点击编辑
const cellEdit = (row: ISwapList) => {
  router.push({
    path: "/buy/swap/add",
    query: {
      editFrom: 1,
      id: row.id,
    },
  });
};

// 单元格点击提审
const cellSubmitAudit = async (row: ISwapList) => {
  console.log("点击提审");
  try {
    const result = await submitSwapApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击撤回
const cellRecall = async (row: ISwapList) => {
  try {
    const result = await recallSwapApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击作废
const handleVoid = (row: ISwapList) => {
  console.log("点击作废", row.id);
  ElMessageBox.confirm(`您确定要作废【${row.replacement_no}】采购换货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      try {
        let result = await voidSwapApi({ id: row.id });
        ElMessage.success(result.msg);
        getData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
};

// 单元格点击删除
const cellDel = (row: ISwapList) => {
  ElMessageBox.confirm(`您确定要删除【${row.replacement_no}】采购换货单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定");
      let result = await delSwapApi({ id: row.id });
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
const cellApprove = async (row: ISwapList) => {
  console.log("点击通过", row.id);
  try {
    const result = await approveSwapApi({ id: row.id });
    ElMessage.success(result.msg);
    getData();
  } catch (error) {}
};

// 单元格点击驳回
const cellReject = (row: ISwapList) => {
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
          const result = await rejectSwapApi(data);
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

const showApproveLog = (row: any) => {
  let { status, id, replacement_no } = row;
  if (!status) {
    ElMessage.info("暂无审批日志");
    return;
  }
  let data = {
    document_type: 10,
    document_id: id,
    order_no: replacement_no,
  };
  lookApproveLog(data);
};

onActivated(() => {
  getData();
});
</script>
<template>
  <div class="app-container">
    <!-- 采购退货单页面 -->
    <div class="search-card">
      <el-form :model="formData" ref="formRef" :inline="true">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formData.keyword" placeholder="换货单号/采购单号/制单人"></el-input>
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
            placeholder="请选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch" v-deBounce>
            <template #icon>
              <i-ep-search></i-ep-search>
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
          <el-button type="success" @click="handleAdd" v-hasPerm="['buy:swap:add']">
            <template #icon>
              <i-ep-plus></i-ep-plus>
            </template>
            新建采购换货单
          </el-button>
        </template>

        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="prueTableRef"
            stripe
            border
            header-cell-class-name="table-row-header"
            :data="tableData"
            :columns="dynamicColumns"
            :loading="tableLoading"
            :size="(size as any)"
            row-key="id"
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
                type="primary"
                link
                @click="cellDetail(row)"
                v-hasPerm="['buy:swap:detail']"
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
                  <el-button link @click="cellEdit(row)" v-hasPerm="['buy:swap:edit']">
                    <template #icon>
                      <i-ep-Edit></i-ep-Edit>
                    </template>
                    编辑
                  </el-button>
                  <el-button
                    type="primary"
                    link
                    @click="cellSubmitAudit(row)"
                    v-hasPerm="['buy:swap:submit']"
                  >
                    <template #icon>
                      <i-ep-Position></i-ep-Position>
                    </template>
                    提审
                  </el-button>
                  <el-button
                    type="danger"
                    link
                    @click="handleVoid(row)"
                    v-hasPerm="['buy:swap:void']"
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
                    v-hasPerm="['buy:swap:recall']"
                  >
                    <template #icon>
                      <i-ep-RefreshLeft></i-ep-RefreshLeft>
                    </template>
                    撤回
                  </el-button>
                </template>
                <!-- 已作废状态时 -->
                <template v-else-if="row.status == 6">
                  <el-button
                    type="danger"
                    size="default"
                    link
                    @click="cellDel(row)"
                    v-hasPerm="['buy:swap:del']"
                  >
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
                    v-hasPerm="['buy:swap:approve']"
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
                    v-hasPerm="['buy:swap:reject']"
                  >
                    <template #icon>
                      <i-ep-CircleClose></i-ep-CircleClose>
                    </template>
                    驳回
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
