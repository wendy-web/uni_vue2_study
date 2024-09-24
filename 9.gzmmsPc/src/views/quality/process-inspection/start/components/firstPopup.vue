<script setup lang="ts">
import type { FormInstance } from "element-plus";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import { useselectData } from "@/hooks/quality/selectData";

type InfoType = {
  name: string;
  value: number | undefined;
  product_manag_uid_name: string; //生产部经理名称
  pz_manager_uid_name: string; //品质部经理名称
};
interface props {
  info: InfoType;
}

const { passList } = useselectData();

const props = withDefaults(defineProps<props>(), {
  info: () => ({
    name: "",
    value: undefined,
    product_manag_uid_name: "",
    pz_manager_uid_name: "",
  }),
});

const formRef = ref<FormInstance>();
const check_info = ref({ ...props.info });

const rules = {
  value: [{ required: true, message: "请选择检测结果" }],
};

const validateExecute = async () => {
  const validateRes = await formRef.value!.validate();
  return validateRes;
};
defineExpose({
  validateExecute,
  check_info,
});
</script>
<template>
  <div class="first-container">
    <el-form :model="check_info" ref="formRef" :rules="rules">
      <div class="mb-4">
        <p class="font-bold mb-4">检验信息</p>
        <table>
          <colgroup>
            <col style="width: 200px" />
          </colgroup>
          <tr>
            <td>检测项目</td>
            <td>检测结果</td>
          </tr>
          <tr>
            <td>{{ check_info.name }}</td>
            <td>
              <el-form-item prop="value">
                <CommonSelect v-model="check_info.value" :list="passList"></CommonSelect>
              </el-form-item>
            </td>
          </tr>
        </table>
      </div>
      <div>
        <p class="font-bold mb-4">确认信息</p>
        <table>
          <tr>
            <td>品管部经理</td>
            <td>生产部经理</td>
          </tr>
          <tr>
            <td>{{ check_info.pz_manager_uid_name }}</td>
            <td>{{ check_info.product_manag_uid_name }}</td>
          </tr>
        </table>
      </div>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>
