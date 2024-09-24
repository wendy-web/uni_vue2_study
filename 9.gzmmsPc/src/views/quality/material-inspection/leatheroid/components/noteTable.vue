<script setup lang="ts">
interface Props {
  /** 基础表单的产品大类(产品品牌) */
  brand: string;
  /** 基础表单的产品类别 */
  classType: number | undefined;
  /** 是否详情页面的判断,默认false,不是 */
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  brand: "",
  classType: undefined,
  disabled: false,
});

/** 是否隐藏红牛相关--与add.tsx一致 */
const hideRedBull = computed(() => {
  return props.brand !== "ND1";
});

/** 是否隐藏战马相关--与add.tsx一致  */
const hideWarHorse = computed(() => {
  return props.brand !== "ND2";
});

/** 是否隐藏箱内码--与add.tsx一致  */
const hideClassType = computed(() => {
  return props.classType !== 1;
});

/** 重量检测结果备注 */
const weight_res_note = ref("");
/**   颜色检测结果备注  */
const color_res_note = ref("");
/**   红牛标记检测备注  */
const red_bull_res_note = ref("");
/**   战马标记检测备注  */
const warhorse_res_note = ref("");
/**   印刷质量检测备注  */
const printing_quality_res_note = ref("");
/**   开合裂度检测备注  */
const opening_crack_res_note = ref("");
/**   条形码检测备注  */
const barcode_res_note = ref("");
/**   激光码检测备注  */
const laser_code_res_note = ref("");
/**   激光码、二维码检测备注  */
const laser_qr_code_res_note = ref("");

/** 获取备注 */
function getNoteValue() {
  return {
    weight_res_note: weight_res_note.value,
    color_res_note: color_res_note.value,
    red_bull_res_note: hideRedBull.value ? undefined : red_bull_res_note.value,
    warhorse_res_note: hideWarHorse.value ? undefined : warhorse_res_note.value,
    printing_quality_res_note: printing_quality_res_note.value,
    opening_crack_res_note: hideWarHorse.value ? undefined : opening_crack_res_note.value,
    barcode_res_note: hideWarHorse.value ? undefined : barcode_res_note.value,
    laser_code_res_note: hideWarHorse.value ? undefined : laser_code_res_note.value,
    laser_qr_code_res_note: hideRedBull.value ? undefined : laser_qr_code_res_note.value,
  };
}

defineExpose({
  getNoteValue,
  weight_res_note,
  color_res_note,
  red_bull_res_note,
  warhorse_res_note,
  printing_quality_res_note,
  opening_crack_res_note,
  barcode_res_note,
  laser_code_res_note,
  laser_qr_code_res_note,
});
</script>
<template>
  <table>
    <colgroup>
      <col style="width: 50px" v-if="!disabled" />
      <col style="width: 90px" />
    </colgroup>
    <tr>
      <td :colspan="disabled ? 1 : 2">备注</td>
      <td>
        <span>--</span>
      </td>
      <td>
        <el-input v-model="weight_res_note" placeholder="重量" :disabled="disabled"></el-input>
      </td>
      <td>
        <el-input v-model="color_res_note" placeholder="色泽" :disabled="disabled"></el-input>
      </td>
      <td v-if="!hideRedBull">
        <el-input
          v-model="red_bull_res_note"
          placeholder="红牛标记"
          :disabled="disabled"
        ></el-input>
      </td>
      <td v-if="!hideWarHorse">
        <el-input
          v-model="warhorse_res_note"
          placeholder="战马标记"
          :disabled="disabled"
        ></el-input>
      </td>
      <td>
        <el-input
          v-model="printing_quality_res_note"
          placeholder="印刷质量"
          :disabled="disabled"
        ></el-input>
      </td>
      <td v-if="!hideWarHorse">
        <el-input
          v-model="opening_crack_res_note"
          placeholder="开合裂度"
          :disabled="disabled"
        ></el-input>
      </td>
      <td v-if="!hideWarHorse">
        <el-input v-model="barcode_res_note" placeholder="条形码" :disabled="disabled"></el-input>
      </td>
      <td v-if="!hideWarHorse">
        <el-input
          v-model="laser_code_res_note"
          placeholder="激光码"
          :disabled="disabled"
        ></el-input>
      </td>
      <td v-if="!hideRedBull">
        <el-input
          v-model="laser_qr_code_res_note"
          placeholder="激光码、二维码"
          :disabled="disabled"
        ></el-input>
      </td>
      <td colspan="3" v-if="!hideClassType">
        <span>--</span>
      </td>
    </tr>
  </table>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
table {
  td {
    border-right: 1px solid #f6f4f4;
  }
}
</style>
