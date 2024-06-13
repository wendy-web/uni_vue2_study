<template>
<view class="spread_type">
  <view class="spread_title">推广文案</view>
  <view class="copy_box">
    <view class="copy_cont" v-if="config">
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
    <!-- <view class="copy_lab">商品链接有效期30天，过期需重新复制</view> -->
    <view class="btn_active_btn" @click="copHandle">复制文案去推广</view>
  </view>
  <!-- <view class="spread_title list_title">商品素材
    <view class="sel_num">
      <text style="font-size: 32rpx;color: #EF2B20;">{{ resultList.length }}</text>
      /{{ checkList.length }}</view>
  </view> -->
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
  <view class="list_cont">
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
  <view class="btn_list-box">
    <view class="btn_list">
      <view :class="['btn_item', resultList.length ? 'active' : '']" @click="saveHandle">保存素材</view>
      <view class="btn_item active_btn" @click="shareImgHandle">推广海报</view>
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
      painterHeight: 1080
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
      goods_sign: options.goods_sign || 0
    };
    this.initGoodsExtend(params);
  },
  methods: {
    onChangeAllCheckedHandle(event) {
      this.allChecked = event.detail.value;
      if(!this.allChecked) return this.resultList = [];
      this.resultList = this.checkList.map(res => res.id + '');
    },
    async initGoodsExtend(params) {
      const res = await goodsExtend(params);
      if(res.code != 1) return;
      this.config = res.data;
      const { banner_image, code_url, price, face_value, coupon_end_time,coupon_start_time, goods_name, sale_price, after_pay } = res.data;
      this.checkList = banner_image.map((res,index) => ({
        url: res,
        id: index + 1
      }));
      const [ firstImg ] = banner_image;
      this.checkList.unshift({
        id: 0,
        url: firstImg
      });
      this.resultList = this.checkList.map(res => res.id + '');
      console.log('face_value', face_value)
      if(face_value) {
        this.painterHeight = 1080;
        this.template = paletteFaceValue({
          productImg: firstImg,
          codeUrl: code_url,
          price: price + '',
          originalPrice: sale_price + '',
          face_value: face_value + '',
          coupon_start_time,
          coupon_end_time,
          goods_name,
          after_pay,
          painterHeight: this.painterHeight
        });
        return;
      }
      this.painterHeight = 950;
      this.template = palette({
        productImg: firstImg,
        codeUrl: code_url,
        price: price + '',
        goods_name,
        after_pay,
        painterHeight: this.painterHeight
      });
    },
    onImgOk (event) {
      this.showImage = event.mp.detail.path || event.target.path;
      this.checkList[0].url = this.showImage;
    },
    imgErr(err){
      console.log(err)
    },
    copHandle() {
      uni.setClipboardData({
        data: this.copyText,
        success: () => {
          this.$toast('复制成功，请前往微信推广');
        },
        fail: () => {
          this.$toast('复制失败');
        }
      });
    },
    saveHandle() {
      if(!this.resultList.length) return;
      this.resultList.map(async (res, index) => {
        const currentObj = this.checkList.find(findRes => findRes.id == res);
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
      wx.showShareImageMenu({
        path: this.checkList[0].url,
        style: 'v2',
        complete: (res) => {
          console.log('res', res)
        }
      });
    },
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
  .copy_lab {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #aaa;
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
</style>
