/**
 * @explain 该hooks主要用来记录走审批流单据的按钮权限
 * @others 基础信息管理的按钮权限标识不在此hook中
 * 工序检验中: 空罐顶盖重量,定期cip,停机cip,开机确认单,PH计校准表按钮权限标识不在此hook中
 */
export function useQualityPerms() {
  /*
    关于按钮标识说明: 
    
 */

  /**
   * @explain 各个单据按钮权限的标识值-与菜单设置对应
   * @单据类型 1、内涂模检验 2、空罐卷封检验 3、标签标识 4、空罐进货检验  5、顶盖/底盖检验
   *  6、热缩膜检验 7、纸皮进货检验 8、战马空罐质量检告 9、原材料使用通知单 10、香精入厂检测记录
   *  11、液体糖检验 12、成品糖酸检验 13、理化及微生物检验 14、成品卷封检验 15、成品标签标识报告
   *  16、成品二维码确认单 17、pH成分分析报告 18、红牛成品检验 19、战马成品检验 20、成品发货通知单
   *  21、定量测定原始记录 22、产品定量检验报告 23、成品检验报告
   *  24、半成品检验 25、样品检验报告 26、工序控制检验  27、外箱二维码信息检测 28、CIP微生物检验
   *  29、水处理微生物检验 30、天平校准记录 31、标准样罐入库记录
   *  32、空罐照相设备验证 33、灌装封口机清洗记录 34、灌装间空气沉降检测 35、称配料空气沉降检测 36、化验室空气沉降检测
   *  37、洁净间悬浮粒子检测 38、手部涂抹实验检验 39、生产部指膜实验 40、配料洁净间浮游菌检测 41、化验室空气浮游菌检测
   *
   * */
  const qualityBtnPermsMap = new Map();

  /** 1、内涂模检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(1, {
    add: ["mi:innerfilm:addedit"],
    edit: ["mi:innerfilm:addedit"],
    detail: ["mi:innerfilm:detail"],
    submit: ["mi:innerfilm:submit"],
    recall: ["mi:innerfilm:recall"],
    del: ["mi:innerfilm:del"],
    approve: ["mi:innerfilm:approve"],
    reject: ["mi:innerfilm:reject"],
    reverse: ["mi:innerfilm:reverse"],
    report: ["mi:innerfilm:report"],
  });

  /** 2、空罐卷封检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(2, {
    add: ["mi:cansseam:addedit"],
    edit: ["mi:cansseam:addedit"],
    detail: ["mi:cansseam:detail"],
    submit: ["mi:cansseam:submit"],
    recall: ["mi:cansseam:recall"],
    del: ["mi:cansseam:del"],
    approve: ["mi:cansseam:approve"],
    reject: ["mi:cansseam:reject"],
    reverse: ["mi:cansseam:reverse"],
    report: ["mi:cansseam:report"],
  });

  /** 3、标签标识报告 */
  qualityBtnPermsMap.set(3, {
    add: ["mi:label:add"],
    edit: ["mi:label:edit"],
    detail: ["mi:label:detail"],
    submit: ["mi:label:submit"],
    recall: ["mi:label:recall"],
    del: ["mi:label:del"],
    approve: ["mi:label:approve"],
    reject: ["mi:label:reject"],
    reverse: ["mi:label:reverse"],
    report: ["mi:label:report"],
  });

  /** 4、空罐进货检验报告 */
  qualityBtnPermsMap.set(4, {
    add: ["mi:cansstock:add"],
    edit: ["mi:cansstock:edit"],
    detail: ["mi:cansstock:detail"],
    submit: ["mi:cansstock:submit"],
    recall: ["mi:cansstock:recall"],
    del: ["mi:cansstock:del"],
    approve: ["mi:cansstock:approve"],
    reject: ["mi:cansstock:reject"],
    reverse: ["mi:cansstock:reverse"],
    report: ["mi:cansstock:report"],
  });

  /** 5、顶盖/底盖检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(5, {
    add: ["mi:cap:addedit"],
    edit: ["mi:cap:addedit"],
    detail: ["mi:cap:detail"],
    submit: ["mi:cap:submit"],
    recall: ["mi:cap:recall"],
    del: ["mi:cap:del"],
    approve: ["mi:cap:approve"],
    reject: ["mi:cap:reject"],
    reverse: ["mi:cap:reverse"],
    report: ["mi:cap:report"],
  });
  /** 6、热缩膜检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(6, {
    add: ["mi:hotfilm:addedit"],
    edit: ["mi:hotfilm:addedit"],
    detail: ["mi:hotfilm:detail"],
    submit: ["mi:hotfilm:submit"],
    recall: ["mi:hotfilm:recall"],
    del: ["mi:hotfilm:del"],
    approve: ["mi:hotfilm:approve"],
    reject: ["mi:hotfilm:reject"],
    reverse: ["mi:hotfilm:reverse"],
    report: ["mi:hotfilm:report"],
  });

  /** 7、纸皮进货验报告 */
  qualityBtnPermsMap.set(7, {
    add: ["mi:leatheroid:add"],
    edit: ["mi:leatheroid:edit"],
    detail: ["mi:leatheroid:detail"],
    submit: ["mi:leatheroid:submit"],
    recall: ["mi:leatheroid:recall"],
    del: ["mi:leatheroid:del"],
    approve: ["mi:leatheroid:approve"],
    reject: ["mi:leatheroid:reject"],
    reverse: ["mi:leatheroid:reverse"],
    report: ["mi:leatheroid:report"],
  });

  /** 8、战马空罐质量检验报告*/
  qualityBtnPermsMap.set(8, {
    add: ["mi:cansquality:add"],
    edit: ["mi:cansquality:edit"],
    detail: ["mi:cansquality:detail"],
    submit: ["mi:cansquality:submit"],
    recall: ["mi:cansquality:recall"],
    del: ["mi:cansquality:del"],
    approve: ["mi:cansquality:approve"],
    reject: ["mi:cansquality:reject"],
    reverse: ["mi:cansquality:reverse"],
    report: ["mi:cansquality:report"],
  });

  /** 9、原材料使用通知单*/
  qualityBtnPermsMap.set(9, {
    add: ["mi:usenotice:add"],
    edit: ["mi:usenotice:edit"],
    detail: ["mi:usenotice:detail"],
    submit: ["mi:usenotice:submit"],
    recall: ["mi:usenotice:recall"],
    del: ["mi:usenotice:del"],
    approve: ["mi:usenotice:approve"],
    reject: ["mi:usenotice:reject"],
    reverse: ["mi:usenotice:reverse"],
    report: ["mi:usenotice:report"],
  });

  /** 10、香精入厂检测记录 */
  qualityBtnPermsMap.set(10, {
    add: ["mi:essence:add"],
    edit: ["mi:essence:edit"],
    detail: ["mi:essence:detail"],
    submit: ["mi:essence:submit"],
    recall: ["mi:essence:recall"],
    del: ["mi:essence:del"],
    approve: ["mi:essence:approve"],
    reject: ["mi:essence:reject"],
    reverse: ["mi:essence:reverse"],
    report: ["mi:essence:report"],
  });

  /** 11、液体糖检验 */
  qualityBtnPermsMap.set(11, {
    add: ["fp:liquid:add"],
    edit: ["fp:liquid:edit"],
    detail: ["fp:liquid:detail"],
    submit: ["fp:liquid:submit"],
    recall: ["fp:liquid:recall"],
    del: ["fp:liquid:del"],
    approve: ["fp:liquid:approve"],
    reject: ["fp:liquid:reject"],
    reverse: ["fp:liquid:reverse"],
    report: ["fp:liquid:report"],
  });

  /** 12、成品糖酸检验 */
  qualityBtnPermsMap.set(12, {
    add: ["fp:saccharicacid:add"],
    edit: ["fp:saccharicacid:edit"],
    detail: ["fp:saccharicacid:detail"],
    submit: ["fp:saccharicacid:submit"],
    recall: ["fp:saccharicacid:recall"],
    del: ["fp:saccharicacid:del"],
    approve: ["fp:saccharicacid:approve"],
    reject: ["fp:saccharicacid:reject"],
    reverse: ["fp:saccharicacid:reverse"],
    report: ["fp:saccharicacid:report"],
  });

  /** 13、理化及微生物检验 */
  qualityBtnPermsMap.set(13, {
    add: ["fp:microorganism:add"],
    edit: ["fp:microorganism:edit"],
    detail: ["fp:microorganism:detail"],
    submit: ["fp:microorganism:submit"],
    recall: ["fp:microorganism:recall"],
    del: ["fp:microorganism:del"],
    approve: ["fp:microorganism:approve"],
    reject: ["fp:microorganism:reject"],
    reverse: ["fp:microorganism:reverse"],
    report: ["fp:microorganism:report"],
  });

  /** 14、成品卷封检验 */
  qualityBtnPermsMap.set(14, {
    add: ["fp:finishedseam:add"],
    edit: ["fp:finishedseam:edit"],
    detail: ["fp:finishedseam:detail"],
    submit: ["fp:finishedseam:submit"],
    recall: ["fp:finishedseam:recall"],
    del: ["fp:finishedseam:del"],
    approve: ["fp:finishedseam:approve"],
    reject: ["fp:finishedseam:reject"],
    reverse: ["fp:finishedseam:reverse"],
    report: ["fp:finishedseam:report"],
  });

  /** 15、成品标签标识报告 */
  qualityBtnPermsMap.set(15, {
    add: ["fp:identify:add"],
    edit: ["fp:identify:edit"],
    detail: ["fp:identify:detail"],
    submit: ["fp:identify:submit"],
    recall: ["fp:identify:recall"],
    del: ["fp:identify:del"],
    approve: ["fp:identify:approve"],
    reject: ["fp:identify:reject"],
    reverse: ["fp:identify:reverse"],
    report: ["fp:identify:report"],
  });

  /** 16、成品二维码确认单 */
  qualityBtnPermsMap.set(16, {
    add: ["fp:finishedqrcode:add"],
    edit: ["fp:finishedqrcode:edit"],
    detail: ["fp:finishedqrcode:detail"],
    submit: ["fp:finishedqrcode:submit"],
    recall: ["fp:finishedqrcode:recall"],
    del: ["fp:finishedqrcode:del"],
    approve: ["fp:finishedqrcode:approve"],
    reject: ["fp:finishedqrcode:reject"],
    reverse: ["fp:finishedqrcode:reverse"],
    report: ["fp:finishedqrcode:report"],
  });

  /** 17、pH成分分析报告 */
  qualityBtnPermsMap.set(17, {
    add: ["fp:ingredient:add"],
    edit: ["fp:ingredient:edit"],
    detail: ["fp:ingredient:detail"],
    submit: ["fp:ingredient:submit"],
    recall: ["fp:ingredient:recall"],
    del: ["fp:ingredient:del"],
    approve: ["fp:ingredient:approve"],
    reject: ["fp:ingredient:reject"],
    reverse: ["fp:ingredient:reverse"],
    report: ["fp:ingredient:report"],
  });

  /** 18、红牛成品检验 */
  qualityBtnPermsMap.set(18, {
    add: ["fp:redbull:add"],
    edit: ["fp:redbull:edit"],
    detail: ["fp:redbull:detail"],
    submit: ["fp:redbull:submit"],
    recall: ["fp:redbull:recall"],
    del: ["fp:redbull:del"],
    approve: ["fp:redbull:approve"],
    reject: ["fp:redbull:reject"],
    reverse: ["fp:redbull:reverse"],
    report: ["fp:redbull:report"],
  });

  /** 19、战马成品检验 */
  qualityBtnPermsMap.set(19, {
    add: ["fp:warhorse:add"],
    edit: ["fp:warhorse:edit"],
    detail: ["fp:warhorse:detail"],
    submit: ["fp:warhorse:submit"],
    recall: ["fp:warhorse:recall"],
    del: ["fp:warhorse:del"],
    approve: ["fp:warhorse:approve"],
    reject: ["fp:warhorse:reject"],
    reverse: ["fp:warhorse:reverse"],
    report: ["fp:warhorse:report"],
  });

  /** 20、成品发货通知单 */
  qualityBtnPermsMap.set(20, {
    add: ["fp:notice:add"],
    edit: ["fp:notice:edit"],
    detail: ["fp:notice:detail"],
    submit: ["fp:notice:submit"],
    recall: ["fp:notice:recall"],
    del: ["fp:notice:del"],
    approve: ["fp:notice:approve"],
    reject: ["fp:notice:reject"],
    reverse: ["fp:notice:reverse"],
    report: ["fp:notice:report"],
  });

  /** 21、定量测定原始记录-新建编辑同一个权限 */
  qualityBtnPermsMap.set(21, {
    add: ["pq:sourcerecord:addedit"],
    edit: ["pq:sourcerecord:addedit"],
    detail: ["pq:sourcerecord:detail"],
    submit: ["pq:sourcerecord:submit"],
    recall: ["pq:sourcerecord:recall"],
    del: ["pq:sourcerecord:del"],
    approve: ["pq:sourcerecord:approve"],
    reject: ["pq:sourcerecord:reject"],
    reverse: ["pq:sourcerecord:reverse"],
    report: ["pq:sourcerecord:report"],
  });

  /** 22、产品定量检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(22, {
    add: ["pq:direct:addedit"],
    edit: ["pq:direct:addedit"],
    detail: ["pq:direct:detail"],
    submit: ["pq:direct:submit"],
    recall: ["pq:direct:recall"],
    del: ["pq:direct:del"],
    approve: ["pq:direct:approve"],
    reject: ["pq:direct:reject"],
    reverse: ["pq:direct:reverse"],
    report: ["pq:direct:report"],
  });

  /** 23、成品检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(23, {
    add: ["pq:finished:addedit"],
    edit: ["pq:finished:addedit"],
    detail: ["pq:finished:detail"],
    submit: ["pq:finished:submit"],
    recall: ["pq:finished:recall"],
    del: ["pq:finished:del"],
    approve: ["pq:finished:approve"],
    reject: ["pq:finished:reject"],
    reverse: ["pq:finished:reverse"],
    report: ["pq:finished:report"],
  });

  /** 24、半成品检验-新建编辑同一个权限 */
  qualityBtnPermsMap.set(24, {
    add: ["pi:semiproduct:addedit"],
    edit: ["pi:semiproduct:addedit"],
    detail: ["pi:semiproduct:detail"],
    submit: ["pi:semiproduct:submit"],
    recall: ["pi:semiproduct:recall"],
    del: ["pi:semiproduct:del"],
    approve: ["pi:semiproduct:approve"],
    reject: ["pi:semiproduct:reject"],
    reverse: ["pi:semiproduct:reverse"],
    report: ["pi:semiproduct:report"],
  });

  /** 25、样品检验报告-新建编辑同一个权限 */
  qualityBtnPermsMap.set(25, {
    add: ["pi:sample:addedit"],
    edit: ["pi:sample:addedit"],
    detail: ["pi:sample:detail"],
    submit: ["pi:sample:submit"],
    recall: ["pi:sample:recall"],
    del: ["pi:sample:del"],
    approve: ["pi:sample:approve"],
    reject: ["pi:sample:reject"],
    reverse: ["pi:sample:reverse"],
    report: ["pi:sample:report"],
  });

  /** 26、工序控制检验-新建编辑同一个权限 */
  qualityBtnPermsMap.set(26, {
    add: ["pi:control:addedit"],
    edit: ["pi:control:addedit"],
    detail: ["pi:control:detail"],
    submit: ["pi:control:submit"],
    recall: ["pi:control:recall"],
    del: ["pi:control:del"],
    approve: ["pi:control:approve"],
    reject: ["pi:control:reject"],
    reverse: ["pi:control:reverse"],
    report: ["pi:control:report"],
  });

  /** 27、外箱二维码信息检测-新建编辑同一个权限 */
  qualityBtnPermsMap.set(27, {
    add: ["pi:outcode:addedit"],
    edit: ["pi:outcode:addedit"],
    detail: ["pi:outcode:detail"],
    submit: ["pi:outcode:submit"],
    recall: ["pi:outcode:recall"],
    del: ["pi:outcode:del"],
    approve: ["pi:outcode:approve"],
    reject: ["pi:outcode:reject"],
    reverse: ["pi:outcode:reverse"],
    report: ["pi:outcode:report"],
  });

  /** 28、CIP微生物检验-新建编辑同一个权限 */
  qualityBtnPermsMap.set(28, {
    add: ["pi:cipmicrobes:addedit"],
    edit: ["pi:cipmicrobes:addedit"],
    detail: ["pi:cipmicrobes:detail"],
    submit: ["pi:cipmicrobes:submit"],
    recall: ["pi:cipmicrobes:recall"],
    del: ["pi:cipmicrobes:del"],
    approve: ["pi:cipmicrobes:approve"],
    reject: ["pi:cipmicrobes:reject"],
    reverse: ["pi:cipmicrobes:reverse"],
    report: ["pi:cipmicrobes:report"],
  });

  /** 29、水处理微生物检验-新建编辑同一个权限 */
  qualityBtnPermsMap.set(29, {
    add: ["pi:watermicrobes:addedit"],
    edit: ["pi:watermicrobes:addedit"],
    detail: ["pi:watermicrobes:detail"],
    submit: ["pi:watermicrobes:submit"],
    recall: ["pi:watermicrobes:recall"],
    del: ["pi:watermicrobes:del"],
    approve: ["pi:watermicrobes:approve"],
    reject: ["pi:watermicrobes:reject"],
    reverse: ["pi:watermicrobes:reverse"],
    report: ["pi:watermicrobes:report"],
  });

  /** 30、天平校准记录-新建编辑同一个权限 */
  qualityBtnPermsMap.set(30, {
    add: ["inst:balancecalibration:addedit"],
    edit: ["inst:balancecalibration:addedit"],
    detail: ["inst:balancecalibration:detail"],
    submit: ["inst:balancecalibration:submit"],
    recall: ["inst:balancecalibration:recall"],
    del: ["inst:balancecalibration:del"],
    approve: ["inst:balancecalibration:approve"],
    reject: ["inst:balancecalibration:reject"],
    reverse: ["inst:balancecalibration:reverse"],
    report: ["inst:balancecalibration:report"],
  });

  /** 31、标准样罐入库记录-新建编辑同一个权限-无详情标识 */
  qualityBtnPermsMap.set(31, {
    add: ["inst:sampletankin:addedit"],
    edit: ["inst:sampletankin:addedit"],
    submit: ["inst:sampletankin:submit"],
    recall: ["inst:sampletankin:recall"],
    del: ["inst:sampletankin:del"],
    approve: ["inst:sampletankin:approve"],
    reject: ["inst:sampletankin:reject"],
    reverse: ["inst:sampletankin:reverse"],
    report: ["inst:sampletankin:report"],
  });

  /** 32、空罐照相设备验证 */
  qualityBtnPermsMap.set(32, {
    add: ["environment:canscamera:add"],
    edit: ["environment:canscamera:edit"],
    detail: ["environment:canscamera:detail"],
    submit: ["environment:canscamera:submit"],
    recall: ["environment:canscamera:recall"],
    del: ["environment:canscamera:del"],
    approve: ["environment:canscamera:approve"],
    reject: ["environment:canscamera:reject"],
    reverse: ["environment:canscamera:reverse"],
    report: ["environment:canscamera:report"],
  });

  /** 33、灌装封口机清洗记录 */
  qualityBtnPermsMap.set(33, {
    add: ["environment:capperrinse:add"],
    edit: ["environment:capperrinse:edit"],
    detail: ["environment:capperrinse:detail"],
    submit: ["environment:capperrinse:submit"],
    recall: ["environment:capperrinse:recall"],
    del: ["environment:capperrinse:del"],
    approve: ["environment:capperrinse:approve"],
    reject: ["environment:capperrinse:reject"],
    reverse: ["environment:capperrinse:reverse"],
    report: ["environment:capperrinse:report"],
  });

  /** 34、灌装间空气沉降检测 */
  qualityBtnPermsMap.set(34, {
    add: ["environment:bottlingair:add"],
    edit: ["environment:bottlingair:edit"],
    detail: ["environment:bottlingair:detail"],
    submit: ["environment:bottlingair:submit"],
    recall: ["environment:bottlingair:recall"],
    del: ["environment:bottlingair:del"],
    approve: ["environment:bottlingair:approve"],
    reject: ["environment:bottlingair:reject"],
    reverse: ["environment:bottlingair:reverse"],
    report: ["environment:bottlingair:report"],
  });

  /** 35、称配料空气沉降检测 */
  qualityBtnPermsMap.set(35, {
    add: ["environment:batchingair:add"],
    edit: ["environment:batchingair:edit"],
    detail: ["environment:batchingair:detail"],
    submit: ["environment:batchingair:submit"],
    recall: ["environment:batchingair:recall"],
    del: ["environment:batchingair:del"],
    approve: ["environment:batchingair:approve"],
    reject: ["environment:batchingair:reject"],
    reverse: ["environment:batchingair:reverse"],
    report: ["environment:batchingair:report"],
  });

  /** 36、化验室空气沉降检测 */
  qualityBtnPermsMap.set(36, {
    add: ["environment:laboratoryair:add"],
    edit: ["environment:laboratoryair:edit"],
    detail: ["environment:laboratoryair:detail"],
    submit: ["environment:laboratoryair:submit"],
    recall: ["environment:laboratoryair:recall"],
    del: ["environment:laboratoryair:del"],
    approve: ["environment:laboratoryair:approve"],
    reject: ["environment:laboratoryair:reject"],
    reverse: ["environment:laboratoryair:reverse"],
    report: ["environment:laboratoryair:report"],
  });

  /** 37、洁净间悬浮粒子检测 */
  qualityBtnPermsMap.set(37, {
    add: ["environment:particles:add"],
    edit: ["environment:particles:edit"],
    detail: ["environment:particles:detail"],
    submit: ["environment:particles:submit"],
    recall: ["environment:particles:recall"],
    del: ["environment:particles:del"],
    approve: ["environment:particles:approve"],
    reject: ["environment:particles:reject"],
    reverse: ["environment:particles:reverse"],
    report: ["environment:particles:report"],
  });

  /** 38、手部涂抹实验检验 */
  qualityBtnPermsMap.set(38, {
    add: ["environment:handrub:add"],
    edit: ["environment:handrub:edit"],
    detail: ["environment:handrub:detail"],
    submit: ["environment:handrub:submit"],
    recall: ["environment:handrub:recall"],
    del: ["environment:handrub:del"],
    approve: ["environment:handrub:approve"],
    reject: ["environment:handrub:reject"],
    reverse: ["environment:handrub:reverse"],
    report: ["environment:handrub:report"],
  });

  /** 39、生产部指膜实验 */
  qualityBtnPermsMap.set(39, {
    add: ["environment:fingerprint:add"],
    edit: ["environment:fingerprint:edit"],
    detail: ["environment:fingerprint:detail"],
    submit: ["environment:fingerprint:submit"],
    recall: ["environment:fingerprint:recall"],
    del: ["environment:fingerprint:del"],
    approve: ["environment:fingerprint:approve"],
    reject: ["environment:fingerprint:reject"],
    reverse: ["environment:fingerprint:reverse"],
    report: ["environment:fingerprint:report"],
  });

  /** 40、配料洁净间浮游菌检测 */
  qualityBtnPermsMap.set(40, {
    add: ["environment:cleanroombacteria:add"],
    edit: ["environment:cleanroombacteria:edit"],
    detail: ["environment:cleanroombacteria:detail"],
    submit: ["environment:cleanroombacteria:submit"],
    recall: ["environment:cleanroombacteria:recall"],
    del: ["environment:cleanroombacteria:del"],
    approve: ["environment:cleanroombacteria:approve"],
    reject: ["environment:cleanroombacteria:reject"],
    reverse: ["environment:cleanroombacteria:reverse"],
    report: ["environment:cleanroombacteria:report"],
  });

  /** 41、化验室空气浮游菌检测 */
  qualityBtnPermsMap.set(41, {
    add: ["environment:laboratorybacteria:add"],
    edit: ["environment:laboratorybacteria:edit"],
    detail: ["environment:laboratorybacteria:detail"],
    submit: ["environment:laboratorybacteria:submit"],
    recall: ["environment:laboratorybacteria:recall"],
    del: ["environment:laboratorybacteria:del"],
    approve: ["environment:laboratorybacteria:approve"],
    reject: ["environment:laboratorybacteria:reject"],
    reverse: ["environment:laboratorybacteria:reverse"],
    report: ["environment:laboratorybacteria:report"],
  });

  return {
    /**
     * @explain 各个单据按钮权限的标识值-与菜单设置对应
     * @单据类型 1、内涂模检验 2、空罐卷封检验 3、标签标识 4、空罐进货检验  5、顶盖/底盖检验
     *  6、热缩膜检验 7、纸皮进货检验 8、战马空罐质量检告 9、原材料使用通知单 10、香精入厂检测记录
     *  11、液体糖检验 12、成品糖酸检验 13、理化及微生物检验 14、成品卷封检验 15、成品标签标识报告
     *  16、成品二维码确认单 17、pH成分分析报告 18、红牛成品检验 19、战马成品检验 20、成品发货通知单
     *  21、定量测定原始记录 22、产品定量检验报告 23、成品检验报告
     *  24、半成品检验 25、样品检验报告 26、工序控制检验  27、外箱二维码信息检测 28、CIP微生物检验
     *  29、水处理微生物检验 30、天平校准记录 31、标准样罐入库记录
     *  32、空罐照相设备验证 33、灌装封口机清洗记录 34、灌装间空气沉降检测 35、称配料空气沉降检测 36、化验室空气沉降检测
     *  37、洁净间悬浮粒子检测 38、手部涂抹实验检验 39、生产部指膜实验 40、配料洁净间浮游菌检测 41、化验室空气浮游菌检测
     * */
    qualityBtnPermsMap,
  };
}
