<script setup lang="ts">
import type { FormInstance } from "element-plus";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import type { GroupedList } from "@/hooks/quality/finishedProduct";
import { useAdd } from "../utils/add";

interface Props {
  disabled?: boolean;
}

type SignatureType = {
  ph_soluble_signature: string;
  volume_sense_signature: string;
  seaming_inspection_signature: string;
  microbe_signature: string;
  label_signature: string;
  composition_analysis_signature: string;
};

const props = withDefaults(defineProps<Props>(), { disabled: false });

const conformOptions = [
  { name: "符合标准要求", id: 1 },
  { name: "不符合标准要求", id: 0 },
];

const { passList, useSetting } = useAdd();

const checkFormRef = ref<FormInstance>();

const checkFormData = reactive({
  /** 检测结果相关字段集合 */
  check_info: {
    ph_res: undefined as FormNumType, //ph检测结果；0：不合格；1：合格
    soluble_solids_res: undefined as FormNumType, //可溶性固形物检测结果；0：不合格；1：合格
    volume_res: undefined as FormNumType, //净含量检测结果；0：不合格；1：合格
    internal_pressure_res: undefined as FormNumType, //内压检测结果；0：不合格；1：合格

    sense_color_res: undefined as FormNumType, //感官指标-色泽检测结果；0：不合格；1：合格
    sense_smell_res: undefined as FormNumType, //感官指标-滋味和气味检测结果；0：不合格；1：合格
    sense_appearance_res: undefined as FormNumType, //感官指标-组织状态检测结果；0：不合格；1：合格
    sense_impurity_res: undefined as FormNumType, //感官指标-杂质检测结果；0：不合格；1：合格

    seaming_inspection_res: undefined as FormNumType, //卷封检测结果；0：不合格；1：合格
    microbe_total_colony_res: undefined as FormNumType, //微生物-菌落总数检测结果；0：不合格；1：合格
    microbe_coliform_bacteria_res: undefined as FormNumType, //微生物-大肠菌群检测结果；0：不合格；1：合格
    microbe_saccharomyces_res: undefined as FormNumType, //微生物-酵母菌检测结果；0：不合格；1：合格
    microbe_mold_res: undefined as FormNumType, //微生物-霉菌检测结果；0：不合格；1：合格
    label_res: undefined as FormNumType, //标签标识检测结果；0：不合格；1：合格
    composition_analysis_res: undefined as FormNumType, //成分分析检测结果；0：不合格；1：合格
  },
  /** 测定值相关字段集合 */
  measureVal: {
    ph_val: "", //ph测定值
    soluble_solids_val: "", //可溶性固形物测定值
    volume_val: "", //净含量测定值
    internal_pressure_val: "", //内压测定值
    sense_color_val: undefined as FormNumType, // 感官指标指标-色泽测定值；0：符合标准要求；1：不符合标准要求
    sense_smell_val: undefined as FormNumType, //感官指标指标-滋味和气味测定值；0：符合标准要求；1：不符合标准要求
    sense_appearance_val: undefined as FormNumType, //感官指标指标-组织状态测定值；0：符合标准要求；1：不符合标准要求
    sense_impurity_val: undefined as FormNumType, //感官指标指标-杂质测定值；0：符合标准要求；1：不符合标准要求
    seaming_inspection_val: undefined as FormNumType, //卷封测定值；0：符合标准要求；1：不符合标准要求
    microbe_total_colony_val: "<1", //微生物-菌落总数测定值
    microbe_coliform_bacteria_val: "<1", //微生物-大肠菌群测定值
    microbe_saccharomyces_val: "<1", //微生物-酵母菌测定值
    microbe_mold_val: "<1", //微生物-霉菌测定值
  },
  signature: {
    ph_soluble_signature: "", //ph和可溶性固形物检验员签名
    volume_sense_signature: "", //净含量与感官指标检验员签名
    seaming_inspection_signature: "", //卷封检测检验员签名
    microbe_signature: "", //微生物检验员签名
    label_signature: "", //标签标识检验员签名
    composition_analysis_signature: "", //成分分析检验员签名
  } as SignatureType,
});

const { check_info, measureVal, signature } = toRefs(checkFormData);

const checkRules = reactive({
  ph_res: [{ required: true, message: "请选择ph检测结果" }],
  soluble_solids_res: [{ required: true, message: "请选择可溶性固形物检测结果" }],
  volume_res: [{ required: true, message: "请选择净含量检测结果" }],
  internal_pressure_res: [{ required: true, message: "请选择内压检测结果" }],
  sense_color_res: [{ required: true, message: "请选择色泽检测结果" }],
  sense_smell_res: [{ required: true, message: "请选择滋味和气味检测结果" }],
  sense_appearance_res: [{ required: true, message: "请选择组织状态检测结果" }],
  sense_impurity_res: [{ required: true, message: "请选择杂质检测结果" }],
  seaming_inspection_res: [{ required: true, message: "请选择卷封检测结果" }],
  microbe_total_colony_res: [{ required: true, message: "请选择菌落总数检测结果" }],
  microbe_coliform_bacteria_res: [{ required: true, message: "请选择大肠菌群检测结果" }],
  microbe_saccharomyces_res: [{ required: true, message: "请选择酵母菌检测结果" }],
  microbe_mold_res: [{ required: true, message: "请选择霉菌检测结果" }],
  label_res: [{ required: true, message: "请选择标签标识检测结果" }],
  composition_analysis_res: [{ required: true, message: "请选择成分分析检测结果" }],
  // ~~~~~~~~~!~~~~~~~~~~~~~~~~
  ph_val: [{ required: true, message: "请输入ph测定值" }],
  soluble_solids_val: [{ required: true, message: "请输入可溶性固形物测定值" }],
  volume_val: [{ required: true, message: "请输入净含量测定值" }],
  internal_pressure_val: [{ required: true, message: "请输入内压测定值" }],
  microbe_total_colony_val: [{ required: true, message: "请输入菌落总数测定值" }],
  microbe_coliform_bacteria_val: [{ required: true, message: "请输入大肠菌群测定值" }],
  microbe_saccharomyces_val: [{ required: true, message: "请输入酵母菌测定值" }],
  microbe_mold_val: [{ required: true, message: "请输入霉菌测定值" }],
  // ~~~~~~~~~~~~~!!!~~~~~~~~~~~~~~~~`
  ph_soluble_signature: [{ required: true, message: "ph和可溶性固形物检验员签名" }],
  volume_sense_signature: [{ required: true, message: "净含量与感官指标检验员签名" }],
  seaming_inspection_signature: [{ required: true, message: "卷封检测检验员签名" }],
  microbe_signature: [{ required: true, message: "微生物检验员签名" }],
  label_signature: [{ required: true, message: "标签标识检验员签名" }],
  composition_analysis_signature: [{ required: true, message: "成分分析检验员签名" }],
});

// /** 检测结果相关字段集合 */
// const check_info = ref({
//   ph_res: undefined as FormNumType, //ph检测结果；0：不合格；1：合格
//   soluble_solids_res: undefined as FormNumType, //可溶性固形物检测结果；0：不合格；1：合格
//   volume_res: undefined as FormNumType, //净含量检测结果；0：不合格；1：合格
//   internal_pressure_res: undefined as FormNumType, //内压检测结果；0：不合格；1：合格

//   sense_color_res: undefined as FormNumType, //感官指标-色泽检测结果；0：不合格；1：合格
//   sense_smell_res: undefined as FormNumType, //感官指标-滋味和气味检测结果；0：不合格；1：合格
//   sense_appearance_res: undefined as FormNumType, //感官指标-组织状态检测结果；0：不合格；1：合格
//   sense_impurity_res: undefined as FormNumType, //感官指标-杂质检测结果；0：不合格；1：合格

//   seaming_inspection_res: undefined as FormNumType, //卷封检测结果；0：不合格；1：合格
//   microbe_total_colony_res: undefined as FormNumType, //微生物-菌落总数检测结果；0：不合格；1：合格
//   microbe_coliform_bacteria_res: undefined as FormNumType, //微生物-大肠菌群检测结果；0：不合格；1：合格
//   microbe_saccharomyces_res: undefined as FormNumType, //微生物-酵母菌检测结果；0：不合格；1：合格
//   microbe_mold_res: undefined as FormNumType, //微生物-霉菌检测结果；0：不合格；1：合格
//   label_res: undefined as FormNumType, //标签标识检测结果；0：不合格；1：合格
//   composition_analysis_res: undefined as FormNumType, //成分分析检测结果；0：不合格；1：合格
// });

// /** 测定值相关字段集合 */
// const measureVal = ref({
//   ph_val: "", //ph测定值
//   soluble_solids_val: "", //可溶性固形物测定值
//   volume_val: "", //净含量测定值
//   internal_pressure_val: "", //内压测定值
//   sense_color_val: undefined as FormNumType, // 感官指标指标-色泽测定值；0：符合标准要求；1：不符合标准要求
//   sense_smell_val: undefined as FormNumType, //感官指标指标-滋味和气味测定值；0：符合标准要求；1：不符合标准要求
//   sense_appearance_val: undefined as FormNumType, //感官指标指标-组织状态测定值；0：符合标准要求；1：不符合标准要求
//   sense_impurity_val: undefined as FormNumType, //感官指标指标-杂质测定值；0：符合标准要求；1：不符合标准要求
//   seaming_inspection_val: undefined as FormNumType, //卷封测定值；0：符合标准要求；1：不符合标准要求
//   microbe_total_colony_val: "<1", //微生物-菌落总数测定值
//   microbe_coliform_bacteria_val: "<1", //微生物-大肠菌群测定值
//   microbe_saccharomyces_val: "<1", //微生物-酵母菌测定值
//   microbe_mold_val: "<1", //微生物-霉菌测定值
//   // label_val: "", //标签标识测定值，暂时不用传
//   // composition_analysis_val: "", //成分分析测定值，暂时不用传
// });

// /** 签字图片相关字段集合 */
// const signature = ref<SignatureType>({
//   ph_soluble_signature: "", //ph和可溶性固形物检验员签名
//   volume_sense_signature: "", //净含量与感官指标检验员签名
//   seaming_inspection_signature: "", //卷封检测检验员签名
//   microbe_signature: "", //微生物检验员签名
//   label_signature: "", //标签标识检验员签名
//   composition_analysis_signature: "", //成分分析检验员签名
// });

// 检验意见
const conclusion = ref("");

const signDialogRef = ref();

function handleSignature(field: string) {
  const signatureText = {
    ph_soluble_signature: "ph和可溶性固形物签字",
    volume_sense_signature: "净含量与感官指标签字",
    seaming_inspection_signature: "卷封检测签字",
    microbe_signature: "微生物签字",
    label_signature: "标签标识签字",
    composition_analysis_signature: "成分分析签字",
  };
  addDialog({
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: signatureText[field as keyof SignatureType],
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
      // console.log("result", result);

      signature.value[field as keyof SignatureType] = result;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

function setData(res: any) {
  conclusion.value = res.conclusion;
  let detailCheckInfo = {
    ph_res: res.ph_res,
    soluble_solids_res: res.soluble_solids_res,
    volume_res: res.volume_res,
    internal_pressure_res: res.internal_pressure_res,
    sense_color_res: res.sense_color_res,
    sense_smell_res: res.sense_smell_res,
    sense_appearance_res: res.sense_appearance_res,
    sense_impurity_res: res.sense_impurity_res,
    seaming_inspection_res: res.seaming_inspection_res,
    microbe_total_colony_res: res.microbe_total_colony_res,
    microbe_coliform_bacteria_res: res.microbe_coliform_bacteria_res,
    microbe_saccharomyces_res: res.microbe_saccharomyces_res,
    microbe_mold_res: res.microbe_mold_res,
    label_res: res.label_res,
    composition_analysis_res: res.composition_analysis_res,
  };
  check_info.value = detailCheckInfo;

  let detailSignature = {
    ph_soluble_signature: res.ph_soluble_signature,
    volume_sense_signature: res.volume_sense_signature,
    seaming_inspection_signature: res.seaming_inspection_signature,
    microbe_signature: res.microbe_signature,
    label_signature: res.label_signature,
    composition_analysis_signature: res.composition_analysis_signature,
  };
  signature.value = detailSignature;

  let detailMeasureVal = {
    ph_val: res.ph_val,
    soluble_solids_val: res.soluble_solids_val,
    volume_val: res.volume_val,
    internal_pressure_val: res.internal_pressure_val,
    sense_color_val: res.sense_color_val,
    sense_smell_val: res.sense_smell_val,
    sense_appearance_val: res.sense_appearance_val,
    sense_impurity_val: res.sense_impurity_val,
    seaming_inspection_val: res.seaming_inspection_val,
    microbe_total_colony_val: res.microbe_total_colony_val,
    microbe_coliform_bacteria_val: res.microbe_coliform_bacteria_val,
    microbe_saccharomyces_val: res.microbe_saccharomyces_val,
    microbe_mold_val: res.microbe_mold_val,
  };
  measureVal.value = detailMeasureVal;
}

function setMeanValue(list: GroupedList[]) {
  console.log("🚀 ~ setMeanValue ~ list:", list);
  const ph_val_list = list.map((item) => Number(item.ph_val)); //ph测定值列表
  const soluble_solids_val_list = list.map((item) => Number(item.soluble_solids_val)); //可溶性固形物测定值列表
  const volume_val_list = list.map((item) => Number(item.phys_net_val)); //净含量测定值列表
  const internal_pressure_val_list = list.map((item) => Number(item.phys_internal_pressure_val)); //内压测定值列表

  measureVal.value.ph_val = calculateAverage(ph_val_list);
  measureVal.value.soluble_solids_val = calculateAverage(soluble_solids_val_list);
  measureVal.value.volume_val = calculateAverage(volume_val_list);
  measureVal.value.internal_pressure_val = calculateAverage(internal_pressure_val_list);
}

function calculateAverage(arr: number[]) {
  if (arr.length === 0) return ""; // 防止除以零错误，如果数组为空，返回0
  const sum = arr.reduce((preVal, curVal) => preVal + curVal, 0);
  let str = (sum / arr.length).toFixed(2);
  return str;
}

async function validateForm() {
  console.log("执行验证");
  const vaildateRes = await checkFormRef
    .value!.validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
}

defineExpose({
  check_info,
  signature,
  conclusion,
  setData,
  setMeanValue,
  measureVal,
  validateForm,
});
</script>
<template>
  <el-form ref="checkFormRef" :model="checkFormData" :rules="checkRules">
    <table>
      <tr>
        <td colspan="2">
          <span class="block">Test Item</span>
          <span class="block">检验项目</span>
        </td>
        <td>
          <span class="block">Unit</span>
          <span class="block">单位</span>
        </td>
        <td>
          <span class="block">Standard</span>
          <span class="block">标准值</span>
        </td>
        <td>
          <span class="block">Measure</span>
          <span class="block">测定值</span>
        </td>
        <td>
          <span class="block">Test</span>
          <span class="block">检验结果</span>
        </td>
        <td>
          <span class="block">Inspector</span>
          <span class="block">检验员</span>
        </td>
      </tr>
      <tr>
        <td colspan="2">PH(25℃)</td>
        <td>-</td>
        <td>3.00~4.00</td>
        <td>
          <!-- ph测定值  -->
          <el-form-item prop="measureVal.ph_val" :rules="checkRules.ph_val">
            <el-input v-model="measureVal.ph_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- ph检验结果  -->
          <el-form-item prop="check_info.ph_res" :rules="checkRules.ph_res">
            <CommonSelect
              v-model="check_info.ph_res"
              :list="passList"
              :isWarning="check_info.ph_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td rowspan="2">
          <!-- ph和可溶性固形物检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('ph_soluble_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.ph_soluble_signature"
              :preview-src-list="[useSetting.baseHttp + signature.ph_soluble_signature]"
              v-if="signature.ph_soluble_signature"
            />
          </div>
          <el-form-item
            :prop="`signature.ph_soluble_signature`"
            :rules="checkRules.ph_soluble_signature"
          >
            <el-input v-model="signature.ph_soluble_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">可溶性固形物（Brix），以折光计20℃</td>
        <td>%</td>
        <td>5.0～15.0</td>
        <td>
          <!-- 可溶性固形物测定值  -->
          <el-form-item prop="measureVal.soluble_solids_val" :rules="checkRules.soluble_solids_val">
            <el-input v-model="measureVal.soluble_solids_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 可溶性固形物检验结果  -->
          <el-form-item prop="check_info.soluble_solids_res" :rules="checkRules.soluble_solids_res">
            <CommonSelect
              v-model="check_info.soluble_solids_res"
              :list="passList"
              :isWarning="check_info.soluble_solids_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Volume（净含量）</td>
        <td>mL/ 罐</td>
        <td>≥310</td>
        <td>
          <!-- 净含量测定值  -->
          <el-form-item prop="measureVal.volume_val" :rules="checkRules.volume_val">
            <el-input v-model="measureVal.volume_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 净含量检验结果  -->
          <el-form-item prop="check_info.volume_res" :rules="checkRules.volume_res">
            <CommonSelect
              v-model="check_info.volume_res"
              :list="passList"
              :isWarning="check_info.volume_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td rowspan="6">
          <!-- 净含量与感官指标检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('volume_sense_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.volume_sense_signature"
              :preview-src-list="[useSetting.baseHttp + signature.volume_sense_signature]"
              v-if="signature.volume_sense_signature"
            />
          </div>
          <el-form-item
            :prop="`signature.volume_sense_signature`"
            :rules="checkRules.volume_sense_signature"
          >
            <el-input v-model="signature.volume_sense_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Internal pressure（内压）</td>
        <td>MPa</td>
        <td>0.19±0.08Mpa（20~25℃）</td>
        <td>
          <!-- 内压测定值  -->
          <el-form-item
            prop="measureVal.internal_pressure_val"
            :rules="checkRules.internal_pressure_val"
          >
            <el-input v-model="measureVal.internal_pressure_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 内压检验结果  -->
          <el-form-item
            prop="check_info.internal_pressure_res"
            :rules="checkRules.internal_pressure_res"
          >
            <CommonSelect
              v-model="check_info.internal_pressure_res"
              :list="passList"
              :isWarning="check_info.internal_pressure_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td rowspan="4">Sensory Evaluation （感观指标）</td>
        <td>Colour（色泽）</td>
        <td>-</td>
        <td>呈本品应有的色泽</td>
        <td>
          <!-- 色泽测定值 -->
          <CommonSelect
            v-model="measureVal.sense_color_val"
            :list="conformOptions"
            :isWarning="measureVal.sense_color_val === 0"
            placeHint="根据检验结果显示"
            disabled
          ></CommonSelect>
        </td>
        <td>
          <!-- 色泽检验结果 -->
          <el-form-item prop="check_info.sense_color_res" :rules="checkRules.sense_color_res">
            <CommonSelect
              v-model="check_info.sense_color_res"
              :list="passList"
              :isWarning="check_info.sense_color_res === 0"
              :disabled="disabled"
              @change="(val) => (measureVal.sense_color_val = val)"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Taste and Smell （滋味和气味）</td>
        <td>-</td>
        <td>具有本品应有的滋味，无异味</td>
        <td>
          <!-- 滋味和气味测定值 -->
          <CommonSelect
            v-model="measureVal.sense_smell_val"
            :list="conformOptions"
            :isWarning="measureVal.sense_smell_val === 0"
            disabled
            placeHint="根据检验结果显示"
          ></CommonSelect>
        </td>
        <td>
          <!-- 滋味和气味检验结果 -->
          <el-form-item prop="check_info.sense_smell_res" :rules="checkRules.sense_smell_res">
            <CommonSelect
              v-model="check_info.sense_smell_res"
              :list="passList"
              :isWarning="check_info.sense_smell_res === 0"
              :disabled="disabled"
              @change="(val) => (measureVal.sense_smell_val = val)"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Appearance （组织状态）</td>
        <td>-</td>
        <td>具有本品特有的外观形态</td>
        <td>
          <!-- 组件状态测定值 -->
          <CommonSelect
            v-model="measureVal.sense_appearance_val"
            :list="conformOptions"
            :isWarning="measureVal.sense_appearance_val === 0"
            disabled
            placeHint="根据检验结果显示"
          ></CommonSelect>
        </td>
        <td>
          <!-- 组织状态检验结果 -->
          <el-form-item
            prop="check_info.sense_appearance_res"
            :rules="checkRules.sense_appearance_res"
          >
            <CommonSelect
              v-model="check_info.sense_appearance_res"
              :list="passList"
              :isWarning="check_info.sense_appearance_res === 0"
              :disabled="disabled"
              @change="(val) => (measureVal.sense_appearance_val = val)"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Impurities （杂质）</td>
        <td>-</td>
        <td>无正常视力可见外来杂质</td>
        <td>
          <!-- 杂质测定值 -->
          <CommonSelect
            v-model="measureVal.sense_impurity_val"
            :list="conformOptions"
            :isWarning="measureVal.sense_impurity_val === 0"
            disabled
            placeHint="根据检验结果显示"
          ></CommonSelect>
        </td>
        <td>
          <!-- 杂质检验结果 -->
          <el-form-item prop="check_info.sense_impurity_res" :rules="checkRules.sense_impurity_res">
            <CommonSelect
              v-model="check_info.sense_impurity_res"
              :list="passList"
              :isWarning="check_info.sense_impurity_res === 0"
              :disabled="disabled"
              @change="(val) => (measureVal.sense_impurity_val = val)"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Seaming Inspection（卷封检测）</td>
        <td>-</td>
        <td>
          <ul>
            <li>迭接长度≥0.9mm</li>
            <li>罐钩、盖钩顶隙≥0.1mm</li>
            <li>迭接率≥55%，紧密度≥90%</li>
          </ul>
        </td>
        <td>
          <!-- 卷封检测测定值 -->
          <CommonSelect
            v-model="measureVal.seaming_inspection_val"
            :list="conformOptions"
            :isWarning="measureVal.seaming_inspection_val === 0"
            disabled
            placeHint="根据检验结果显示"
          ></CommonSelect>
        </td>
        <td>
          <!-- 卷封检测检验结果 -->
          <el-form-item
            prop="check_info.seaming_inspection_res"
            :rules="checkRules.seaming_inspection_res"
          >
            <CommonSelect
              v-model="check_info.seaming_inspection_res"
              :list="passList"
              :isWarning="check_info.seaming_inspection_res === 0"
              :disabled="disabled"
              @change="(val) => (measureVal.seaming_inspection_val = val)"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td>
          <!-- 卷封检测检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('seaming_inspection_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.seaming_inspection_signature"
              :preview-src-list="[useSetting.baseHttp + signature.seaming_inspection_signature]"
              v-if="signature.seaming_inspection_signature"
            />
          </div>
          <el-form-item
            :prop="`signature.seaming_inspection_signature`"
            :rules="checkRules.seaming_inspection_signature"
          >
            <el-input v-model="signature.seaming_inspection_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td rowspan="4">Microbiologica （微生物）</td>
        <td>Total Plate Count （菌落总数）</td>
        <td>CFU/mL</td>
        <td>
          <ul>
            <li>n=5</li>
            <li>c=2</li>
            <li>m=102</li>
            <li>M=104</li>
          </ul>
        </td>
        <td>
          <!-- 菌落总数测定值 -->
          <el-form-item
            prop="measureVal.internal_pressure_val"
            :rules="checkRules.microbe_total_colony_val"
          >
            <el-input v-model="measureVal.microbe_total_colony_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 菌落总数检验结果 -->
          <el-form-item
            prop="check_info.microbe_total_colony_res"
            :rules="checkRules.microbe_total_colony_res"
          >
            <CommonSelect
              v-model="check_info.microbe_total_colony_res"
              :list="passList"
              :isWarning="check_info.microbe_total_colony_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td rowspan="4">
          <!-- 微生物检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('microbe_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.microbe_signature"
              :preview-src-list="[useSetting.baseHttp + signature.microbe_signature]"
              v-if="signature.microbe_signature"
            />
          </div>
          <el-form-item :prop="`signature.microbe_signature`" :rules="checkRules.microbe_signature">
            <el-input v-model="signature.microbe_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Total Coliform （大肠菌群）</td>
        <td>CFU/mL</td>
        <td>
          <ul>
            <li>n=5</li>
            <li>c=2</li>
            <li>m=1</li>
            <li>M=10</li>
          </ul>
        </td>
        <td>
          <!-- 大肠菌群测定值 -->
          <el-form-item
            prop="measureVal.microbe_coliform_bacteria_val"
            :rules="checkRules.microbe_coliform_bacteria_val"
          >
            <el-input
              v-model="measureVal.microbe_coliform_bacteria_val"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 大肠菌群检验结果 -->
          <el-form-item
            prop="check_info.microbe_coliform_bacteria_res"
            :rules="checkRules.microbe_coliform_bacteria_res"
          >
            <CommonSelect
              v-model="check_info.microbe_coliform_bacteria_res"
              :list="passList"
              :isWarning="check_info.microbe_coliform_bacteria_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Yeast（酵母菌）</td>
        <td>CFU/mL</td>
        <td>≤ 10</td>
        <td>
          <!-- 酵母菌测定值 -->
          <el-form-item
            prop="measureVal.microbe_saccharomyces_val"
            :rules="checkRules.microbe_saccharomyces_val"
          >
            <el-input
              v-model="measureVal.microbe_saccharomyces_val"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 酵母菌检验结果 -->
          <el-form-item
            prop="check_info.microbe_saccharomyces_res"
            :rules="checkRules.microbe_saccharomyces_res"
          >
            <CommonSelect
              v-model="check_info.microbe_saccharomyces_res"
              :list="passList"
              :isWarning="check_info.microbe_saccharomyces_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Mold（霉菌）</td>
        <td>CFU/mL</td>
        <td>≤ 10</td>
        <td>
          <!-- 霉菌测定值 -->
          <el-form-item prop="measureVal.microbe_mold_val" :rules="checkRules.microbe_mold_val">
            <el-input v-model="measureVal.microbe_mold_val" :disabled="disabled"></el-input>
          </el-form-item>
        </td>
        <td>
          <!-- 霉菌检验结果 -->
          <el-form-item prop="check_info.microbe_mold_res" :rules="checkRules.microbe_mold_res">
            <CommonSelect
              v-model="check_info.microbe_mold_res"
              :list="passList"
              :isWarning="check_info.microbe_mold_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Label（标签标识）</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>
          <!-- 标签标识检验结果 -->
          <el-form-item prop="check_info.label_res" :rules="checkRules.label_res">
            <CommonSelect
              v-model="check_info.label_res"
              :list="passList"
              :isWarning="check_info.label_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td>
          <!-- 标签标识检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('label_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.label_signature"
              :preview-src-list="[useSetting.baseHttp + signature.label_signature]"
              v-if="signature.label_signature"
            />
          </div>
          <el-form-item :prop="`signature.label_signature`" :rules="checkRules.label_signature">
            <el-input v-model="signature.label_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Composition Analysis（成分分析）</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>
          <!-- 成分分析检验结果 -->
          <el-form-item
            :prop="`check_info.composition_analysis_res`"
            :rules="checkRules.composition_analysis_res"
          >
            <CommonSelect
              v-model="check_info.composition_analysis_res"
              :list="passList"
              :isWarning="check_info.composition_analysis_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td>
          <!-- 成分分析检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('composition_analysis_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.composition_analysis_signature"
              :preview-src-list="[useSetting.baseHttp + signature.composition_analysis_signature]"
              v-if="signature.composition_analysis_signature"
            />
          </div>
          <el-form-item
            :prop="`signature.composition_analysis_signature`"
            :rules="checkRules.composition_analysis_signature"
          >
            <el-input v-model="signature.composition_analysis_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Conclusion（检测意见）：</td>
        <td colspan="5">
          <el-input v-model="conclusion" placeholder="检验意见" :disabled="disabled"></el-input>
        </td>
      </tr>
    </table>
  </el-form>
</template>
<style lang="scss" scoped>
table {
  font-size: 14px;
  border-collapse: collapse;
  color: #454545;
  table-layout: fixed;
  width: 100%;
  text-align: center;
  border: 0.5px solid #e5e7eb;
  td {
    border: 1px solid #e5e5e5;
    padding: 0 4px;
    height: 40px;
  }
}
</style>
