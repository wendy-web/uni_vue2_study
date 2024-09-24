<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { getEquipmentSelectApi } from "@/api/device/common/index";
import type { EquipmentModule } from "@/api/device/common/types";
import type { IdNameType } from "@/api/device/common/types";
import { useBaseData } from "@/hooks/device/baseData";
import { useAdd } from "./add";

interface Props {
  list: IdNameType[];
}
const props = withDefaults(defineProps<Props>(), { list: () => [] });
const emit = defineEmits(["confirm"]);

const { getTypeList, treeData } = useBaseData();

const model = defineModel({ required: true, default: false });

const { pagination, columns } = useAdd();

const formRef = ref<FormInstance>();
const formData = ref({
  equipment_type_id: undefined as FormNumType,
  eq_id: undefined as FormNumType,
  equipment_type_name: "",
  rel_id: undefined as FormNumType,
});

const rules = {
  equipment_type_id: [
    {
      required: true,
      message: "请选择资产类型",
      trigger: "change",
    },
  ],

  rel_id: [{ required: true, message: "请选择资产类型", trigger: "change" }],
};

/** 设备档案列表 */
const deviceEquipmentData = ref<EquipmentModule.EquipmentItemType[]>([]);
/** 勾选的设备档案列表 */
const checkDiveceList = ref<EquipmentModule.EquipmentItemType[]>([]);
const equipment_type = ref("");
/** 设备档案列表table的ref */
const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const tableLoading = ref(false);
const btnLoading = ref(false);

/**  */
function selectDevice(row: EquipmentModule.EquipmentItemType) {
  checkDiveceList.value = [
    {
      ...row,
    },
  ];
  formData.value.eq_id = row.id;
}

/** 监听选择资产类型后的回调 */
function handleNodeChange(value: string, idList: number[]) {
  console.log("🚀 ~ handleNodeChange ~ idList:", idList);
  // formData.value.equipment_type_name = value;
  if (idList.length > 0) {
    equipment_type.value = idList.reverse().join(",");
    getEquipmentList();
  }
}

/** 移除tag */
function tagClose(row: EquipmentModule.EquipmentItemType) {
  checkDiveceList.value = checkDiveceList.value.filter((item) => {
    return item.id !== row.id;
  });
  selectTableRef.value!.toggleRowSelection(row, false);
}

/** 设备列表勾选触发 */
function deviceCheck(selection: EquipmentModule.EquipmentItemType[]) {
  checkDiveceList.value = selection;
}

/** 根据资产类型获取设备档案列表 */
async function getEquipmentList() {
  let data = {
    equipment_type: equipment_type.value,
    page: pagination.currentPage,
    size: pagination.pageSize,
  };
  tableLoading.value = true;
  const result = await getEquipmentSelectApi(data);
  tableLoading.value = false;
  deviceEquipmentData.value = result.data.list;
  pagination.total = result.data.total;
}
function handleSizeChange(val: number) {
  if (equipment_type.value) {
    getEquipmentList();
  }
}

function handleCurrentChange(val: number) {
  if (equipment_type.value) {
    getEquipmentList();
  }
}

async function clickSubmit() {
  const validateRes = await formRef.value?.validate();
  if (!validateRes) return;
  if (checkDiveceList.value.length === 0) {
    ElMessage.warning("您未选择设备,请选择设备");
    return;
  }

  let { eq_id, rel_id } = formData.value;
  btnLoading.value = true;
  emit("confirm", { eq_id, rel_id });
}
function clickColse() {
  btnLoading.value = false;
  model.value = false;
}

defineExpose({
  clickColse,
});

watch(model, (newVal) => {
  if (newVal) {
    getTypeList();
  }
});
</script>
<template>
  <div class="add-container">
    <el-drawer title="设备关联" v-model="model" direction="rtl" size="60%">
      <el-form :model="formData" ref="formRef" :rules="rules">
        <el-form-item label="资产类型" class="w-[50%]" prop="equipment_type_id">
          <TreeSelect
            :list="treeData"
            v-model="formData.equipment_type_id"
            @nodeChange="handleNodeChange"
          ></TreeSelect>
        </el-form-item>
        <el-form-item label="已选择设备" class="w-full">
          <span v-if="!formData.equipment_type_id" class="text-slate-400">请先选择资产类型</span>
          <span v-else-if="!checkDiveceList.length" class="text-slate-400">请选择一个设备</span>
          <el-tag
            v-for="tag in checkDiveceList"
            :key="tag.id"
            closable
            class="mr-2 mb-2"
            @close="tagClose(tag)"
          >
            {{ tag.bar_title }}
          </el-tag>
        </el-form-item>

        <pure-table
          class="mb-4"
          ref="prueTableRef"
          header-cell-class-name="table-gray-header"
          @selection-change="deviceCheck"
          row-key="id"
          :data="deviceEquipmentData"
          :columns="columns"
          :pagination="pagination"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          :loading="tableLoading"
        >
          <template #operation="{ row }">
            <el-button type="primary" size="default" @click="selectDevice(row)">
              选择此设备
            </el-button>
          </template>
        </pure-table>
        <el-form-item label="绑定关联" class="w-full" prop="rel_id">
          <el-select v-model="formData.rel_id" placeholder="请选择" filterable>
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
          >
            确认
          </el-button>
          <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
            取消
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";
</style>
