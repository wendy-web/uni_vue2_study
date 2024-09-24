import { AxiosPromise } from "axios";
import request from "@/utils/request";
import { IFlowList, IVal, IValQuality } from "./types";

/* 流程设置页面 */

// 获取流程详情API
export function getFlowInfoApi(): AxiosPromise<IFlowList> {
  return request({
    url: "/apios/pro_set/prolist",
    method: "post",
  });
}

// 设置-拆装单
export function splitAssembleApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/split_assemble",
    method: "post",
    data,
  });
}

// 设置-退料入库单
export function retMaterialApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/ret_material",
    method: "post",
    data,
  });
}

// 设置-领料出库单
export function recMaterialApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/rec_material",
    method: "post",
    data,
  });
}

// 设置-调拨单
export function transferOrderApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/transfer_order",
    method: "post",
    data,
  });
}

// 设置-盘点单
export function inventoryListApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/inventory_list",
    method: "post",
    data,
  });
}

// 设置-报废单
export function scrapOrderApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/scrap_order",
    method: "post",
    data,
  });
}

// 设置-退货出库单
export function returnRecApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/return_rec",
    method: "post",
    data,
  });
}

// 设置-采购入库单
export function purchaseRecApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/purchase_rec",
    method: "post",
    data,
  });
}

// 设置-其他入库单
export function purchaseOtrInApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/purchase_otr_in",
    method: "post",
    data,
  });
}

// 设置-采购换货单
export function proReplacementApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/pro_replacement",
    method: "post",
    data,
  });
}

// 设置-采购退货单
export function purchaseRetApi(data: any): AxiosPromise {
  return request({
    url: "/apios/pro_set/purchase_ret",
    method: "post",
    data,
  });
}
// 设置-采购单
export function purchaseOrderApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/purchase_order",
    method: "post",
    data,
  });
}

// 设置-巡点检记录
export function inspectionRecordsApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/inspection_records",
    method: "post",
    data,
  });
}

// 设置-保养工单
export function maintainWorkOrderApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/maintain_work_order",
    method: "post",
    data,
  });
}

// 设置-维修工单
export function repairWorkOrderApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/repair_work_order",
    method: "post",
    data,
  });
}

/* 设置-巡点检记录-安全模块 */
export function inspectionRecordsSecureFlowApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/inspection_records_secure",
    method: "post",
    data,
  });
}

// 设置-退库清单
export function invRetListApi(data: IVal): AxiosPromise {
  return request({
    url: "/apios/pro_set/inv_ret_list",
    method: "post",
    data,
  });
}

// 设置-原材料使用通知单
export function useNoticeOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/materials_use_notice_order",
    method: "post",
    data,
  });
}

// 设置-战马空罐检验报告
export function emptyQualityOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/empty_quality_order",
    method: "post",
    data,
  });
}

// 设置-空罐进货检验报告
export function emptyPurchaseOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/empty_purchase_order",
    method: "post",
    data,
  });
}

// 设置-原料标签标识报告
export function labelRecogOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/label_recog_order",
    method: "post",
    data,
  });
}

// 设置-纸皮进货验报告
export function paperRestockOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/paper_restock_order",
    method: "post",
    data,
  });
}

// 设置-热缩膜检验报告单
export function qltyHotshrinkOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_hotshrink_order",
    method: "post",
    data,
  });
}

// 设置-顶盖/底盖审批流
export function qltyCapOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_cap_order",
    method: "post",
    data,
  });
}

// 设置-内涂膜审批流程
export function qltyInnercoatingOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_innercoating_order",
    method: "post",
    data,
  });
}

// 设置-空罐卷封检验报告审批流程
export function qltyEmptyPotOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_empty_pot_order",
    method: "post",
    data,
  });
}

// 设置-液体糖检验报告审批流程
export function qltyLiquidSugarOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/liquid_sugar_order",
    method: "post",
    data,
  });
}

// 设置-成品糖酸检测报告审批流程
export function qltyProductSugarOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/product_sugar_order",
    method: "post",
    data,
  });
}

// 设置-理化及微生物检验报告审批流程
export function qltyPhysicalMmrbOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/physical_mmrb_order",
    method: "post",
    data,
  });
}

// 设置-pH和成分分析检验单报告审批流程
export function qltyPhCompositionAnalysisOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/ph_composition_analysis_order",
    method: "post",
    data,
  });
}

// 设置-成品卷封检验报告审批流程
export function qltyProductRollInspectionOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/product_roll_inspection_order",
    method: "post",
    data,
  });
}

// 设置-成品标签标识报告审批流程
export function qltyProductLabelIdentifyOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/product_label_identify_order",
    method: "post",
    data,
  });
}

// 设置-成品二维码确认单审批流程
export function qltyProductQrCodeConfirmOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/product_qr_code_confirm_order",
    method: "post",
    data,
  });
}

// 设置-红牛成品检验结果审批流程
export function qltyProSetRedBullProductOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/red_bull_product_order",
    method: "post",
    data,
  });
}

// 设置-战马成品检验结果审批流程
export function qltyWarhorseProductOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/warhorse_product_order",
    method: "post",
    data,
  });
}

// 设置-成品发货通知单审批流程
export function qltyProductShippingNoticeOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/product_shipping_notice_order",
    method: "post",
    data,
  });
}

// 设置-定量测定审批流程
export function qltyProductquantifyOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_productquantify_order",
    method: "post",
    data,
  });
}

// 设置-产品定量检测审批流程
export function qltyQuantifyOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_quantify_order",
    method: "post",
    data,
  });
}

// 设置-成品检测单据审批流程
export function qltyEndproductOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_endproduct_order",
    method: "post",
    data,
  });
}

// 设置-半成品审批流程
export function qltyWipOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_wip_order",
    method: "post",
    data,
  });
}

// 设置-样品检测报告审批流程
export function qltySampleOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_sample_order",
    method: "post",
    data,
  });
}

// 设置-工序控制审批流程
export function qltyOperationOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_operation_order",
    method: "post",
    data,
  });
}

// 设置-外箱二维码检验报告
export function qltyBoxqrOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_boxqr_order",
    method: "post",
    data,
  });
}

// 设置-香精入厂检测记录
export function qltyEssenceEnteringOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/essence_entering_order",
    method: "post",
    data,
  });
}

// 设置-CIP微生物检验报告
export function qltyCipmicrobeOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_cipmicrobe_order",
    method: "post",
    data,
  });
}

// 设置-水处理微生物检验报告
export function qltyWatermicrobeOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_watermicrobe_order",
    method: "post",
    data,
  });
}

// 设置-天平校准记录
export function qltyScaleOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_scale_order",
    method: "post",
    data,
  });
}

// 设置-标准样罐入库记录
export function qltySamplestockOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_samplestock_order",
    method: "post",
    data,
  });
}

// 设置-恒温培养箱使用记录
export function qltyIncubatorOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_incubator_order",
    method: "post",
    data,
  });
}

// 设置-空罐照相设备验证表审批流程
export function qltyEmptyCanPhotoOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_empty_can_photo_order",
    method: "post",
    data,
  });
}

// 设置-灌装封口机清洗记录审批流程
export function qltyFillSealMachineCleanOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_fill_seal_machine_clean_order",
    method: "post",
    data,
  });
}

// 设置-灌装间空气沉降检测审批流程
export function qltyFillRoomAirSettlingOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_fill_room_air_settling_order",
    method: "post",
    data,
  });
}

// 设置-称配料空气沉降检测审批流程
export function qltyWtIngredientAirSettlingOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_wt_ingredient_air_settling_order",
    method: "post",
    data,
  });
}

// 设置-化验室空气沉降检测审批流程
export function qltyLaboratoryAirSettlingOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_laboratory_air_settling_order",
    method: "post",
    data,
  });
}

// 设置-洁净间悬浮粒子检测审批流程
export function qltyCleanRoomSuspendedParticleOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_clean_room_suspended_particle_order",
    method: "post",
    data,
  });
}

// 设置-手部涂抹实验检验审批流程
export function qltyHandApplicationOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_hand_application_order",
    method: "post",
    data,
  });
}

// 设置-配料洁净间浮游菌检测审批流程
export function qltyIngredientCleanRoomDetectionOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_ingredient_clean_room_detection_order",
    method: "post",
    data,
  });
}

// 设置-化验室空气浮游菌检测审批流程
export function qltyLaboratoryAirBacteriaDetectionOrderFlowApi(data: IValQuality): AxiosPromise {
  return request({
    url: "/apios/pro_set/qlty_laboratory_air_bacteria_detection_order",
    method: "post",
    data,
  });
}
