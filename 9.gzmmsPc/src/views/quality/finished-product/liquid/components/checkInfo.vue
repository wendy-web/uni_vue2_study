<script setup lang="tsx">
import {
  type FormInstance,
  type FormRules,
  type TableColumnCtx,
  type TableInstance,
  dayjs,
} from "element-plus";
// 签名组件
import QualitySignDialog from "@/components/Device/SignDialog/index.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useAdd } from "../utils/add";

// 签名弹窗ref
const signDialogRef = ref();
// 签名弹窗配置
const dialogOptions = {
  width: "60%",
  btnClass: "w-[80px]",
  draggable: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
  btnLoading: false,
  showClose: false,
};
const props = defineProps([
  "checkTablecolumns",
  "checkFormRules",
  "checkTableForm",
  "formData",
  "checkTableData",
  "formLoading",
  "editDisabled",
  "tableLableOptions",
  "tableItem",
  "useSetting",
  "is_submit",
]);

/** puretable的ref */
const prueTableRef = ref();
const passList = [
  {
    name: "合格",
    id: 1,
  },
  {
    name: "不合格",
    id: 0,
  },
];
const { tableFormRef, validatorCell } = useAdd();
const formatter = (value: any) => {
  return value.replace(/[^a-zA-Z0-9]/g, "");
};

async function validateForm() {
  if (!tableFormRef.value) return true;
  const vaildateRes = await tableFormRef.value
    .validate((valid, fields) => {
      for (const keys in fields) {
        if (fields[keys]) {
          // 弹出每个字段的错误提示
          ElMessage.warning(fields[keys][0].message);
          tableFormRef.value.scrollToField(keys);
          break;
        }
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
  return vaildateRes;
}

// 检查单元格是否符合标准值 自定义class
function checkCellClass(value: any, key: string) {
  let className = "";
  if (!props.tableLableOptions || !value) return className;
  let ok = validatorCell(props.tableLableOptions[key], value);
  className = ok ? "" : "warn-text";
  return className;
}
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});
// 签字提交: key是tableItem的字段名
async function handleSign(key: string) {
  // 点击签名校验数据是否填写:sense_check_user_signature='',solid_check_user_signature='',microbe_check_user_signature=''
  // 感官指标
  // if (key == "sense_check_user_signature") {
  //   return;
  // }
  addDialog({
    ...dialogOptions,
    title: "签名",
    contentRenderer: () =>
      h(QualitySignDialog, {
        ref: signDialogRef,
      }),
    beforeCancel: (done, { options, index }) => {
      done();
    },
    beforeSure: async (done, { options, index }) => {
      updateDialog(true, "btnLoading");
      const result = await signDialogRef.value.handleGenerate();
      // 更新签名地址
      props.tableItem[key] = result;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}
onMounted(() => {});
// 将方法暴露给父组件
defineExpose({
  validateForm,
  tableFormRef,
});
</script>
<template>
  <div class="app-box !p-0 flex-1">
    <div class="flex justify-end mb-[10px]">
      <div class="flex">
        <div>
          不合格数:
          <span class="text-red-800">{{ formData.total_abnormal || 0 }}</span>
        </div>
      </div>
    </div>
    <div class="pure-table-box">
      <el-form
        :model="tableItem"
        ref="tableFormRef"
        :rules="checkFormRules"
        :disabled="editDisabled"
      >
        <div class="table-box w-[100%] overflow-y-auto">
          <table>
            <thead>
              <tr>
                <th colspan="2">检验项目</th>
                <th class="w-[80px]">单位</th>
                <th class="w-[240px]">标准值</th>
                <th>测定值</th>
                <th>单项判定</th>
                <th class="w-[200px]">检验员签名</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowspan="4" class="w-[80px] text-center">
                  <div>Sensory</div>
                  <div>Evaluation</div>
                  <div>(感观指标)</div>
                </td>
                <td class="w-[90px] text-right">色泽</td>
                <td class="text-center">—</td>
                <td>无色或浅黄色</td>
                <td>
                  <el-form-item :prop="`sense_color_val`" :rules="checkFormRules.sense_color_val">
                    <el-input v-model="tableItem.sense_color_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item prop="sense_color_res" :rules="checkFormRules.sense_color_res">
                    <el-select v-model="tableItem.sense_color_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
                <td rowspan="4">
                  <el-form-item :prop="`tableItem.sense_check_user_signature`" class="sign-cell">
                    <el-image
                      :src="useSetting.baseHttp + tableItem.sense_check_user_signature"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[
                        useSetting.baseHttp + tableItem.sense_check_user_signature,
                      ]"
                      :initial-index="1"
                      fit="contain"
                    >
                      <template #error>
                        <el-button type="primary" @click="handleSign('sense_check_user_signature')">
                          点击签名
                        </el-button>
                      </template>
                    </el-image>
                    <el-button
                      v-if="tableItem.sense_check_user_signature"
                      class="mt-[20px]"
                      type="default"
                      @click="tableItem.sense_check_user_signature = ''"
                    >
                      重置签名
                    </el-button>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="text-right">滋味和气味</td>
                <td class="text-center">—</td>
                <td>无臭，甜味温和，无异味</td>
                <td>
                  <el-form-item :prop="`sense_smell_val`" :rules="checkFormRules.sense_smell_val">
                    <el-input v-model="tableItem.sense_smell_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`sense_smell_res`" :rules="checkFormRules.sense_smell_res">
                    <el-select v-model="tableItem.sense_smell_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="text-right">组织形态</td>
                <td class="text-center">—</td>
                <td>呈透明清亮液体</td>
                <td>
                  <el-form-item
                    :prop="`sense_morphology_val`"
                    :rules="checkFormRules.sense_morphology_val"
                  >
                    <el-input v-model="tableItem.sense_morphology_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`sense_morphology_res`"
                    :rules="checkFormRules.sense_morphology_res"
                  >
                    <el-select
                      v-model="tableItem.sense_morphology_res"
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
                </td>
              </tr>
              <tr>
                <td class="text-right">杂质</td>
                <td class="text-center">—</td>
                <td>无肉眼可见杂质</td>
                <td>
                  <el-form-item
                    :prop="`sense_impurity_val`"
                    :rules="checkFormRules.sense_impurity_val"
                  >
                    <el-input v-model="tableItem.sense_impurity_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`sense_impurity_res`"
                    :rules="checkFormRules.sense_impurity_res"
                  >
                    <el-select
                      v-model="tableItem.sense_impurity_res"
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
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">干物质（固形物）含量</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.solid_content.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.solid_content.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`solid_content_val`"
                    :rules="checkFormRules.solid_content_val"
                    :class="checkCellClass(tableItem.solid_content_val, 'solid_content')"
                  >
                    <el-input type="number" v-model="tableItem.solid_content_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`solid_content_res`"
                    :rules="checkFormRules.solid_content_res"
                  >
                    <el-select
                      v-model="tableItem.solid_content_res"
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
                </td>
                <td rowspan="7">
                  <el-form-item :prop="`tableItem.solid_check_user_signature`" class="sign-cell">
                    <el-image
                      :src="useSetting.baseHttp + tableItem.solid_check_user_signature"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[
                        useSetting.baseHttp + tableItem.solid_check_user_signature,
                      ]"
                      :initial-index="1"
                      fit="contain"
                    >
                      <template #error>
                        <el-button type="primary" @click="handleSign('solid_check_user_signature')">
                          点击签名
                        </el-button>
                      </template>
                    </el-image>
                    <el-button
                      v-if="tableItem.solid_check_user_signature"
                      class="mt-[20px]"
                      type="default"
                      @click="tableItem.solid_check_user_signature = ''"
                    >
                      重置签名
                    </el-button>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">干物质中蔗糖分</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.sucrose_in_dry_matter.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.sucrose_in_dry_matter.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`sucrose_in_dry_matter_val`"
                    :rules="checkFormRules.sucrose_in_dry_matter_val"
                    :class="
                      checkCellClass(tableItem.sucrose_in_dry_matter_val, 'sucrose_in_dry_matter')
                    "
                  >
                    <el-input type="number" v-model="tableItem.sucrose_in_dry_matter_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`sucrose_in_dry_matter_res`"
                    :rules="checkFormRules.sucrose_in_dry_matter_res"
                  >
                    <el-select
                      v-model="tableItem.sucrose_in_dry_matter_res"
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
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">干物质中还原糖分</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.reduced_sugars_matter.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.reduced_sugars_matter.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`reduced_sugars_matter_val`"
                    :rules="checkFormRules.reduced_sugars_matter_val"
                    :class="
                      checkCellClass(tableItem.reduced_sugars_matter_val, 'reduced_sugars_matter')
                    "
                  >
                    <el-input type="number" v-model="tableItem.reduced_sugars_matter_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`reduced_sugars_matter_res`"
                    :rules="checkFormRules.reduced_sugars_matter_res"
                  >
                    <el-select
                      v-model="tableItem.reduced_sugars_matter_res"
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
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">pH</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.ph.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.ph.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`ph_val`"
                    :rules="checkFormRules.ph_val"
                    :class="checkCellClass(tableItem.ph_val, 'ph')"
                  >
                    <el-input type="number" v-model="tableItem.ph_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`ph_res`" :rules="checkFormRules.ph_res">
                    <el-select v-model="tableItem.ph_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">色值</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.color.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.color.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`color_val`"
                    :rules="checkFormRules.color_val"
                    :class="checkCellClass(tableItem.color_val, 'color')"
                  >
                    <el-input type="number" v-model="tableItem.color_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`color_res`" :rules="checkFormRules.color_res">
                    <el-select v-model="tableItem.color_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">电导率</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.electric_conductivity.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.electric_conductivity.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`electric_conductivity_val`"
                    :rules="checkFormRules.electric_conductivity_val"
                    :class="
                      checkCellClass(tableItem.electric_conductivity_val, 'electric_conductivity')
                    "
                  >
                    <el-input type="number" v-model="tableItem.electric_conductivity_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`electric_conductivity_res`"
                    :rules="checkFormRules.electric_conductivity_res"
                  >
                    <el-select
                      v-model="tableItem.electric_conductivity_res"
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
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center">混浊度</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.turbidity.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.turbidity.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`turbidity_val`"
                    :rules="checkFormRules.turbidity_val"
                    :class="checkCellClass(tableItem.turbidity_val, 'turbidity')"
                  >
                    <el-input type="number" v-model="tableItem.turbidity_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`turbidity_res`" :rules="checkFormRules.turbidity_res">
                    <el-select v-model="tableItem.turbidity_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td rowspan="4" class="text-center">
                  <div>Microbiologica</div>
                  <div>(微生物)</div>
                </td>
                <td class="text-right">大肠菌群</td>

                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_coliform_bacteria.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_coliform_bacteria.initval || "—" }}
                  </div>
                </td>

                <td>
                  <el-form-item
                    :prop="`microbe_coliform_bacteria_val`"
                    :rules="checkFormRules.microbe_coliform_bacteria_val"
                    :class="
                      checkCellClass(
                        tableItem.microbe_coliform_bacteria_val,
                        'microbe_coliform_bacteria',
                      )
                    "
                  >
                    <el-input v-model="tableItem.microbe_coliform_bacteria_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`microbe_coliform_bacteria_res`"
                    :rules="checkFormRules.microbe_coliform_bacteria_res"
                  >
                    <el-select
                      v-model="tableItem.microbe_coliform_bacteria_res"
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
                </td>
                <td rowspan="4">
                  <el-form-item :prop="`tableItem.microbe_check_user_signature`" class="sign-cell">
                    <el-image
                      :src="useSetting.baseHttp + tableItem.microbe_check_user_signature"
                      :zoom-rate="1.2"
                      :max-scale="7"
                      :min-scale="0.2"
                      :preview-src-list="[
                        useSetting.baseHttp + tableItem.microbe_check_user_signature,
                      ]"
                      :initial-index="1"
                      fit="contain"
                    >
                      <template #error>
                        <el-button
                          type="primary"
                          @click="handleSign('microbe_check_user_signature')"
                        >
                          点击签名
                        </el-button>
                      </template>
                    </el-image>
                    <el-button
                      v-if="tableItem.microbe_check_user_signature"
                      class="mt-[20px]"
                      type="default"
                      @click="tableItem.microbe_check_user_signature = ''"
                    >
                      重置签名
                    </el-button>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="text-right">细菌总数</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.total_colony.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.total_colony.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`microbe_total_colony_val`"
                    :rules="checkFormRules.microbe_total_colony_val"
                    :class="checkCellClass(tableItem.microbe_total_colony_val, 'total_colony')"
                  >
                    <el-input v-model="tableItem.microbe_total_colony_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item
                    :prop="`microbe_total_colony_res`"
                    :rules="checkFormRules.microbe_total_colony_res"
                  >
                    <el-select
                      v-model="tableItem.microbe_total_colony_res"
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
                </td>
              </tr>
              <tr>
                <td class="text-right">酵母菌</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_saccharomyces.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_saccharomyces.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`microbe_saccharomyces_val`"
                    :rules="checkFormRules.microbe_saccharomyces_val"
                    :class="
                      checkCellClass(tableItem.microbe_saccharomyces_val, 'microbe_saccharomyces')
                    "
                  >
                    <el-input v-model="tableItem.microbe_saccharomyces_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`microbe_saccharomyces_res`">
                    <el-select
                      v-model="tableItem.microbe_saccharomyces_res"
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
                </td>
              </tr>
              <tr>
                <td class="text-right">霉菌</td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_mold.unit || "—" }}
                  </div>
                </td>
                <td>
                  <div class="text-center">
                    {{ tableLableOptions?.microbe_mold.initval || "—" }}
                  </div>
                </td>
                <td>
                  <el-form-item
                    :prop="`microbe_mold_val`"
                    :rules="checkFormRules.microbe_mold_val"
                    :class="checkCellClass(tableItem.microbe_mold_val, 'microbe_mold')"
                  >
                    <el-input v-model="tableItem.microbe_mold_val" />
                  </el-form-item>
                </td>
                <td>
                  <el-form-item :prop="`microbe_mold_res`" :rules="checkFormRules.microbe_mold_res">
                    <el-select v-model="tableItem.microbe_mold_res" placeholder="请选择" filterable>
                      <el-option
                        v-for="item in passList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">Conclusion（检测意见）：</td>
                <td colspan="6">
                  <el-form-item :prop="`tableItem.conclusion`">
                    <el-input v-model="tableItem.conclusion" type="textarea" placeholder="" />
                  </el-form-item>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.warn-text .el-input__inner) {
  color: var(--el-color-danger);
}
:deep(.warn-text .el-input__wrapper) {
  font-weight: bold;
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
.table-box {
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
  }
  th,
  td {
    border: 1px solid #ebeef5;
    padding: 8px;
  }
  th {
    background-color: #ecf5ff !important;
  }
  /* 设置单元格的高度和宽度 */
  .fixed-width {
    width: 100px; /* 设置单元格宽度 */
  }
  .fixed-height {
    height: 50px; /* 设置单元格高度 */
  }
  /* 固定第一列 */
  .fixed-column {
    position: sticky;
    left: 0;
    background-color: white; /* 确保固定列的背景颜色 */
    z-index: 100;
  }
}
:deep(.sign-cell .el-form-item__content) {
  justify-content: center;
}
</style>
