import jsPreviewDocx from "@js-preview/docx";
import "@js-preview/docx/lib/index.css";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import { downloadByUrl } from "@pureadmin/utils";
import { AxiosPromise, ResponseType } from "axios";

/** 预览使用的hooks */
export function usePreview() {
  const useSetting = useSettingsStoreHook();

  function previewImg(url: string) {
    
    <iframe
      src={`https://view.officeapps.live.com/op/view.aspx?src=${url}`}
      width="100%"
      height="500px"
      frameBorder="0"
    ></iframe>;
  }

  const docxRef = ref();
  function previewOffice(url: string) {
    let src = useSetting.baseHttp + url;
    addDialog({
      width: "80%",
      btnClass: "w-[100px]",
      draggable: true,
      btnLoading: false,
      showCancel: false,
      confirmText: "关闭",
      top: "5vh",
      title: "预览",
      style: {
        height: "90vh",
        overflow: "auto"
      },
      contentRenderer: () =>
        h("div", {
          ref: docxRef,
        }),
    });

    nextTick(() => {
      const myDocxPreviewer = jsPreviewDocx.init(docxRef.value);
      myDocxPreviewer
        .preview(src)
        .then((res) => {
          console.log("预览完成");
        })
        .catch((e) => {
          console.log("预览失败", e);
          updateDialog(false, "visible");
          ElMessage.warning("文件预览失败");
        });
    });
  }


  type CallbackType<T> = (data: T) => AxiosPromise;
  /** 根据传入的接口和参数,下载文件 */
  async function startDownloadUrl<T = any>(callback: CallbackType<T>, data: T) {
    const result = await callback(data);
    let firstPlace = result.data.src.startsWith("/");
    let _fileName = result.data.name;
    let _fileUrl = firstPlace ? result.data.src : "/" + result.data.src;
    downloadByUrl(useSetting.baseHttp + _fileUrl, _fileName);
  }

  return {
    previewImg,
    previewOffice,
    startDownloadUrl
  };
}
