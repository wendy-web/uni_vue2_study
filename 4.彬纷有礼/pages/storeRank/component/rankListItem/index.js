// pages/storeRank/component/rank-list-item.js
let COS_URL = getApp().globalData.COS_URL || "https://file.y1b.cn";

let starList = ["奎狼","亢龙","角蛟","尾虎","箕豹","氐貉","房兔","心狐","井犴","鬼羊","柳獐","星马","张鹿","翼蛇","轸蚓","娄狗","胃雉","昴鸡","毕乌","觜猴","参猿","斗獬","牛牛","女蝠","虚鼠","危燕","室猪","壁狳"]
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number, //星宿序号，前三区别显示
      value: 1
    },
    src: {
      type: String,
      value: COS_URL + '/public/img/storeRank/202108/28stars_1.png' //星宿地址
    },

    rankInfo: {
      type: Object, //排行榜信息
      value: {}
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    icon_rank_one: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAeCAMAAAD6p9sIAAAASFBMVEUAAAD6qg76qg78qAz7qg76qg36qg76qg76qg77qw77qw36qg76rQ//zwD6qg7/53/+xAL/3m79vQX8sgv90ln7sx/9yEX8vDB6GykZAAAADXRSTlMAql0O8ZHIbttHL34i0upiXAAAAYVJREFUSMe9lkuShCAQREV+opJ81fvfdESiR+x2Vl3OW7rwRWZAFd0VLnX3j2jAXPSj6b/EzH/rFMBOl1agYJDjvW3Gtgj+kgkgRf8tMQFgtxEn5Iy+mhXgLQ0+Qegb3bC4UNscBaKlwwPyw2awOreBHzZvSUmfPongXIbu+FBs1L7+TScWtwO1e6MlB4JfbH3psrRpkCw9vtTJe631NE1SygGh6DIEUqx46ngMJ5s7WHBCWWpEv+uWHA7cL8GFQs60OgvWcYkluFuobRaqnBCB9c62gfzuiWOCDNg+AoaF/ngm1GnMSqH3RdKnuyl0LUWSg+GQ1UJza0v2AZpdyhDaKqOlx0O387LhkXQJc7t7GjbQ2zzYZfcU1mrN8A+EG9s9Xi9bvYKBvs3Y7Nf56HKFmCSQn2gzQrXvy1yiqT2uKTOG/OIlKN6+L4tgqjOmBAwAYZ8eYI2NYzmiHdSAEApI3hO4It7efQYlWqNnAGbDQMMw8a6Fq1e0MyAr380k2ZdI3fz6B6EdjBbT6rX3AAAAAElFTkSuQmCC",
    icon_rank_two: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAAAeCAMAAAAVZbA2AAAAS1BMVEUAAAD6qg76qg76qg79qw/7qg76qg77qg77qg76qg77qg76qg77qw3g4OD6qg7o0KP5rh/1tTrl2MHtx33zukzi3NDwwWbqzZXn1LBRTC8MAAAADXRSTlMAq101Cu/dS8WIcpwdWRZ49gAAAadJREFUSMe9ltuWqyAQRL0BinbZXBT//0sP4qwcnCRP6cx+EXAtyyqgobkzjOPQ/CEdMNXyxs7th8zWvLegmfWj088KMrT9a7kFMaD/abeAC8dGH7IdIQLj8krP4jgwX+YUoich/A5lnuUGzUSszqYBJxJkZdgnvR47UYA5W+xJFM94cjgji3i0zaKKnLCgWn7FqRxlnBpmJBJnzUZuGATKJExw9AUi+nOTte2Y0VorbGUBA2CXiTHuh2Sip8EW4EwR2KmwuwyfAEyCODU0FrzSGw5GIEFKLTEK+7vXnGRXTNmDywjnX9ShCCe9B38Og+lFpgdXtoX16kzrLKU5rppWZ1pnKU5CV9WyUE9spC+wo6/0tsrfdwoMq1vtrHBM8qyY6qPonvRK4jj8PyAmeMp4567nFyYwYKovSmWIAQ4lavFAV+jhHqeP0KbXZSsEBGG523FrsVJizPkPhum06IF9IzG2AFXfCUcu5q5OsViS3YTUEt8vhAu4mCtcFhlWAzGk9UNSiAxlf13MHuYeFtEPXQsRxm5o7tipGrks2kvYdB9i+vrT/wAEgowMPFZBTQAAAABJRU5ErkJggg==",
    icon_rank_three: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAeCAMAAAD6p9sIAAAASFBMVEUAAAD6qg76qg77qg77qw75qAv6qg77qg77qg77qw76qg76qg37qwz6qg7/z5D6qg7+xGr7rh77siz/zIb+yHj9vE38tzz9wV7MeHzTAAAADnRSTlMAXar0iQ7O4rpJcDAfn2pYpcEAAAGZSURBVEjHvVZbksMgDGsKAfJCMc/733QLdDJkm37Fu/qpY2aiSoNiP85YtRof/wcJDN3jOMnteRNyXr7SaYI5HiYDHmh5bdmEmLC2elFAysHbm/B7JIj5im5D2NFOBoHoLRMywXwKHIWzllQpZ1CwjEj4vIMDcjlYSuW8ZUX85DN4cQTIxyLoVXHzyV9ewpU+6RdvsOxwOCdiRn7/DSTLj1AytjyNMUoprbWAb22AyBWkxOlpyZipL2+vj+92qUsPYJVZMjaD9q9xAXZGOl/cnATi9Wlizp51ukwBdRmyQEjMaXCizYELQzOQLTMSKl0z9NpIfnW9ob2R7CB1ZPzZX8KIaPnhsXXfy17dn9BlDP3s6UBk+eHEeJo9vZv8FyV3I2FrXgZylWfnd9NTFdegXRMl0GTCcbM5DP1O9JLmoJZJ10gk7Nxsst8vg42onXErAjNY7Qx0muWKqrS3VI1Uh172TGTpvPmtIBz0VSBBSAG4mPd7yDkR8FzP6+wh7RCIdZyN4Fmif6/t8zyeG6Mc6s8yDTcx9cJ+ABnllN1Jkzg4AAAAAElFTkSuQmCC",
    icon_rank_item: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAaCAMAAAB//6mtAAAAV1BMVEUAAAD/pgL+qAX8qgv9qQr8qQr8qgv+qAb7qgv+qAX9qAf/pwL+pQf7qgz9qAf87NX/pgD7qg7+u0D86Mn81Iv8tjD83af8sB3847r82Jr8x2b8wVT8znrmHq6gAAAAD3RSTlMAq/AmCcBkzTpOeaAW3pKxPTUCAAABjUlEQVRIx7WWyXqDMAyEjQj7Yg14weD3f86a0Lih6Qnc/2RxkD9p0MjinXooxL+SAfXr3JfZQHwNqrrmIT55kMb4nX5kZjtdRFtmaj+vKOE0np8bYq1meZ3FW65y8YsCs0cTDi1DyZvMK1MtTvTY5IwsVMJ2kfdxTOcaWhgpJ/Q5YZYpcFyddKhsyKtQFmxkGlZuQ948rwNNU2KVATuwdsaYZblfxmzpITpEjAxsiNwXwnMjKmjvvVLKueMHcy4E3q+Ak3dZuBP5gO2PZhiLNYHUtgrzm0Gbj9oAJROg6TnB9CvbPEEvMgUTHS56bpOxMUxTwdGmmFIBSiaCo/8PNl7g0uU3PIqDHOub9JNMxMZ19CH3VPdQBokUWLh6c+q9Iv0UVyGRGU3cvHYZtt3BAVgXDtgSeV33s8uUNBpFXtI+wDqJzNubW2dYVtDurX0Ba1bwdnfQjOaiFy/IarxWaEmYQMyTumzYs/GaeRSRHED7iFEBVE3Bt6DutC7H7BSWRb0/jMYuu0bX/jyLvgChL30bM/siZgAAAABJRU5ErkJggg==",
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      let index = this.data.index;
      let starInfo = {};
      starInfo.name = starList[index-1];
      starInfo.src = COS_URL + '/public/img/storeRank/202108/28stars_'+index+'.png';
      this.setData({
        starInfo
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})