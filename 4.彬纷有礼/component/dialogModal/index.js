var app = getApp()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  data: {

  },
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    diyClass: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: '提示'
    },
    content: {
      type: String,
      value: ''
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    isNeedAuth: {
      type: Boolean,
      value: false
    },
    cancelType: {
      type: String,
      value: ''
    },
    confirmType: {
      type: String,
      value: ''
    }
  },
  methods: {
    preventTouchMove() { },
    cancel() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('cancel')
    },
    confirm() {
      this.setData({
        isShow: false
      })
      this.triggerEvent('confirm')
    }
  }
})
