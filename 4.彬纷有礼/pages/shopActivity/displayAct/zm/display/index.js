// pages/shopActivity/displayAct/hn/display/index.js

let app = getApp();
let COS_URL = app.globalData.COS_URL;
const auth = require('../../../../../utils/auth.js');
const utils = require('../../../../../utils/util');
const http = require('../../../../../utils/api');
const log = require('../../../../../utils/log');
const uploadUrl = app.globalData.API_BASE_URL + '/api/act3/upload';
let cameraTrigger = false; //是否相机触发
const {uploadImgAI} = require('../../api/utils');
import {getUserLocation} from '../../../../../utils/location'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caniDisplay: false, //是否可陈列，默认false,根据上一次成功陈列时间+间隔时间和当前时间判断
    date_today: '', //今日日期
    uploadList: null, //已上传列表
    icon_freezer: COS_URL + '/public/img/bfyl/202204/icon_freezer.png',
    icon_redbull: COS_URL + '/public/img/bfyl/202204/icon_redbull.png',
    icon_example: COS_URL + '/public/img/bfyl/202204/img_display_example.png',
    icon_camera: COS_URL + '/public/img/bfyl/202204/icon_camera.png',
    icon_arrow_red: COS_URL + '/public/img/bfyl/202204/icon_arrow_red.png',
    icon_fork: COS_URL + '/public/img/bfyl/202204/icon_fork.png',
    icon_hook: COS_URL + '/public/img/bfyl/202204/icon_hook.png',
    icon_success: COS_URL + '/public/img/bfyl/202205/icon_success.png',
    icon_warn: COS_URL + '/public/img/bfyl/202205/icon_warn.png',
    img_title_winner: COS_URL + '/public/img/bfyl/202206/img_title_winner.png', //陈列成功弹窗标题
    img_bg_pop_apply: COS_URL + '/public/img/bfyl/202204/bg_pop_apply.png', //陈列报名弹窗 奖励背景
    img_bg_apply_btn: COS_URL + '/public/img/bfyl/202204/bg_apply_btn.png', //陈列报名弹窗 按钮背景

    pop_act_won: false, //陈列合格弹窗
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.getNavbarData().then(res => {
      if (res) {
        this.setData({
          navBarSystem: res,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let time_now = Date.now();
    let date_today = utils.parseTime(time_now, "{y}.{m}.{d}");
    this.setData({
      date_today
    })
    let userInfo = this.getUserInfo();
    //获取陈列信息
    this.displayInfo().then(res => {
      console.log("陈列参与信息：", res);
      if (+res.code == 1) {
        let displayInfo = res.data;
        this.getNextDisplayDate(displayInfo);
        this.setData({
          displayInfo,
        })
        //获取拍照记录：取今日已拍照信息展示
        let param = {};
        param.act_id = displayInfo.act_id;
        this.getUploadLog(param);

      } else {
        //未获取到报名信息
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    }).catch(err => {
      console.error("陈列参与信息：", err);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //相机触发，不请求接口
    console.log("cameraTrigger:", cameraTrigger);
    // if (cameraTrigger) return;
    // cameraTrigger = false;

  },
  //拍照，1M以上压缩
  takePhoto: function () {
    let that = this;
    if (cameraTrigger) return;
    cameraTrigger = true;
    wx.showLoading({
      title: '正在加载',
    })
    //拍照上传图片时候，先隐藏入口，上传结果返回以后再判断。防止重复上传
    that.setData({
      caniDisplay: false
    });
    wx.chooseMedia({
      count: 1,
      sizeType:'compressed',
      camera:'back',
      mediaType: ['image'], 
      sourceType: ['camera'], //上线只选camera拍照
      // sourceType: ['camera', 'album'], //上线只选camera拍照
      success: (res) => {
        wx.hideLoading();
        console.log("camera：", res);

        cameraTrigger = false;
        var tempPath = res.tempFiles[0]['tempFilePath'];
        var size = (res.tempFiles[0].size / 1024).toFixed(1); //KB
        console.log("size:", size / 1024 + "M");
        //大于1M，压缩
        if (size / 1024 > 1) {
          that.compressImg(tempPath).then(res => {
            //上传图片操作
            that.uploadImg(res, tempPath);
          }).catch(err => {
            wx.showModal({
              title: '温馨提示',
              content: '图片压缩失败，请重试',
              showCancel: false
            })
          });
        } else {
          //上传图片操作
          that.uploadImg(tempPath, tempPath);
        }

      },
      fail: (err) => {
        wx.hideLoading();
        cameraTrigger = false;
        console.log("chooseImage fail:", err);
        let displayInfo = that.data.displayInfo;
        //取消拍照重置入口状态
        that.setData({
          caniDisplay: that.checkDisplay(displayInfo)
        })
        if (err.errMsg == "chooseImage:fail cancel") return;
        let msg = JSON.stringify(res);
        wx.showModal({
          titile: '温馨提示',
          content: '微信调用相机异常，请重新尝试',
          showCancel: false,
          success: (res) => {

          }
        })
      }
    })
  },
  //压缩图片，上传
  compressImg: function (temPath = '') {
    return new Promise((resolve, reject) => {
      var path = temPath || this.data.path;
      console.log("path:", path);
      wx.compressImage({
        src: path,
        quality: 70,
        success: (res) => {
          console.log("compress:", res);
          let miniSize = res.tempFilePath;
          resolve(miniSize);
        },
        fail: (err) => {
          //视情况而定：是否记录日志
          console.error(err);
          reject(err);
        }
      })
    })
  },
  //预览图片
  previewImg: function (e) {
    var url = e.currentTarget.dataset.path;
    cameraTrigger = true;
    wx.previewImage({
      urls: [url],
      success: (res) => {
        console.log("预览成功：", res);
      },
      fail: (err) => {
        console.log("预览成功：", err);
      }
    })
  },
  // 参与信息
  displayInfo: function () {
    return utils.act3_getinfo();
  },
  //根据时间判断是否可陈列:上次陈列时间，间隔时间
  checkDisplay: function (displayInfo) {
    let caniDisplay = false;
    let last_time = displayInfo.end_time; //年-月-日 时分秒格式
    // 陈列时间间隔：秒需要转换成毫秒
    let intervalTime = displayInfo.calc.follow_time * 1000 || 0;
    if (last_time) {
      let now = Date.now();
      let date_today = utils.parseTime(now, "{y}/{m}/{d}");
      let date_today_timestamp = new Date(date_today).getTime();
      console.log("今日时分秒：", date_today_timestamp);

      //日期格式需要转换成2022/04/斜杠写法，兼容ios
      let lastTime_timestamp = new Date(last_time.replace(new RegExp(/-/gm), '/')).getTime();
      let total = lastTime_timestamp + intervalTime;
      // 上次拍照+间隔时间大于当前时间，不可陈列，小于则可陈列
      //如果时间间隔小于1天，精确到毫秒，大于1天按天取整(上次拍照时间取整+1天间隔时间)
      if (intervalTime >= 86400000) {
        total = lastTime_timestamp + intervalTime;
        total = utils.parseTime(total, "{y}/{m}/{d}");
        total = new Date(total).getTime();
      }
      caniDisplay = now >= total ? true : false;
      console.log("total:", utils.parseTime(total), "now:", utils.parseTime(now));
      console.log("陈列过：", caniDisplay);
    } else {
      console.log("未陈列");
      caniDisplay = true;
    }

    return caniDisplay;
  },
  //跳转至店铺信息
  editShopInfo: function () {
    let url = "/pages/zhongduan/geren/mendian/renzhen/index?hide=1";
    wx.navigateTo({
      url: url,
    })
  },
  //上传陈列图片，temPath:原始图片路径，防止微信压缩以后名字改变
  uploadImg: function (imgPath, tempPath, mask) {
    /**
     * code=0 说明图都上传失败，比如未报名
     *code=1 说明上传图成功，识别结果在data里面 status=0 未满足,status=1满足
     */

    var token = wx.getStorageSync('token');
    wx.showLoading({
      title: '正在上传',
      mask: true, //防止穿透
    })
    let that = this;
    let displayInfo = that.data.displayInfo;

    wx.uploadFile({
      filePath: imgPath,
      name: 'img',
      url: uploadUrl,
      formData: {
        name: tempPath
      },
      header: {
        Authorization: token,
      },
      success(res) {
        wx.hideLoading();
        cameraTrigger = false;
        console.log('上传返回数据类型：', JSON.stringify(res));
        console.log('上传成功返回：', res);
        var result = JSON.parse(res.data);
        console.log('json parse: ', result);
        //code=1 图片上传成功：识别结果在data里面 status=0 未满足,status=1满足
        if (+result.code == 1) {
          let data = result.data;
          //获取陈列信息
          that.displayInfo().then(res => {
            console.log("陈列参与信息222222：", res);
            if (+res.code == 1) {
              let displayInfo = res.data;
              //拍照合格弹窗
              let pop_act_won = displayInfo.s_num >= 4 ? true : false;
              that.setData({
                displayInfo,
                pop_act_won
              })
             
              //获取拍照记录：取今日已拍照信息展示
              let param = {};
              param.act_id = displayInfo.act_id;
              that.getUploadLog(param);
              that.getNextDisplayDate(displayInfo);
            }
          }).catch(err => {
            console.error("陈列参与信息：", err);
          })

        } else {
          that.setData({
            caniDisplay: false
          });
          //code=0 说明图都上传失败，比如未报名
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 3000
          })
        }

      },
      fail(res) {
        wx.hideLoading();
        cameraTrigger = false;
        console.log('上传失败返回：', res);
        var str = JSON.stringify(res);
        wx.showModal({
          title: '上传失败返回',
          content: str + '\n url:' + url
        })
        that.setData({
          caniDisplay: false
        });

      }
    })

  },
  //跳转至拍照记录
  openHistory: function () {
    let url = '/pages/shopActivity/displayAct/displayRecord/index';
    wx.navigateTo({
      url: url,
      success: (res) => {
        console.log("前往拍照记录页");

      }
    })
  },
  // 获取拍照记录
  getUploadLog: function (param) {
    console.log("/api/act3/uploadLog传参：", param);
    let displayInfo = this.data.displayInfo;
    let caniDisplay = this.data.caniDisplay;
    //获取今日日期
    let date_today = utils.parseTime(Date.now(), "{y}-{m}-{d}");
    http.post('/api/act3/uploadLog', param).then(res => {
      console.log("/api/act3/uploadLog:", res);
      if (+res.code == 1) {
        let data = res.data;
        let list = data.list;
        let uploadList = null; //已上传记录

        Object.keys(list).forEach(item => {
          if (item == date_today) {
            //今日拍照记录
            uploadList = list[item];
            console.log("今日拍照记录：", uploadList);
          }
        })
        if (uploadList) {
          this.setData({
            uploadList: uploadList.reverse()
          })
        }
        return
      }

    }).catch(err => {
      console.error("/api/act3/uploadLog：", err);
    })
  },
  // 获取用户信息
  async getUserInfo() {
    let userInfo = null;
    if (wx.getStorageSync('userdata')) {
      userInfo = wx.getStorageSync('userdata');
    } else {
      userInfo = await utils.getUserInfoNew();
    }
    this.setData({
      userInfo
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
    cameraTrigger = false;
    this.setData({
      pop_act_won: false
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /** 
   * 判断下次拍照时间
   */
  getNextDisplayDate: function (actInfo) {
    //page：0可拍照，1当天失败已达上限，2区间内合格
    let page = actInfo.page;
    let next_display_date = '';
    let follow_time = actInfo.calc.follow_time * 1000;
    let last_time = actInfo.last_time ? new Date(actInfo.last_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
    let end_time = actInfo.end_time ? new Date(actInfo.end_time.replace(new RegExp(/-/gm), '/')).getTime() : null;
    //当天失败明天再拍：end_time+1天
    if (page == 1) {
      if (actInfo.calc.follow_time >= 86400) {
        let day_time = utils.parseTime(end_time, "{y}/{m}/{d}");
        end_time = new Date(day_time).getTime();
      }
      end_time = end_time ? end_time : Date.now();
      console.log("end_time:", end_time);
      next_display_date = end_time + 86400000;
    }
    //区间内合格：上次合格时间+区间
    if (page == 2) {
      if (actInfo.calc.follow_time >= 86400) {
        let day_time = utils.parseTime(last_time, "{y}/{m}/{d}");
        last_time = new Date(day_time).getTime();
      }
      last_time = last_time ? last_time : Date.now();
      next_display_date = last_time + follow_time;
      console.log("last_time:", last_time, "next_display_date:", next_display_date, follow_time);
    }
    next_display_date = utils.parseTime(next_display_date, "{m}月{d}日", false);
    this.setData({
      next_display_date
    })
  },
  closePop: function () {
    this.setData({
      pop_act_won: false,
    });
  },
  /**拍照上传 */
  async shot(event){
    this.setData({shotLoading:true})
    /**查找当前数据 */
    //  let {tagId} = event.currentTarget.dataset
    //  let tag_list = this.data.tag_list
    //  let currTag = tag_list[tag_list.findIndex(item=>item.id == tagId)]
     let chooseImage = wx.chooseMedia||wx.chooseImage
      
        try {
          /**获取经纬度 */
          // wx.showLoading({title:'获取定位中，请稍后',mask:true})
          // let {longitude:lng,latitude:lat} = (await getUserLocation()).data;
          let {longitude,latitude} = (await getUserLocation()).data;
          console.log("定位信息：",longitude,latitude);
          // wx.hideLoading()
          /**获取经纬度 */
          /**图片获取 */
          // let [tempFile] = (await chooseImage({count:1,sizeType:'compressed',mediaType:['image'],sourceType:['camera'],camera:'back'})).tempFiles
          let tempFile = (await chooseImage({count:1,sizeType:'compressed',mediaType:['image'],sourceType:['camera'],camera:'back'})).tempFiles
          console.log(tempFile);return
          let imgPath = tempFile.tempFilePath
          //是否压缩
          if(tempFile.size/1024>60){
            let {tempFilePath} = await  wx.compressImage({src:imgPath,quality:70})
            imgPath = tempFilePath
          }
          /**图片获取 */
          //上传陈列拍照
          let {dis_id,shop_id} = _options
          let parmas = {
              dis_id,
              shop_id,
              tag:currTag.tag,
              lat,
              lng
          }
          //上传图片
          let res = await uploadImgAI(imgPath,parmas)
          //展示上传结果   
        } catch (error) {
          //  wx.showModal({
          //    title:'温馨提示',
          //    content:JSON.stringify(error)
          //  })
            console.log(error)
            wx.hideLoading()
        }finally{
          // this.setData({shotLoading:false})
        }
  },

})