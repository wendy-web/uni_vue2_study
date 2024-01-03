// pages/storeDisplay/business/itemList.js
// 调用组件提供的方法文件
const http = require("../../../api/index")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tab: { // 属性名
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    feedList: [],
    pageNext: 0 // 页码
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //签约
    sign(event){
      this.triggerEvent('sign',event.detail)
    },
    /**刷新当前 */
    reset(){
       this.selectComponent('.list-container').forceRefresh()
    },
    //加载数据
    loadData: function (event) {
      /**携参 */
      let {pageNum,endError,endSuccess} = event.detail
     /**请求参数 */
      let pageNext = this.data.pageNext
      /**第一页时重置数据 */
        if(pageNum == 1){
          pageNext = 0
          this.setData({
            feedList:[]
          })
      }
      /**组合请求参数 */
      let parmas = {
          next:pageNext,
          limit:10,
          type:this.data.tab
      }
      let userdata = wx.getStorageSync('userdata')||"{}"
      let {condition} = userdata
     /**发起请求 */
      http.getShopProList(parmas).then(res=>{
        //响应请求数据
        let data = res.data||{list:[]}
        //下一次的请求参数
        pageNext = data.next   
        //数据合并前处理
        data.list = data.list.map(item=>{
            let {title,flow_status,status,awarded_num,start_time,end_time,dis,pur,pro_status,flow_url,id:flow_id,sid,s_uid,pro_id} = item
            //进货|成了待完成显示
            let disNum = dis?dis.not_completed_num:null
            let purNum = pur?pur.not_completed_num:null
            //惠让让劵发放显示
            let huiRangText = null 
            //标签
            let labelData = null
            //未签约
            if(flow_status !== 4){
                labelData = {class:'red',text:'未签约',isNoLookInfo:condition!=1}
            }
            //方案状态 icon
            let image = null
            switch(status){
                case 0:
                  image = '/pages/storeDisplay/static/not_started.png'
                  break
                case 1:
                  image = '/pages/storeDisplay/static/ongoing.png'
                  if(awarded_num>0){
                    labelData = {class:'gray',text:'已返劵'}
                    huiRangText = `惠让券${awarded_num}张已存入个人卡券`
                  }
                  break
                case 3:
                  image = '/pages/storeDisplay/static/ended_icon.png'
                  if(awarded_num>0){
                    labelData = {class:'gray',text:'已返劵'}
                    huiRangText = `惠让券${awarded_num}张已存入个人卡券`
                  }else{
                    let pur_awarded_num = pur?pur.awarded_num:0
                    let dis_awarded_num = dis?dis.awarded_num:0
                    if(pur_awarded_num>0||dis_awarded_num>0){
                      labelData = {class:'gray',text:'待返劵'}
                      huiRangText = `惠让券${pur_awarded_num+dis_awarded_num}张待发放`
                    }else if(pro_status>1){//未达标
                      labelData = {class:'gray',text:'未达标'}
                    }
                  }
                  break
            }
            //未签约不显示其它信息
            if(labelData&&labelData.text === '未签约'){
              huiRangText = disNum = purNum =  null 
            }
            return {
              title,
              dateText:`${start_time}~${end_time}`,
              image,
              disNum,
              purNum,
              labelData,
              huiRangText,
              flow_url,
              flow_id,
              status,
              pro_id,
              sid,
              s_uid
            }
        })
        //更新数据
        this.setData({
          ['feedList['+(pageNum-1)+']']:data.list,
          pageNext:pageNext
        }) 
        /**成功回调 */
        endSuccess(data.list.length,pageNum)
      }).catch(err=>{
        /**失败回调 */
        endError()
      })
    }
  }
})