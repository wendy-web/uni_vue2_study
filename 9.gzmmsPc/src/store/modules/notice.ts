import { defineStore } from "pinia";
import { getWorkMsgApi, setReadMsgApi } from "@/api/workbench";
import type { INewsList } from "@/api/workbench/types";
import type { IBacklogList } from "@/api/workbench/types";
import router from "@/router";

enum EDocumentLink {
  // ~~~~~~~~物料页面↓↓↓↓↓↓~~~~~~
  "/buy/order" = 1, // 采购单1
  "/buy/refund", // 采购退货单2
  "/buy/swap", // 采购换货单3
  "/storage/buy-in", // 采购入库单4
  "/storage/get-supplier", // 领料出库单5
  "/storage/ret-goods", // 退货出库单6
  "/storage/ret-supplier", //退料入库单7
  "/storage/split", //拆装单8
  "/storage/allot", //调拨单9
  "/storage/check", //盘点单10
  "/storage/scrap", //报废单11
  "/storage/other-in", //其他入库单12
  // ~~~~~~~设备页面↓↓↓↓↓分割线~~~~~~
  "/storage/return-list", //退库清单13
  "/device/maintain/repair", //维修单14
  "/device/maintain/work-order", //保养工单15
  "/device/inspection/record", //点巡检记录16
  // ~~~~~~~~品质页面↓↓↓↓分割线~~~~~~
  "/quality/material-inspection/cans-seam", //空罐卷封检验报告17
  "/quality/material-inspection/inner-film", //内涂模检验报告18
  "/quality/material-inspection/cap", //顶盖/底盖检验报告19
  "/quality/material-inspection/hot-film", //热缩膜检验报告20
  "/quality/material-inspection/leatheroid", //纸皮进货检验报告21
  "/quality/material-inspection/label", //原料标签标识报告22
  "/quality/material-inspection/cans-stock", //空罐进货检验报告23
  "/quality/material-inspection/cans-quality", //战马空罐检验报告24
  "/quality/material-inspection/use-notice", //原材料使用通知单25
  // ~~~~~~~~设备页面↓↓↓↓分割线~~~~~~
  "/device/maintain/plan", //保养计划单26
  "/device/inspection/plan", //点巡检计划单27
}

export const useNoticeStore = defineStore({
  id: "notice",
  state: () => ({
    /** 通知消息列表(即未读的消息列表) */
    noticeList: [] as INewsList[],
    /** 通知消息数量(即未读的消息) */
    noticeNum: 0,
    /** 通知消息的页码 */
    noticePage: 0,
    noticeSize: 10,
    /** 待办消息数据中的状态 */
    backlogStatus: undefined as number | undefined,
  }),
  actions: {
    /** 点击消息触发的事件 */
    async handleOneRead(item: INewsList) {
      let id = item.id;
      await setReadMsgApi({ id });
      if (!item.is_read) {
        item.is_read = 1;
        this.reduceNoticeNum();
      }
      this.handleToTarget(item);
    },

    /** 跳转到目标页面 */
    handleToTarget(item: INewsList | IBacklogList) {
      const { document_type, document_id, status } = item;
      console.log("🚀 ~ file: backlog.vue:147 ~ handleToTarget ~ status:", status);
      if (document_type == 5) {
        router.push({
          path: "/storage/get-supplier/detail",
          query: {
            id: document_id,
          },
        });
        return;
      }
      const link = EDocumentLink[document_type];
      this.backlogStatus = status;
      router.push({
        path: link,
      });
    },
    /** 通知消息数量减1 */
    reduceNoticeNum() {
      if (this.noticeNum <= 0) return;
      this.noticeNum -= 1;
    },
    /** 清空通知消息数量 */
    clearNoticeNum() {
      this.noticeNum = 0;
    },

    /** page为1,列表置空再请求数据 */
    restNotice() {
      this.noticePage = 0;
      this.noticeList = [];
      this.getNotice();
    },
    /** 获取通知列表 */
    async getNotice() {
      this.noticePage += 1;
      let data = {
        page: this.noticePage,
        size: this.noticeSize,
        is_read: 0,
      };
      const result = await getWorkMsgApi(data);
      this.noticeList = this.noticeList.concat(result.data.list);
      this.noticeNum = result.data.unread_num;
    },
  },
});
