import { getUserListApi, goodsCateListApi, storageListApi } from "@/api/common/index";
import type { ICateItem } from "@/api/common/types";

export function useSearchFrom() {
  // 获取分类列表
  async function getClassList() {
    const result = await goodsCateListApi();
    let list = result.data.list;
    return getOptionsList(list);
  }

  //获取仓库列表
  async function getStorageList() {
    const result = await storageListApi({ type: 1 });
    let list = result.data.list;
    return getOptionsList(list);
  }

  // 获取人员列表
  async function getUserList() {
    const result = await getUserListApi();
    let list = result.data.list;
    return getOptionsList(list);
  }

  /** 将数据转为label和value形式 */
  function getOptionsList(list: ICateItem[]) {
    const optionsList = list.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
    return optionsList;
  }

  // 获取分类列表 value是name
  async function getClassNameList() {
    const result = await goodsCateListApi();
    let list = result.data.list;
    return list.map((item) => {
      return {
        label: item.name,
        value: item.name,
      };
    });
  }

  // 分类列表数据
  const classList = getClassList();
  // 仓库列表数据
  const storageList = getStorageList();
  // 人员列表数据
  const userList = getUserList();

  const classNameList = getClassNameList();
  return {
    /** 分类列表数据 */
    classList,
    /** 过滤后的仓库列表数据 */
    storageList,
    /** 人员列表数据 */
    userList,
    classNameList
  };
}
