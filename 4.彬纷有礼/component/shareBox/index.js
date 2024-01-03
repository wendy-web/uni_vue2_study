const utils = require("../../utils/util");
Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        console.log("newVal:", newVal);
        console.log("oldVal:", oldVal);
        var storeInfo = wx.getStorageSync('storeInfo');
        var userdata = wx.getStorageSync('userdata');
        this.setData({
          storeInfo: storeInfo,
          userdata: userdata
        });

        if (storeInfo && storeInfo.member) {
          storeInfo.member.forEach(ele => {
            if (ele.condition == 1) {
              this.setData({
                userdata: ele
              })
            }
          })
        } else {
          utils.getShopInfo().then(data => {
            data.member.forEach(ele => {
              if (ele.condition == 1) {
                this.setData({
                  userdata: ele
                })
              }
            })
          })
        }
        console.log("storeInfo", storeInfo);
        newVal && this.drawPic()
      }
    },
    visible: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false,
    storeInfo: wx.getStorageSync('storeInfo'),
    userdata: wx.getStorageSync('userdata'),
  },
  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },
    handleClose() {
      this.setData({
        visible: false
      })
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData')
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      var avatar = this.data.userdata.avatar_url;
      var nick_name = this.data.userdata.nick_name;
      var shop_name = this.data.storeInfo.shop_name;
      var address = this.data.storeInfo.address;
      this.setData({
        imgDraw: {
          width: '1280rpx', //640
          height: '1880rpx', //844
          background: wx.getStorageSync('shopQRBG') || 'https://file.y1b.cn/public/img/phaseIII/202104/qrcodeBG20210528.png',
          views: [{
              type: 'image',
              url: avatar,
              css: {
                // top:'780rpx',
                top: '730rpx',
                left: '250rpx',
                width: '120rpx',
                height: '120rpx',
                borderRadius: '96rpx',
                textAlign: 'left',
              },
            },
            {
              type: 'text',
              text: nick_name,
              css: {
                // top: '920rpx',
                top: '870rpx',
                fontSize: '28rpx',
                left: '250rpx',
                width: '120rpx',
                height: '20rpx',
                textAlign: 'center',
                maxLines: '1',
                fontWeight: 'bold',
                color: '#595959'
              }
            },
            {
              type: 'text',
              text: "门店名称：" + shop_name,
              css: {
                // top: '790rpx',
                top: '740rpx',
                fontSize: '24rpx',
                left: '420rpx',
                width: '650rpx',
                // align: 'center',
                fontWeight: 'normal',
              }
            },
            {
              type: 'text',
              text: "门店地址：" + address,
              css: {
                // top: '840rpx',
                top: '790rpx',
                fontSize: '24rpx',
                left: '420rpx',
                width: '650rpx',
                maxLines: '2',
                lineHeight: '40rpx',
                fontWeight: 'normal',
              }
            },
            {
              type: 'image',
              url: wx.getStorageSync('shopQR') || '',
              css: {
                // top: '970rpx',
                top: '920rpx',
                left: '10rpx',
                right: '320rpx',
                width: '620rpx',
                height: '620rpx',
                borderRadius: '0rpx'
              },
            },

          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData')
    },
    preventDefault() {},
    // 保存图片
    savePhoto(path) {
      if (wx.getPrivacySetting) {
        wx.getPrivacySetting({
          success(res) {
            console.log(res);
            if (!res.needAuthorization) {
              wx.showLoading({
                title: '正在保存...',
                mask: true
              })
            }
          }
        })

      } else {
        wx.showLoading({
          title: '正在保存...',
          mask: true
        })
      }

      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 300)
        },
        fail: (res) => {
          console.log("保存失败：", res);
          // 2023年8月30日 用户授权判断
          let {
            errno = ''
          } = res;
          if (errno && errno == 104) {
            return
          }
          utils.getSetting().then(res => {
            let authSetting = res.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              this.setData({
                isModal: true
              })
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 300)
        }
      })
    }
  }
})