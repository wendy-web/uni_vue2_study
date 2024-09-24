<script setup lang="ts">
/* 打码组件 */
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


const coding = ref({
  check_info: [
    {
      check_time: "", //检测时间
      ehs: "", //环境卫生及岗位人员
      cooling_water: {
        brix: "", // Brix（%）
        pH: "", //pH（5.2-8.0）
      },
      check_ret: undefined as FormNumType, //检验结果
    },
    // {
    //   check_time: "", //检测时间
    //   ehs: "", //环境卫生及岗位人员
    //   cooling_water: {
    //     brix: "", // Brix（%）
    //     pH: "", //pH（5.2-8.0）
    //   },
    //   check_ret: undefined as FormNumType, //检验结果
    // },
  ],
  note: "",
});

coding.value.check_info = Array.from({ length: props.checkNum }, () => coding.value.check_info[0]);

function setData(data: any) {
  coding.value = data;
}

defineExpose({
  coding,
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
        <td colspan="2" v-for="item in coding.check_info">
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
          <el-input v-model="coding.note" placeholder="备注" :rows="6" type="textarea"></el-input>
        </td>
      </tr>
      <tr>
        <td>环境卫生及岗位人员</td>
        <td colspan="2" v-for="item in coding.check_info">
          <el-input v-model="item.ehs" placeholder="环境卫生及岗位人员"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="2">冷却水</td>
        <template v-for="item in coding.check_info">
          <td>Brix（%）：</td>
          <td><el-input v-model="item.cooling_water.brix" placeholder="Brix"></el-input></td>
        </template>

        <!-- <td>Brix（%）：</td>
      <td></td> -->
      </tr>
      <tr>
        <template v-for="item in coding.check_info">
          <td>pH（5.2-8.0）：</td>
          <td><el-input v-model="item.cooling_water.pH" placeholder="ph"></el-input></td>
        </template>
        <!-- <td>pH（5.2-8.0）：</td>
      <td></td> -->
      </tr>

      <tr>
        <td>检验结果</td>
        <td colspan="2" v-for="item in coding.check_info">
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
