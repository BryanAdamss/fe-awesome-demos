///index.js
//获取应用实例
const app = getApp();

const DES3 = require('../../utils/des.js');
const Location = require('../../utils/location.js');
const Promisify = require('../../utils/promise.js');

Page({
  data: {
    sameSiteLines: [],// 同站线路
    nearbyStations: [],// 根据GPS返回的附近站点
    nearestSiteName: '',// 最近的站点
  },
  onShow() {
    let self = this;

    // 首次加载
    if (app.globalData.firstLoad) {

      self._getLocation().then((res) => {
        let longitude = res.longitude;
        let latitude = res.latitude;
        self._saveLocation(longitude, latitude);
      })
        .then(() => {
          return self._getNearbySite().then((res) => {

            let data = res.data;
            console.log('busquery_findNearLinebyGpsList返回的数据为', data);

            if (data.status === 'y') {
              let list = data.data.list;
              self._saveNearbySite(list);
            } else {
              wx.showToast({
                title: '数据加载出错',
                icon: 'none'
              });
            }

          });
        })
        .then(() => {
          self._getSameSiteLines().then((res) => {

            let data = res.data;
            console.log('siteList返回的数据为', data);

            if (data.status === 'y') {
              let list = data.data.list;
              self._saveSameSiteLines(list);
            } else {
              wx.showToast({
                title: '数据加载出错',
                icon: 'none'
              })
            }

          })
            .then(() => {
              wx.hideLoading();
            }, () => {
              wx.hideLoading();
            });

        });

      app.globalData.firstLoad = false;
    } else {
      self.setData({
        nearbyStations: app.globalData.nearbyStations,
        nearestSiteName: app.globalData.nearestSiteName
      });

      self._getSameSiteLines().then((res) => {
        let data = res.data;
        console.log('siteList返回的数据为', data);

        if (data.status === 'y') {
          let list = data.data.list;
          self._saveSameSiteLines(list);
        } else {
          wx.showToast({
            title: '数据加载出错',
            icon: 'none'
          })
        }

      })
        .then(() => {
          wx.hideLoading();
        }, () => {
          wx.hideLoading();
        });
    }
  },
  // 下拉刷新时
  onPullDownRefresh() {
    let self = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    self._getSameSiteLines().then((res) => {
      let data = res.data;
      console.log('siteList返回的数据为', data);

      if (data.status === 'y') {
        let list = data.data.list;
        self._saveSameSiteLines(list);
      } else {
        wx.showToast({
          title: '数据加载出错',
          icon: 'none'
        })
      }
    })
      .then(() => {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      });
  },
  goSearch() {
    wx.navigateTo({
      url: '../search/search'
    });
  },
  goSite(event) {
    let self = this;

    wx.navigateTo({
      url: `../site/site`
    });
  },
  itemClick(event) {
    let linename = event.currentTarget.dataset.linename ? event.currentTarget.dataset.linename : '';
    if (linename) {
      wx.navigateTo({
        url: '../detail/detail?linename=' + linename
      });
    }
  },
  _getLocation: function () {
    let self = this;
    let promisiedGetLocation = Promisify(wx.getLocation);

    wx.showLoading({
      title: '定位中...',
    });

    return promisiedGetLocation({
      type: 'gcj02'
    });
  },
  _saveLocation(longitude, latitude) {
    let self = this;

    console.log('gcj02坐标为', longitude, latitude);

    // 将返回的火星坐标gcj02转换成百度坐标bd09
    let pos = Location.gcj02tobd09(longitude, latitude);
    console.log('gcj02转为bd09后坐标为', pos[0], pos[1]);

    app.globalData.location = {
      lont: pos[0],
      lati: pos[1]
    };

    wx.hideLoading();

    console.log('app为:', app);
  },
  _getNearbySite() {
    let self = this;
    let promisiedRequest = Promisify(wx.request);

    // 根据gps查询
    let key = 'changxinganhui2016*04*25';
    if (app.globalData.location) {

      let str = `{'jd':${app.globalData.location.lont},'wd':${app.globalData.location.lati}}`;
      let encryptParams = DES3.encrypt(key, str);

      console.log('加密前参数', str);
      console.log('加密后参数', encryptParams);

      wx.showLoading({
        title: '数据加载中',
      });

      return promisiedRequest({
        url: 'http://dzgj.hfbus.cn/KlBusWeb_1_0_v/busquery_findNearLinebyGpsList.action',
        data: {
          params: encryptParams
        },
      });
    }
  },
  _saveNearbySite(list) {
    let self = this;
    let nearbyStations = [];

    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      if (nearbyStations.indexOf(item.recent_statione_name) === -1) {
        nearbyStations.push(item.recent_statione_name);
      }
    }

    self.setData({
      nearbyStations: nearbyStations,
      nearestSiteName: nearbyStations[0]
    });

    app.globalData.nearbyStations = nearbyStations;
    app.globalData.nearestSiteName = nearbyStations[0];

  },
  _getSameSiteLines() {
    let self = this;
    let promisiedRequest = Promisify(wx.request);

    return promisiedRequest({
      url: 'http://weixin.hfbus.cn/HFRTB/siteList?sitename=' + self.data.nearestSiteName + '&flag=0',
      method: "GET",
    });
  },
  _saveSameSiteLines(list) {
    let self = this;
    self.setData({
      sameSiteLines: list,
    });
  }
});