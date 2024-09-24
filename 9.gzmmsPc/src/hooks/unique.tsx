export function useUniqueHooks<T extends stockIdListType>(goods: Ref) {
  const detailGoodsList = ref<T[]>([]);

  // const uniqueList = computed(() => {
  //   let arr = goods.value.map((item: T) => {
  //     return item.unique;
  //   });
  //   return arr as string[];
  // });

  // const uniqueNumList = computed(() => {
  //   let arr = detailGoodsList.value.map((item) => {
  //     return {
  //       unique: item.unique,
  //       old_num: item.old_num,
  //     };
  //   });
  //   return arr as uniqueListType[];
  // });

  const stockIdList = computed(() => {
    let arr = goods.value.map((item: T) => {
      return item.stock_id;
    });
    return arr as number[];
  });

  const stockNumList = computed(() => {
    let arr = detailGoodsList.value.map((item) => {
      return {
        stock_id: item.stock_id,
        old_num: item.old_num,
      };
    });
    return arr as stockIdListType[];
  });

  return {
    detailGoodsList,
    stockIdList,
    stockNumList,
    // uniqueList,
    // uniqueNumList,
  };
}
