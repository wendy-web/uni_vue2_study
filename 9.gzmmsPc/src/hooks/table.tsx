import { ElTooltip } from "element-plus";
import { type AdaptiveConfig } from "@pureadmin/table";
import { isArray } from "@pureadmin/utils";
import { AxiosPromise, ResponseType } from "axios";
import { h, render } from "vue";
import { onlyInt, onlyIntp, onlyNumAlp, onlyNumPoint } from "@/utils/index";
import DropLoad from "@/components/SelectDrop/DropLoad.vue";
// 引入选择部门自定义组件跟公共组件中的不是同一个
// import deptSelect from "./components/deptSelect/index.vue";
import selectDateVue from "./components/selectDate/index.vue";
import selectSupVue from "./components/selectSup/index.vue";
import wInputVue from "./components/wInput/index.vue";

interface IOptions {
  editProp: string[];
  type?: number;
}
export function useAdaptiveConfig() {
  /** 撑满内容区自适应高度相关配置 */
  const adaptiveConfig: AdaptiveConfig = {
    /** 表格距离页面底部的偏移量，默认值为 `96` */
    offsetBottom: 100,
    /** 是否固定表头，默认值为 `true`（如果不想固定表头，fixHeader设置为false并且表格要设置table-layout="auto"） */
    // fixHeader: true
    /** 页面 `resize` 时的防抖时间，默认值为 `60` ms */
    // timeout: 60
    /** 表头的 `z-index`，默认值为 `100` */
    zIndex: 8,
  };
  /* 
    表格设置了自适应撑满高度的情况下,打印预览后表格高度会莫名增加导致出现滚动条,故设置最大高达限制
  */
  const maxHeight = 1000;
  return {
    adaptiveConfig,
    maxHeight,
  };
}

// export function useCellOmit(options?: IOptions) {
/**
 * @param options(非必填有默认值)需要两个参数:editProp和type
 * @explain editProp表示所要控制列的prop数组,不传默认为["goods.title", "goods.spec"],
 * @explain type表示获取文本的方式,不传默认为0对应editProp["goods.title", "goods.spec"]格式,type为真row[property]对应editProp["title","spec"]格式,
 *
 */
export function useCellOmit(
  options: IOptions = {
    editProp: ["goods.title", "goods.spec"],
    type: 0,
  },
) {
  let timeID: ReturnType<typeof setTimeout> | undefined;

  const tooltipContent = ref("");
  const tooltipVisible = ref(false);
  const triggerRef = ref({
    getBoundingClientRect() {
      return position.value;
    },
  });

  const position = ref({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  // const editProp = ["goods.title", "goods.spec"];
  const { editProp, type } = options;

  function handleCellEnter(row: any, column: any, cell: any, event: any) {
    const property = column.property as string;
    if (editProp.includes(property)) {
      // 定时器处理 有时会莫名显示在左上角
      // timeID = setTimeout(() => {
      /*currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除*/
      let TemporaryTag = document.createElement("span");

      const propertyList = property.split(".");
      TemporaryTag.innerText = type ? row[property] : row[propertyList[0]][propertyList[1]];
      // TemporaryTag.innerText = row[propertyList[0]][propertyList[1]];
      // console.log("TemporaryTag.innerText", TemporaryTag.innerText);
      TemporaryTag.className = "getTextWidth";
      document.querySelector("body")?.appendChild(TemporaryTag);
      let currentWidth = (document.querySelector(".getTextWidth") as HTMLDivElement).offsetWidth;
      // console.log("currentWidth", currentWidth);
      document.querySelector(".getTextWidth")?.remove();

      /*cellWidth为表格容器的宽度 减去的24为单元格的左右padding */
      const cellWidth = event.target.offsetWidth - 24;
      // console.log("cellWidth", cellWidth);

      /*当文本宽度小于||等于容器宽度2倍时，代表文本显示未超过两行,直接return*/

      if (currentWidth <= cellWidth * 2) return;

      /* clientObj为表格容器的位置信息 */
      let clientObj = event.target.getBoundingClientRect();
      tooltipContent.value = type ? row[property] : row[propertyList[0]][propertyList[1]];
      // tooltipContent.value = row[propertyList[0]][propertyList[1]];
      tooltipVisible.value = true;
      position.value = DOMRect.fromRect({
        width: 0,
        height: 0,
        x: clientObj.x + Number(cellWidth / 2),
        y: clientObj.y,
      });

      const vnode = h(ElTooltip, {
        visible: tooltipVisible.value,
        content: tooltipContent.value,
        placement: "top",
        "virtual-triggering": true,
        "virtual-ref": triggerRef,
        // ["onUpdate:visible"]: (visible) => {
        //   console.log("🚀 ~ timeID=setTimeout ~ visible:", visible)
        //   tooltipVisible.value = visible;
        //   // if (!visible) render(null, document.body);
        //   if (!visible) render(null, cell);
        // },
      });
      // render(vnode, document.body);
      render(vnode, cell);
      // }, 500);
    }
  }

  function handleCellLeave(row: any, column: any, cell: any, event: any) {
    const property = column.property;

    if (editProp.includes(property)) {
      tooltipVisible.value = false;
      clearTimeout(timeID);
      // render(null, document.body);
      render(null, cell);
      // if (timeID) clearTimeout(timeID);
    }
  }

  function handleCellClass(data: { row: any; column: any; rowIndex: number; columnIndex: number }) {
    // console.log("column", data.column);
    if(data.column?.property){
      return "cell-overflow";
    }else{
      return ""
    }
   
  }

  return {
    handleCellEnter,
    handleCellLeave,
    handleCellClass
  };
}

type CallbackType<T> = (data: T, responseType: ResponseType) => AxiosPromise;

export function useTable() {
  async function startdownload<T = any>(callback: CallbackType<T>, data: T) {
    const loading = ElLoading.service({
      lock: true,
      text: "正在下载中",
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      const result = await callback(data, "blob");
      const blob = result.data;
      let _fileName = result.headers["content-disposition"].split(";")[1].split("=")[1]; //拆解获取文件名，如果后端有给返回文件名的话
      console.log(_fileName);
      _fileName = decodeURIComponent(_fileName);
      console.log(_fileName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = _fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      ElMessage.success("下载成功");
    } catch (error) {
      ElMessage.error("下载失败");
    } finally {
      loading.close();
    }
  }

  return {
    startdownload,
  };
}

type RenderDataType = {
  cell: any;
  row: any;
  column: any;
  $rowIndex: number;
  vnodeType: string;
};

type UseVxeTableParams = {
  /** 表单formRef的Ref */
  formRef: Ref;
  /** 选择名称触发的事件 */
  selectChange?: (value: any, row: any) => void;
  /** 供应商列表Ref */
  sup_list?: Ref;
  /** 选择供应商时的loading状态Ref */
  selectLoading?: Ref;
  /** 供应商时下拉显隐触发的事件 */
  visibleChange?: (visible: boolean, row: any) => void;
  /** 输入框失去焦点时触发是事件 */
  bindInputBlur?: (row: any) => void;
};

export function useVxeTable(vxeTableParams: UseVxeTableParams) {
  let { formRef, selectChange, sup_list, selectLoading, visibleChange, bindInputBlur } =
    vxeTableParams;
  const cellClick = (val: any) => {
    let { column, cell, row, $rowIndex } = val;
    let { params } = column;

    if (!params || !params.type) return;
    let { type: vnodeType, inputType, dateType } = params;
    let renderData = {
      cell,
      row,
      column,
      $rowIndex,
      vnodeType,
    };
    renderInput(renderData);
  };

  function renderInput(renderData: RenderDataType) {
    let { cell, row, column, $rowIndex, vnodeType } = renderData;
    if (cell.getElementsByClassName("el-input")?.length) {
      return;
    }
    if (!cell.getElementsByClassName("ownInput")[0]) return;
    cell.getElementsByClassName("ownInput")[0].blur();
    cell.getElementsByClassName("ownInput")[0].style.display = "none";
    const formItemEl = cell.querySelector(".el-form-item__content");

    let { field } = column;

    // 选择名称虚拟dom
    const vnodeDropLoad = h(DropLoad, {
      // 等价于 some-prop="hello"
      title: row.title,
      isFocus: true,
      // 等价于 @update="() => {}"
      onChange: ($event) => {
        selectChange && selectChange($event, row);
        formRef.value?.clearValidate(`goods.${$rowIndex}.title`);
      },
      onBlur: () => {
        render(null, formItemEl);
        cell.getElementsByClassName("ownInput")[0].style.display = "block";
      },
    });
    // 选择供应商虚拟dom
    const vnodeSelectSup = h(selectSupVue, {
      info: row,
      sup_list: sup_list ? sup_list.value : [],
      selectLoading: selectLoading ? selectLoading.value : false,
      onVisibleChange: (visible: boolean) => {
        visibleChange && visibleChange(visible, row);
        formRef.value?.clearValidate(`goods.${$rowIndex}.sup_name`);
      },
      onBlur: () => {
        render(null, formItemEl);
        cell.getElementsByClassName("ownInput")[0].style.display = "block";
      },
    });

    const inputField = {
      // 采购单-数量
      num: (inputVal: string) => {
        return onlyIntp(inputVal);
      },
      // 单价
      price: (inputVal: string) => {
        return onlyNumPoint(inputVal);
      },
      // 采购单-合同号
      contract_no: (inputVal: string) => {
        return onlyNumAlp(inputVal);
      },
      note: (inputVal: string) => {
        return inputVal;
      },
      // 其他入库单-入库数量
      in_num: (inputVal: string) => {
        return onlyIntp(inputVal);
      },
      // 其他入库单-批次日期
      ph_no: (inputVal: string) => {
        return onlyNumAlp(inputVal);
      },
      // 其他入库单-库位
      ws_code: (inputVal: string) => {
        return inputVal;
      },
      // 其他入库单-保质期
      exp_day: (inputVal: string) => {
        return onlyInt(inputVal);
      },
    };

    // input输入框虚拟dom
    const vnodeInput = h(wInputVue, {
      modelValue: row[field],
      field,
      "onUpdate:modelValue": (inputVal) => {
        let value = inputField[field as keyof typeof inputField](inputVal);
        vnodeInput.component!.props.modelValue = value;
        row[field] = vnodeInput.component!.props.modelValue;
      },
      onBlur: () => {
        formRef.value?.clearValidate(`goods.${$rowIndex}.${field}`);
        bindInputBlur && bindInputBlur(row);
        render(null, formItemEl);
        cell.getElementsByClassName("ownInput")[0].style.display = "block";
      },
    });

    // 选择日期虚拟dom
    const vnodeDate = h(selectDateVue, {
      modelValue: row[field],
      placeholder: "请输入内容",
      onChange: (inputVal: string) => {
        row[field] = inputVal;
      },
      onBlur: () => {
        bindInputBlur && bindInputBlur(row);
        render(null, formItemEl);
        cell.getElementsByClassName("ownInput")[0].style.display = "block";
      },
    });

    if (vnodeType === "selectTitle") {
      render(vnodeDropLoad, formItemEl);
    } else if (vnodeType === "selectSup") {
      render(vnodeSelectSup, formItemEl);
    } else if (vnodeType === "input") {
      render(vnodeInput, formItemEl);
    } else if (vnodeType === "selectDate") {
      render(vnodeDate, formItemEl);
    }
  }

  return {
    cellClick,
  };
}
