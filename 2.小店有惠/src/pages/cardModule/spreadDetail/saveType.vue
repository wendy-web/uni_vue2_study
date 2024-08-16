<template>
<view class="spread_type">
  <view class="spread_title">推广文案</view>
  <view :class="['copy_box', !config ? 'active' : '']">
    <view class="copy_cont">
      <view class="copy_cont-title">{{ config.goods_name }}</view>
      <block v-if="config.face_value">
        原价：￥{{ config.sale_price || 0 }}<br>
        券后：￥{{ config.price || 0 }}<br>
      </block>
      <block v-else>
        ￥{{ config.price || 0 }}<br>
      </block>
      商品链接：{{ config.short_link ||0 }}
    </view>
    <view class="btn_active_btn" @click="copHandle">复制文案去推广</view>
  </view>
  <view class="all_check">
    <van-checkbox
      :value="allChecked"
      checked-color="#EF2B20"
      icon-size="34rpx"
      label-class="all_label"
      @change="onChangeAllCheckedHandle">
    全选</van-checkbox>
  </view>
  <view class="sel_lab">以下商品素材可保存到相册</view>
  <view :class="['list_cont', !config ? 'active' : '']">
    <van-checkbox-group :value="resultList" @change="changeHandle($event, value, type)" class="fl">
      <van-checkbox
        checked-color="#EF2B20"
        custom-class="list_cont-check"
        icon-class="list_cont-icon"
        v-for="(item, index) in checkList" :key="index"
        :name="item.id"
        :currentIndex="index"
        icon-size="28rpx"
      >
        <view class="list_item" >
          <image class="list_item-img" mode="widthFix"
            :src="item.url"
          ></image>
        </view>
    </van-checkbox>
    </van-checkbox-group>
  </view>
  <!-- 底部操作按钮 -->
  <view :class="['btn_list-box', !config ? 'active' : '']">
    <view class="btn_list">
      <view :class="['btn_item', resultList.length ? 'active' : '']" @click="saveHandle">保存素材</view>
      <view class="btn_item active_btn" @click="shareImgHandle">
        <view>推广海报</view>
        <view class="spread_line"></view>
        <view class="spread_btn-left">
          <view v-html="formatItemPrice(config && config.rebateMoney, 1)"></view>
        </view>
      </view>
    </view>
    <view class="van-submit-bar__safe"></view>
  </view>
  <showImgListDia
    :isShow="isShowImgListDia"
    :showImgList="checkList"
    :selCurrentIndex="selCurrentIndex"
    @close="isShowImgListDia = false"
  ></showImgListDia>
  <painter
    customStyle="position:fixed;bottom: -10000px;z-index :-10000"
    @imgOK="onImgOk"
    @imgErr="imgErr"
    :palette="template"
    :dirty="true"
  />
</view>
</template>
<script>
import { goodsExtend } from "@/api/modules/card.js";
import { mapGetters } from "vuex";
import palette from './palette.js';
import paletteFaceValue from './paletteFaceValue.js';
import showImgListDia from "./showImgListDia.vue";

export default {
  components: {
    showImgListDia
  },
  data() {
    return {
      selCurrentIndex: 0,
      resultList: [],
      config: null,
      checkList: [],
      isShowImgListDia: false,
      template: null,
      showImage: '',
      code_url: '',
      allChecked: true,
      painterHeight: 1080,
      saleNum: '',
    };
  },
  computed: {
    ...mapGetters(['vipObject']),
    copyText() {
      if(!this.config) return;
      let txtValue =  `${this.config.goods_name}\n￥${this.config.price}\n商品链接：${this.config.short_link || ''}`;
      if(this.config.face_value) {
        txtValue =  `${this.config.goods_name}\n原价：￥${this.config.sale_price}\n券后：￥${this.config.price}\n商品链接：${this.config.short_link || ''}`;
      }
      return txtValue;
    }
  },
  onLoad(options) {
    const params = {
      rebate: options.rebate,
      skuId: options.skuId || 0,
      goods_sign: options.goods_sign || 0,
      is_popover: options.is_popover || 0
    };
    if(options.saleNum) this.saleNum = options.saleNum;
    this.initGoodsExtend(params);
  },
  methods: {
    formatItemPrice(price = 0, type) {
      let dom=  `<span style="font-weight:600;font-size: 13px;">¥<span style="font-size: 20px;">${price}</span></span>`;
      return dom;
    },
    onChangeAllCheckedHandle(event) {
      this.allChecked = event.detail.value;
      if(!this.allChecked) return this.resultList = [];
      this.resultList = this.checkList.map(res => res.id + '');
    },
    async initGoodsExtend(params) {
      const res = await goodsExtend(params);
      if(res.code != 1) return;
      this.config = res.data;
      const { banner_image } = res.data;
      this.checkList = banner_image.map((res,index) => ({
        url: res,
        id: index + 1
      }));
      this.resultList = this.checkList.map(res => res.id + '');
    },
    createShowShareImg() {
      uni.showLoading({
        title: '正在生成推广图'
      });
      const { banner_image, code_url, price, face_value, coupon_end_time,coupon_start_time,
        goods_name, sale_price, after_pay, lx_type } = this.config;
      const [ firstImg ] = banner_image;
      if(face_value) {
        this.painterHeight = 1080;
        this.template = paletteFaceValue({
          productImg: firstImg,
          codeUrl: code_url,
          price,
          originalPrice: sale_price,
          face_value,
          coupon_start_time,
          coupon_end_time,
          goods_name,
          after_pay,
          painterHeight: this.painterHeight,
          sale_num: this.saleNum,
          lx_type
        });
        return;
      }
      this.painterHeight = 950;
      this.template = palette({
        productImg: firstImg,
        codeUrl: code_url,
        price,
        goods_name,
        after_pay,
        painterHeight: this.painterHeight
      });
    },
    onImgOk (event) {
      this.showImage = event.mp.detail.path || event.target.path;
      console.log('图片合成成功', this.showImage);
      uni.hideLoading();
      this.showShareImg();
    },
    imgErr(err){
      console.log('图片合成失败', err);
      uni.hideLoading();
    },
    copHandle() {
      uni.setClipboardData({
        data: this.copyText,
        success: () => {
          this.$toast('复制成功，请前往微信推广');
        },
        fail: (error) => {
          console.log('setClipboardData：error', error);
          this.$toast('复制失败');
        }
      });
    },
    async saveHandle() {
      if(!this.resultList.length) return;
      const index0Id = this.resultList[0];
      const index1Obj =  this.checkList[index0Id];
      const saveRes = await this.saveImgToPhone(index1Obj.url, index1Obj.id);
      if(!saveRes) return;
      this.resultList.map(async (res, index) => {
        const currentObj = this.checkList.find(findRes => findRes.id == res && index);
        if(!currentObj) return;
        const { id, url } = currentObj;
        const saveRes = await this.saveImgToPhone(url, id);
        if(index >= this.resultList.length) this.$toast('素材保存成功');
      });
    },
    async saveImgToPhone(filePath, isDown = 0) {
      return new Promise(async (resolve, reject) => {
        let saveRes = {};
        let saveImage = filePath;
        if(isDown > 0) {
          saveRes = await this.$downloadFile(filePath);
          if (saveRes.statusCode !== 200) return resolve(saveRes);
        }
        if(saveRes.tempFilePath) saveImage = saveRes.tempFilePath;
        const res = await this.$saveImageToPhotosAlbum(saveImage);
        resolve(res);
      }).catch((e) => {});
    },
    changeHandle(event) {
      const { value, range, currentIndex } =  event.detail;
      if(range == 'cont') {
        this.selCurrentIndex = currentIndex;
        this.isShowImgListDia = true;
        return;
      };
      this.resultList = value;
      this.allChecked = (this.resultList.length == this.checkList.length)
    },
    // 展示推广的海报展示
    shareImgHandle() {
      if(!this.showImage) return this.createShowShareImg();
      this.showShareImg();
    },
    showShareImg() {
      wx.showShareImageMenu({
        path: this.showImage,
        style: 'v2',
        complete: async (res) => {
          let pattern = /fail auth deny/;
          if (pattern.test(res.errMsg)) {
            const setWritePhotosResult = await this.$setWritePhotosAlbum();
            if(setWritePhotosResult) this.saveImgToPhone(this.showImage);
          }
        }
      });
    }
  },
}
</script>
<style lang="scss">
page {
  background: #f4f5f9;
}
.spread_type {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  overflow-y: scroll;
  // padding-bottom: 166rpx;
  padding: 38rpx 32rpx 96rpx;
  box-sizing: border-box;
  padding-bottom: calc(128rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(128rpx + env(safe-area-inset-bottom));

  .spread_title{
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    line-height: 44rpx;
  }
  .list_title {
    margin-top: 48rpx;
    display: flex;
    .sel_num {
      font-size: 24rpx;
      margin-left: 20rpx;
    }
  }
  .sel_lab {
    font-size: 26rpx;
    color: #aaa;
    margin-top: 8rpx;
  }
}
.copy_box {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 16rpx;
  margin-top: 16rpx;
  &.active {
    min-height: 320rpx;
    position: relative;
    &::before{
      content: '\3000';
      // margin: 0 24rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
      animation: backAni 1.5s infinite;
      border-radius: 16rpx;
    }
  }
  .copy_cont {
    padding: 16rpx;
    background: #f7f7f7;
    border-radius: 12rpx;
    word-break:break-all;
    font-size: 26rpx;
    color: #333;
    .copy_cont-title {
      font-weight: bold;
      color: #333;
      font-size: 30rpx;
      margin-bottom: 16rpx;
    }
  }
}
.content_box {
  height: 100%;
  overflow: scroll;
  background: #f7f7f7;
}

page {
  background-color: #f7f7f7;
  overflow: hidden;
}
.list_cont{
  background: #fff;
  border-radius: 16rpx;
  margin-top: 16rpx;
  padding: 16rpx 0 0 16rpx;
  display: flex;
  flex-wrap: wrap;
  &.active {
    min-height: 452rpx;
    position: relative;
    &::before{
      content: '\3000';
      // margin: 0 24rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
      animation: backAni 1.5s infinite;
      border-radius: 16rpx;
    }
  }
}
.list_item {
  width: 206rpx;
  height: 206rpx;
  background: #d8d8d8;
  border-radius: 12rpx;
  overflow: hidden;
  // margin-right: 18rpx;
  position: relative;
  margin-bottom: 16rpx;
  // &:nth-child(3n+3) {
  //   margin-right: 0;
  // }
  .list_item-img{
    width: 100%;
    height: 100%;
  }
}
.btn_list-box{
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: 9;
  &.active {
    // position: relative;
    &::before{
      content: '\3000';
      // margin: 0 24rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      width: 100%;
      z-index: 1;
      background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
      animation: backAni 1.5s infinite;
      border-radius: 16rpx;
    }
  }
  .btn_list{
    padding: 6rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
.btn_item {
  background: #e1e1e1;
  border-radius: 12rpx;
  line-height: 82rpx;
  flex: 1;
  text-align: center;
  color: #aaa;
  &.active {
    background: #343434;
    color: #fff;
  }
  &.active_btn {
    background: #ef2b20;
    width: 424rpx;
    flex: 0 0 424rpx;
    color: #fff;
    margin-left: 16rpx;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .spread_btn-left {
    display: flex;
    align-items: center;
    &::before {
      content: '立赚';
      font-size: 26rpx;
      margin-right: 8rpx;
    }
  }
  .spread_line{
    width: 2rpx;
    height: 28rpx;
    background: #fff;
  }
}
.btn_active_btn {
  background: #ef2b20;
  border-radius: 12rpx;
  line-height: 82rpx;
  margin-top: 16rpx;
  color: #fff;
  font-size: 30rpx;
  text-align: center;
}
.van-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  .list_cont-check {
    margin-right: 16rpx;
  }
  .list_cont-icon{
    padding: 20rpx;
  }
  .van-checkbox {
    position: relative;
  }
  .van-checkbox__label--right {
    padding: 0;
  }
  .van-checkbox__icon-wrap {
    position: absolute;
    z-index: 1;
    right: 16rpx;
    top: 16rpx;
  }
}
.all_check {
  margin-top: 48rpx;

}
.all_label {
  // color: #999 !important;
  // font-size: 28rpx;
}
@keyframes backAni {
  0% {
    background: linear-gradient(270deg,#f6f8fb 80%, #d3d3d3);
  }
  50% {
    background: linear-gradient(270deg,#f6f8fb 60%, #d3d3d3);
  }
  100% {
    background: linear-gradient(270deg,#f6f8fb 30%, #d3d3d3);
  }
}
</style>
