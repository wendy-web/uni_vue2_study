import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { IUser, IUserList, IroleList } from "../system/types";
import {
  FileInfo,
  GetImportData,
  GoodsInSplit,
  IAllotImport,
  IAllotProcureList,
  IApproveLogType,
  ICateInfo,
  ICheckBarcodeList,
  ICode,
  ICodeInfo,
  IDeptInfo,
  IGoodsGroupList,
  IGoodsList,
  IGoodsQuery,
  IProcureItem,
  IReceiveItem,
  IStoctQuery,
  ISupList,
  ISupRecType,
  IinStockList,
  InSplitQuery,
  ScanLabelGoodsType,
  ScanLabelInfoType,
  uniqueLabelDataType,
} from "./types";

//
// export function downloadFileApi(data: any): AxiosPromise {
//   return request({
//     url: "/apios/record/wlList",
//     method: "post",
//     data,
//     responseType: "blob",
//   });
// }

/**
 * 上传文件
 * @param file
 *
 */

export function uploadFileApi(file: any): AxiosPromise<FileInfo> {
  const formData = new FormData();
  formData.append("file", file);
  console.log("formData", formData);
  return request({
    url: "/apios/post/upimg",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// 扫描编码获取商品信息
export function scanCodeApi(data: ICode): AxiosPromise<ICodeInfo> {
  return request({
    url: "/apios/post/wxproductinfo",
    method: "post",
    data,
    customParams: true,
  });
}

// 货品分类列表
export function goodsCateListApi(): AxiosPromise<ICateInfo> {
  return request({
    url: "/apios/get/goodsclasslist",
    method: "get",
  });
}

// 仓库分类列表
export function storageListApi(data?: { type: number }): AxiosPromise<ICateInfo> {
  return request({
    url: "/apios/get/warehouseclasslist",
    method: "get",
    params: data,
  });
}

// 计量单位列表
export function unitListApi(): AxiosPromise<ICateInfo> {
  return request({
    url: "/apios/get/measurelist",
    method: "get",
  });
}

// 部门列表
export function departmentListApi(): AxiosPromise<IDeptInfo> {
  return request({
    url: "/apios/get/deptlist",
    method: "get",
  });
}

// 角色列表
export function getRoleListApi(): AxiosPromise<IroleList[]> {
  return request({
    url: "/apios/get/roleList",
    method: "get",
  });
}

// 人员列表
export function getUserListApi(data?: IUser): AxiosPromise<IUserList> {
  return request({
    url: "/apios/home/user",
    method: "post",
    data: data,
  });
}

// 带设置了审批部门数组的人员列表
export function getUserDeptListApi(data?: IUser): AxiosPromise<IUserList> {
  return request({
    url: "/apios/home/userDepts",
    method: "post",
    data: data,
  });
}

// 供应商列表
export function getSupListApi(): AxiosPromise<ISupList> {
  return request({
    url: "/apios/get/supListAll",
    method: "get",
  });
}

// 货品列表
export function getGoodsListApi(): AxiosPromise<IGoodsList> {
  return request({
    url: "/apios/get/listdrop",
    method: "get",
  });
}

// 已入库-分组
export function getGoodsGroupApi(data?: IGoodsQuery): AxiosPromise<IGoodsGroupList> {
  return request({
    url: "/apios/get/goodsGroup",
    method: "get",
    params: data,
  });
}

// 新-已入库-分组
export function getInstockApi(data?: IGoodsQuery): AxiosPromise<IinStockList> {
  return request({
    url: "/apios/get/getInstockGoods",
    method: "get",
    params: data,
  });
}

// 采购单列表-下拉 状态,传2或3，2为未入库,3为已入库
export function getProcureListApi(data: { status: number }): AxiosPromise<IProcureItem[]> {
  return request({
    url: "/apios/get/procureList",
    method: "get",
    params: data,
  });
}

// 领料出库单列表-下拉
export function getReceiverListApi(): AxiosPromise<IReceiveItem[]> {
  return request({
    url: "/apios/get/receiverList",
    method: "get",
  });
}

// 获取审批日志
// document_type 单据交易类型 1采购入库 2退货出库 3领料出库 4退料入库 5调拨 6盘点 7报废 8采购单 9采购退货单
// document_id   单据id
export function getapproveLogApi(data: {
  document_type: number;
  document_id: number;
}): AxiosPromise<IApproveLogType[]> {
  return request({
    url: "/apios/post/approveLog",
    method: "post",
    data: data,
  });
}

// 发送邮件api,  提审和确认通过时,如果单据状态为已完成则调用
export function sendSupEmailApi(data: { procure_id: number }): AxiosPromise {
  return request({
    url: "/apios/post/sendMail",
    method: "post",
    data,
    customParams: true,
  });
}

// 新货品列表 带分页
export function getGoodsArrApi(data: any): AxiosPromise<IGoodsList> {
  return request({
    url: "/apios/get/gooddrop",
    method: "get",
    params: data,
  });
}
// 拆装单 商品列表 带分页
export function getGoodsSplitApi(data: InSplitQuery): AxiosPromise<GoodsInSplit> {
  return request({
    url: "/apios/get/getGoodsSplit",
    method: "get",
    params: data,
  });
}

// 基础设置 使用地点列表
export function placeListApi(): AxiosPromise<any> {
  return request({
    url: "/apios/get/allList",
    method: "get",
  });
}

/** 领料出库单 - 流程详情 */
export function flowGetSup(data: { id: number | undefined }): AxiosPromise<any> {
  return request({
    url: "/apios/post/recProList",
    method: "post",
    data,
  });
}

/** 审批流程进度接口 */
export function getFlowStepApi(data: { id: number | undefined; type: number }): AxiosPromise<any> {
  return request({
    url: "/apios/post/receiptProList",
    method: "post",
    data,
  });
}

/** 调拨单获取采购单列表接口 */
export function allotProcureListApi(data: {
  status: number;
  warehouse_id: number;
}): AxiosPromise<IAllotProcureList[]> {
  return request({
    url: "/apios/get/traProcureList",
    method: "get",
    params: data,
  });
}

/** 调拨单导入接口 */
export function allotImportApi(data: { procure_no: string }): AxiosPromise<IAllotImport> {
  return request({
    url: "/apios/post/import",
    method: "post",
    data,
  });
}

/**
 * 检查重复条码
 */
export function checkBarcodeApi(data: { barcode: string[] }): AxiosPromise<ICheckBarcodeList> {
  return request({
    url: "/apios/post/checkBarCodeIsRpt",
    method: "post",
    data,
  });
}

/** 领料单获取领料类型数据 */
export function getWarehouseRecTypeApi(): AxiosPromise<ISupRecType[]> {
  return request({
    url: "/apios/get/getWarehouseRecType",
    method: "get",
  });
}

/** 库存标签(二维码)识别 */
export function getLabelInfoApi(data: {
  content: string;
  document_type?: number;
}): AxiosPromise<ScanLabelInfoType> {
  return request({
    url: "/apios/home/getLabelInfo",
    method: "post",
    data: data,
  });
}

/** 货品标签(二维码)识别 */
export function getLabelGoodsApi(data: {
  content: string;
  document_type?: number;
}): AxiosPromise<ScanLabelGoodsType> {
  return request({
    url: "/apios/home/getLabelGoodsInfo",
    method: "post",
    data: data,
  });
}

/** 货品标签(二维码)识别--小程序用(pc端未使用) */
export function getLabelXcxApi(data: { content: string }): AxiosPromise {
  return request({
    url: "/apios/home/getLabelInfoXcx",
    method: "post",
    data: data,
  });
}

/** 通过采购单导入库存--其他出库单使用 */
export function getImportStockApi(data: {
  procure_no: string;
  warehouse_id?: number;
}): AxiosPromise<GetImportData> {
  return request({
    url: "/apios/post/importStock",
    method: "post",
    data,
    customParams: true,
  });
}

/** 获取库存明细唯一标签码 */
export function getStocksUniqueLabelApi(data: {}): AxiosPromise<uniqueLabelDataType> {
  return request({
    url: "/apios/post/getStocksUniqueLabel",
    method: "post",
    data: data,
  });
}
