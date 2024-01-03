Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    bgImg:{
      type:String,
      value:""
    },
    closeImg:{
      type:String,
      value:'https://file.y1b.cn/public/img/storeRank/202108/pop/icon_close.png'
    },
    showCloseBtn:{
      type:Boolean,
      value:true
    },
   
    openType: {
      type: String,
      value: 'navigate'
    },
    pagePath: {
      type: String,
      value: ''
    },
    isBottom:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    iconCloseUrl: 'https://file.y1b.cn/public/img/storeRank/202106/icon_close.png'
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
    listenTap:function(){
      this.triggerEvent("trigger")
    }
  }
})
