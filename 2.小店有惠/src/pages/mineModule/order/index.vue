<template>
  <view>
    <!-- 菜单 -->
    <me-tabs v-model="tabIndex" :tabs="tabs" @change="tabChange"></me-tabs>
    <!-- top="xxx"下拉布局往下偏移,防止被悬浮菜单遮住 -->
    <mescroll-uni
      @init="mescrollInit"
      top="64rpx"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <!-- 数据列表 -->
      <block v-for="item in listData" :key="item.id">
        <!-- 待付款 -->
        <obligation v-if="item.status === 0" :config="item" />
        <!-- 待使用 -->
        <treat-use v-else-if="item.status === 7" :config="item" />
        <!-- 已完成 -->
        <completed v-else :config="item" />
      </block>
    </mescroll-uni>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getOrderList } from "@/api/modules/order.js";
import meTabs from "./component/me-tabs.vue";
import obligation from "./component/obligation.vue";
import treatUse from "./component/treatUse.vue";
import completed from "./component/completed.vue";
export default {
  components: {
    meTabs,
    obligation,
    treatUse,
    completed,
  },
  mixins: [MescrollMixin],
  data() {
    return {
      upOption: {
        auto: false,
        noMoreSize: 4,
        empty: {
          tip: "~ 暂无数据 ~", // 提示
        },
      },
      listData: [],
      tabs: [
        { name: "全部", type: 0 },
        { name: "待付款", type: 1 },
        { name: "待使用", type: 2 },
        { name: "已完成", type: 3 },
      ],
      tabIndex: 0, // tab下标
      countdownInter: null,
    };
  },
  methods: {
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      //联网加载数据
      let curTab = this.tabs[this.tabIndex];
      let type = curTab.type; // 具体项目中,您可能取的是tab中的type,status等字段
      getOrderList({
        page: page.num,
        size: page.size,
        status: type,
      })
        .then((res) => {
          let list = res.data?.list || [];
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          this.mescroll.endSuccess(list.length);
          //设置列表数据
          if (page.num == 1) this.listData = []; //如果是第一页需手动制空列表
          //处理数据
          this.listData = this.listData.concat(
            list.map(function (item) {
              return {
                ...item,
                downTime: null,
              };
            })
          ); //追加新数据
          //处理数据展示倒计时
          if (this.listData.length > 0 && (type === 0 || type === 1)) {
            this.interCountDown();
            this.countDown(); //立即执行一次
          }
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    /**定时 计算支付时间 */
    interCountDown() {
      clearInterval(this.countdownInter);
      this.countdownInter = setInterval(() => {
        this.countDown();
      }, 1000);
    },
    /**计算支付时间 */
    countDown() {
      let currDate = Date.now();
      //需要倒计时的数量
      let downcount = 0;

      this.listData.forEach((item) => {
        let { pay_expire_date } = item;

        let expire = new Date(
          pay_expire_date.replace(new RegExp(/-/gm), "/")
        ).getTime();

        let difference = expire - currDate;
        if (difference > 0) {
          let m = parseInt((difference % (1000 * 60 * 60)) / (1000 * 60));
          let s = parseInt((difference % (1000 * 60)) / 1000);
          m = m > 9 ? m : "0" + m;
          s = s > 9 ? s : "0" + s;
          item.downTime = `${m}:${s}`;
          //统计
          downcount++;
          //标记为可倒计时
          item.isDown = true;
        } else {
          item.downTime = null;
          //该订单开启过倒计时 则刷新当前列表
          if (item.isDown) {
            this.tabChange();
          }
        }
      });
      //不需要倒计时则停止
      if (downcount === 0) {
        clearInterval(this.countdownInter);
      }
    },
    // 切换菜单
    tabChange() {
      clearInterval(this.countdownInter);
      this.listData = []; // 先置空列表,显示加载进度
      this.mescroll.resetUpScroll(); // 再刷新列表数据
    },
    // 主动触发下拉刷新
    triggerDownScroll() {
      this.mescroll.scrollTo(0, 0);
      this.mescroll.triggerDownScroll();
    },
  },
  onLoad(options) {
    this.tabIndex = Number(options.activeTab || 0);
  },
  onShow() {
    this.tabChange(); // 再刷新列表数据
  },
  onUnload() {
    clearInterval(this.countdownInter);
  },
};
</script>

<style>
page {
  background-color: #f5f6fa;
}
</style>
