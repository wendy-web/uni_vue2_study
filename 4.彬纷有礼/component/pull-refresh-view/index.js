// 支持下拉刷新-上拉加载的组件
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    autoLoad:{
      type: Boolean,
      value: true
    },
    refresherEnable:{
      type: Boolean,
      value: true
    },
    refresherType: {
      type: String,
      value: 'default',
    },
    loadType: {
      type: String,
      value: 'default',
    },
    pullText: {
      type: String,
      value: '下拉刷新',
    },
    releaseText: {
      type: String,
      value: '松开立即刷新',
    },
    refreshText: {
      type: String,
      value: '正在刷新',
    },
    loadmoreText: {
      type: String,
      value: '加载中',
    },
    nomoreText: {
      type: String,
      value: '~没有更多记录了~',
    },
    pullDownHeight: {
      type: Number,
      value: 60,
    },
    // refreshing: {
    //   type: Boolean,
    //   value: false
    // },
    scrollY: {
      type: Boolean,
      value: true
    },
    // nomore: {
    //   type: Boolean,
    //   value: false,
    // },
    scrollToView:{
      type:String,
      value:''
    },
    scrollWithAnimation:{
      type: Boolean,
      value: false,
    },
    emptyImg:{
      type:String,
      value:'https://file.y1b.cn/public/img/bfyl/202208/img_empty.png'
    },
    lowerThreshold:{// 距底部/右边多远时，触发 scrolltolower 事件 默认50
      type:Number,
      value:50
    },
    enablePassive:{// 开启 passive 特性，能优化一定的滚动性能 默认false
      type:Boolean,
      value:false
    },
    enhanced:{// 启用 scroll-view 增强特性，启用后可通过 ScrollViewContext 操作 scroll-view
      type:Boolean,
      value:false
    },
    pagingEnabled:{ // 分页滑动效果 (同时开启 enhanced 属性后生效）
      type:Boolean,
      value:false
    }
  },
  data: {
    pullState: 0,
    lastScrollEnd: 0,
    scrollTop: 0,
    isLoadMore: false,//是否正在加载数据
    moveY: -60,
    refreshing:false,
    nomore:false,//没有更多了
    pageNext:1,//当前分页数
    listAllSize:0,//总数据条目
    showPrvTemp:false
  },
  attached() {
    this.setData({
      endY: -this.properties.pullDownHeight,
      showPrvTemp:false
    })
    if(this.properties.autoLoad)this.loadData(this.data.pageNext)
  },
  methods: {
    //滚动事件
    _onScroll: function (e) {
      this.triggerEvent('scroll', e);
    },
    //被下拉
    _onPulling: function (e) {
      let y = e.detail.dy
      if (y < this.properties.pullDownHeight) {
        this.setData({
          pullState: 0
        })
      } else {
        this.setData({
          pullState: 1
        })
      }
      this.triggerEvent('onpulling',this.data.pullState);
    },
    //滚动到顶部
    _onScrollTop: function (e){
      this.triggerEvent('scrolltoupper', e);
    },
    //下拉刷新关闭了
    _onClose: function (e) {
      this.triggerEvent('onrefreshclose', e);
    },
    //下拉刷新执行
    _onRefresh: function (isAutoRefresh) {
      //是否还在处理上一次请求或操作
      if(this.data.isLoadMore)return
      let pageNext = 1
      this.loadData(pageNext)
      this.setData({
        nomore:false,//没有更多了
        pullState: 2,
        isLoadMore:true,
        pageNext,
        listAllSize:0,
        showPrvTemp:false
      })
      if(isAutoRefresh !== true){
        this.triggerEvent('onrefresh');
      }
    },
    forceRefresh(){
       this._onRefresh(true)
    },
    //滚动到底部
    _onLoadmore: function (e) {
      //是否还在处理上一次请求或操作
      if(this.data.isLoadMore)return
      this.triggerEvent('scrolltolower', e)
      if (!this.properties.nomore && !this.properties.refreshing) {
        let pageNext = this.data.pageNext + 1
        this.loadData(pageNext)
        // this.triggerEvent('loadmore', e);
        this.setData({
          isLoadMore:true,
          showPrvTemp:false
        })
      }
    },
    /**成功时回调 */
    endSuccess(size,pageNext){
      this.setData({
        isLoadMore:false,
        refreshing:false,
        nomore:size<10,
        showPrvTemp:true,
        pageNext,
        listAllSize:this.data.listAllSize + size
      })
    },
    /**失败时回调 */
    endError(){
      this.setData({
        isLoadMore:false,
        refreshing:false,
        showPrvTemp:true
      })
    },
    /**拉去数据-下拉刷新或者上拉加载 */
    loadData(pageNext){
      this.triggerEvent('loadData',{
        pageNum:pageNext,
        endSuccess:(size,num)=>{
          this.endSuccess(size,num)
        },
        endError:()=>{
          this.endError()
        }
      })
    }
  }
})