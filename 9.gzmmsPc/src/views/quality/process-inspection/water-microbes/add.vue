<script setup lang="ts">
import type { CollapseModelValue } from "element-plus";
import type { FormInstance, TabPaneName } from "element-plus";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import {
  waterMicrobesApproveApi,
  waterMicrobesDelApi,
  waterMicrobesDetailApi,
  waterMicrobesInfoInitApi,
  waterMicrobesRecallApi,
  waterMicrobesRejectApi,
  waterMicrobesReportApi,
  waterMicrobesReverseApi,
  waterMicrobesSaveApi,
  waterMicrobesSubmitApi,
} from "@/api/quality/process-inspection/water-microbes";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import FileTable from "@/views/quality/components/FileTable/index.vue";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

/* 水处理微生物列表页面-新建/编辑 */
defineOptions({
  name: "ProcessInspectionWaterMicrobesAdd",
});

enum ETitle {
  "新增水处理微生物检验报告" = 1,
  "编辑水处理微生物检验报告",
  "水处理微生物检验报告详情",
}

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  fileData,
  logList,
  sensesTableForm,
  microbeTableForm,
  pageType,
  baseRules,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  getUserOptions,
  sensesData,
  microbeData,
  sensesRules,
  sensesColumns,
  tasteOptions,
  microbeRules,
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

/** 附件自定义组件的ref */
const fileTableRef = ref<InstanceType<typeof FileTable>>();
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3", "4"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

/** 感官性状和一般化学指标数据-表格表单的ref */
const sensesTableFormRef = ref<FormInstance>();
/** 细菌指标-表格表单的ref   */
const microbeTableFormRef = ref<FormInstance>();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();
/** 用于记录checkinfo的id */
const checkinfo_id = ref(0);
/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/process-inspection/water-microbes",
  });
}

/** 点击删除 */
function handleDel() {
  let { order_no } = baseForm.value;
  ElMessageBox.confirm(`确认要删除单据编号为：【${order_no}】的该条内容吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("点击了 确定删除");
      const result = await waterMicrobesDelApi({ id: listId.value });
      ElMessage.success(result.msg);
      closeCurrentPage(result.msg);
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击签字复核 */
function handleRecheck() {
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
}

// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  // fileValues.status 2 通过 3 驳回
  let data = {
    id: listId.value, //单据id
    reviewer_user_signature: fileValues.status === 3 ? undefined : fileValues.file_url, //审核签字图片地址 驳回不需要
    reason: fileValues.note, //意见内容
    check_remark: fileValues.note,
  };
  console.log("🚀 ~ data:", data);
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result =
    fileValues.status == 3
      ? await waterMicrobesRejectApi(data)
      : await waterMicrobesApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await waterMicrobesRecallApi({ id: listId.value });
  ElMessage.success(result.msg);
  getDetailData();
}

/** 点击反审核 */
function handleReverse() {
  ElMessageBox.confirm(`确认要反审核该单据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const result = await waterMicrobesReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
function handleReport() {
  startDownloadUrl(waterMicrobesReportApi, { id: listId.value });
}

/** 点击保存
 * @param apiStatus 0保存 1提交
 */
async function handleSave(apiStatus = 0) {
  is_submit.value = false;
  // 保存需要验证基本信息表单的内容
  const vaildateRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateRes) return;

  let { order_no, order_status, ct_name, create_time, recheck_sign, ...rest } = baseForm.value;
  let file_list = fileTableRef.value!.getChangeFileData();

  let data = {
    ...rest,
    checkinfo: {
      id: checkinfo_id.value ? checkinfo_id.value : undefined,
      senses_json: sensesData.value,
      microbe_json: microbeData.value,
    },
    status: 0,
    files: file_list.length > 0 ? file_list : undefined,
  };
  console.log("🚀 ~~~.then ~ data:", data);
  let loadingText = apiStatus === 0 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  console.log("🚀 ~ handleSave ~ data:", data);
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  try {
    const result = listId.value
      ? await waterMicrobesSaveApi({ ...data, id: listId.value })
      : await waterMicrobesSaveApi(data);
    resultMsg = result.msg;
    if (apiStatus === 1) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        operation_sign: baseForm.value.operation_sign,
      };
      const submitResult = await waterMicrobesSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

/** 弹窗提示关闭当前页面回到列表页面 */
function closeCurrentPage(resultMsg: string) {
  ElMessageBox.confirm(`${resultMsg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/process-inspection/water-microbes",
    });
    tagsViewStore.delView(currentTag);
  });
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;
  // if (!tableData.value.length) {
  //   ElMessage.warning("请先填写检验信息数据");
  //   return;
  // }

  const vaildateBaseRes = await baseFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          baseFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateBaseRes) return;

  const vaildateSensesRes = await sensesTableFormRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          sensesTableFormRef.value?.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateSensesRes) return;

  const vaildateMicrobeRes = await microbeTableFormRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          microbeTableFormRef.value?.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildateMicrobeRes) return;

  showSubmitDialog(3);
}

function showSubmitDialog(signType: number) {
  let singTitleList = ["", "检验员1签名", "检验员2签名", "签名提交"];
  let singTitle = singTitleList[signType];
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: singTitle,
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      baseForm.value.operation_sign = result;
      updateDialog(false, "btnLoading");
      done();

      handleSave(1);
    },
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await waterMicrobesDetailApi({ id: listId.value });
  const res = result.data;
  // assoc_type.value = res.assoc_type;
  fileData.value = res.files;
  logList.value = res.logs;

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除

  baseForm.value.smaple_user_id = res.smaple_user_id; //取样人id
  baseForm.value.smaple_user_name = res.smaple_user_name; //取样人名称
  baseForm.value.smaple_date = res.smaple_date; //取样日期
  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.assist_user_id = res.assist_user_id; //内助人id
  baseForm.value.assist_user_name = res.assist_user_name; //内助人名称
  baseForm.value.operation_user_id = res.operation_user_id; //操作员id
  baseForm.value.operation_user_name = res.operation_user_name; //操作员id
  baseForm.value.check_method = res.check_method;

  baseForm.value.remark = res.remark; //备注
  checkinfo_id.value = res.checkinfo.id;
  sensesData.value = res.checkinfo.senses_json;
  microbeData.value = res.checkinfo.microbe_json;
  // tableData.value = res.checkinfo;
  if (pageType.value === 3) {
    baseForm.value.operation_sign = res.operation_sign ?? "";
    baseForm.value.recheck_sign = res.recheck
      ? res.recheck.map((item: any) => item.recheck_sign).join(",")
      : "";
  }

  detailLoading.value = false;
}

async function getInitData() {
  const result = await waterMicrobesInfoInitApi();
  sensesData.value = result.data.senses_json;
  microbeData.value = result.data.microbe_json;
}

const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assoc_type.value = route.query.assocType ? JSON.parse(route.query.assocType as string) : [];
  initTagsView();
  getUserOptions();
  if (listId.value) {
    getDetailData();
  } else {
    getInitData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container !pt-0" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="29"
      v-on="{
        cancel: handleCancel,
        save: handleSave,
        submit: handleSubmit,
        recheck: handleRecheck,
        recall: hanleRecall,
        reverse: handleReverse,
        delete: handleDel,
        report: handleReport,
      }"
    ></AffixButton>
    <el-tabs v-model="activeName" @tab-change="handleClick">
      <el-tab-pane label="单据内容" name="first">
        <el-collapse v-model="activeNames" class="mt-2">
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="isDetailDisable"
                ref="PlusFormRef"
                :rules="baseRules"
                v-model="baseForm"
                labelWidth="90"
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">取样检验步骤</p>
            </template>
            <ul class="px-8">
              <li>
                <span class="font-bold text-sky-700">取样步骤：</span>
                <span>
                  ①化验员提前将所需数量的取样瓶于高压灭菌锅中121℃下灭菌15分钟，待用。②带上点火器、75%酒精、棉花、小烧杯、镊子、酒精喷壶等取样物品前往制水车间或配料水质取样点处。③打开取水口排水3-5min后，关闭取水口，点燃蘸取酒精的棉球，用外焰烧取水口1min，再次打开取水口排水2-3min，用75%酒精进行手部杀菌后，拧开取样瓶盖，取水样约400mL，盖上瓶盖，关闭取水口，并在取样瓶上注明取水点。④按照以上的步骤取完所有检测点的水样。
                </span>
              </li>
              <li>
                <span class="font-bold text-sky-700">检测步骤：</span>
                <span>
                  ①将待测水样拿至化验室微生物检测室按成品微生物的测定（滤膜法）进行检测，每样品做3组(每组100mL)。②取检测完微生物的水样进行检测pH（25℃）、电导率、原水色度，并目测水样的感官。
                </span>
              </li>
            </ul>
          </el-collapse-item>
          <!-- 感官性状和一般化学指标 -->
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">感官性状和一般化学指标</p>
            </template>
            <div class="px-8">
              <el-form :model="sensesTableForm" ref="sensesTableFormRef">
                <PureTable
                  border
                  :columns="sensesColumns"
                  :data="sensesData"
                  :adaptive-config="{
                    fixHeader: true,
                  }"
                >
                  <!-- RO水一级 -->
                  <template #ro_water1="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.ro_water1`"
                      :rules="sensesRules.ro_water1"
                    >
                      <el-input
                        v-model.lazy="row.ro_water1"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- RO水二级 -->
                  <template #ro_water2="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.ro_water2`"
                      :rules="sensesRules.ro_water2"
                    >
                      <el-input
                        v-model.lazy="row.ro_water2"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 储水A -->
                  <template #water_a="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.water_a`"
                      :rules="sensesRules.water_a"
                    >
                      <el-input
                        v-model.lazy="row.water_a"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 储水B -->
                  <template #water_b="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.water_b`"
                      :rules="sensesRules.water_b"
                    >
                      <el-input
                        v-model.lazy="row.water_b"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 杀菌后RO水 -->
                  <template #room_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.room_ro_water`"
                      :rules="sensesRules.room_ro_water"
                    >
                      <el-input
                        v-model.lazy="row.room_ro_water"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- 配料杀菌后RO水 -->
                  <template #ingredients_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.ingredients_ro_water`"
                      :rules="sensesRules.ingredients_ro_water"
                    >
                      <el-input
                        v-model.lazy="row.ingredients_ro_water"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                  <!-- CTRO水 -->
                  <template #ct_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`sensesData.${$index}.ct_ro_water`"
                      :rules="sensesRules.ct_ro_water"
                    >
                      <el-input
                        v-model.lazy="row.ct_ro_water"
                        placeholder="请输入"
                        :disabled="isDetailDisable"
                      ></el-input>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">细菌指标</p>
            </template>
            <div class="px-8">
              <el-form :model="microbeTableForm" ref="microbeTableFormRef">
                <PureTable
                  border
                  :columns="sensesColumns"
                  :data="microbeData"
                  :adaptive-config="{
                    fixHeader: true,
                  }"
                >
                  <!-- RO水一级 -->
                  <template #ro_water1="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.ro_water1`"
                      :rules="microbeRules.ro_water1"
                    >
                      <el-select v-model="row.ro_water1" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择RO水二级 -->
                  <template #ro_water2="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.ro_water2`"
                      :rules="microbeRules.ro_water2"
                    >
                      <el-select v-model="row.ro_water2" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择储水A -->
                  <template #water_a="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.water_a`"
                      :rules="microbeRules.water_a"
                    >
                      <el-select v-model="row.water_a" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择储水B -->
                  <template #water_b="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.water_b`"
                      :rules="microbeRules.water_b"
                    >
                      <el-select v-model="row.water_b" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择杀菌后RO水 -->
                  <template #room_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.room_ro_water`"
                      :rules="microbeRules.room_ro_water"
                    >
                      <el-select v-model="row.room_ro_water" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择配料杀菌后RO水 -->
                  <template #ingredients_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.ingredients_ro_water`"
                      :rules="microbeRules.ingredients_ro_water"
                    >
                      <el-select v-model="row.ingredients_ro_water" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <!-- 请选择配料杀菌后RO水 -->
                  <template #ct_ro_water="{ row, $index }">
                    <el-form-item
                      :prop="`microbeData.${$index}.ct_ro_water`"
                      :rules="microbeRules.ct_ro_water"
                    >
                      <el-select v-model="row.ct_ro_water" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.label"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="5" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <FileTable
              :fileList="fileData"
              :disabled="isDetailDisable"
              ref="fileTableRef"
            ></FileTable>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second" v-if="isDetailDisable">
        <OrderLog :log-list="logList"></OrderLog>
      </el-tab-pane>
    </el-tabs>
    <!-- 签字复核组件 -->
    <RecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></RecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/collapse.scss";
@import "@/styles/common.scss";
:deep(.el-tabs__header) {
  margin-bottom: 0;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #fff;
}
:deep(.el-table .el-table__cell) {
  padding: 4px 0;
}
</style>
