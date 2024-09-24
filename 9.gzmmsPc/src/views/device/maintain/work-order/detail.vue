<script setup lang="ts">
import dayjs from "dayjs";
import type { FieldValues } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import {
  getMaintainWorkApproveApi,
  getMaintainWorkDetailApi,
  getMaintainWorkRecallApi,
  getMaintainWorkRejectApi,
  getMaintainWorkSubmitApi,
} from "@/api/device/maintain/work-order";
import type { WorkOrderDetailType } from "@/api/device/maintain/work-order/types";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import { useCommon } from "@/hooks/device/baseData";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useDetail } from "./utils/detail";
import { useList } from "./utils/hook";
import { addDialog, updateDialog } from "@/components/ReDialog";
import selectUniqueCodeVue from "@/views/device/components/selectUniqueCode/index.vue";

const router = useRouter();
const route = useRoute();
const useSetting = useSettingsStoreHook();

const { getCycleName } = useCommon();
const {
  columnsOne,
  columnsTwo,
  standardColumns,
  columnsThree,
  orderColumns,
  downColumns,
  logColumns,
} = useDetail();
const {
  submitColumns,
  submitRules,
  checkAssocType,
  submitFormData,
  submitVisible,
  getStatusTitle,
  getTagType,
} = useList();

const standardList = ref<any[]>([]);
const img_info = ref<string[]>([]);
const activeName = ref("first");
const log_list = ref<any[]>([]);
const assoc_type = ref<number[]>([]);

const status = ref<number>(-1);

const dataLoading = ref(false);
const listId = ref(0);
const detailData = ref<WorkOrderDetailType>();
const cycle_type = ref(-1);
const cycle_name = ref("");

async function getDetailData() {
  dataLoading.value = true;
  const result = await getMaintainWorkDetailApi({ id: listId.value });
  status.value = result.data.status;
  assoc_type.value = result.data.assoc_type;
  detailData.value = result.data;
  log_list.value = result.data.act_log;
  cycle_type.value = result.data.cycle_type;
  cycle_name.value = getCycleName(result.data.cycle_type);
  standardList.value = result.data.maintenance_project ?? [];
  img_info.value = result.data.img_info
    ? result.data.img_info.map((item: string) => useSetting.baseHttp + item)
    : [];
  dataLoading.value = false;
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/maintain/work-order",
  });
}
/** 点击编辑 */
function handleEdit() {
  router.push({
    path: "/device/maintain/work-order/add",
    query: {
      id: listId.value,
    },
  });
}
/** 点击提交验收 */
function handleSubmit() {
  submitVisible.value = true;
  submitFormData.value.maintenance_start_time = dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.complete_time = detailData.value?.complete_time ?? "";
}

async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getMaintainWorkSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击撤回 */
async function handleRecall() {
  const reuslt = await getMaintainWorkRecallApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击验收通过 */
async function handleApprove() {
  const reuslt = await getMaintainWorkApproveApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击验收拒绝 */
async function handleReject() {
  const reuslt = await getMaintainWorkRejectApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

onMounted(() => {
  listId.value = Number(route.query.id);
  if (listId.value) {
    getDetailData();
  }
});

const selectUniqueCodeRef = ref();
async function lookDetail(row: any) {
  console.log("🚀 ~ lookDetail ~ row:", row);
  let { unique_label_detail } = row;
  console.log("🚀 ~ lookDetail ~ unique_label_detail:", unique_label_detail);

  let list = unique_label_detail.map((item: any) => {
    return {
      ...item,
      code: item.unique_code,
    };
  });

  // selectUniqueVue
  addDialog({
    width: "60%",
    draggable: true,
    closeOnClickModal: false,
    btnClass: "w-[80px]",
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "标签明细",
    contentRenderer: () =>
      h(selectUniqueCodeVue, {
        ref: selectUniqueCodeRef,
        data: list,
        hideSelect: true,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      done();
    },
  });
}
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-loading="dataLoading">
      <div class="app-card-status">
        <el-tag :type="getTagType(status)" size="large">{{ getStatusTitle(status) }}</el-tag>
      </div>

      <el-tabs v-model="activeName">
        <el-tab-pane label="保养工单详情信息" name="first">
          <el-card shadow="never" class="mb-6">
            <p class="card-header">设备信息</p>
            <PlusDescriptions :column="3" :columns="columnsOne" :data="detailData" />
          </el-card>
          <el-card shadow="never" class="mb-6">
            <p class="card-header">保养处理情况</p>
            <PlusDescriptions :column="3" :columns="columnsTwo" :data="detailData">
              <template #plus-desc-img_info>
                <el-image
                  :src="item"
                  style="width: 140px; margin-right: 20px; border-radius: 6px"
                  v-for="(item, index) in img_info"
                  :key="index"
                  :preview-src-list="img_info"
                />
              </template>
            </PlusDescriptions>
          </el-card>
          <el-card shadow="never" class="mb-6">
            <p class="card-header mb-4">保养项目</p>
            <div class="mb-2 pl-2 font-bold">
              <span class="inline-block mr-4">循环周期</span>
              <span>{{ cycle_name }}</span>
            </div>
            <PureTable
              header-cell-class-name="table-gray-header"
              :data="standardList"
              :columns="standardColumns"
            ></PureTable>
          </el-card>
          <el-card shadow="never" class="mb-6">
            <p class="card-header">更换备件</p>
            <PlusDescriptions
              :column="3"
              :columns="columnsThree"
              :data="detailData"
            ></PlusDescriptions>
          </el-card>
          <template v-if="detailData?.is_replace">
            <el-card shadow="never" class="mb-4">
              <p class="card-header mb-4">关联领用单换上备件</p>
              <pure-table
                header-cell-class-name="table-gray-header"
                :data="detailData.rec_arr"
                :columns="orderColumns"
              >
                <template #use_num="{ row }">
                  <span class="block">{{ row.use_num }}</span>
                  <el-button
                    type="primary"
                    link
                    @click.stop="lookDetail(row)"
                    v-if="row.is_have_unique"
                  >
                    标签明细
                  </el-button>
                </template>
              </pure-table>
            </el-card>
            <el-card shadow="never" class="mb-4">
              <p class="card-header mb-4">关联换下备件</p>
              <pure-table
                header-cell-class-name="table-gray-header"
                :data="detailData.down_arr"
                :columns="downColumns"
              >
                <template #down_num="{ row }">
                  <span class="block">{{ row.down_num }}</span>
                  <el-button
                    type="primary"
                    link
                    @click.stop="lookDetail(row)"
                    v-if="row.is_have_unique"
                  >
                    标签明细
                  </el-button>
                </template>
              </pure-table>
            </el-card>
          </template>
          <DeviceApproveFlow
            :id="listId"
            :order-type="2"
            :type="3"
            :status="status"
          ></DeviceApproveFlow>
        </el-tab-pane>
        <el-tab-pane label="单据日志" name="second">
          <PureTable
            header-cell-class-name="table-gray-header"
            :data="log_list"
            :columns="logColumns"
          ></PureTable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <!-- 当前是创建人的时候 -->
      <template v-if="checkAssocType(assoc_type, 1)">
        <!-- 如果是待提审,已撤回,已驳回状态时, 显示编辑和提审和作废  -->
        <template v-if="status === 0 || status === 3 || status === 4">
          <el-button
            type="primary"
            plain
            class="w-[100px] mr-4"
            size="large"
            @click="handleEdit"
            v-hasPerm="['maintain:workorder:edit']"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            class="w-[100px] mr-4"
            size="large"
            @click="handleSubmit"
            v-hasPerm="['maintain:workorder:submit']"
          >
            提交验收
          </el-button>
        </template>
        <!-- 如果是待审核状态时,显示撤回按钮 -->
        <template v-else-if="status === 1">
          <el-button
            plain
            class="w-[100px] mr-4"
            size="large"
            @click="handleRecall"
            v-hasPerm="['maintain:workorder:recall']"
          >
            撤回
          </el-button>
        </template>
      </template>

      <template v-if="checkAssocType(assoc_type, 2)">
        <!-- 如果是待审核状态 -->
        <template v-if="status === 1">
          <el-button
            type="primary"
            class="w-[100px] mr-4"
            size="large"
            @click="handleApprove"
            v-hasPerm="['maintain:workorder:approve']"
          >
            验收通过
          </el-button>
          <el-button
            class="w-[100px] mr-4"
            size="large"
            @click="handleReject"
            v-hasPerm="['maintain:workorder:reject']"
          >
            验收驳回
          </el-button>
        </template>
      </template>
    </div>
    <PlusDialogForm
      :dialog="{
        title: '确认提交验收',
        cancelText: '取消',
        confirmText: '确定提交',
        draggable: true,
        top: '20vh',
      }"
      v-model:visible="submitVisible"
      v-model="submitFormData"
      :form="{ columns: submitColumns, rules: submitRules }"
      @confirm="submitConfirm"
    />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 0;
}
:deep(.el-tabs__header) {
  margin-bottom: 4px;
}

/* 重置label宽度 */
:deep(.el-descriptions__label) {
  width: 160px; /* 或者设置具体宽度 */
}

.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0px;
  position: relative;
  &-status {
    position: absolute;
    right: 20px;
    top: 4px;
  }
}
.card-header {
  padding: 10px 0 0 10px;
  // font-weight: 600;
  font-size: 16px;
}
</style>
