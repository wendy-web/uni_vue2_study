// pages/zhongduan/geren/setting/modifyInfo.js
const utils = require("../../../../utils/util")
const http = require("../../../../utils/http");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supportAvatarInput: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.27.0') >= 0,
    title: '', //页面标题
    left_text: '返回',
    right_text: '完成',
    nick_name: '', //昵称
    avatar_url: '', //头像地址
    new_name: '', //新名字
    open_type: 0, //1,修改头像，2修改昵称
    inputChanged:false,//昵称输入框变更
    supportNickNameReview:utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.29.1') >= 0,//input用户昵称是否支持审核
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      nick_name,
      avatar_url,
      open_type
    } = options;
    if (nick_name) {
      nick_name = decodeURIComponent(nick_name);
      this.setData({
        nick_name,
      })
    }
    if (avatar_url) {
      avatar_url = decodeURIComponent(avatar_url);
      this.setData({
        avatar_url,
      })
    }
    if (open_type) {
      this.setData({
        open_type,
        title: open_type == 1 ? '个人头像' : '设置名字',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  onClickLeft() {
    wx.navigateBack().catch(err=>{
      wx.switchTab({
        url: '/pages/tabBar/shouye/index',
      })
    })
  },
  onClickRight() {
    wx.showToast({
      title: '点击按钮',
      icon: 'none'
    });

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
  searchChange(event) {
    let {value} = event.detail;
    console.log(event.detail)
    value = value.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      new_name: value,
      nick_name:value,
      inputChanged:true
    })
  },
  async saveName(event) {
    console.log(event.detail.value)
    let {nickname} = event.detail.value;
    nickname = nickname.replace(/(^\s*)|(\s*$)/g, "");
    this.setData({
      new_name:nickname,
      nick_name:nickname
    })
    wx.showLoading({
      title: '加载中···',
      mask: true
    })
    if(this.data.supportNickNameReview){
      await this.delay(1000);
    }else{
      let textcheck = await this.textcheck(nickname);
      if(!textcheck){
        wx.hideLoading();
        this.setData({
          new_name:'',
          nick_name:''
        })
        return
      };
    }
    let {
      new_name,
      avatar_url
    } = this.data;
    console.log("提交表单：",new_name,nickname);
    if(!new_name){
      wx.hideLoading();
      wx.showToast({
        title: '请输入昵称',
        icon:'none'
      })
      return 
    }
    if (new_name.length > 15) {
      wx.showToast({
        title: '昵称不可超过15个字符',
        icon:'none'
      })
      return 
      
    }
    try {
      
      let params = {
        nickName: new_name,
        avatarUrl: avatar_url
      }
      this.updateUserPorfile(params).then(res => {
        let {
          code,
          msg
        } = res;
        if (code == 1) {
          wx.navigateBack().catch(err=>{
            wx.switchTab({
              url: '/pages/tabBar/geren/index',
            })
          });
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      }).catch(err => {

      })
    } catch (err) {
      console.log(err)
      // if (err.msg) {
      //   wx.showModal({
      //     title: '温馨提示',
      //     content: err.msg,
      //     showCancel: false
      //   })
      // }
    }
  },

  /**拍照上传 */
  async shot(event) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let chooseImage = wx.chooseMedia || wx.chooseImage
    console.log('chooseImage:', chooseImage);

    try {
      /**图片获取 */
      // let [tempFile] = (await chooseImage({count:1,sizeType:'compressed',mediaType:['image'],sourceType:['camera'],camera:'back'})).tempFiles
      let [tempFile] = (await chooseImage({
        count: 1,
        sizeType: 'compressed',
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back'
      })).tempFiles
      console.log(tempFile);
      let imgPath = tempFile.tempFilePath

      //是否压缩
      if (tempFile.size / 1024 > 1000) {
        let {
          tempFilePath
        } = await wx.compressImage({
          src: imgPath,
          quality: 50
        })
        imgPath = tempFilePath
      }
      // 裁剪
      // imgPath = await this.cropAvatar(imgPath)
      await this.onChooseAvatar({
        detail: {
          avatarUrl: imgPath
        }
      })
    } catch (error) {
      //  wx.showModal({
      //    title:'温馨提示',
      //    content:JSON.stringify(error)
      //  })
      console.log(error)
      wx.hideLoading()
    } finally {
      wx.hideLoading()

    }
  },
  async onChooseAvatar({
    detail
  }) {
    console.log("detail:", detail);
    let url = detail.avatarUrl
    // 裁剪
    // url = await this.cropAvatar(url)
    // console.log("裁剪以后：",url);
    // 压缩
    try {
      url = await this.compressImage(url)
    } catch (error) {
      console.error('头像压缩失败：', error)
    }
    try {
      //上传接口调用
      let avatarUrl = await utils.uploadImgAI(url);
      let {
        nick_name
      } = this.data;
      let params = {
        nickName: nick_name,
        avatarUrl: avatarUrl
      }
      this.updateUserPorfile(params).then(res => {
        let {
          code,
          msg
        } = res;
        if (code == 1) {
          this.setData({
            avatar_url: avatarUrl
          })
          wx.navigateBack();
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      }).catch(err => {

      })

    } catch (error) {
      console.log(error);
      wx.showModal({
        content: `${error.msg || "上传失败，请稍后再试"}`,
        showCancel: false
      })
    }
  },
  cropAvatar(url) {
    return new Promise((resolve, reject) => {
      try {
        if (wx.cropImage) {
          return wx.cropImage({
            src: url,
            cropScale: '1:1',
            success({
              tempFilePath
            }) {
              if (!tempFilePath) return reject(Error("处理失败，未能获取到图片路径"))
              resolve(tempFilePath)
            },
            fail(err) {
              // reject(Error(err))
              reject(err)
            }
          })
        }
        if (wx.editImage) {
          return wx.editImage({
            src: url,
            success({
              tempFilePath
            }) {
              if (!tempFilePath) return reject(Error("处理失败，未能获取到图片路径"))
              resolve(tempFilePath)
            },
            fail(err) {
              console.log(err);
              // reject(Error(err))
              reject(err)
            }
          })
        }
        resolve(url)
      } catch (error) {
        reject(error)
      }

    })
  },
  compressImage(url) {
    console.log("compressImage url:",url);
    return new Promise(async (resolve, reject) => {
      // 指定压缩为768px * 768px
      const COMPRESS_SIZE = 768
      try {
        const {
          width,
          height
        } = await wx.getImageInfo({src:url})
        const size = Math.ceil(Math.sqrt(width * height))
        if (size <= COMPRESS_SIZE) throw Error(`当前图片尺寸为 ${width} * ${height} (${size}) ， 已符合压缩规则，忽略压缩`)
        const quality = Math.ceil(COMPRESS_SIZE * 100 / size)
        console.log("quality:",quality);
        if (!wx.compressImage) throw Error("当前基础库版本太低，请升级微信客户端")
        wx.showLoading({
          title: '压缩中',
        })
        wx.compressImage({
          src: url,
          quality: quality,
          // 以下高版本支持，低版本仍考虑 quality
          compressedWidth: COMPRESS_SIZE,
          compressHeight: COMPRESS_SIZE,
          success({
            tempFilePath
          }) {
            if (!tempFilePath) return reject(Error('处理失败，未获取到路径'))
            // 检查后缀是否存在, 应对模拟器返回错误的tempFilePath问题
            if (!/^.*\.(.+)$/.test(tempFilePath)) return reject(Error('SDK错误，压缩路径不正确'))
            resolve(tempFilePath)
          },
          fail(error) {
            reject(Error(error.errmsg || error.errMsg))
          },
          complete() {
            wx.hideLoading({})
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  //更新用户资料/api/user/userprofile
  updateUserPorfile(params) {
    return new Promise((resolve, reject) => {
      http.postBase({
        url: '/api/user/userprofile',
        params,
        mask: false
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 检测敏感词 /api/tools/textcheck
  textcheck(word) {
    return new Promise((resolve, reject) => {
      http.postBase({
        url: '/api/tools/textcheck',
        params: {
          text: word
        },
        mask: false
      }).then(res => {
        let {
          code,
          data,
          msg
        } = res;
        if (code == 1) {
          resolve(true)
          return
        }
        wx.showModal({
          title: '温馨提示',
          content:`名称包含敏感词，请修改后重试。`,
          showCancel:false
        })
        resolve(false)
      }).catch(err => {
        reject(err)
      })
    });
  },
  // 用户昵称审核（微信api）
  nicknamereview(event){
    console.log(event.detail);
    let {pass,timeout} = event.detail;
    return new Promise((resolve)=>{
      //通过且未超时
      if(pass==true&&timeout==false){
        resolve(true)
        this.setData({
          inputChanged:true,
        })
        return 
      }
      this.setData({
        new_name:"",
      })
      resolve(false)
    })
  },
  delay(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  } 
})