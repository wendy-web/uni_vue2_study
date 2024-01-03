// pages/phaseIII/useCoupon/component/checkOrder/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const log = require('../../../../../utils/log');
import {
  forApply
} from '../../../../../api/coupon/index';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    confirmPopShow: false, //显示二次确认弹窗,
    skuList: null, // 订单列表
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    reqResultCode: -1, //返货申请结果：默认-1 确定申请;全部失败:0， 部分成功:1， 全部成功:2
    reqSuccessCount:{
      order:0,
      num:0
    },//成功提交数量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
    },
    show(skuList = null) {
      this.setData({
        confirmPopShow: true, //显示二次确认弹窗
        skuList,
        reqSuccessCount:{
          order:0,
          num:0
        },
        reqResultCode:-1,
      })
    },
    // 发起返货申请
    async applyApi(params) {
      console.log("传参：", params);
      try {
        //  forApply
        let res = await forApply(params);
        return res
      } catch (error) {
        let {errMsg=''} = error;
        if(errMsg&& errMsg.search('request:fail')){
          error.code=0;
          error.msg = '网络请求失败'
        }
        return error
      }

    },
    // 一键申请
    async applyFor() {
      wx.showLoading({
        title: '加载中···',
        mask: true,
      })
      let {
        skuList,
        reqResultCode
      } = this.data;
      for (var i = 0; i < skuList.length; i++) {
        try {
          let params = {};
          let item = skuList[i];
          params.num = item.unused;
          params.a_uid = item.a_uid;
          params.remind = item.remind;
          params.sku_arg = item.sku_arg;
          // 打印日志
          log.setFilterMsg('applyFor');
          log.info('/api/voucher/forApp传参：',JSON.stringify(params));
          const result = await this.applyApi(params);
          log.info('/api/voucher/forApp结果：',JSON.stringify(result));
          skuList[i]['reqResult'] = result;
        } catch (error) {
          skuList[i]['reqResult'] = error;
          log.info('applyFor catch：',JSON.stringify(error));

        }
      }
      wx.hideLoading();

      console.log("请求结束：", skuList)
      let list_length = skuList.length;
      let reqSuccessCount = {};
      reqSuccessCount.order=0;
      reqSuccessCount.num=0;
      skuList.forEach(item => {
        let {
          code = 0
        } = item.reqResult;
        if (code == 1) {
          reqSuccessCount.order++;
          reqSuccessCount.num += item.unused;
        }
      })
      // 全部成功
      if (reqSuccessCount.order == list_length) {
        reqResultCode = 2;
      } else {
        // 部分成功,默认-1
        reqResultCode = reqSuccessCount.order == 0 ? 0 : 1;
      }
      this.setData({
        skuList,
        reqResultCode,
        reqSuccessCount
      })

    },
    // 返回到一键返货页
    goBackApply(event){
      this.onClose(event);
      wx.navigateBack();
    }
  }
})