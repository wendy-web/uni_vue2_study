// type TableData = {
//   /** 商品编码 */
//   barcode: string;
//   /** 商品名称 */
//   title: string;
//   /** 规格 */
//   spec: string;
//   /** 打印数量 */
//   print_num: number;
//   /** 采购数量 */
//   num: number;
//   /** 待入库数量 */
//   rem_num: number;
// };
// export type PrintDataInfo = {
//   procure_no: string;
//   id: number;
// };

export type Props = {
  visible: boolean;
  procure_no: string;
  id: number;
};
export type PrintInfo = Omit<Props, "visible">;
