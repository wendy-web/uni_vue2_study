<script setup lang="ts">
import type { FormInstance } from "element-plus";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import SignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useAdd } from "../utils/add";

interface Props {
  list: any[];
  disabled?: boolean;
}

type SignatureType = {
  ph_soluble_signature: string;
  volume_signature: string;
  seaming_inspection_signature: string;
  sense_signature: string;
  microbe_signature: string;
  functional_signature: string;
  label_signature: string;
  composition_analysis_signature: string;
};

const props = withDefaults(defineProps<Props>(), { list: () => [], disabled: false });

const { passList, useSetting } = useAdd();

const checkFormRef = ref<FormInstance>();

// const check_result_info = ref<any[]>([]);

const checkFormData = reactive({
  check_result_info: [] as any[],
  signature: {
    ph_soluble_signature: "", //ph和可溶性固形物检验员签名
    volume_signature: "", //净含量检验员签名
    seaming_inspection_signature: "", //卷封检测检验员签名
    sense_signature: "", //感观指标检验员签名
    microbe_signature: "", //微生物检验员签名
    functional_signature: "", //功效成分检验员签名
    label_signature: "", //标签标识检验员签名
    composition_analysis_signature: "", //成分分析检验员签名
  } as SignatureType,
});

const { check_result_info, signature } = toRefs(checkFormData);

const checkRules = reactive({
  ph_res: [{ required: true, message: "请选择ph检测结果" }],
  soluble_solids_res: [{ required: true, message: "请选择可溶性固形物检测结果" }],
  volume_res: [{ required: true, message: "请选择净含量检测结果" }],
  seaming_inspection_res: [{ required: true, message: "请选择卷封检测结果" }],
  sense_color_res: [{ required: true, message: "请选择色泽检测结果" }],
  sense_smell_res: [{ required: true, message: "请选择滋味和气味检测结果" }],
  sense_appearance_res: [{ required: true, message: "请选择外观检测结果" }],
  sense_impurity_res: [{ required: true, message: "请选择杂质检测结果" }],
  microbe_total_colony_res: [{ required: true, message: "请选择菌落总数检测结果" }],
  microbe_coliform_bacteria_res: [{ required: true, message: "请选择大肠菌群检测结果" }],
  microbe_saccharomyces_res: [{ required: true, message: "请选择酵母菌检测结果" }],
  microbe_mold_res: [{ required: true, message: "请选择霉菌检测结果" }],
  functional_caffeine_res: [{ required: true, message: "请选择咖啡因检测结果" }],
  functional_taurine_res: [{ required: true, message: "请选择牛磺酸检测结果" }],
  label_res: [{ required: true, message: "请选择标签标识检测结果" }],
  composition_analysis_res: [{ required: true, message: "请选择成分分析检测结果" }],
  // ~~~~~~~~~~~~~
  ph_soluble_signature: [{ required: true, message: "ph和可溶性固形物签字" }],
  volume_signature: [{ required: true, message: "净含量签字" }],
  seaming_inspection_signature: [{ required: true, message: "卷封检测签字" }],
  sense_signature: [{ required: true, message: "感观指标签字" }],
  microbe_signature: [{ required: true, message: "微生物签字" }],
  functional_signature: [{ required: true, message: "功效成分签字" }],
  label_signature: [{ required: true, message: "标签标识签字" }],
  composition_analysis_signature: [{ required: true, message: "成分分析签字" }],
});

// const signature = ref<SignatureType>({
//   ph_soluble_signature: "", //ph和可溶性固形物检验员签名
//   volume_signature: "", //净含量检验员签名
//   seaming_inspection_signature: "", //卷封检测检验员签名
//   sense_signature: "", //感观指标检验员签名
//   microbe_signature: "", //微生物检验员签名
//   functional_signature: "", //功效成分检验员签名
//   label_signature: "", //标签标识检验员签名
//   composition_analysis_signature: "", //成分分析检验员签名
// });

// 检验意见
const conclusion = ref("");

const signDialogRef = ref();

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

function handleSignature(field: string) {
  const signatureText = {
    ph_soluble_signature: "ph和可溶性固形物签字",
    volume_signature: "净含量签字",
    seaming_inspection_signature: "卷封检测签字",
    sense_signature: "感观指标签字",
    microbe_signature: "微生物签字",
    functional_signature: "功效成分签字",
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

  // signature.value[field]
}

function setData(data: any[], info: any, val: string) {
  check_result_info.value = data;
  signature.value = info;
  conclusion.value = val;
}

defineExpose({
  check_result_info,
  signature,
  conclusion,
  setData,
  validateForm,
});

watch(
  () => props.list,
  (newVale) => {
    console.log("🚀 ~ newVale:", newVale);
    if (newVale.length > check_result_info.value.length) {
      newVale.forEach((element) => {
        // 使用some方法检查check_result_info中是否存在具有指定field值的元素
        const exists = check_result_info.value.some((item) => item.line_id === element.line_id);
        if (!exists) {
          check_result_info.value.push({
            ...element,
            ph_res: undefined, //ph检测结果；0：不合格；1：合格
            soluble_solids_res: undefined, //可溶性固形物检测结果；0：不合格；1：合格
            volume_res: undefined, //净含量检测结果；0：不合格；1：合格
            seaming_inspection_res: undefined, //卷封检测结果；0：不合格；1：合格
            sense_color_res: undefined, //感官指标-色泽检测结果；0：不合格；1：合格
            sense_smell_res: undefined, //感官指标-滋味和气味检测结果；0：不合格；1：合格
            sense_appearance_res: undefined, //感官指标-外观检测结果；0：不合格；1：合格
            sense_impurity_res: undefined, //感官指标-杂质检测结果；0：不合格；1：合格
            microbe_total_colony_res: undefined, //微生物-菌落总数检测结果；0：不合格；1：合格
            microbe_coliform_bacteria_res: undefined, //微生物-大肠菌群检测结果；0：不合格；1：合格
            microbe_saccharomyces_res: undefined, //微生物-酵母菌检测结果；0：不合格；1：合格
            microbe_mold_res: undefined, //微生物-霉菌检测结果；0：不合格；1：合格
            functional_caffeine_res: undefined, //功效成分-咖啡因检测结果；0：不合格；1：合格
            functional_taurine_res: undefined, //功效成分-牛磺酸检测结果；0：不合格；1：合格
            label_res: undefined, //标签标识检测结果；0：不合格；1：合格
            composition_analysis_res: undefined, //成分分析检测结果；0：不合格；1：合格
          });
        }
      });
    } else {
      let lineIdList = newVale.map((item) => item.line_id);
      check_result_info.value = check_result_info.value.filter((item) => {
        return lineIdList.includes(item.line_id);
      });
    }

    // check_result_info.value = newVale.map((item) => {
    //   return {
    //     ...item,
    //     ph_res: undefined, //ph检测结果；0：不合格；1：合格
    //     soluble_solids_res: undefined, //可溶性固形物检测结果；0：不合格；1：合格
    //     volume_res: undefined, //净含量检测结果；0：不合格；1：合格
    //     seaming_inspection_res: undefined, //卷封检测结果；0：不合格；1：合格
    //     sense_color_res: undefined, //感官指标-色泽检测结果；0：不合格；1：合格
    //     sense_smell_res: undefined, //感官指标-滋味和气味检测结果；0：不合格；1：合格
    //     sense_appearance_res: undefined, //感官指标-外观检测结果；0：不合格；1：合格
    //     sense_impurity_res: undefined, //感官指标-杂质检测结果；0：不合格；1：合格
    //     microbe_total_colony_res: undefined, //微生物-菌落总数检测结果；0：不合格；1：合格
    //     microbe_coliform_bacteria_res: undefined, //微生物-大肠菌群检测结果；0：不合格；1：合格
    //     microbe_saccharomyces_res: undefined, //微生物-酵母菌检测结果；0：不合格；1：合格
    //     microbe_mold_res: undefined, //微生物-霉菌检测结果；0：不合格；1：合格
    //     functional_caffeine_res: undefined, //功效成分-咖啡因检测结果；0：不合格；1：合格
    //     functional_taurine_res: undefined, //功效成分-牛磺酸检测结果；0：不合格；1：合格
    //     label_res: undefined, //标签标识检测结果；0：不合格；1：合格
    //     composition_analysis_res: undefined, //成分分析检测结果；0：不合格；1：合格
    //   };
    // });
  },
  {
    // deep: true,
    immediate: true,
  },
);
</script>
<template>
  <el-form ref="checkFormRef" :model="checkFormData" :rules="checkRules">
    <table>
      <colgroup>
        <col />
        <col />
        <col style="width: 100px" />
      </colgroup>
      <tr>
        <td rowspan="2" colspan="2">
          <span class="block">Test Item</span>
          <span class="block">检验项目</span>
        </td>
        <td rowspan="2">
          <span class="block">Unit</span>
          <span class="block">单位</span>
        </td>
        <td rowspan="2">
          <span class="block">Standard</span>
          <span class="block">标准值</span>
        </td>
        <td :colspan="check_result_info.length" v-if="check_result_info.length">检验结果</td>
        <td rowspan="2">
          <span class="block">Inspector</span>
          <span class="block">检验员</span>
        </td>
      </tr>
      <tr>
        <td v-for="(item, index) in check_result_info">{{ item.line }}</td>
      </tr>
      <tr>
        <td colspan="2">PH(25℃)</td>
        <td>-</td>
        <td>3.00~4.00</td>
        <!-- <td v-for="(item, index) in check_result_info">合格{{ index }}</td> -->
        <td v-for="(item, index) in check_result_info">
          <el-form-item :prop="`check_result_info.${index}.ph_res`" :rules="checkRules.ph_res">
            <CommonSelect
              v-model="item.ph_res"
              :list="passList"
              :isWarning="item.ph_res === 0"
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
        <td colspan="2">Soluble Solids 可溶性固形物（Brix），以折光计20℃</td>
        <td>%</td>
        <td>
          <ul>
            <li>红牛维生素功能饮料：</li>
            <li>10.0～13.0，</li>
            <li>14.0～17.0（牛磺酸强化型）</li>
          </ul>
        </td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.soluble_solids_res`"
            :rules="checkRules.soluble_solids_res"
          >
            <CommonSelect
              v-model="item.soluble_solids_res"
              :list="passList"
              :isWarning="item.soluble_solids_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Volume（净含量）</td>
        <td>mL/ 罐</td>
        <td>≥250</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.volume_res`"
            :rules="checkRules.volume_res"
          >
            <CommonSelect
              v-model="item.volume_res"
              :list="passList"
              :isWarning="item.volume_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>

        <td>
          <!-- 净含量检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('volume_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.volume_signature"
              :preview-src-list="[useSetting.baseHttp + signature.volume_signature]"
              v-if="signature.volume_signature"
            />
          </div>
          <el-form-item :prop="`signature.volume_signature`" :rules="checkRules.volume_signature">
            <el-input v-model="signature.volume_signature" v-show="false"></el-input>
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
            <li>迭接率≥55%</li>
            <li>皱纹度≤30%</li>
          </ul>
        </td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.seaming_inspection_res`"
            :rules="checkRules.seaming_inspection_res"
          >
            <CommonSelect
              v-model="item.seaming_inspection_res"
              :list="passList"
              :isWarning="item.seaming_inspection_res === 0"
              :disabled="disabled"
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
        <td rowspan="4">Sensory Evaluation （感观指标）</td>
        <td>Colour（色泽）</td>
        <td>-</td>
        <td>呈柠檬黄色</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.sense_color_res`"
            :rules="checkRules.sense_color_res"
          >
            <CommonSelect
              v-model="item.sense_color_res"
              :list="passList"
              :isWarning="item.sense_color_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>

        <td rowspan="4">
          <!-- 感观指标检验员签名 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('sense_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.sense_signature"
              :preview-src-list="[useSetting.baseHttp + signature.sense_signature]"
              v-if="signature.sense_signature"
            />
          </div>
          <el-form-item :prop="`signature.sense_signature`" :rules="checkRules.sense_signature">
            <el-input v-model="signature.sense_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Taste and Smell （滋味和气味）</td>
        <td>-</td>
        <td>酸甜适口，具有本品应有的滋味，无不相关气味</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.sense_smell_res`"
            :rules="checkRules.sense_smell_res"
          >
            <CommonSelect
              v-model="item.sense_smell_res"
              :list="passList"
              :isWarning="item.sense_smell_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Appearance （外观）</td>
        <td>-</td>
        <td>液汁均匀，澄清</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.sense_appearance_res`"
            :rules="checkRules.sense_appearance_res"
          >
            <CommonSelect
              v-model="item.sense_appearance_res"
              :list="passList"
              :isWarning="item.sense_appearance_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Impurities （杂质）</td>
        <td>-</td>
        <td>无正常视力可见外来杂质</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.sense_impurity_res`"
            :rules="checkRules.sense_impurity_res"
          >
            <CommonSelect
              v-model="item.sense_impurity_res"
              :list="passList"
              :isWarning="item.sense_impurity_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td rowspan="4">Microbiologica （微生物）</td>
        <td>Total Plate Count （菌落总数）</td>
        <td>CFU/mL</td>
        <td>≤ 100</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.microbe_total_colony_res`"
            :rules="checkRules.microbe_total_colony_res"
          >
            <CommonSelect
              v-model="item.microbe_total_colony_res"
              :list="passList"
              :isWarning="item.microbe_total_colony_res === 0"
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
        <td>MPN/mL</td>
        <td>≤ 0.43</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.microbe_total_colony_res`"
            :rules="checkRules.microbe_coliform_bacteria_res"
          >
            <CommonSelect
              v-model="item.microbe_coliform_bacteria_res"
              :list="passList"
              :isWarning="item.microbe_coliform_bacteria_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Yeast（酵母菌）</td>
        <td>CFU/mL</td>
        <td>≤ 10</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.microbe_saccharomyces_res`"
            :rules="checkRules.microbe_saccharomyces_res"
          >
            <CommonSelect
              v-model="item.microbe_saccharomyces_res"
              :list="passList"
              :isWarning="item.microbe_saccharomyces_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Mold（霉菌）</td>
        <td>CFU/mL</td>
        <td>≤ 10</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.microbe_mold_res`"
            :rules="checkRules.microbe_mold_res"
          >
            <CommonSelect
              v-model="item.microbe_mold_res"
              :list="passList"
              :isWarning="item.microbe_mold_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td rowspan="2">Functional Com ponents （功效成分）</td>
        <td>Caffeine （咖啡因）</td>
        <td>mg/L</td>
        <td>红牛维生素功能饮料:140-200， 130~200（牛磺酸强化型）</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.functional_caffeine_res`"
            :rules="checkRules.functional_caffeine_res"
          >
            <CommonSelect
              v-model="item.functional_caffeine_res"
              :list="passList"
              :isWarning="item.functional_caffeine_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>

        <td rowspan="2">
          <!-- 功效成分签字 -->
          <div class="flex justify-center items-center">
            <el-button
              type="primary"
              @click="handleSignature('functional_signature')"
              :disabled="disabled"
            >
              签字
            </el-button>
            <el-image
              style="width: 100px; height: 100%"
              :src="useSetting.baseHttp + signature.functional_signature"
              :preview-src-list="[useSetting.baseHttp + signature.functional_signature]"
              v-if="signature.functional_signature"
            />
          </div>
          <el-form-item
            :prop="`signature.functional_signature`"
            :rules="checkRules.functional_signature"
          >
            <el-input v-model="signature.functional_signature" v-show="false"></el-input>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td>Taurine （牛磺酸）</td>
        <td>mg/L</td>
        <td>红牛维生素功能饮料:350-500， 3700~4800（牛磺酸强化型）</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.functional_taurine_res`"
            :rules="checkRules.functional_taurine_res"
          >
            <CommonSelect
              v-model="item.functional_taurine_res"
              :list="passList"
              :isWarning="item.functional_taurine_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
      </tr>
      <tr>
        <td colspan="2">Label（标签标识）</td>
        <td>-</td>
        <td>-</td>
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.label_res`"
            :rules="checkRules.label_res"
          >
            <CommonSelect
              v-model="item.label_res"
              :list="passList"
              :isWarning="item.label_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td>
          <!-- 标签标识签字 -->
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
        <td v-for="(item, index) in check_result_info">
          <el-form-item
            :prop="`check_result_info.${index}.composition_analysis_res`"
            :rules="checkRules.composition_analysis_res"
          >
            <CommonSelect
              v-model="item.composition_analysis_res"
              :list="passList"
              :isWarning="item.composition_analysis_res === 0"
              :disabled="disabled"
            ></CommonSelect>
          </el-form-item>
        </td>
        <td>
          <!-- 成分分析签字 -->
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
        <td :colspan="check_result_info.length + 3">
          <el-input v-model="conclusion" placeholder="检验意见" :disabled="disabled"></el-input>
        </td>
      </tr>
    </table>
  </el-form>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
