// pages/storeDisplay/component/showGoodsModal/index.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    config:{
      pur_name:'',
      goods_list:[],
      goods_rep_list:[]
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup({pur_name,goods_list,goods_rep_list}) {
      goods_list = goods_list.map(item => {
          let {icon,name,attr_str}  = item 
          attr_str = attr_str.map(function(item){
             return item[1]
          })
          return {
            icon,
            name,
            attr_str
          }
      });
      this.setData({ show: true,config:{
        pur_name,
        goods_list,
        goods_rep_list:goods_rep_list||[]
      }});
    },
    onClose() {
      this.setData({ show: false });
    }
  }
})
