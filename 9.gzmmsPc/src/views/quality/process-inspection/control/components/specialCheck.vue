<script setup lang="ts">
/* 专检信息组件 */
import { cloneDeep } from "@pureadmin/utils";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import { useAdd } from "../utils/add";

const props = defineProps<{
  brand: string;
  isDetailDisable?: boolean;
}>();

const { passList, ngAndOkList } = useAdd();

const special_check = reactive({
  //冷却水--- 战马
  cooling_water: {
    conductivity: "", // 电导率
    tds: "", //TDS(mg/L)
    sal: "",
    cooling_water_ret: undefined as FormNumType, //检验结果
    note: "",
  },
  //打码岗位
  coding: {
    list: [
      {
        check_time: "", //检验时间
        batch_num: "", //批次号
        id_card: "", //罐底二维码身份编码
        coding_ret: undefined as FormNumType, //打码岗位-20罐产品质量
      },
    ],
    check_ret: undefined as FormNumType, //检验结果
    note: "",
  },
  // 拆包岗位
  unpacking: {
    list: [
      {
        check_time: "", //检验时间
        unpacking_ret: undefined as FormNumType, //拆包岗位-20罐空罐质量 OK/NG
      },
    ],
    check_ret: undefined as FormNumType, //检验结果
    note: "",
  },
  // 码垛岗位--红牛
  stacking: {
    list: [
      {
        check_time: "", //检验时间
        batch_num: "", //批号
        id_card: "", //身份编号
        stacking_ret: undefined as FormNumType, //二维码质量
      },
    ],
    check_ret: undefined as FormNumType, //检验结果
    note: "",
  },
});

const { cooling_water, coding, unpacking, stacking } = toRefs(special_check);
// coding.value.list = Array.from({ length: 8 }, () => cloneDeep(coding.value.list[0]));
// unpacking.value.list = Array.from({ length: 8 }, () => cloneDeep(unpacking.value.list[0]));
// stacking.value.list = Array.from({ length: 8 }, () => cloneDeep(stacking.value.list[0]));

function tableAdd() {
  let currentLen = coding.value.list.length;
  if (currentLen >= 8) {
    ElMessage.warning("最多只能添加8列~");
    return;
  }
  coding.value.list = Array.from({ length: currentLen + 1 }, () => cloneDeep(coding.value.list[0]));
  unpacking.value.list = Array.from({ length: currentLen + 1 }, () =>
    cloneDeep(unpacking.value.list[0]),
  );
  stacking.value.list = Array.from({ length: currentLen + 1 }, () =>
    cloneDeep(stacking.value.list[0]),
  );
}

function tableDel() {
  let currentLen = coding.value.list.length;
  if (currentLen === 1) {
    ElMessage.warning("只剩最后一列的了,不能再删除了~");
    return;
  }
  coding.value.list.pop();
  unpacking.value.list.pop();
  stacking.value.list.pop();
}

function setData(data: any) {
  coding.value = data.coding;
  unpacking.value = data.unpacking;
  if (props.brand === "ND2") {
    cooling_water.value = data.cooling_water;
  } else {
    stacking.value = data.stacking;
  }
}

defineExpose({
  special_check,
  setData,
});
</script>
<template>
  <el-form :disabled="isDetailDisable">
    <div class="mb-2">
      <el-button type="primary" @click="tableAdd">新增</el-button>
      <el-button @click="tableDel">删除</el-button>
    </div>
    <table>
      <tr>
        <!-- 每小时专检- 战马时占据6行,红牛时占据10行 -->
        <td :rowspan="brand === 'ND2' ? 6 : 10" class="font-bold">每小时专检</td>
        <!-- 拆包岗位时间- -->
        <td colspan="2" class="font-bold">时间</td>
        <td v-for="(item, index) in unpacking.list" :key="index">
          <el-time-picker
            v-model="item.check_time"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
            placeholder="检验时间"
          />
        </td>
        <td class="font-bold">检验结果</td>
        <td class="font-bold">备注</td>
      </tr>
      <tr>
        <td>拆包岗位</td>
        <td>20罐空罐质量：</td>
        <td v-for="(item, index) in unpacking.list" :key="index">
          <el-select v-model="item.unpacking_ret" style="width: 100%">
            <el-option
              v-for="sub in ngAndOkList"
              :key="sub.id"
              :label="sub.name"
              :value="sub.id"
            ></el-option>
          </el-select>
        </td>
        <td>
          <CommonSelect
            v-model="unpacking.check_ret"
            :list="passList"
            :isWarning="unpacking.check_ret === 0"
          ></CommonSelect>
        </td>
        <td>
          <el-input
            v-model.lazy="unpacking.note"
            placeholder="拆包岗位备注"
            :rows="1"
            type="textarea"
          />
        </td>
      </tr>
      <tr>
        <!-- 打码岗位时间  -->
        <td colspan="2" class="font-bold">时间</td>
        <td v-for="(item, index) in coding.list" :key="index">
          <el-time-picker
            v-model="item.check_time"
            format="HH:mm"
            value-format="HH:mm"
            style="width: 100%"
            placeholder="检验时间"
          />
        </td>
        <td class="font-bold">检验结果</td>
        <td class="font-bold">备注</td>
      </tr>
      <tr>
        <td rowspan="3">打码岗位</td>
        <td>批号：</td>
        <td v-for="(item, index) in coding.list" :key="index">
          <el-input v-model="item.batch_num" maxlength="5" placeholder="批号"></el-input>
        </td>
        <td rowspan="3">
          <CommonSelect
            v-model="coding.check_ret"
            :list="passList"
            :isWarning="coding.check_ret === 0"
          ></CommonSelect>
        </td>
        <td rowspan="3">
          <el-input
            v-model.lazy="coding.note"
            placeholder="打码岗位备注"
            :rows="2"
            type="textarea"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td>罐底二维码身份编码</td>
        <td v-for="(item, index) in coding.list" :key="index">
          <el-input v-model="item.id_card" placeholder="罐底二维码身份编码"></el-input>
        </td>
      </tr>
      <tr>
        <td>20罐产品质量：</td>
        <td v-for="(item, index) in coding.list" :key="index">
          <el-select v-model="item.coding_ret" style="width: 100%">
            <el-option
              v-for="sub in ngAndOkList"
              :key="sub.id"
              :label="sub.name"
              :value="sub.id"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <!-- 红牛专属的码垛岗位开始 -->
      <template v-if="brand === 'ND1'">
        <tr>
          <td colspan="2">时间</td>
          <td v-for="(item, index) in stacking.list" :key="index">
            <el-time-picker
              v-model="item.check_time"
              format="HH:mm"
              value-format="HH:mm"
              style="width: 100%"
              placeholder="检验时间"
            />
          </td>
          <td class="font-bold">检验结果</td>
          <td class="font-bold">备注</td>
        </tr>
        <tr>
          <td rowspan="3">码垛岗位</td>
          <td>批号</td>
          <td v-for="(item, index) in stacking.list" :key="index">
            <el-input v-model.lazy="item.batch_num" maxlength="5" placeholder="批号"></el-input>
          </td>
          <td rowspan="3">
            <CommonSelect
              v-model="stacking.check_ret"
              :list="passList"
              :isWarning="stacking.check_ret === 0"
            ></CommonSelect>
          </td>
          <td rowspan="3">
            <el-input
              v-model.lazy="stacking.note"
              placeholder="码垛岗位备注"
              :rows="3"
              type="textarea"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td>身份编号</td>
          <td v-for="(item, index) in stacking.list" :key="index">
            <el-input v-model.lazy="item.id_card" placeholder="身份编号"></el-input>
          </td>
        </tr>
        <tr>
          <td>二维码质量</td>
          <td v-for="(item, index) in stacking.list" :key="index">
            <el-select v-model="item.stacking_ret" style="width: 100%">
              <el-option
                v-for="sub in ngAndOkList"
                :key="sub.id"
                :label="sub.name"
                :value="sub.id"
              ></el-option>
            </el-select>
          </td>
        </tr>
      </template>
    </table>

    <table class="mt-4">
      <!-- 战马专属的冷却水开始 -->
      <tr v-if="brand === 'ND2'">
        <td>每班专检</td>
        <td>冷却水</td>
        <td>电导率（μs/cm）：</td>
        <td colspan="2">
          <el-input v-model.lazy="cooling_water.conductivity" placeholder="电导率"></el-input>
        </td>
        <td>TDS(mg/L)：</td>
        <td colspan="2">
          <el-input v-model.lazy="cooling_water.tds" placeholder="tds"></el-input>
        </td>
        <td>SAl（ppt）：</td>
        <td colspan="2">
          <el-input v-model.lazy="cooling_water.sal" placeholder="SAl"></el-input>
        </td>
        <td>
          <CommonSelect
            v-model="cooling_water.cooling_water_ret"
            :list="passList"
            :isWarning="cooling_water.cooling_water_ret === 0"
          ></CommonSelect>
        </td>
        <td>
          <el-input
            v-model="cooling_water.note"
            placeholder="冷却水备注"
            :rows="3"
            type="textarea"
          ></el-input>
        </td>
      </tr>
      <!-- 战马专属的冷却水结束 -->
    </table>
  </el-form>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
