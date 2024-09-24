<script setup lang="ts">
/* 选择设备组件 */
import type { FormInstance, TableInstance } from "element-plus";
import { getEquipmentSelectApi } from "@/api/device/common";
import type { EquipmentModule } from "@/api/device/common/types";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { addDialog } from "@/components/ReDialog";
import TreeSelect from "./TreeSelect.vue";
import { useSelectDevice } from "./hook";

interface Props {
  ids: number[];
  multiple?: boolean;
  title?:string;
}

const props = withDefaults(defineProps<Props>(), {
  ids: () => [],
  multiple: true,
  title: "选择设备"
});
const model = defineModel({ required: true, default: false });

const emit = defineEmits(["change", "select"]);
const {
  columns,
  searchColumns,
  pagination,
  getBase,
  userList,
  treeData,
  departmentList,
  placeList,
} = useSelectDevice(props.multiple);

const treeRef = ref<InstanceType<typeof TreeSelect>>();
const formData = ref({
  equipment_type: "",
  keyword: "",
  save_addr: "",
  use_dept_id: "",
  use_duty_user: "",
});

const equipment_type_id = ref();

const formRef = ref();
const tableData = ref<EquipmentModule.EquipmentItemType[]>([]);
const selectData = ref<EquipmentModule.EquipmentItemType[]>([]); //勾选的数据列表
const selectList = ref<number[]>([]); //勾选的数据id列表
const idsList = ref<number[]>([]);
const btnLoading = ref(false);
const prueTableRef = ref();
const selectTableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  equipment_type_id.value = undefined;
  getData();
};

async function getData() {
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...formData.value,
  };
  const result = await getEquipmentSelectApi(data);
  tableData.value = result.data.list;
  pagination.total = result.data.total;
  checkId();
}

function checkId() {
  tableData.value.forEach((item) => {
    if (idsList.value.includes(item.id)) {
      item.select_status = true;
    } else {
      item.select_status = false;
    }
  });
}

// 抽屉弹窗关闭之前的回调
const drawerBeforeClose = () => {
  selectTableRef.value!.clearSelection();
  btnLoading.value = false;
  selectData.value = [];
  formData.value.keyword = "";
  pagination.currentPage = 1;
  model.value = false;
};

// 按钮选择单元格事件
const toggleSelection = (row: EquipmentModule.EquipmentItemType) => {
  if (!props.multiple) {
    // 如果不是多选模式,点击选择直接返回数据给父组件
    emit("select", row);
    model.value = false;
    return;
  }
  //   console.log("selectTableRef.value", selectTableRef.value);
  //@ts-expect-error
  selectTableRef.value!.toggleRowSelection(row, undefined);
};

// 点击确认选择
const clickSubmit = () => {
  btnLoading.value = true;
  selectList.value = selectData.value.map((item) => {
    return item.id;
  });
  if (selectList.value.length === 0) {
    btnLoading.value = false;
    return;
  }

  let arr = selectData.value;
  console.log(arr);
  setTimeout(() => {
    selectTableRef.value!.clearSelection();
    selectList.value = [];
    btnLoading.value = false;
    emit("change", arr);
  }, 500);
};

function changeSelect(selection: any[]) {
  selectData.value = selection;
}
// 点击取消 关闭弹窗
const clickColse = () => {
  model.value = false;
};
const setStatus = () => {
  console.log("selectList.value", selectList.value);
  tableData.value.forEach((item, index) => {
    if (selectList.value.includes(item.id)) {
      item.select_status = true;
    }
  });
  selectTableRef.value!.clearSelection();
  selectList.value = [];
};

/** 监听选择资产类型后的回调 */
function handleNodeChange(value: string, idList: number[]) {
  if (idList.length > 0) {
    formData.value.equipment_type = idList.reverse().join(",");
  }
}

defineExpose({
  setStatus: setStatus,
});

watch(
  () => props.ids,
  (newValue) => {
    idsList.value = newValue;
    checkId();
  },
  {
    immediate: true,
  },
);
watch(model, (newValue) => {
  if (newValue) {
    getData();
    getBase();
  }
});
</script>
<template>
  <div class="batch-select">
    <el-drawer
      :title="title"
      v-model="model"
      direction="rtl"
      size="60%"
      :before-close="drawerBeforeClose"
      destroy-on-close
    >
      <PlusSearch
        v-model="formData"
        :columns="searchColumns"
        :showNumber="10"
        :colProps="{ span: 6 }"
        ref="formRef"
        class="pb-4"
      >
        <template #plus-field-equipment_type>
          <!-- 选择资产类型 -->
          <TreeSelect
            :list="treeData"
            v-model="equipment_type_id"
            @nodeChange="handleNodeChange"
          ></TreeSelect>
        </template>
        <template #plus-field-save_addr>
          <!-- 选择使用位置 -->
          <PlaceSelect v-model="formData.save_addr" :placeList="placeList"></PlaceSelect>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
        </template>
        <template #plus-field-use_duty_user>
          <!-- 选择使用负责人 -->
          <CommonSelect v-model="formData.use_duty_user" :list="userList"></CommonSelect>
        </template>
        <template #footer>
          <FormBtn
            @search="handleSearch"
            @reset="handleReset(formRef?.plusFormInstance.formInstance)"
          ></FormBtn>
        </template>
      </PlusSearch>
      <pure-table
        ref="prueTableRef"
        row-key="id"
        @selection-change="changeSelect"
        :data="tableData"
        :columns="columns"
        adaptive
        :adaptiveConfig="{ offsetBottom: 200 }"
        header-cell-class-name="table-gray-header"
        :pagination="pagination"
        @page-size-change="getData()"
        @page-current-change="getData()"
      >
        <template #operation="scope">
          <el-button
            type="primary"
            :disabled="scope.row.select_status"
            @click="toggleSelection(scope.row)"
          >
            {{ scope.row.select_status ? "已添加" : "选择" }}
          </el-button>
        </template>
      </pure-table>
      <template #footer>
        <div class="flex items-start">
          <el-button
            size="large"
            type="primary"
            class="w-[100px]"
            @click="clickSubmit"
            :loading="btnLoading"
            v-if="multiple"
          >
            确认选择
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
:deep(.el-drawer__header) {
  margin-bottom: 0;
}

:deep(.el-table td > .cell) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
