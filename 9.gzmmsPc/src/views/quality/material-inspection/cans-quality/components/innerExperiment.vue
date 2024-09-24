<script setup lang="ts">
import type { FieldValues } from "plus-pro-components";
import { useAdd } from "../utils/add";

const { passList } = useAdd();

const passOptions = passList.map((item) => {
  return {
    label: item.name,
    value: item.id,
  };
});

/* 内涂膜实验结果弹窗 */
interface Props {
  /** 顶部信息通用数据 */
  descriptionsData: {
    batch_no: string;
    group_no: number;
  };
  experimentForm: FieldValues;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  descriptionsData: () => ({ batch_no: "", group_no: 1, unit: "" }),
  standardText: "",
  experimentForm: () => ({
    boiling_experiment_res: undefined as FormNumType,
    acid_boiling_experiment_res: undefined as FormNumType,
    adhesion_experiment_res: undefined as FormNumType,
    dyeing_experiment_res: undefined as FormNumType,
    resistance_outer_coating_res: undefined as FormNumType,
  }),
  disabled: false,
});

const formData = ref(props.experimentForm);
defineExpose({
  formData,
});

watch(
  () => props.experimentForm,
  (newVal) => {
    formData.value = newVal;
  },
  {
    immediate: true,
  },
);

const infoColumns: PlusColumnList = [
  {
    label: "生产批号",
    prop: "batch_no",
  },
  {
    label: "样品数",
    prop: "number",
  },
  {
    label: "组别",
    prop: "index",
  },
];

const formatColumns: PlusColumnList = [
  {
    label: "水煮实验",
    prop: "boiling_experiment_res",
    valueType: "select",
    options: passOptions,
  },
  {
    label: "酸煮实验",
    prop: "acid_boiling_experiment_res",
    valueType: "select",
    options: passOptions,
  },
  {
    label: "内涂膜附着力实验",
    prop: "adhesion_experiment_res",
    valueType: "select",
    options: passOptions,
  },
  {
    label: "染色实验",
    prop: "dyeing_experiment_res",
    valueType: "select",
    options: passOptions,
  },
  {
    label: "外涂层耐酸实验",
    prop: "resistance_outer_coating_res",
    valueType: "select",
    options: () => {
      return passList.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    },
  },
];
</script>
<template>
  <div class="measured-wrapper">
    <PlusDescriptions
      :column="3"
      :columns="infoColumns"
      :data="descriptionsData"
      class="mb-4"
    ></PlusDescriptions>
    <PlusForm
      :disabled="disabled"
      ref="PlusFormRef"
      v-model="formData"
      labelWidth="130"
      :columns="formatColumns"
      :row-props="{ gutter: 20 }"
      :col-props="{
        span: 8,
      }"
      :hasFooter="false"
    ></PlusForm>
  </div>
</template>
<style lang="scss" scoped></style>
