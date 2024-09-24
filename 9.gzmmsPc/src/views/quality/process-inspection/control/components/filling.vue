<script setup lang="ts">
/* 灌装组件 */
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

const filling = ref({
  check_info: [
    {
      check_time: "", //检测时间 其实是数组
      tcwt: "", //洗罐水温（≥90℃
      fcwt: "", //灌装温度（≥85℃）
      ehs: "", //环境卫生及岗位人员
      smo: "", //封口机卫生
      check_ret: undefined as FormNumType, //检验结果
    },
    // {
    //   check_time: "", //检测时间
    //   tcwt: "", //洗罐水温（≥90℃
    //   fcwt: "", //灌装温度（≥85℃）
    //   ehs: "", //环境卫生及岗位人员
    //   smo: "", //封口机卫生
    //   check_ret: undefined as FormNumType, //检验结果
    // },
  ],
  note: "",
});

filling.value.check_info = Array.from(
  { length: props.checkNum },
  () => filling.value.check_info[0],
);

function setData(data: any) {
  filling.value = data;
}

defineExpose({
  filling,
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
        <td colspan="2" v-for="item in filling.check_info">
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
          <el-input v-model="filling.note" placeholder="备注" :rows="6" type="textarea"></el-input>
        </td>
      </tr>
      <tr>
        <td>洗罐水温（≥90℃）</td>
        <td colspan="2" v-for="item in filling.check_info">
          <el-input v-model="item.tcwt" placeholder="洗罐水温"></el-input>
        </td>
      </tr>
      <tr>
        <td>灌装温度（≥85℃）</td>
        <td colspan="2" v-for="item in filling.check_info">
          <el-input v-model="item.fcwt" placeholder="灌装温度"></el-input>
        </td>
      </tr>
      <tr>
        <td>环境卫生及岗位人员</td>
        <td colspan="2" v-for="item in filling.check_info">
          <el-input v-model="item.ehs" placeholder="环境卫生及岗位人员"></el-input>
        </td>
      </tr>
      <tr>
        <td>封口机卫生</td>
        <td colspan="2" v-for="item in filling.check_info">
          <el-input v-model="item.smo" placeholder="封口机卫生"></el-input>
        </td>
      </tr>
      <tr>
        <td>检验结果</td>
        <td colspan="2" v-for="item in filling.check_info">
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
