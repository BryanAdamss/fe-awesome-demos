// pages/search/search.js
const app = getApp();

const DES3 = require('../../utils/des.js');
const Promisify = require('../../utils/promise.js');

Page({
  /**
   * 因无法实现根据站点，查找附近站点的需求，所以sites相关代码全注释掉
   */
  data: {
    focused: false,
    inputValue: '',
    lines: [],// 保存搜索建议中的lines
    // sites: [],// 保存搜索建议中的sites
    histories: {// 保存缓存中的lines、sites相关信息
      lines: [],
      // sites: []
    },
    timer: null,// 节流函数使用
    noSearchResultsShow: false,// 控制是否显示'无搜索结果'
    noHistoryRecordsShow: false,// 控制是否显示'无历史记录'
    suggestShow: false,// 控制显示搜索建议
    historyShow: false// 控制显示搜索历史
  },
  onLoad(options) {
    let self = this;

    // 搜索框聚焦
    setTimeout(() => {
      self.setData({
        focused: true
      });
    }, 0);

  },
  onShow() {
    let self = this;

    // 读取缓存中的历史记录
    self._getHistories().then((res) => {
      // 若有，则赋值并显示
      self.setData({
        histories: res.data,
        suggestShow: false,
        historyShow: true,
        noResultsShow: false,
        noHistoryRecordsShow: false,
      });
    }, (err) => {
      self.setData({
        suggestShow: false,
        historyShow: false,
        noResultsShow: false,
        noHistoryRecordsShow: true,
        histories: {
          lines: [],
          // sites: []
        }
      });
    });

  },
  /**
   * 搜索框输入时触发
   */
  search(event) {
    let self = this;
    let inputValue = event.detail.value;

    self.setData({
      inputValue: inputValue
    });

    // 节流
    if (!self.data.timer) {

      self.data.timer = setTimeout(() => {

        clearTimeout(self.data.timer);
        self.setData({
          timer: null
        });

        // 500ms后inputValue未必有值，所以需要检查，有则根据内容发送请求
        if (self.data.inputValue) {

          self._getResults().then((res) => {

            let data = res.data;

            // 返回的数据不为空
            if (data.status === 'y') {

              let list = data.data.list;
              // 筛选出线路、站点
              let lines = [];
              // let sites = [];
              for (let i = 0, len = list.length; i < len; i++) {
                let item = list[i];
                if (item.FLAG === 1) {
                  // 线路
                  lines.push(item);
                }
                // else {
                //   // 站点
                //   sites.push(item);
                // }
              }

              // 更新到页面上
              self.setData({
                suggestShow: true,
                historyShow: false,
                noResultsShow: false,
                noHistoryRecordsShow: false,
                lines: lines,
                // sites: sites,
              });

            } else {

              // 返回数据的数据为空
              self.setData({
                suggestShow: false,
                historyShow: false,
                noResultsShow: true,
                noHistoryRecordsShow: false,
                lines: [],
                // sites: []
              });

            }
          });

        } else {

          // inputValue为值，则置空
          self.setData({
            suggestShow: false,
            noResultsShow: false,
            lines: [],
            // sites: []
          });

          // 根据历史记录是否存在来展示不同内容
          if (self.data.histories.lines.length || self.data.histories.sites.length) {
            self.setData({
              historyShow: true,
              noHistoryRecordsShow: false,
            });
          } else {
            self.setData({
              historyShow: false,
              noHistoryRecordsShow: true,
            });
          }

        }
      }, 500);
    }
  },
  /**
   * 清除搜索框现有内容
   */
  clearInput() {
    let self = this;

    self.setData({
      inputValue: '',
      suggestShow: false,
      noResultsShow: false,
      lines: [],
      // sites: []
    });

    // 根据历史记录是否存在来展示不同内容
    if (self.data.histories.lines.length || self.data.histories.sites.length) {
      self.setData({
        historyShow: true,
        noHistoryRecordsShow: false,
      });
    } else {
      self.setData({
        historyShow: false,
        noHistoryRecordsShow: true,
      });
    }

  },
  /**
   * 单击搜索建议、搜索历史中的站点或线路
   */
  itemClick(event) {
    let self = this;
    let promisiedSetStorage = Promisify(wx.setStorage);

    // 获取点击元素绑定的信息
    let name = event.currentTarget.dataset.name;
    let flag = event.currentTarget.dataset.flag;

    let history = {
      LINEORSTATIONNAME: name,
      FLAG: flag
    };

    let histories = self.data.histories;

    // 检查点击的站点或线路是否已经保存
    if (flag === 1) {
      let existInLines = histories.lines.findIndex((item) => {
        return item.LINEORSTATIONNAME === name;
      });

      if (existInLines === -1) {
        histories.lines.push(history);
      }
    }
    // else if (flag === 2) {
    //   let existInSites = histories.sites.findIndex((item) => {
    //     return item.LINEORSTATIONNAME === name;
    //   });

    //   if (existInSites === -1) {
    //     histories.sites.push(history);
    //   }
    // }

    // 保存到本地
    self.setData({
      histories: histories
    });

    // 保存到缓存
    promisiedSetStorage({
      key: 'histories',
      data: histories
    });

    // 清除input内容
    self.clearInput();

    // 根据flag跳转不同的页面
    if (flag === 1) {
      wx.navigateTo({
        url: `../detail/detail?linename=${name}`,
      });
    }
    // else if (flag === 2) {
    //   wx.navigateBack({
    //     url: '../index/index',
    //   });
    // }

  },
  /**
   * 清除历史记录
   */
  clearHistoryClick() {
    let self = this;
    self._clearHistories();
  },
  _getHistories() {
    let self = this;
    let promisiedGetStorage = Promisify(wx.getStorage);

    return promisiedGetStorage({
      key: 'histories'
    });
  },
  _getResults() {
    let self = this;
    let promisiedRequest = Promisify(wx.request);

    let key = 'changxinganhui2016*04*25';
    let str = `{"linename" : "${self.data.inputValue.trim()}"}`;
    // 模糊查询接口需要的参数不仅需要des3加密，还需要encodeURIComponent后才能正确请求
    let encryptParams = encodeURIComponent(DES3.encrypt(key, str));
    console.log('加密前关键词', str);
    console.log('转义后的加密关键词', encryptParams);

    return promisiedRequest({
      url: `http://dzgj.hfbus.cn/KlBusWeb_1_0_v//busquery_findBuslinestationListFuzzy.action?params=${encryptParams}`,
      method: 'GET'
    });
  },
  _clearHistories() {
    let self = this;
    // 清除本地
    self.setData({
      suggestShow: false,
      historyShow: false,
      noResultsShow: false,
      noHistoryRecordsShow: true,
      histories: {
        lines: [],
        // sites: []
      }
    });
    // 清除缓存
    wx.clearStorage();
  }
});