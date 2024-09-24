<script setup lang="ts">
/* 其他出库(原退货出库单)新建/编辑页  */
import { IinStockItem } from "@/api/common/types";
import { detailRetGoodsApi } from "@/api/storage/ret-goods";
// 引入类型
import { IRetGoodsAdd, IRetGoodsAddInfo } from "@/api/storage/ret-goods/types";
import { IAddEmit } from "@/api/storage/stotypes";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
import { procureListHooks, storageListHooks } from "@/hooks/index";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
import directTable from "./components/directTable.vue";
// 引入组件
import importTable, { API as importTableAPI } from "./components/importTable.vue";

defineOptions({
  name: "StoRetGoodsAdd",
});

const { procureList } = procureListHooks(3);
const { storageFilterList } = storageListHooks(1);
enum ETitle {
  "新建其他出库单" = 1,
  "编辑其他出库单",
}

interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
  procureNo: string;
}

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
  procureNo: "",
});

const comMap = new Map();
comMap.set(1, importTable);
comMap.set(0, directTable);

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);
const state = reactive({
  radio: 0, // 1是从采购单退货出库 2是直接退货出库
  procure_no: "",
  // 需要编辑的属性
  // editProp: ["ret_num", "note"],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  goodsList: [] as IinStockItem[],
  directDisabled: false,
  importDisabled: false,
});
const {
  // editProp,
  note,
  file_info,
  pageType,
  tableLoading,
  radio,
  procure_no,
  goodsList,
  directDisabled,
  importDisabled,
} = toRefs(state);

// const emit = defineEmits(["aboutAdd"]);
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IRetGoodsAddInfo>): void;
}>();

const handleRadioChange = (value: string | number | boolean) => {
  // console.log(value);
};

const tableRef = ref<importTableAPI | null>(null);

// 赋值动态ref到变量
const setItemRef = (el: importTableAPI) => {
  if (el) {
    tableRef.value = el;
  }
};

// 点击取消
const handeleCancel = () => {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
  }
};

// 子组件触发事件,当点击下一步时,子组件表单验证通过会触发该事件
const handleChangeData = (data: any) => {
  procure_no.value = data.procure_no;
  let { goods } = data;
  let list = goods.map((item: any) => {
    let { old_num, unique, ...rest } = item;
    return {
      ...rest,
    };
  });

  emit("aboutAdd", {
    val: 2,
    preInfo: {
      procure_no: procure_no.value,
      procure_id: data.procure_id,
      return_time: data.return_time,
      out_time: data.out_time,
      out_wh_id: data.out_wh_id,
      out_wh_name: data.out_wh_name,
      id: props.listId,
      goods: list,
      note: note.value,
      file_info: file_info.value,
      type: data.type,
    },
  });
};

// 子组件触发事件,编辑时,详情接口调用完毕,隐藏loading
const hanldeLoading = () => {
  tableLoading.value = false;
};

// 点击下一步,触发子组件的事件
const hanleNext = () => {
  let valid = tableRef.value?.validateForm();
  console.log(valid);
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 通过接口获取单号信息
function getBarcodeInfo() {
  tableRef.value?.getCodeInfo();
}

async function getDetail() {
  tableLoading.value = true;
  const result = await detailRetGoodsApi({ id: props.listId });
  radio.value = result.data.type;
  note.value = result.data.note;
  file_info.value = result.data.file_info;
  if (result.data.type == 1) {
    directDisabled.value = true;
  } else {
    importDisabled.value = true;
  }
  nextTick(() => {
    tableRef.value?.getDetail(result.data);
  });
}

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  if (pageType.value == 1 && props.editFrom) {
    // 如果不是从预览页返回且是新建页面
  }

  //当是编辑页时需要根据props.editFrom值来判断是否获取详情数据,如果为0从pre页面返回的则不获取
  if (pageType.value == 2 && props.editFrom) {
    getDetail();
    console.log("props.procureNo", props.procureNo);
    // 如果采购单存在表示是 从采购单退货出库,设置当前的选择为采购单退货出库,禁止直接退货出库
    // if (props.procureNo) {
    //   radio.value = 1;
    //   directDisabled.value = true;
    // } else {
    //   radio.value = 0;
    //   importDisabled.value = true;
    // }
  }
});

const comName = computed(() => {
  return comMap.get(radio.value);
});
watchEffect(() => {
  if (tableRef.value?.goodsLen && tableRef.value.goodsLen > 0) {
    if (radio.value === 0) {
      importDisabled.value = true;
    } else {
      directDisabled.value = true;
    }
  } else {
    importDisabled.value = false;
    directDisabled.value = false;
  }
});

watch(
  () => props.listId,
  (newValue, oldValue) => {
    console.log("listId变了", newValue, oldValue);
    if (newValue) {
      console.log("newValue存在");
      pageType.value = 2;
    } else {
      console.log("newValue不存在");
      pageType.value = 1;
      note.value = "";
      file_info.value = {
        src: "",
        name: "",
      };
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="app-container">
    <div class="app-card" v-loading="tableLoading">
      <div class="flex items-center">
        <div class="header-title mr-4">{{ headerTitle }}</div>
        <el-radio-group v-model="radio" @change="handleRadioChange" class="mb-2">
          <el-radio :label="0" :disabled="directDisabled">其他出库</el-radio>
          <el-radio :label="1" :disabled="importDisabled">采购单冲销出库</el-radio>
        </el-radio-group>
      </div>
      <component
        :is="comName"
        :pageType="pageType"
        :goodsList="goodsList"
        :procureList="procureList"
        :storageFilterList="storageFilterList"
        :ref="setItemRef"
        @sendData="handleChangeData"
        @sendLoad="hanldeLoading"
        :inputBarcode="input_barcode"
      >
        <template v-slot:note>
          <div class="note absolute left-0">
            <span>备注</span>
            <el-input
              style="width: 240px; margin-left: 10px"
              v-model="note"
              placeholder="请输入备注"
              clearable
              maxlength="30"
            ></el-input>
          </div>
        </template>
      </component>

      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
            >可上传pdf和图片格式</span
          > -->
      </div>
      <div class="footer-btn mt-[20px] pb-[10px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.table-class .el-form-item) {
  margin-bottom: 0px;
}
</style>
