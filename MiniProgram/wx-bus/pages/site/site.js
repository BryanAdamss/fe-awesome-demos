// pages/site/site.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nearbyStations: [],// 根据GPS返回的附近站点
    nearestSiteName: '',// 最近的站点
  },
  onShow: function () {
    let self = this;

    self.setData({
      nearbyStations: app.globalData.nearbyStations,
      nearestSiteName: app.globalData.nearestSiteName
    });
  },
  itemClick: function (event) {
    let self = this;
    let name = event.currentTarget.dataset.name;
    console.log('siteItemClick名字为:', name);

    self.setData({
      nearestSiteName: name
    });

    app.globalData.nearestSiteName = name;

    wx.navigateBack();
  }
})