<script setup lang="ts">
/* 码垛组件 */
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import { useAdd } from "../utils/add";

const { passList } = useAdd();
const props = withDefaults(
  defineProps<{
    isDetailDisable?: boolean;
    checkNum: number;
    checkAllShow?: boolean;
  }>(),
  {
    isDetailDisable: false,
    checkNum: 2,
    checkAllShow: true,
  },
);
const stacking = ref({
  check_info: [
    {
      check_time: "", //检测时间
      batch_num: "", //批号
      box_no: "", //箱号
      csq: "", //封箱及热缩膜质量
      product_quality: "", //产品外观质量
      check_ret: undefined as FormNumType, //检验结果
    },
    // {
    //   check_time: "", //检测时间
    //   batch_num: "", //批号
    //   box_no: "", //箱号
    //   csq: "", //封箱及热缩膜质量
    //   product_quality: "", //产品外观质量
    //   check_ret: undefined as FormNumType, //检验结果
    // },
  ],
  note: "",
});

stacking.value.check_info = Array.from({ length: props.checkNum }, () => stacking.value.check_info[0]);

function setData(data: any) {
  stacking.value = data;
}

defineExpose({
  stacking,
  setData,
});
</script>
<template>
  <el-form :disabled="isDetailDisable">
    <table>
      <tr>
        <td>检验项目</td>
        <td :colspan="checkNum == 1 ? 2 : 4">检测信息</td>
        <td>备注</td>
      </tr>
      <tr>
        <td>时间</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <el-time-picker
            v-model="item.check_time"
            format="HH:mm"
            value-format="HH:mm"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%"
          />
        </td>
        <td rowspan="8">
          <el-input v-model="stacking.note" placeholder="备注" :rows="6" type="textarea"></el-input>
        </td>
      </tr>
      <tr>
        <td>批号</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <el-input v-model="item.batch_num" placeholder="批号"></el-input>
        </td>
      </tr>
      <tr>
        <td>箱号</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <el-input v-model="item.box_no" placeholder="箱号"></el-input>
        </td>
      </tr>
      <tr>
        <td>封箱及热缩膜质量</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <el-input v-model="item.csq" placeholder="封箱及热缩膜质量"></el-input>
        </td>
      </tr>
      <tr>
        <td>产品外观质量</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <el-input v-model="item.product_quality" placeholder="产品外观质量"></el-input>
        </td>
      </tr>

      <tr>
        <td>检验结果</td>
        <td colspan="2" v-for="item in stacking.check_info">
          <CommonSelect
            v-model="item.check_ret"
            :list="passList"
            :isWarning="item.check_ret === 0"
          ></CommonSelect>
        </td>
      </tr>
    </table>
  </el-form>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
