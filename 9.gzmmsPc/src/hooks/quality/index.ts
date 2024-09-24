import { downloadByUrl } from "@pureadmin/utils";
import { AxiosPromise, ResponseType } from "axios";
import { addDialog, updateDialog } from "@/components/ReDialog";
import { useSettingsStoreHook } from "@/store/modules/settings";
import QualityApproveFlow from "@/views/quality/components/QualityApproveFlow/index.vue";

/** 各个字段的config配置类型 */
export type fieldConfigType = {
  type: number; //条件类型
  unit: string; //单位
  lower_limit_val: string; // 下限值
  upper_limit_val: string; //上限值
  default_val: string; //文本值
  initval: string; // 显示的标准值
  error_limit_val: string; //误差值
};

type ApproveLog = {
  /** 单据id */
  id: number;
  /** 单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告
   *  4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告
   *  8、战马空罐检验报告 9、原材料使用通知单
   * */
  orderType: number;
  /** 类型: 默认1 为新建, 2为预览,3为详情,4列表,目前来说没啥用 */
  type?: number;
  /** 单据状态 */
  orderStatus?: number;
};

export function useCommonHooks() {
  const useSetting = useSettingsStoreHook();

  /**
   * @explain 此方法需传入data数据对象
   * @param data 对象{id:number,orderType:number,orderStatus?:number,type?:number}
   * @param id 单据id
   * @param orderType 单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告8、战马空罐检验报告 9、原材料使用通知单
   * @param orderStatus 单据状态
   * @param type 可不传,类型: 默认1 为新建, 2为预览,3为详情,4列表,目前来说没啥用
   */
  function showApproveLog(data: ApproveLog) {
    addDialog({
      width: "60%",
      btnClass: "w-[80px]",
      draggable: true,
      title: "审批流程",
      showCancel: false,
      top: "20vh",
      contentRenderer: () =>
        h(QualityApproveFlow, {
          id: data.id,
          orderType: data.orderType,
          orderStatus: data.orderStatus,
          type: data.type,
        }),
      beforeCancel: (done, { options, index }) => {
        console.log("点击了取消按钮");
        done();
      },
    });
  }

  /** 表单单元格校验：是否合格 */
  const validatorCell = (ruleItem: fieldConfigType | undefined, value: string | undefined) => {
    let isOk = true;
    // 如果没有配置信息,则返回true,不检测
    if (!ruleItem) return isOk;
    // 如果value是undefined,则返回true,不检测
    if (typeof value === "undefined") return isOk;
    // 如果vlaue为""空字符串,则返回true, 不检测
    if (typeof value === "string" && value.trim() === "") return isOk;
    let { type: check_type, lower_limit_val, upper_limit_val, error_limit_val } = ruleItem;
    let lower_limit = Number(lower_limit_val);
    let upper_limit = Number(upper_limit_val);
    let newValue = Number(value);

    let error_val = Number(error_limit_val); //误差值 type为8的时候使用 暂时未使用
    // 如果没配置数据默认是合格
    if (!lower_limit && !upper_limit) {
      return true;
    }
    switch (check_type) {
      case 0: // 区间
        if (newValue < lower_limit || newValue > upper_limit) {
          isOk = false;
        }
        break;
      case 1: // 大于
        if (newValue <= lower_limit) {
          isOk = false;
        }
        break;
      case 2: // 大于等于
        if (newValue < lower_limit) {
          isOk = false;
        }
        break;
      case 3: // 小于
        if (newValue >= lower_limit) {
          isOk = false;
        }
        break;
      case 4: // 小于等于
        if (newValue > lower_limit) {
          isOk = false;
        }
        break;
      case 5: // 等于 、有误差按区间
        // 有误差值的时候需要把上下限调整一下
        if (error_val) {
          let _lower_limit = lower_limit - error_val;
          let _upper_limit = lower_limit + error_val;
          if (newValue < _lower_limit || newValue > _upper_limit) {
            isOk = false;
          }
        } else {
          if (newValue != lower_limit) {
            isOk = false;
          }
        }
        break;
      case 8: // 上下浮动 lower_limit ± error_val
        let _lower_limit = lower_limit;
        let _upper_limit = lower_limit;
        if (error_val) {
          _lower_limit = lower_limit - error_val;
          _upper_limit = lower_limit + error_val;
        }
        if (newValue < _lower_limit || newValue > _upper_limit) {
          isOk = false;
        }
        break;
      default:
        isOk = true;
        break;
    }

    return isOk;
  };

  function getCheckInfo(data: { id: number | string }[]) {
    if (data.length > 0) {
      return data.map((item) => {
        let { id, ...rest } = item;
        return typeof id === "string" ? { ...rest } : item;
      });
    } else {
      return undefined;
    }
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

  /** 传入文件链接和文件名称下载 */
  function startDirectDownload(fileSrc: string, fileName: string) {
    let firstPlace = fileSrc.startsWith("/");
    let _fileUrl = firstPlace ? fileSrc : "/" + fileSrc;
    downloadByUrl(useSetting.baseHttp + _fileUrl, fileName);
  }

  return {
    /** 列表点击状态-显示审批流程-此方法需传入data数据对象--{id:number,orderType:number,orderStatus?:number,type?:number} */
    showApproveLog,
    validatorCell,
    getCheckInfo,
    /** 根据传入的接口和参数,下载文件 */
    startDownloadUrl,
    /** 传入文件链接和文件名称下载 */
    startDirectDownload,
  };
}
