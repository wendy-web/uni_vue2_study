<script setup lang="ts">
/* 退料入库单新建/编辑页 */
import { Delete, Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
// 引入深克隆
import { cloneDeep } from "@pureadmin/utils";
import { getReceiverListApi } from "@/api/common/index";
import { IReceiveItem } from "@/api/common/types";
// 引入API
import { detailRetSupInApi, importRetSupInApi } from "@/api/storage/ret-supplier";
// 引入类型
import {
  IRetSupInAdd,
  IRetSupInAddInfo,
  IRetSupInGoods,
  IRetSupInImportItem,
} from "@/api/storage/ret-supplier/types";
import { IAddEmit } from "@/api/storage/stotypes";
import { formartDate } from "@/utils/validate";
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
import selectGoods from "./components/selectGoods.vue";

defineOptions({
  name: "StoRetSupInAdd",
});

enum ETitle {
  "新建退料入库单" = 1,
  "编辑退料入库单",
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
  form: {
    wh_rec_no: "", //领料入库单号
    goods: [] as IRetSupInAdd[],
    in_time: dayjs().format("YYYY-MM-DD"), //入库日期
  },
  // 需要编辑的属性
  // editProp: ["rec_num", "note"],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  selectData: [] as IRetSupInAdd[],
  backupsData: [] as IRetSupInAdd[], //深克隆的所有可选列表,新建时可直接为导入的数据,编辑时为 goods数据和可选数据总和
  isImport: false, //是否已经导入
  orderList: [] as IReceiveItem[],
  delIds: [] as number[], //被删除的id数组
  rowList: ["wh_rec_no", "product_name", "receiver_name"],
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
  selectData,
  backupsData,
  isImport,
  orderList,
  delIds,
  rowList,
} = toRefs(state);
const { goods } = toRefs(state.form);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
});

const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();
// const selectGoodsRef = ref<InstanceType<typeof selectGoods>>();
const selectGoodsRef = ref();
const drawerShow = ref(false);

const idsList = computed(() => {
  return goods.value.map((item) => item.stock_id);
});

// const emit = defineEmits(["aboutAdd"]);
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IRetSupInAddInfo>): void;
}>();

const orderChange = async (index: number) => {
  console.log(index);
  let item = orderList.value[index];
  form.value.wh_rec_no = item.wh_rec_no;
  // handleImport();
  const result = await selectGoodsRef.value?.getData(form.value.wh_rec_no);
  console.log("🚀 ~ orderChange ~ result:", result);
  if (result) {
    ElMessage.success("导入成功,请点击选择商品添加货品");
  }
};

// 点击导入货品
const handleImport = async () => {
  console.log("点击导入,领料出库单", form.value.wh_rec_no);
  if (!form.value.wh_rec_no) {
    return;
  }
  if (isImport.value) {
    ElMessageBox.confirm(`您已导入过商品,确定要再次导入吗?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        console.log("点击了 确定");
        orderSelecteRef.value?.selectBlur();
        sendImport();
      })
      .catch((error) => {
        console.log(error);
      });
    return;
  }
  sendImport();
};

const sendImport = async () => {
  try {
    const result = await importRetSupInApi({
      wh_rec_no: form.value.wh_rec_no,
    });
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }
    ElMessage.success("导入成功");
    let list = result.data.list;
    /*
      将导入的数据 转换一下字段,赋值给goods
      in_goods_id:商品id; ret_num: 退货出库数量,可修改的;
      note: 备注,默认为空; old_ret_num: 最大可退货数量,ret_num的原始值
    */
    let newList = list.map((item) => {
      let changeData = changeImportData(item);
      return changeData;
    });

    goods.value = newList;
    // 导入重置
    selectData.value = [];
    backupsData.value = cloneDeep(newList);
    // 记录已经导入了
    isImport.value = true;
    delIds.value = [];
  } catch (error) {}
};

// 单元格点击删除
const handleDelete = (row: IRetSupInAdd, index: number) => {
  // 点击删除时,goods数组-1;并返回删除的数组
  let valueItem = goods.value.splice(index, 1);
  console.log("valueItem", valueItem);
  delIds.value.push(row.stock_id);
};

// 点击恢复删除按钮
const handleAdd = () => {
  let list = toRaw(backupsData.value);
  let arr: IRetSupInAdd[] = [];
  list.forEach((item) => {
    if (delIds.value.includes(item.stock_id)) {
      arr.push({ ...item });
    }
  });
  // goods.value.push(...cloneDeep(arr));
  goods.value.push(...arr);
  delIds.value = [];
};

// 单元格鼠标移入时触发
const handleCellEnter = (row: any, column: any, cell: any, event: any) => {
  const property = column.property;
  // if (editProp.value.includes(property)) {
  //   cell.querySelector(".el-input__inner").focus();
  // }
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
// 点击下一步
const hanleNext = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          wh_rec_no: form.value.wh_rec_no,
          in_time: form.value.in_time,
          id: props.listId,
          goods: goods.value,
          note: note.value,
          file_info: file_info.value,
        },
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

// 选择文件改变
const bindFile = (file: { name: string; src: string }) => {
  console.log("file", file);
  file_info.value = file;
};

const headerTitle = computed(() => {
  return ETitle[pageType.value];
});

// 编辑时 请求详情数据
const getDetail = async (id: number) => {
  try {
    tableLoading.value = true;
    const result = await detailRetSupInApi({ id });
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    form.value.wh_rec_no = result.data.wh_rec_no;
    form.value.in_time = formartDate(result.data.in_time);

    console.log("form.value.wh_rec_no", form.value.wh_rec_no);

    let old_goods = result.data.goods;
    let new_goods = old_goods.map((item) => {
      let changeData = changeDetailData(item);
      return changeData;
    });
    console.log("new_goods", new_goods);

    // 拿到通过 领料出库单号号导入的数据
    const resultImport = await importRetSupInApi({
      wh_rec_no: form.value.wh_rec_no,
    });

    if (resultImport.code === "0") {
      goods.value = new_goods;
      backupsData.value = cloneDeep(new_goods);
      return;
    }
    let importList = resultImport.data.list;

    // 最新判断stock_id
    // 判断 如果导入数据中的id == 详情数据中的 rec_goods_id,则最大的退货数量 = 详情数据中的 old_rec_num + 导入数据中的rem_num;
    // 情况1:此种情况出现, 是新建的时候,某个商品填写的退货数量未达到最大值,编辑时,该商品还有可剩余的退货数量,故而最大数量需要相加
    new_goods.forEach((element) => {
      importList.forEach((item) => {
        if (item.stock_id == element.stock_id) {
          element.old_rec_num = element.old_rec_num + item.rem_num;
        }
      });
    });
    goods.value = new_goods;
    backupsData.value = cloneDeep(new_goods);

    // 拿到 详情数据中所有的商品id
    let idList = new_goods.map((item) => {
      return item.stock_id;
    });

    // 判断 如果导入数据中 不包含该商品id,则返回
    // 此做法是因为: 返回的数组,即为添加后 可选择的数据;
    // 情况2: 新建时导入数据有5条,删除了3条,只保存了2条,那么在编辑时,那3条是可选的,为了避免和情况1冲突,选择通过id过滤
    let arr = importList.filter((element) => {
      return !idList.includes(element.stock_id);
    });

    // 转换一下数据格式
    let newArr = arr.map((item) => {
      let changeData = changeImportData(item);
      return changeData;
    });

    selectData.value = newArr;
    // goods.value = goods.value.concat(newArr)
    backupsData.value = backupsData.value.concat(cloneDeep(newArr));
    selectGoodsRef.value?.getData(form.value.wh_rec_no);
  } finally {
    tableLoading.value = false;
  }
};

// 通过接口获取单号信息
function getBarcodeInfo() {
  if (pageType.value == 2) {
    ElMessage.warning("编辑页面不可导入单号");
    return;
  }
  let code_len = input_barcode.value.length;
  let search_num = input_barcode.value.search("KLL");
  if (code_len < 12 || search_num == -1) {
    ElMessage.warning(`扫描单号${input_barcode.value}非正常领料出库单号,请重试`);
    return;
  }
  form.value.wh_rec_no = input_barcode.value;
  handleImport();
}

async function getData() {
  const result = await getReceiverListApi();
  orderList.value = result.data;
}
// 点击选择商品按钮
const handleSelect = () => {
  drawerShow.value = true;
};
// 监听子组件选择商品的事件
const batchSelectchange = (selectList: IRetSupInImportItem[]) => {
  let datalength = selectList.length;
  selectList.forEach((item) => {
    goods.value.push({
      goods_id: item.goods_id,
      rec_goods_id: item.id,
      wh_rec_id: item.wh_rec_id,
      title: item.title,
      barcode: item.barcode,
      price: item.price,
      rec_num: item.rem_num,
      spec: item.spec,
      brand: item.brand,
      class_name: item.class_name,
      measure_name: item.measure_name,
      sup_name: item.sup_name,
      note: item.note,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.ph_no,
      old_rec_num: item.rem_num,
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      in_wh_date: item.in_wh_date,
    });
  });
  selectGoodsRef.value?.setStatus();
  ElMessage.success(`已批量添加${datalength}条商品`);
};

onActivated(() => {
  getData();
  /*
      当是编辑页时需要判断
      props.editFrom值来判断
      是否获取详情数据,如果为0从pre页面返回的则不获取
    */
  if (pageType.value == 2 && props.editFrom) {
    getDetail(props.listId);
  }
});

watch(
  () => props.listId,
  (newValue, oldValue) => {
    console.log("listId变了", newValue, oldValue);
    if (newValue) {
      console.log("newValue存在");
      pageType.value = 2;
      // getDetail(newValue);
    } else {
      console.log("newValue不存在");
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
function changeDetailData(data: IRetSupInGoods) {
  let {
    goods_id,
    // goods_all_id,
    rec_goods_id,
    title,
    barcode,
    price,
    rec_num,
    spec,
    brand,
    class_name,
    measure_name,
    sup_name,
    note,
    warehouse_id,
    warehouse_name,
    ph_no,
    stock_id,
    ws_code,
    in_wh_date,
  } = data;
  let old_rec_num = rec_num;
  return {
    goods_id,
    // goods_all_id,
    rec_goods_id,
    title,
    barcode,
    price,
    rec_num,
    spec,
    brand,
    class_name,
    measure_name,
    sup_name,
    note,
    warehouse_id,
    warehouse_name,
    ph_no: ph_no ?? "",
    old_rec_num,
    stock_id,
    ws_code,
    in_wh_date,
  };
}

function changeImportData(data: IRetSupInImportItem) {
  let {
    goods_id,
    // goods_all_id,
    id: rec_goods_id,
    wh_rec_id,
    title,
    barcode,
    price,
    rem_num: rec_num,
    spec,
    brand,
    class_name,
    measure_name,
    sup_name,
    warehouse_id,
    warehouse_name,
    ph_no,
    stock_id,
    ws_code,
    in_wh_date,
  } = data;
  let old_rec_num = rec_num;
  return {
    goods_id,
    // goods_all_id,
    rec_goods_id,
    wh_rec_id,
    title,
    barcode,
    price,
    rec_num,
    spec,
    brand,
    class_name,
    measure_name,
    sup_name,
    note: "",
    warehouse_id,
    warehouse_name,
    ph_no: ph_no ?? "",
    old_rec_num,
    stock_id,
    ws_code,
    in_wh_date,
  };
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="flex">
        <div class="header-title">{{ headerTitle }}</div>
        <p class="ml-4 text-gray-400">提示：退料入库按领用出库单原仓库同价退回</p>
      </div>
      <el-form ref="formRef" :model="form">
        <!-- <el-form-item label="领料出库单号">
          <el-row :gutter="0">
            <el-input
              v-model="form.wh_rec_no"
              ref="wh_rec_no_input"
              :disabled="pageType == 2"
            ></el-input>
          </el-row>
          <el-button
            type="primary"
            link
            @click="handleImport"
            class="ml-[10px]"
            :disabled="pageType == 2"
          >
            导入货品
          </el-button>
        </el-form-item> -->
        <div class="flex">
          <el-form-item label="领料出库单" prop="procure_no">
            <order-select
              :order-num="form.wh_rec_no"
              @change="orderChange"
              :list="orderList"
              :rowList="rowList"
              :isDisabled="pageType == 2 || goods.length > 0"
              ref="orderSelecteRef"
            ></order-select>
          </el-form-item>
          <el-form-item label="入库日期" prop="in_time" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="form.in_time"
              type="date"
              placeholder="请选择入库日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
          </el-form-item>
        </div>
        <el-table
          :data="form.goods"
          border
          stripe
          @cell-mouse-enter="handleCellEnter"
          v-loading="tableLoading"
          height="840"
          scrollbar-always-on
        >
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" width="160">
            <template #default="scope">
              <span class="table-span">{{ scope.row.barcode || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" prop="title" class="table-item" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.title`" :rules="rules.title">
                <!-- <el-input v-model="scope.row.title" readonly></el-input> -->
                <span>{{ scope.row.title || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" width="140" show-overflow-tooltip>
            <template #default="scope">
              <span class="overflow-hidden whitespace-nowrap text-ellipsis table-span">
                {{ scope.row.spec || "-" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.brand || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="class_name" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.class_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.measure_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退料数量" prop="rec_num" width="120">
            <template #header>
              <span class="text-red-500">*</span>
              <span>退料数量</span>
            </template>
            <template #default="scope">
              <div class="item">
                <el-form-item
                  :prop="`goods.${scope.$index}.rec_num`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入退料数量',
                      trigger: 'blur',
                    },
                    {
                      type: 'number',
                      min: 1,
                      max: scope.row.old_rec_num,
                      message: `应在1~${scope.row.old_rec_num}范围内`,
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model.number="scope.row.rec_num"
                    placeholder="请输入内容"
                    v-inputnum.intp
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="批次/日期" prop="ph_no" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.ph_no || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入库仓库" prop="warehouse_name" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.warehouse_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="ws_code" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.ws_code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="price" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入库日期" prop="in_wh_date" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.in_wh_date }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" min-width="120">
            <template #default="scope">
              <el-form-item>
                <el-input
                  v-model="scope.row.note"
                  placeholder="请输入备注"
                  maxlength="30"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-form-item>
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="handleDelete(scope.row, scope.$index)"
                >
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px]">
        <div class="flex justify-center mt-[20px]">
          <el-tooltip
            effect="dark"
            content="请先选择领料出库单号"
            placement="top-start"
            :disabled="Boolean(form.wh_rec_no)"
          >
            <el-button type="success" :icon="Plus" @click="handleSelect" class="w-[100px]">
              选择商品
            </el-button>
          </el-tooltip>
        </div>
        <!-- <el-button type="success" @click="handleAdd" class="w-[100px]" v-show="delIds.length > 0">
          <template #icon>
            <i-ep-RefreshLeft></i-ep-RefreshLeft>
          </template>
          恢复删除
        </el-button> -->
      </div>
      <div class="note">
        <span>备注</span>
        <el-input
          style="width: 240px; margin-left: 10px"
          v-model="note"
          placeholder="请输入备注"
          clearable
          maxlength="30"
        ></el-input>
      </div>
      <div class="mt-[10px] flex items-center">
        <span class="block mr-[10px]">附件</span>
        <PdfImgUpload :file_info="file_info" @fileChange="bindFile"></PdfImgUpload>
        <!-- <span class="text-[12px] text-gray-400 inline-block ml-[10px]"
            >可上传pdf和图片格式</span
              > -->
      </div>
      <div class="footer-btn mt-[0px] pb-[10px]">
        <el-divider />
        <el-button @click="handeleCancel" class="w-[100px]" size="large">取消</el-button>
        <el-button type="primary" @click="hanleNext" class="w-[100px]" size="large">
          下一步
        </el-button>
      </div>
    </div>
    <selectGoods
      v-model="drawerShow"
      :ids="idsList"
      ref="selectGoodsRef"
      @change="batchSelectchange"
    ></selectGoods>
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
