// pages/phaseIII//exchange/index.js
let app = getApp();
let COS = app.globalData.COS_URL;
const utils = require("../../../utils/util");
const http = require("../../../utils/api");
let type = null; //1红牛券，3惠让，4活动券
let num = '';
let type_id = '';
let _prizeratetype = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    redBull_img: COS + "/public/img/phaseIII/rebbg.png", //红牛背景
    oneenjoy_img: COS + "/public/img/phaseIII/202104/ttbg0406.png", //1元轻松享
    redBull: COS + '/public/img/to2/goldenEgg/redbull.png',
    successImg: COS + "/public/img/phaseIII/oneenjoy080191.png",
    all: '', //全部券数
    placeholder: '',
    inputValue: '', //输入框取值
    remindValue: '', //备注信息
    buttons: [{
      text: '确定',
      extClass: 'confirm'

    }, {
      text: '更改',
      extClass: 'cancel'
    }],
    maxLength: 50, //备注最多字数
    currentlength: 0, //当前备注输入字数
    forbidChange: false, //禁止修改：活动券禁止修改数量，有多少核多少
    hnTitle: app.globalData.hnTitle,
    hnTitleBlue: app.globalData.hnTitleBlue,
    zmTitle: app.globalData.zmTitle,
    couponTitle: '换购券',
    // prizeratetype:105战马活动券
    prizeratetype:null,
    icon_jar_warhorse: COS + '/public/img/bfyl/202205/icon_jar_warhorse.png',
    exc_type:2,//换购类型：默认2战马，1红牛
    hn_blue_can:`${COS}/public/img/bfyl/2023/08/gzUnbox/hn_blue_can.png`,
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static:`${COS}/public/img/bfyl/phase/static`,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("页面传参：",options)
    let params = options.params;
    params = JSON.parse(decodeURIComponent(params));

    console.log("页面传参：",params)
    if (params.num) {
      num = params.num
    }
    if (params.type_id) {
      type_id = params.type_id
    }
    if (params.prizeratetype) {
      _prizeratetype = params.prizeratetype;
      this.setData({
        prizeratetype:_prizeratetype
      })
    }
    if(params.exc_type){
      this.setData({
        exc_type:params.exc_type
      })
    }
    if (params.type) {
      type = params.type;
      this.isActCouponType(+params.type);
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //获取卡券数量
    this.getcountcard();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户信息缓存
    utils.getUserInfoNew().then(data => {
      this.setData({
        userInfo: data
      })
    })
    //更新地址信息
    utils.getShopInfo(false).then(data => {
      data.address = utils.storeAddress(data);
      this.setData({
        shopInfo: data
      })
    }).catch(err => {
      if (err && err.msg) {
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/tabBar/shouye/index',
              })
            }
          }
        })
      }
    })
  },
  getcountcard: function () {
    let {exc_type} = this.data;
    utils.getcountcard().then(res => {
      console.log("countcard卡包统计：", res);
      if (res.code == 1) {
        let {data} = res;
        let all = 0;
        //红牛券
        if (type == 1) {
          all = data.act1_unused;
        }
        // 战马券
        if(type == 2){
          all = data.exc_zm_unused;
        }
        //惠让券、活动券
        if (type == 3 || type == 4) {
          all = num
        }
      
        this.setData({
          all: all,
          placeholder: all,
          inputValue: all,
        });
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
    })

  },
  //输入框监听
  inputChange: function (e) {
    // console.log("inputChange:", e.detail.value);
    var value = e.detail.value;
    // console.log("保留数字:",value);
    this.setData({
      inputValue: value
    })
  },
  remindChange: function (e) {
    // console.log("inputChange:", e.detail.value);
    var value = e.detail.value;
    var length = parseInt(value.length);
    var maxLength = this.data.maxLength;
    console.log("输入长度:", length);
    console.log("maxLength:", maxLength);
    if (length >= maxLength) {
      wx.showToast({
        title: '超过字数限制，无法继续输入。',
        icon: 'none',
        duration: 3000
      })
      length = maxLength
    }
    this.setData({
      remindValue: value,
      currentLength: length
    })
  },
  //点击全部
  all: function () {
    console.log(this.data.all);
    this.setData({
      inputValue: this.data.all
    });
  },
  //点击确定换购
  exchange: function () {
    let inputValue = this.data.inputValue;
    let remindValue = this.data.remindValue;
    let address = this.data.shopInfo.address;
    let all = this.data.all;
    if (!inputValue) {
      wx.showToast({
        title: '请输入换购数量',
        icon: 'none',
        duration: 3000
      })
      return
    }


    if (inputValue <= 0) {
      wx.showToast({
        title: '请输入正确换购数量',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (inputValue > all) {
      wx.showToast({
        title: '您最多可换购' + all + '罐',
        icon: 'none',
        duration: 3000
      })
      return
    }
    if (!(/(^[1-9]\d*$)/.test(inputValue))) {
      // wx.showToast({
      //   title: '请输入正确换购数量',
      //   icon: 'none',
      //   duration: 3000
      // })
      return
    }
    let params = {};
    params.num = inputValue;
    params.address = address;
    params.type = type;
    params.type_id = type_id;
    let {exc_type} = this.data;
    params.exc_type = exc_type;
    if (remindValue && remindValue != '') {

      let param = {
        text: remindValue
      }
      http.post('/api/tools/textcheck', param).then(res => {
        if (res.code == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '您输入的备注信息涉及' + res.msg,
            showCancel: false
          })
          return
        }
        params.remind = remindValue;

        let url = '/pages/phaseIII/distributor/index?params='+encodeURIComponent(JSON.stringify(params));
        wx.redirectTo({
          url: url,
        })
      })

      return
    }
    console.log("remindValue:", remindValue);
    let url = '/pages/phaseIII/distributor/index?params='+encodeURIComponent(JSON.stringify(params));
    wx.redirectTo({
      url: url,
    })
  },
  //点击弹窗按钮
  tapButton: function (e) {
    let index = e.detail.index;
    console.log("tabButton 按钮索引:", index);
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    //  0：确定，跳转经销商页面:'/pages/phaseIII/distributor/index'  1：更改地址   跳转  店铺资料页：'/pages/zhongduan/geren/mendian/renzhen/index'
    let url = '';
    if (index == 0) {
      url = '/pages/phaseIII/distributor/index';
    }
    if (index == 1) {
      url = '/pages/zhongduan/geren/mendian/renzhen/index';
    }

    wx.navigateTo({
      url: url,
    })
  },
  //数字限制
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  bindFocus: function () {
    this.setData({
      placeholder: ''
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.hideLoading({
      success: (res) => {},
    })
    this.setData({
      remindValue: ''
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    num = '';
    type_id = '';
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
  //减1
  subtract: function (e) {
    let inputValue = this.data.inputValue;
    console.log("inputValue:", inputValue);
    if (!inputValue) {
      inputValue = 0;
    }
    if (inputValue >= 0) {
      inputValue--;
      if (inputValue < 0) inputValue = 0;
      this.setData({
        inputValue
      })
    } else {
      inputValue = 0;
      this.setData({
        inputValue
      })
    }
  },
  //加1
  add: function (e) {
    let {inputValue,all} = this.data;
    if (inputValue) {
      if (inputValue >= 0) {
        inputValue++;
        if(inputValue >all){
          return
        }
        this.setData({
          inputValue
        })
      }
    } else {
      this.setData({
        inputValue: 1
      })
    }
  },
  //修改地址
  changeAddress: function () {
    wx.navigateTo({
      url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=1',
    })
  },
  //活动券不可修改券数
  isActCouponType(type) {
    // type:1红牛券，2战马，3惠让，4活动券
    if (type == 4 || type == 3) {
      if (type == 3) {
        this.setData({
          couponTitle: '惠让券'
        })
      }
      if (type == 4) {
        this.setData({
          couponTitle: '活动券'
        })
      }
      this.setData({
        forbidChange: true, //4，活动券禁止修改数量
      })
    } else {
      if (type == 1) {
        this.setData({
          couponTitle: '换购券'
        })
        this.setData({
          forbidChange: false,
        })

      }
    }
  },
  //活动券不可修改提示
  forbidChange() {
    wx.showToast({
      title: '活动券不可修改数量',
      icon: 'none',
      duration: 2000
    })
  }
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})