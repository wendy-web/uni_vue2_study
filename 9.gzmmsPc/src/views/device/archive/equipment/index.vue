<script setup lang="ts">
import type { FormInstance, TableInstance } from "element-plus";
import { isArray } from "@pureadmin/utils";
import { useRouter } from "vue-router";
import { getEquipmentListApi } from "@/api/device/archive/equipment/index";
// import type { EquipmentItemType } from "@/api/device/archive/equipment/types";
import { EquipmentModule } from "@/api/device/common/types";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { useBaseData } from "@/hooks/device/baseData";
import { usePrint } from "@/hooks/device/devicePrint";
import equipmentDetail from "./components/equipmentDetail.vue";
import Tree from "./components/tree.vue";
import { useList } from "./utils/hook";

defineOptions({
  name: "deviceArchiveEquipment",
});

const router = useRouter();
const { multiPrint } = usePrint();
const { columns, searchColumns, pagination } = useList();
const { getBase, treeData, userList, departmentList, placeList } = useBaseData();

/** 搜索表单的绑定值 */
const formData = ref({
  equipment_type: "", // 资产类型，层级用逗号隔开
  keyword: "", // 关键字 支持搜索单据编码、资产码、条码、资产名称、品牌、型号
  save_addr: "", // 使用位置
  use_dept_id: "", // 使用部门
  use_duty_user: "", // 使用负责人
  open_date: "", // 启用日期
  status:undefined as FormNumType, //使用状态
  point_check_status: undefined as FormNumType, //点巡检状态
});
const formRef = ref();
const treeRef = ref<InstanceType<typeof Tree>>();
const prueTableRef = ref();
/** 表格的ref */
const tableRef = computed<TableInstance>(() => {
  return prueTableRef.value?.getTableRef();
});

const tableLoading = ref(false);
/** 表格内容 */
const tableData = ref<EquipmentModule.EquipmentItemType[]>([]);
const selectCodeData = ref<EquipmentModule.EquipmentItemType[]>([]);
const ids = ref<number[]>([]);
/** 详情抽屉开关 */
const detailDrawerVisible = ref(false);
const listId = ref(0);
const detailData = ref<EquipmentModule.EquipmentItemType>();
// 点击搜索
const handleSearch = () => {
  getData();
};
// 点击重置
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  formData.value.equipment_type = "";
  treeRef.value?.onTreeReset();
  getData();
};

function onTreeSelect(val: number[]) {
  formData.value.equipment_type = val.reverse().join(",");
  getData();
}

// 点击新建
const handleAdd = () => {
  router.push({
    path: "/device/archive/equipment/add",
  });
};

// 点击详情
const handleDetail = (row: EquipmentModule.EquipmentItemType) => {
  listId.value = row.id;
  detailData.value = row;
  detailDrawerVisible.value = true;
};

const handleEdit = (row: EquipmentModule.EquipmentItemType) => {
  listId.value = row.id;
  router.push({
    path: "/device/archive/equipment/add",
    query: {
      id: row.id,
    },
  });
};

async function getData() {
  let { open_date, ...rest } = formData.value;
  let open_date_start = isArray(open_date) ? open_date[0] : "";
  let open_date_end = isArray(open_date) ? open_date[1] : "";
  let data = {
    page: pagination.currentPage,
    size: pagination.pageSize,
    ...rest,
    open_date_start,
    open_date_end,
  };
  tableLoading.value = true;
  const result = await getEquipmentListApi(data);
  tableLoading.value = false;
  tableData.value = result.data.list;
  pagination.total = result.data.total;
}

// 勾选触发事件
function changeSelect(selection: EquipmentModule.EquipmentItemType[]) {
  selectCodeData.value = selection;

  ids.value = selection.map((item) => {
    return item.id;
  });
}

function handlePrint() {
  let len = selectCodeData.value.length;
  if (len === 0) {
    ElMessage.warning("请选择要打印的数据");
    return;
  } else if (len > 10) {
    ElMessage.warning("一次只能打印10条数据");
    return;
  }
  console.log("selectCodeData.value", selectCodeData.value);
  multiPrint(selectCodeData.value);

  // let list = selectCodeData.value.map((item) => {
  //   return {
  //     qrcode: item.barcode,
  //     barcode: item.barcode,
  //     title: item.title,
  //     spec: item.spec,
  //   };
  // });
}

onActivated(() => {
  getBase();
  getData();
  prueTableRef.value?.setAdaptive();
});

onDeactivated(() => {
  selectCodeData.value = [];
  tableRef.value.clearSelection();
});
</script>
<template>
  <div class="app-container flex">
    <Tree
      class="min-w-[200px] mr-[10px]"
      :treeData="treeData"
      @tree-select="onTreeSelect"
      ref="treeRef"
    ></Tree>
    <div class="w-[calc(100%-220px)]">
      <div class="app-card">
        <PlusSearch
          v-model="formData"
          :columns="searchColumns"
          :showNumber="10"
          :colProps="{ span: 6 }"
          ref="formRef"
        >
          <template #footer>
            <FormBtn
              @search="handleSearch"
              @reset="handleReset(formRef?.plusFormInstance.formInstance)"
            ></FormBtn>
          </template>
          <template #plus-field-save_addr>
            <PlaceSelect v-model="formData.save_addr" :placeList="placeList"></PlaceSelect>
          </template>
          <template #plus-field-use_duty_user>
            <CommonSelect v-model="formData.use_duty_user" :list="userList"></CommonSelect>
          </template>
          <template #plus-field-use_dept_id>
            <DeptSelect
              :department-list="departmentList"
              v-model="formData.use_dept_id"
            ></DeptSelect>
          </template>
        </PlusSearch>
      </div>
      <div class="app-card">
        <PureTableBar :columns="columns" @refresh="handleSearch">
          <template #buttons>
            <el-button type="primary" @click="handleAdd" v-hasPerm="['archive:equipment:add']">
              <template #icon>
                <i-ep-plus></i-ep-plus>
              </template>
              新建
            </el-button>
            <!-- <el-button type="primary" @click="">删除</el-button> -->
            <!-- <el-button type="primary" @click="">打印二维码</el-button> -->
            <el-tooltip effect="dark" content="一次最多只能打印10条勾选数据" placement="top-start">
              <el-button type="primary" @click="handlePrint" class="ml-[14px]">
                <template #icon>
                  <i-ep-Printer></i-ep-Printer>
                </template>
                打印选中标签
              </el-button>
            </el-tooltip>
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="prueTableRef"
              @selection-change="changeSelect"
              :data="tableData"
              :columns="dynamicColumns"
              :size="size"
              adaptive
              :adaptiveConfig="{ offsetBottom: 120 }"
              header-cell-class-name="table-gray-header"
              :pagination="pagination"
              :paginationSmall="size === 'small' ? true : false"
              @page-size-change="getData()"
              @page-current-change="getData()"
              row-key="id"
              :loading="tableLoading"
            >
              <template #operation="{ row }">
                <el-button
                  type="primary"
                  link
                  @click="handleDetail(row)"
                  v-hasPerm="['archive:equipment:detail']"
                >
                  详情
                </el-button>
                <el-button
                  type="primary"
                  link
                  @click="handleEdit(row)"
                  v-hasPerm="['archive:equipment:edit']"
                >
                  编辑
                </el-button>
                <!-- <el-button type="primary" link @click="">删除</el-button> -->
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
    <equipmentDetail
      v-model="detailDrawerVisible"
      :listId="listId"
      :detailData="detailData"
    ></equipmentDetail>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

:deep(.el-drawer__body) {
  padding-top: 0;
}
</style>
