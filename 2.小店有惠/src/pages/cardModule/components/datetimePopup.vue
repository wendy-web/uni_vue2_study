<template>
<van-popup
  :show="isShow"
  @close="closePopup"
  round
  position="bottom"
  :z-index="100"
  custom-style="width:100%"
>
  <view class="date-pop-box">
    <van-datetime-picker
      type="year-month"
      :value="currentDate"
      :min-date="minDate"
      @confirm="confirmDate"
      @cancel="closePopup"
    />
  </view>
</van-popup>
</template>
<script>
import { parseTime } from "@/utils/index";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      currentDate: Date.now(),
      minDate: new Date("2023/01/01").getTime(),
      timestamp: 0, //选中的日期时间戳
    };
  },
  methods: {
    closePopup() {
      this.$emit('close');
    },
    confirmDate(event) {
      const { detail } = event;
      const date = parseTime(detail, "{y}-{m}");
      this.$emit('confirm', {
        date,
        detail
      });
    },
  }
};
</script>

<style scoped lang="scss">
.date-pop-box {
  height: 600rpx;
  box-sizing: border-box;
  width: 100%;
}
</style>
