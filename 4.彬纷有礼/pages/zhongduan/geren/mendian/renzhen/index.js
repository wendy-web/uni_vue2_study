//index.js
//获取应用实例
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const url = app.globalData.API_BASE_URL + '/api/tools/imgupload';
var utils = require('../../../../../utils/util.js');
var http = require('../../../../../utils/api.js');
var getUserLocation = require('../../../../../utils/location');
var log = require('../../../../../utils/log');
// 在页面中定义激励视频广告
let videoAd = null;
let longitude = ''; //经度信息
let latitude = ''; //纬度
let hided = false; //隐藏参数
let textAreaBlur = false;
let shopDatas = '';
let noShopInfo = false; //无店铺信息
let _request = false;

import {
  mnmobile
} from '../../../../../api/config'
Page({
  data: {
    title: '店铺信息',
    userInfo: '',
    signs_url: '',
    bgimg: COS_URL + '/public/img/Tian/rocket.png',
    dy: COS_URL + '/public/img/bfyl/assets/store/my/dy.png',
    zg: COS_URL + '/public/img/bfyl/assets/store/my/zg.png',
    createPop: false,
    changePop: false, //修改店铺信息成功弹窗
    area: '', //省市区
    address: '', //门店详细地址
    uid: '', //需要修改用户昵称的id
    changeNamePop: false, //弹窗输入框
    crew: '', //店员信息
    boss: '', //店长信息
    xgPop: false,
    xgPopUrl: COS_URL + '/public/img/Tian/202101/xgPop.png',
    xgPopBtl: COS_URL + '/images/Pops/xgPopBtl.png',
    xgPopBtr: COS_URL + '/images/Pops/xgPopBtr.png',
    shopQR_head: COS_URL + '/public/img/storeRank/202106/add_crew.png',
    shopQR_pop: COS_URL + '/public/img/shop/shopQR_pop202101.png',
    shopInfo: {},
    btnDisable: true,
    shopQrPop: false,
    deleteUrl: '../../../../../assets/tabs/delete.png',
    iconClose: COS_URL + '/public/img/storeRank/202106/icon_close.png',
    locimg: COS_URL + '/public/img/bfyl/assets/store/md/locs.png',
    supportGetPhoneCode: utils.compareVersion(app.globalData.systemInfo.SDKVersion, '2.21.2') >= 0, // getPhoneNumber 是否支持返回code 参数
  },

  onLoad: function (options) {
    console.log("onLoad options :", options);
    if (options.hide) {
      hided = false;
    }
    //获取店铺信息
    var that = this;

    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-0af81094a15bde65',
        multiton: true, // 多例模式
      })
      videoAd.onLoad((res) => {
        console.log("激励广告onLoad······：", res);
      })
      videoAd.onError((err) => {
        if (!this.data.xgPop) return;
        this.setData({
          xgPop: false
        });
        if (err.errCode == '1002' || err.errCode == '1004' || err.errCode == '1005' || err.errCode == '1006' || err.errCode == '1007' || err.errCode == '1008') {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showModal({
            title: '温馨提示',
            content: '广告展示异常已为您跳过',
            showCancel: false,
            success(res) {
              var data = that.data.postData;
              if (!data) return;
              wx.showLoading({
                title: '正在加载',
              })
              if (!data.longitude || !data.latitude) {
                getUserLocation.getUserLocation().then(res => {
                  latitude = res.data.latitude;
                  longitude = res.data.longitude;
                  that.postData(data);
                })
                return
              }
              that.postData(data);
            }
          })
        } else {
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("广告加载失败：", err);
          //其它错误情况记录实时日志
          log.addFilterMsg('AdError');
          log.info(err.errCode, ":", err.errMsg);
        }
      })
      videoAd.onClose((res) => {
        console.log("广告关闭：", res);
        this.setData({
          xgPop: false
        });
        if (res && res.isEnded) {
          var data = this.data.postData;
          wx.showLoading({
            title: '正在加载',
          })
          if (!data.longitude || !data.latitude) {
            getUserLocation.getUserLocation().then(res => {
              latitude = res.data.latitude;
              longitude = res.data.longitude;
              that.postData(data);
            })
            return
          }
          this.postData(data);
        }
      })
    }
    let phaseIIIShow = wx.getStorageSync('phaseIII') ? true : false;
    this.setData({
      phaseIIIShow: phaseIIIShow
    });
    let navBarSystem = app.globalData.navBarSystem && JSON.parse(app.globalData.navBarSystem);
    if (navBarSystem) {
      this.setData({
        navBarSystem
      })
    }

  },
  async onShow() {
    try {
      var userdata = await utils.getUserInfoNew();
      this.setData({
        userInfo: userdata
      })

      //无经纬度的时候静默获取用户当前定位：（店铺信息有经纬度的时候会覆盖导致解析地址和地图选点不一致，另外地图选点和拍照都会触发page onShow事件）
      if (!latitude || !longitude) {
        let {
          data
        } = await getUserLocation.getUserLocation();
        longitude = data.longitude;
        latitude = data.latitude;
      }
      // 初始化店铺信息
      this.initData();
    } catch (error) {
      console.log("onShow catch:", error)
      // 初始化店铺信息
      this.initData();
      // 如果是未授权的情况
      // let {
      //   errno = ''
      // } = error;
      // if (errno && errno == 104) {
      //   // 初始化店铺信息
      //   this.initData();
      // }
    }

  },
  onHide: function () {
    hided = true;
    this.setData({
      createPop: false,
      changePop: false,
      changeNamePop: false
    })
  },
  async initData() {
    if (hided) return;
    hided = false;
    var that = this;
    try {
      let {
        code,
        data: _shop_info
      } = await http.post('/api/shop/getInfo', false);
      if (+code == 1) {
        console.log("_shop_info:", _shop_info)
        noShopInfo = false;
        var getShopInfo = _shop_info;
        //深度拷贝
        var shopData = JSON.parse(JSON.stringify(getShopInfo));
        shopDatas = JSON.parse(JSON.stringify(shopData));
        var boss = '';
        var crew = new Array();
        var member = _shop_info.member;
        var reg = /^(\d{3})\d*(\d{4})$/;
        for (var i = 0, len = member.length; i < len; ++i) {
          if(member[i]['mobile']){
            member[i]['phoneStr'] = member[i]['mobile'].replace(reg,'$1****$2');
          }
          if (member[i]['condition'] == 1) {
            boss = member[i];
          } else {
            member[i].loaded = false;
            crew.push(member[i]);
          }
        }
        let area = '';
        let _oldArea = '';
        // 直辖市ip解析后省市可能一样
        if (shopData.l_province == shopData.l_city) {
          area = shopData.l_city
        } else {
          area = shopData.l_province + shopData.l_city;
          _oldArea = shopData.l_province + shopData.l_city;
        }
        //拼接省市区地址

        if (shopData.l_district) {
          area += shopData.l_district;
          _oldArea += shopData.l_district;
        }
        if (shopData.l_town) {
          area += shopData.l_town;
        }
        // 2023年5月15日 去掉l_street
        // if (shopData.l_street) {
        //   area += shopData.l_street;
        // }
        // 2023年5月12日 无经纬度不清空地图选点，默认获取用户当前经纬度地址
        // if (!shopData.l_latitude || !shopData.l_longitude) {
        //   area = '';
        // }
        let _oldAddress = JSON.parse(JSON.stringify(shopData.address));
        let _index = _oldAddress.lastIndexOf(_oldArea);
        shopData.address = _index > -1 ? _oldAddress.substring(_oldArea.length) : _oldAddress;


        longitude = shopData.l_longitude;
        latitude = shopData.l_latitude;
        let locationCache = wx.getStorageSync('getUserLocation');
        locationCache = locationCache && JSON.parse(locationCache);
        if (!longitude && locationCache) {
          longitude = locationCache.data.longitude;
        }
        if (!latitude && locationCache) {
          latitude = locationCache.data.latitude;
        }
        let shopInfo = {};
        shopInfo.shop_name = shopData.shop_name;
        shopInfo.contact = shopData.contact;
        shopInfo.address = shopData.address;
        shopInfo.area = area;
        shopInfo.signs_url = shopData.signs_url;
        shopInfo.latitude = shopData.l_latitude;
        shopInfo.longitude = shopData.l_longitude;
        //给店员头像加loaded状态
        crew.forEach((item, index) => {
          let countTime = setTimeout(() => {
            let items = 'crew[' + index + ']';
            item.loaded = true;
            this.setData({
              [items]: item
            })
          }, (index + 1) * 200);
        })
        that.setData({
          shopInfo: shopInfo,
          signs_url: shopData.signs_url,
          area: area,
          address: shopInfo.address,
          crew: crew,
          boss: boss,
          member: member,

        })
        let date = new Date();
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        let today = year + "-" + month + "-" + day;
        let notToday = wx.getStorageSync('notToday_shop') ? wx.getStorageSync('notToday_shop') : 0;
        if (today !== notToday) {
          that.setData({
            notToday: true
          })
        } else {
          that.setData({
            notToday: false
          })
        }
        wx.setStorageSync('notToday_shop', today);
        if (!that.data.createPop && !that.data.changePop) {
          that.setData({
            shopQrPop: true
          });
        }
        return
      }
      // 以下是无店铺数据的情况
      let shopInfo = {};
      shopInfo.shop_name = "";
      shopInfo.area = "";
      shopInfo.contact = "";
      shopInfo.address = "";
      shopInfo.signs_url = "";
      that.setData({
        shopInfo: shopInfo
      });
      noShopInfo = true; //无店铺信息
      // 无店铺信息的根据经纬度解析门店地址
      if (longitude && latitude) {
        let {
          code,
          data: locationInfo
        } = await http.post('/api/tools/getlbs', {
          longitude,
          latitude
        })
        if (+code == 1) {
          shopInfo.address = "";
          shopInfo.area = locationInfo.province + locationInfo.city;
          if (locationInfo.district) shopInfo.area += locationInfo.district;
          if (locationInfo.town) shopInfo.area += locationInfo.town;
          that.setData({
            address: "",
            area: shopInfo.area,
            shopInfo: shopInfo,
            btnDisable: false
          });
        }
      }

    } catch (error) {
      console.log("initData:", error);
      log.addFilterMsg("shopInfoInitErr");
      log.info("initDataErr:", error)
    }

  },
  //选择/上传图片
  chooseImg: function () {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.chooseMedia({
      count: 1, //限制选择图片数量
      mediaType: ['image'],
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log('上传返回：', res);
        if (res.tempFiles[0]['size'] > 8388608) {
          wx.showToast({
            title: '请上传低于8M的图片',
            icon: 'none',
            duration: 4000
          })
          return false;
        }
        wx.showLoading({
          title: '正在上传',
        })
        wx.uploadFile({
          filePath: res.tempFiles[0]['tempFilePath'],
          name: 'img',
          url: url,
          header: {
            Authorization: token,
          },
          success(res) {
            wx.hideLoading();
            var result = JSON.parse(res.data);
            if (result.code == 1) {
              if (!that.data.shopInfo.signs_url) {
                log.addFilterMsg("chooseImage");
                log.info("chooseImage 回调 shopInfo.sgins_url:", that.data.shopInfo);

              }
              that.data.shopInfo.signs_url = result.data;
              that.setData({
                signs_url: result.data,
                btnDisable: false
              });
            } else {
              wx.showToast({
                title: result.msg,
                icon: 'none',
                duration: 2000
              })
            }

          },
          fail(res) {
            console.log('上传失败返回：', res);
            var str = JSON.stringify(res);
            wx.showModal({
              title: '上传失败返回',
              content: str + '\n url:' + url
            })

          }
        })

      },
      fail: function (res) {

        console.log("chooseImage fail:", res);
        // 2023年8月29日判断用户是否授权隐私
        let {
          errno = ''
        } = res;
        if (errno && errno == 104) return;
        if (res.errMsg == "chooseMedia:fail cancel") return;
        if (res.errMsg.indexOf("cancel") > -1) return;
        let msg = JSON.stringify(res);
        wx.showModal({
          titile: '微信系统异常提示',
          content: msg,
          showCancel: false,
          success: (res) => {
            console.log("showModal success :", res);
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index',
              })
            }
          }
        })
      }
    })
  },
  //跳转添加店员页面
  addCrew: function (e) {
    console.log('跳转到添加店员页面');
    var url = "/pages/tabBar/dianyuan/add";
    utils.getUserInfoNew().then(res => {
      wx.navigateTo({
        url: url,
      })
    })
  },
  //提交表单数据
  async formSubmit(e) {
    try {
      console.log("form data:", e);
      let {userInfo} = this.data;
      // 先判断有没有绑定手机号，创建店铺必须先绑定手机号
      if(!userInfo.mobile){
        this.selectComponent('#bindPhonePop').showBindPhonePop();
        return
      }
      //判断用户是否已报名并且活动未结束
      if (!noShopInfo) {
        // 判断是否禁止转让店铺
        const inAct = this.selectComponent('#forbiddenTransShop').isForbiddenTransShop({
          tips: '暂不可修改店铺信息'
        });
        if (inAct) return;
      }
      textAreaBlur = true;
      var that = this;
      var formData = e.detail.value;
      let {
        area
      } = this.data.shopInfo;
      if (!formData.shop_name) {
        wx.showToast({
          title: '请输入店铺名称',
          icon: 'none',
        })
        return
      }
      if (!formData.contact) {
        wx.showToast({
          title: '请输入联系人',
          icon: 'none',
        })
        return
      }
      if (!area) {
        wx.showToast({
          title: '请选择门店地址',
          icon: 'none',
        })
        return
      }
      if (!formData.address) {
        wx.showToast({
          title: '请输入详细地址',
          icon: 'none',
        })
        return
      }
      if (!this.data.signs_url) {
        wx.showToast({
          title: '请上传门店店招',
          icon: 'none',
        })
        return
      }

      // 判断无经纬度，获取授权
      if (!latitude || !longitude) {
        let {
          data
        } = await getUserLocation.getUserLocation(true);
        longitude = data.longitude;
        latitude = data.latitude;
        return
      }
      //提交数据创建店铺
      var data = {
        shop_name: formData.shop_name,
        contact: formData.contact,
        // address: formData.address + formData.address_detail,
        // address: formData.address_detail, //2021年9月2日 统一数据格式
        address: formData.address, //2021年9月2日 统一数据格式
        signs_url: that.data.signs_url,
        latitude: latitude,
        longitude: longitude
      }
      that.setData({
        postData: data
      });
      console.log("提交数据：", data);
      that.submitData(data);
    } catch (error) {
      console.log("formSubmit catch:", error)
      if (error && error.errMsg == "getLocation:fail auth deny") {
        this.checkLocationAuth()
      }
    }
  },

  //关闭页面弹窗
  closePop: function (event) {
    console.log('closePop：', event)
    var param = event.currentTarget.dataset.param;
    // parm =1 关闭店铺创建成功弹窗， =2 关闭修改资料弹窗 =3 关闭修改昵称
    if (param == 1) {
      this.setData({
        createPop: false,
      })
    } else if (param == 2) {
      this.setData({
        changePop: false,
      })
    } else if (param == 3) {
      this.setData({
        changeNamePop: false
      })
    } else if (param == 4) {
      this.setData({
        shopQrPop: false
      })
    }
  },
  submitData: function (data) {
    var that = this;
    if (this.data.btnDisable) {
      return
    }
    if (shopDatas && shopDatas.status == 1) {
      wx.showLoading({
        title: '正在加载',
      })
      that.postData(data);
      return;

    } else {

      wx.showModal({
        title: '认证提示',
        content: '确定提交吗？',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在提交',
              // mask: true
            })
            wx.reportAnalytics('user_create_shop', {
              create_shop: '用户创建店铺',
            });
            // 重复判断注释掉
            // if (!data.longitude || !data.latitude) {
            //   getUserLocation.getUserLocation().then(res => {
            //     latitude = res.data.latitude;
            //     longitude = res.data.longitude;
            //     that.postData(data);
            //   })
            //   return
            // }
            that.postData(data);
          }
        }
      })

    }
  },
  onChooseLocation() {
    var that = this;
    var shopInfo = this.data.shopInfo;
    wx.chooseLocation({
      success: (res) => {
        console.log("地图选点成功返回：", res);

        latitude = res.latitude;
        longitude = res.longitude;
        // if (!res.address || !res.name || res.address.search("省") == -1 || res.address.search("市") == -1) {
        if (!res.address || !res.name || res.address.search("市") == -1) {
          wx.showLoading({
            title: '正在加载',
          })
          //记录实时日志
          log.addFilterMsg('chooseLocation');
          log.info('success res:', res);
          var param = {
            longitude: res.longitude,
            latitude: res.latitude,
          }
          utils.getlbs(param).then(data => {
            wx.hideLoading();
            let locationInfo = data;

            shopInfo.address = locationInfo.recommend;
            shopInfo.area = locationInfo.province + locationInfo.city;
            if (locationInfo.district) {
              shopInfo.area += locationInfo.district;
            } else {
              shopInfo.area += locationInfo.town;
            }
            that.setData({
              address: locationInfo.recommend,
              area: shopInfo.area,
              shopInfo: shopInfo,
              btnDisable: false
            });
          }).catch(err => {
            wx.hideLoading();
            console.log("门店信息经纬度解析 catch：", err);
            log.setFilterMsg('getlbsErr');
            log.info(err);
            wx.showModal({
              title: '温馨提示',
              content: err.msg,
              showCancel: false
            })
          })

          return
        }
        shopInfo.area = res.address;
        shopInfo.address = res.name;
        that.setData({
          address: res.name,
          area: res.address,
          shopInfo: shopInfo,
          btnDisable: false
        });

      },
      fail: (res) => {
        console.log("地图选点失败：", res);
        //记录实时日志
        log.addFilterMsg('chooseLocation');
        log.error(' chooseLocation fail res:', res);
        // 用户未授权隐私判断
        let {
          errno = ''
        } = res;
        if (errno && errno == 104) return;
        utils.getSetting().then(result => {
          log.error(' chooseLocation fail wxgetSetting:', result);
          if (!result.authSetting["scope.userLocation"]) {
            wx.showModal({
              title: '定位授权',
              content: '请允许获取定位权限以打开腾讯地图',
              showCancel: false,
              success(_res) {
                if (_res.confirm) {
                  // 更新店铺信息
                  that.initData()
                  wx.openSetting({
                    success(_result) {
                      if (_result.authSetting["scope.userLocation"]) {
                        wx.chooseLocation({
                          success: (choose_result) => {
                            console.log("choose_result:", choose_result);
                            latitude = choose_result.latitude;
                            longitude = choose_result.longitude;
                            that.data.shopInfo.address = choose_result.name;
                            that.data.shopInfo.area = choose_result.address;
                            that.setData({
                              address: choose_result.name,
                              area: choose_result.address,
                              shopInfo: that.data.shopInfo
                            });
                          },
                        })
                      }

                    }
                  })
                }

              }
            })
          }
        }).catch(err => {
          // 用户未授权隐私判断
          let {
            errno = ''
          } = err;
          if (errno && errno == 104) {

            return
          };
          let msg = JSON.stringify(err);
          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false
          })
        });
        // 2023年5月15日 如果有店铺信息，经纬度取当前定位
        if (!noShopInfo) {
          console.log("有店铺信息····获取当前经纬度")
          getUserLocation.getUserLocation().then(res => {
            latitude = res.data.latitude;
            longitude = res.data.longitude;

            utils.getlbs({
              longitude,
              latitude
            }).then(locationInfo => {
              shopInfo.address = '';
              shopInfo.area = locationInfo.province + locationInfo.city;
              if (locationInfo.district) shopInfo.area += locationInfo.district;
              if (locationInfo.town) shopInfo.area += locationInfo.town;
              that.setData({
                address: "",
                area: shopInfo.area,
                shopInfo: shopInfo,
                btnDisable: false
              });
            })
          })
        }
      }
    });
  },
  //打开修改昵称弹窗
  openChangeName: function (e) {
    var uid = e.currentTarget.dataset.uid;
    this.setData({
      uid: uid,
      changeNamePop: true
    })
    console.log("用户id:", uid);
  },
  //修改昵称
  changeName: function (e) {
    var that = this;
    var uid = e.currentTarget.dataset.uid;
    var shop_note = this.data.shop_note;
    if (!shop_note) {
      wx.showToast({
        title: '请先输入昵称',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var data = {
      c_uid: uid,
      shop_note: shop_note
    }
    console.log("请求参数：", data);
    http.postBase({
      url: '/api/shop/modifynote',
      params: data
    }).then(res => {
      console.log("修改昵称返回数据：", res);
      that.setData({
        changeNamePop: false
      });
      const {
        code,
        msg
      } = res;
      if (code == 1) {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
        wx.removeStorageSync('userdata');
        that.setData({
          shop_note: '',
        });
        //请求店铺信息
        that.initData();
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  //获取昵称value
  bindInput: function (e) {
    // console.log("input tap:",e);
    var value = e.detail.value;
    this.setData({
      shop_note: value
    })
  },
  //跳转更换手机号页面：geren/bangding/mobile
  changePhone: function () {
    wx.navigateTo({
      url: '/pages/zhongduan/geren/bangding/mobile',
    })
  },
  //提交数据
  postData: function (data) {
    var data = data;
    var that = this;
    log.addFilterMsg("postShopInfo");
    log.info("店铺资料传参：", data);
    //提交数据
    //promise请求接口
    http.post('/api/shop/create', data).then(res => {
      textAreaBlur = false;
      if (res.code == 1) {
        //用户信息变更，清除缓存
        wx.removeStorageSync('userdata');
        //身份变更
        wx.setStorageSync('who', 1);
        //返回data说第一次创建，其它直接返回msg:修改成功
        if (res.data) {
          that.setData({
            createPop: true,
            rank: res.data.rank,
            credits: res.data.credits,
            btnDisable: true
          })
          that.initData();
          utils.getUserInfoNew();
        } else {
          if (that.data.crew.length >= 2) {
            wx.showToast({
              title: '店铺资料修改成功',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              btnDisable: true
            });
          } else {
            that.setData({
              changePop: true,
              changeMsg: res.msg,
              btnDisable: true
            })
          }
        }
        return
      }
      if (res.code == 5) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/user/register/index',
              })
            }
          }
        })
        return
      }
      if (res.msg) {
        wx.showModal({
          title: '温馨提示',
          content: res.msg,
          showCancel: false
        })
      }

    }).catch(err => {
      console.log("/api/shop/create err", err);
    });
  },
  close: function () {
    this.setData({
      xgPop: false
    });
  },
  wtachAd: function () {
    wx.showLoading({
      title: '正在加载',
    })
    // 用户触发广告后，显示激励视频广告
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
  inputChange: function (e) {
    var shopInfo = this.data.shopInfo;
    // console.log("inputChange 改变前:", this.data.shopInfo);
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    if (!shopInfo[name]) {
      log.addFilterMsg("InputChange");
      log.info("InputChange shopInfo:", shopInfo);
    }
    shopInfo[name] = value;
    this.setData({
      shopInfo: shopInfo,
      btnDisable: false
    });

    // console.log("inputChange 改变后:", this.data.shopInfo);

  },
  bindTextAreaInput: function (e) {
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    // if (this.data.shopInfo[name]) {
    //   log.addFilterMsg("bindTextAreaInput");
    //   log.info("InputChange shopInfo:", this.data.shopInfo);
    // }
    // this.data.shopInfo[name] = value;
    let {
      shopInfo
    } = this.data;
    if (shopInfo[name]) {
      log.addFilterMsg("bindTextAreaInput");
      log.info("InputChange shopInfo:", this.data.shopInfo);
    }
    shopInfo[name] = value;
    this.setData({
      btnDisable: false,
      shopInfo
    })


  },

  // 自定义导航栏 返回监听
  onBeforeBack: function () {
    // console.log('shopInfo:', this.data.shopInfo);

    if (!this.data.btnDisable) {
      wx.showModal({
        title: '提示',
        content: '是否放弃提交店铺信息',
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({
              complete: (res) => {},
            })
          }
        }
      })

    } else {
      wx.navigateBack({
        complete: (res) => {},
      })
    }

  },
  openShopQR: function (e) {
    this.setData({
      shopQrPop: false
    });
    let url = "/pages/zhongduan/geren/mendian/qrcode";
    wx.navigateTo({
      url: url,
    })

  },
  onUnload: function () {
    hided = false;
    longitude = "";
    latitude = "";
    if (videoAd) {
      videoAd.destory();
      videoAd = null;
    }
  },
  //定位获取不到时，检查授权情况
  checkLocationAuth: function () {
    wx.getSystemInfo({
      success: (result) => {
        if (!result.locationEnabled || !result.locationAuthorized) {
          wx.showModal({
            title: '温馨提示',
            content: '请您确保手机已打开系统定位且已授权微信获取定位权限.',
            showCancel: false
          })
          return false;
        } else {
          utils.getSetting().then(getSetting => {
            if (typeof (getSetting.authSetting["scope.userLocation"]) != 'undefined' && !getSetting.authSetting["scope.userLocation"]) {
              wx.showModal({
                title: '定位授权',
                content: '请允许小程序获取定位权限后再操作',
                success: (showModal) => {
                  if (showModal.confirm) {
                    wx.openSetting({
                      success: (openSetting) => {
                        // if (openSetting.authSetting["scope.userLocation"]) {
                        //   getUserLocation.getUserLocation(true).then(_res => {
                        //     let {data} = _res;
                        //     longitude = data.longitude;
                        //     latitude = data.latitude;
                        //     utils.setCache('u_location', _res.data, 600);
                        //   }).catch(err => {
                        //     let str = JSON.stringify(err);
                        //     log.addFilterMsg("locationFailed");
                        //     log.error("locationFailed", str);
                        //     wx.showModal({
                        //       title: '温馨提示',
                        //       content: "定位失败\n请用选择门店地址;",
                        //       showCancel: false,
                        //       success: function (_result) {}
                        //     })

                        //   })

                        // }

                      }
                    })
                  }
                }
              })
            } else {
              getUserLocation.getUserLocation().then(_res => {
                let {
                  data
                } = _res;
                longitude = data.longitude;
                latitude = data.latitude;
                utils.setCache('u_location', _res.data, 600);

              }).catch(_resErr => {
                wx.showModal({
                  title: '温馨提示',
                  content: "定位失败\n请用选择门店地址;",
                  showCancel: false,
                  success: function (_result) {}
                })

              })
            }
          }).catch(err => {});
        }
      },
      fail: (error) => {
        log.addFilterMsg('getsystemInfo');
        log.info("fail:", error);
      }
    })
  },
  // 手机号绑定成功
  async bindPhoneSuccess(){
    try {
      let userInfo = await utils.getUserInfoNew();
      console.log("bindPhoneSuccess 更新用户信息：",userInfo);
      this.setData({
        userInfo
      })
    } catch (error) {
      console.log("bindPhoneSuccess catch:",error)
    }
  },
  //调用微信绑定的手机号
  async getPhoneNumber(e) {
    console.log("获取手机号：", e.detail);
    let {
      iv,
      encryptedData,
      code = ''
    } = e.detail;
    try {

      // 低版本基础库（<=2.20.2）没有code
      if (code || (iv && encryptedData)) {
        wx.showLoading({
          title: '加载中···',
        })

        let params = {
          encryptedData,
          iv,
          code
        };
        if (_request) return wx.hideLoading();
        _request = true;
        log.addFilterMsg("api_user_mnmobile");
        log.info("api_user_mnmobile传参：", params);
        mnmobile(params).then(res => {
          log.info("绑定结果：", res);
          wx.hideLoading()
          _request = false;
          let {
            code,
            msg
          } = res;
          if (+code == 1) {
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
            
            this.bindPhoneSuccess()
            return
          } else {
            wx.showModal({
              title: '温馨提示',
              content: msg,
              showCancel: false
            })
          }
        }).catch(err => {
          log.info("api_user_mnmobile err:", err)
          wx.hideLoading()
          _request = false;
        })
      } else {
        _request = false;
        console.log(e.detail);
        let {
          errMsg = '',
            errno = ''
        } = e.detail;
        log.addFilterMsg("getPhoneNumberFailed");
        log.info("未获取到手机号:", e.detail);
        if (errno && errno == 104) return;
        const regex = /user deny|user cancel/;
        if (errMsg && !regex.test(errMsg)) {
          wx.showModal({
            title: '温馨提示',
            content: errMsg,
            showCancel: false
          })
          return
        }

      }
    } catch (err) {
      console.log("catch:", err)
      log.addFilterMsg("getPhoneNumberCatch");
      log.info("解析手机号catch:", err)
      if (err.msg) {
        wx.showModal({
          title: '温馨提示',
          content: err.msg,
          showCancel: false
        })
      }
    } finally {
      _request = false;
    }
  },

})