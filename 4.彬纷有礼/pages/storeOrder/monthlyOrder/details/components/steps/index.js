// pages/storeOrder/monthlyOrder/details/components/steps/index.js
Component({
  /**
   * 组件的属性列表
   */
  data:{
    active:0
  },
  properties: {
     timeline:{
      type:Array,
      observer(){

      },
      value:[]
     }
  },
  observers: {
    'timeline': function() {
      let timeline =  this.properties.timeline
      let index = 0;
      for (;index < timeline.length; index++) {
            const item = timeline[index];
            if(!item.date){
              break
            }
      }
      this.setData({
        active:index-1
      })

    }
  },
  methods:{
     
  }
})
