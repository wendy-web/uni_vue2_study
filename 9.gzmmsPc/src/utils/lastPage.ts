//   判断是否是最后一页,且为最后一条数据

export function isLastPage(query: { total: number; page: number; size: number }) {
  let { total, page, size } = query;

  //总条数除以每页记录数
  let lastPage = Math.ceil(total / size);

  if (page === lastPage && total % size === 1 && lastPage != 1) {
    // page = page === 1 ? page : page - 1;
    return true;
  }
  return false;
}

//总数除以每页记录数
//   let lastPage = Math.ceil(total.value / formData.value.size);
// 判断当前页是否是最后一页 且 为最后一条数据
// if (
//   formData.value.page === lastPage &&
//   total.value % formData.value.size === 1
// ) {
//   formData.value.page--; //页码-1
// }
