// pages/zhongduan//geren/storesRecord/index.js
const app = getApp();
const api = require("../../../../utils/api");
const utils = require("../../../../utils/util");
const COS = getApp().globalData.COS_URL;
//等待时间 只负责接受时间
let _wait_date = []
//店铺sid
let _sid = ''
//页码	
let _next = 1
//核销人员
let _c_uid = ''
let _exc_type = 0;//品牌筛选：默认1红牛，2战马
//当前loading
let _ISLOADING = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    COS: COS,
    _IS_DATA_BOTTOM: false, //到底状态
    listData: [], //列表数据
    dateDialog: false, //日期弹窗
    selectData: { //日期范围
      now: "",
      last: ""
    },
    showTypePop: false, //类型选择弹窗，默认隐藏
    hideCalendar:false,
    dateIcon:COS+'/public/img/phaseIII/202104/help_date_icon.png',
    oneEnjoyImg:COS+'/public/img/bfyl/202302/img_one_enjoy_28y.png',
    hbNodataIcon:COS+'/public/img/phaseIII/202104/hb_noData.png',
    indicatorDots:true,//swiper 指示点
    autoplay:true,
    interval:3000,
    indicatorColor:'#8d8d8d',//指示点颜色
    indicatorActiveColor:'#ffffff',//选中的知识点颜色
    bannerArr:null,//
    img_zm_exc_banner:COS+'/public/img/bfyl/202301/img_zm_exc_banner.png',
    excTitle:"品牌筛选",
    excPop:false,
    excOptions:[
      {name:"红牛",value:1},
      {name:"战马",value:2}
    ],
    icon_delta_down:COS+'/public/img/bfyl/202301/icon_delta_down.png',
    icon_delta_up:COS+'/public/img/bfyl/202301/icon_delta_up.png',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let that = this;
    //获取店铺与店员信息
    let userdata = wx.getStorageSync('userdata');
    _sid = userdata.shop_id
    _c_uid = ''
    //设置默认时间
    this.setData({
      selectData: utils.getLastMonth()
    })
    if(options&&options.act==1){
      this.setData({
        hideCalendar:true
      })
      //兑奖活动跳转，屏蔽日期筛选
      if(app.globalData.act_time){

        this.setData({
          selectData:{
            now:utils.parseTime(app.globalData.act_time.end),
            last:utils.parseTime(app.globalData.act_time.start),
          }
        })
      }else{
        utils.isHide().then(data=>{
          app.globalData.act_time = data.act_time;
          this.setData({
            selectData:{
              now:utils.parseTime(data.act_time.end),
              last:utils.parseTime(data.act_time.start),
            }
          })
        })
      }
    }
    if(options.exc_type){
      _exc_type = options.exc_type;
      let {excTitle,excOptions} = this.data;
      excTitle = excOptions[_exc_type-1]['name'];
      this.setData({
        excTitle
      })
    }
    //拉去数据
    this.getData();
    //获取用户身份
    let userInfo = wx.getStorageSync('userdata');
    let condition = wx.getStorageSync('who') || userInfo.condition;
    this.setData({
      userInfo: userInfo,
      condition: condition
    })
    //获取掌柜店员信息
    utils.getShopInfo().then(data=>{
      var boss = '';
        var crew = new Array();
        var member = data.member;
        for (var i = 0, len = member.length; i < len; ++i) {
          if (member[i]['condition'] == 1) {
            boss = member[i];
          } else {
            crew.push(member[i]);
          }
        }
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
        this.setData({
          crew: crew,
          boss: boss
        });
    })
  },
  //下拉处理
  scrolltolower() {
    if (_ISLOADING || this.data._IS_DATA_BOTTOM) return
    _next++;
    this.getData()
  },
  //获取数据
  getData(refresh) {
    //防止连续调用重复数据
    if (_ISLOADING) return
    _ISLOADING = true;
    /**配置请求参数 */
    let parmas = {
      sid: _sid,
      // c_uid: _c_uid,
      // type:_exc_type,
      next: _next,
      start_time: this.data.selectData.last,
      end_time: this.data.selectData.now
    }
    if(_exc_type>0){
      parmas.type = _exc_type
    }
    if (_c_uid) {
      parmas.c_uid = _c_uid
    }
    console.log("getData 传参：", parmas);
    // 2月1号之前显示元，2月1号之后显示0.15罐
    let time_deadline = new Date('2023-02-01 00:00:00').getTime();
    /**请求数据 */
    api.post('/api/pay/getpaylog', parmas).then(res => {
      console.log("getData return:", res);
      _ISLOADING = false;
      let data = this.data.listData;
      console.log("_next:", _next)
      if (_next === 1) data = [] //页码为1时清空数据
      if (res.code == 1) {
        //处理数据
        res.data.list.forEach(function (item) {
          if (!item.c_nick_name || !item.check_uid) {
            item.notWritten = true
          }
          let call_time = item.call_time;
          call_time = new Date(call_time.replace(new RegExp(/-/gm), '/')).getTime();
          item.old_record = call_time>= time_deadline?false:true;
        })
        //数据拉取完了
        this.data._IS_DATA_BOTTOM = res.data.list.length < 10
        //设置数据
        data = data.concat(res.data.list)
        this.setData({
          listData: data,
          _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
        })
        return
      }
      if (res.code == 0) {

        this.setData({
          // listData: [],
          _IS_DATA_BOTTOM: true
        })
        if (_next == 1) {
          this.setData({
            listData: [],
          })
        }
      }
    }).catch(() => {
      _ISLOADING = false
    })
  },
  /**选择日期范围 */
  selectDate() {
    this.setData({
      dateDialog: true
    })
  },
  /** 关闭 日期弹窗*/
  closeDateDialog() {
    this.setData({
      dateDialog: false
    })
  },
  /** 日期选择响应*/
  onRangePick(event) {
    _wait_date = event.detail
  },
  /** 确定筛选 */
  chooseDate() {
    if (_wait_date && _wait_date.length > 1) {
      //发起查询
      _next = 1 //页码清零
      this.data._IS_DATA_BOTTOM = false
      this.setData({
        selectData: {
          now: _wait_date[1],
          last: _wait_date[0]
        },
        dateDialog: false,
        _IS_DATA_BOTTOM: this.data._IS_DATA_BOTTOM
      })
      this.getData()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let bannerArr = [];
    let {oneEnjoyImg,img_zm_exc_banner} = this.data;
    bannerArr.push(oneEnjoyImg);
    bannerArr.push(img_zm_exc_banner);
    this.setData({
      bannerArr
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    _next = 1;
    _c_uid = '';
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    _next = 1;
  },
  //选择店员
  chooseCrew: function (e) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    console.log(e);
    var d_uid = e.detail.currentTarget.dataset.uid;
    console.log("d_uid:", d_uid);
    if (d_uid != 0) {
      this.setData({
        showTypePop: false,
      });
      _c_uid = d_uid;
      this.getData();
    } else {
      _c_uid = '';
      this.getData();
    }

  },
  chooseType: function () {
    this.setData({
      showTypePop: true
    });
  },
  openExcType(){
    let {excPop} = this.data;
    excPop = !excPop
    this.setData({
      excPop
    })
  },
  selectExcType(event){
    let {item} = event.currentTarget.dataset;
    this.setData({
      excPop:false,
      excTitle:item.name
    })
    _exc_type = item.value;
    _next = 1 //页码清零

    this.getData();
  },
})