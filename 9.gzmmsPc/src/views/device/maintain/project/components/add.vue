<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { EquipmentModule } from "@/api/device/common/types";
import TreeSelect from "@/components/DeptSelect/TreeSelect.vue";
import { useList } from "../utils/hook";

const { addRules } = useList();

interface Props {
  list: EquipmentModule.EqipmentType[];
}

const porps = defineProps<Props>();

type DetailListType = {
  maintenance_area: string;
  maintenance_requirements: string;
  note: string;
};

const formData = ref({
  name: "", //项目标准名称
  equipment_title: "", //资产类型名
  equipment_id: undefined as FormNumType, //资产类型id
  details: [] as DetailListType[],
});
const formRef = ref<FormInstance>();
const tableLoading = ref(false);

// 点击添加明细
function addDatail() {
  formData.value.details.push({
    maintenance_area: "",
    maintenance_requirements: "",
    note: "",
  });
}

// 单元格点击删除
function cellDel(index: number) {
  formData.value.details.splice(index, 1);
}

async function validateForm() {
  const result = await formRef.value?.validate((valid, fields) => {
    if (valid) {
      if (formData.value.details.length === 0) {
        ElMessage.warning("请添加明细");
        return false;
      }
      console.log("submit!");
      return true;
    } else {
      console.log("error submit!");
      return false;
    }
  });
  return result;
}

// 监听树形选择资产类型组件的事件
function nodeChange(val: string) {
  formData.value.equipment_title = val;
}

defineExpose({ validateForm, formData });
</script>
<template>
  <div class="container">
    <el-form ref="formRef" :model="formData" :rules="addRules">
      <div class="flex">
        <el-form-item label="项目标准名称" class="mr-4 flex-1" prop="name">
          <el-input v-model="formData.name" placeholder="请输入项目标准名称"></el-input>
        </el-form-item>
        <el-form-item label="资产类型" prop="" class="mr-4 flex-1">
          <TreeSelect
            :list="list"
            v-model="formData.equipment_id"
            @node-change="nodeChange"
          ></TreeSelect>
        </el-form-item>
      </div>
      <el-button type="primary" @click="addDatail" class="mb-4">添加明细</el-button>
      <el-table
        :data="formData.details"
        v-loading="tableLoading"
        scrollbar-always-on
        style="min-height: 300px"
      >
        <el-table-column label="保养部位" prop="maintenance_area">
          <template #header>
            <span class="text-red-500">*</span>
            <span>保养部位</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`details.${scope.$index}.maintenance_area`"
              :rules="addRules.maintenance_requirements"
            >
              <el-input v-model="scope.row.maintenance_area" placeholder="请输入"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="保养要求/标准" prop="maintenance_requirements">
          <template #header>
            <span class="text-red-500">*</span>
            <span>保养要求/标准</span>
          </template>
          <template #default="scope">
            <el-form-item
              :prop="`details.${scope.$index}.maintenance_requirements`"
              :rules="addRules.maintenance_requirements"
            >
              <el-input
                v-model="scope.row.maintenance_requirements"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="note">
          <template #default="scope">
            <el-form-item>
              <el-input v-model="scope.row.note" placeholder="请输入"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="cellDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<style lang="scss" scoped></style>
