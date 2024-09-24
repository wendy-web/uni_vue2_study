import { getFactoryCodeDropApi, getWsCodeDropApi } from "@/api/product-stock/common";
import type { FactoryCodeListType, WsCodeDropListType, stockTypeListType } from "@/api/product-stock/common";

export function useProcuctStock() {
  /** 库存类型下拉列表 */
  const stockType = ref<stockTypeListType[]>([
    { name: "质量检查", key: 0 },
    { name: "非限制使用", key: 1 },
  ])

  /** 记录的库存工厂编码下拉列表 */
  const factoryCodeList = ref<FactoryCodeListType[]>([]);

  /** 获取库存工厂编码下拉列表 */
  async function getFactoryCodeList() {
    const result = await getFactoryCodeDropApi();
    factoryCodeList.value = result.data;
  }

  /** 记录的存放库位下拉列表 */
  const wsCodeList = ref<WsCodeDropListType[]>([]);
  /** 获取存放库位下拉列表 */
  async function getWscodeList() {
    const result = await getWsCodeDropApi();
    wsCodeList.value = result.data;
  }

  return {
    /** 库存类型下拉列表 */
    stockType,
    /** 记录的库存工厂编码下拉列表 */
    factoryCodeList,
    /** 获取库存工厂编码下拉列表 */
    getFactoryCodeList,
    /** 记录的存放库位下拉列表 */
    wsCodeList,
    /** 获取存放库位下拉列表 */
    getWscodeList,
  };
}
