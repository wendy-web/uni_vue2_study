<script setup lang="ts">
import type { CollapseModelValue, FormInstance, TabPaneName } from "element-plus";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
// 引入內涂膜详情接口
import {
  commitAcceptOrderApi,
  countertrialApi,
  deleteOrderApi,
  finishOrderApi,
  getInfoApi,
  makeReportApi,
  rejectOrderApi,
  revokeOrderApi,
  saveOrderApi,
} from "@/api/quality/material-inspection/inner-film/index";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
// 复核签名+备注组件
import QualityRecheckSign from "@/views/quality/components/RecheckSign/index.vue";
// 引入订单操作按钮
import AffixButton from "@/views/quality/components/affixButton.vue";
import checkInfo from "./components/checkInfo.vue";
import fileInfo from "./components/fileInfo.vue";
import logInfo from "./components/logInfo.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

/* 新增内涂膜检验报告页面 */
defineOptions({
  name: "MaterialInspectionInnerFilmmAdd",
});
enum ETitle {
  "新建内涂膜检验报告" = 1,
  "编辑内涂膜检验报告",
  "内涂膜检验报告详情",
}
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();
const activeName = ref("first");
function tabChange(name: TabPaneName) {
  activeName.value = name as string;
}
const {
  pageType,
  editDisabled,
  formData,
  formColumns,
  formRules,
  initBaseData,
  initTableClumns,
  checkTablecolumns,
  checkTableForm,
  checkFormRules,
  checkTableData,
  handleAdd,
  handleDelRow,
  errorCountMap,
  checkUserOptions,
  cellColumns,
  supplyOptions,
  suppliersMap,
  otherCheckForm,
  otherTableData,
  otherTableColumns,
  passList,
  versionOptions,
  transformedCheckJson,
  fileColumns,
  is_submit,
  otherRules,
  tableLableOptions,
  validatorTableRow,
} = useAdd();
/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref(0);
/** 身份标识数组--重要! */
const assocType = ref<number[]>([]);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const formLoading = ref(false);
/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
// 页面加载状态
const pageLoading = ref(false);
const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};
const useSetting = useSettingsStoreHook();
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

// 检验信息组件ref
const checkInfoRef = ref<InstanceType<typeof checkInfo>>();
// 其他检验ref
const otherCheckFormRef = ref<FormInstance>();
// 签名提交
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
// 复核签名列表
const recheck_img_list = ref<string[]>([]);

const signDialogRef = ref();
// 折叠面板切换
const handleChange = (val: CollapseModelValue) => {
  // console.log(val);
};
/** 点击取消 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/empty-cans/inner-film",
  });
}
/** 点击保存
 * @param type 1保存 2提交
 */
async function handleSave(type = 1) {
  console.log("点击保存formData.value: ", formData.value);
  is_submit.value = checkTableData.value.length > 0 ? true : false;
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

  // 保存时,需要验证一下包号字段
  let checkinfoValidateRes = true;
  if (is_submit.value) {
    checkinfoValidateRes = validatorTableRow(1);
  }
  // console.log("checkTableData", checkTableData.value);
  // console.log("🚀 ~ handleSave ~ checkinfoValidateRes:", checkinfoValidateRes);
  if (!checkinfoValidateRes) return;
  let checkinfo = getcheckInfo();
  let data = { ...formData.value, checkinfo, ...otherCheckForm.value };
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  let resultMsg = "";
  try {
    const result = listId.value
      ? await saveOrderApi({ ...data, id: listId.value })
      : await saveOrderApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: formData.value.check_ret,
        check_sign: formData.value.check_sign,
      };
      const submitResult = await commitAcceptOrderApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    handleBack(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}
// 签字提交
async function handleSubmit() {
  is_submit.value = true;
  // 先验证基本信息
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
  if (!checkTableData.value.length) {
    ElMessage.warning("请先填写检验信息");
    return;
  }

  let { check_ret } = formData.value;
  console.log("🚀 ~ handleSubmit ~ check_ret:", check_ret);
  if (check_ret === null || check_ret === undefined) {
    ElMessage.warning("请先填写检验结果");
    return;
  }

  // 校验检验信息
  let checkinfoValidateRes = true;
  if (is_submit.value) {
    checkinfoValidateRes = validatorTableRow(1);
  }
  if (!checkinfoValidateRes) return;
  // 验证其他检验
  let otherValidateRes = await otherCheckFormRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          otherCheckFormRef.value!.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  console.log("otherValidateRes", otherValidateRes);
  if (!otherValidateRes) return;

  // let checkinfoValidateRes = await checkInfoRef.value!.validateForm();
  // console.log("🚀 ~ handleSubmit ~ checkinfoValidateRes:", checkinfoValidateRes);
  // if (!checkinfoValidateRes) return;

  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(QualitySignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();

      // 更新签名地址
      formData.value.check_sign = result;
      // formData.value.status = 1; // 待审核
      handleSave(2);
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
// 签字复核
async function handleRecheck() {
  console.log("签字复核");
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
}
// 撤回
async function handleRecall() {
  let data: any = {
    id: listId.value,
  };
  let result = await revokeOrderApi(data);
  handleBack(result.msg);
}
// 反审核
async function handleReverse() {
  ElMessageBox.prompt("请填写反审核理由", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async ({ value }) => {
      let data: any = {
        id: listId.value,
        reason: value,
      };
      let result = await countertrialApi(data);
      handleBack(result.msg);
    })
    .catch(() => {});
}
// 删除：暂存状态才可删除
async function handleDelete() {
  let data: any = {
    id: listId.value,
  };
  let result = await deleteOrderApi(data);
  handleBack(result.msg);
}
// 生成报告
async function handleReport() {
  let data: any = {
    id: listId.value,
  };
  startDownloadUrl(makeReportApi, data);
}
// 签字复核
const recheckSignRef = ref<InstanceType<typeof QualityRecheckSign>>();
const recheckSignVisible = ref(false);
// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  let data: any = {
    id: listId.value,
    recheck_sign: fileValues.file_url,
    check_remark: fileValues.note,
  };
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result = fileValues.status == 3 ? await rejectOrderApi(data) : await finishOrderApi(data);
  handleBack(result.msg);
};

// 操作按钮上绑定的变量
// const affixBtnData = reactive({
//   status: formData.value.status,
//   assocType: assocType.value,
//   pageType,
// });
const affixBtnData = computed(() => {
  return {
    status: formData.value.status,
    assocType: assocType.value,
    pageType: pageType.value,
  };
});

// // 操作按钮上绑定的方法
const affixBtnEvent = {
  cancel: handleCancel,
  save: handleSave,
  submit: handleSubmit,
  recheck: handleRecheck,
  recall: handleRecall,
  reverse: handleReverse,
  delete: handleDelete,
  report: handleReport,
};

// /** 监听表单的变化 */
const handleFormChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  // 修改产品类型
  if (["sku"].includes(prop) && values[prop]) {
    initTableClumns({ sku: values["sku"], oid: listId.value });
  }
  // 修改版本
  if (["version_id"].includes(prop) && values[prop]) {
    // 查找检验员名称
    const findItem: any = versionOptions.value?.find((item: any) => item.value === values[prop]);
    console.log("findItem:", findItem);
    formData.value.version_name = findItem?.label;
  }
  // 修改检验员
  if (["check_user_id"].includes(prop) && values[prop]) {
    // 查找检验员名称
    const matchingCheckUser: any = checkUserOptions.value?.find(
      (item) => item.value === values[prop],
    );
    console.log("matchingCheckUser:", matchingCheckUser);
    formData.value.check_user_name = matchingCheckUser?.label;
  }
};
// 表格新增行
const tableAdd = async () => {
  is_submit.value = checkTableData.value.length > 0 ? true : false;
  // 保存时,需要验证一下包号字段
  let checkinfoValidateRes = true;
  if (is_submit.value) {
    checkinfoValidateRes = validatorTableRow(0);
  }
  if (!checkinfoValidateRes) return;
  handleAdd();
};
// 操作按钮上绑定的变量
const checkInfoData = reactive({
  checkTablecolumns,
  checkFormRules,
  formData,
  checkTableForm,
  checkTableData,
  formLoading,
  cellColumns,
  supplyOptions,
  suppliersMap,
  editDisabled,
  tableLableOptions,
});

// // 操作按钮上绑定的方法
const checkInfoEvent = {
  handleAdd: tableAdd,
  handleDelRow: handleDelRow,
  changeCheckRes: changeCheckRes,
};
function changeCheckRes(checkRes: number) {
  // console.log("🚀 ~ changeCheckRes ~ checkRes:", checkRes)
  formData.value.check_ret = checkRes;
}

function getcheckInfo() {
  if (!listId.value) {
    return checkTableData.value?.length > 0
      ? checkTableData.value.map((item) => {
          let { unique_id, ...rest } = item;
          return {
            ...rest,
          };
        })
      : undefined;
  } else {
    return checkTableData.value?.length > 0
      ? checkTableData.value.map((item) => {
          let { unique_id, ...rest } = item;
          return typeof unique_id === "string" ? { ...rest } : item;
        })
      : undefined;
  }
}
// 操作成功返回列表
const handleBack = (msg: string) => {
  ElMessageBox.confirm(`${msg},请回到列表页面查看~`, "温馨提示", {
    confirmButtonText: "好的,我知道了",
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    type: "success",
  }).then(() => {
    const currentTag = router.currentRoute.value;
    router.replace({
      path: "/quality/material-inspection/empty-cans/inner-film",
    });
    tagsViewStore.delView(currentTag);
  });
};
async function getDetailData() {
  formLoading.value = true;
  const result = await getInfoApi({ id: listId.value });
  const res = result.data;
  formData.value.abnormal = res.abnormal;
  formData.value.batch_no = res.batch_no;
  formData.value.brand = res.brand;
  formData.value.brand_name = res.brand_name;
  formData.value.check_date = res.check_date;
  formData.value.check_remark = res.check_remark;
  formData.value.check_ret = res.check_ret;
  formData.value.check_ret_text = res.check_ret_text;
  formData.value.check_sign = res.check_sign;
  formData.value.check_user_id = res.check_user_id;
  formData.value.check_user_name = res.check_user_name;
  let checkinfo = res.checkinfo || [];

  checkinfo.forEach((item: any) => {
    item.check_json = transformedCheckJson(item.check_json);
  });
  checkTableData.value = checkinfo;

  formData.value.create_time = res.create_time;
  formData.value.ct_name = res.ct_name;
  formData.value.ct_uid = res.ct_uid;
  formData.value.dept_id = res.dept_id;

  formData.value.files = res.files;
  formData.value.line_id = res.line_id;
  formData.value.line_text = res.line_text;
  formData.value.logs = res.logs;

  formData.value.order_no = res.order_no;
  formData.value.reagent_id = res.reagent_id;
  formData.value.reagent_text = res.reagent_text;
  formData.value.recheck = res.recheck;
  formData.value.remark = res.remark;
  formData.value.sample_date = res.sample_date;
  formData.value.size_id = res.size_id;
  formData.value.size_text = res.size_text;
  formData.value.sku = res.sku;
  formData.value.sku_name = res.sku_name;
  formData.value.status = res.status;
  formData.value.supplier_id = res.supplier_id;
  formData.value.supplier_name = res.supplier_name;
  formData.value.total = res.total;
  // formData.value.up_name = res.up_name;
  // formData.value.up_uid = res.up_uid;
  // formData.value.update_time = res.update_time;
  formData.value.version_id = res.version_id;
  formData.value.version_name = res.version_name;

  otherCheckForm.value.weld_seam_ret = res.weld_seam_ret;
  otherCheckForm.value.electric_ret = res.electric_ret;
  otherCheckForm.value.code_ret = res.code_ret;
  otherCheckForm.value.end_ret = res.end_ret;
  otherCheckForm.value.open_ret = res.open_ret;
  formLoading.value = false;

  // 更新表头信息
  await initTableClumns({ sku: formData.value.sku, oid: res.id });

  nextTick(async () => {
    let initCheckInfoRef = checkInfoRef.value as any;
    if (initCheckInfoRef.validateForm && !editDisabled.value) {
      await initCheckInfoRef.validateForm();
    }
  });
  // console.log("🚀 ~ getDetailData ~ formData.value:", formData.value);
}
watch(
  () => checkTableData.value,
  (newValue) => {
    if (newValue?.length > 0) {
      formData.value.total = checkTableData.value?.length;
      // console.log("watch checkTableData: ", checkTableData.value);
    }
  },
  {
    deep: true,
  },
);
watch(
  () => errorCountMap.value,
  (newValue) => {
    // console.log("watch errorCountMap: ", errorCountMap.value);
    formData.value.abnormal = errorCountMap.value.size;
  },
  {
    immediate: true,
    deep: true,
  },
);
onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assocType.value = [Number(route.query.assocType)];
  initTagsView();
  initBaseData();
  if (listId.value) {
    console.log("编辑id:", listId.value);
    getDetailData();
    return;
  }
  initTableClumns({ sku: formData.value.sku });
});
</script>
<template>
  <div class="app-container">
    <AffixButton v-bind="affixBtnData" v-on="affixBtnEvent" :order-type="1"></AffixButton>
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="详情信息" name="first">
        <el-collapse v-model="activeNames" @change="handleChange" v-loading="pageLoading">
          <!-- 基础信息 -->
          <el-collapse-item name="1">
            <template #title>
              <p class="font-bold text-[14px]">基础信息</p>
            </template>
            <div class="px-8">
              <PlusForm
                :disabled="pageType === 3"
                ref="PlusFormRef"
                v-model="formData"
                labelWidth="90px"
                labelPosition="right"
                :columns="formColumns"
                :rules="formRules"
                :colProps="{ span: 6 }"
                :row-props="{ gutter: 10 }"
                :hasFooter="false"
                @change="handleFormChange"
                v-loading="formLoading"
              >
                <!-- 检验员签名 -->
                <template #plus-field-check_sign>
                  <el-image
                    :class="'w-[50px] h-[30px]'"
                    :src="useSetting.baseHttp + formData.check_sign"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="[useSetting.baseHttp + formData.check_sign]"
                    :initial-index="4"
                    fit="contain"
                  >
                    <template #error>
                      <span>——</span>
                    </template>
                  </el-image>
                </template>
                <!-- 复核员签名 -->
                <template #plus-field-recheck>
                  <div class="flex flex-wrap">
                    <el-image
                      :class="'w-[40px] h-[30px]'"
                      :src="item"
                      style="width: 140px; margin-right: 20px; border-radius: 6px"
                      v-for="(item, index) in recheck_img_list"
                      :key="index"
                      :preview-src-list="recheck_img_list"
                      :initial-index="index"
                      fit="contain"
                    />
                  </div>
                </template>
              </PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <checkInfo
                ref="checkInfoRef"
                :is_submit="is_submit"
                v-bind="checkInfoData"
                v-on="checkInfoEvent"
              />
            </div>
          </el-collapse-item>
          <!-- 其他检验 -->
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">其他检验</p>
            </template>
            <div class="px-8">
              <el-form
                :model="otherCheckForm"
                ref="otherCheckFormRef"
                :disabled="editDisabled"
                :rules="otherRules"
              >
                <div class="inline-block">
                  <PureTable
                    ref="prueTableRef"
                    row-key="id"
                    header-cell-class-name="table-row-header"
                    alignWhole="center"
                    :data="otherTableData"
                    :columns="otherTableColumns"
                    :loading="formLoading"
                    :fit="false"
                    border
                  >
                    <!-- 焊缝完整性实验检测 -->
                    <template #weld_seam_ret="{ row, $index }">
                      <div class="flex justify-center pt-[18px]">
                        <el-form-item prop="weld_seam_ret">
                          <el-select
                            v-model="otherCheckForm.weld_seam_ret"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option
                              v-for="item in passList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                    </template>
                    <!-- 电流检测结果 -->
                    <template #electric_ret="{ row, $index }">
                      <div class="flex justify-center pt-[18px]">
                        <el-form-item prop="electric_ret">
                          <el-select
                            v-model="otherCheckForm.electric_ret"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option
                              v-for="item in passList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                    </template>
                    <!-- 墨码检测结果（普通型） -->
                    <template #code_ret="{ row, $index }">
                      <div class="flex justify-center pt-[18px]">
                        <el-form-item prop="code_ret">
                          <el-select
                            v-model="otherCheckForm.code_ret"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option
                              v-for="item in passList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                    </template>
                    <!-- 底盖蓝底检测结果（普通型） -->
                    <template #end_ret="{ row, $index }">
                      <div class="flex justify-center pt-[18px]">
                        <el-form-item prop="end_ret">
                          <el-select
                            v-model="otherCheckForm.end_ret"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option
                              v-for="item in passList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                    </template>
                    <!-- 启破力检测结果（强化型） -->
                    <template #open_ret="{ row, $index }">
                      <div class="flex justify-center pt-[18px]">
                        <el-form-item prop="open_ret">
                          <el-select
                            v-model="otherCheckForm.open_ret"
                            placeholder="请选择"
                            filterable
                          >
                            <el-option
                              v-for="item in passList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id"
                            />
                          </el-select>
                        </el-form-item>
                      </div>
                    </template>
                  </PureTable>
                </div>
              </el-form>
            </div>
          </el-collapse-item>
          <!-- 附件信息 -->
          <el-collapse-item name="4" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">附件信息</p>
            </template>
            <div class="px-8">
              <fileInfo
                :fileColumns="fileColumns"
                :formData="formData"
                :editDisabled="editDisabled"
              />
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="单据日志" name="second">
        <logInfo :logList="formData.logs" />
      </el-tab-pane>
    </el-tabs>
    <!-- 签字复核组件 -->
    <QualityRecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></QualityRecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
</style>
