<script setup lang="ts">
import type { FormInstance, FormRules, TabPaneName } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
// 引入获取表头
import { QualityCommonModule, SelectStringOpions } from "@/api/quality/common/types";
// 引入空罐卷封检验单详情|编辑|审核|撤回|删除|···api
import {
  commitEmptypotApi,
  countertrialApi,
  delEmptypotApi,
  finishEmptypotApi,
  getEmptypotInfoApi,
  makeReportApi,
  rejectEmptypotApi,
  revokeEmptypotApi,
  saveEmptypotApi,
} from "@/api/quality/material-inspection/cans-seam/index";
import { CansSeamModule } from "@/api/quality/material-inspection/cans-seam/types";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { useTagsViewStore } from "@/store/modules/tagsView";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
// 引入订单操作按钮
import AffixButton from "@/views/quality/components/affixButton.vue";
import checkInfo from "./components/checkInfo.vue";
import fileInfo from "./components/fileInfo.vue";
import logInfo from "./components/logInfo.vue";
import { useAdd } from "./utils/add";

const { startDownloadUrl } = useCommonHooks();

/* 新增空罐卷封检验报告页面 */
defineOptions({
  name: "MaterialInspectionCansSeamAdd",
});
enum ETitle {
  "新建空罐卷封检验报告" = 1,
  "编辑空罐卷封检验报告",
  "空罐卷封检验报告详情",
}
/** 身份标识数组--重要! */
const assocType = ref<number[]>([]);
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const useSetting = useSettingsStoreHook();
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
  tabList,
  initEmptyOrderBaseData,
  EmptyOrderBaseData,
  initTableClumns,
  checkTablecolumns,
  checkTableForm,
  checkFormRules,
  checkTableData,
  handleAdd,
  handleDelRow,
  updateBatchNo,
  errorCountMap,
  fileColumns,
  checkUserOptions,
  is_submit,
  abnormalNum,
  tableLableOptions,
} = useAdd();

const listId = ref(0);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const PlusFormRef = ref();
const formLoading = ref(false);
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});

// 检验信息组件ref
const checkInfoRef = ref<InstanceType<typeof checkInfo>>();


function changeCheckRes(checkRes: number){
  // console.log("🚀 ~ changeCheckRes ~ checkRes:", checkRes)
  formData.value.check_ret = checkRes;
}


// /** 监听表单的变化 */
const handleChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  // 修改生产批号
  if (prop === "batch_no") {
    let { batch_no } = values;
    // 修改了生产批号需要同步给检验表格
    if (batch_no) {
      updateBatchNo(batch_no);
    }
  }
  // 修改产品类型
  if (["sku"].includes(prop) && values[prop]) {
    initTableClumns({ sku: values["sku"], oid: listId.value });
  }
  // 修改产品大类
  if (["brand"].includes(prop) && values[prop]) {
    // 切换产品大类,默认选中第一个sku
    initTableClumns({ sku: `${values["brand"]}-1`, oid: listId.value });

    let brandChild: SelectStringOpions[] = [];
    const matchingBrand = EmptyOrderBaseData.value?.brand_data.find(
      (item: QualityCommonModule.BrandDaum) => item.id === values[prop],
    );
    if (matchingBrand) {
      brandChild = matchingBrand.child;
      console.log("brandChild:", brandChild);
      formData.value.sku = brandChild[0].id;
    }
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
/** 点击保存
 * @param type 1保存 2提交
 */
const handleSave = async (type = 1) => {
  // 点击签字提交时,设为了true,保存取消设为false
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

  // 保存时,需要验证一下包号字段
  let fieldList = checkTableData.value.map((item, index) => `checkTableData.${index}.pack_no`);
  let checkinfoValidateRes = await checkInfoRef.value!.tableFormRef?.validateField(fieldList);
  console.log("🚀 ~ handleSave ~ checkinfoValidateRes:", checkinfoValidateRes);

  if (!checkinfoValidateRes) return;

  let initCheckInfoRef = (checkInfoRef.value as any)[0];
  // console.log("子组件:",initCheckInfoRef.tableFormRef.validate);
  let {
    id,
    batch_no,
    brand,
    sku,
    check_date,
    check_user_id,
    check_user_name,
    status,
    remark,
    abnormal,
    total,
    checkinfo,
    files,
    logs,
    check_sign,
    check_ret,
  } = formData.value;
  let checkinfoList = checkTableData.value.map((item: CansSeamModule.Checkinfo) => {
    let params: any = {
      ...item,
    };
    delete params["unique_id"];
    // 暂时所有数据都提交
    return params;
  });
  let data: any = {
    batch_no,
    brand,
    sku,
    check_date,
    check_user_id,
    check_user_name,
    status,
    remark,
    abnormal,
    total,
    checkinfo: checkinfoList,
    files,
    logs,
    check_sign,
    check_ret,
  };
  if (id) {
    data.id = id;
  }
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("submit data!:::", data);
  try {
    let result = await saveEmptypotApi(data);
    resultMsg = result.msg;
    if (result.code == 1) {
      formData.value.id = result.data.id;
    }
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_ret: formData.value.check_ret,
        check_sign: formData.value.check_sign,
      };
      const submitResult = await commitEmptypotApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    handleBack(resultMsg);
  } catch (error) {
    sendLoading.close();
  }

  // initCheckInfoRef.tableFormRef.validate(async (valid: boolean) => {
  //   if (valid) {

  //   } else {
  //     console.log("error submit!");
  //   }
  // });
};

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
// 检验员签名提交：需要判定是否填写 检验结果 0 不及格 1及格
const handleSubmit = async () => {
  console.log("checkTableData.value", checkTableData.value);
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
  is_submit.value = true;
  console.log("checkInfoRef.value", checkInfoRef.value);

  let checkinfoValidateRes = await checkInfoRef.value!.validateForm();
  console.log("🚀 ~ handleSubmit ~ checkinfoValidateRes:", checkinfoValidateRes);
  if (!checkinfoValidateRes) return;

  addDialog({
    ...dialogOptions,
    title: "签名",
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
      // 更新签名地址
      formData.value.check_sign = result;
      // formData.value.status = 1; // 待审核
      handleSave(2);
      updateDialog(false, "btnLoading");
      done();
    },
  });
};
// 签字复核
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);
// 复核签字组件回调
const handleRecheckSignConfirm = async (fileValues: {
  file_url: string;
  note: string;
  status: number;
}) => {
  let data: any = {
    id: formData.value.id,
    recheck_sign: fileValues.file_url,
    check_remark: fileValues.note,
  };
  // 根据 status 请求不同接口：2 通过 3 驳回
  const result =
    fileValues.status == 3 ? await rejectEmptypotApi(data) : await finishEmptypotApi(data);
  handleBack(result.msg);
};
// 打开复核签名弹窗
const handleRecheck = () => {
  recheckSignVisible.value = true;
  recheckSignRef.value?.resetValues();
};
// 撤回操作
const handleRecall = async () => {
  let data: any = {
    id: formData.value.id,
  };
  let result = await revokeEmptypotApi(data);
  handleBack(result.msg);
};
// 反审核
const handleReverse = async () => {
  ElMessageBox.prompt("请填写反审核理由", "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async ({ value }) => {
      let data: any = {
        id: formData.value.id,
        reason: value,
      };
      let result = await countertrialApi(data);
      handleBack(result.msg);
    })
    .catch(() => {});
};
// 删除操作
const handleDelete = async () => {
  let data: any = {
    id: formData.value.id,
  };
  let result = await delEmptypotApi(data);
  handleBack(result.msg);
};
// 生成报告
const handleReport = async () => {
  let data: any = {
    id: formData.value.id,
  };
  startDownloadUrl(makeReportApi, data);
};
/** 点击取消 */
function handleCancel() {
  router.replace({
    path: "/quality/material-inspection/empty-cans/cans-seam",
  });
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
      path: "/quality/material-inspection/empty-cans/cans-seam",
    });
    tagsViewStore.delView(currentTag);
  });
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

// 操作按钮上绑定的方法
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
/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
watch(
  () => checkTableData.value,
  (newValue) => {
    formData.value.total = checkTableData.value.length;
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
// 获取详情
async function getEditData() {
  try {
    formLoading.value = true;
    const result = await getEmptypotInfoApi({ id: listId.value });
    let data = result.data;
    formData.value.id = data.id;
    formData.value.batch_no = data.batch_no;
    formData.value.brand = data.brand;
    formData.value.sku = data.sku;
    formData.value.check_date = data.check_date;
    formData.value.check_user_id = data.check_user_id;
    formData.value.check_user_name = data.check_user_name;
    formData.value.ct_name = data.ct_name;
    formData.value.create_time = data.create_time;
    formData.value.remark = data.remark;
    formData.value.abnormal = data.abnormal;
    formData.value.total = data.total;
    formData.value.files = data.files;
    formData.value.logs = data.logs;
    formData.value.check_sign = data.check_sign;
    formData.value.recheck = data.recheck;
    formData.value.status = data.status;
    formData.value.check_ret = data.check_ret;
    formData.value.order_no = data.order_no;
    data.checkinfo.forEach((item: CansSeamModule.Checkinfo) => {
      item.bule_dots = Number(item.bule_dots);
    });
    checkTableData.value = data.checkinfo;
    recheck_img_list.value = data.recheck
      ? data.recheck.map((item) => useSetting.baseHttp + item.recheck_sign)
      : [];
    // 更新表头信息
    await initTableClumns({ sku: formData.value.sku, oid: data.id });
    formLoading.value = false;

    let initCheckInfoRef = checkInfoRef.value as any;
    if (initCheckInfoRef.validateForm && !editDisabled.value) {
      nextTick(async () => {
        await initCheckInfoRef.validateForm();
      });
    }
  } catch (error) {
    formLoading.value = false;
  }
}
const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};
// 初始化 导入的数据
function getExcelData(excelData: any) {
  console.log("用户上传的数据：", excelData);
  let batch_no = formData.value.batch_no;
  let tableData = checkTableData.value;
  let initDay = dayjs();
  // 判断是否有数据
  let check_time = initDay.format("HH:mm");
  let unique_id: string = buildUUID();
  if (tableData.length) {
    let lastCheckTime = tableData[tableData.length - 1]?.check_time;
    check_time = dayjs(lastCheckTime, "HH:mm").add(5, "minute").format("HH:mm");
  }
  // 获取包号：在上一个包号基础上+8
  let pack_no: any = undefined as FormNumType;
  if (tableData[tableData.length - 1]?.pack_no) {
    pack_no = Number(tableData[tableData.length - 1]?.pack_no ?? 0) + 8;
  }
  let newData: any = [];
  // 先把导入的数据按照每3条分组
  let checkJson: any = [];
  for (let i = 0; i < excelData.length; i += 3) {
    excelData[i]["lange_width"] = "";
    excelData[i]["inner"] = "";
    excelData[i]["body_high"] = "";
    let groupData = excelData.slice(i, i + 3);
    // 如果group长度不够3，补充缺失的元素
    while (groupData.length < 3) {
      groupData.push({
        body_high: "",
        lange_width: "",
        inner: "",
        w_standard: "",
        body_hook_length: "",
        end_hook_length: "",
        overlap: "",
        overlap_rate: "",
        t_standard: "",
        end_hook_clearance: "",
        body_hook_clearance: "",
      });
    }
    checkJson.push(groupData);
  }
  checkJson.forEach((item: any, index: number) => {
    if (index > 0) {
      pack_no += 8;
      check_time = dayjs(check_time, "HH:mm").add(5, "minute").format("HH:mm");
    }
    // console.log("item::", item);
    // console.log("index::", index);
    newData.push({
      unique_id,
      check_time,
      batch_no,
      pack_no,
      check_json: item,
      wrinkle_rate: "",
      bule_dots: "",
    });
  });
  tableData.push(...newData);
  console.log("tableData::", tableData);

  checkTableData.value = tableData;
}
onActivated(() => {
  initEmptyOrderBaseData();
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  assocType.value = [Number(route.query.assocType)];
  initTagsView();

  if (listId.value) {
    getEditData();
    return;
  }
  initTableClumns({ sku: formData.value.sku });
});
</script>
<template>
  <div class="app-container pt-40">
    <AffixButton v-bind:="affixBtnData" v-on="affixBtnEvent" :order-type="2"></AffixButton>
    <el-tabs v-model="activeName" @tab-change="tabChange">
      <el-tab-pane label="详情信息" name="first">
        <el-collapse v-model="activeNames" v-loading="formLoading">
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
                @change="handleChange"
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
          <el-collapse-item name="2" class="mt-2 flex-shrink-0">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <checkInfo
                ref="checkInfoRef"
                :checkTablecolumns="checkTablecolumns"
                :checkFormRules="checkFormRules"
                :formData="formData"
                :checkTableForm="checkTableForm"
                :checkTableData="checkTableData"
                :formLoading="formLoading"
                :editDisabled="editDisabled"
                :is_submit="is_submit"
                :abnormalNum="abnormalNum"
                :tableLableOptions="tableLableOptions"
                @handleAdd="handleAdd"
                @handleDelRow="handleDelRow"
                @getExcelData="getExcelData"
                @change-check-res="changeCheckRes"
              />
            </div>
          </el-collapse-item>

          <!-- 附件信息 -->
          <el-collapse-item name="3" class="mt-2">
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
    <RecheckSign
      ref="recheckSignRef"
      @confirm="handleRecheckSignConfirm"
      v-model="recheckSignVisible"
    ></RecheckSign>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/quality/add.scss";
:deep(.plus-form .el-card) {
  box-shadow: none;
}
</style>
