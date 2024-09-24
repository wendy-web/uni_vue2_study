<script setup lang="ts">
import { getRepairLogApi } from "@/api/device/common/index";
import {
  getRepairApproveApi,
  getRepairInfoApi,
  getRepairRecallApi,
  getRepairRejectApi,
  getRepairSubmitApi,
  getRepairVoidApi
} from "@/api/device/maintain/repair/index";
import DeviceApproveFlow from "@/components/Device/DeviceApproveFlow/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import selectUniqueCodeVue from "@/views/device/components/selectUniqueCode/index.vue";
import dayjs from "dayjs";
import type { TabPaneName } from "element-plus";
import type { FieldValues } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import { useDetail } from "./utils/detail";
import { useList } from "./utils/hook";

const useSetting = useSettingsStoreHook();
const router = useRouter();
const route = useRoute();

const { columnsOne, columnsTwo, columnsThree, columnsFour, orderColumns, downColumns, logColumns } =
  useDetail();
const {
  submitColumns,
  submitRules,
  checkAssocType,
  submitFormData,
  submitVisible,
  getStatusTitle,
  getTagType,
} = useList();

const dataLoading = ref(false);
const listId = ref(0);
const detailData = ref<any>({});
const assoc_type = ref<number[]>([]);

const status = ref<number>(-1);
const activeName = ref("first");
const log_list = ref<any[]>([]);

// 故障图片
const faultImgList = ref();
// 维修图片
const repairImgList = ref();

async function getEditData() {
  dataLoading.value = true;
  const result = await getRepairInfoApi({ id: listId.value });
  detailData.value = result.data;
  status.value = result.data.status;
  faultImgList.value = result.data.fault_picture.map((item) => useSetting.baseHttp + item);
  repairImgList.value = result.data.repair_picture.map((item) => useSetting.baseHttp + item);

  dataLoading.value = false;
}

function tabChange(name: TabPaneName) {
  activeName.value = name as string;
  getLog();
}

async function getLog() {
  if (activeName.value === "second") {
    const result = await getRepairLogApi({ id: listId.value, type: 1 });
    log_list.value = result.data;
  }
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/maintain/repair",
  });
}

/** 点击编辑 */
function handleEdit() {
  router.push({
    path: "/device/maintain/repair/add",
    query: {
      id: listId.value,
    },
  });
}
/** 点击提交验收 */
function handleSubmit() {
  submitVisible.value = true;
  submitFormData.value.repair_start_time = dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.repair_end_time = detailData.value?.repair_end_time ?? "";
}

/** 点击作废 */
async function handleVoid() {
  ElMessageBox.confirm(`您确定要作废此维修单吗?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const reuslt = await getRepairVoidApi({ id: listId.value });
        ElMessage.success(reuslt.msg);
        getEditData();
      } catch (error) {}
    })
    .catch((error) => {
      console.log(error);
    });
}

async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getRepairSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getEditData();
}

/** 点击撤回 */
async function handleRecall() {
  const reuslt = await getRepairRecallApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getEditData();
}

/** 点击验收通过 */
async function handleApprove() {
  const reuslt = await getRepairApproveApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getEditData();
}

/** 点击验收拒绝 */
async function handleReject() {
  const reuslt = await getRepairRejectApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getEditData();
}

onMounted(() => {
  console.log("route.query", route.query);
  listId.value = Number(route.query.id);
  let assocType = route.query.assoc_type as string;
  assoc_type.value = assocType ? assocType.split(",").map((item) => Number(item)) : [];
  console.log("🚀assoc_type.value :", assoc_type.value);

  if (listId.value) {
    getEditData();
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
  <div class="app-container" v-loading="dataLoading">
    <div class="app-card">
      <div class="app-card-status">
        <el-tag :type="getTagType(status)" size="large">{{ getStatusTitle(status) }}</el-tag>
      </div>
      <el-tabs v-model="activeName" @tab-change="tabChange">
        <el-tab-pane label="设备维修单详情信息" name="first">
          <el-card shadow="never" class="mb-6">
            <p class="card-header">设备信息</p>
            <PlusDescriptions :column="3" :columns="columnsOne" :data="detailData" />
          </el-card>

          <el-card shadow="never" class="mb-6">
            <p class="card-header">故障信息</p>
            <PlusDescriptions :column="3" :columns="columnsTwo" :data="detailData">
              <template #plus-desc-fault_picture>
                <el-image
                  :src="item"
                  style="width: 140px; margin-right: 20px; border-radius: 6px"
                  v-for="(item, index) in faultImgList"
                  :key="index"
                  :preview-src-list="faultImgList"
                />
              </template>
            </PlusDescriptions>
          </el-card>
          <el-card shadow="never">
            <p class="card-header">维修处理情况</p>
            <PlusDescriptions :column="3" :columns="columnsThree" :data="detailData">
              <template #plus-desc-repair_picture>
                <el-image
                  :src="item"
                  style="width: 140px; margin-right: 20px; border-radius: 6px"
                  v-for="(item, index) in repairImgList"
                  :key="index"
                  :preview-src-list="repairImgList"
                />
              </template>
            </PlusDescriptions>
          </el-card>
          <PlusDescriptions :columns="columnsFour" :data="detailData" class="mb-6" />
          <template v-if="detailData?.is_replace">
            <el-card shadow="never" class="mb-4">
              <p class="card-header mb-4">关联领用单换上备件</p>
              <pure-table
                header-cell-class-name="table-gray-header"
                :data="detailData.repair_parts"
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
                :data="detailData.chage_parts"
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
            :order-type="1"
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
            v-hasPerm="['maintain:repair:addedit']"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            class="w-[100px] mr-4"
            size="large"
            @click="handleSubmit"
            v-hasPerm="['maintain:repair:submit']"
          >
            提交验收
          </el-button>
          <el-button
            type="warning"
            plain
            class="w-[100px] mr-4"
            size="large"
            @click="handleVoid"
            v-hasPerm="['maintain:repair:void']"
          >
            作废
          </el-button>
        </template>
        <!-- 如果是待审核状态时,显示撤回按钮 -->
        <template v-else-if="status === 1">
          <el-button
            plain
            class="w-[100px] mr-4"
            size="large"
            @click="handleRecall"
            v-hasPerm="['maintain:repair:recall']"
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
            v-hasPerm="['maintain:repair:approve']"
          >
            验收通过
          </el-button>
          <el-button
            class="w-[100px] mr-4"
            size="large"
            @click="handleReject"
            v-hasPerm="['maintain:repair:reject']"
          >
            验收驳回
          </el-button>
        </template>
      </template>
    </div>
    <PlusDialogForm
      v-model:visible="submitVisible"
      v-model="submitFormData"
      :form="{ labelWidth: '120', columns: submitColumns, rules: submitRules }"
      :dialog="{
        top: '20vh',
        title: '提交验收',
        cancelText: '取消',
        confirmText: '提交',
        draggable: true,
      }"
      @confirm="submitConfirm"
    />
  </div>
</template>
<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 0;
}
.app-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
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
