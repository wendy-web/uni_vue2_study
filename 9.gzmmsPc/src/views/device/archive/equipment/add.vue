<script setup lang="tsx">
import type { FormInstance } from "element-plus";
import { buildUUID } from "@pureadmin/utils";
import dayjs from "dayjs";
import type { FieldValues, PlusColumn } from "plus-pro-components";
import { useRoute, useRouter } from "vue-router";
import { IGoodsItem } from "@/api/common/types";
// 引入api
import {
  createEquipmentApi,
  getEquipmentDetailsApi,
  updateEquipmentApi,
} from "@/api/device/archive/equipment/index";
// import type { EquipmentItemType, SparePartItemType } from "@/api/device/archive/equipment/types";
import type { SparePartItemType } from "@/api/device/archive/equipment/types";
import { EquipmentModule } from "@/api/device/common/types";
import type { DeviceGoodsDrop } from "@/api/device/common/types";
import DeviceBatchGoods from "@/components/BatchSelect/DeviceBatchGoods.vue";
import CommonSelect from "@/components/DeptSelect/CommonSelect.vue";
import PlaceSelect from "@/components/DeptSelect/PlaceSelect.vue";
import DeptSelect from "@/components/DeptSelect/index.vue";
import { addDialog } from "@/components/ReDialog";
import DropLoad from "@/components/SelectDrop/DropLoad.vue";
import FileUpload from "@/components/Upload/FileUpload.vue";
import { useEditHooks } from "@/hooks/edit";
import { useTagsViewStore } from "@/store/modules/tagsView";
import SelectDeviceVue from "./components/selectDevice.vue";
import selectTreeDialog from "./components/selectTreeDialog.vue";
import Tree from "./components/tree.vue";
import { useAdd } from "./utils/add";

defineOptions({
  name: "deviceArchiveEquipmentAdd",
});
const { isReqDetail } = useEditHooks();

enum ETitle {
  "新建资产档案" = 1,
  "编辑资产档案",
}

/** 关联子设备列表的类型 */
type ChildListType = {
  id: number;
  barcode: string;
  bar_title: string;
  spec: string;
  save_addr_text: string;
  use_dept_text: string;
};

/** 关联附件列表的类型 */
type fileListType = {
  id: number | string;
  type?: number;
  file_url: string;
  file_name: string;
  create_time: string;
  note: string;
  tag: boolean;
};

const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const {
  formData,
  addRelus,
  group,
  fileColumns,
  deviceColumns,
  sparePartColumns,
  fileUplodColumns,
  fileUplodRules,

  getBase,
  treeData,
  departmentList,
  placeList,
  lineList,
  eqipment_status,
  supplierList,
  userList,
  fileTypeList,
} = useAdd();

const listId = ref(0);
const pageType = ref(1);
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});
const PlusformRef = ref();
const formLoading = ref(false);
const formRef = computed(() => {
  return PlusformRef.value.formInstance as FormInstance;
});

/** 关联附件表格数据 */
const fileData = ref<fileListType[]>([]);
/** 勾选的附件列表数据 */
const checkFileData = ref<fileListType[]>([]);
/** 上传附件弹窗开关 */
const fileVisible = ref(false);
/** 上传附件表单数据 */
const fileValues = ref({
  type: undefined as FormNumType,
  file_url: "",
  file_name: "",
  create_time: dayjs().format("YYYY-MM-DD"),
  note: "",
});
const plusDialogFormRef = ref();
/** 文件上传表单实例 */
const fileFromRef = computed(() => {
  return plusDialogFormRef.value?.formInstance as FormInstance;
});
const fileUploadRef = ref<InstanceType<typeof FileUpload>>();

//  选择子设备抽屉的Ref
const selectDeviceRef = ref<InstanceType<typeof SelectDeviceVue>>();
const childList = ref<ChildListType[]>([]); //关联子设备列表的数据
const checkChildData = ref<ChildListType[]>([]); // 勾选的子设备数据列表
const childDrawer = ref(false); // 选择子设备抽屉开关
// 子设备数据的id数组
const childIds = computed(() => {
  return childList.value.map((item) => item.id);
});

const treeRef = ref<InstanceType<typeof Tree>>();
const equipment_name = ref(""); // 资产类型名称

// 关联备件列表的数据
const DeviceBatchGoodsRef = ref<InstanceType<typeof DeviceBatchGoods>>();
const sparePartList = ref<SparePartItemType[]>([]);
const checkSparePartList = ref<SparePartItemType[]>([]); // 勾选的备件数据列表
const sparePartDrawer = ref(false); // 选择备件抽屉开关

const nodeIdList = ref<number[]>([]);
const nodeIdName = ref("");

// 关联备件列表的good_id数组
const goodsIds = computed(() => {
  let arr = sparePartList.value.map((item) => {
    return item.good_id;
  });
  return arr;
});

function placeSelectChange(val: string) {
  console.log("🚀 ~ placeSelectChange ~ val:", val);
  formData.value.save_addr = val.split(",").map((item) => Number(item));
}

// /** 监听表单的变化 */
const handleChange = (values: FieldValues, column: PlusColumn) => {
  let { prop } = column;
  if (prop === "open_date") {
    let { use_year } = values;
    if (use_year) {
      formData.value.expire_date = dayjs(formData.value.open_date)
        .add(Number(use_year), "month")
        .format("YYYY-MM-DD");
    }
  }
};

// 选择资产名称后触发
function selectChange(val: IGoodsItem) {
  console.log("🚀 ~ selectChange ~ val:", val);
  let { barcode, brand, spec, title } = val;
  formData.value.bar_title = title;
  formData.value.barcode = barcode;
  formData.value.brand = brand;
  formData.value.spec = spec || "";
}

const dialogVisible = ref(false);

function dialogConfirm(id_list: number[], id_name: string) {
  dialogVisible.value = false;
  formData.value.equipment_type = id_list.reverse().join(",");
  equipment_name.value = id_name;
}

// 点击选择资产类型
function selectEquipmentType() {
  let id_list: number[] = [];
  let id_name = "";
  dialogVisible.value = true;
  return;
  addDialog({
    title: "选择资产类型",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    contentRenderer: () =>
      h(Tree, {
        adaptive: true,
        treeData: treeData.value,
        ref: treeRef,
        onTreeSelect: (idList: number[], name: string) => {
          id_list = idList;
          id_name = name;
        },
      }),

    closeCallBack: ({ options, args }) => {
      if (args?.command === "cancel") {
        // 您点击了取消按钮
      } else if (args?.command === "sure") {
        // 点击了确定
        console.log("点击了确定");
        formData.value.equipment_type = id_list.reverse().join(",");
        equipment_name.value = id_name;
      } else {
        // 点击了您点击了右上角关闭按钮或空白页或按下了esc键
      }
    },
  });
}

// 关联附件-点击上传
function clickUpload() {
  fileValues.value.file_url = "";
  fileValues.value.file_name = "";
  fileUploadRef.value?.clearFiles();
  fileVisible.value = true;

  console.log("🚀 ~ plusDialogFormRef:", plusDialogFormRef.value);
  nextTick(() => {
    fileFromRef.value.resetFields();
  });
}

/** 监听文件上传改变 */
function fileChange(fileData: { name: string; src: string }) {
  fileValues.value.file_url = fileData.src;
  fileValues.value.file_name = fileData.name;
}

/** 监听文件上传表单点击确定 */
function fileConfirm() {
  console.log("🚀 ~ fileConfirm ~ values:", fileValues.value);
  if (fileUploadRef.value?.btnLoding) {
    return ElMessage.warning("文件上传中,请稍等~");
  }
  if (!fileValues.value.file_name) {
    return ElMessage.warning("请上传文件~");
  }
  fileData.value.push({
    id: buildUUID(),
    ...fileValues.value,
    tag: true,
  });
  fileVisible.value = false;
  console.log("🚀 ~ fileConfirm ~ fileData.value:", fileData.value);
}

// 勾选关联附件时触发
function fileCheck(selection: fileListType[]) {
  checkFileData.value = selection;
}

// 关联子设备-点击选择设备
function selectDevice() {
  childDrawer.value = true;
}

// 监听关联子设备-选择设备抽屉的确定事件
function confirmSelectDevice(selectData: EquipmentModule.EquipmentItemType[]) {
  let dataLength = selectData.length;
  selectData.forEach((item) => {
    childList.value.push({
      id: item.id,
      barcode: item.barcode,
      bar_title: item.bar_title,
      spec: item.spec,
      save_addr_text: item.save_addr_text,
      use_dept_text: item.use_dept_text,
    });
  });
  ElMessage.success(`已批量添加${dataLength}条子设备`);
  selectDeviceRef.value?.setStatus();
}

// 勾选子设备表格触发
function childDeviceCheck(selection: ChildListType[]) {
  checkChildData.value = selection;
}

// 关联子设备-点击删除选中
function delChildDevice() {
  let ids = checkChildData.value.map((item) => item.id);
  childList.value = childList.value.filter((item) => !ids.includes(item.id));
  console.log("🚀 ~ delChildDevice ~ childList.value:", childList.value);
}

// 点击选择备件
function selectSparePart() {
  sparePartDrawer.value = true;
}
function batchSelectchange(batchSelectData: DeviceGoodsDrop.GoodsItemData[]) {
  let dataLength = batchSelectData.length;
  console.log("🚀 ~ batchSelectchange ~ batchSelectData:", batchSelectData);
  batchSelectData.forEach((item, index) => {
    sparePartList.value.push({
      good_id: item.id,
      parts_code: item.barcode,
      stock: item.stock,
      title: item.title,
      spec: item.spec,
      note: "",
    });
  });
  ElMessage.success(`已批量添加${dataLength}条备件`);
  DeviceBatchGoodsRef.value?.setStatus();
}

// 勾选关联备件触发
function sparePartCheck(selection: SparePartItemType[]) {
  checkSparePartList.value = selection;
}

// 关联备件-删除选中
function delSparePart() {
  let ids = checkSparePartList.value.map((item) => item.good_id);
  sparePartList.value = sparePartList.value.filter((item) => !ids.includes(item.good_id));
  console.log("🚀 ~ delSparePart ~   sparePartList.value :", sparePartList.value);
}

// 关联附件-删除选中
function delFile() {
  let ids = checkFileData.value.map((item) => item.id);
  fileData.value = fileData.value.filter((item) => !ids.includes(item.id));
}

// 点击返回
function pageBack() {
  router.replace({
    path: "/device/archive/equipment",
  });
}

function handleFileList() {
  //  判断附件列表中的tag标识,true是新建, false是编辑的数据
  return fileData.value.map((item) => {
    let { id, tag, ...rest } = item;
    if (tag) {
      return {
        ...rest,
      };
    } else {
      return {
        ...rest,
        id,
      };
    }
  });
}
// 点击确定 保存
function handleConfirm() {
  formRef.value.validate(async (valid, fields) => {
    for (const keys in fields) {
      if (fields[keys]) {
        // 弹出每个字段的错误提示
        ElMessage.warning(fields[keys][0].message);
        formRef.value.scrollToField(keys);
        break;
      }
    }

    if (valid) {
      console.log("校验成功");
      let { use_duty_user, save_addr, ...rest } = formData.value;
      let data = {
        id: listId.value ? listId.value : undefined,
        use_duty_user: use_duty_user.length > 0 ? use_duty_user.join(",") : undefined,
        // save_addr: save_addr.length > 0 ? save_addr.join(",") : undefined,
        save_addr: save_addr.join(","),
        ...rest,
        child_list: childIds.value,
        files_list: handleFileList(),
        parts_list: sparePartList.value,
      };
      const result = listId.value ? await updateEquipmentApi(data) : await createEquipmentApi(data);
      // ElMessage.success(result.msg);
      ElMessageBox.confirm(`${result.msg},请回到列表页面查看~`, "温馨提示", {
        confirmButtonText: "好的,我知道了",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "success",
      })
        .then(() => {
          const currentTag = router.currentRoute.value;
          router.replace({
            path: "/device/archive/equipment",
          });

          tagsViewStore.delView(currentTag);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("校验失败");
      ElMessage.warning("有必填项未填写或者填写不正确,请检查填写内容");
    }
  });
}

async function getEditData() {
  formLoading.value = true;
  const result = await getEquipmentDetailsApi({ id: listId.value });
  let data = result.data;
  formData.value.asset_no = data.asset_no;
  formData.value.bar_title = data.bar_title;
  formData.value.brand = data.brand;
  formData.value.barcode = data.barcode;
  formData.value.spec = data.spec;
  formData.value.equipment_type = data.equipment_type;
  formData.value.equipment_code = data.equipment_code;
  formData.value.power = data.power;
  formData.value.sn = data.sn;
  formData.value.export_type = data.export_type;
  formData.value.product_line = data.product_line;
  formData.value.note = data.note;
  formData.value.status = data.status;
  formData.value.use_dept_id = data.use_dept_id ? Number(data.use_dept_id) : undefined;
  formData.value.duty_dept_id = data.duty_dept_id ? Number(data.duty_dept_id) : undefined;
  formData.value.use_duty_user = data.use_duty_user
    ? data.use_duty_user.split(",").map((item) => Number(item))
    : [];
  formData.value.open_date = data.open_date;
  // formData.value.save_addr = data.save_addr ? Number(data.save_addr) : undefined;
  formData.value.save_addr = data.save_addr
    ? data.save_addr.split(",").map((item) => Number(item))
    : [];
  formData.value.scrap_date = data.scrap_date;
  formData.value.scrap_reason = data.scrap_reason;
  formData.value.supplier_id = data.supplier_id;
  formData.value.production_id = data.production_id;
  formData.value.purchase_uid = data.purchase_uid;
  formData.value.price = data.price;
  formData.value.spoiled_rate = data.spoiled_rate;
  formData.value.depreciation_type = data.depreciation_type;
  fileData.value = data.files_list;
  childList.value = data.child;
  sparePartList.value = data.parts_list;
  equipment_name.value = data.equipment_type_text;

  nodeIdList.value = data.equipment_type.split(",").map((item) => Number(item));
  nodeIdName.value = data.equipment_type_text;
  formLoading.value = false;
}
const initTagsView = () => {
  // id存在表示是编辑
  pageType.value = listId.value ? 2 : 1;
  const title = headerTitle.value;
  const new_route = Object.assign({}, route, {
    title,
  });
  tagsViewStore.updateVisitedView(new_route);
};

onActivated(() => {
  getBase();
  listId.value = Number(route.query.id) || 0;
  initTagsView();
  if (listId.value && isReqDetail.value) {
    getEditData();
  }
});
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">
        <span>{{ headerTitle }}</span>
      </div>
      <PlusForm
        ref="PlusformRef"
        v-model="formData"
        :group="group"
        :colProps="{ span: 8 }"
        :rowProps="{ gutter: 20 }"
        :hasFooter="false"
        :rules="addRelus"
        @change="handleChange"
        v-loading="formLoading"
      >
        <template #plus-field-bar_title>
          <!-- 选择货品 -->
          <DropLoad :title="formData.bar_title" @change="selectChange($event)"></DropLoad>
        </template>
        <template #plus-field-equipment_type>
          <!-- 选择资产类型 -->
          <el-input
            v-model="equipment_name"
            placeholder="请选择"
            readonly
            class="!cursor-pointer"
            @click="selectEquipmentType"
          ></el-input>
        </template>
        <template #plus-field-use_dept_id>
          <!-- 选择使用部门 -->
          <DeptSelect :department-list="departmentList" v-model="formData.use_dept_id"></DeptSelect>
        </template>
        <template #plus-field-duty_dept_id>
          <!-- 选择责任部门 -->
          <DeptSelect
            :department-list="departmentList"
            v-model="formData.duty_dept_id"
          ></DeptSelect>
        </template>

        <template #plus-field-save_addr>
          <!-- 选择使用位置 -->
          <PlaceSelect
            v-model="formData.save_addr"
            :placeList="placeList"
            @change="placeSelectChange"
          ></PlaceSelect>
        </template>
      </PlusForm>
      <el-card shadow="never" class="mb-4">
        <template #header>关联附件</template>
        <div class="mb-4">
          <el-button type="primary" @click="clickUpload">上传</el-button>
          <el-button type="primary" @click="delFile">删除选中</el-button>
        </div>
        <pure-table
          header-cell-class-name="table-gray-header"
          row-key="id"
          @selection-change="fileCheck"
          :data="fileData"
          :columns="fileColumns"
        ></pure-table>
      </el-card>
      <el-card shadow="never" class="mb-4">
        <template #header>关联子设备</template>
        <div class="mb-4">
          <el-button type="primary" @click="selectDevice">选择设备</el-button>
          <el-button type="primary" @click="delChildDevice">删除选中</el-button>
        </div>
        <pure-table
          header-cell-class-name="table-gray-header"
          @selection-change="childDeviceCheck"
          row-key="id"
          :data="childList"
          :columns="deviceColumns"
        ></pure-table>
      </el-card>
      <el-card shadow="never">
        <template #header>关联备件</template>
        <div class="mb-4">
          <el-button type="primary" @click="selectSparePart">选择备件</el-button>
          <el-button type="primary" @click="delSparePart">删除选中</el-button>
        </div>
        <pure-table
          header-cell-class-name="table-gray-header"
          @selection-change="sparePartCheck"
          row-key="good_id"
          :data="sparePartList"
          :columns="sparePartColumns"
        ></pure-table>
      </el-card>
      <el-divider />
    </div>
    <div class="mt-6">
      <el-button plain class="w-[100px] mr-4" size="large" @click="pageBack">返回</el-button>
      <el-button type="primary" @click="handleConfirm" class="w-[100px]" size="large">
        确定
      </el-button>
    </div>
    <PlusDialogForm
      ref="plusDialogFormRef"
      v-model:visible="fileVisible"
      v-model="fileValues"
      :form="{
        columns: fileUplodColumns,
        rules: fileUplodRules,
        labelWidth: '90',
        labelPosition: 'right',
      }"
      draggable
      title="上传附件"
      cancel-text="取消"
      confirm-text="确定"
      @confirm="fileConfirm"
    >
      <template #plus-field-file_name>
        <FileUpload @fileChange="fileChange" ref="fileUploadRef"></FileUpload>
      </template>
      <template #plus-field-type>
        <CommonSelect :list="fileTypeList" v-model="fileValues.type"></CommonSelect>
      </template>
    </PlusDialogForm>
    <DeviceBatchGoods
      :ids="goodsIds"
      ref="DeviceBatchGoodsRef"
      v-model="sparePartDrawer"
      @change="batchSelectchange"
    ></DeviceBatchGoods>
    <SelectDeviceVue
      :list-id="listId"
      :ids="childIds"
      v-model="childDrawer"
      :type-list="treeData"
      :user-list="userList"
      :department-list="departmentList"
      :place-list="placeList"
      @change="confirmSelectDevice"
    ></SelectDeviceVue>
    <selectTreeDialog
      :idList="nodeIdList"
      :idName="nodeIdName"
      :treeData="treeData"
      v-model:dialogVisible="dialogVisible"
      @confirm="dialogConfirm"
    ></selectTreeDialog>
  </div>
</template>
<style lang="scss" scoped>
@import "@/styles/common.scss";

:deep(.plus-form .el-card) {
  box-shadow: none;
}
.app-card {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding-top: 0;
  .header-title {
    position: sticky;
    top: 0px;
    background-color: #fff;
    z-index: 99;
    height: 46px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
  }
}
</style>
