<script setup lang="ts">
/* 空罐照相设备验证表-新建/编辑/详情页面 */
import type { FormInstance, TabPaneName } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {
  cansCameraAddApi,
  cansCameraApproveApi,
  cansCameraDelApi,
  cansCameraDetailApi,
  cansCameraEditApi,
  cansCameraRecallApi,
  cansCameraRejectApi,
  cansCameraReportApi,
  cansCameraReverseApi,
  cansCameraSubmitApi,
  getSampleTankImgApi,
} from "@/api/quality/environment/cans-camera";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useCommonHooks } from "@/hooks/quality";
import { useTagsViewStore } from "@/store/modules/tagsView";
import OrderLog from "@/views/quality/components/OrderLog/index.vue";
import RecheckSign from "@/views/quality/components/RecheckSign/index.vue";
import AffixButton from "@/views/quality/components/affixButton.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "EnvironmentCansCameraAdd",
});
enum ETitle {
  "新建空罐照相设备验证表" = 1,
  "编辑空罐照相设备验证表",
  "空罐照相设备验证表详情",
}

const { startDownloadUrl } = useCommonHooks();

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  baseForm,
  baseColumns,
  logList,
  tableForm,
  tableColumns,
  tableData,
  pageType,
  baseRules,
  tableRules,
  is_submit,
  getStatusText,
  useSetting,
  isDetailDisable,
  tasteOptions,
} = useAdd();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
/** 签字复核组件的ref */
const recheckSignRef = ref<InstanceType<typeof RecheckSign>>();
const recheckSignVisible = ref(false);

/** 身份标识数组--重要! */
const assoc_type = ref<number[]>([]);

/** 折叠面板的数组 */
const activeNames = ref(["1", "2", "3"]);
const PlusFormRef = ref();
/** 基础表单的ref */
const baseFormRef = computed(() => {
  return PlusFormRef.value.formInstance as FormInstance;
});
/** 样罐图片信息列表 */
const sampleTankImgList = ref<{ title: string; url: string }[]>([]);
/** 表格表单的ref */
const tableFormRef = ref<FormInstance>();

/** 用于记录编辑时,从列表传过来的id */
const listId = ref(0);
/** 用于记录单据状态 */
const status = ref();

/** 获取详情数据时的加载状态 */
const detailLoading = ref(false);

/** 点击保存
 * @param type 1保存 2提交
 */
async function handleSave(type = 1) {
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

  const vaildTableRes = await tableFormRef.value
    ?.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value?.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  if (!vaildTableRes) return;
  let {
    order_no,
    order_status,
    ct_name,
    create_time,
    check_user_signature,
    reviewer_user_signature,
    ...rest
  } = baseForm.value;

  let data = {
    ...rest,
    check_user_signature: check_user_signature ? check_user_signature : undefined,
    check_info: tableData.value,
  };
  console.log("🚀 ~~~.then ~ data:", data);
  let loadingText = type === 1 ? "正在保存中" : "正在提交中";
  let resultMsg = "";
  const sendLoading = ElLoading.service({
    lock: true,
    text: loadingText,
    background: "rgba(0, 0, 0, 0.7)",
  });
  console.log("🚀 ~ handleSave ~ data:", data);
  try {
    const result = listId.value
      ? await cansCameraEditApi({ ...data, id: listId.value })
      : await cansCameraAddApi(data);
    resultMsg = result.msg;
    if (type === 2) {
      /* 如果是提交,保存后用返回的id,调用提交接口 */
      let data = {
        id: result.data.id,
        check_user_signature: baseForm.value.check_user_signature,
      };
      const submitResult = await cansCameraSubmitApi(data);
      resultMsg = submitResult.msg;
    }
    sendLoading.close();
    closeCurrentPage(resultMsg);
  } catch (error) {
    sendLoading.close();
  }
}

const signDialogRef = ref();
/** 点击签字提交 */
async function handleSubmit() {
  /* 提交需要验证输入完整 */
  is_submit.value = true;
  if (!tableData.value.length) {
    ElMessage.warning("请先填写检验信息数据");
    return;
  }
  const vaildateRes = await tableFormRef
    .value!.validate((valid, fields) => {
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

  //   let errIndexList: number[] = [];
  //   tableData.value.map((el, i) => {
  //     if (el.check_res === 0) {
  //       errIndexList.push(i + 1);
  //     }
  //   });

  //   if (errIndexList.length > 0) {
  //     let text = errIndexList.join(",");
  //     ElMessageBox.confirm(`第${text}条明细检验不合格,您确定要提交吗~`, "异常提示", {
  //       confirmButtonText: "继续提交",
  //       showClose: false,
  //       closeOnClickModal: false,
  //       closeOnPressEscape: false,
  //       type: "warning",
  //     }).then(() => {
  //       showSubmitDialog();
  //     });
  //     return;
  //   }
  showSubmitDialog();
}

function showSubmitDialog() {
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "签名提交",
    contentRenderer: () =>
      h(SignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      console.log("result", result);
      baseForm.value.check_user_signature = result;
      updateDialog(false, "btnLoading");
      done();
      handleSave(2);
    },
  });
}

/** 点击返回 */
function handleCancel() {
  router.replace({
    path: "/quality/environment/cans-camera",
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
      const result = await cansCameraDelApi({ id: listId.value });
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
    fileValues.status == 3 ? await cansCameraRejectApi(data) : await cansCameraApproveApi(data);
  closeCurrentPage(result.msg);
};

/** 点击撤回 */
async function hanleRecall() {
  const result = await cansCameraRecallApi({ id: listId.value });
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
      const result = await cansCameraReverseApi({ id: listId.value });
      ElMessage.success(result.msg);
      getDetailData();
    })
    .catch((error) => {
      console.log(error);
    });
}

/** 点击生成报告 */
async function handleReport() {
  startDownloadUrl(cansCameraReportApi, { id: listId.value });
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
      path: "/quality/environment/cans-camera",
    });
    tagsViewStore.delView(currentTag);
  });
}

async function getDetailData() {
  detailLoading.value = true;
  const result = await cansCameraDetailApi({ id: listId.value });
  const res = result.data;
  assoc_type.value = res.assoc_type;
  logList.value = res.act_log;

  baseForm.value.check_date = res.check_date; //检测日期
  baseForm.value.line_id = res.line_id; //线别
  baseForm.value.check_res = res.check_res; //检验结果
  baseForm.value.note = res.note; //备注

  baseForm.value.order_no = res.order_no; //单据编号-保存剔除
  baseForm.value.order_status = getStatusText(res.status); //单据状态文本-保存剔除
  status.value = res.status;
  baseForm.value.ct_name = res.ct_name; //单据状态-保存剔除
  baseForm.value.create_time = res.create_time; //单据状态-保存剔除
  tableData.value = res.check_info;
  if (pageType.value === 3) {
    baseForm.value.check_user_signature = res.check_user_signature ?? "";
    baseForm.value.reviewer_user_signature = res.reviewer_user_signature ?? "";
  }
  detailLoading.value = false;
}

const initTagsView = () => {
  // id存在表示是编辑
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

async function getSampleTankImg() {
  const result = await getSampleTankImgApi();
  let titleList = [
    "样罐1：罐底中心有3mm黑色圆点",
    "样罐2：罐底离中心点1/3处有3mm黑色圆点",
    "样罐3：罐底离中心2/3处有3mm黑色圆点",
    "样罐4：罐底中心有5*5mm绿色正方形杂物",
    "样罐5：罐底离中心1/2处有5*5mm绿色正方形杂物",
    "样罐6：罐底中心处有2cm黑色丝状物",
    "样罐7（参考）：罐壁1/2处有5mm黑色圆点",
  ];
  let resImgList = result.data.img_list;
  const imgList = Object.values(resImgList) as string[];
  sampleTankImgList.value = imgList.map((item: string, index: number) => {
    return {
      title: titleList[index],
      url: item,
    };
  });
}

onActivated(() => {
  listId.value = Number(route.query.id) || 0;
  pageType.value = Number(route.query.pageType) || 1;
  initTagsView();
  getSampleTankImg();
  if (listId.value) {
    getDetailData();
  }
});

const activeName = ref("first");

const handleClick = (name: TabPaneName) => {
  activeName.value = name as string;
};
</script>
<template>
  <div class="app-container pt-40" v-loading="detailLoading">
    <AffixButton
      :page-type="pageType"
      :status="status"
      :assoc-type="assoc_type"
      :order-type="32"
      :showReport="false"
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
        <el-collapse v-model="activeNames">
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
                label-position="right"
                :columns="baseColumns"
                :row-props="{ gutter: 20 }"
                :col-props="{
                  span: 6,
                }"
                :hasFooter="false"
              ></PlusForm>
            </div>
          </el-collapse-item>
          <!-- 检验信息 -->
          <el-collapse-item name="2" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">检验信息</p>
            </template>
            <div class="px-8">
              <el-form :model="tableForm" ref="tableFormRef">
                <PureTable
                  ref="prueTableRef"
                  row-key="id"
                  border
                  :columns="tableColumns"
                  :data="tableData"
                  header-cell-class-name="table-gray-header"
                >
                  <template #sample_tank1_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank1_res`"
                      :rules="tableRules.sample_tank1_res"
                    >
                      <el-select v-model="row.sample_tank1_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank2_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank2_res`"
                      :rules="tableRules.sample_tank1_res"
                    >
                      <el-select v-model="row.sample_tank2_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank3_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank3_res`"
                      :rules="tableRules.sample_tank3_res"
                    >
                      <el-select v-model="row.sample_tank3_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank4_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank4_res`"
                      :rules="tableRules.sample_tank4_res"
                    >
                      <el-select v-model="row.sample_tank4_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank5_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank5_res`"
                      :rules="tableRules.sample_tank5_res"
                    >
                      <el-select v-model="row.sample_tank5_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank6_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank6_res`"
                      :rules="tableRules.sample_tank6_res"
                    >
                      <el-select v-model="row.sample_tank6_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                  <template #sample_tank7_res="{ row, $index }">
                    <el-form-item
                      :prop="`tableData.${$index}.sample_tank7_res`"
                      :rules="tableRules.sample_tank7_res"
                    >
                      <el-select v-model="row.sample_tank7_res" :disabled="isDetailDisable">
                        <el-option
                          v-for="item in tasteOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </template>
                </PureTable>
              </el-form>
            </div>
          </el-collapse-item>
          <el-collapse-item name="3" class="mt-2">
            <template #title>
              <p class="font-bold text-[14px]">验证说明信息</p>
            </template>
            <div class="px-8">
              <ul>
                <li>
                  <span class="inline-block mr-2 text-blue-500 font-bold">|</span>
                  <span>&nbsp;样品参照对应图片说明</span>
                </li>
                <li>
                  <span class="inline-block mr-2 text-blue-500 font-bold">|</span>
                  <span>
                    每次CIP清洗时进行验证。若生产过程出现异常现象，按照生产部要求增加验证或进行验证调整，并记录;
                  </span>
                </li>
                <li>
                  <span class="inline-block mr-2 text-blue-500 font-bold">|</span>
                  <span>
                    验证通过打“√”，不通过打“×”，1-6号样罐验证合格才能开机生产，7号样罐验证结果仅做参考。
                  </span>
                </li>
              </ul>
              <ul class="grid grid-cols-3 gap-4 mt-8">
                <li v-for="(item, index) in sampleTankImgList" :key="index">
                  <span class="block text-center mb-2">{{ item.title }}</span>
                  <div class="text-center">
                    <el-image :src="useSetting.baseHttp + item.url"></el-image>
                  </div>
                </li>
              </ul>
            </div>
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
@import "@/styles/quality/add.scss";
</style>
