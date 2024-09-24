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
    </uv-sticky>
    <mescroll-body @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption">
      <view class="width-full all-p-tb-30 all-p-lr-20">
        <view class="width-full contentBox position-r all-m-b-30"
          v-for="(item, index) in dataList" :key="index"
          @click="toDetailHandle(item.id, 3)"
        >
          <view class="width-full all-p-lr-30 all-p-tb-30">
            <view class="width-full display_row_between_center">
              <view class="f-s-36 t-w-bold">{{ item.plan_no }}</view>
              <view class="display_row_center">
                <text style="color: red;" class="all-m-r-10 f-s-26" v-if="item.overdue_day">逾期{{ item.overdue_day }}天</text>
                <uv-tags text="待提审" size="mini" plain type="primary" v-if="item.status == 0"></uv-tags>
                <uv-tags text="待验证" size="mini" plain v-if="item.status == 1"></uv-tags>
                <uv-tags text="已完成" size="mini" plain type="success" v-if="item.status == 2"></uv-tags>
                <uv-tags text="已驳回" size="mini" plain type="error" v-if="item.status == 3"></uv-tags>
                <uv-tags text="已撤回" size="mini" plain type="error" v-if="item.status == 4"></uv-tags>
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
            <view class="width-full display_row_center">
              <text class="t-c-6F6F6F">保养负责人：</text>
              <text class="t-c-272727">{{item.director_names || '--'}}</text>
            </view>
          </view>
          <view class="width-full all-p-lr-30 all-p-tb-30">
            <view class="width-full display_row_center f-s-28 all-m-b-30" v-if="item.use_places">
              <uv-icon name="empty-address" size="20"></uv-icon>
              <text class="all-m-l-10">{{item.use_places}}</text>
            </view>
				    <!-- 当前是创建人的时候 -->
            <view class="width-full content_row">
              <template v-if="checkAssocType(item.assoc_type, 1)">
                <template v-if="[0, 3, 4].includes(item.status) && isShowSubmitBtn">
                  <view @click.stop="submitHandle(item)" class="all-m-r-30">
                    <uv-button type="primary" size="small" text="提交验证"></uv-button>
                  </view>
                  <text class="t-c-272727 f-s-28" @click.stop="toDetailHandle(item.id, 2)" v-if="isShowEditBtn">编辑</text>
                </template>
                <view @click.stop="revokeHandle(item)" v-if="[1].includes(item.status) && isShowRecallBtn" class="all-m-r-30">
                  <uv-button type="warning" size="small" text="撤回"></uv-button>
                </view>
              </template>
              <template v-if="checkAssocType(item.assoc_type, 2) && [1].includes(item.status)">
                <view @click.stop="passHandle(item)" v-if="isShowApproveBtn">
                  <uv-button type="success" size="small" text="通过" class="all-m-r-20" ></uv-button>
                </view>
                <text class="t-c-272727 all-m-r-20 all-m-l-20 f-s-28" @click.stop="rejectHandle(item)" v-if="isShowRejectBtn">驳回</text>
              </template>
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
	  <submitDia ref="submitDiaRef" @submit="submitParamsHandle"></submitDia>
  </view>
</template>
<script>
import { commitAcceptOrderApi, getOrderListApi } from "@/api/device/maintain/order.js";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { checkAssocType, checkBtn } from '@/utils/auth.js';
import { deviceScan } from "@/utils/device.js";
import submitDia from './components/submitDia.vue';
import { finishRequest, rejectRequest, withdrawalRequest } from './index';
  export default {
    mixins: [MescrollMixin], // 使用mixin
    components: {
      submitDia
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
        },
      };
    },
    computed: {
      isShowSubmitBtn() {
        return checkBtn('submit', 3);
      },
      isShowEditBtn() {
        return checkBtn('edit', 3);
      },
      isShowRecallBtn() {
        return checkBtn('recall', 3);
      },
      isShowApproveBtn() {
        return checkBtn('approve', 3);
      },
      isShowRejectBtn() {
        return checkBtn('reject', 3);
      }
    },
    onLoad(options) {
      if (options.asset_no) {
        this.searchQuery.keyword = options.asset_no;
      }
      if (options.is_advent) {
        this.searchQuery.is_advent = Number(options.is_advent);
      }
		  if(options.status) this.searchQuery.status = options.status;
    },
    methods: {
      checkAssocType,
      verifyRole(key) {
        let checkRes = checkBtn(key, 3);
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
      toDetailHandle(id = 0, operateType = 1) {
			  if(!this.verifyRole('detail')) return;
        uni.navigateTo({
          url: `./detail?id=${id}&operateType=${operateType}`,
        });
      },
      // 驳回
      async rejectHandle(item) {
        await rejectRequest(item);
        this.handleSearch();
      },
      // 通过
      async passHandle(item) {
        await finishRequest(item);
        this.handleSearch();
      },
      // 提交验证
      async submitHandle(item) {
        this.$refs.submitDiaRef.open(item);
      },
      async submitParamsHandle(params) {
        const res = await commitAcceptOrderApi(params);
        uni.showToast({
          icon: "none",
          title: res.msg,
        });
        this.$refs.submitDiaRef.close();
        this.handleSearch();
      },
      // 撤回
      async revokeHandle(item) {
        await withdrawalRequest(item);
        this.handleSearch();
      },
      handleReset() {
        this.searchQuery = {
          keyword: undefined,
        };
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
        const res = await getOrderListApi(params).catch(() => this.mescroll.endErr());
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
    }
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
  }
  .item_cont{
    border-bottom: 2rpx dashed #f3f3f3;
    border-top: 2rpx dashed #f3f3f3;
    background: #fbfbfb;
  }
</style>
