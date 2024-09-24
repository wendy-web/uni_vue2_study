<script setup lang="ts">
// 调拨单新建/编辑页
import { Delete, Plus } from "@element-plus/icons-vue";
import { FormInstance, FormRules } from "element-plus";
import { dayjs } from "element-plus";
// 导入获取可添加列表API
import {
  allotImportApi,
  allotProcureListApi,
  getInstockApi,
  getLabelInfoApi,
} from "@/api/common/index";
import type { IAllotProcureList, ICateItem, IinStockItem } from "@/api/common/types";
import { detailRllotApi } from "@/api/storage/allot";
import type { AllotGoods, IAllotAdd, IAllotAddInfo } from "@/api/storage/allot/types";
import type { IAddEmit } from "@/api/storage/stotypes";
// 引入工具
import { beforeTimestamp, getTimestamp } from "@/utils/validate";
import { formartDate } from "@/utils/validate";
import InStoBatchSelect, { API as batchApi } from "@/components/BatchSelect/InStoBatchSelect.vue";
import InStoSelect from "@/components/SelectDrop/InStoSelect.vue";
import OrderSelect from "@/components/SelectDrop/OrderSelect.vue";
import PdfImgUpload from "@/components/Upload/PdfImgUpload.vue";
// 使用hooks监听扫码枪
import scanHooks from "@/hooks/scanCode";
// 使用uniqueHooks
import { useUniqueHooks } from "@/hooks/unique";
// 引入审批流程自定义组件
import ApproveFlow from "./components/ApproveFlow.vue";

defineOptions({
  name: "StoAllotAdd",
});

enum ETitle {
  "新建调拨单" = 1,
  "编辑调拨单",
}

interface Props {
  storageList: ICateItem[]; //仓库列表数据
  storageFilterList: ICateItem[]; //仓库列表数据
  listId: number; //采购单id
  editFrom: number; //从哪个组件进入add编辑页的标识, 1是从list组件过去,2是detail组件过去, 0是pre组件返回过去的
}

const props = withDefaults(defineProps<Props>(), {
  storageList: () => [] as ICateItem[],
  storageFilterList: () => [] as ICateItem[],
  listId: 0,
  editFrom: 0,
});

// 获取hooks中的变量
let { input_barcode } = scanHooks(getBarcodeInfo);

const state = reactive({
  form: {
    goods: [] as IAllotAdd[],
    out_wh_id: 0, //调出仓库id
    out_wh_name: "", //调出仓库名称
    to_wh_id: 0, //调入仓库id
    to_wh_name: "", //调入仓库名称
    out_time: dayjs().format("YYYY-MM-DD"), //调出日期 需要小于等于 调入日期
    in_time: dayjs().format("YYYY-MM-DD"), //调入日期
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
  inStoGoodsList: [] as IinStockItem[],
  wh_tra_no: "", //调拨单号 编辑时存在
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
    "ws_code",
    "in_wh_date",
  ], //传给自定义组件的数据
  isImport: false, //是否已经导入
});
const {
  // editProp,
  note,
  file_info,
  form,
  pageType,
  tableLoading,
  inStoGoodsList,
  wh_tra_no,
  drawerShow,
  rowList,
  isImport, //是否已经导入
} = toRefs(state);
const { goods } = toRefs(state.form);

let { stockIdList, stockNumList, detailGoodsList } = useUniqueHooks<IAllotAdd>(goods);
const batchSelectRef = ref<batchApi | null>(null);

const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  out_wh_name: [
    {
      required: true,
      message: "请选择调出仓库",
      trigger: "change",
    },
  ],
  to_wh_name: [
    {
      required: true,
      message: "请选择调入仓库",
      trigger: "change",
    },
  ],
  title: [
    {
      required: true,
      message: "请选择名称",
      trigger: "change",
    },
  ],
});

const approveFlowRef = ref<InstanceType<typeof ApproveFlow>>();
const procure_no = ref("");
const orderSelecteRef = ref<InstanceType<typeof OrderSelect>>();
const procureList = ref<IAllotProcureList[]>([]);

// 基于类型
const emit = defineEmits<{
  (e: "aboutAdd", data: IAddEmit<IAllotAddInfo>): void;
}>();

/** 是否已经选择了调出仓库和调入仓库  */
const isSelectWh = computed(() => {
  if (form.value.out_wh_id && form.value.to_wh_id) {
    return true;
  } else {
    return false;
  }
});

const disabledOutDate = (time: Date) => {
  let checkDate = beforeTimestamp();
  if (form.value.in_time) {
    return time.getTime() <= getTimestamp(form.value.in_time) && time.getTime() < checkDate;
  }
  return time.getTime() < checkDate;
};

const disabledToDate = (time: Date) => {
  let checkDate = beforeTimestamp();
  if (form.value.out_time) {
    return time.getTime() < getTimestamp(form.value.out_time);
  }
  return time.getTime() < checkDate;
};

const orderChange = (index: number) => {
  console.log(index);
  let item = procureList.value[index];
  procure_no.value = item.procure_no;
  handleImport();
};
// 点击导入货品
const handleImport = () => {
  if (!procure_no.value) {
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
    const result = await allotImportApi({ procure_no: procure_no.value });
    if (result.code === "0") {
      ElMessage.error(result.msg);
      return;
    }

    ElMessage.success("导入成功");
    let list = result.data.list;
    console.log("list", list);
    // 将导入的数据 转换一下字段,赋值给goods
    let newList = list.map((item) => {
      let {
        unique,
        goods_id,
        barcode,
        title,
        spec,
        measure_name,
        brand,
        class_name,
        warehouse_id,
        warehouse_name,
        ph_no,
        rem_num,
        stock_id,
        ws_code,
        in_wh_date,
        price,
      } = item;
      return {
        unique,
        goods_id,
        barcode,
        title,
        spec,
        measure_name,
        brand,
        class_name,
        warehouse_id,
        warehouse_name,
        ph_no,
        rec_num: rem_num,
        old_num: rem_num,
        note: "",
        stock_id,
        ws_code,
        in_wh_date,
        price,
      };
    });
    goods.value = newList;

    // 记录已经导入了
    isImport.value = true;
  } finally {
    tableLoading.value = false;
  }
};

// 选择调出日期后的事件
function outTimeChange(val: string) {
  let out_timestamp = dayjs(val).valueOf();
  let in_timestamp = dayjs(form.value.in_time).valueOf();
  if (in_timestamp < out_timestamp) {
    form.value.in_time = val;
  }
}

// 选择调出仓库的事件
const outSelectChange = (val: string) => {
  console.log("选择调出仓库", val);
  if (!val) return;
  let item = JSON.parse(val);
  form.value.out_wh_id = item.id;
  form.value.out_wh_name = item.name;
  props.storageList.forEach((value) => {
    if (value.id == form.value.out_wh_id) {
      value.selectStatus = true;
    } else {
      value.selectStatus = false;
    }
  });
  getData();
  getProcureList();
};

const toClearSelect = () => {
  props.storageList.forEach((item) => {
    item.selectStatus = false;
  });
};

// 选择调入仓库的事件
const toSelectChange = (val: string) => {
  console.log("选择调入仓库", val);
  if (!val) return;
  let item = JSON.parse(val);
  form.value.to_wh_id = item.id;
  form.value.to_wh_name = item.name;
  props.storageFilterList.forEach((value) => {
    if (value.id == form.value.to_wh_id) {
      value.selectStatus = true;
    } else {
      value.selectStatus = false;
    }
  });
};

// 单元格点击删除
const handleDelete = (row: any, index: number) => {
  console.log(index);
  let valueArr = goods.value.splice(index, 1);
  if (goods.value.length === 0) {
    isImport.value = false;
    procure_no.value = "";
  }
  // let valueItem = valueArr[0];

  // if (valueItem.unique) {
  //   selectData.value.forEach((item) => {
  //     //如果selectData中存在该元素
  //     if (item.unique == valueItem.unique) {
  //       // 状态恢复可选
  //       item.select_status = false;
  //     }
  //   });
  // }
};

// 点击添加按钮
const handleAdd = () => {
  console.log("点击了添加");
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
      goods.value.push({
        // goods_all_id: 0,
        goods_id: 0,
        barcode: "",
        title: "",
        spec: "",
        brand: "",
        // sup_name: "",
        rec_num: "",
        measure_name: "",
        ph_no: "",
        class_name: "",
        warehouse_id: 0,
        warehouse_name: "",
        unique: "",
        note: "",
        // old_rec_num: 1,
        old_num: 1,
        stock_id: 0,
        ws_code: "",
        in_wh_date: "",
        price: "",
      });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};
// 点击批量添加
const handleBatchAdd = () => {
  formRef.value?.validate((valid, fields) => {
    if (valid) {
      drawerShow.value = true;
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
const batchSelectchange = (selectList: IinStockItem[]) => {
  tableLoading.value = true;
  console.log("selectList", selectList);
  let dataLength = selectList.length;
  selectList.forEach((item) => {
    goods.value.push({
      unique: item.unique,
      goods_id: item.goods_id,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      measure_name: item.measure_name,
      brand: item.brand,
      class_name: item.class_name,
      warehouse_id: item.warehouse_id,
      warehouse_name: item.warehouse_name,
      ph_no: item.batch_number,

      rec_num: item.stock,
      note: "",
      old_num: item.stock,
      stock_id: item.stock_id,
      ws_code: item.ws_code,
      in_wh_date: item.in_wh_date,
      price: item.price,
    });
  });
  batchSelectRef.value?.setStatus();
  tableLoading.value = false;
  ElMessage.success(`已批量添加${dataLength}条商品`);
};

// select下拉选择框的选择触发事件
const selectChange = (item: IinStockItem, row: any) => {
  // let item = selectData.value[index];
  console.log("item", item);

  row.unique = item.unique;
  row.title = item.title;
  row.barcode = item.barcode;
  row.spec = item.spec;
  row.measure_name = item.measure_name;
  row.brand = item.brand;
  row.class_name = item.class_name;
  // row.sup_name = item.sup_name;
  row.warehouse_name = item.warehouse_name;
  row.warehouse_id = item.warehouse_id;
  row.ph_no = item.batch_number;
  row.rec_num = item.stock;
  row.old_num = item.stock;

  row.goods_id = item.goods_id;
  row.stock_id = item.stock_id;
  row.price = item.price;
  row.ws_code = item.ws_code;
  row.in_wh_date = item.in_wh_date;
  console.log("goods", form.value.goods);
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
  if (!form.value.to_wh_id) {
    ElMessage.warning("请您先选择调入仓库");
    return;
  }

  let isNotsetOut = approveFlowRef.value?.isNotsetOutWarehouse();
  let isNotsetTo = approveFlowRef.value?.isNotsetToWarehouse();

  if (isNotsetOut || isNotsetTo) {
    let content = "未设置仓库确认人";
    isNotsetOut && (content = "调出仓库未设置仓库确认人");
    isNotsetTo && (content = "调入仓库未设置仓库确认人");
    isNotsetOut && isNotsetTo && (content = "调出仓库和调入仓库未设置仓库确认人");

    ElMessageBox.confirm(`${content},请联系系统管理员配置`, "温馨提示", {
      confirmButtonText: "我知道了",
      showCancelButton: false,
      type: "warning",
    }).then(() => {});

    return;
  }
  if (goods.value.length < 1) {
    ElMessage.warning("请您先添加数据");
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
      console.log(list);
      emit("aboutAdd", {
        val: 2,
        preInfo: {
          out_wh_id: Number(form.value.out_wh_id),
          out_wh_name: form.value.out_wh_name,
          to_wh_id: Number(form.value.to_wh_id),
          to_wh_name: form.value.to_wh_name,
          out_time: form.value.out_time,
          in_time: form.value.in_time,
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
    const result = await detailRllotApi({ id });

    wh_tra_no.value = result.data.wh_tra_no;
    form.value.out_wh_id = result.data.out_wh_id;
    form.value.out_wh_name = result.data.out_wh_name;
    form.value.to_wh_id = result.data.to_wh_id;
    form.value.to_wh_name = result.data.to_wh_name;
    form.value.out_time = formartDate(result.data.out_time);
    form.value.in_time = formartDate(result.data.in_time);

    note.value = result.data.note;
    file_info.value = result.data.file_info;
    let old_goods = result.data.goods;
    // 将详情返回的商品数据字段 改为需要的字段
    let new_goods = old_goods.map((item) => {
      let changeData = changeDetailData(item);
      return changeData;
    });
    console.log("new_goods", new_goods);

    //#region
    // 拿到调出仓库可添加的数组列表
    // const resultGroup = await getGoodsGroupApi({
    //   warehouse_id: Number(result.data.out_wh_id),
    // });
    // const resultGroup = await getInstockApi({
    //   warehouse_id: Number(result.data.out_wh_id),
    // });
    // let list = resultGroup.data.list;

    /*
      情况1: 新建时某个商品剩余最大数量为10,只录入了5,
      那么在编辑时,该商品的最大数量等于: 详情接口该商品对应的数量 + 已入库分组接口该商品,
      相当于 录入5 + 剩余5 = 实际可录入最大数量
    */

    /*
      情况2: 新建时某个商品剩余最大数量为10,录入10,
      那么在编辑时,已入库分组接口不会返回该商品(剩余数量为0的不返回),
      将该商品手动添加到 可选列表,默认为不可选状态;
      其他: 接口如果设置返回数量为0的商品,会导致其他数量为0的商品也出现选择列表
   */

    // 编辑时,判断详情返回的数据和分组返回的数据
    // new_goods.forEach((element) => {
    //   // 对比两个数据的id查找
    //   let findRes = list.find((item) => {
    //     // return element.goods_all_id == item.id;
    //     return element.unique == item.unique;
    //   });
    //   if (findRes) {
    //     // 解决情况1
    //     // element.old_rec_num = element.old_rec_num + findRes.rem_num;
    //     element.old_rec_num = element.old_rec_num + findRes.stock;
    //     // findRes.rem_num = element.old_rec_num;
    //     findRes.stock = element.old_rec_num;
    //     findRes.select_status = true;
    //   } else {
    //     // 解决情况2
    //     list.unshift({
    //       goods_id: element.goods_id,
    //       id: element.goods_all_id,
    //       title: element.title,
    //       barcode: element.barcode,
    //       spec: element.spec,
    //       brand: element.brand,
    //       measure_name: element.measure_name,
    //       class_name: element.class_name,
    //       // rem_num: element.old_rec_num,
    //       stock: element.old_rec_num,
    //       // sup_name: element.sup_name,
    //       // ph_no: element.ph_no,
    //       batch_number: element.ph_no,
    //       warehouse_id: element.warehouse_id,
    //       warehouse_name: element.warehouse_name,
    //       select_status: true,
    //     })
    //   }
    // });
    //#endregion

    goods.value = new_goods;
  } finally {
    tableLoading.value = false;
  }
};

// 获取可添加的列表数据
const getData = async () => {
  let data = {
    page: 1,
    size: 30,
    is_all: 0,
    warehouse_id: Number(form.value.out_wh_id),
  };
  console.log(data);
  const result = await getInstockApi(data);
  const list = result.data.list;
  if (list.length === 0) {
    ElMessage.warning("当前仓库没有已入库且库存大于0的商品~");
    return;
  }
};

async function getBarcodeInfo() {
  if (!form.value.out_wh_id || !form.value.to_wh_id) {
    ElMessage.warning("请先选择调出和调入仓库");
    return;
  }

  let code = input_barcode.value;
  let data = {
    content: code,
    document_type: 5, //调拨 5
    warehouse_id: Number(form.value.out_wh_id),
  };
  const result = await getLabelInfoApi(data);
  ElMessage.success("扫描成功");
  const findList = result.data.list;
  let success_num = 0;
  let fail_num = 0;
  findList.forEach((element) => {
    let findRes = goods.value.find((item) => {
      return element.stock_id == item.stock_id;
    });
    // 如果不存在则添加
    if (!findRes) {
      goods.value.push({
        goods_id: element.goods_id,
        // goods_all_id: element.id,
        barcode: element.barcode,
        title: element.title,
        spec: element.spec,
        brand: element.brand,
        measure_name: element.measure_name,
        class_name: element.class_name,
        // sup_name: element.sup_name,
        warehouse_id: element.warehouse_id,
        warehouse_name: element.warehouse_name,
        ph_no: element.batch_number,
        rec_num: element.stock,
        unique: element.unique as string,
        note: "",
        old_num: element.stock,
        stock_id: element.stock_id,
        ws_code: element.ws_code,
        in_wh_date: element.in_wh_date,
        price: element.price,
      });
      success_num += 1;
    } else {
      fail_num += 1;
    }
  });

  fail_num === 0
    ? ElMessage.info(`成功添加${success_num}条数据`)
    : ElMessage.info(`成功添加${success_num}条商品,${fail_num}条商品已存在`);
}

// 通过扫描枪扫出来的条码添加商品
// function getBarcodeInfo() {
//   if (!form.value.out_wh_id || !form.value.to_wh_id) {
//     ElMessage.warning("请先选择仓库");
//     return;
//   }
//   if (inStoGoodsList.value.length == 0) {
//     ElMessage.warning("当前没有可选的商品数据");
//     return;
//   }
//   console.log("拿到扫描的条码", input_barcode.value);

//   let findList = inStoGoodsList.value.filter((item) => {
//     if (item.barcode == input_barcode.value) {
//       item.select_status = true;
//     }
//     return item.barcode == input_barcode.value;
//   });
//   if (findList.length === 0) {
//     return ElMessage.warning(`扫描条码${input_barcode.value}商品不在可选范围内`);
//   }

//   let success_num = 0;
//   let fail_num = 0;

//   findList.forEach((element) => {
//     let findRes = goods.value.find((item) => {
//       return element.unique == item.unique;
//     });
//     // 如果不存在则添加
//     if (!findRes) {
//       goods.value.push({
//         goods_id: element.goods_id,
//         // goods_all_id: element.id,
//         barcode: element.barcode,
//         title: element.title,
//         spec: element.spec,
//         brand: element.brand,
//         measure_name: element.measure_name,
//         class_name: element.class_name,
//         // sup_name: element.sup_name,
//         warehouse_id: element.warehouse_id,
//         warehouse_name: element.warehouse_name,
//         ph_no: element.batch_number,
//         rec_num: element.stock,
//         unique: element.unique as string,
//         note: "",
//         // old_rec_num: element.rem_num,
//         old_num: element.stock,
//         stock_id: element.stock_id,
//       });
//       success_num += 1;
//     } else {
//       fail_num += 1;
//     }
//   });

//   fail_num === 0
//     ? ElMessage.info(`成功添加${success_num}条数据`)
//     : ElMessage.info(`成功添加${success_num}条商品,${fail_num}条商品已存在`);
// }
const getProcureList = async () => {
  const result = await allotProcureListApi({
    status: 3,
    warehouse_id: Number(form.value.out_wh_id),
  });
  procureList.value = result.data;
};

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
function changeDetailData(data: AllotGoods) {
  let {
    goods_id,
    barcode,
    brand,
    class_name,
    title,
    spec,
    measure_name,
    note,
    ph_no,
    sup_name,
    warehouse_id,
    warehouse_name,
    unique,
    rec_num,
    stock,
    stock_id,
    ws_code,
    in_wh_date,
    price,
  } = data;
  let old_num = rec_num + stock;
  return {
    goods_id,
    title,
    barcode,
    spec,
    brand,
    measure_name,
    class_name,
    rec_num,
    sup_name,
    ph_no: ph_no ?? "",
    warehouse_name,
    warehouse_id,
    note,
    unique,
    old_num,
    select_status: false,
    stock_id,
    ws_code,
    in_wh_date,
    price,
  };
}
</script>
<template>
  <div class="app-container">
    <div class="app-card">
      <div class="header-title">{{ headerTitle }}</div>
      <el-form ref="formRef" :model="form" :rules="rules">
        <div class="flex items-center">
          <el-form-item label="调出仓库" prop="out_wh_name">
            <el-select
              v-model="form.out_wh_name"
              placeholder="请选择调出仓库"
              filterable
              @change="outSelectChange($event)"
              :disabled="goods.length > 0"
            >
              <el-option
                v-for="item in storageFilterList"
                :key="item.id"
                :label="item.name"
                :value="JSON.stringify(item)"
                :disabled="item.selectStatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调出日期" class="ml-[10px]">
            <el-date-picker
              style="width: 100%"
              v-model="form.out_time"
              type="date"
              placeholder="请选择调出日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
              @change="outTimeChange"
            />
            <!--  :disabled-date="disabledOutDate" -->
          </el-form-item>

          <el-form-item label="调入仓库" class="mx-[10px]" prop="to_wh_name">
            <el-select
              v-model="form.to_wh_name"
              placeholder="请选择调入仓库"
              filterable
              @change="toSelectChange($event)"
              @clear="toClearSelect"
              :disabled="goods.length > 0"
            >
              <el-option
                v-for="item in storageList"
                :key="item.id"
                :label="item.name"
                :value="JSON.stringify(item)"
                :disabled="item.selectStatus"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="调入日期">
            <el-date-picker
              style="width: 100%"
              v-model="form.in_time"
              type="date"
              placeholder="请选择调入日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :clearable="false"
            />
            <!--  :disabled-date="disabledToDate" -->
          </el-form-item>
        </div>
        <div>
          <el-form-item label="采购单号">
            <order-select
              :placeholderHint="!isSelectWh ? '请先选择调出调入仓库' : '请选择或输入采购单号'"
              :order-num="procure_no"
              @change="orderChange"
              :list="procureList"
              ref="orderSelecteRef"
              :is-disabled="pageType == 2 || !isSelectWh"
            ></order-select>
          </el-form-item>
        </div>

        <el-table :data="form.goods" border stripe v-loading="tableLoading" height="580" scrollbar-always-on>
          <el-table-column label="#" type="index" />
          <el-table-column label="条码" prop="barcode" width="160">
            <template #default="scope">
              <span class="table-span">{{ scope.row.barcode || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="title" class="table-item" width="260">
            <template #header>
              <span class="text-red-500">*</span>
              <span>名称</span>
            </template>
            <template #default="scope">
              <el-form-item :prop="`goods.${scope.$index}.title`" :rules="rules.title">
                <InStoSelect
                  :detailStockIdList="stockNumList"
                  :stockIdList="stockIdList"
                  :page-type="pageType"
                  :title="scope.row.title"
                  :rowList="rowList"
                  @change="selectChange($event, scope.row)"
                  :warehouse_id="form.out_wh_id"
                ></InStoSelect>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格型号" prop="spec" width="160" show-overflow-tooltip>
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
          <el-table-column label="批次/日期" prop="ph_no" width="120">
            <template #default="scope">
              <span class="table-span">{{ scope.row.ph_no || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="measure_name" width="90">
            <template #default="scope">
              <span class="table-span">{{ scope.row.measure_name || "-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="调拨数量" prop="rec_num" width="120">
            <template #header>
              <span class="text-red-500">*</span>
              <span>调拨数量</span>
            </template>
            <template #default="scope">
              <div class="item">
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

                      message: `应在1~${scope.row.old_num}范围内`,
                      trigger: 'blur',
                    },
                  ]"
                >
                  <el-input
                    class="item__input"
                    v-model.number="scope.row.rec_num"
                    placeholder="请输入内容"
                    v-inputnum.intp
                  ></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="库位" prop="ws_code" width="100">
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
          <el-table-column label="备注" prop="note">
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
      <div class="mt-[20px] pb-[10px]">
        <el-divider />
        <!-- 流程组件 -->
        <ApproveFlow
          :id="listId"
          :outWhId="form.out_wh_id"
          :toWhId="form.to_wh_id"
          ref="approveFlowRef"
        ></ApproveFlow>
      </div>
    </div>

    <InStoBatchSelect
      :stock-id-list="stockIdList"
      :warehouse_id="form.out_wh_id"
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
