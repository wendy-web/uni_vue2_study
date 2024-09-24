/* 品质管理公共接口 */
import { AxiosPromise, ResponseType } from "axios";
import request from "@/utils/request";
import {
  CheckDetailListType,
  InnerCoatingListType,
  QualityCommonModule,
  SelectStringOpions,
  VersionListType,
} from "./types";

// 空罐卷封检验报告单下拉框数据
export function getEmptyOrderBaseDataApi(): AxiosPromise<QualityCommonModule.EmptyOrderBaseData> {
  return request({
    url: "/qlty/Post/getEmptyOrderBaseData",
    method: "post",
  });
}

// 根据单据类型获取对应标准值表头
export function getTabelLabelApi(
  data: QualityCommonModule.TabelLabelQuery,
): AxiosPromise<QualityCommonModule.TabelLabelItem> {
  return request({
    url: "/qlty/Post/getTabelLabel",
    method: "post",
    data,
  });
}

// 附件下载
export function downloadQltyFileApi(
  data: QualityCommonModule.DownloadParams,
  responseType: ResponseType = "json",
): AxiosPromise {
  return request({
    url: "/qlty/Post/downloadFile",
    method: "post",
    data,
    responseType,
  });
}

/** 获取单据审批流程
 * @param data  -{ id:number, type:number};
 * @example type: 单据类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告8、战马空罐检验报告 9、原材料使用通知单
 */
export function getProListApi(data: QualityCommonModule.ProListQuery): AxiosPromise {
  return request({
    url: "/qlty/Post/proList",
    method: "post",
    data,
  });
}

/** 产品大类下拉数据 */
export function getBrandMapApi(): AxiosPromise<SelectStringOpions[]> {
  return request({
    url: "/qlty/post/getBrandMap",
    method: "post",
  });
}

/** 产品类型下拉数据 */
export function getSkuMapApi(data?: {}): AxiosPromise<SelectStringOpions[]> {
  return request({
    url: "/qlty/post/getSkuMap",
    method: "post",
    data,
  });
}

/** 版本号信息下拉数据 */
export function getVersionMapApi(): AxiosPromise<VersionListType[]> {
  return request({
    url: "/qlty/post/getVersionMap",
    method: "post",
  });
}

/** 根据类型和分类获取纸皮/标签配置图片数据
 * @param type 0:纸皮 1:标签
 * @param class_type 产品类型
 */
export function getImgConfigMapApi(data: { type: number; class_type: string }): AxiosPromise {
  return request({
    url: "/qlty/post/getImgConfigMap",
    method: "post",
    data,
  });
}

/** 内涂膜检测明细下拉数据 */
export function getInnerCoatingList(data?: {
  check_time?: string;
  batch_no?: string;
}): AxiosPromise<InnerCoatingListType[]> {
  return request({
    url: "/qlty/post/getInnerCoatingList",
    method: "post",
    data,
  });
}

/** 根据原材料类别获取检测明细下拉数据
 * @param materials_class 原材料类别
 * @param brand 产品大类
 * @param check_time 检测日期
 */
export function getCheckDetailList(data?: {
  materials_class?: number;
  brand: string;
  check_time: string;
  batch_no?: string;
}): AxiosPromise<CheckDetailListType[]> {
  return request({
    url: "/qlty/post/getCheckDetailList",
    method: "post",
    data,
  });
}

/** 检测试剂下拉数据 */
export function getCheckReagentApi(): AxiosPromise<SelectOpitonType[]> {
  return request({
    url: "/qlty/post/getCheckReagent",
    method: "post",
  });
}

/** 空罐尺寸下拉数据 */
export function getEmptyCanSizeMapApi(): AxiosPromise<SelectOpitonType[]> {
  return request({
    url: "/qlty/post/getEmptyCanSizeMap",
    method: "post",
  });
}

/** 检验依据下拉数据 */
export function getInspMapApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getInspMap",
    method: "post",
    data,
  });
}

/** 检测仪器下拉数据 */
export function getInstMapApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getInstMap",
    method: "post",
    data,
  });
}
/** 定量项目下拉列表  */
export function getQuantifyMapApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getQuantifyMap",
    method: "post",
    data,
  });
}
/** 产品定量检测报告基础数据  */
export function getQuantifyOrdBaseDataApi(): AxiosPromise {
  return request({
    url: "/qlty/Post/getQuantifyOrdBaseData",
    method: "post",
  });
}
/** 产品定量检测-根据产品分类获取批次信息  */
export function getBatchForBrandApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getBatchForBrand",
    method: "post",
    data,
  });
}
/** 产品定量检测-根据批次+批号获取检验信息  */
export function getEndProductForBatchApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getProductquantifyForBatch",
    method: "post",
    data,
  });
}

/** 获取微生物检验记录下拉数据--红牛成品检验结果使用  */
export function getMicrobialCheckApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getMicrobialCheckList",
    method: "post",
    data,
  });
}

/** 获取成品检验结果下拉数据--成品发货通知单使用  */
export function getProductCheckResultListApi(data: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getProductCheckResultList",
    method: "post",
    data,
  });
}

/** 获取产线列表下拉数据接口 */
export function getProductLineListApi(): AxiosPromise {
  return request({
    url: "/apios/post/getProductLineList",
    method: "post",
  });
}

/** 获取成品检验报告基础数据  */
export function getEndProductBaseDataApi(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getEndProductBaseData",
    method: "post",
    data,
  });
}

/** 获取半成品基础数据  */
export function getWipBaseDataInitApi(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getWipBaseData",
    method: "post",
    data,
  });
}
/** 获取班组下拉数据  */
export function getClasstimeMapInitApi(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getClasstimeMap",
    method: "post",
    data,
  });
}

/** 获取工序——样品基础数据   */
export function getSampleBaseData(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getSampleBaseData",
    method: "post",
    data,
  });
}

/** 获取工序——空罐+顶盖重量检测单-下拉基础数据   */
export function getEcwBaseData(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getEcwBaseData",
    method: "post",
    data,
  });
}

/** 获取工序——外箱二维码基础下拉数据   */
export function getBoxqrBaseData(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getBoxqrBaseData",
    method: "post",
    data,
  });
}

/** 获取Cip基础下拉数据数据   */
export function getCIPBaseDataApi(): AxiosPromise {
  return request({
    url: "/qlty/Post/getCipBaseData",
    method: "post",
  });
}

/** 获取工序——定期CIP检测-下拉基础数据   */
export function getCipBaseData(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getCipBaseData",
    method: "post",
    data,
  });
}

/** 获取工序——停机及CPI检测-下拉基础数据   */
export function getStopcipBaseData(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getStopcipBaseData",
    method: "post",
    data,
  });
}

/** 获取工序——供应商下拉   */
export function getSupplierMap(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/Post/getSupplierMap",
    method: "post",
    data,
  });
}

/** 环境检测—洁净间—通过级别获取浓度标准信息   */
export function getParticleStandardInfo(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/post/getParticleStandardInfo",
    method: "post",
    data,
  });
}

/** 环境检测—洁净间—通过洁净区域获取洁净信息   */
export function getCleanAreaInfo(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/post/getCleanAreaInfo",
    method: "post",
    data,
  });
}

/** 环境检测—洁净间—获取洁净间悬浮粒子检测单下拉数据数据   */
export function getCleanRoomSelectMap(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/post/getCleanRoomSelectMap",
    method: "post",
    data,
  });
}
// 2024年9月5日 新增 获取导入检验信息
export function getExcelDataApi(file: any): AxiosPromise<any> {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/qlty/Post/getExcelData",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
// 2024年9月6日 获取对应图片配置版本列表 
export function getImgConfigVersionListApi(data?: {}): AxiosPromise {
  return request({
    url: "/qlty/post/getImgConfigVersionList",
    method: "post",
    data,
  });
}