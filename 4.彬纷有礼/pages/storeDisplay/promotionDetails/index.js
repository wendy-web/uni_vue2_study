// pages/storeDisplay/promotionDetails/index.js
const http = require("../api/index")
//页面传参
let _options;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     dateText:'',
     pur_list:[],
     dis_list:[],
     pageStatus:null,
     partakeResult:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    _options = options
    // this.getDetails(options)
  },
  onShow(){
    this.getDetails(_options)
  },
  getDetails(parmas){

    let {shop_id,pro_id} = parmas

    http.getShopPro({
      shop_id,
      pro_id
    }).then(res=>{
      //获取所需数据
      let {pur_list,dis_list,start_time,end_time,status:activityStatus,pro_status,total} = res.data.pro
      //活动参与结果
      let partakeResult = {
        isPurchaseOk:true,
        isNoPurchase:pur_list.length === 0,
        isDisplayOk:total.dis_completed_num>=total.dis_need_num,
        isNoDisplay:true,
        award_num:total.award_num
      }
      //判断是否有陈列套餐
      if(dis_list.length>0)partakeResult.isNoDisplay = false
      //活动截止时间
      let dateText = `${start_time}~${end_time}` 
      //进货套餐数据处理
      const s_type_list = ['传统','现渠','通路','特渠']
      pur_list = pur_list.map(item=>{
        //获取进货套餐相关数据    
        let {pur_name,pur_id,status,goods_list,goods_rep_list,s_type,pur_award_num,completed_num,awarded_num,dis_list,need_num,t_type,dis_min_num}  = item
        //完成情况
        let completeData = {
            completed_num,//完成数量
            awarded_num
        }
        //未开始不处理 if(activityStatus == 0){
        if(activityStatus == 1){
          completeData.isLinkOrder = true
          if(awarded_num>0){
            if(status == 2){
              //已发劵
              completeData.isSendSecurities = true
            }else{
              //待发劵
              completeData.isWaitSendSecurities = true
            }
          }
        }else if(activityStatus == 3){//已结束
            if(awarded_num>0){
              if(status == 2){
                //已发劵
                completeData.isSendSecurities = true
              }else{
                //待发劵
                completeData.isWaitSendSecurities = true
              }
            }else if(pro_status>1){
              //未达标
              completeData.isNoStandard = true
            }
            //判断进货套餐是否合格
            if(partakeResult.isPurchaseOk)partakeResult.isPurchaseOk = completed_num>=need_num

        }
        //进货渠道    
        s_type = s_type.split(',').map((item,index)=>s_type_list[index])
        //惠让数据
        let huirang = {
          icon:'https://file.y1b.cn/public/store/goods/hn/2_m.png',//固定红牛
          pur_award_num,//惠让罐数
          isCompletedDis:dis_list.length>0//是否“需要同时完成以下陈列”
        }
        //判断是否有陈列套餐
        if(dis_list.length>0)partakeResult.isNoDisplay = false
        //进货陈列数据处理
        dis_list = dis_list.map(item=>{
          let {dis_id,dis_name,dis_label,dis_need_num,dis_completed_num} = item
          return {
            dis_id,dis_name,dis_label,dis_need_num,dis_completed_num,status
          }
        })
        //多品一指标 单商品进货要求
        let good_needs = []
        if(t_type == 1){
          for(let i = 0;i<goods_list.length;i++){
              let {s_icon,num} = goods_list[i]
              if(num>0){
                good_needs.push({s_icon,num})
              }
          }
        }
        return {
          pur_id,//方案id
          pur_name,//方案名称
          s_type,//进货渠道
          goods_list,//进货商品与要求,
          goods_rep_list,
          good_needs,//单商品进货要求
          huirang,//惠让数据
          completeData,//完成情况
          dis_list,//陈列列表
          awarded_num,//已发放惠让劵数
          t_type,//多品一指标===1|多品多指标 === 2
          need_num,//共需进货
          activityStatus,//套餐状态
          dis_min_num,
          isShowDis:false
        }
      })
      //单独陈列套餐数据处理
      dis_list = dis_list.map(item=>{
        let {dis_id,dis_name,dis_label,status,goods_list,dis_award_num,dis_completed_num,dis_need_num,awarded_num} = item
        //惠让数据
        let huirang = {
          icon:'https://file.y1b.cn/public/store/goods/hn/2_m.png',//固定红牛
          dis_award_num
        }
        //陈列标准数据
        let dis_standard = {
          shopIcons:goods_list.map(item=>item.s_icon),
          dis_label
        }
        //完成情况
        let completeData = {
             awarded_num
        }
         if(activityStatus == 3){//已结束
            if(awarded_num>0){
              if(status == 2){
                //已发劵
                completeData.isSendSecurities = true
              }else{
                //待发劵
                completeData.isWaitSendSecurities = true
              }
            }else if(pro_status>1){
              //未达标
              completeData.isNoStandard = true
            }
        }
        return {
          dis_id,
          dis_name,//套餐名称
          dis_standard,//陈列标准数据
          huirang,//惠让数据
          dis_completed_num,//已完成次数
          dis_need_num,//需要完成的次数
          awarded_num,//已发放惠让劵数
          activityStatus,//套餐状态
          completeData
        }
      })
      //状态
      this.setData({
        dateText,
        pur_list,
        dis_list,
        pageStatus:pro_status,
        partakeResult
      })
    })
  },
  //进货套餐下陈列显示控制
  showDis(event){
    let {purId,showstatus} =  event.currentTarget.dataset
    let pur_list =  this.data.pur_list
    let currIndex = pur_list.findIndex(item=>item.pur_id == purId)
    pur_list[currIndex].isShowDis = showstatus
    this.setData({
      pur_list
    })
  },
  //完成情况 toast介绍
  tipsToast(){
    wx.showToast({
      title: '配送商接单后，方可算入完成指标内。',
      duration:5000,
      icon:'none'
    })
  },
  //展示进货套餐商品信息
  showGoodsList(event){
    let {purId} =  event.currentTarget.dataset
    let pur_list =  this.data.pur_list
    let currIndex = pur_list.findIndex(item=>item.pur_id == purId)
    let {goods_list,pur_name,goods_rep_list} = pur_list[currIndex]
    this.selectComponent('#showGoodsModal').showPopup({goods_list,pur_name,goods_rep_list})  
  },
  //订单跳转
  goOrder(event){
    //是否跳转订单
    let {islinkorder} = event.currentTarget.dataset
    //不跳转订单
    if(!islinkorder)return
    wx.navigateTo({
      url: '/pages/storeOrder/myorder/index/index?activeTab=0',
    })
  },
  //进入店铺陈列完成情况
  goShopDis(event){
      //陈列套餐id
      let {disId} = event.currentTarget.dataset
      let {shop_id,s_uid} = _options
      let pageStatus = this.data.pageStatus
      //未开始
      if(this.data.pageStatus == 0){
         wx.showToast({
           title: '活动未开始',
           duration:5000,
           icon:'none'
         })
        return
      }
      //进行中 陈列店铺完成情况
      if(pageStatus == 1){ 
        
          wx.navigateTo({
            url: `/pages/storeDisplay/displayShopComple/index?s_uid=${s_uid}&dis_id=${disId}&shop_id=${shop_id}&pageStatus=${pageStatus}`,
          }) 
        return
      }
      //已结束
      wx.navigateTo({
        url: `/pages/storeDisplay/photoRecord/index?s_uid=${s_uid}&dis_id=${disId}&shop_id=${shop_id}&pageStatus=${pageStatus}`
      })

  }
})