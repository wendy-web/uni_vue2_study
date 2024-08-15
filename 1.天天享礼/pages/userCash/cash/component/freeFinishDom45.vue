<template>
  <view :class="['free_finish', (freeEnterPageStatus == 5) ? 'active' : '']" id="freeFinishDom45" >
    <image :src="statusTextBg" mode="heightFix" class="act_img"></image>
  </view>
</template>
<script>
import { warpRectDom } from '@/utils/auth.js';
import { mapGetters } from "vuex";
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters(['freeEnterPageStatus']),
      statusTextBg() {
        return this.freeEnterPageStatus == 4 ? 'https://file.y1b.cn/store/1-0/24124/65b0af9adab79.png' : 'https://test-file.y1b.cn/store/1-0/2431/65e18da200d65.png';
      }
    },
    mounted() {
      this.$nextTick(()=> setTimeout(() => this.domFun(), 1000));
    },
    methods: {
      warpRectDom,
      domFun(){
        this.warpRectDom('freeFinishDom45').then(res=> {
          this.$emit('freeFinishDom45Ref', res);
        });
      }
    },
  };
</script>
<style lang="scss" scoped>
.free_finish {
  position: relative;
  z-index: 0;
  background: rgba(255,255,255,0.65);
  border: 3rpx solid #fff;
  border-radius: 32rpx;
  backdrop-filter: blur(12rpx);
  margin: 0 16rpx 32rpx;
  padding: 40rpx 0;
  box-sizing: border-box;
  text-align: center;
  &.active::before {
    content: '\3000';
    position: absolute;
    background: url("https://test-file.y1b.cn/store/1-0/2435/65e68854387c7.png") 0 0 / cover;
    width: 240rpx;
    height: 100%;
    right: 0;
    top: 0;
    z-index: -1;
  }
  .act_img {
    width: 324rpx;
    height: 48rpx;
  }
}
</style>
