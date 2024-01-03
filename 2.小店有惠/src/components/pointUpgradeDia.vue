<template>
  <view class="point-upgrade">
    <van-popup
      :show="isShow"
      @close="popupClose"
      custom-style="background-color: transparent;overflow:visible;"
      :close-on-click-overlay="false"
      :z-index="10000"
    >
      <!-- 新人专享大礼包 -->
      <view class="upgrade_box">
        <!-- 背景 -->
        <van-image
          width="684rpx"
          height="786rpx"
          src="https://file.y1b.cn/store/1-0/23523/646c7fe77675c.png"
          fit="cover"
          use-loading-slot
        >
          <van-loading slot="loading" type="spinner" size="20" vertical />
        </van-image>
        <view class="get_btn" @click="close">开心收下</view>
      </view>
    </van-popup>
  </view>
</template>

<script>
import {
  getCredits,
  decCredits,
} from "@/api/modules/home.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters(["gift", "diaList"]),
  },
  data() {
    return {
      isShow: false,
      currentPage: '', // 当前页面的路径
      noShowList: [], // 不展示的列表数组
      lastShowList: ['pages/home/index'], // 首页
    };
  },
  watch: {
    diaList(newValue, oldValue) {
        if(newValue.length && (newValue[0] == 'gift')) {
            this.showGift();
            this.delCurrentDiaList();
        }
    }
  },
  mounted() {
    const pageList = getCurrentPages();
    const currentPageObj = pageList[pageList.length - 1];
    this.currentPage = currentPageObj.route;
    this.initUpgrade();
  },
    methods: {
        ...mapActions({
            getUserInfo: 'user/getUserInfo',
        }),
        ...mapMutations({
            setDiaList: "user/setDiaList",
            delCurrentDiaList: "user/delCurrentDiaList",
        }),
        show() {
            this.isShow = true;
        },
        close() {
            this.isShow = false;
            this.$emit("close");
            this.getUserInfo(); // 获取用户信息
        },
        async initUpgrade(isFirst = true) {
            if(this.lastShowList.includes(this.currentPage) && isFirst) return;
            try {
                let { data } = await getCredits();
                if (data && data.bfyl.credits > 0) {
                    await decCredits({ num: data.bfyl.credits });
                }
            } catch {
            } finally {
                // 用户信息更新 - 再次获取新的用户信息内容
                if(this.gift == 1) {
                    if(this.diaList.length) {
                        this.setDiaList('gift');
                    } else{
                        this.showGift();
                    }
                }
            }
        },
        showGift() {
            this.$store.commit('user/setGiftInfo', 0); // 新人弹窗只展示一次
            const isNowShow = this.noShowList.includes(this.currentPage);
            // 直接不展示弹窗 - 更新用户信息
            if(isNowShow) {
                this.getUserInfo(); // 获取用户信息
                return;
            }
            this.show();
        }
    },
};
</script>

<style lang="scss">
.point-upgrade {
  position: relative;
  .upgrade_box {
    position: relative;
    text-align: center;
    width: 684rpx;
    height: 786rpx;
    .get_btn {
      position: absolute;
      width: 430rpx;
      line-height: 110rpx;
      background: gray;
      border-radius: 50rpx;
      bottom: 100rpx;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
    }
  }
}
</style>
