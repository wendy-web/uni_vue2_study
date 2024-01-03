// 调用组件提供的方法文件
const http = require("../../../../api/index")
//tools
const tools = require('../../../common/tools/index')
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
    pageNext: 0, // 页码
    condition:2
  },
  lifetimes:{
    attached: function () { 
      /**获取用户角色 */
      let userdata = wx.getStorageSync('userdata')||"{}"
      let {condition} = userdata
      this.setData({
        condition
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**刷新当前 */
    reset(){
       this.selectAllComponents('.list-container').forEach(item=>{
         item.forceRefresh()
       })
    },
    /** 手動下拉刷新回調 */
    onrefresh(){
      this.triggerEvent('getTopCount')
    },
    /**回调处理 */
    toolsTrigger(event){
     this.triggerEvent('toolsTrigger',event.detail)
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
          ...tools.getParams(this.data.tab)
      }
     /**发起请求 */
      http.getPackLog(parmas).then(res=>{
        //响应请求数据
        let data = res.data||{list:[]}
        //下一次的请求参数
        pageNext = data.next   
        //数据合并前处理
        data.list = data.list.map(item=>{
        //取值  
           let { create_time,//发起时间
                  y_name,//代下单业务员
                  b_sname,//配送商名称
                  sku_img,//商品图片列表
                  sku_num,//商品数量
                  buy_num,//箱数
                  hr,//惠让
                  total_amount,//商品总价
                  c_amount,//应付款
                  d_amount,//现金劵
                  p_amount,
                  avg_price,
                  status,
                  type,
                  rev_status,
                  b_sid,//送货单id
                  id//订单id
                } = item 
          
          //状态文字      
          let  orderStatus =  tools.getStatusText({p_amount,status,type,rev_status})
          //按钮控制
          let toolsBtns = tools.getToolsBtn(orderStatus.statusText,this.data.condition)
           return {
              create_time,//发起时间
              y_name,//代下单业务员
              b_sname,//配送商名称
              goodSize:sku_img.length,
              sku_img:sku_img.slice(0,2),//商品图片列表
              sku_num,//商品数量
              buy_num,//箱数
              hr,//惠让
              total_amount,//商品总价
              c_amount,//应付款
              sf_amount:p_amount,//实付款
              b_sid,//送货单id
              id,//订单id
              d_amount:Number(d_amount)>0?d_amount:null,//现金劵
              yh_amount:(Number(total_amount)-Number(c_amount)).toFixed(2),//优化金额
              orderStatus,
              toolsBtns,
              avg_price
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