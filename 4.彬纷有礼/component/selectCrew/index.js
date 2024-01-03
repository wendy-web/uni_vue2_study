// component/selectCrew/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    crew:{
      type:Array,
      value:[]
    },
    boss:{
      type:null,
      value:''
    },
    showTypePop:{
      type:Boolean,
      value:false
    },
    dydf:{
      type:String,
      value:COS_URL+'/public/img/bfyl/assets/store/dydf.png'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon_alls:COS_URL+'/public/img/bfyl/assets/store/my/alls.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseCrew(e){
      // let uid = e.currentTarget.dataset.uid;
      this.triggerEvent('chooseCrew',e);
      this.setData({
        showTypePop:false
      })
    }
  }
})
