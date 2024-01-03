// pages/phaseIII/useCoupon/confirm/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
import utils from '../../../../utils/util';
import {
  getDealerList
} from '../../../../api/coupon/index';
import {
  getDistanceFromLatLonInKm
} from '../../voucher/utils';
let is_requesting = false;// 是否正在请求数据（防止重复请求）
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconTheme: 'black', //顶部导航栏图标默认白色
    couponInfo: null, //上个页面传参过来的卡券信息
    shopInfo: null, // 店铺信息
    dealerInfo: null, //配送商信息
    dealerList: [], //配送商列表
    shopInfoCollapse: true, //店铺信息折叠 默认true折叠，false 展开
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    skuArgArr: [], //选中的sku参数
    total_apply_num: 0, //总共申请返货数量，默认全部，用来判断按钮是否置灰
    noteInfo: '', //订单备注信息
    dealerPopShow:false , // 配送商选择弹窗防止滚动穿透
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initOptions(options);
  },
  initOptions(options) {
    let couponInfo = options.couponInfo;
    if (couponInfo) {
      couponInfo = JSON.parse(decodeURIComponent(couponInfo))
      let {
        skuArgArr
      } = this.data;
      // 计算总共选了多少券数
      let total_apply_num = 0;
      couponInfo.sku_list.forEach(item => {
        let obj = {...item};
        total_apply_num += item.unused;
        skuArgArr.push(obj);
        item.show_pic = false;
        if (item.sku_name.search('红牛原味') > -1) {
          item.show_pic = true;
        }
        // 申请返货结果 默认null
        item.reqResult = null;
      })
      this.setData({
        couponInfo,
        skuArgArr,
        total_apply_num
      })
      this.initData();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  initData() {
    this.initShopInfo();
  },
  // 初始化店铺信息
  async initShopInfo() {
    try {
      let shopInfo = await utils.getShopInfo();
      if (shopInfo.address) {
        shopInfo.address = utils.storeAddress(shopInfo);

        shopInfo.member.forEach(itm => {
          if (itm.condition == 1) {
            shopInfo.mobile = itm.mobile
            shopInfo.phoneStr = itm.phoneStr
          }
        })
      }
      this.setData({
        shopInfo
      })
      this.initDealerList();
    } catch (error) {
      console.log("确认订单页面 initShopInfo catch:", error);
      // 无店铺信息提示
      if (error.code && error.code == 0) {
        wx.showModal({
          title: '温馨提示',
          content: "您还未创建店铺",
          confirmText: "创建店铺",
          cancelText: "暂不创建",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/zhongduan/geren/mendian/renzhen/index?hide=false',
              })
            }
          }
        })
        return
      }
    }
  },
  // 初始化配送商信息
  async initDealerList(params = {}) {
    let {
      skuArgArr
    } = this.data;
    let firstItem = skuArgArr[0];
    params.sku_arg = firstItem.sku_arg;
    if(is_requesting)return;
    is_requesting = true;
    try {

      let res = await getDealerList(params);
      is_requesting = false;
      // 要先把 上次送货 和 默认的筛选出来，优先展示 上次送货的经销商
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1 && data) {
        console.log("配送商列表：", data)
        var list = data.list || [];
        let {
          dealerList = [],
            shopInfo,
            dealerInfo
        } = this.data;
        // 如果list太长，取100条数据
        if (list.length > 100) {
          list = list.slice(0, 100)
        }
        var reg = /^(\d{3})\d*(\d{4})$/;
        let defaultItem = null; // 设置过默认配送商
        let lastItem = null; // 上次送货的
        let {
          l_latitude,
          l_longitude
        } = shopInfo;

        list.forEach(item => {

          item.phoneStr = item.mobile.replace(reg, '$1****$2');
          if (item.distance) {
            var km = (+item.distance / 1000).toFixed(2);
            item.dist = km;
          } else {
            let latlonInfo = {
              lat1: l_latitude,
              lon1: l_longitude,
              lat2: item.lat,
              lon2: item.lng,
            }
            let km = getDistanceFromLatLonInKm(latlonInfo);
            item.dist = km.toFixed(2);
          }

          if (item.is_def == 1) {
            defaultItem = item;
            item.checked = true;
          } else {
            item.checked = false
          }
          if (item.is_verify == 1) {
            lastItem = item;
          }
        })
        // 默认配送商
        let _dealerInfo = lastItem ? lastItem : defaultItem;
        // 防止在搜索关键词的时候重置点默认的配送商
        if (!dealerInfo) {
          dealerInfo = _dealerInfo
        }
        dealerList = list;
        this.setData({
          dealerList,
          dealerInfo
        })
        return
      }
      if (code == 0 && msg) {
        // wx.showModal({
        //   title: '未获取到配送商',
        //   content: msg,
        //   showCancel: false
        // })
        wx.showToast({
          title: msg,
          icon:'none',
          duration:2000
        })
      }
    } catch (error) {
      is_requesting = false;
      console.log("initDealerList catch:", error);
    }
  },
  // 展开、折叠店铺信息
  collapseChange(event) {
    let {
      shopInfoCollapse
    } = this.data;
    this.setData({
      shopInfoCollapse: !shopInfoCollapse,
    });
  },
  // 步进器变化
  stepperChange(event) {
    let {
      skuarg
    } = event.currentTarget.dataset;
    let {
      skuArgArr
    } = this.data;
    let unused = event.detail;
    // 计算总共选了多少券数
    let total_apply_num = 0;
    skuArgArr.forEach(item => {
      if (item.sku_arg == skuarg) {
        item.unused = unused;
      }
      total_apply_num += item.unused;

    })
    this.setData({
      total_apply_num,
      skuArgArr
    })
  },
  // 备注信息更新
  noteChange(event) {
    this.setData({
      noteInfo: event.detail
    })
  },
  // 显示配送商弹窗
  showSelectDealerPop() {
    this.setData({
      dealerPopShow:true
    });
    this.selectComponent("#selectDealer").show();

  },
  // 选择配送商
  selectDealer(event) {
    console.log("选择的配送商信息：", event);
    let dealerInfo = event.detail;
    this.setData({
      dealerInfo,
      dealerPopShow:false
    })
  },
  // 联系配送商
  mkPhoneCall: function (e) {
    let {
      phone,
      phoneStr
    } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
    console.log("手机号：", phone);
  },
  //筛选配送商列表：选择配送商组件触发 refreshDealerList
  refreshDealerList(event) {
    let {
      keyword
    } = event.detail
    this.initDealerList({
      keyword
    })
  },
  // 设置默认配送商，成功以后重置默认配送商，不刷新列表
  async setDefault(event) {

    try {
      console.log("设置默认传参：", event.detail)
      let params =  event.detail;
      let res = await getDealerList(params);
      let {
        code,
        data,
        msg
      } = res;
      if (code == 1) {
        
        let {dealerList} = this.data;
        let {a_uid} = params;
        dealerList.forEach(item=>{
          if(item.uid == a_uid){
            item.checked = !item.checked
            console.log(item)
          }else{
            item.checked = false
          }
        })
        this.setData({
          dealerList
        })

        return
      }
      if (code == 0 && msg) {
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      }
    } catch (error) {
      console.log("setDefault catch:", error);
    }
  },
  //  点击确定，判断条件，显示二次确认弹窗
  showConfrimPop() {
    // 先判断是否选择配送商
    let {
      dealerInfo,
      noteInfo,
      skuArgArr
    } = this.data;
    if (!dealerInfo) {
      wx.showToast({
        title: '请先选择配送商',
        icon: 'none',
      })
      return
    }
  
    // 业务员信息和备注，赋值给参数
   let skuList =  skuArgArr.filter(item=>{
    //  需要过滤掉 申请数量为0的
     if(item.unused>0){
      //  let jxs = '';
      //  if(item.condition == 0){
      //    jxs = dealerInfo.name + '(红牛业务员)'
      //  }else{
      //    jxs = `${dealerInfo.name}(${dealerInfo.contact})`
      //  }
      //  item.jxs = jxs;
      //  item.jxsdh = dealerInfo.mobile;
       item.a_uid = dealerInfo.uid;
       item.remind = noteInfo;
       return item
     }
      
    })
    // 显示确认弹窗
    this.selectComponent("#checkOrder").show(skuList);
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    is_requesting = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    is_requesting = false;
    this.dealerPopClose();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  // 返回上一页：失败情况返回首页
  back() {
    wx.navigateBack({
      delta: 0,
      fail(err) {
        console.log(err)
        wx.navigateTo({
          url: '/pages/phaseIII/useCoupon/index/index',
        })
        // wx.switchTab({
        //   url: '/pages/tabBar/shouye/index',
        // })
      }
    })
  },
  // 配送商弹窗关闭
  dealerPopClose(){
    this.setData({
      dealerPopShow:false
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom() {

  // },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {

  // }
})