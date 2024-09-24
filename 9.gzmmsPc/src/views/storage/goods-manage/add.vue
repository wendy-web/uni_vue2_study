<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { checkBarcodeApi, scanCodeApi } from "@/api/common/index";
// 导入公用api类型
import { ICateItem } from "@/api/common/types";
// 导入新建商品api
import { addGoodsApi } from "@/api/storage/goods-manage";
import { IEditGoods } from "@/api/storage/goods-manage/types";
import { clearScanCode, scanCode } from "@/utils/scanCode";
import autocompleteSearch from "./components/autocompleteSearch.vue";
import splitDialog from "./components/splitDialog.vue";

defineOptions({
  name: "StoGoodsManageAdd",
});

interface Props {
  goodsCateList: ICateItem[]; //分类列表
  unitList: ICateItem[]; //计量单位列表
}

const props = defineProps<Props>();
const state = reactive({
  input_barcode: "", //记录一下扫描枪扫描的条码
  form: {
    goods: [] as IEditGoods[],
  },
  goodsIndex: 0, //记录保存时的goods数组下标
});

const current_index = ref(0);
const { form, input_barcode, goodsIndex } = toRefs(state);
const { goods } = toRefs(state.form);
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  barcode: [{ validator: valiBarcode, trigger: "blur" }],
  title: [
    {
      required: true,
      message: "请输入名称",
      trigger: "blur",
    },
  ],
  measure_name: [
    {
      required: true,
      message: "请输入计量单位",
      trigger: ["blur", "change"],
    },
  ],
  class_name: [
    {
      required: true,
      message: "请输入分类",
      trigger: ["blur", "change"],
    },
  ],
});

const splitShow = ref(false);

const emit = defineEmits(["aboutAdd"]);

const disabledSet = computed(() => {
  return (row: IEditGoods) => {
    if (row.title && row.class_name && row.measure_name) return false;
    return true;
  };
});

function getRowClass(row: any) {
  if (!row.row.split_barcode) {
    return "row-expand-cover";
  }

  return "row-expand-cursor";
}

function getSplitInfo(val: any) {
  console.log("val", val);
  let index = current_index.value;
  goods.value[index].split_goods.push(val);
  goods.value[index].split_barcode = val.barcode;
  console.log("goods.value", goods.value);
}

function cellSetSplit(index: number) {
  current_index.value = index;
  splitShow.value = true;
}

const handleBarcodeBlur = async (row: any, code: any) => {
  console.log("code", code);
  if (row.isRepet) {
    row.isRepet = undefined;
  }

  if (code.length < 13) return;
  let data = {
    barcode: code,
  };
  const result = await scanCodeApi(data);
  if (result.code === "0") return;
  if (result.data.gid) {
    ElMessage.warning("该条码已录入");
    return;
  }

  let { title, brand, spec, company, price, img_url, barcode } = result.data;
  row.barcode = barcode;
  row.title = title;
  row.spec = spec;
  row.brand = brand;
  row.company = company;
  row.price = price;
  row.img_url = img_url;
  row.measure_name = "";
  row.class_name = "";
  row.ss_num = "";
  row.order_point = "";
  row.purchase_price = "";
  row.split_goods = [];
};

function valiBarcode(rule: any, value: any, callback: any) {
  if (value.length > 0 && value.length < 8) {
    callback(new Error("条码长度最低8位"));
    return;
  }
  let find_num = 0;

  goods.value.forEach((item) => {
    if (value && item.barcode == value) {
      find_num++;
    }
  });

  if (find_num > 1) {
    callback(new Error("该条码重复输入"));
  } else {
    let someRes = goods.value.find((item) => item.barcode == value && item.isRepet);
    if (someRes) {
      callback(new Error("该条码系统中已存在"));
    } else {
      callback();
    }
  }

  // if (value === "") {
  //   callback(new Error("Please input the password again"));
  // } else if (value !== ruleForm.pass) {
  //   callback(new Error("Two inputs don't match!"));
  // } else {
  //   callback();
  // }
}

// 通过接口获取条码信息
const getBarcodeInfo = async () => {
  console.log("input_barcode.value", input_barcode.value);
  let findRes = goods.value.find((item) => {
    return item.barcode == input_barcode.value;
  });

  if (findRes) {
    // 如果goods列表中存在,则不添加了
    ElMessage.warning("当前列表已添加该条码商品");
    return;
  }
  let code = input_barcode.value;
  let data = {
    barcode: input_barcode.value,
  };
  const result = await scanCodeApi(data);
  if (result.code === "0") {
    goods.value.push({
      barcode: code,
      title: "",
      spec: "",
      brand: "",
      company: "",
      img_url: "",
      goods_class: "",
      measure_name: "",
      class_name: "",
      price: "",
      ss_num: "",
      order_point: "",
      purchase_price: "",
      split_goods: [],
    });
    console.log("goods.value", goods.value);
    return;
  }
  if (result.data.gid) {
    ElMessage.warning("该条码已录入");
    return;
  }
  input_barcode.value = "";
  console.log(result);
  let { title, brand, spec, company, price, img_url, barcode } = result.data;
  goods.value.push({
    barcode,
    title,
    spec,
    brand,
    company,
    price,
    img_url,
    goods_class: "",
    measure_name: "",
    class_name: "",
    ss_num: "",
    order_point: "",
    purchase_price: "",
    split_goods: [],
  });
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击添加一行");
  formRef.value!.clearValidate();
  goods.value.push({
    barcode: "",
    title: "",
    spec: "",
    brand: "",
    company: "",
    img_url: "",
    goods_class: "",
    measure_name: "",
    class_name: "",
    price: "",
    ss_num: "",
    order_point: "",
    purchase_price: "",
    split_goods: [],
    exp_day: "",
    exp_warning_day: "",
    is_unique_identify: 0,
    is_expensed_assets: 0,
  });
  // formRef.value?.validate((valid, fields) => {
  //   if (valid) {
  //     goods.value.push({
  //       barcode: "",
  //       title: "",
  //       spec: "",
  //       brand: "",
  //       company: "",
  //       img_url: "",
  //       goods_class: "",
  //       measure_name: "",
  //       class_name: "",
  //       price: "",
  //       ss_num: "",
  //       order_point: "",
  //       purchase_price: "",
  //       split_goods: [],
  //     });
  //   } else {
  //     console.log("error submit!", fields);
  //     return false;
  //   }
  // });
};

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  console.log(index);
  let valueItem = goods.value.splice(index, 1);
  console.log("valueItem", valueItem);
  formRef.value!.clearValidate();
};

// 选择计量单位时触发
const selectMeasureName = (val: string, row: any) => {
  console.log(val);
};

// 点击取消
const handleCancel = () => {
  emit("aboutAdd", 1);
};

// 点击保存
const hanleSave = () => {
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
    return;
  }

  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");

      await checkRepet();

      formRef.value?.validate(async (valid, fields) => {
        if (valid) {
          console.log("submit!");
          sendData();
        } else {
          console.log("error submit!");
          return false;
        }
      });

      // sendData();
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const sendData = () => {
  let index = goodsIndex.value;
  console.log("index", index);

  console.log("goods.value", goods.value);
  const loadingInstance = ElLoading.service({
    lock: true,
    text: "正在保存中",
    background: "rgba(0, 0, 0, 0.1)",
  });
  if (index >= goods.value.length) {
    loadingInstance.close();
    ElMessage.success("保存成功");
    goods.value = [];
    emit("aboutAdd", 2);
    goodsIndex.value = 0;
    return false;
  }
  addGoodsApi(goods.value[index])
    .then((res) => {
      goodsIndex.value = index + 1;
      sendData();
    })
    .catch((err) => {
      console.log(err);
      loadingInstance.close();
    });
};

// 检查重复条码
async function checkRepet() {
  if (goods.value.length === 0) {
    ElMessage.warning("请先添加数据");
    return;
  }
  let codeList = goods.value.map((item) => {
    return item.barcode;
  });

  const result = await checkBarcodeApi({ barcode: codeList });
  console.log("result", result);
  let list = result.data.barcode;

  if (list.length > 0) {
    let repetBarcode = list.join(",");
    await ElMessageBox.confirm(`条码: ${repetBarcode}在系统中已存在,无需重复添加`, "提示", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    });
    console.log("confirmRes", 111);
    goods.value.forEach((item) => {
      if (list.includes(item.barcode)) {
        item.isRepet = true;
      }
    });
    let fieldList = goods.value.map((item, index) => `goods.${index}.barcode`);
    console.log("fieldList", fieldList);
    formRef.value!.validateField(fieldList);
  }
}

onActivated(() => {
  // 页面加载时调用 监听页面扫描枪的事件
  scanCode(input_barcode, getBarcodeInfo);
});

onDeactivated(() => {
  //  离开页面时, 卸载页面扫描枪键盘监听
  clearScanCode();
});
</script>

<template>
  <div class="app-container">
    <div class="header-title !mb-[10px]">新建货品</div>
    <el-button class="mb-[10px]" type="primary" @click="checkRepet">检查重复条码</el-button>
    <div class="app-card">
      <div class="text-gray-400 mb-[20px]">
        注：连接扫描枪后，在此页面扫描商品条码可自动添加一行
      </div>
      <el-form ref="formRef" :model="form">
        <el-table :data="form.goods" border stripe :row-class-name="getRowClass" default-expand-all>
          <el-table-column type="expand">
            <template #default="{ row, $index }">
              <el-table :data="goods[$index].split_goods" border stripe v-show="row.split_barcode">
                <el-table-column prop="barcode" label="条码" align="center"></el-table-column>
                <el-table-column prop="title" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="brand" label="品牌" align="center"></el-table-column>
                <el-table-column
                  prop="goods_class"
                  label="自定义分类"
                  align="center"
                ></el-table-column>
                <el-table-column prop="spec" label="规格型号" align="center"></el-table-column>
                <el-table-column
                  prop="measure_name"
                  label="计量单位"
                  align="center"
                ></el-table-column>
                <el-table-column prop="class_name" label="分类" align="center"></el-table-column>
                <el-table-column
                  prop="purchase_price"
                  label="默认价格"
                  align="center"
                ></el-table-column>
                <!-- <el-table-column prop="order_point" label="订货点" align="center"></el-table-column> -->
                <!-- <el-table-column prop="ss_num" label="安全库存" align="center"></el-table-column> -->
                <el-table-column
                  prop="quantity"
                  label="拆零数量关系"
                  align="center"
                ></el-table-column>
              </el-table>
            </template>
          </el-table-column>

          <el-table-column type="index" label="序号" width="60" />
          <el-table-column width="160" prop="barcode">
            <template #header>
              <span class="block text-center">条码</span>
              <span>空白时系统自动生成</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.barcode`" :rules="rules.barcode">
                <el-input
                  v-model="scope.row.barcode"
                  @blur="handleBarcodeBlur(scope.row, scope.row.barcode)"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="title" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.title`" :rules="rules.title">
                <!-- <el-input v-model="scope.row.title" placeholder="请输入名称"></el-input> -->
                <!-- <selectSearch></selectSearch> -->
                <autocompleteSearch v-model="scope.row.title"></autocompleteSearch>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand">
            <template #default="scope">
              <el-form-item>
                <el-input v-model="scope.row.brand" placeholder="请输入品牌"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="自定义类别" prop="goods_class">
            <template #default="scope">
              <el-form-item>
                <el-input v-model="scope.row.goods_class" placeholder="请输入自定义类别"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec">
            <template #default="scope">
              <el-form-item>
                <el-input v-model="scope.row.spec" placeholder="请输入规格型号"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="measure_name">
            <template #header>
              <span class="text-red-500">*</span>
              <span>计量单位</span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.measure_name`"
                :rules="rules.measure_name"
              >
                <el-select
                  v-model="scope.row.measure_name"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入计量单位"
                  @change="selectMeasureName($event, scope.row)"
                  popper-class="unit-select-wrapper"
                >
                  <el-option
                    v-for="item in unitList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="class_name">
            <template #header>
              <span class="text-red-500">*</span>
              <span>分类</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.class_name`" :rules="rules.class_name">
                <el-select
                  v-model="scope.row.class_name"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请输入分类"
                >
                  <el-option
                    v-for="item in goodsCateList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="默认价格" prop="purchase_price">
            <template #default="scope">
              <el-form-item>
                <el-input
                  v-model="scope.row.purchase_price"
                  v-inputnum.num_point
                  placeholder="请输入默认价格"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="保质期(天)" prop="exp_day">
            <template #default="scope">
              <el-form-item>
                <el-input
                  v-model="scope.row.exp_day"
                  v-inputnum.int
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="保质期预警(天)" prop="exp_warning_day">
            <template #default="scope">
              <el-form-item>
                <el-input
                  v-model="scope.row.exp_warning_day"
                  v-inputnum.int
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="是否标识管理" prop="is_unique_identify">
            <template #default="scope">
              <el-form-item>
                <el-switch
                  v-model="scope.row.is_unique_identify"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="是否费用化资产" prop="is_expensed_assets">
            <template #default="scope">
              <el-form-item>
                <el-switch
                  v-model="scope.row.is_expensed_assets"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="拆零条码" prop="split_barcode">
            <template #default="{ row, $index }">
              <el-form-item>
                <el-input v-model="row.split_barcode" disabled v-if="row.split_barcode"></el-input>
                <el-button
                  type="primary"
                  @click="cellSetSplit($index)"
                  v-else
                  :disabled="disabledSet(row)"
                >
                  设置拆零规格
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-form-item>
                <el-button type="danger" @click="handleDelete(scope.row, scope.$index)">
                  删除
                </el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="flex justify-center mt-[20px]">
        <el-button type="success" class="w-[100px]" @click="handleAdd">添加</el-button>
      </div>
    </div>
    <div class="footer-btn mt-[40px] pb-[20px]">
      <el-button class="w-[100px]" size="large" @click="handleCancel">取消</el-button>
      <el-button type="primary" class="w-[100px]" size="large" @click="hanleSave">保存</el-button>
    </div>
    <splitDialog
      v-model:visible="splitShow"
      :goodsCateList="goodsCateList"
      :unitList="unitList"
      @set-success="getSplitInfo"
      v-if="splitShow"
    ></splitDialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table .row-expand-cover .cell .el-table__expand-icon) {
  display: none;
}
:deep(.row-expand-cursor) {
  cursor: pointer;
}

.single-select-loadmore .el-select-dropdown__header {
  background-color: #374151;
}
</style>
<style>
.unit-select-wrapper .el-select-dropdown__list {
  display: grid;
  grid-template-columns: repeat(5, 20%);
  min-width: 400px;
}
</style>
