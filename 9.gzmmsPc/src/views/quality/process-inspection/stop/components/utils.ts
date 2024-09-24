export const getValuesText = (data: any) => {
  if (data.val_type == 1 && data.values) {
    return data.values == "1" ? "合格" : "不合格";
  }
  return data.values;
};
export const getValuesCipText = (data: any, valType: any) => {
  let values = valType == "avg" ? data.avg : data.vals;
  if (data.val_type == 1 && data.values) {
    return values == "1" ? "合格" : "不合格";
  }
  return values;
};
