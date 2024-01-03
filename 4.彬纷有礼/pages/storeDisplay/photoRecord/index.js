// pages/storeDisplay/photoRecord/index.js
const http = require("../api/index")
const {parseTime,setComplePageParmas} = require("../api/utils")
//页面传参
let _options;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     /**基本信息 */
     basicInfo:{},
     /**統計 */
     photoTotal:{},
     date_list:[],
     pageStatus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    _options = options
    this.getData(options)
  },
  getData(parmas){
    let {dis_id,shop_id,pageStatus} = parmas
    http.getShopDisDays({dis_id,shop_id}).then(res=>{
        if(res.code == 0){
           wx.showToast({
             title: res.msg,
             duration:3000
           })
          return 
        }
         let {dis_name,date_num,need_num,periodic_date,periodic_times,label,goods_list,date_list,total} = res.data
         //处理商品信息
         goods_list = goods_list.map(item=>{
            let {icon,name,attr_str} = item 
            attr_str = attr_str.map(item=>{
              return item[1]
            })
             return {
              icon,name,attr_str
             }
         })
        //基本信息
        let basicInfo = {
          dis_name,date_num,need_num,periodic_date,periodic_times,label,goods_list
        }
        //统计
        let photoTotal = {
          no_standard_date_num:total.no_standard_date_num,
          standard_date_num:total.standard_date_num,
          rote:(total.standard_date_num/total.date_num*100).toFixed(1)
        }
        //拍照记录
        let today = parseTime(Date.now(),'{y}.{m}.{d}')
        const statusText = ['不合格','复核不合格','合格','复核合格']
        date_list = date_list.map(item=>{
            let {date,status,name,picture,mark,uid} = item
            //timeLabel
            let timeLabel = statusText[status]
            //1 = 今天 2 = 不合格 3 = 合格
            let icon = ''
            let iconColor = ''
            //status状态 0=不合格  1=复核不合格  2=合格 3=复核合格
            if(status === -1){
               timeLabel = '今天'
               icon = 'circle'
               iconColor = '#CCCCCC'
            }else if([0,1].includes(status)){
              icon = 'clear'
              iconColor = '#E3001B'
            }else if([2,3].includes(status)){
              icon = 'checked'
              iconColor = '#00AF29'
            }
            //提示语
            let tempText = '未拍摄'
            if(name){
              tempText = `${name} 最后上传`
            }
            return {
              date,
              icon,
              iconColor,
              timeLabel,
              tempText,
              picture:picture||"/pages/storeDisplay/static/bfyl_icon.png",
            }
        })
          this.setData({
            basicInfo,
            date_list,
            photoTotal,
            pageStatus
          })
     })
  },
  //展示陈列商品
  showDisGoods(){
    this.selectComponent('#showDisGoods').showPopup(this.data.basicInfo.goods_list)  
  },
  //前往陈列完成情况
  goDisComple(event){
    let {dis_id,shop_id} = _options
    let {date} = event.currentTarget.dataset
        date = date.replace(/\./g,'-')
    let pageStatus = this.data.pageStatus
    //已结算
    if(pageStatus == 3){
      wx.navigateTo({
        url: `/pages/storeDisplay/displayShopComple/index?pageStatus=${pageStatus}&dis_id=${dis_id}&shop_id=${shop_id}&date=${date}`
      })
    }else {//执行中，防止死亡回调
      setComplePageParmas({pageStatus,dis_id,shop_id,date})
      wx.navigateBack()
    }
  }
})