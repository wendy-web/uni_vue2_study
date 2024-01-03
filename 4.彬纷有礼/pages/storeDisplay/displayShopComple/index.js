// pages/storeDisplay/displayShopComple/index.js
const http = require("../api/index")
const {uploadImgAI,parseTime,getComplePageParmas,removeComplePageParmas} = require("../api/utils")
const {getUserLocation} = require("../../../utils/location")
//页面参数
let _options;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     /**基本信息 */
     basicInfo:{},
     /**店铺信息 */
     shopInfo:{},
     /**拍照信息 */
     date:'',
     isToday:false,
     tag_list:[],
     /**拍摄按钮状态 */
     shotLoading:false,
     disStatus:-1,//套餐合格狀態
     pageStatus:3,//未開始 進行中 已結束
     apply_status:0,
     isApplyReview:false,
     is_apply:0,
     applyLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     _options = options
     this.getData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    /**有带参返回则刷新页面 */
    let parmas = getComplePageParmas()
    if(parmas){
      _options = parmas
      this.getData()
      removeComplePageParmas()
    }
  },
  onHide(){
    removeComplePageParmas()
  },
  getData(){
    let {dis_id,shop_id,date:_date} = _options
    //没有日期参数就代表今天
    let today =  parseTime(Date.now(),'{y}-{m}-{d}')
    if(!_date){
      _date = today
      _options.date = _date
    }
    http.getShopDis({
      dis_id,
      shop_id,
      date:_date
     }).then(res=>{
            if(res.code == 0){
              wx.showToast({
                title: res.msg,
                icon:'none',
                duration:3000
              })
            return 
          }
         let {name:shopName,picture,address} = res.data
         let {dis_name,date_num,need_num,periodic_date,periodic_times,label,goods_list,tag_list,date,status,apply_status,
          is_apply,shop_pro_status} = res.data.dis
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
         //店铺信息
         let shopInfo = {shopName,picture,address}
        //基本信息
        let basicInfo = {
          dis_name,date_num,need_num,periodic_date,periodic_times,label,goods_list
        }

        console.log()

          this.setData({
            basicInfo,
            shopInfo,
            date,
            tag_list,
            disStatus:status,
            isToday:today == _date,
            pageStatus:shop_pro_status,
            apply_status,
            is_apply,
            isApplyReview:[1,3].indexOf(status)==-1&&(is_apply == 1||apply_status==1),
            applyLoading:false
          })
     })
  },
  /**拍照上传 */
  async shot(event){
    this.setData({shotLoading:true})
    /**查找当前数据 */
     let {tagId} = event.currentTarget.dataset
     let tag_list = this.data.tag_list
     let currTag = tag_list[tag_list.findIndex(item=>item.id == tagId)]
     let chooseImage = wx.chooseMedia||wx.chooseImage
      
        try {
          /**获取经纬度 */
          // wx.showLoading({title:'获取定位中，请稍后',mask:true})
          let {longitude:lng,latitude:lat} = (await getUserLocation()).data    
          // wx.hideLoading()
          /**获取经纬度 */
          /**图片获取 */
          let [tempFile] = (await chooseImage({count:1,sizeType:'compressed',mediaType:['image'],sourceType:['camera'],camera:'back'})).tempFiles
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
          this.showResult(res)
        } catch (error) {
          //  wx.showModal({
          //    title:'温馨提示',
          //    content:JSON.stringify(error)
          //  })
            console.log(error)
            wx.hideLoading()
        }finally{
          this.setData({shotLoading:false})
        }
  },
  /**申请复核 */
  applyReview(){
    this.setData({
      applyLoading:true
    })
    let {dis_id,shop_id,date} = _options
    http.applyRecheck({dis_id,shop_id,date}).then(res=>{
      if(res.code == 1){
          wx.showToast({
            title: '申请成功',
            duration:3000,
            icon:'none'
          })
          setTimeout(()=>{
            this.getData()
          },2000)
          return
      }
      this.setData({
        applyLoading:true
      })
      wx.showToast({
        title: res.msg,
        icon:'none'
      })
    }).catch(res=>{
      this.setData({
        applyLoading:false
      })
    })
  },
  //展示上传结果
  showResult(res){
    let {status,create_time,address,img_url,city,area,town} = res
    let hour =  parseTime(create_time,'{h}:{i}')
    let day =  parseTime(create_time,'{y}.{m}.{d}')
    let _reg = new RegExp(`(${city||''}|${area||''}|${town||''})`,'g')
    let _tempAddress = city + area + town+ address.replace(_reg,'')
    this.selectComponent('#disQualifiedState').showPopup({
      status,address:_tempAddress,hour,day,img_url
    })  
    //更新当前页数据
    this.getData()
  },
  showDisQualifiedState(event){
    let {tagId,index} = event.currentTarget.dataset
    let tagList = this.data.tag_list
    let currTag = tagList[tagList.findIndex(item=>item.id == tagId)]
    let {status,create_time,address,img_url,city,area,town} = currTag.img_list[index]
    let hour =  parseTime(create_time,'{h}:{i}')
    let day =  parseTime(create_time,'{y}.{m}.{d}')
    let _reg = new RegExp(`(${city||''}|${area||''}|${town||''})`,'g')
    let _tempAddress = city + area + town+ address.replace(_reg,'')
    this.selectComponent('#disQualifiedState').showPopup({
      status,address:_tempAddress,hour,day,img_url
    }) 
  },
  //普通图片预览
  showImages(event){
    let {picture} = event.currentTarget.dataset
    wx.previewImage({
      urls: [picture] // 需要预览的图片 http 链接列表
    })
  },
  //展示陈列商品
  showDisGoods(){
    this.selectComponent('#showDisGoods').showPopup(this.data.basicInfo.goods_list)  
  },
  //前往拍照记录
  goPhotoRecord(){
    let {dis_id,shop_id,s_uid} = _options
    wx.navigateTo({
      url: `/pages/storeDisplay/photoRecord/index?s_uid=${s_uid}&dis_id=${dis_id}&shop_id=${shop_id}&pageStatus=${this.data.pageStatus}`
    })
  }
})