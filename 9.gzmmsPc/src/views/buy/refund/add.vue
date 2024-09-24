<!-- 采购退货单新建/编辑页 -->
<template>
  <div class="app-container">
    <div class="app-card" v-loading="tableLoading">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="form">
        <!-- <el-form-item label="采购单号" v-if="pageType == 1">
          <el-row :gutter="0">
            <el-input v-model="form.procure_no" ref="procure_input"></el-input>
          </el-row>
          <el-button type="primary" link @click="handleImport" class="ml-[10px]">
            导入货品
          </el-button>
        </el-form-item> -->
        <div class="flex">
          <el-form-item label="采购单号">
            <order-select
              :order-num="form.procure_no"
              @change="orderChange"
              :list="procureList"
              ref="orderSelecteRef"
              :is-disabled="pageType == 2"
            ></order-select>
          </el-form-item>
          <el-form-item label="退货日期" class="ml-[20px]">
            <el-date-picker
              style="width: 100%"
              v-model="form.return_time"
              type="date"
              placeholder="请选择退货日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </div>

        <el-table
          :data="form.goods"
          border
          stripe
          @cell-mouse-enter="handleCellEnter"
          height="800"
          scrollbar-always-on
        >
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" width="160">
            <template #default="scope">
              <el-form-item>
                <!-- <el-input v-model="scope.row.barcode" disabled></el-input> -->
                <span>{{ scope.row.barcode || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column label="名称" prop="title" class="table-item" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.title`" :rules="rules.title">
                <!-- <select-drop
                  :list="selectData"
                  :title="scope.row.title"
                  @change="selectChange($event, scope.row)"
                ></select-drop> -->
                <!-- <el-input v-model="scope.row.title" readonly></el-input> -->
                <span>{{ scope.row.title || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" show-overflow-tooltip>
            <template #default="scope">
              <el-form-item>
                <!-- <el-input v-model="scope.row.spec" disabled></el-input> -->
                <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ scope.row.spec || "-" }}
                </span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="品牌" prop="brand">
            <template #default="scope">
              <el-form-item>
                <!-- <el-input v-model="scope.row.brand" disabled></el-input> -->
                <span>{{ scope.row.brand || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="分类" prop="class_name">
            <template #default="scope">
              <el-form-item>
                <!-- <el-input v-model="scope.row.class_name" disabled></el-input> -->
                <span>{{ scope.row.class_name || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" width="120">
            <template #default="scope">
              <el-form-item>
                <!-- <el-input v-model="scope.row.measure_name" disabled></el-input> -->
                <span>{{ scope.row.measure_name || "-" }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="退货数量" prop="ret_num" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>退货数量</span>
            </template>
            <template #default="scope">
              <div class="item">
                <el-form-item
                  :prop="`goods.${scope.$index}.ret_num`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入退货数量',
                      trigger: 'blur',
                    },
                    {
                      type: 'number',
                      min: 1,
                      max: scope.row.old_ret_num,
                      // message: `须>=1,<= ${scope.row.old_ret_num}`,
                      message: `应在1~${scope.row.old_ret_num}范围内`,
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    v-model.number="scope.row.ret_num"
                    placeholder="请输入数量"
                    v-inputnum.intp
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="sup_name">
            <template #header>
              <span class="text-red-500">*</span>
              <span>供应商</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.sup_name`">
                <div class="item">
                  <!-- <el-input v-model.number="scope.row.sup_name" placeholder="" disabled></el-input> -->
                  <span>{{ scope.row.sup_name }}</span>
                </div>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="note" width="180">
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
        <!-- <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button> -->
        <el-button type="success" @click="handleAdd" class="w-[100px]" v-show="delIds.length > 0">
          <template #icon>
            <i-ep-RefreshLeft></i-ep-RefreshLeft>
          </template>
          恢复删除
        </el-button>
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
<script lang="ts">
export default {
  name: "refundOrderAdd",
};
</script>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";

import type { FormInstance, FormRules } from "element-plus";

// 引入api
import { importRefundApi, detailRefundApi } from "@/api/buy/refund/index";
// 引入类型
import { IRefundGoods, IAddEmit } from "@/api/buy/refund/types";
// 引入深克隆
import { cloneDeep } from "@pureadmin/utils";

import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";

import { dayjs } from "element-plus";
import { formartDate } from "@/utils/validate";

// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
import { procureListHooks } from "@/hooks/index";

enum ETitle {
  "新建采购退货单" = 1,
  "编辑采购退货单",
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
const { procureList } = procureListHooks(2);
const state = reactive({
  form: {
    goods: [] as IRefundGoods[],
    procure_no: "", //采购单号
    return_time: dayjs().format("YYYY-MM-DD"), //退货日期
  },
  // 需要编辑的属性
  // editProp: ["ret_num","note"],
  note: "",
  file_info: {
    src: "",
    name: "",
  },
  pageType: 1, //1是新建,2是编辑
  tableLoading: false,
  selectData: [] as IRefundGoods[], //可选择的列表
  backupsData: [] as IRefundGoods[], //深克隆的所有可选列表,新建时可直接为导入的数据,编辑时为 goods数据和可选数据总和
  delIds: [] as number[], //被删除的id数组
  isImport: false, //是否已经导入
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
  delIds,
  isImport,
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

// const emit = defineEmits(["aboutAdd"]);
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit): void;
}>();

const orderChange = (index: number) => {
  console.log(index);
  let item = procureList.value[index];
  form.value.procure_no = item.procure_no;
  handleImport();
};

// 点击导入货品
const handleImport = async () => {
  // console.log("导入采购单号", form.value.procure_no);
  if (!form.value.procure_no) {
    return;
  }
  console.log("isImport.value", isImport.value);
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
    tableLoading.value = true;
    const result = await importRefundApi({ procure_no: form.value.procure_no });
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }

    ElMessage.success("导入成功");
    let list = result.data.list;
    /*
      将导入的数据 转换一下字段,赋值给goods
      procure_goods_id:商品id; ret_num: 退货数量,可修改的;
      note: 备注,默认为空; old_ret_num: 最大可退货数量,ret_num的原始值
    */
    let newList = list.map((item) => {
      let { id, goods_id, rem_num, ...rest } = item;
      return {
        ...rest,
        goods_id,
        procure_goods_id: id,
        ret_num: rem_num,
        note: "",
        old_ret_num: rem_num,
      };
    });
    goods.value = newList;
    // 导入重置
    selectData.value = [];
    backupsData.value = cloneDeep(newList);
    // 记录已经导入了
    isImport.value = true;
    delIds.value = [];
  } finally {
    tableLoading.value = false;
  }
};

// 单元格点击删除
const handleDelete = (row: IRefundGoods, index: number) => {
  // 点击删除时,goods数组-1;并返回删除的数组
  let valueItem = goods.value.splice(index, 1);
  console.log("valueItem", valueItem);
  delIds.value.push(row.procure_goods_id);

  // 如果删除的数据中procure_goods_id存在,则可选择的下拉数据+1条
  // procure_goods_id不存在,表示点击添加后,没有选择数据,删除的空数据
  // if (valueItem[0].procure_goods_id) {
  //   selectData.value.push(...valueItem);
  // }
  // console.log("selectData.value", selectData.value);
};

// 点击添加按钮
// const handleAdd = () => {
//   console.log("点击了添加");
//   formRef.value?.validate((valid, fields) => {
//     if (valid) {
//       console.log("submit!");
//       if (selectData.value.length == 0 && goods.value.length == 0) {
//         ElMessage.warning("请您先导入货品~");
//         return;
//       }
//       if (selectData.value.length == 0) {
//         ElMessage.warning("没有可添加的数据了~");
//         return;
//       } else {
//         goods.value.push({
//           procure_goods_id: 0,
//           procure_id: 0,
//           title: "",
//           barcode: "",
//           spec: "",
//           brand: "",
//           measure_name: "",
//           class_name: "",
//           price: "",
//           ret_num: "",
//           sup_name: "",
//           delivery_time: "",
//           contract_no: "",
//           note: "",
//           old_ret_num: 1,
//         });
//       }
//     } else {
//       console.log("error submit!", fields);
//       return false;
//     }
//   });
// };

// 点击恢复删除按钮
const handleAdd = () => {
  let list = toRaw(backupsData.value);
  let arr: IRefundGoods[] = [];
  list.forEach((item) => {
    if (delIds.value.includes(item.procure_goods_id)) {
      arr.push({ ...item });
    }
  });
  // goods.value.push(...cloneDeep(arr));
  goods.value.push(...arr);
  delIds.value = [];
};

// select下拉选择框的选择触发事件
// const selectChange = (index: number, row: any) => {
//   let item = selectData.value[index];
//   console.log("item", item);

//   let old_id = row.procure_goods_id;
//   console.log("old_id", old_id);

//   row.title = item.title;
//   row.barcode = item.barcode;
//   row.spec = item.spec;
//   row.measure_name = item.measure_name;
//   row.brand = item.brand;
//   row.class_name = item.class_name;
//   row.ret_num = item.ret_num;
//   row.old_ret_num = item.old_ret_num;
//   row.sup_name = item.sup_name;
//   row.procure_goods_id = item.procure_goods_id;
//   row.procure_id = item.procure_id;
//   row.delivery_time = item.delivery_time;
//   row.contract_no = item.contract_no;

//   let id = item.procure_goods_id;
//   // 当前procure_goods_id已经被选择,不可再次选择,将其过滤掉
//   selectData.value = selectData.value.filter((item) => {
//     return item.procure_goods_id != id;
//   });

//   if (old_id) {
//     let findRes = backupsData.value.find((item) => {
//       return item.procure_goods_id == old_id;
//     });
//     if (findRes) {
//       selectData.value.push(findRes);
//     }
//   }

//   console.log("selectData.value", selectData.value);
// };

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
      let list = goods.value.map((item) => {
        let { old_ret_num, ...rest } = item;
        return {
          ...rest,
        };
      });

      emit("aboutAdd", {
        val: 2,
        preInfo: {
          procure_no: form.value.procure_no,
          return_time: form.value.return_time,
          id: props.listId,
          goods: list,
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
    const result = await detailRefundApi({ id });
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    form.value.procure_no = result.data.procure_no;
    form.value.return_time = formartDate(result.data.return_time);

    let old_goods = result.data.goods;
    let new_goods = old_goods.map((item: any) => {
      let {
        goods_id,
        procure_goods_id,
        procure_id,
        barcode,
        title,
        spec,
        measure_name,
        price,
        ret_num,
        sup_name,
        delivery_time,
        contract_no,
        note,
        brand,
        class_name,
      } = item;
      let old_ret_num = item.ret_num;
      return {
        goods_id,
        procure_goods_id,
        procure_id,
        barcode,
        title,
        spec,
        measure_name,
        price,
        ret_num,
        sup_name,
        delivery_time,
        contract_no,
        note,
        brand,
        class_name,
        old_ret_num,
      };
    });
    // 拿到通过 采购编号导入的数据
    const resultImport = await importRefundApi({
      procure_no: result.data.procure_no,
    });
    if (resultImport.code === "0") {
      goods.value = new_goods;
      backupsData.value = cloneDeep(new_goods);
      return;
    }
    let list = resultImport.data.list;
    // importData.value = [...list];
    // 判断 如果导入数据中的id == 详情数据中的 procure_goods_id,则最大的退货数量 = 详情数据中的 old_ret_num + 导入数据中的rem_num;
    // 情况1:此种情况出现, 是新建的时候,某个商品填写的退货数量未达到最大值,编辑时,该商品还有可剩余的退货数量,故而最大数量需要相加
    new_goods.forEach((element: any) => {
      list.forEach((item) => {
        if (item.id == element.procure_goods_id) {
          element.old_ret_num = element.old_ret_num + item.rem_num;
        }
      });
    });
    goods.value = new_goods;
    backupsData.value = cloneDeep(new_goods);
    // 拿到 详情数据中所有的商品id
    let idList = new_goods.map((item: any) => {
      return item.procure_goods_id;
    });
    // 判断 如果导入数据中 不包含该商品id,则返回
    // 此做法是因为: 返回的数组,即为添加后 可选择的数据;
    // 情况2: 新建时导入数据有5条,删除了3条,只保存了2条,那么在编辑时,那3条是可选的,为了避免和情况1冲突,选择通过id过滤
    let arr = list.filter((element) => {
      return !idList.includes(element.id);
    });
    // 转换一下数据格式
    let newArr = arr.map((item) => {
      let { id, rem_num, ...rest } = item;
      return {
        ...rest,
        procure_goods_id: id,
        ret_num: rem_num,
        note: "",
        old_ret_num: rem_num,
      };
    });
    selectData.value = newArr;
    // goods.value = goods.value.concat(newArr);
    backupsData.value = backupsData.value.concat(cloneDeep(newArr));
    console.log("goods.value", goods.value);
    console.log("selectData.value", selectData.value);
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
  let search_num = input_barcode.value.search("CGD");
  if (code_len < 12 || search_num == -1) {
    ElMessage.warning(`扫描单号${input_barcode.value}非正常采购单号,请重试`);
    return;
  }

  form.value.procure_no = input_barcode.value;
  handleImport();
}

onActivated(() => {
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
</script>

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
