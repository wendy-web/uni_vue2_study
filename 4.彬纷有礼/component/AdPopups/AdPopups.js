// pages/Component/AdPopups.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    popImg: {
      type: Array,
      value: ''
    },
    openType:{
      type:String,
      value:'navigate'
    },
    pagePath:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    deleteUrl: './delete.png'
  },
  attached: function(){
    console.log("广告组件初始化············:",this.data);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePop: function () {
      this.setData({
        show: false
      });
    },
    openAd: function (e) {
      this.setData({
        show: false
      });
      let pagePath = this.data.pagePath;
      let openType = this.data.openType;
      if(this.data.pagePath){
        if(openType == 'navigate'){
          wx.navigateTo({
            url: pagePath,
          })
        }else{
          wx.switchTab({
            url: pagePath,
          })
        }
        return
      }
      let url = e.currentTarget.dataset.link;
      
      wx.navigateTo({
        url: url,
      })
      return;
    }
  }
})