// component/banner-ads/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isError:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    adLoad(){
      this.setData({
        isError:false
      })
    },
    adError(e){
      console.error(e);
      this.setData({
        isError:true
      })
    }
  }
})
