<script setup lang="tsx">
/* 领料出库单新建/编辑页 */
import { Delete, Plus } from "@element-plus/icons-vue";
import type { CascaderValue, FormInstance, FormRules } from "element-plus";
import { ElSelect, resultProps } from "element-plus";
import { dayjs } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { storageLocal } from "@pureadmin/utils";
// 导入获取可添加列表API
import { getLabelInfoApi, getStocksUniqueLabelApi } from "@/api/common/index";
// 引入类型
import type { ICateItem, ISupRecType, IinStockItem } from "@/api/common/types";
// 引入获取详情api
import { detailGetSupApi } from "@/api/storage/get-supplier";
import { GetSupGoods, IGetSupAdd, IGetSupInfo } from "@/api/storage/get-supplier/types";
import { IAddEmit } from "@/api/storage/stotypes";
import type { IUserItem } from "@/api/system/types";
import { formartDate } from "@/utils/validate";
// 引入自定义组件
import InStoBatchSelect, { API as batchApi } from "@/components/BatchSelect/InStoBatchSelect.vue";
import { addDialog, updateDialog } from "@/components/ReDialog";
import InStoSelect from "@/components/SelectDrop/InStoSelect.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
// 使用uniqueHooks
import { useUniqueHooks } from "@/hooks/unique";
import { useUserStore } from "@/store/modules/user";
import assignFlow from "./components/assignFlow.vue";
import selectUniqueCodeVue from "./components/selectUniqueCode.vue";

defineOptions({
  name: "StoGetSupAdd",
});

enum ETitle {
  "新建领料出库单" = 1,
  "编辑领料出库单",
}

interface Props {
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
  userList: IUserItem[];
  placeList: any[];
  recTypeList: ISupRecType[];
  storageList: ICateItem[]; //仓库列表数据
}

const userStore = useUserStore();

const props = withDefaults(defineProps<Props>(), {
  listId: 0,
  editFrom: 0,
  userList: () => [] as IUserItem[],
  placeList: () => [] as any[],
  storageList: () => [] as ICateItem[],
});

// console.log("🚀 ~ file: add.vue:357 ~ placeList:",props.placeList);

// 地点级联选择器的配置
const selectProps = {
  // 显示方式
  expandTrigger: "hover" as const,
  emitPath: false,
  value: "id",
  label: "place_name",
  children: "children",
  multiple: true,
};

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const state = reactive({
  form: {
    goods: [] as IGetSupAdd[],
    out_time: dayjs().format("YYYY-MM-DD"), //出库日期
    receiver_name: "",
    warehouse_id: undefined as FormNumType,
    // warehouse_id: 5,
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
  selectData: [] as IinStockItem[],
  drawerShow: false, //抽屉弹窗开关
  rowList: [
    "barcode",
    "title",
    "spec",
    "stock",
    "measure_name",
    "warehouse_name",
    "brand",
    "class_name",
    "batch_number",
  ], //传给自定义组件的数据

  recTypeItem: undefined as undefined | ISupRecType, //领料类型
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
  selectData,
  drawerShow,
  rowList,
  recTypeItem,
} = toRefs(state);
const { goods } = toRefs(state.form);

const assignFlowRef = ref<InstanceType<typeof assignFlow>>();

let { stockIdList, stockNumList, detailGoodsList } = useUniqueHooks<IGetSupAdd>(goods);
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

const redClass = computed(() => {
  return (id: number) => {
    return assignFlowRef.value?.warehouse_id_list.includes(id) ? "" : "text-red-500";
    // if (isNextStep.value) {
    //   return assignFlowRef.value?.warehouse_id_list.includes(id) ? "" : "text-red-500";
    // } else {
    //   return "";
    // }
  };
});

const goodsLen = computed(() => {
  return goods.value.length;
});

const batchSelectRef = ref<batchApi | null>(null);

/** 批量选择使用地点的value */
const placeValue = ref<number>();
/** 领料申请人id */
const rp_uid = ref<number>(getTokenId());
/** 领料申请人名称 */
const rp_uname = ref("");
/** 指定领取人id */
const ar_uid = ref([getTokenId()]);
/** 指定领取人名称 */
const ar_uname = ref<string[]>([]);
const ar_uname_list = ref<any[]>([]);

/** 指定审批人id */
const ap_uid = ref<number>();
/** 指定审批人名称 */
const ap_uname = ref("");

/** 领料申请人的ref */
const applicatRef = ref<InstanceType<typeof ElSelect>>();

/* 是否点击了下一步 */
// const isNextStep = ref(false);

// const goodsWarehouseId = computed(() => {
//   let idList = goods.value.map((item) => item.warehouse_id);
//   idList = [...new Set(idList)];
//   return idList;
// });

//
function selectWhChange(val: number) {
  console.log("选择盘点仓库", val);
  nextTick(() => {
    batchSelectRef.value?.parentSelectWh();
  });
}

const goodsWarehouseId = computed(() => {
  let list = goods.value.map((item) => {
    return {
      id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
    };
  });

  let result = list.filter((item, index, self) => {
    return self.findIndex((t) => t.id === item.id) === index;
  });

  return result;
});

function getTokenId(): number {
  let user_id = storageLocal().getItem<number>("user_id");
  if (user_id) return user_id;
  let id = userStore.token.split("-").at(-1);
  return Number(id);
}

// const emit = defineEmits(["aboutAdd"]);
// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IGetSupInfo>): void;
}>();

async function getBarcodeInfo() {
  console.log("处理扫码后的事件", input_barcode.value);
  if (!form.value.warehouse_id) {
    ElMessage({
      message: "请先选择仓库",
      duration: 3000,
      type: "warning",
    });
    return;
  }
  let data = {
    content: input_barcode.value,
    document_type: 3, //领料出库单 3
    order_id: props.listId ? props.listId : undefined,
    warehouse_id: form.value.warehouse_id,
    data_type: 1, //明细码和唯一码数据返回类型；0：按照库存所有数据返回：1：只返回一条库存数据；
  };
  const result = await getLabelInfoApi(data);
  // ElMessage.success("扫描成功");

  const findList = result.data.list;
  // code_type 条码类型；1：普通条码二维码；2：库存明细二维码；3：唯一标签二维码；
  const codeType = result.data.code_type;
 
  if (findList.length > 0) {
    let findGoods = findList[0];
    let findBarcode = findList[0].barcode;
    let findRes = goods.value.find((item) => {
      return findGoods.stock_id == item.stock_id;
    });
    switch (codeType) {
      case 1:
        batchSelectRef.value!.setBarcodeSearch(findBarcode);
        drawerShow.value = true;
        return;
      case 2:
        if (!findRes) {
          goods.value.unshift({
            unique: findGoods.unique,
            goods_id: findGoods.goods_id,
            barcode: findGoods.barcode,
            title: findGoods.title,
            spec: findGoods.spec,
            brand: findGoods.brand,
            measure_name: findGoods.measure_name,
            class_name: findGoods.class_name,
            warehouse_id: findGoods.warehouse_id,
            warehouse_name: findGoods.warehouse_name,
            ph_no: findGoods.batch_number,
            rec_num: findGoods.is_have_unique ? 0 : findGoods.stock,
            note: "",
            old_num: findGoods.stock,
            use_place_id: [],
            stock_id: findGoods.stock_id,
            ws_code: findGoods.ws_code,
            in_wh_date: findGoods.in_wh_date,
            pro_time: findGoods.pro_time,
            exp_time: findGoods.exp_time,
            is_have_unique: findGoods.is_have_unique,
            unique_label_detail: [],
          });
        } else {
          ElMessage.info("已添加该条商品明细,请勿重复扫描");
        }
        return;
      case 3:
        if (!findRes) {
          goods.value.unshift({
            unique: findGoods.unique,
            goods_id: findGoods.goods_id,
            barcode: findGoods.barcode,
            title: findGoods.title,
            spec: findGoods.spec,
            brand: findGoods.brand,
            measure_name: findGoods.measure_name,
            class_name: findGoods.class_name,
            warehouse_id: findGoods.warehouse_id,
            warehouse_name: findGoods.warehouse_name,
            ph_no: findGoods.batch_number,
            rec_num: 1,
            note: "",
            old_num: findGoods.stock,
            use_place_id: [],
            stock_id: findGoods.stock_id,
            ws_code: findGoods.ws_code,
            in_wh_date: findGoods.in_wh_date,
            pro_time: findGoods.pro_time,
            exp_time: findGoods.exp_time,
            is_have_unique: true,
            unique_label_detail: [
              {
                unique_code: findGoods.unique_code,
              },
            ],
          });
        } else {
          let unique_label_detail = findRes.unique_label_detail || [];
          let unique_label_list = unique_label_detail.map((el) => el.unique_code);
          console.log("🚀 ~ getBarcodeInfo ~ unique_label_list:", unique_label_list);
          if (unique_label_list.includes(findGoods.unique_code)) {
            ElMessage.info("该唯一码已添加,请勿重复扫描");
            return;
          } else {
            findRes.unique_label_detail?.push({
              unique_code: findGoods.unique_code,
            });
            findRes.rec_num = findRes.unique_label_detail?.length;
            console.log("good.value", goods.value);
          }
        }

        return;
      default:
        break;
    }
  }
}

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  console.log(index);
  let valueArr = goods.value.splice(index, 1);
};

//批量选择使用地点
const batchSelectPlace = (value: CascaderValue) => {
  console.log("🚀 ~ file: add.vue:528 ~ batchSelectPlace ~ value:", value);
  goods.value.forEach((item) => {
    item.use_place_id = value as number[];
  });
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击了添加");
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      goods.value.unshift({
        unique: "",
        goods_id: 0,
        // goods_all_id: 0,
        title: "",
        barcode: "",
        spec: "",
        brand: "",
        measure_name: "",
        class_name: "",
        rec_num: undefined,
        sup_name: "",
        ph_no: "",
        warehouse_id: 0,
        warehouse_name: "",
        note: "",
        old_num: 1,
        use_place_id: [],
        stock_id: 0,
        ws_code: "",
        in_wh_date: "",
        pro_time: "",
        exp_time: "",
        unique_label_detail: [],
      });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// 点击批量添加
const handleBatchAdd = () => {
  if (!form.value.warehouse_id) {
    ElMessage.warning("请先选择出库仓库");
    return;
  }
  drawerShow.value = true;
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectList: IinStockItem[]) => {
  tableLoading.value = true;
  console.log("selectList", selectList);
  let dataLength = selectList.length;
  selectList.forEach((item) => {
    goods.value.unshift({
      unique: item.unique,
      goods_id: item.goods_id,
      // goods_all_id: item.id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
      // sup_name: item.sup_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.batch_number,
      // rec_num: item.rem_num,
      rec_num: item.is_have_unique ? 0 : item.stock,
      note: "",
      // old_rec_num: item.rem_num,
      old_num: item.stock,
      use_place_id: [],
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      in_wh_date: item.in_wh_date,
      pro_time: item.pro_time,
      exp_time: item.exp_time,
      is_have_unique: item.is_have_unique,
      unique_label_detail: [],
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
};

// select下拉选择框的选择触发事件
const selectChange = (item: IinStockItem, row: IGetSupAdd) => {
  // let item = selectData.value[index];

  console.log("item", item);

  // 记录一下之前的row.unique
  // let old_unique = row.unique;
  // 记录一下之前的row.old_rec_num
  // let old_num = row.old_num;
  row.unique = item.unique;
  // row.goods_all_id = item.id;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.brand = item.brand;
  row.class_name = item.class_name;
  // row.sup_name = item.sup_name;
  row.warehouse_name = item.warehouse_name;
  row.warehouse_id = item.warehouse_id;
  // row.ph_no = item.ph_no;
  row.ph_no = item.batch_number;
  // row.rec_num = item.rem_num;
  row.rec_num = item.stock;
  // row.old_rec_num = item.rem_num;
  row.old_num = item.stock;
  row.goods_id = item.goods_id;
  row.stock_id = item.stock_id;
  row.ws_code = item.ws_code;
  row.in_wh_date = item.in_wh_date;
  row.pro_time = item.pro_time;
  row.exp_time = item.exp_time;
  row.is_have_unique = item.is_have_unique;
  if (item.is_have_unique) {
    row.rec_num = 0;
  }

  console.log("goods", form.value.goods);
};

// 单元格鼠标移入时触发
const handleCellEnter = (row: any, column: any, cell: any, event: any) => {
  const property = column.property;
  // if (editProp.value.includes(property)) {
  //   cell.querySelector(".el-input__inner").focus();
  // }
};

const confirmApprover = (val: any) => {
  // console.log("🚀 ~ file: add.vue:657 ~ confirmApprover ~ val:", val);
  ap_uid.value = val.map((item: any) => item.id).join(",");
  ap_uname.value = val.map((item: any) => item.name).join(",");
};
const confirmRevicer = (val: any) => {
  // console.log("🚀 ~ file: add.vue:662 ~ confirmRevicer ~ val:", val);
  ar_uid.value = val.map((item: any) => item.id);
  ar_uname.value = val.map((item: any) => item.name);
  ar_uname_list.value = val.map((item: any) => ({ name: item.name, dept_name: item.dept_name }));
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

  let res = goodsWarehouseId.value.some((item) => {
    return !assignFlowRef.value?.warehouse_id_list.includes(item.id);
  });
  if (res) {
    ElMessageBox.confirm(
      `仓库显示为红色,即表示该仓库未配置仓管员，物料无法发料领取，请联系系统管理员配置`,
      "温馨提示",
      {
        confirmButtonText: "我知道了",
        showCancelButton: false,
        type: "warning",
      },
    ).then(() => {});

    return;
  }

  if (ar_uid.value.length === 0) {
    ElMessageBox.confirm(`未设置指定领取人,请添加指定领取人`, "温馨提示", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    }).then(() => {});
    return;
  }

  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      let list = goods.value.map((item) => {
        // 剔除不需要传递的字段old_rec_num, select_status
        let { old_num, select_status, ...rest } = item;
        return {
          ...rest,
        };
      });
      console.log("list", list);
      let ar_uid_str = ar_uid.value.join(",");
      let ar_uname_str = ar_uname.value.join(",");

      let rec_type = recTypeItem.value?.rec_type;
      let rec_type_name = recTypeItem.value?.name;

      let warehouse = props.storageList.find((item) => {
        return item.id === Number(form.value.warehouse_id);
      });
      // return
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          warehouse_name: warehouse?.name || "",
          warehouse_id: form.value.warehouse_id,
          id: props.listId,
          out_time: form.value.out_time,
          // receiver_name: form.value.receiver_name,
          goods: list,
          note: note.value,
          file_info: file_info.value,
          rp_uid: rp_uid.value,
          ar_uid: ar_uid_str,
          ap_uid: ap_uid.value,
          rp_uname: rp_uname.value,
          ar_uname: ar_uname_str,
          ar_uname_list: ar_uname_list.value,
          ap_uname: ap_uname.value,
          goodsWarehouseId: goodsWarehouseId.value,
          placeList: props.placeList,
          rec_type,
          rec_type_name,
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
    const result = await detailGetSupApi({ id });
    note.value = result.data.note;
    file_info.value = result.data.file_info;
    form.value.warehouse_id = result.data.warehouse_id;
    form.value.receiver_name = result.data.receiver_name;
    form.value.out_time = formartDate(result.data.out_time);
    recTypeItem.value = { rec_type: result.data.rec_type, name: result.data.rec_type_name };
    console.log("recTypeItem.value", recTypeItem.value);

    rp_uid.value = result.data.rp_uid;
    ar_uid.value = result.data.ar_uid.split(",").map((item) => Number(item));
    // ap_uid.value = result.data.ap_uid
    //   ? result.data.ap_uid.split(",").map((item) => Number(item))
    //   : [];
    ap_uid.value = result.data.ap_uid;

    let old_goods = result.data.goods;
    // 将详情返回的商品数据字段 改为需要的字段
    let new_goods = old_goods.map((item: GetSupGoods) => {
      let changeData = changeDetailData(item);
      return changeData;
    });

    detailGoodsList.value = cloneDeep(new_goods);
    goods.value = new_goods;
    console.log("🚀 ~ file: add.vue:721 ~ getDetail ~ goods.value:", goods.value);
  } finally {
    tableLoading.value = false;
  }
};

const selectUniqueCodeRef = ref<InstanceType<typeof selectUniqueCodeVue>>();

// 唯一码的商品-选择明细
async function selectGoodsDetais(row: IGetSupAdd, event: any) {
  console.log("🚀 ~ selectGoodsDetais ~ event:", event.key);
  if (event.key === "Enter") {
    event.preventDefault();
    return;
  }
  let { stock_id } = row;
  let apiData = {
    stock_id,
    type: props.listId ? 2 : 1,
    order_id: props.listId ? props.listId : undefined,
    order_type: 3,
    operate_type: 3,
  };
  const result = await getStocksUniqueLabelApi(apiData);
  let list = result.data.labels;
  let rowCodeList = row.unique_label_detail
    ? row.unique_label_detail.map((item) => item.unique_code)
    : [];

  list.forEach((element: any) => {
    if (rowCodeList.includes(element.code)) {
      element.select_status = true;
    }
  });

  // selectUniqueVue
  addDialog({
    width: "60%",
    draggable: true,
    closeOnClickModal: false,
    btnClass: "w-[80px]",
    closeOnPressEscape: false,
    btnLoading: false,
    showClose: false,
    title: "选择标签明细",
    contentRenderer: () =>
      h(selectUniqueCodeVue, {
        ref: selectUniqueCodeRef,
        data: list,
      }),
    beforeCancel: (done) => {
      done();
    },
    beforeSure: async (done) => {
      updateDialog(true, "btnLoading");
      const uniqueCodeList = selectUniqueCodeRef.value?.uniqueCodeList || [];
      console.log("🚀 ~ beforeSure: ~ uniqueCodeList:", uniqueCodeList);
      row.unique_label_detail = uniqueCodeList;
      console.log("🚀 ~ beforeSure: ~ row.unique_label_detail:", row.unique_label_detail);
      row.rec_num = uniqueCodeList.length;
      updateDialog(false, "btnLoading");
      done();
    },
  });
}

onActivated(() => {
  // if (props.editFrom != 0 && pageType.value == 1) {
  //   getData();
  // }

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
  //
  if (applicatRef.value) {
    rp_uname.value = applicatRef.value.selected.currentLabel;
    // // console.log("🚀 ~ file: add.vue:751 ~ watchEffect ~ rp_uname.value:", rp_uname.value)
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

function changeDetailData(data: GetSupGoods) {
  let {
    unique,
    goods_id,
    // goods_all_id,
    barcode,
    brand,
    class_name,
    title,
    spec,
    measure_name,
    price,
    note,
    ph_no,
    sup_name,
    warehouse_id,
    warehouse_name,
    rec_num,
    stock,
    use_place_id,
    stock_id,
    ws_code,
    in_wh_date,
    pro_time,
    exp_time,
    unique_label_detail,
    is_have_unique,
  } = data;
  let old_num = rec_num + stock;
  console.log("old_num", old_num);
  return {
    unique,
    goods_id,
    // goods_all_id,
    title,
    barcode,
    spec,
    brand,
    measure_name,
    class_name,
    price,
    rec_num,
    sup_name,
    ph_no: ph_no ?? "",
    warehouse_name,
    warehouse_id,
    note,
    old_num,
    select_status: false,
    stock_id,
    ws_code,
    in_wh_date,
    pro_time,
    exp_time,
    unique_label_detail,
    use_place_id: use_place_id ? use_place_id.map((item) => Number(item)) : [],
    is_have_unique,
  };
}
</script>

<template>
  <div class="app-container">
    <div class="app-card" v-loading="tableLoading">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="form">
        <div class="flex flex-wrap">
          <el-form-item
            label="出库仓库"
            prop="warehouse_id"
            :rules="[{ required: true, message: '请选择出库仓库', trigger: 'change' }]"
            class="mr-4"
          >
            <el-select
              v-model="form.warehouse_id"
              placeholder="请选择出库仓库"
              filterable
              @change="selectWhChange"
              :disabled="goodsLen > 0"
            >
              <el-option
                v-for="item in storageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出库日期" prop="out_time" class="mr-4 items-center">
            <el-date-picker
              style="width: 100%"
              v-model="form.out_time"
              type="date"
              placeholder="请选择出库日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <!-- <el-form-item label="领料人" prop="receiver_name">
            <el-row :gutter="0">
              <el-input v-model="form.receiver_name" placeholder="请输入"></el-input>
            </el-row>
          </el-form-item> -->
          <el-form-item label="领料申请人" class="mr-4 items-center">
            <el-select v-model="rp_uid" placeholder="选择领料申请人" filterable ref="applicatRef">
              <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="领料类型" class="mr-4 items-center">
            <el-select
              v-model="recTypeItem"
              placeholder="请选择领料类型"
              filterable
              clearable
              value-key="rec_type"
            >
              <el-option
                v-for="item in recTypeList"
                :key="item.rec_type"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="使用地点" class="mr-4 items-center">
            <el-cascader
              placeholder="添加商品后批量设置使用地点"
              v-model="placeValue"
              :options="placeList"
              :props="selectProps"
              clearable
              filterable
              style="width: 300px"
              @change="batchSelectPlace"
            />
          </el-form-item>
        </div>

        <el-table
          :data="form.goods"
          border
          stripe
          @cell-mouse-enter="handleCellEnter"
          height="600"
          scrollbar-always-on
        >
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" width="140">
            <template #default="scope">
              <span class="table-span">{{ scope.row.barcode || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column label="名称" prop="title" class="table-item" width="240">
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
                <InStoSelect
                  :warehouse_id="form.warehouse_id"
                  :stockIdList="stockIdList"
                  :detailStockIdList="stockNumList"
                  :page-type="pageType"
                  :title="scope.row.title"
                  :rowList="rowList"
                  @change="selectChange($event, scope.row)"
                ></InStoSelect>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" width="160" show-overflow-tooltip>
            <template #default="scope">
              <el-form-item>
                <span class="overflow-hidden whitespace-nowrap text-ellipsis">
                  {{ scope.row.spec || "-" }}
                </span>
              </el-form-item>
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
          <el-table-column label="申领数量" prop="rec_num" width="160">
            <template #header>
              <span class="text-red-500">*</span>
              <span>申领数量</span>
            </template>
            <template #default="scope">
              <el-form-item
                :prop="`goods.${scope.$index}.rec_num`"
                :rules="[
                  {
                    required: true,
                    message: '请输入数量',
                    trigger: 'blur',
                  },
                  {
                    type: 'number',
                    min: 1,
                    max: scope.row.old_num,
                    // message: `须>=1,<= ${scope.row.old_in_num}`,
                    message: `应在1~${scope.row.old_num}范围内`,
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model.number="scope.row.rec_num"
                  placeholder="请输入内容"
                  v-inputnum.intp
                  :disabled="scope.row.is_have_unique"
                >
                  <template #append v-if="scope.row.is_have_unique">
                    <el-button
                      link
                      class="!text-[12px] !text-sky-500"
                      @click="selectGoodsDetais(scope.row, $event)"
                      @keydown="(event: KeyboardEvent) =>{ 
                        if (event.key === 'Enter') {
                         event.preventDefault();
                       }}"
                    >
                      选择编码
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="批次/日期" prop="ph_no" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.ph_no || "-" }}</span>
            </template>
          </el-table-column>

          <el-table-column label="出库仓库" prop="warehouse_name" width="120">
            <template #default="scope">
              <span class="table-span" :class="redClass(scope.row.warehouse_id)">
                {{ scope.row.warehouse_name || "-" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="使用地点" prop="use_place_id" min-width="160">
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
          <el-table-column label="库位" prop="ws_code" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.ws_code || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入库日期" prop="in_wh_date" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.in_wh_date || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产日期" prop="pro_time" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.pro_time || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="到期日期" prop="exp_time" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.exp_time || "-" }}</span>
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
      <div class="flex justify-center mt-[20px] relative">
        <!-- <el-button type="primary" :icon="Plus" @click="handleMoni" class="w-[100px]">
          模拟扫码
        </el-button> -->
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
        <el-button type="success" :icon="Plus" @click="handleAdd" class="w-[100px]">添加</el-button>
        <el-button type="primary" :icon="Plus" @click="handleBatchAdd" class="w-[100px]">
          批量添加
        </el-button>
      </div>

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
      <div class="mt-[20px]">
        <el-divider />
        <!-- 流程组件 -->
        <assignFlow
          ref="assignFlowRef"
          :id="listId"
          @confirmApprover="confirmApprover"
          @confirmRevicer="confirmRevicer"
          :warehouseIds="goodsWarehouseId"
        ></assignFlow>
      </div>
    </div>

    <InStoBatchSelect
      :warehouse_id="form.warehouse_id"
      :stock-id-list="stockIdList"
      ref="batchSelectRef"
      v-model="drawerShow"
      @change="batchSelectchange"
    ></InStoBatchSelect>
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
