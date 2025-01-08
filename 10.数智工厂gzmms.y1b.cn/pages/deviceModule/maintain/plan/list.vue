<template>
  <view class="container">
    <uv-sticky offsetTop="0">
      <view class="search-container-d">
        <uv-search
          :showAction="true"
          actionText="搜索"
          :animation="true"
          :actionStyle="{ color: '#fff' }"
          bgColor="#F8FAFF"
          borderColor="#AEC2FF"
          @search="handleSearch"
          @custom="handleSearch"
          v-model="searchQuery.keyword"
          placeholder="请输入设备编码/名称/型号/品牌"
        >
          <template v-slot:suffix>
            <uv-icon name="scan" size="20" @click.stop="handleScan"></uv-icon>
          </template>
        </uv-search>
        <wsearch-btn @reset="handleReset" color="#fff"></wsearch-btn>
      </view>
      <wdrop-type
        ref="dropMenuRef"
        @statusChange="handleStatus"
        @dateChange="handleDate"
        @directorChange="directorChange"
        @checkChange="checkChange"
        :showFastBtn="true"
        :status-list="statusList"
        :filtrateList="filtrateList"
        :isAdvent="searchQuery.is_advent"
      ></wdrop-type>
    </uv-sticky>
    <mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
      <view class="width-full all-p-lr-20">
        <view class="width-full contentBox position-r"
          v-for="(item, index) in dataList" :key="index"
          @click="toDetailItemHandle(item)"
        >
          <view class="width-full all-p-lr-30 all-p-tb-30">
            <view class="width-full display_row_between_center">
              <view class="f-s-36 t-w-bold">{{item.plan_no}}</view>
              <view class="display_row_center">
                <text style="color: red;" class="all-m-r-10 f-s-26" v-if="item.overdue_day > 0">逾期{{ item.overdue_day }}天</text>
                <text style="color: #03B37B;" class="all-m-r-10 f-s-26" v-if="carryOutShow(item)">{{ item.execute_notice_day }}天后执行</text>
                <uv-tags
									:text="statusList[item.status].label"
									:type="statusList[item.status].type"
									plain v-if="statusList[item.status]"
								></uv-tags>
                <uv-icon name="arrow-right" size="20"></uv-icon>
              </view>
            </view>
            <view class="width-full all-m-t-10 t-c-333 f-s-26">
              计划时间：<text style="color: #F8A723;">{{ item.plan_start_time }}</text>
            </view>
          </view>
          <view class="width-full all-p-t-20 all-p-lr-30 all-p-b-30 display_column_center f-s-28 display-block item_cont">
            <view class="width-full all-m-b-20 display_row_center t-w-bold text_1_line_new">
              {{item.project_std_name}}
            </view>
            <view class="width-full all-m-b-20 display_row_center">
              <text class="t-c-6F6F6F">资产名称：</text>
              <text class="t-c-333">{{item.bar_title || '--'}}</text>
            </view>
            <view class="width-full all-m-b-20 display_row_center">
              <text class="t-c-6F6F6F">保养负责人：</text>
              <text class="t-c-272727">{{item.director_names || '--'}}</text>
            </view>
            <view class="width-full all-m-b-20 display_row_center">
              <text class="t-c-6F6F6F">循环周期：</text>
              <text class="t-c-272727">{{item.cycle_type || '--'}}个月</text>
            </view>
            <view class="width-full display_row_center">
              <text class="t-c-6F6F6F">上次执行时间：</text>
              <text class="t-c-272727">{{ item.last_start_time || '--' }}</text>
            </view>
          </view>
          <view class="width-full all-p-lr-30 all-p-tb-30">
            <view class="width-full display_row_center all-m-b-30 f-s-28" v-if="item.use_places">
              <uv-icon name="empty-address" size="20"></uv-icon>
              <text class="all-m-l-10">{{item.use_places}}</text>
            </view>
            <view class="width-full content_row">
              <template v-if="[0, 1].includes(item.status) && isShowAddWorkBtn">
                <view @click.stop="submitHandle(item)" class="all-m-r-30">
                  <uv-button type="primary" size="small" text="执行计划"></uv-button>
                </view>
                <!-- <view @click.stop="updEnableHandle(item, 1)" class="all-m-r-30">
                  <uv-button type="warning" size="small" text="停用"></uv-button>
                </view> -->
              </template>
              <!-- <template v-if="[4].includes(item.status)">
                <view @click.stop="updEnableHandle(item, 0)" class="all-m-r-30" >
                  <uv-button type="primary" size="small" text="启用"></uv-button>
                </view>
                <view @click.stop="delHandle(item)" class="all-m-r-30" v-if="item.ct_uid == defaultUid">
                  <uv-button type="error" size="small" text="删除"></uv-button>
                </view>
              </template> -->
							<!-- <text class="t-c-272727 f-s-28" v-if="[0, 4].includes(item.status)" @click.stop="toDetailHandle(item.id, 2)">编辑</text> -->
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
  </view>
</template>
<script>
import { getPlanListApi, planDelApi, updEnableStatusApi } from "@/api/device/maintain/plan.js";
import wdropType from "@/components/wdrop-menu/wdrop-type.vue";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { checkBtn } from "@/utils/auth.js";
import { deviceScan } from "@/utils/device.js";
import { mapGetters } from "vuex";
  export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
      wdropType
    },
    data() {
      return {
        dataList: [],
        upOption: {
          page: {
            num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
            size: 10, // 每页数据的数量
            time: null, // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
          },
          noMoreSize: 3,
          textLoading: "加载中 ...", // 加载中的提示文本
          textNoMore: "-- 没有更多了 --", // 没有更多数据的提示文本
        },
        searchQuery: {
          keyword: "",
          is_advent: 0,
        },
        statusList: [
          {
            status: 0,
            label: '未开始',
            type: 'primary'
          },
          {
            status: 1,
            label: '待保养',
            type: 'warning'
          },
          {
            status: 2,
            label: '保养中',
            type: 'success'
          },
          {
            status: 3,
            label: '待验证',
            type: 'info'
          },
          {
            status: 4,
            label: '停用',
            type: 'error'
          },
			  ],
        filtrateList: [
          {
            label: "执行时间",
            value: 1,
          },
          {
            label: "状态",
            value: 3,
          },
          {
            label: "负责人",
            value: 5,
          },
          {
            label: "临期",
            value: 6,
            is_advent: 0
          }
        ],
        authBack: false,
      };
    },
    // 计算属性
    computed: {
      ...mapGetters(["userInfo"]),
      defaultUser() {
        return `${this.userInfo.name}`;
      },
      defaultUid() {
        return this.userInfo.id;
      },
      isShowAddWorkBtn() {
        return checkBtn('add', 3);
      },
    },
    onLoad(options) {
      if (options.asset_no) this.searchQuery.keyword = options.asset_no;
      // 是否临期
      if(options.is_advent) this.searchQuery.is_advent = Number(options.is_advent);
		  if(options.status) this.searchQuery.status = options.status;
		  if(options.eq_id) this.searchQuery.eq_id = Number(options.eq_id);
		  if(options.authBack) this.authBack = Boolean(options.authBack);
    },
    methods: {
      carryOutShow(item) {
        const { notice_day, execute_notice_day, status } = item;
        return (notice_day >= 0) && (execute_notice_day > 0) && (status != 4);
      },
      verifyRole(key) {
        let checkRes = checkBtn(key, 2);
        if (!checkRes) {
          wx.showModal({
            title: "温馨提示",
            content: "很抱歉,您没有操作权限!",
            showCancel: false,
            confirmText: "我知道了",
          });
          return false;
        }
        return true;
      },
      // 执行计划 - 创建保养工单
      submitHandle(item) {
        const { id } = item;
        uni.navigateTo({
          url: `/pages/deviceModule/maintain/workOrder/detail?id=${id}&operateType=1`
        })
      },
      updEnableHandle(item, status) {
        uni.showModal({
					title: "温馨提示",
					content: `确认${status ? '停止' : '启用'}该计划`,
					showCancel: true,
					success: async (res) => {
						if (res.confirm) {
              const { id } = item;
              const res = await updEnableStatusApi({ id, status});
              uni.showToast({
                icon: "none",
                title: res.msg,
              });
              this.handleSearch();
						}
					},
				});
      },
      delHandle(item) {
        uni.showModal({
					title: "温馨提示",
					content: `确认删除该计划`,
					showCancel: true,
					success: async (res) => {
						if (res.confirm) {
              const { id } = item;
              const res = await planDelApi({ id });
              uni.showToast({
                icon: "none",
                title: res.msg,
              });
              this.handleSearch();
						}
					},
				});
      },
      toDetailItemHandle(item) {
        const { id, status } = item;
        let operateType = 3;
        if([0, 4].includes(status)) operateType = 2;
        this.toDetailHandle(id, operateType);
      },
      toDetailHandle(id = 0, operateType=1) {
			  if(!this.verifyRole('detail')) return;
        uni.navigateTo({
          url: `./detail?id=${id}&isShowAddWorkBtn=${this.isShowAddWorkBtn}`,
        });
      },
      handleReset() {
        this.searchQuery = {
          keyword: undefined,
        };
			  this.$refs.dropMenuRef.reset();
        this.handleSearch();
      },
      // 状态的更改 - 筛选
      handleStatus(e) {
        this.searchQuery.status = e.status;
        this.handleSearch();
      },
      // 日期更改筛选
      handleDate(e) {
        this.searchQuery.plan_start_time_start = e.start_time;
        this.searchQuery.plan_start_time_end = e.end_time;
        this.handleSearch();
      },
      // 负责人
      directorChange(event) {
        this.searchQuery.director_uid = event.director_id;
        this.handleSearch();
      },
      // 临期
      checkChange(event) {
        this.searchQuery.is_advent = event.check;
        this.handleSearch();
      },
      async handleScan() {
        const scanResult = await deviceScan();
        this.searchQuery.keyword = scanResult;
        this.handleSearch();
      },
      // 上拉加载
      async upCallback(page) {
        const params = {
          page: page.num,
          size: page.size,
          ...this.searchQuery,
        }
        const res = await getPlanListApi(params, this.authBack).catch(() => this.mescroll.endErr());
        if(!res.code || !res.data) return this.mescroll.endSuccess(0);
        let data = res.data;
        this.mescroll.endBySize(data.list.length, data.total); //必传参数(当前页的数据个数, 总数据量)
        if (page.num == 1) this.dataList = []; //如果是第一页需手动制空列表
        this.dataList = this.dataList.concat(data.list); //追加新数据
      },
      // 点击搜索触发
      handleSearch() {
        this.mescroll.scrollTo(0);
        this.mescroll.resetUpScroll(false);
      },
    },
  };
</script>
<style lang="scss">
page {
  background: #f6f6f6;
}
.contentBox {
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0rpx 4rpx 10rpx 0rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  &:not(:last-child) {
    margin-bottom: 30rpx;
  }
}
.item_cont{
  border-bottom: 2rpx dashed #f3f3f3;
  border-top: 2rpx dashed #f3f3f3;
  background: #fbfbfb;
}
</style>
