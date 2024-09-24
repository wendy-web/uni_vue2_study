import { ElImage } from "element-plus";
import jsPreviewDocx, { JsDocxPreview } from "@js-preview/docx";
import "@js-preview/docx/lib/index.css";
import jsPreviewExcel, { JsExcelPreview } from "@js-preview/excel";
import "@js-preview/excel/lib/index.css";
import jsPreviewPdf, { JsPdfPreview } from "@js-preview/pdf";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useNoticeStore } from "@/store/modules/notice";
import { useSettingsStoreHook } from "@/store/modules/settings";

type fileDataType = {
  name: string;
  url: string;
};

/**
 * 列表页通用hooks
 * @param form 列表页头部表单Ref,非必填
 */
export function useListHooks(form?: Ref) {
  const noticeStore = useNoticeStore();

  /**
   * @example 列表页头部表单数据
   * (采购单,采购退货单,采购换货单,采购入库,其他入库,退货出库单,领料出库单,退料入库单,调拨单,盘点单,报废单)使用
   */
  const formData = ref({
    keyword: "",
    dept_id: undefined as FormNumType,
    time: "",
    page: 1,
    size: 10,
    status: undefined as FormNumType, //状态0待提审,1待审核,2待入库,3已完成,4已撤回,5已驳回,6已作废
    /** 其他入库单和采购入库单字段 */
    in_wh_id: undefined as FormNumType,
  });

  onActivated(() => {
    if (form) {
      form.value.status = noticeStore.backlogStatus;
      return;
    }

    formData.value.status = noticeStore.backlogStatus;
  });
  onDeactivated(() => {
    noticeStore.backlogStatus = undefined;
  });

  return {
    /** 列表页头部表单数据 */
    formData,
  };
}

export function usePreviewHooks() {
  const useSetting = useSettingsStoreHook();

  function previewFile(data: fileDataType) {
    let src = useSetting.baseHttp + data.url;

    let checkRes = checkFileType(data.name);
    if (!checkRes) {
      return ElMessage.warning("暂不支持预览该类型");
    }
    if (checkRes === 1) {
      addDialog({
        width: "60%",
        btnClass: "w-[100px]",
        draggable: true,
        btnLoading: false,
        showCancel: false,
        showConfirm: false,
        // confirmText: "关闭",
        title: "预览",
        top: "0",
        // fullscreen: true,
        style: {
          height: "96vh",
        },
        contentRenderer: () => (
          <div class={"flex justify-center items-center w-full h-[90vh]"}>
            <ElImage style="width: 90%; height: 90%;" src={src} />
          </div>
        ),
      });
    } else if (checkRes === 2) {
      let postfixName = getFilePostfixName(data.name);
      previewOffice(src, postfixName);
    }
  }

  /** 获取文件后缀名 */
  function getFilePostfixName(fileName: string) {
    const dotPosition = fileName.lastIndexOf(".");
    // 如果找到了点，则返回从点之后的字符串（不包括点），即为扩展名
    if (dotPosition !== -1 && dotPosition < fileName.length - 1) {
      return fileName.substring(dotPosition + 1);
    }
    return "";
  }

  const docxRef = ref();
  function previewOffice(src: string, postfixName: string) {
    addDialog({
      width: "80%",
      btnClass: "w-[100px]",
      draggable: true,
      btnLoading: false,
      showCancel: false,
      showConfirm: false,
      // confirmText: "关闭",
      title: "预览",
      top: "2vh",
      // fullscreen: true,
      style: {
        height: "94vh",
      },
      contentRenderer: () => <div ref={docxRef} style="height:88vh;overflow: hidden;"></div>,
    });

    nextTick(async () => {
      let myDocxPreviewer: JsDocxPreview | JsExcelPreview | JsPdfPreview;
      if (postfixName === "docx") {
        myDocxPreviewer = jsPreviewDocx.init(docxRef.value);
      } else if (postfixName === "pdf") {
        myDocxPreviewer = jsPreviewPdf.init(docxRef.value);
      } else {
        myDocxPreviewer = jsPreviewExcel.init(docxRef.value);
      }

      // myDocxPreviewer
      //   .preview(src)
      //   .then((res) => {
      //     console.log("预览完成");
      //   })
      //   .catch((e) => {
      //     console.log("预览失败", e);
      //     updateDialog(false, "visible");
      //     ElMessage.warning("文件预览失败");
      //   });
      try {
        await myDocxPreviewer.preview(src);
      } catch (error) {
        updateDialog(false, "visible");
        ElMessage.warning("文件预览失败");
      }
    });
  }

  /** 返回0标识不支持预览,1预览图片,2预览文件 */
  function checkFileType(fileName: string) {
    let postfixName = getFilePostfixName(fileName);
    let imgPostfixList = ["jpg", "png", "gif", "jpeg"];

    let previewPostfixList = ["pdf", "docx", "xlsx"];
    // 如果后缀名存在
    if (postfixName) {
      if (imgPostfixList.includes(postfixName)) {
        // 图片类型返回1
        return 1;
      } else if (previewPostfixList.includes(postfixName)) {
        // 可预览文件类型返回2
        return 2;
      }
      return 0;
    }

    return 0;
  }

  return {
    previewFile,
    checkFileType,
  };
}
