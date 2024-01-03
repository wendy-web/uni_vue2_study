//index.js
// 在页面中定义插屏广告
let interstitialAd = null;
//激励式广告
// 在页面中定义激励视频广告
let videoAd = null;
//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;
var utils = require('../../../utils/util.js');
var http = require('../../../utils/api.js');
var auth = require('../../../utils/auth');
var log = require('../../../utils/log');
let _showAd = false;
let userIdent = ''; //用户身份
let c_uid = ''; //转让/移除 uid,
let phaseIII_count = '';
let qrcode = '';
let token = '';
let _getShopQr = false;
let switchAd = false;
let hnTypeArr = app.globalData.hnTypeArr; //红牛箱内码红包类型
let zmTypeArr = app.globalData.zmTypeArr; //战马箱内码红包类型

Page({
  data: {
    pageReady: false,
    shidy: false,
    noStore: false,
    hideLoading: false,
    mdmimg: COS_URL + '/public/img/bfyl/assets/store/mdm.png',
    shareimg: COS_URL + '/public/img/bfyl/assets/store/share.png',
    dy: COS_URL + '/public/img/bfyl/assets/store/my/dy.png',
    zg: COS_URL + '/public/img/bfyl/assets/store/my/zg.png',
    dydf: COS_URL + '/public/img/bfyl/assets/store/dydf.png',
    member: '',
    transferPop: false, //转让掌柜/移除店员弹窗
    transfer: '', //1 转让掌柜  2移除店员
    secondPop: false, //二次确认弹窗
    crew: '', //店员信息
    boss: '', //掌柜的信息
    quitPop: false,
    tdPop: false, //退店
    storeImg: app.globalData.COS_URL + '/public/img/Tian/202101/store.png',
    // tdPopUrl: app.globalData.COS_URL + '/images/Pops/tdPop.png',
    tdPopUrl: app.globalData.COS_URL + '/public/img/Tian/202101/tdPop.png',
    tdPopBtl: app.globalData.COS_URL + '/images/Pops/tdPopBtl.png',
    tdPopBtr: app.globalData.COS_URL + '/images/Pops/tdPopBtr.png',
    zrPop: false, //转让
    zrPopUrl: app.globalData.COS_URL + '/public/img/Tian/202101/zrPop.png',
    zrPopBtl: app.globalData.COS_URL + '/images/Pops/zrPopBtl.png',
    zrPopBtr: app.globalData.COS_URL + '/images/Pops/zrPopBtr.png',
    ycPop: false, //移除
    ycPopUrl: app.globalData.COS_URL + '/public/img/Tian/202101/ycPop.png',
    ycPopBtl: app.globalData.COS_URL + '/images/Pops/ycPopBtl.png',
    ycPopBtr: app.globalData.COS_URL + '/images/Pops/ycPopBtr.png',
    popImg: '',
    adShow: false,
    storeRankingPop: false, //兑奖活动正在进行中，已报名用户不可以转店、入驻其他店铺
    storeRankingImg: app.globalData.COS_URL + "/public/img/storeRank/202108/pop/bg.png", //店铺信息确认背景
    iKnowImg: app.globalData.COS_URL + "/public/img/storeRank/20210121/iKnow0128.png", //店铺信息确认背景,
    blockAd: false,
    fzgPop: false, //副掌柜
    deputy: [], //副掌柜数组
    hasStaff: false, //有店员
    userRoleMap: app.globalData.userRole, //用户身份显示

  },
  onLoad: function () {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-fcc07442bc01431e'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-e3def54a3d2a5d3c',
        multiton: true, // 多例模式
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {
        if (!this.data.tdPop && !this.data.ycPop && !this.data.zrPop) return;
        var that = this;
        // var userIdent = this.data.userIdent;
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              if (userIdent == 1) {
                if (that.data.ycPop) {
                  //移除店员操作
                  that.setData({
                    transferPop: true,
                    transfer: 2,
                    ycPop: false
                  });
                } else if (that.data.zrPop) {
                  //装让店铺操作
                  that.setData({
                    transferPop: true,
                    transfer: 1,
                    zrPop: false
                  });
                }
                // else if(this.data.fzgPop){
                //   //设置副掌柜
                //   this.setData({
                //       transferPop: true,
                //       transfer: 3
                //   });
                // }

              } else {
                //退出店铺，后续如果转让掌柜也需要激励视频···再判断
                that.setData({
                  quitPop: true,
                  tdPop: false
                });
              }
            }
          })

        } else {
          wx.hideLoading({
            complete: (res) => {},
          })
          //其它错误情况记录实时日志
          log.setFilterMsg('Ad error');
          log.info(err.errCode, ":", err.errMsg);
        }

      })
      videoAd.onClose((res) => {

        userIdent = wx.getStorageSync('who');
        if (res && res.isEnded) {
          if (userIdent == 1) {
            if (this.data.ycPop) {
              //移除店员操作
              this.setData({
                transferPop: true,
                transfer: 2
              });
            } else if (this.data.zrPop) {
              //转让店铺操作
              this.setData({
                transferPop: true,
                transfer: 1
              });
            } else if (this.data.fzgPop) {
              //设置副掌柜
              this.setData({
                transferPop: true,
                transfer: 3
              });
            }

          } else {
            //退出店铺，后续如果转让掌柜也需要激励视频···再判断
            this.setData({
              quitPop: true,
            });
          }
        }
        this.setData({
          tdPop: false,
          ycPop: false,
          zrPop: false
        });
      })
    }

  },
  onReady: function () {},
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    that.initData().then(res => {
      that.getShopInfo().then(res => {
        let crew = that.data.crew;
        if (crew) {
          crew.forEach((item, index) => {
            let countTime = setTimeout(() => {
              var item_loaded = 'crew[' + index + '].loaded';
              that.setData({
                [item_loaded]: true
              })
              clearTimeout(countTime)
            }, (index + 1) * 220);
          });
        }
        wx.hideLoading({
          success: (res) => {},
        })
        that.getcountcard().then(res => {
          that.showAd();
        });

      });
      let phaseIII = wx.getStorageSync('phaseIII');
      if (phaseIII) {
        this.setData({
          phaseIII: phaseIII
        })
      }
      let mylbs = wx.getStorageSync('mylbs') && JSON.parse(wx.getStorageSync('mylbs'));
      //判断当前所在位置是否在活动范围内
      if (mylbs && utils.isStoreRankArea(mylbs.province)) {
        that.setData({
          activitySZ: true
        })
      } else {
        utils.isHide().then(data => {
          that.setData({
            activitySZ: data.act_time.show,
            phaseIII: data.show
          })
        })

      }
    });
    let cosAddress = auth.getCosAddress();
    if (cosAddress) {
      let redbull = cosAddress.A9.value;
      let popImg = [];
      popImg[0] = redbull[Math.floor((Math.random() * redbull.length))];
      if (switchAd) {
        this.setData({
          adShow: true,
          popImg: popImg
        });
        switchAd = false;
        return
      } else {
        this.setData({
          adShow: false,
        });
        switchAd = true;
      }


    }

  },
  getcountcard: function () {
    return new Promise(function (resolve, reject) {
      http.post("/api/card/getcountcard", false).then(res => {
        if (res.code == 1) {
          phaseIII_count = res.data;
          wx.setStorageSync('phaseIII_count', phaseIII_count);
          resolve(phaseIII_count);
        }
      })

    });
  },
  showAd: function () {
    if (_showAd) {
      return
    };
    _showAd = true;
    // 在适合的场景显示插屏广告
    if (interstitialAd && this.data.blockAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }

  },
  getShopQr: function () {
    var shopid = this.data.storeInfo.id;
    var data = {
      sid: shopid,
      type: 1
    };
    return new Promise(function (resolve, reject) {
      utils.getShopQr(data, 0).then(res => {
        qrcode = res.data.qr;
        token = res.data.token;
        _getShopQr = true;
        resolve()
      })

    })
  },
  onHide: function () {
    // 页面从前台变为后台时执行
    // token = '',
    c_uid = '';
    this.setData({
      adShow: false
    })
  },
  initData: function () {
    var that = this;
    return new Promise(function (resolve, reject) {

      utils.getUserInfoNew().then(data => {
        let userdata = data;
        userIdent = userdata.condition;
        //用户身份0:普通，1：店主，2：店员
        switch (userIdent) {
          case 0:
            that.setData({
              shidy: false,
              noStore: true,
            })
            wx.setNavigationBarTitle({
              title: "人员管理"
            })
            break;
          case 1:
            that.setData({
              shidy: false,
              noStore: false,
            })
            wx.setNavigationBarTitle({
              title: "人员管理"
            })
            break;
          case 2:
          case 3:
            that.setData({
              shidy: true,
              noStore: false,
            })
            wx.setNavigationBarTitle({
              title: "店铺信息"
            })
            break;

          default:
            break;
        }
        that.setData({
          userInfo: userdata,
          pageReady: true,
          blockAd: utils.blockAd()
        });
        resolve();
        wx.hideLoading()
      }).catch(err => {
        console.log("catch:", err);
        wx.hideLoading()
        reject();
      })

    })

  },
  gohome: function () {
    wx.switchTab({
      url: '/pages/tabBar/shouye/index',
    })
  },
  gocreate: function () {
    wx.navigateTo({
      url: "/pages/zhongduan/geren/mendian/renzhen/index"
    })
  },
  share: function () {

    if (!((typeof wx.canIUse === 'function') && wx.canIUse('button.open-type.share'))) {
      wx.showModal({
        title: '当前版本不支持转发按钮',
        content: '请升级至最新版本微信客户端',
        showCancel: false
      })
    }
  },
  onShareAppMessage(res) {
    wx.showLoading({
      title: '正在加载',
    })
    let userInfo = this.data.userInfo || wx.getStorageSync('userdata');
    var name = userInfo.nick_name;
    var shopid = this.data.storeInfo.id;
    if (!token) {
      this.getShopQr();
      wx.showModal({
        title: '温馨提示',
        content: "参数获取异常，请重新转发",
        showCancel: false
      })
      return
    }
    if (this.data.shidy || userIdent != 1) {
      return
    }
    return {
      title: '成为' + name + '的店员',
      imageUrl: '../../../assets/store/shareimg.png',
      path: '/pages/user/register/dy?sid=' + shopid + "&token=" + token,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  async beforeTransferTap(e) {
    try {
      // 判断是否禁止转让店铺
      const inAct = this.selectComponent('#forbiddenTransShop').isForbiddenTransShop();
      if (inAct) return;
      this.transferTap(e);

    } catch (error) {
      console.log("beforeTransferTap:", error);
    }
  },
  //点击转让/移除 判断 dataset  status=1 转让，=2移除店员
  transferTap: function (e) {

    let that = this;
    phaseIII_count = wx.getStorageSync('phaseIII_count');
    let uncard = phaseIII_count.unused;
    //获取被选中店员
    var crew = this.data.crew;
    if (crew.length == 0) {
      wx.showToast({
        title: '您还没有店员',
        icon: 'none',
        duration: 4000
      })
      return false;
    }
    var {
      status
    } = e.currentTarget.dataset;
    console.log("ststus:", status);
    if (status && status == 1) {
      if (phaseIII_count.order_0 > 0 || phaseIII_count.order_1 > 0) {
        wx.showModal({
          title: '温馨提示',
          content: '您有未完成返货订单，无法转让掌柜',
          showCancel: false
        })
        return
      }
      if (uncard > 0) {
        wx.showModal({
          title: '温馨提示',
          content: "您有未使用的返货券，返货券不可转让，是否继续转让？",
          success: function (res) {
            if (res.confirm) {
              //转让掌柜
              that.setData({
                zrPop: true
              });
            }
          }
        })
        return
      }
      wx.showLoading({
        title: '正在加载',
      })

      //转让掌柜
      this.setData({
        zrPop: true
      });
      return
    }
    //移除店员
    if (status == 2) {
      wx.showLoading({
        title: '正在加载',
      })
      this.setData({
        ycPop: true,
      });
      return
    }
    //设置副掌柜
    if (status == 3) {
      this.setData({
        fzgPop: true,
        transferPop: true,
        transfer: 3
      });
      return
    }
  },
  //关闭转让店铺/移除店员弹窗
  closeTransferPop: function () {
    if (this.data.transfer == 1) {} else {}

    this.setData({
      transferPop: false
    });
  },
  //确定转让/移除····transfer 1 转让掌柜  2 移除店员
  changeIdent: function () {
    if (c_uid) {
      //二次弹窗
      this.setData({
        secondPop: true,
        transferPop: false
      });
      return false;

    } else {
      wx.showToast({
        title: '请选择店员',
        icon: 'none',
        duration: 3000
      })
    }

  },
  //checkboxChange 
  radioChange: function (e) {
    var radioItems = this.data.crew,
      values = e.detail.value;
    var uid = '';
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
      if (radioItems[i].value == e.detail.value) {
        uid = radioItems[i].uid;
      }


    }
    c_uid = uid;
    this.setData({
      crew: radioItems,
    });
  },
  //post请求 转让/移除
  postData: function () {
    var that = this;
    //根据transfer判断请求接口  1 转让-/api； 2 移除 
    var transfer = this.data.transfer;
    var data = {
      c_uid: c_uid
    }
    that.setData({
      secondPop: false
    });
    wx.showLoading({
      title: '正在请求',
    })
    if (transfer == 1) {
      http.post('/api/shop/transfer', data).then(res => {
        wx.hideLoading();
        var code = res.code;
        if (code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 3000
          })
          //请求成功初始化数据:用户信息变更先清本地缓存 userdata
          wx.removeStorageSync('userdata');
          utils.getUserInfoNew().then(res => {
            that.initData().then(res => {
              that.getShopInfo().then(res => {
                let crew = that.data.crew;
                if (crew) {
                  crew.forEach((item, index) => {
                    let countTime = setTimeout(() => {
                      var item_loaded = 'crew[' + index + '].loaded';
                      that.setData({
                        [item_loaded]: true
                      })
                      clearTimeout(countTime)
                    }, (index + 1) * 220);
                  });
                }
              })
            });
          })
          return
        } else if (code == 2) {
          //有余额未提现
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            success: (res) => {
              if (res.confirm) {
                //点击确定跳转到提现余额页面
                wx.navigateTo({
                  url: '/pages/zhongduan/geren/yuer/tixian/index',
                })
              }
            }

          })

        } else if (code == 3) {
          //根据data值拆红包
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            success: (re) => {
              if (re.confirm) {
                var result = res.data;
                //根据type:1 旧活动，2 二期红包
                var data = result.qr;
                var param = encodeURIComponent(data);
                //判断data里的type值：1，一期红包，2，二期红包
                if (result.type == 1) {
                  wx.navigateTo({
                    url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
                  })
                  return
                }
                if (hnTypeArr.includes(+result.type)) {
                  wx.redirectTo({
                    url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + result.type,
                  })
                  return
                }
                if (zmTypeArr.includes(+result.type)) {
                  wx.redirectTo({
                    url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + result.type,
                  })
                  return
                }


              }
            }

          })
        } else {
          // wx.showToast({
          //     title: res.msg,
          //     icon: 'none',
          //     duration: 4000
          // })
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            showCancel: false
          })
          // wx.removeStorageSync('userdata');
          that.initData().then(res => {
            that.getShopInfo().then(res => {
              let crew = that.data.crew;
              if (crew) {
                crew.forEach((item, index) => {
                  let countTime = setTimeout(() => {
                    var item_loaded = 'crew[' + index + '].loaded';
                    that.setData({
                      [item_loaded]: true
                    })
                    clearTimeout(countTime)
                  }, (index + 1) * 220);
                });
              }
            })
          });
          return
        }
      })

      return
    }
    if (transfer == 2) {
      http.post('/api/shop/remove', data, false).then(res => {
        wx.hideLoading();
        if (res.code == 1) {
          //移除成功后 初始化页面数据
          that.initData().then(res => {
            that.getShopInfo().then(res => {
              let crew = that.data.crew;
              if (crew) {
                crew.forEach((item, index) => {
                  let countTime = setTimeout(() => {
                    var item_loaded = 'crew[' + index + '].loaded';
                    that.setData({
                      [item_loaded]: true
                    })
                    clearTimeout(countTime)
                  }, (index + 1) * 220);

                });
              }
            })
          });
        } else {
          wx.showModal({
            title: '温馨提示',
            content: res.msg,
            showCancel: false
          })
        }
      })
      return
    }
    if (transfer == 3) {
      http.post('/api/shop/setDeputy', data, false).then(res => {
        wx.hideLoading();
        if (res.code == 1) {
          //移除成功后 初始化页面数据
          that.initData().then(res => {
            that.getShopInfo().then(res => {
              let crew = that.data.crew;
              if (crew) {
                crew.forEach((item, index) => {
                  let countTime = setTimeout(() => {
                    var item_loaded = 'crew[' + index + '].loaded';
                    that.setData({
                      [item_loaded]: true
                    })
                    clearTimeout(countTime)
                  }, (index + 1) * 220);

                });
              }
            })
          });
          return
        }
        let crew = that.data.crew;
        crew.forEach(item => {
          item.checked = false
        })
        that.setData({
          crew
        })
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })

      })
      return
    }
  },
  //关闭二次确认弹窗
  closeSecondPop: function () {
    this.setData({
      secondPop: false
    });
  },
  previewImg: function (e) {
    var url = e.currentTarget.dataset.img;
    var imgList = new Array();
    imgList[0] = url;
    //图片预览
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //退出店铺弹窗
  quitShop: function () {
    this.setData({
      tdPop: true
    });

  },
  closequitPop: function () {
    this.setData({
      quitPop: false,
    });
  },
  quitnow: function () {
    var that = this;
    this.setData({
      quitPop: false,
    });
    wx.showLoading({
      title: '正在退出···',
    })
    http.post('/api/shop/quit', false).then(res => {
      console.log('/api/shop/quit res:', res);
      var code = res.code;
      if (code == 1) {
        //请求成功初始化数据:用户信息变更先清本地缓存 userdata
        wx.removeStorageSync('userdata');
        wx.removeStorageSync('phaseIII_count');
        wx.setStorageSync('who', 0);
        that.setData({
          noStore: true,
          pageReady: true,
          boss: '',
          crew: ''
        });
        utils.getUserInfoNew().then(res => {
          that.initData();
        })
        return
      } else if (code == 3) {
        //根据data值拆红包
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          success: (re) => {
            if (re.confirm) {
              var result = res;
              //根据type:1 旧活动，2 二期红包
              var data = result.data.qr;
              var param = encodeURIComponent(data);
              //判断data里的type值：1，一期红包，2，二期红包
              if (result.data.type == 1) {
                wx.navigateTo({
                  url: '/pages/zongduan/saoma/hongbao/index?hbdata=' + param,
                })
                return
              }
              if (hnTypeArr.includes(+result.data.type)) {
                wx.redirectTo({
                  url: '/pages/randomdraw/index/index?hbdata=' + param + '&hbtype=' + result.data.type,
                })
                return
              }
              if (zmTypeArr.includes(+result.data.type)) {
                wx.redirectTo({
                  url: '/pages/warhorse/index/index?hbdata=' + param + '&hbtype=' + result.data.type,
                })
                return
              }


            }
          }

        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 4000
        })
        wx.removeStorageSync('userdata');
        that.initData();
        return
      }
    })

  },
  close: function () {
    this.setData({
      tdPop: false,
      storeRankingPop: false
    });
  },
  wtachAd: function () {
    wx.showLoading({
      title: '正在加载',
    })
    if (videoAd) {
      videoAd.show().then(() => {
        wx.hideLoading({
          complete: (res) => {},
        })
      }).catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show().then(() => {
            wx.hideLoading({
              complete: (res) => {},
            })
          }))
          .catch(err => {
            wx.hideLoading({
              complete: (res) => {},
            })
          })
      })

    }
  },
  closeZrPop: function () {
    this.setData({
      zrPop: false
    });
  },
  wtachAdZrPop: function () {
    wx.showLoading({
      title: '正在加载',
    })
    if (videoAd) {
      videoAd.show().then(() => {
        wx.hideLoading({
          complete: (res) => {},
        })
      }).catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show().then(() => {
            wx.hideLoading({
              complete: (res) => {},
            })
          }))
          .catch(err => {
            wx.hideLoading({
              complete: (res) => {},
            })
          })
      })

    }
  },
  closeYcPop: function () {
    this.setData({
      ycPop: false
    });
  },
  wtachAdYcPop: function () {
    wx.showLoading({
      title: '正在加载',
    })
    if (videoAd) {
      videoAd.show().then(() => {
        wx.hideLoading({
          complete: (res) => {},
        })
      }).catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show().then(() => {
            wx.hideLoading({
              complete: (res) => {},
            })
          }))
          .catch(err => {
            wx.hideLoading({
              complete: (res) => {},
            })
          })
      })

    }
  },
  imgLoaded: function () {
    wx.hideLoading({
      complete: (res) => {},
    })
  },
  onTabItemTap() {
    let that = this;
    switch (userIdent) {
      case 0:
        that.setData({
          shidy: false,
          noStore: true,
        })
        wx.setNavigationBarTitle({
          title: "人员管理"
        })


        break;
      case 1:
        that.setData({
          shidy: false,
          noStore: false,
        })
        wx.setNavigationBarTitle({
          title: "人员管理"
        })

        break;
      case 2:
        that.setData({
          shidy: true,
          noStore: false,
        })
        wx.setNavigationBarTitle({
          title: "店铺信息"
        })

        break;

      default:
        break;
    }
  },
  getShopInfo: function () {
    let that = this;
    return new Promise(function (resolve, reject) {
      //查询店铺信息
      utils.getShopInfo(false).then(res => {
        console.log("getShopInfo:", res);
        res.address = utils.storeAddress(res);
        //查询到店铺信息，店员获取的是店主信息，根据uid判断
        if (res.member) {
          var member = res.member;
          member.sort((a, b) => {
            return b.condition - a.condition
          })
          var crew = new Array();
          var boss = new Array();
          //循环根据condition获取店员信息
          for (var i = 0, len = member.length; i < len; i++) {
            if (member[i]['condition'] > 1) {
              //店员信息
              member[i]['checked'] = false;
              member[i]['loaded'] = false;
              member[i]['value'] = i;
              // for(let i=0;i<20;i++){
              // }
              crew.push(member[i]);
            } else if (member[i]['condition'] == 1) {
              //掌柜的信息
              boss.push(member[i]);
            }
          }
          let deputy = member.filter(item => {
            return item.condition == 3
          })

          let staff = member.filter(item => {
            return item.condition == 2
          })
          let hasStaff = staff.length > 0 ? true : false;
          console.log("副掌柜：", deputy, staff);
          that.setData({
            storeInfo: res,
            member: res.member,
            pageReady: true,
            crew: crew,
            noStore: false,
            boss: boss,
            deputy,
            hasStaff
          });

        }
        if (userIdent == 1) {
          that.getShopQr();
        }
        wx.setStorageSync('storeInfo', res)
        if (res.alias_id) {
          that.setData({
            isBindPaperCode: true
          })
        } else {
          that.setData({
            isBindPaperCode: false
          })
        }
        resolve(res)
      }).catch(err => {
        console.error("err:", err)
        //没有店铺信息弹窗提示创建店铺
        that.setData({
          noStore: true,
          pageReady: true,
          boss: '',
          crew: ''
        });
        resolve();
      })

    })
  },
  inviteCrew: function (e) {
    let url = e.currentTarget.dataset.url;
    if (this.data.shidy || userIdent != 1) return;
    wx.navigateTo({
      url: url,
    })
  },
  onUnload: function () {
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
  }
})