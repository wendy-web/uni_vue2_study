// component/newList/list.js
const http= require('../../utils/api');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
    },
    listIndex: {
      type: String,
      value: ''
    },
    adPosition:{
      type:Number,
      value:6
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    unlikeImg: '../../assets/images/unlike.png',
    likeImg: '../../assets/images/liked.png',
    isError:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goWebview: function (e) {
      let link = e.currentTarget.dataset.link;
      link = encodeURIComponent(link);
      let title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '/pages/tabBar/shouye/webview/index?link=' + link,
      })
    },
    giveAlike: function (e) {
      let c_id = e.currentTarget.dataset.id;
      let list = this.data.list;
      let index = list.findIndex(item => item.c_id == c_id)
      let param = {
        cid: c_id
      }
      http.post('/api/tools/givelike', param,'').then(res => {
        console.log("givelike res:",res);
        if (res.code == 1) {
          if (index > -1) {
            let is_give = list[index].is_give;
            var list_is_give = 'list[' + index + '].is_give';
            var list_give = 'list[' + index + '].give';
            var list_animate = 'list[' + index + '].animate';
            if (is_give == 0) {
              is_give = 1;
              // list[index].animate = true;
              this.setData({
                [list_animate]: true,
              });
            } else {
              is_give = 0
            }
            console.log("list_is_give:", list_is_give);
            list[index].is_give = is_give;
            list[index].give = res.data.count;
            this.setData({
              [list_is_give]: is_give,
              [list_give]: res.data.count,
            });
            console.log(this.data);
            if (list[index].animate == true) {
              wx.vibrateShort();
              list[index].animate = false;
              setTimeout(() => {
                this.setData({
                  [list_animate]: false,
                })
              }, 1000)
            }
          }

        }
      }).catch(err => {
        console.log("list  givelike:",err)
        if(err&&err.code == "-1"){
          wx.showModal({
            title: err.msg,
            content:"您还未登录",
            confirmText:"前往登录",
            showCancel:false,
            success:(_res)=>{
              if(_res.confirm){
                wx.reLaunch({
                  url: '/pages/user/register/index',
                })
              }
            }
          })
        }
        wx.hideLoading({
          success: (res) => {},
        })
      })

    },
    adLoad(e) {
      this.setData({
        isError:false
      })
      // console.log("广告加载成功");
      let c_id = e.currentTarget.dataset.id;
      let list0 = this.data.list;
      let index = list0.findIndex(item => item.c_id == c_id);
      let list = "list[" + index + "].adLoaded";
      if (index > -1) {
        this.setData({
          [list]: true
        })
      }
    },
    adError(err) {
      this.setData({
        isError:true
      })
      let c_id = err.currentTarget.dataset.id;
      let list = this.data.list;
      let index = list.findIndex(item => item.c_id == c_id);
      if (index > -1) {
        // list[index].adCustom = false;
        let _list = "list[" + index +"].adCustom";
        this.setData({
          [_list]: false
        })
      }
    },
  }
})