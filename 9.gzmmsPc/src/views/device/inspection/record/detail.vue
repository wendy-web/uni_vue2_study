<script setup lang="tsx">
import dayjs from "dayjs";
import type { FieldValues } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import {
  getInspecRecordApproveApi,
  getInspecRecordDetailApi,
  getInspecRecordRecallApi,
  getInspecRecordRejectApi,
  getInspecRecordSubmitApi,
} from "@/api/device/inspection/record/index";
import type { InspecRecordDetailData, ItemCountType } from "@/api/device/inspection/record/types";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useDetail } from "./utils/detail";
import { useList } from "./utils/hook";

const router = useRouter();
const route = useRoute();
const useSetting = useSettingsStoreHook();
const {
  columnsOne,
  columns,
  getInspecCycleName,
  rectifyDetailColumns,
  getRulePlanTime,
  getExecutiveRuleName,
} = useDetail();
const {
  checkAssocType,
  getStatusName,
  getTagType,
  submitFormData,
  submitVisible,
  submitColumns,
  submitRules,
} = useList();

const assoc_type = ref<number[]>([]);
const status = ref<number>(-1);
const dataLoading = ref(false);
const listId = ref(0);
const activeName = ref("first");
const detailData = ref<InspecRecordDetailData>();
const cycle_type = ref(-1);
const cycle_name = ref("");
const tableList = ref<any[]>([]);
const rectifList = ref<any[]>([]);
const img_info = ref<string[]>([]);
const sign = ref("");
const item_count = ref<ItemCountType>();

// 整改后图片
const rectifyPictureList = ref();
/** 编辑时获取详情数据 */
async function getDetailData() {
  dataLoading.value = true;
  const result = await getInspecRecordDetailApi({ id: listId.value });
  status.value = result.data.status;
  assoc_type.value = result.data.assoc_type;
  detailData.value = result.data;
  cycle_type.value = result.data.cycle_type;
  cycle_name.value = getInspecCycleName(result.data.cycle_type);
  tableList.value = changeDetail(result.data.item_arr);
  console.log("🚀 ~ getDetailData ~  tableList.value:",  tableList.value)
  rectifList.value = changeDetail(result.data.rectify_list);
  item_count.value = result.data.item_count;

  rectifyPictureList.value = result.data.rectify_picture.map((item) => useSetting.baseHttp + item);

  img_info.value = result.data.picture
    ? result.data.picture.map((item: string) => useSetting.baseHttp + item)
    : [];
  sign.value = result.data.sign ? useSetting.baseHttp + result.data.sign : "";
  dataLoading.value = false;
}

/** 转换一下详情返回的item_arr数据 */
function changeDetail(list: any[]) {
  let arr = list.map((item) => {
    let { result_content, record_method } = item;
    return {
      val: getResultContentIndex(result_content, record_method),
      ...item,
    };
  });
  return arr;
}
/** 获取index */
function getResultContentIndex(list: any[], record_method: number) {
  if (record_method === 0) {
    let findIndex = list.findIndex((item) => {
      return item.is_check;
    });
    return findIndex > -1 ? findIndex : undefined;
  } else if (record_method === 1) {
    let indexList = list.map((item, index) => (item.is_check ? index : "")).filter(String);
    return indexList;
  } else if ([2, 3].includes(record_method)) {
    return list[0].val;
  }
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/inspection/record",
  });
}
/** 点击编辑 */
function handleEdit() {
  router.push({
    path: "/device/inspection/record/add",
    query: {
      id: listId.value,
    },
  });
}

/** 点击提交验收 */
async function handleSubmit() {
  submitVisible.value = true;
  submitFormData.value.task_time_start = dayjs().format("YYYY-MM-DD HH:mm");
  submitFormData.value.task_time_end = detailData.value?.task_time_end ?? "";
  //   const reuslt = await getInspecRecordSubmitApi({ id: listId.value });
  //   ElMessage.success(reuslt.msg);
  //   getDetailData();
}

async function submitConfirm(values: FieldValues) {
  submitVisible.value = false;
  console.log("🚀 ~ submitConfirm ~ values:", values);
  const reuslt = await getInspecRecordSubmitApi({ id: listId.value, ...values });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击撤回 */
async function handleRecall() {
  const reuslt = await getInspecRecordRecallApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击验收通过 */
async function handleApprove() {
  const reuslt = await getInspecRecordApproveApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

/** 点击验收拒绝 */
async function handleReject() {
  const reuslt = await getInspecRecordRejectApi({ id: listId.value });
  ElMessage.success(reuslt.msg);
  getDetailData();
}

function warningCheckNumberValue(row: any) {
  let { val, upper_limit_val, lower_limit_val } = row;
  if (Number(val) > Number(upper_limit_val) || Number(val) < Number(lower_limit_val)) {
    return true;
  }
  return false;
}

onMounted(() => {
  listId.value = Number(route.query.id);
  if (listId.value) {
    getDetailData();
  }
});
// 检查信息
const columnsTwo: PlusColumnList = [
  {
    label: "计划执行时间",
    prop: "plan_start_time",
    renderDescriptionsItem: (value) => {
      let data = {
        rule_type: detailData.value?.executive_rule_type,
        start_time: detailData.value?.plan_start_time!,
        end_time: detailData.value?.plan_end_time!,
      };
      return <span>{getRulePlanTime(data)}</span>;
    },
  },
  {
    label: "执行时间规则",
    prop: "executive_rule_type",
    renderDescriptionsItem: (value) => {
      return <span>{getExecutiveRuleName(detailData.value?.executive_rule_type)}</span>;
    },
  },
  {
    label: "任务开始时间",
    prop: "task_time_start",
  },
  {
    label: "任务结束时间",
    prop: "task_time_end",
  },
  {
    label: "执行人",
    prop: "executor_user_text",
  },
  {
    label: "备注",
    prop: "note",
  },
];
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-loading="dataLoading">
      <div class="app-card-status">
        <el-tag :type="getTagType(status)" size="large">{{ getStatusName(status) }}</el-tag>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="点巡检记录详情" name="first">
          <el-card shadow="never" class="mb-6" header="设备信息   ">
            <PlusDescriptions :column="3" :columns="columnsOne" :data="detailData" />
          </el-card>
          <el-card shadow="never" class="mb-6" header="检查信息">
            <PlusDescriptions :column="3" :columns="columnsTwo" :data="detailData" />
          </el-card>
          <el-card shadow="never" class="mb-6" header="检查项目">
            <div class="mb-2 pl-2 font-bold">
              <span class="inline-block mr-4">循环周期</span>
              <span>{{ cycle_name }}</span>
            </div>
            <PureTable
              header-cell-class-name="table-gray-header"
              :data="tableList"
              :columns="columns"
            >
              <template #select="{ row, $index }">
                <div v-if="row.record_method === 0">
                  <!-- 如果是单选 -->
                  <el-radio-group v-model="row.val" class="ml-4" :disabled="true">
                    <el-radio :label="index" v-for="(item, index) in row.result_content">
                      <span :class="[item.is_check && item.is_normal ? '!text-orange-500' : '']">
                        {{ item.val }}
                      </span>
                    </el-radio>
                  </el-radio-group>
                </div>
                <div v-else-if="row.record_method === 1">
                  <!-- 如果是多选 -->
                  <el-checkbox-group v-model="row.val" :disabled="true">
                    <el-checkbox :label="index" v-for="(item, index) in row.result_content">
                      <span :class="[item.is_check && item.is_normal ? 'text-orange-600' : '']">
                        {{ item.val }}
                      </span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div v-else-if="row.record_method === 2">
                  <span :class="[warningCheckNumberValue(row) ? 'text-orange-600' : '']">
                    {{ row.val }}
                  </span>
                </div>
                <div v-else>
                  <span>
                    {{ row.val }}
                  </span>
                </div>
              </template>
            </PureTable>
            <ul class="flex justify-end mt-4 pr-[60px]">
              <li class="mr-4">
                <span>检查项目总数</span>
                <span class="font-bold inline-block ml-4 text-green-400">
                  {{ item_count?.count }}
                </span>
              </li>
              <li>
                <span>异常项</span>
                <span class="font-bold inline-block ml-4 text-red-400">
                  {{ item_count?.normal }}
                </span>
              </li>
            </ul>
          </el-card>
          <el-card shadow="never" class="mb-6" header="现场拍照图片">
            <template v-if="img_info.length > 0">
              <el-image
                :src="item"
                style="width: 140px; margin-right: 20px; border-radius: 6px"
                v-for="(item, index) in img_info"
                :key="index"
                :initial-index="index"
                :preview-src-list="img_info"
              />
            </template>
            <span v-else class="text-gray-400">暂无现场拍照图片~</span>

            <ul class="mt-4">
              <li class="py-2">
                <span class="text-gray-500">是否上报整改：</span>
                <span class="font-bold">
                  {{ detailData?.is_report_rectify === 1 ? "是" : "否" }}
                </span>
              </li>
              <li class="py-2">
                <span class="text-gray-500">整改问题：</span>
                <span class="font-bold">{{ detailData?.rectify_problem }}</span>
              </li>
              <li class="py-2">
                <span class="text-gray-500">整改负责人：</span>
                <span class="font-bold">{{ detailData?.rectify_uid_text }}</span>
              </li>
            </ul>
          </el-card>

          <el-card
            shadow="never"
            class="mb-6"
            header="整改情况"
            v-if="detailData?.is_report_rectify === 1"
          >
            <template v-if="detailData?.rectify_status === 1">
              <PureTable
                header-cell-class-name="table-gray-header"
                :data="rectifList"
                :columns="columns"
              >
                <template #select="{ row, $index }">
                  <div v-if="row.record_method === 0">
                    <!-- 如果是单选 -->
                    <el-radio-group v-model="row.val" class="ml-4" :disabled="true">
                      <el-radio :label="index" v-for="(item, index) in row.result_content">
                        <span :class="[item.is_check && item.is_normal ? '!text-orange-500' : '']">
                          {{ item.val }}
                        </span>
                      </el-radio>
                    </el-radio-group>
                  </div>
                  <div v-else-if="row.record_method === 1">
                    <!-- 如果是多选 -->
                    <el-checkbox-group v-model="row.val" :disabled="true">
                      <el-checkbox :label="index" v-for="(item, index) in row.result_content">
                        <span :class="[item.is_check && item.is_normal ? 'text-orange-600' : '']">
                          {{ item.val }}
                        </span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div v-else-if="row.record_method === 2">
                    <span :class="[warningCheckNumberValue(row) ? 'text-orange-600' : '']">
                      {{ row.val }}
                    </span>
                  </div>
                  <div v-else>
                    <span>
                      {{ row.val }}
                    </span>
                  </div>
                </template>
              </PureTable>
              <PlusDescriptions :column="2" :columns="rectifyDetailColumns" :data="detailData">
                <template #plus-desc-rectify_picture>
                  <el-image
                    :src="item"
                    style="width: 140px; margin-right: 20px; border-radius: 6px"
                    v-for="(item, index) in rectifyPictureList"
                    :key="index"
                    :initial-index="index"
                    :preview-src-list="rectifyPictureList"
                  />
                </template>
              </PlusDescriptions>
            </template>

            <span class="text-gray-400" v-else>暂无整改情况~</span>
          </el-card>
          <el-card shadow="never" class="mb-6" header="执行人签名">
            <el-image
              v-if="sign"
              :src="sign"
              style="width: 140px; margin-right: 20px; border-radius: 6px"
              :preview-src-list="[sign]"
            />
            <span v-else class="text-gray-400">暂无执行人签名~</span>
          </el-card>
          <DeviceApproveFlow
            :id="listId"
            :order-type="3"
            :type="3"
            :status="status"
          ></DeviceApproveFlow>
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
            v-hasPerm="['inspection:record:addedit']"
          >
            编辑
          </el-button>
          <el-button
            type="primary"
            class="w-[100px] mr-4"
            size="large"
            @click="handleSubmit"
            v-hasPerm="['inspection:record:submit']"
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
            v-hasPerm="['inspection:record:recall']"
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
            v-hasPerm="['inspection:record:approve']"
          >
            验收通过
          </el-button>
          <el-button
            class="w-[100px] mr-4"
            size="large"
            @click="handleReject"
            v-hasPerm="['inspection:record:reject']"
          >
            驳回返工
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
:deep(.el-radio__input.is-disabled.is-checked .el-radio__inner::after) {
  background-color: var(--el-color-primary);
  width: 8px;
  height: 8px;
}

/* 如果是使用 el-checkbox 而非 el-checkbox-button，样式会稍有不同 */
:deep(.el-checkbox.is-disabled.is-checked .el-checkbox__inner::after) {
  border-color: var(--el-color-primary);
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
