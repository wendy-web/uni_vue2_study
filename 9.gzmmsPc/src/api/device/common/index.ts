import { AxiosPromise } from "axios";
import { PlanDetailType } from "@/api/device/maintain/plan/types";
import type { MaintainProjectList } from "@/api/device/maintain/project/types";
import request from "@/utils/request";
import type {
  DeviceGoodsDrop,
  EquipmentModule,
  IdNameType,
  InspecDataType,
  InspecExecuData,
  ReBaseSelecModule,
} from "./types";

// 登记设备基础数据
export function getBaseSelectApi(): AxiosPromise<EquipmentModule.EqBaseDataType> {
  return request({
    url: "/mro/Post/getEqBaseSelect",
    method: "post",
  });
}

// 货品下拉选择
export function gooddropApi(data: {
  keyword?: string;
  page: number;
  size: number;
}): AxiosPromise<DeviceGoodsDrop.GoodsListData> {
  return request({
    url: "/mro/Post/gooddrop",
    method: "post",
    data,
  });
}

// 设备绑定选择
export function getNoBandEquipmentList(data: {}): AxiosPromise<EquipmentModule.EquipmentListType> {
  return request({
    // url: "/mro/Equipment/getNoBandEquipmentList",
    url: "/mro/post/getNoBandEquipmentList",
    method: "post",
    data,
  });
}

// 资产类型列表
export function getEqipmentTypeSelectApi(): AxiosPromise<EquipmentModule.EqipmentType[]> {
  return request({
    url: "/mro/Post/getEqipmentTypeSelect",
    method: "post",
  });
}

// 维修单基础数据
export function getReBaseSelectApi(): AxiosPromise<ReBaseSelecModule.ReBaseDataType> {
  return request({
    url: "/mro/Post/getReBaseSelect",
    method: "post",
  });
}

// 通过资产类型获取设备档案
export function getEquipmentSelectApi(data: {}): AxiosPromise<EquipmentModule.EquipmentListType> {
  return request({
    url: "/mro/Post/getEqipmentSelect",
    method: "post",
    data,
  });
}

// 获取保养标准下拉数据
export function getMaintProSelectApi(data: {
  keyword: string;
  equipment_type?: number;
  page: number;
  size: number;
}): AxiosPromise<MaintainProjectList> {
  return request({
    url: "/mro/Post/getMaintProSelect",
    method: "post",
    data,
  });
}

// 获取当前用户所属部门的领料单详情数据-关联换上设备列表
export function getWarehouseRecDetailApi(data: {}): AxiosPromise<ReBaseSelecModule.OrderUpDataType> {
  return request({
    url: "/mro/Post/getWarehouseRecDetail",
    method: "post",
    data,
  });
}

// 获取设备的维修数据选择列表-关联换下设备列表
export function getDownEqListApi(data: {}): AxiosPromise<ReBaseSelecModule.DownDataType> {
  return request({
    url: "/mro/Post/getDownEqList",
    method: "post",
    data,
  });
}

// 获取文件类型列表
export function getUploadFileTypeApi(): AxiosPromise<IdNameType[]> {
  return request({
    url: "/mro/Post/getUploadFileType",
    method: "post",
  });
}

// 获取保养计划详情
export function getMaintenancePlanCommonDetailApi(data: {
  id: number;
}): AxiosPromise<PlanDetailType> {
  return request({
    url: "/mro/post/getMaintenancePlan",
    method: "post",
    data,
  });
}

/** 维修单详情页获取单据日志 */
export function getRepairLogApi(data: { id: number; type: number }): AxiosPromise {
  return request({
    url: "/mro/Post/getRepairLog",
    method: "post",
    data,
  });
}

/** 获取点巡检标准下拉列表 */
export function getPointInspectStdSelectApi(data: {}): AxiosPromise<InspecDataType> {
  return request({
    url: "/mro/Post/getPointInspectStdSelect",
    method: "post",
    data,
  });
}

/** 获取点检执行数据 */
export function getExecuteCheckApi(data: { id: number }): AxiosPromise<InspecExecuData.DataType> {
  return request({
    // url: "/mro/PointCheck/getExecuteCheck",
    url: "/mro/post/getExecuteCheck",
    method: "post",
    data,
  });
}

/** Base64图片上传 */
export function getBase64ImgApi(data: { file: string }): AxiosPromise {
  return request({
    url: "/mro/Post/upImageBase64",
    method: "post",
    data,
  });
}

/** 流程详情预览-设备系统所有单据 */
export function getReceiptProListApi(data: { id: number; type: number }): AxiosPromise {
  return request({
    url: "/mro/Post/receiptProList",
    method: "post",
    data,
  });
}

/** 获取保养工单-保养项目明细 */
export function getWorkOrderDetailsApi(data: { id: number }): AxiosPromise {
  return request({
    url: "/mro/Post/getMaintProDetails",
    method: "post",
    data,
  });
}

/** 安全报表下拉 */
export function getSafeReportBaseSelectApi(data: { plan_start_month: string }): AxiosPromise {
  return request({
    url: "/mro/Post/getSafeReportBaseSelect",
    method: "post",
    data,
  });
}

/** 库存标签(二维码)识别-设备模块专享 */
export function getLabelInfoMroApi(data: {}): AxiosPromise {
  return request({
    url: "/apios/home/getLabelInfoMro",
    method: "post",
    data,
  });
}
