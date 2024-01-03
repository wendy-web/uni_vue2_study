// component/welfare/index.js
let utils = require("../../utils/util");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer:function(value){
        let welfareDate = wx.getStorageSync('welfareDate') || '';
        let dateNow = utils.parseTime(Date.now(),"{y}-{m}-{d}");
        //缓存日期和当前不同，显示广告，并缓存当前日期
        if(welfareDate != dateNow && value){
          wx.setStorageSync('welfareDate', dateNow)
          //显示弹窗广告
          // if(this.data.welfareAdLoad){
          //   this.setData({
          //     welfareAdShow:true
          //   }) 
          // }
        }else{
          this.setData({
            welfareAdShow:false
          })  
        }
        
      }
    },
    welfareShow:{
      type:Number,
      value:0,
      observer:function(value){
        console.log("welfareShow:",value);
        if(value){
          this.setData({
            welfareAdShow:true
          })  
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    welfareAdShow: false,//显示福利弹窗
    welfareAdLoad:false,//福利弹窗加载成功
  },
  ready(e) {
    console.log("福利弹窗组件 ready");
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //福利弹窗加载
    welfareLoad(e) {
      console.log("welfare load:", e);
      this.triggerEvent('myevent',{welfareLoaded:true});
      this.setData({
        welfareAdLoad: true
      })
    },
    //福利弹窗错误
    welfareError(e) {
    },
    //福利弹窗关闭
    welfareClose(e) {
      console.log("welfare close:", e);
      this.setData({
        welfareAdShow: false
      })
    },
    

  }
})