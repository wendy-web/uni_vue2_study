// component/top-navbar/top-navbar.js
const utils = require('../../utils/util.js');
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      value: '',
      type: String
    },
    backgroundColor: {
      // value: 'red',
      value: '#ffffff',
      type: String
    },
    bgImg: {
      value: '',
      type: String
    },
    textCenter: {
      value: true,
      type: Boolean
    },
    textLeft:{
      value: false,
      type: Boolean
    },
    delta: {
      type: Number,
      value: 1
    },
    searchText: {
      type: String,
      value: '点我搜索'
    },
    searchBar: {
      type: Boolean,
      value: false
    },
    iconTheme: {
      type: String,
      value: 'black'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowHome: false,
    statusBarHeight: 30,
    navBarHeight: 44,
    menuWidth: 110
  },
  attached: function () {
    let pageContext = getCurrentPages();
    // console.log("pageContext:",pageContext);
    if (pageContext.length > 1) {
      this.setData({
        isShowHome: false
      })
    } else {
      this.setData({
        isShowHome: true
      })
    }
    let menuButton = wx.getMenuButtonBoundingClientRect();
    // console.log("胶囊位置信息：", menuButton);
    this.getNavBarData().then(res => {
      // console.log("TJ-navBar-system:", res);
      this.setData(res);
    });
    this.pages = getCurrentPages() || []
        this.pageCount = this.pages.length
        this.cp = this.pages[this.pageCount - 1] || {}
        this.cp.navBar = this

        var h = this.cp && this.cp.route + '.html'
    this.window = __wxConfig && __wxConfig.page && __wxConfig.page[h] && __wxConfig.page[h].window ? __wxConfig.page[h].window : {}
    this.window = Object.assign(__wxConfig.global.window, this.window);
    let title = this.data.title || this.window.navigationBarTitleText;
    this.setData({title});
    // console.log("__wxConfig:",__wxConfig)
    // console.log("this.window:",this.window);
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getNavBarData: function () {
      return utils.getNavbarData();
    },
    // 返回事件
    back: function () {
      console.log("trigger back");
      this.triggerEvent('back', {
        delta: this.data.delta
      });
    },
    search: function () {
      this.triggerEvent('search', {});
    },
  }
})
