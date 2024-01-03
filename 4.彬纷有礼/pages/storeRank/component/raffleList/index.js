// pages/storeRank/component/raffleList/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const utils = require('../../../../utils/util');
import {mobList14} from '../../../../api/storeRank/api';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    actInfo: {
      type: Object,
      value: null,
      observer: function (actInfo) {
        if (actInfo) {
          this.initActInfo(actInfo);
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    img_ball_blue:`${COS_URL}/public/img/bfyl/2023/08/img_ball_blue.png`,
    img_ball_yellow:`${COS_URL}/public/img/bfyl/2023/08/img_ball_yellow.png`,
    file_cos_url:`${COS_URL}/public/img/bfyl/2023/08`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initActInfo(actInfo) {
      console.log("抽奖列表:",actInfo);
      if (actInfo.win) {
        let {lucky_number = ''} = actInfo.win;
        this.setData({
          raffle_code_arr:String(+lucky_number).split('')
        })
        this.setData({
          actInfo
        })
      }
    },
    async getList(){
      // 筛选出已中奖的 win:1
      let params = {
        next:1,
        win:1
      }
      let res = await mobList14(params);
      let {code,data,msg} = res;
      if(code==1){
        data.forEach(item =>{
          if(item.lucky_number){
            item.lucky_number  = String(item.lucky_number).padStart(10, '0');
          }
        });
        this.setData({
          list:data
        })
        return
      }
      this.setData({
        list:[]
      })
    },
    goPage(event) {
      let {
        url
      } = event.currentTarget.dataset;
      if (url) {
        utils.navigateFrequentPage(url)
      }
    },
  },
  lifetimes: {
    async attached() {
      // 有开奖结果时候显示列表
      // let actInfo = this.data.actInfo;
      // if(actInfo){

      //   let {win} = actInfo;
      //   if(win&&actInfo.calc.lottery_number.length>0){
      //     this.getList();
      //   }
      // }
      this.getList();
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
