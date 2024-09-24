<script setup lang="ts">
import { dayjs } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import type { ICateItem } from "@/api/common/types";
import type { IGoodsItem } from "@/api/common/types";
import { getRetStocksDetailApi } from "@/api/storage/ret-stocks/index";
import type { GoodsType } from "@/api/storage/ret-stocks/types";
import type { IUserItem } from "@/api/system/types";
import ApproveFlowGlobal from "@/components/ApproveLog/ApproveFlowGlobal.vue";
import GoodsBatch from "@/components/BatchSelect/GoodsBatch.vue";
import DropLoad from "@/components/SelectDrop/DropLoad.vue";
import { useUserStore } from "@/store/modules/user";
import { useAdd } from "./utils/add";
import type { ElSelectType, GoodsListType } from "./utils/add";

defineOptions({
  name: "StoRetStocksAdd",
});

const { rules, selectProps, statusOptions } = useAdd();
const userStore = useUserStore();

enum ETitle {
  "新建退库物资清单" = 1,
  "编辑退库物资清单",
}
interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
  userList: IUserItem[];
  storageList: ICateItem[]; //仓库列表数据
  placeList: any[]; //仓库列表数据
}

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
  userList: () => [] as IUserItem[],
  storageList: () => [] as ICateItem[],
  placeList: () => [] as any[],
});

const emit = defineEmits(["aboutAdd"]);

const state = reactive({
  formData: {
    goods: [] as GoodsListType[],
    ret_time: dayjs().format("YYYY-MM-DD"), //入库日期
    warehouse_id: undefined as FormNumType,
    warehouse_name: "",
    ret_uid: userStore.uid, //退库人id
    ret_name: "", //退库人姓名
  },
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  drawerShow: false, //抽屉弹窗开关
});
const { note, file_info, formData, pageType, tableLoading, drawerShow } = toRefs(state);
const { goods, warehouse_name } = toRefs(state.formData);
const barcodeArr = computed(() => {
  return goods.value.map((item) => {
    return item.barcode;
  });
});
const batchSelectRef = ref<InstanceType<typeof GoodsBatch>>();
const formRef = ref<FormInstance>();
/** 选择仓库的ref */
const warehouseRef = ref<ElSelectType>();
const retNameRef = ref<ElSelectType>();

const goodsLen = computed(() => {
  return goods.value.length;
});
const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

// select下拉选择框的选择触发事件

const selectChange = (item: IGoodsItem, row: GoodsListType) => {
  console.log("item", item);
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.brand = item.brand;
  row.class_name = item.class_name;
  row.sup_name = item.sup_name;
  row.goods_id = item.id;
};

async function handleAdd() {
  const validateRes = await formRef.value!.validateField("warehouse_id");

  if (!validateRes) return;
  goods.value.push({
    title: "",
    barcode: "",
    spec: "",
    brand: "",
    measure_name: "",
    class_name: "",
    ret_num: "",
    sup_name: "",
    replace_time: dayjs().format("YYYY-MM-DD"),
    note: "",
    goods_id: 0,
    available_status: undefined,
    use_place_id: undefined,
  });
}

// 点击批量添加
const handleBatchAdd = async () => {
  const validateRes = await formRef.value!.validateField("warehouse_id");

  if (!validateRes) return;
  drawerShow.value = true;
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
function batchSelectchange(batchSelectData: IGoodsItem[]) {
  tableLoading.value = true;
  let dataLength = batchSelectData.length;
  batchSelectData.forEach((item, index) => {
    goods.value.push({
      title: item.title,
      barcode: item.barcode,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      ret_num: "",
      sup_name: item.sup_name,
      replace_time: dayjs().format("YYYY-MM-DD"),
      note: "",
      goods_id: item.id,
      available_status: undefined,
      use_place_id: undefined,
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
}

function handleDelete(row: any, index: number) {
  let valueArr = goods.value.splice(index, 1);
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

// 点击下一步
function hanleNext() {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          ret_time: formData.value.ret_time,
          ret_uid: formData.value.ret_uid,
          ret_name: formData.value.ret_name,
          ret_wh_name: warehouse_name.value || "",
          ret_wh_id: formData.value.warehouse_id,
          id: props.listId,
          goods: goods.value,
          note: note.value,
          file_info: file_info.value,
          placeList: props.placeList,
        },
      });
    } else {
    }
  });
}

async function getDetail(id: number) {
  tableLoading.value = true;
  const result = await getRetStocksDetailApi({ id });
  let res = result.data;
  note.value = res.note;
  file_info.value = res.file_info;
  formData.value.ret_uid = res.ret_uid;
  formData.value.ret_name = res.ret_name;
  formData.value.warehouse_id = res.ret_wh_id;
  formData.value.warehouse_name = res.ret_wh_name;
  tableLoading.value = false;
  goods.value = changeDetailGoods(res.goods);
}

function changeDetailGoods(list: GoodsType[]) {
  let arr = list.map((item) => {
    return {
      id: item.id,
      title: item.title,
      use_place_id: item.use_place_id,
      barcode: item.barcode,
      spec: item.spec,
      brand: item.brand,
      measure_name: item.measure_name,
      class_name: item.class_name,
      ret_num: item.ret_num,
      sup_name: item.sup_name,
      replace_time: item.replace_time,
      note: item.note,
      goods_id: item.goods_id,
      available_status: item.available_status,
    };
  });
  return arr;
}

onActivated(() => {
  console.log("props.editFrom", props.editFrom);
  /*
      当是编辑页时需要判断
      props.editFrom值来判断
      是否获取详情数据,如果为0从pre页面返回的则不获取
    */
  if (pageType.value == 2 && props.editFrom) {
    getDetail(props.listId);
  }
});

watchEffect(() => {
  if (warehouseRef.value) {
    warehouse_name.value = warehouseRef.value.selected.currentLabel;
  }
  if (retNameRef.value) {
    formData.value.ret_name = retNameRef.value.selected.currentLabel;
  }
});
watch(
  () => props.listId,
  (newValue, oldValue) => {
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
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="formData" :rules="rules">
        <div class="flex">
          <el-form-item label="入库日期" class="mr-4">
            <el-date-picker
              style="width: 100%"
              v-model="formData.ret_time"
              type="date"
              placeholder="请选择入库日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item label="退货人" class="mr-4" prop="ret_uid">
            <el-select placeholder="选择退货人" v-model="formData.ret_uid" ref="retNameRef">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="退入仓库" prop="warehouse_id" class="mr-4">
            <el-select
              v-model="formData.warehouse_id"
              placeholder="请选择退入仓库"
              :disabled="goodsLen > 0"
              ref="warehouseRef"
            >
              <el-option
                v-for="item in storageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-table :data="formData.goods" border stripe height="700" scrollbar-always-on>
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" min-width="140">
            <template #default="scope">
              <span class="table-span">{{ scope.row.barcode || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="title" min-width="140">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.title`"
                :rules="rules.title"
                style="width: 100%"
              >
                <DropLoad
                  :title="scope.row.title"
                  @change="selectChange($event, scope.row)"
                ></DropLoad>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" min-width="160" show-overflow-tooltip>
            <template #default="scope">
              <el-form-item>
                <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ scope.row.spec || "-" }}
                </span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand" min-width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.brand || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="class_name" min-width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.class_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" min-width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.measure_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退库数量" prop="ret_num" min-width="120">
            <template #header>
              <span class="text-red-500">*</span>
              <span>退库数量</span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.ret_num`"
                :rules="[
                  {
                    required: true,
                    message: '请输入数量',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model.number="scope.row.ret_num"
                  placeholder="请输入内容"
                  v-inputnum.intp
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="换下日期" prop="replace_time" min-width="120">
            <template #default="scope">
              <el-form-item class="mr-4" prop="replace_time">
                <el-date-picker
                  style="width: 100%"
                  v-model="scope.row.replace_time"
                  type="date"
                  placeholder="换下日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :clearable="false"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="使用位置" prop="use_place_id" min-width="160">
            <template #default="{ row }">
              <el-form-item>
                <el-cascader
                  v-model="row.use_place_id"
                  :options="placeList"
                  :props="selectProps"
                  clearable
                  filterable
                  style="width: 100%"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="可用状态" prop="available_status" min-width="90">
            <template #default="{ row }">
              <el-form-item>
                <el-select v-model="row.available_status" placeholder="请选择">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" min-width="160">
            <template #default="scope">
              <el-form-item>
                <div class="item">
                  <el-input
                    v-model="scope.row.note"
                    placeholder="请输入备注"
                    maxlength="30"
                  ></el-input>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-form-item>
                <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">
                  <template #icon>
                    <i-ep-delete></i-ep-delete>
                  </template>
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px] relative">
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
        <el-button type="success" @click="handleAdd" class="w-[100px]">
          <template #icon>
            <i-ep-plus></i-ep-plus>
          </template>
          添加
        </el-button>
        <el-button type="primary" @click="handleBatchAdd" class="w-[100px]">
          <template #icon>
            <i-ep-plus></i-ep-plus>
          </template>
          批量添加
        </el-button>
      </div>
      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
      </div>
      <div class="footer-btn">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
      <div class="pb-[10px]">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlowGlobal
          ref="approveFlowRef"
          :id="listId"
          :orderType="4"
          :wh-id="formData.warehouse_id"
          :max-height="140"
        ></ApproveFlowGlobal>
      </div>
    </div>
    <GoodsBatch
      v-model="drawerShow"
      @change="batchSelectchange"
      :barcode-list="barcodeArr"
      ref="batchSelectRef"
    ></GoodsBatch>
  </div>
</template>
<style lang="scss" scoped></style>
