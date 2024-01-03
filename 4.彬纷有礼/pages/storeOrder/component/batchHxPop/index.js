// pages/phaseIII/useCoupon/component/checkOrder/index.js
const app = getApp();
const COS_URL = app.globalData.COS_URL;
const log = require('../../../../utils/log');
import {
  checkpage
} from '../../api/fhOrder';
import {
  pendingList
} from '../../../../api/coupon/index';
var _request = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shopInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    confirmPopShow: false, //显示二次确认弹窗,
    refusePopShow: false, //显示拒绝核销弹窗,
    cancelHxTipsShow: false, // 取消核销以后的提示语弹窗
    skuList: null, // 订单列表
    file_url_9m: `${COS_URL}/public/img/bfyl/2023/09`, //23年9月 cos图片资源
    reqResultCode: -1, //返货申请结果：默认-1 确定申请;全部失败:0， 部分成功:1， 全部成功:2
    reqSuccessCount: {
      order: 0,
      num: 0,
      unit: '', //产品单位，需要根据列表里面的sku_info.unit 去重统计
    }, //成功提交数量
    selectPopShow: false, //显示 批量核销选择弹窗
    allSelected: false, //全选，默认：false
    currentBox: false, // 当前选中的订单
    defaultItem: null, // 列表点击的默认项
    hxList: [], // 更多待核销列表
    reqList: [], //选中的待核销列表
    all_selected_count: 0, //所有选中的总数量
    hxListLength: 0, // 还有X个返货订单
    group_sku_arr: [], //所有商品按sku 归类显示count_sj总数
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(event) {
      let {
        popname
      } = event.currentTarget.dataset;
      this.setData({
        [popname]: false
      })
      this.triggerEvent('batchHxPopClose')
    },

    // 显示批量核销选择弹窗:传参默认选中的订单
    showSelectPop({
      id,
      locationInfo
    }) {
      if (id) {
        this.getHxList(id, locationInfo);
      }
    },
    // 获取核销列表
    async getHxList(id, locationInfo) {
      try {
        // 防止重复请求
        if (_request) return;
        _request = true;
        let res = await pendingList({
          id
        });
        _request = false;
        let {
          reqList,
          hxList,
          all_selected_count = 0,
          allSelected = false
        } = this.data;
        // 需要请求接口，查询还有更多待核销列表 每次需要把 reqList 置空 []
        reqList = [];
        hxList = [];
        // console.log("核销列表：", res);
        let {
          code,
          data,
          msg
        } = res;
        if (+code == 1) {
          let {
            current,
            other
          } = data;
          // 当前选中的
          if (current) {
            current.checked = true;
            let item = {};
            item.group = current.sku_info.group || '';
            item.group_unit = current.sku_info.unit || '';
            item.checked = true;
            item.list = [current];
            item.locationInfo = locationInfo;
            reqList.push(item);
          }
          all_selected_count = 0;
          let reqListLength = 0;
          let hxListLength = 0;
          // 如果有其它待核销的
          if (other.length > 0) {
            other.forEach(item => {
              if (item.length) {
                item.forEach(_item => {
                  _item.checked = false;

                })
                hxListLength += item.length;
                let group = item[0]['sku_info']['group'];
                let group_unit = item[0]['sku_info']['unit'];
                const hxListItem = hxList.find(_item => _item.group == group);
                if (hxListItem) {
                  hxListItem.list.concat(item)
                } else {
                  hxList.push({
                    group,
                    group_unit,
                    list: item,
                    checked: false
                  })
                }
                // 同步到 reqList
                const reqListItem = reqList.find(_item => _item.group == group);
                if (reqListItem) {
                  reqListItem.list = reqListItem.list.concat(item)
                  reqListItem.count = reqListItem.list.length;
                  reqListItem.group_unit = group_unit;
                  reqListItem.locationInfo = locationInfo;

                } else {
                  reqList.push({
                    group,
                    group_unit,
                    list: item,
                    count: item.length,
                    locationInfo
                  })
                }
              }
            })

          }
          reqList.forEach(item => {
            item.count = 0;
            item.list.forEach(itm => {
              reqListLength++;
              if (itm.checked) {
                item.count += itm.count_sj;
                all_selected_count++;
              }
            })
          })
          allSelected = Boolean(all_selected_count == reqListLength);
          // console.log("reqList ----->：", reqList);
          // console.log("current ----->：", current);
          // console.log("hxList ----->：", hxList);
          this.setData({
            selectPopShow: true,
            currentBox: true,
            reqList,
            hxList,
            all_selected_count,
            allSelected,
            defaultItem: current,
            hxListLength
          })
          return
        }
        wx.showModal({
          title: '温馨提示',
          content: msg,
          showCancel: false
        })
      } catch (error) {
        _request = false;
        console.log("getHxList catch:", error)
      }
    },
    // 发起确认核销
    async hxOrderApi(params) {
      console.log("hxOrderApi传参：", params);
      try {
        //  checkpage
        let res = await checkpage(params);
        return res
      } catch (error) {
        console.log('hxOrderApi catch:', error)
        let {
          errMsg = ''
        } = error;
        if (errMsg && errMsg.search('request:fail')) {
          error.code = 0;
          error.msg = '网络请求失败'
        }
        return error
      }

    },
    // 一键申请
    async confirmHxAll() {
      wx.showLoading({
        title: '加载中···',
        mask: true,
      })
      try {
        let {
          reqList,
          reqResultCode
        } = this.data;
        for (var i = 0; i < reqList.length; i++) {
          let item = reqList[i];
          for (var j = 0; j < item.list.length; j++) {
            let itm = item.list[j];
            if (itm.checked && !itm['reqResult']) {
              try {
                let params = {};
                params.check_no = itm.check_no;
                params.state = 1; // 1确认，2取消
                params.longitude = item.locationInfo.longitude;
                params.latitude = item.locationInfo.latitude;
                // 打印核销确认请求日志
                log.setFilterMsg('confirmHxAll');
                log.info("/api/card/checkpage 确认传参：", JSON.stringify(params));
                const result = await this.hxOrderApi(params);
                log.info("/api/card/checkpage 确认结果：", JSON.stringify(result));

                item.list[j]['reqResult'] = result;
              } catch (error) {
                item.list[j]['reqResult'] = error;
                log.info("/api/card/checkpage catch：", JSON.stringify(error));

              }
            }
          }
        }
        wx.hideLoading();

        let list_length = 0;
        let reqSuccessCount = {};
        reqSuccessCount.order = 0;
        reqSuccessCount.num = 0;
        reqList.forEach(_item => {
          _item.count = 0;
          _item.list.forEach(item => {
            if (item.reqResult) {
              list_length++;
              let {
                code = 0
              } = item.reqResult;
              if (code == 1) {
                _item.count += item.count_sj;
                reqSuccessCount.order++;
                reqSuccessCount.num += item.count_sj;
              }
            }
          })
        })
        // 全部成功
        if (reqSuccessCount.order == list_length) {
          reqResultCode = 2;
        } else {
          // 部分成功,默认-1
          reqResultCode = reqSuccessCount.order == 0 ? 0 : 1;
        }
        console.log("confirmHxAll请求结束：", reqList)

        this.setData({
          reqList,
          reqResultCode,
          reqSuccessCount
        })
        // 刷新订单列表数据
        this.triggerEvent("refreshAll");
      } catch (error) {
        console.log("confirmHxAll catch:", error);
      }

    },
    // 返回到一键返货页
    goBackApply(event) {
      this.onClose(event);
    },
    //当前选择的
    checkboxChange(event) {
      console.log(event.currentTarget.dataset);
      let {
        boxname,
        boxvalue,
        id
      } = event.currentTarget.dataset;
      let {
        reqList,
        all_selected_count,
        allSelected
      } = this.data;
      all_selected_count = 0;
      let reqListLength = 0;
      reqList.forEach(item => {
        item.list.forEach(itm => {
          reqListLength++;
          if (itm.id == id) {
            itm.checked = !boxvalue
          }
          if (itm.checked) {
            all_selected_count++;
          }
        })
      })
      allSelected = Boolean(all_selected_count == reqListLength);
      console.log("checkboxChange全选了：", all_selected_count, reqListLength);

      this.setData({
        [boxname]: !boxvalue,
        reqList,
        all_selected_count,
        allSelected
      })
    },
    // 点击分组设置 选中全部
    checkboxGroup(event) {
      let {
        groupname,
        boxvalue,
      } = event.currentTarget.dataset;
      let {
        reqList,
        hxList,
        all_selected_count,
        allSelected,
        currentBox,
        defaultItem
      } = this.data;
      all_selected_count = 0;
      hxList.forEach(item => {
        if (item.group == groupname) {
          item.checked = Boolean(boxvalue) == false ? 1 : 0;
          let id_arr = item.list.map(itm => String(itm.id));
          item.checkBoxList = Boolean(boxvalue) == false ? id_arr : [];
          item.list.forEach(itm => {
            itm.checked = Boolean(boxvalue) == false ? 1 : 0;
          })
        }
      })
      let reqListLength = 0;
      reqList.forEach(item => {
        if (item.group == groupname) {
          item.list.forEach(itm => {
            // 先判断id是不是默认点击选中的
            if(itm.id == defaultItem.id){
              itm.checked = currentBox;
            }else{
              itm.checked = Boolean(boxvalue) == false ? 1 : 0;
            }
          })
        }
        item.list.forEach(itm => {
          if (itm.checked) {
            all_selected_count++;
          }
          reqListLength++;
        })
      })
      console.log("currentBox：", currentBox);
      console.log("boxvalue", boxvalue);
      console.log("checkboxGroup全选了：", all_selected_count, reqListLength);
      allSelected = Boolean(all_selected_count == reqListLength);
      this.setData({
        all_selected_count,
        hxList,
        reqList,
        allSelected
      })
    },
    // 选择全部
    checkboxSelectAll(event) {
      let {
        allSelected,
        all_selected_count,
        currentBox,
        reqList,
        hxList
      } = this.data;
      allSelected = !allSelected;
      // 全选
      if (allSelected) {
        currentBox = true;
        reqList.forEach(item => {
          item.list.forEach(itm => {
            itm.checked = true;
            all_selected_count++;
          })
        })
        // 修改 hxList 
        hxList.forEach(item => {
          item.checked = true;
          item.list.forEach(itm => {
            itm.checked = true;
          })
          let id_arr = item.list.map(item => String(item.id))
          item.checkBoxList = id_arr;
        })
      } else {
        // 取消全选
        all_selected_count = 0;
        currentBox = false;
        hxList.forEach(item => {
          item.checked = false;
          item.list.forEach(itm => {
            itm.checked = false;
          })
          item.checkBoxList = [];
        })
        reqList.forEach(item => {
          item.list.forEach(itm => {
            itm.checked = false;
          })
        })
        
      }
      this.setData({
        allSelected,
        all_selected_count,
        currentBox,
        hxList,
        reqList
      })
    },
    // 分组list 里面的选中效果
    onChangeGroup(event) {
      let selectedArr = event.detail;
      let {
        groupname
      } = event.currentTarget.dataset;
      let {
        hxList,
        reqList,
        all_selected_count,
        allSelected,
        defaultItem,
        currentBox
      } = this.data;
      hxList.forEach(item => {
        if (item.group == groupname) {
          item.checkBoxList = selectedArr;

          item.list.forEach(itm => {
            if (selectedArr.includes(String(itm.id))) {
              itm.checked = true;
            } else {
              itm.checked = false;
            }
          })
          if (selectedArr.length == item.list.length) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        }
      })
      all_selected_count = 0;
      let reqListLength = 0;
      reqList.forEach(item => {
        if (item.group == groupname) {
          item.list.forEach(itm => {
            if (selectedArr.includes(String(itm.id))) {
              itm.checked = true;
            } else {
              itm.checked = false;
            }
          })
        }
      })
      // 单独判断defaultItem的选中情况：此处重新赋值，因为上面的循环会导致defaulItem.checked 变成false
      defaultItem.checked = currentBox;
      reqList.forEach(item => {
        item.list.forEach(itm => {
          reqListLength++;
          if (itm.id == defaultItem.id) {
            itm.checked = defaultItem.checked;
          }
          if (itm.checked) {
            all_selected_count++;
          }
        })
      })
      allSelected = Boolean(all_selected_count == reqListLength);
      // console.log("reqList:", reqList);
      // console.log("hxList:", hxList);
      // console.log("defaultItem:", defaultItem);

      console.log("onChangeGroup 全选了：", all_selected_count, reqListLength);

      this.setData({
        hxList,
        reqList,
        all_selected_count,
        allSelected,
        defaultItem
      })
    },

    // 打开拒绝核销弹窗
    openRefusePop() {
      this.setData({
        selectPopShow: false,
        refusePopShow: true
      })
    },
    // 打开提交核销弹窗
    openConfirmPop() {
      let {
        reqList
      } = this.data;
      let reqSuccessCount = {};
      reqSuccessCount.order = 0;
      reqSuccessCount.num = 0;
      let good_unit_arr = [];
      reqList.forEach(item => {
        item.count = 0;
        if (!good_unit_arr.includes(item.group_unit)) {
          good_unit_arr.push(item.group_unit)
        }
        item.list.forEach(itm => {
          if (itm.checked) {
            item.count += itm.count_sj;
            reqSuccessCount.order++;
            reqSuccessCount.num += itm.count_sj;
          }
        })
      })
      reqSuccessCount.unit = good_unit_arr.join('/');
      console.log("openConfirmPop reqSuccessCount:", reqSuccessCount);
      // 合并成为一个新的按sku_info.arg 归集的数组，保留原reqList：请求数据还是按照这个显示
      let group_sku_arr = JSON.parse(JSON.stringify(reqList));
      group_sku_arr.forEach(group => {
        const map = new Map();
        group.list.forEach(item => {
          const arg = item.sku_info.arg;
          if(item.checked){
            if (!map.has(arg)) {
              map.set(arg, {
                ...item,
                arg,
                count_sj_all: item.count_sj
              });
            } else {
              const obj = map.get(arg);
              obj.count_sj_all += item.count_sj;
            }
          }
        });

        group.list = [];
        map.forEach(value => {
          group.list.push(value);
        });
      });
      // console.log("openConfirmPop 计算选中的需要确认核销订单：", JSON.stringify(reqList));
      // console.log("openConfirmPop 合并后的新数组：", JSON.stringify(group_sku_arr));

      this.setData({
        selectPopShow: false,
        confirmPopShow: true,
        reqResultCode: -1,
        reqSuccessCount,
        reqList,
        group_sku_arr
      })
    },
    // 取消核销订单，需要传参已选中的订单，关闭弹窗
    cancelHx(event) {
      // 关闭弹窗
      this.onClose(event)
      this.cancelAll();
    },
    // 取消核销
    async cancelAll() {
      wx.showLoading({
        title: '加载中···',
        mask: true,
      })
      try {
        // 取出 reqList 里面的checked:true 请求取消接口
        let {
          reqList,
          reqResultCode
        } = this.data;
        for (var i = 0; i < reqList.length; i++) {
          // 只处理选中的订单
          let item = reqList[i];
          for (var j = 0; j < item.list.length; j++) {
            let itm = item.list[j];

            if (itm.checked && !itm['reqResult']) {
              try {
                let params = {};
                params.check_no = itm.check_no;
                params.state = 2; // 1确认，2取消
                params.longitude = item.locationInfo.longitude;
                params.latitude = item.locationInfo.latitude;
                // 打印取消核销请求日志
                log.setFilterMsg('cancelAll');
                log.info("/api/card/checkpage 取消传参：", JSON.stringify(params));
                const result = await this.hxOrderApi(params);
                log.info("/api/card/checkpage 取消结果：", JSON.stringify(result));
                item.list[j]['reqResult'] = result;
              } catch (error) {
                item.list[j]['reqResult'] = error;
                log.info("/api/card/checkpage catch：", JSON.stringify(error));
              }
            }
          }

        }
        wx.hideLoading();

        console.log("请求结束：", reqList)
        let list_length = 0;
        let reqSuccessCount = {};
        reqSuccessCount.order = 0;
        reqSuccessCount.num = 0;
        reqList.forEach(_item => {
          _item.list.forEach(item => {
            if (item.checked) {
              list_length++;
              let {
                code = 0,
                  msg
              } = item.reqResult;
              if (code == 1) {
                reqSuccessCount.order++;
                reqSuccessCount.num += item.count_sj;
              }
              this.setData({
                cancelHxTipsShow: true,
                cancelHxTips: msg
              })

            }
          })
        })
        // 全部成功
        if (reqSuccessCount.order == list_length) {
          reqResultCode = 2;
        } else {
          // 部分成功,默认-1
          reqResultCode = reqSuccessCount.order == 0 ? 0 : 1;
        }
        this.setData({
          reqList,
          reqResultCode,
          reqSuccessCount
        })
        // 刷新订单列表数据
        this.triggerEvent("refreshAll");
        // 2秒以后关闭弹窗
        setTimeout(() => {
          this.setData({
            cancelHxTipsShow: false,
            cancelHxTips: '',
            reqResultCode: -1
          })
        }, 2000)
      } catch (error) {
        console.log("cancelAll catch:", error)
      }


    },
    // 捕捉catch:start
    nopeTouch() {}
  }
})