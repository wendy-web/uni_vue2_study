// 引入获取货品列表API,供应商列表API
import { getGoodsListApi, getSupListApi } from "@/api/common/index";
// 引入api
import { importRefundApi } from "@/api/buy/refund/index";
import { getSwapDetailApi } from "@/api/buy/swap/index";
// 引入类型
import { ISupItem, IGoodsItem } from "@/api/common/types";
import { IOrderAddTable } from "@/api/buy/order/types";
import type { FormInstance, FormRules } from "element-plus";
import { IReplacementGood, IReturnGood } from "@/api/buy/swap/types";
import { INewRefundGoods } from "./types";
import { IImportItem } from "@/api/buy/refund/types";

// 引入获取部门列表的hooks
import { deptListHooks } from "@/hooks";

import { dayjs } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { formartDate } from "@/utils/validate";

/**@explain 新建/编辑页面的hooks */
export function useAddEdit() {
  const pageType = ref(1); //1是新建,2是编辑
  const formData = reactive({
    replacement_data: dayjs().format("YYYY-MM-DD"), //换货日期
    procure_no: "", //采购单号
    refundGoods: [] as INewRefundGoods[], //换货商品商品数据数组
    buyGoods: [] as IOrderAddTable[], // 换回商商品数据数组
  });
  const { procure_no, refundGoods, buyGoods, replacement_data } = toRefs(formData);
  const formRef = ref<FormInstance>();

  const isImport = ref(false); //记录是否已经导入标识
  const tableLoading = ref(false); // 页面loading(app-card样式区域loading)
  const selectData = ref<INewRefundGoods[]>([]); // 页面暂时没用到
  const backupsData = ref<INewRefundGoods[]>([]); // 导入的数据备份,恢复删除时使用
  const delIds = ref<number[]>([]); // 换货商品被删除的 id数组
  const refundIds = ref<number[]>([]); //已勾选的 换货商品 id数组
  let selectReGoods: INewRefundGoods[] = []; //已勾选的 换货商品数据

  // 换货商品 选择改变时 触发
  function selectRefund(selection: INewRefundGoods[]) {
    console.log("selection", selection);
    selectReGoods = toRaw(selection);
    refundIds.value = selection.map((item: any) => {
      return item.procure_goods_id;
    });
  }
  // 换货商品点击删除
  function handleRefundDelete() {
    delIds.value = refundIds.value;
    console.log("delIds.value", delIds.value);
    refundGoods.value = refundGoods.value.filter((item) => {
      return !refundIds.value.includes(item.procure_goods_id);
    });
  }
  // 换货商品恢复删除
  function handleRecover() {
    let list = toRaw(backupsData.value);
    let arr: INewRefundGoods[] = [];
    list.forEach((item) => {
      if (delIds.value.includes(item.procure_goods_id)) {
        arr.push({ ...item });
      }
    });
    refundGoods.value.push(...arr);
    delIds.value = [];
  }
  // 点击一键复制到换回
  function handleSwap() {
    console.log("selectReGoods", selectReGoods);
    selectReGoods.forEach((item) => {
      let findRes = buyGoods.value.find((newitem) => {
        // return newitem.goods_id == item.goods_id ;
        if (newitem.goods_id == item.goods_id) {
          return newitem.supplier_id == item.supplier_id;
        }
      });

      if (!findRes) {
        buyGoods.value.push({
          barcode: item.barcode,
          title: item.title,
          spec: item.spec,
          brand: item.brand,
          measure_name: item.measure_name,
          class_name: item.class_name,
          sup_name: item.sup_name as string,
          note: item.note,
          price: item.price as string,
          num: item.return_num as string,
          supplier_id: item.supplier_id,
          delivery_time: "",
          submit_time: dayjs().format("YYYY-MM-DD"),
          contract_no: "",
          goods_id: item.goods_id,
          dept_id: item.dept_id,
          sub_total:
            item.price && item.return_num
              ? (parseFloat(item.return_num as string) * parseFloat(item.price)).toFixed(2)
              : "",
        });
      }
    });
    console.log("buyGoods.value", buyGoods.value);
  }

  // 点击导入货品
  const handleImport = async () => {
    // console.log("导入采购单号", form.value.procure_no);
    if (!procure_no) {
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
          // orderSelecteRef.value?.selectBlur();
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
      const result = await importRefundApi({ procure_no: procure_no.value });
      if (result.code === "0") {
        ElMessage.error(result.msg);
        return;
      }

      ElMessage.success("导入成功");
      let list = result.data.list;
      /*
          将导入的数据 转换一下字段,赋值给goods
          procure_goods_id:商品id; ret_num: 换货数量,可修改的;
          note: 备注,默认为空; old_ret_num: 最大可换货数量,ret_num的原始值
        */
      let newList = list.map((item) => {
        let list = changeImport(item);
        return list;
      });
      refundGoods.value = newList;
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

  /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
  const buyRules = reactive<FormRules>({
    title: [
      {
        required: true,
        message: "请选择名称",
        trigger: "change",
      },
    ],
    num: [
      {
        required: true,
        message: "请输入数量",
        trigger: "blur",
      },
    ],
    price: [
      {
        required: true,
        message: "请输入单价",
        trigger: ["blur", "change"],
      },
    ],
    sup_name: [
      {
        required: true,
        message: "请选择供应商",
        trigger: "change",
      },
    ],
    submit_time: [
      {
        required: true,
        message: "请选择提交日期",
        trigger: "change",
      },
    ],
  });
  const goodsList = ref<IGoodsItem[]>([]); //货品数据列表
  const selectLoading = ref(false); //供应商选择框的下拉加载状态
  const supList = ref<ISupItem[]>([]); //供应商列表
  const { departmentList } = deptListHooks(); //部门列表

  const buyTableLoading = ref(false); //换回商品的表格加载状态
  const drawerShow = ref(false); //批量选择弹窗控制开关

  const buyIndexs = ref<number[]>([]); //已勾选的换回商品的 index数组

  const note = ref("");
  const file_info = ref({
    src: "",
    name: "",
  });

  // 获取可录入的货品数据,以及供应商列表
  async function getData() {
    const goodsResult = await getGoodsListApi();
    goodsList.value = goodsResult.data.list;

    const supResult = await getSupListApi();
    supList.value = supResult.data.list;
  }

  // 监听采购数据和采购单价的失去焦点事件
  function bindInputBlur(event: FocusEvent, row: any) {
    const number = Number(row.num);
    const price = row.price;
    if (number && price) {
      row.sub_total = (number * parseFloat(row.price)).toFixed(2);
    }
  }
  // 供应商下拉框 显示和隐藏时触发
  function visibleChange(val: Boolean, row: any) {
    if (val) {
      // val为true的时候表示为显示,显示的时候需要知道当前条码的供应商哪些已经被选择
      selectLoading.value = true;
      let barcode = row.barcode;
      // 1. 拿到当前行的barcode,拿到goods列表中相同barcode的数据
      let arr = buyGoods.value.filter((item) => {
        return item.barcode == barcode;
      });
      console.log("arr", arr);
      // 2. 拿到相同barcode数据中的所有供应商id,sup_id
      let supIds = arr.map((item) => {
        return item.supplier_id;
      });
      console.log("supIds", supIds);
      // 3. 遍历供应商列表,如果包含这些供应商id则设置disable为true
      supList.value.forEach((item) => {
        if (supIds.includes(item.id)) {
          item.disable = true;
        }
      });
      selectLoading.value = false;
    } else {
      // 下拉框 隐藏时,则将所有设为true的disable该为false,重置
      selectLoading.value = false;
      supList.value.forEach((item) => {
        if (item.disable) item.disable = false;
      });
    }
  }
  // 选择供应商 触发事件
  function supChange(index: number, row: any) {
    let item = supList.value[index];
    row.sup_name = item.name;
    row.supplier_id = item.id;
  }

  function handleAdd() {
    // console.log("buyGoods.value", buyGoods.value);
    buyGoods.value.push({
      dept_id: 0,
      submit_time: dayjs().format("YYYY-MM-DD"),
      barcode: "",
      title: "",
      spec: "",
      price: "",
      num: "",
      sub_total: "",
      sup_name: "",
      supplier_id: 0,
      delivery_time: "",
      contract_no: "",
      note: "",
      measure_name: "",
      brand: "",
      class_name: "",
      goods_id: 0,
    });
  }

  // select下拉选择框的选择触发事件
  function selectChange(item: IGoodsItem, row: any) {
    // console.log("index",index)
    // console.log("row",row)
    // return
    // let item = goodsList.value[index];
    console.log(item);
    const barcode = item.barcode;
    let findRes = buyGoods.value.find((item) => {
      return item.barcode == barcode;
    });
    if (!findRes) {
      row.supplier_id = item.supplier_id;
      row.sup_name = item.sup_name;
    }

    row.goods_id = item.id;
    row.title = item.title;
    row.barcode = item.barcode;
    row.spec = item.spec;
    row.measure_name = item.measure_name;
    row.class_name = item.class_name;
    row.brand = item.brand;
    row.price = item.purchase_price ?? "";
  }
  function handleBatchAdd() {
    drawerShow.value = true;
  }
  // 监听批量添加抽屉弹窗子组件的 change事件 回调,拿到选择的商品
  function batchSelectchange(batchSelectData: IGoodsItem[]) {
    buyTableLoading.value = true;
    console.log("selectData", batchSelectData);
    let dataLength = batchSelectData.length;
    batchSelectData.forEach((item, index) => {
      const barcode = item.barcode;
      let findRes = buyGoods.value.find((newitem) => {
        return newitem.barcode == barcode;
      });

      buyGoods.value.push({
        dept_id: 0,
        submit_time: dayjs().format("YYYY-MM-DD"),
        goods_id: item.id,
        barcode: item.barcode,
        title: item.title,
        spec: item.spec,
        price: item.purchase_price ?? "",
        num: "",
        sub_total: "",
        sup_name: !findRes ? item.sup_name : "",
        supplier_id: !findRes ? (item.supplier_id as number) : 0,
        delivery_time: "",
        contract_no: "",
        note: "",
        measure_name: item.measure_name,
        brand: item.brand,
        class_name: item.class_name,
      });
    });

    buyTableLoading.value = false;
    ElMessage.success(`已批量添加${dataLength}条商品`);
  }

  function selectBuy(selection: any) {
    buyIndexs.value = selection.map((item: any) => {
      return item.index;
    });
    console.log("buyIndexs.value", buyIndexs.value);
  }

  // function tableRowClassName(row: any, rowIndex: any) {
  //   row.row.index = row.rowIndex;
  //   console.log("row.row",row.row)
  //   console.log("row.rowIndex",row.rowIndex)
  //   return "";
  // }
  function tableRowClassName({ row, rowIndex }: { row: any; rowIndex: number }) {
    row.index = rowIndex;
    console.log("row", row);
    console.log("rowIndex", rowIndex);
    return "";
  }

  // 点击删除
  function handleDelete() {
    console.log("点击删除");

    buyGoods.value = buyGoods.value.filter((item, index) => {
      return !buyIndexs.value.includes(index);
    });
    console.log("buyGoods.value", buyGoods.value);
  }

  async function getDetail(id: number) {
    try {
      tableLoading.value = true;
      const result = await getSwapDetailApi({ id });
      console.log("reslt", result);
      let res = result.data;
      procure_no.value = res.procure_no;
      replacement_data.value = formartDate(res.replacement_data);
      file_info.value = res.file_info;
      note.value = res.note ?? "";

      let newRefundGoods = res.return_goods.map((item) => {
        let newitem = changeRefundGoods(item);
        return newitem;
      });

      refundGoods.value = newRefundGoods;

      let newBuyGoods = res.replacement_goods.map((item) => {
        let newitem = changeBuyGoods(item);
        return newitem;
      });
      buyGoods.value = newBuyGoods;

      // 拿到通过 采购编号导入的数据
      const resultImport = await importRefundApi({
        procure_no: res.procure_no,
      });
      if (resultImport.code === "0") {
        backupsData.value = cloneDeep(newRefundGoods);
        return;
      }
      let list = resultImport.data.list;
      newRefundGoods.forEach((element) => {
        list.forEach((item) => {
          if (item.id == element.procure_goods_id) {
            element.old_ret_num = element.old_ret_num! + item.rem_num;
            // element.old_ret_num = item.rem_num;
          }
        });
      });

      refundGoods.value = newRefundGoods;
      backupsData.value = cloneDeep(newRefundGoods);
      // 拿到 详情数据中所有的商品id
      let idList = newRefundGoods.map((item: any) => {
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
        return changeImport(item);
      });

      selectData.value = newArr;
      backupsData.value = backupsData.value.concat(cloneDeep(newArr));
    } finally {
      tableLoading.value = false;
    }
  }

  function changeImport(item: IImportItem): INewRefundGoods {
    return {
      goods_id: item.goods_id,
      procure_goods_id: item.id,
      return_num: item.rem_num,
      old_ret_num: item.rem_num,
      barcode: item.barcode,
      title: item.title,
      spec: item.spec,
      brand: item.brand,
      price: item.price,
      class_name: item.class_name,
      measure_name: item.measure_name,
      dept_id: item.dept_id,
      dept_name: item.dept?.name ?? "",
      supplier_id: item.supplier_id,
      sup_name: item.sup_name,
      note: "",
    };
  }

  function changeRefundGoods(item: IReturnGood): INewRefundGoods {
    return {
      barcode: item.goods.barcode,
      title: item.goods.title,
      spec: item.goods.spec,
      brand: item.goods.brand,
      class_name: item.goods.class_name,
      measure_name: item.goods.measure_name,
      return_num: item.return_num,
      note: item.note,
      supplier_id: item.supplier_id,
      sup_name: item.supplier?.name ?? "",
      dept_name: item.depts?.name ?? "",
      goods_id: item.goods_id,
      procure_goods_id: item.procure_goods_id,
      dept_id: item.dept_id,
      old_ret_num: item.return_num,
    };
  }

  function changeBuyGoods(item: IReplacementGood): IOrderAddTable {
    return {
      delivery_time: item.delivery_time,
      submit_time: item.submit_time,
      dept_id: item.dept_id,
      contract_no: item.contract_no,
      supplier_id: item.supplier_id,
      goods_id: item.goods_id,
      barcode: item.goods.barcode,
      title: item.goods.title,
      spec: item.goods.spec,
      brand: item.goods.brand,
      measure_name: item.goods.measure_name,
      class_name: item.goods.class_name,
      note: item.note,
      price: item.price,
      dept_name: item.depts?.name ?? "",
      sup_name: item.supplier?.name ?? "",
      num: item.num.toString(),
    };
  }

  return {
    formRef,
    pageType,
    formData,
    procure_no,
    refundGoods,
    buyGoods,
    replacement_data,
    isImport,
    tableLoading,
    selectData,
    backupsData,
    delIds,
    handleRefundDelete,
    selectRefund,
    handleRecover,
    handleImport,
    sendImport,
    goodsList,
    selectLoading,
    supList,
    departmentList,
    selectChange,
    bindInputBlur,
    visibleChange,
    supChange,
    handleDelete,
    handleAdd,
    handleBatchAdd,
    getData,
    drawerShow,
    batchSelectchange,
    selectBuy,
    tableRowClassName,
    buyRules,
    note,
    file_info,
    getDetail,
    handleSwap,
  };
}
