// pages/detail/detail.js
const app = getApp();

const Promisify = require('../../utils/promise.js');

Page({
  data: {
    lineName: '',// 线路名
    lineType: 0,// 上下行
    lineList: [],// 保存上下行线路
    nearestSiteName: '',// 最近站点
  },
  onLoad: function (options) {
    let self = this;

    self.setData({
      // lineName: '20路',
      // nearestSiteName: '桂花园',
      lineName: options.linename,
      nearestSiteName: app.globalData.nearestSiteName,

    });

    wx.showLoading({
      title: '数据加载中',
    });

    self._getSites().then((res) => {
      let data = res.data;
      console.log('siteAndResult返回的数据为:', res)

      if (data.status === 'y') {
        self.setData({
          lineList: data.data.list
        });
      } else {
        wx.showToast({
          title: '数据加载出错',
          icon: 'none'
        });
      }

      wx.hideLoading();
    }, () => {
      wx.hideLoading();
      wx.showToast({
        title: '数据加载出错',
        icon: 'none'
      });
    });
  },
  // 下拉刷新时
  onPullDownRefresh() {
    let self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载

    self._getSites().then((res) => {
      let data = res.data;
      console.log('siteAndResult返回的数据为:', res)

      if (data.status === 'y') {
        self.setData({
          lineList: data.data.list
        });
      } else {
        wx.showToast({
          title: '数据加载出错',
          icon: 'none'
        });
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, () => {
      wx.showToast({
        title: '数据加载出错',
        icon: 'none'
      });
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });
  },
  changeType() {
    let self = this;

    if (self.data.lineType === 0) {
      self.setData({
        lineType: 1
      });
    } else {
      self.setData({
        lineType: 0
      });
    }
  },
  _getSites() {
    let self = this;
    let promisiedRequest = Promisify(wx.request);

    return promisiedRequest({
      url: `http://weixin.hfbus.cn/HFRTB/siteAndResult?linename=${self.data.lineName}&flag=1`,
      method: 'GET'
    });
  }
})