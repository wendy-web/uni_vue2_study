<script setup lang="ts">
import { cloneDeep } from "@pureadmin/utils";
import { productInDetailApi, productInEditApi } from "@/api/product-stock/product-in";
import type { ProductInGoodsType } from "@/api/product-stock/product-in/types";
import { addDialog, updateDialog } from "@/components/ReDialog";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
import { useCellOmit } from "@/hooks/table";
import { useAdd } from "./add";
import editBatchVue from "./editBatch.vue";

const { handleCellEnter, handleCellLeave, handleCellClass } = useCellOmit({
  editProp: ["title", "box_serial_number", "ws_code_name_str", "ws_code"],
  type: 1,
});

const {
  addFormData,
  addColumns,
  addRules,
  getFactoryCodeList,
  getWscodeList,
  wlSelectList,
  getWlData,
  selectProps,
  bindFile,
  inColumns,
  wsCodeList,
} = useAdd(true);

const props = defineProps(["listId"]);
const emit = defineEmits(["refresh"]);
const model = defineModel("visible", { required: true, default: false });

const detailLoading = ref(false);
const tableData = ref<ProductInGoodsType[]>([]);
const status = ref(-99);

const btnLoading = ref(false);

async function getData() {
  detailLoading.value = true;
  const result = await productInDetailApi({ id: props.listId });
  let res = result.data;
  addFormData.value.pro_no = res.pro_no;
  addFormData.value.factory_code = res.factory_code;
  addFormData.value.delivery_no = res.delivery_no;
  addFormData.value.ws_code_ids = res.ws_code_ids_arr.map((item) => Number(item));
  addFormData.value.pro_date = res.pro_date;
  addFormData.value.goods_id = res.goods_id;
  addFormData.value.note = res.note;
  addFormData.value.file_info = res.file_info ? res.file_info : { name: "", src: "" };

  tableData.value = res.goods;
  status.value = res.status;

  detailLoading.value = false;
}

const editBatchRef = ref();
/** 点击编辑批次 */
function cellEditBatch(row: any) {
  let list = cloneDeep(row.goods_detail);
  addDialog({
    top: "10vh",
    width: "60%",
    btnClass: "w-[80px]",
    draggable: true,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    btnLoading: false,
    title: "编辑批次垛号",
    contentRenderer: () =>
      h(editBatchVue, {
        ref: editBatchRef,
        list,
        codeList: wsCodeList.value,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      const vaildateRes = await editBatchRef.value?.validatorForm();
      console.log("vaildateRes", vaildateRes);
      if (!vaildateRes) return;
      let data = editBatchRef.value?.batchData;
      console.log("🚀 ~ beforeSure: ~ data:", data);
      row.goods_detail = data;
      let box_serial_number = data.map((item: any) => {
        return item.box_serial_number_start + "-" + item.box_serial_number_end;
      });
      let ws_code_name_str = data.map((item: any) => {
        return item.ws_code_name;
      });
      let ws_code = data.map((item: any) => {
        return item.ws_code;
      });

      ws_code_name_str = uniqueStrings(ws_code_name_str);
      ws_code = uniqueStrings(ws_code);

      // console.log("🚀 ~ letbox_serial_number=data.map ~ box_serial_number:", box_serial_number)
      row.box_serial_number = box_serial_number.join("、");
      row.ws_code_name_str = ws_code_name_str.join("、");
      row.ws_code = ws_code.join("、");
      done();
    },
  });
}

function uniqueStrings(strings: string[]) {
  return [...new Set(strings)];
}

// 点击确认选择
const clickSubmit = async () => {
  let { ws_code_ids, ...rest } = addFormData.value;
  let data = {
    ws_code_ids: ws_code_ids.length > 0 ? ws_code_ids.join(",") : undefined,
    ...rest,
    goods: tableData.value,
    id: props.listId,
  };
  console.log("🚀 ~ clickSubmit ~ data:", data);
  const result = await productInEditApi(data);
  ElMessage.success(result.msg);
  clickColse();
  emit("refresh");
};

// 点击取消 关闭弹窗
const clickColse = () => {
  model.value = false;
};

watch(
  () => props.listId,
  (newVal) => {
    if (newVal) {
      getWscodeList();
      getFactoryCodeList();
      getWlData();
      getData();
    }
  },
);
</script>
<template>
  <el-drawer v-model="model" title="编辑入库信息" size="70%">
    <div class="mb-8">
      <div class="paragraph-content">
        <p class="paragraph-title">基础信息</p>
      </div>
      <PlusForm
        class="mt-8 ml-[-20px]"
        ref="PlusFormRef"
        :rules="addRules"
        v-model="addFormData"
        labelWidth="110"
        label-position="right"
        :columns="addColumns"
        :row-props="{ gutter: 20 }"
        :col-props="{ span: 12 }"
        :hasFooter="false"
      >
        <template #plus-field-goods_id>
          <el-select-v2
            :props="selectProps"
            v-model="addFormData.goods_id"
            :options="wlSelectList"
            filterable
            placeholder="请选择物料信息"
            size="large"
            style="width: 100%"
            disabled
          ></el-select-v2>
        </template>
        <template #plus-field-file_info>
          <PdfImgUpload :file_info="addFormData.file_info" @fileChange="bindFile"></PdfImgUpload>
        </template>
      </PlusForm>
    </div>
    <div>
      <div class="paragraph-content mb-4">
        <p class="paragraph-title">入库信息</p>
      </div>
      <pure-table
        ref="prueTableRef"
        row-key="id"
        :data="tableData"
        :columns="inColumns"
        border
        adaptive
        :adaptiveConfig="{ offsetBottom: 120 }"
        header-cell-class-name="table-gray-header"
         :cell-class-name="handleCellClass"
        @cell-mouse-enter="handleCellEnter"
        @cell-mouse-leave="handleCellLeave"
      >
        <template #operation="{ row }">
          <el-button type="primary" link @click="cellEditBatch(row)">编辑批次</el-button>
        </template>
      </pure-table>
    </div>
    <template #footer>
      <div class="flex items-start">
        <el-button
          size="large"
          type="primary"
          class="w-[100px]"
          @click="clickSubmit"
          :loading="btnLoading"
        >
          确认选择
        </el-button>
        <el-button type="primary" plain size="large" class="w-[100px]" @click="clickColse">
          取消
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>
<style lang="scss" scoped></style>
