<script setup lang="ts">
// 其他入库单新建/编辑页
// 获取货品列表API
import { getSupListApi } from "@/api/common/index";
import type { IGoodsItem, ISupItem } from "@/api/common/types";
import type { IOtherInAddInfo, IOtherInGoods } from "@/api/storage/other-in/types";
import type { IAddEmit } from "@/api/storage/stotypes";
// 引入审批流程自定义组件
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
// 引入获取仓库列表的hooks
import { procureListHooks, storageListHooks } from "@/hooks";
// import ApproveFlow from "./components/ApproveFlow.vue";
// 引入组件
import directTable, { API as directTableAPI } from "./components/directTable.vue";

defineOptions({
  name: "StoOtherInAdd",
});

const { storageList } = storageListHooks();
const { procureList } = procureListHooks(3);

enum ETitle {
  "新建其他入库单" = 1,
  "编辑其他入库单",
}
interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}
const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
});

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const state = reactive({
  goods: [] as IOtherInGoods[],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  directDisabled: false,
  importDisabled: false,
  // goodsList: [] as IGoodsItem[], //货品列表数据
  supList: [] as ISupItem[], //供应商列表数据
  in_wh_id: 0,
});

const {
  note,
  file_info,
  pageType,
  tableLoading,
  goods,
  //  goodsList,
  supList,
  in_wh_id,
} = toRefs(state);

const directTableRef = ref<directTableAPI>();
const approveFlowRef = ref<InstanceType<typeof ApproveFlowGlobal>>();

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IOtherInAddInfo>): void;
}>();

// 将函数赋值给hooks中的函数变量,通过扫描枪扫出来的条码添加商品
function getBarcodeInfo() {
  console.log("input_barcode.value", input_barcode.value);
  nextTick(() => {
    directTableRef.value?.getCodeInfo();
  });
}

// 点击取消
const handeleCancel = () => {
  if (props.editFrom == 2) {
    // 如果editFrom为1 表示是从 详情页进来的
    emit("aboutAdd", { val: 3 });
  } else {
    emit("aboutAdd", { val: 1 });
  }
};

const handleChangeData = (data: any) => {
  goods.value = data.goods;
  emit("aboutAdd", {
    val: 2,
    preInfo: {
      in_time: data.in_time,
      in_wh_id: data.in_wh_id,
      in_wh_name: data.in_wh_name,
      procure_no: data.procure_no,
      procure_id: data.procure_id,
      type: data.type,
      id: props.listId,
      goods: goods.value,
      note: note.value,
      file_info: file_info.value,
    },
  });
};

const handleChangeInfo = (data: any) => {
  note.value = data.note;
  file_info.value = data.file_info;
};

const hanldeLoading = () => {
  tableLoading.value = false;
};

/** 监听子组件选择仓库触发的事件 */
const handleChangeWh = (data: { in_wh_id: number }) => {
  in_wh_id.value = data.in_wh_id;
};

// 点击下一步
const hanleNext = () => {
  let isNotsetWarehouse = approveFlowRef.value?.isNotsetWarehouse();
  console.log("🚀 ~ hanleNext ~ isNotsetWarehouse:", isNotsetWarehouse);
  if (isNotsetWarehouse) {
    let content = "未设置仓库确认人";
    ElMessageBox.confirm(`${content},请联系系统管理员配置`, "温馨提示", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    }).then(() => {});

    return;
  }
  let valid = directTableRef.value?.validateForm();
  console.log(valid);
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

// 获取可录入的货品数据,以及供应商列表
const getData = async () => {
  const supResult = await getSupListApi();
  supList.value = supResult.data.list;
  // const goodsResult = await getGoodsListApi();
  // goodsList.value = goodsResult.data.list;
};

onActivated(() => {
  // editFrom: 0预览,1list,2详情,pageType:1新建,2编辑
  // if (props.editFrom != 0 && pageType.value == 1) {
  if (props.editFrom != 0) {
    // 如果不是从预览页返回且是新建页面
    getData();
  }
  /*
      当是编辑页时需要判断
      props.editFrom值来判断
      是否获取详情数据,如果为0从pre页面返回的则不获取
    */
  if (pageType.value == 2 && props.editFrom) {
    nextTick(() => {
      tableLoading.value = true;
      directTableRef.value?.getDetail(props.listId);
    });
  }
});

watch(
  () => props.listId,
  (newValue, oldValue) => {
    console.log("listId变了", newValue, oldValue);
    if (newValue) {
      pageType.value = 2;
    } else {
      pageType.value = 1;
      goods.value = [];
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
      <div>
        <div class="header-title">
          <span>{{ headerTitle }}</span>
        </div>
      </div>

      <directTable
        :storageList="storageList"
        :procureList="procureList"
        :supList="supList"
        :pageType="pageType"
        @sendData="handleChangeData"
        @sendInfo="handleChangeInfo"
        @sendLoad="hanldeLoading"
        @change-wh="handleChangeWh"
        :inputBarcode="input_barcode"
        ref="directTableRef"
      >
        <template v-slot:note>
          <div class="note absolute left-0">
            <span>备注</span>
            <el-input
              style="width: 240px; margin-left: 010px"
              v-model="note"
              placeholder="请输入备注"
              clearable
              maxlength="30"
            ></el-input>
          </div>
        </template>
      </directTable>

      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
            >可上传pdf和图片格式</span
                > -->
      </div>
      <div class="footer-btn mt-[20px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
      <div class="mt-[20px] pb-[10px]">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlowGlobal
          :id="listId"
          ref="approveFlowRef"
          :order-type="3"
          :wh-id="in_wh_id"
        ></ApproveFlowGlobal>
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
  margin-bottom: 0rem;
}

:deep(.code-box .el-input__wrapper .el-input__inner) {
  font-weight: 700;
  color: #ff5722;
  font-size: 16px;
}
:deep(.code-box .el-input.is-disabled .el-input__inner) {
  -webkit-text-fill-color: #ff5722;
}
</style>
