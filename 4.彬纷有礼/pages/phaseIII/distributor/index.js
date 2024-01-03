// pages/phaseIII//distributor/index.js
const utils = require("../../../utils/util");
const http = require("../../../utils/api");
const COS_URL = getApp().globalData.COS_URL;
let remind = ''; //备注信息
let _param = {};
let type_id = '';
let excSalesman = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    applyPop: false, //申请兑换弹窗
    phoneCallPop: false, //打电话弹窗
    buttons: [{
      text: '取消',
      extClass: 'cancel'
    }, {
      text: '确定',
      extClass: 'confirm'
    }],
    phone: '',
    num: '', //兑换数量
    list: [], //经销商列表
    saleMan: [], //业务员信息
    noMore: false,
    callImg: COS_URL + "/public/img/phaseIII/phonecall0831.png",
    successImg: COS_URL + "/public/img/phaseIII/202104/success0406.png",
    address: '', //店铺地址
    // 2023年1月10日 新增战马换购券
    exc_type: 2, //兑换类型：1红牛，2战马 默认2
    navbar_title: "确认订单",
    icon_hn_nav_bar: COS_URL + "/public/img/bfyl/202301/icon_hn_nav_bar.png",
    icon_zm_nav_bar: COS_URL + "/public/img/bfyl/202301/icon_zm_nav_bar.png",
    excCheckPop: false, //兑换确认弹窗
    img_zm_exc_cans: COS_URL + "/public/img/bfyl/202301/img_zm_exc_cans.png",
    // 2023年9月19日 phaseIII的static 静态资源迁移至COS
    file_phase_static:`${COS_URL}/public/img/bfyl/phase/static`,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let params = options.params;
    params = JSON.parse(decodeURIComponent(params));
    console.log("distributor onLoad 传参:", params);
    // this.setData({
    //   search: this.search.bind(this)
    // })
    if (params.num) {
      this.setData({
        num: params.num
      });
    }
    if (params.remind) {

      remind = params.remind

    } else {
      remind = '';
    }
    if (params.address) {
      this.setData({
        address: params.address
      })
    }
    if (params.type) {
      this.setData({
        type: params.type
      })
      _param.type = params.type
    }
    if (params.type_id) {
      type_id = params.type_id
    }
    if (params.exc_type) {
      this.setData({
        exc_type: params.exc_type
      })
    }
    wx.showLoading({
      title: '正在加载',
    })
    this.getapplist(_param);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
  onShow: function () {},
  /**
   *getapplist  获取配送商列表 
   * @param {*
   * keyword:关键词
   * a_uid 设置默认传condition=2 的uid
   * } param 
   */
  getapplist: function (param) {
    http.post("/api/card/getapplist", param).then(res => {
      console.log("getapplist  配送商列表返回：", res);
      let saleMan = this.data.saleMan;
      let dealer = new Array();
      if (res.code == 1 && res.data) {
        var list = res.data;
        // 如果list太长，取500条数据
        if (list.length > 500) {
          list = list.slice(0,500)
        }
        var reg = /^(\d{3})\d*(\d{4})$/;
        // var phoneStar = phone.replace(reg,'$1****$2')
        for (var i = 0; i < list.length; i++) {
          if (typeof list[i] === "object") {
            var km = (list[i]['distance'] / 1000).toFixed(2);
            list[i]['dist'] = km;
            list[i]['phoneStar'] = list[i]['mobile'].replace(reg, '$1****$2');
            if (list[i]['is_def'] == 1) {
              list[i]['checked'] = true;
            } else {
              list[i]['checked'] = false;

            }
          }
        }
        this.setData({
          list: list,
          noMore: false
        });
      }
      if (res.data.length == 0) {
        this.setData({
          noMore: true
        });
      }
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
    })

  },
  search: function (value) {
    wx.showToast({
      title: 'searched',
      icon: 'none',
    })
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve([{
    //       text: '搜索结果',
    //       value: 1
    //     }, {
    //       text: '搜索结果2',
    //       value: 2
    //     }])
    //   }, 200)
    // })
  },
  searchMsg: function (e) {
    var value = e.detail.value;

    _param.keyword = value
    console.log("搜索传参:", _param);
    wx.showLoading({
      title: '正在加载',
    })
    this.getapplist(_param);
  },
  selectResult: function (e) {

    console.log('select result', e.detail)
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    let value = e.detail.value;
  },
  focus: function (e) {
    console.log("focus in:", e);
  },
  apply: function (e) {

    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let {
      exc_type
    } = this.data;
    excSalesman = {
      id,
      index
    };
    if (exc_type == 2) {
      this.applyZm();
      return
    }
    wx.showModal({
      title: '温馨提示',
      content: "点击确定，发起兑换申请",
      success: function (res) {
        if (res.confirm) {
          let param = {
            num: that.data.num
          };
          if (id == 0) {
            console.log("saleMan:", that.data.saleMan);
            let saleMan = that.data.list[index];
            param.a_uid = saleMan.uid;
            if (saleMan.contact) {
              param.jxs = saleMan.name + "(" + saleMan.contact + ")";
            } else {
              param.jxs = saleMan.name + "(红牛业务员)";
            }
            param.jxsdh = saleMan.mobile;
          } else {
            console.log("list[index]:", that.data.list[index]);
            let info = that.data.list[index];
            param.a_uid = info.uid;
            param.jxs = info.name;
            param.jxsdh = info.mobile;
          }

          param.remind = remind;
          param.type = that.data.type;
          if (type_id) {
            param.type_id = type_id
          }
          console.log("兑换申请传参：", param);
          http.post("/api/card/forapp", param).then(res => {
            console.log("兑换申请返回结果：", res);
            if (res.code == 0) {
              wx.showModal({
                title: '温馨提示',
                content: res.msg,
                showCancel: false
              })
            }
            if (res.code == 1) {
              that.setData({
                applyPop: true,
                check_no: res.data.check_no
              });
            }
          })

        }
      }
    })


  },
  applyZm: function () {
    this.setData({
      excCheckPop: true
    })
  },
  close: function (e) {
    this.setData({
      applyPop: false
    });
    let url = '/pages/storeOrder/myorder/index/index?activeTab=1';
    wx.redirectTo({
      url: url,
    })
    // wx.navigateTo({
    //   url: url,
    // })
  },
  mkPhoneCall: function (e) {
    let phone = e.currentTarget.dataset.phone;
    let phoneStar = e.currentTarget.dataset.phonestar;

    this.setData({
      phone: phone,
      phoneStar: phoneStar,
      phoneCallPop: true
    });
    console.log("手机号：", phone);
  },
  //点击弹窗按钮
  tapButton: function (e) {
    let index = e.currentTarget.dataset.index;
    console.log("tabButton 按钮索引:", index);
    let phone = this.data.phone;
    if (index == 0) {
      this.setData({
        phoneCallPop: false
      });
      return
    }
    if (index == 1) {
      wx.makePhoneCall({
        phoneNumber: phone //仅为示例，并非真实的电话号码
      })
      return
    }


  },
  setDefault: function (e) {
    let uid = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let changeItem = 'list[' + index + '].checked';
    let list = this.data.list;
    let setDefault = {
      // a_uid:uid
    }
    if (list[index].checked) {
      setDefault.a_uid = '';
      this.setData({
        [changeItem]: false
      })
      return
    } else {
      setDefault.a_uid = uid;
      this.setData({
        [changeItem]: true
      })
    }
    // _param.a_uid = uid

    console.log("请求参数:", setDefault);
    http.post("/api/card/getapplist", setDefault, false).then(res => {
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      } else {
        _param.a_uid = ''
      }
    })


  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    remind = '';
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    remind = '';
    _param = {};
    type_id = '';
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    _param.a_uid = '';
    _param.keyword = '';
    this.getapplist(_param);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onBeforeBack: function () {
    wx.navigateBack().catch(err => {
      wx.redirectTo({
        url: '/pages/phaseIII/voucher/index',
      })
    })
  },
  // 关闭兑换确认弹窗
  onClose() {
    this.setData({
      excCheckPop: false,
      phoneCallPop: false
    })
  },
  // 确认换购申请···
  confirmToExc() {
    let param = {
      num: this.data.num
    };
    let {
      id,
      index
    } = excSalesman;

    if (id == 0) {
      console.log("saleMan:", this.data.saleMan);
      let saleMan = this.data.list[index];
      param.a_uid = saleMan.uid;
      if (saleMan.contact) {
        param.jxs = saleMan.name + "(" + saleMan.contact + ")";
      } else {
        param.jxs = saleMan.name + "(红牛业务员)";
      }
      param.jxsdh = saleMan.mobile;
    } else {
      console.log("list[index]:", this.data.list[index]);
      let info = this.data.list[index];
      param.a_uid = info.uid;
      param.jxs = info.name;
      param.jxsdh = info.mobile;
    }

    param.remind = remind;
    param.type = this.data.type;
    if (type_id) {
      param.type_id = type_id
    }
    console.log("兑换申请传参：", param);
    http.post("/api/card/forapp", param).then(res => {
      console.log("兑换申请返回结果：", res);
      if (res.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }
      if (res.code == 1) {
        this.setData({
          applyPop: true,
          excCheckPop: false,
          check_no: res.data.check_no
        });
      }
    })

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})