// component/easy-loadimage.js
let isConnected =true;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageClass: {
      type: String,
      value: ''
    },
    imageSrc: {
      type: String,
      value: ''
    },
    mode: {
      type: String,
      value: ''
    },
    loadingMode: {
      type: String,
      value: 'spin-circle'
    },
    openTransition: {
      type: Boolean,
      value: true
    },
    link: {
      type: String,
      value: ''
    },
    index: {
      type: Number,
      value: 0
    },
    path: {
      type: String,
      value: ''
    }

  },
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    loadImg: true,
    isLoadError: false,
    showTransition: false,
    imgsrc: '',
    imgTime: null,//延迟加载定时器，不能用全局变量，否则定时器过多被莫明被清掉最后1个
  },
  // 组件生命周期
  attached() {
    // 在组件实例进入页面节点树时执行
    let index = this.data.index;
    let time = setTimeout(() => {
      this.setData({
        imgsrc: this.data.imageSrc
      })
    }, index % 10 * 300);
    
    this.setData({
      imgTime:time
    })

  },
  ready() {
    wx.onNetworkStatusChange(function (res) {
      isConnected = res.isConnected
    })
  },
  detached: function() {
    // 在组件实例被从页面节点树移除时执行
    clearTimeout(this.data.imgTime);
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    handleImgLoad(e){
      this.setData({
        loadImg:false,
        isLoadError:false
      })
      setTimeout(() => {
        this.setData({
          showTransition:true
        })
      }, 50);
    },
    handleImgError(){
      this.setData({
        loadImg:false,
        isLoadError:true
      })
    },
    imageClick(){
      if(this.data.isLoadError){
        this.setData({
          isLoadError:false,
          loadImg:true
        })
        if(!isConnected)return wx.showToast({
          title: '请先检查网络连接',
          icon:'none'
        })
        
      }
      this.triggerEvent("imageClick",this.data.link);
    }
  }
})