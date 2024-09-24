// 基础配置类型
export namespace BaseValSetModule {
  export interface BaseValSetData {
    id: number; // 配置项ID
    item: number; // 类型 1、空罐卷封检验报告 2、内涂模检验报告 3、顶盖/底盖检验报告 4、热缩膜检验报告 5、纸皮进货验报告 6、原料标签标识报告 7、空罐进货检验报告 8、战马空罐检验报告 9、原材料使用通知单
    brand?: string;
    sku: string; // 产品类型 ND1-1 普通型 ND1-2 强化型 ND2-1 战马灌装 ND2-2 战马瓶装
    name: string; // 项目名称
    en: string; // 项目别名
    unit: string; // 单位
    status: number;
    type: number; // "判断类型 0 =>区间, 1 => 大于,2 => 大于等于, 3 => 小于,4 => 小于等于, 5 => 等于 6 => 合格不合格"
    lower_limit_val: string; // 下限值
    upper_limit_val: string; // 上限值
    error_limit_val: string; // "允许误差"
    value: any; // 具体值
    key: any; // 具体值
    create_time: string;
    update_time: string;
    expression?: string;
    default_val?: string|number;
    [key: string]: any;
  }
  export interface BaseValSetParams {
    id: number;
    item: number;
    brand?: string;
    sku: string;
    name: string;
    en?: string;
    key?: string;
    unit: string;
    status: number;
    type: number;
    lower_limit_val: string;
    upper_limit_val: string;
    error_limit_val: string;
    value: any;
  }
  export interface BaseValSetTableItem{
    name: string;
    value: string;
  }
}
