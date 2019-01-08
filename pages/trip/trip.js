// pages/trip/trip.js
const stationsData = require('../../utils/stations-data.js')
const debug = getApp().globalData.debug

Page({

  /**
   * Page initial data
   */
  data: {
    locationLoading: false,
    // Get lines and stations data from utils folder
    startArray: [stationsData.lines, stationsData.stations.line1],
    endArray: [stationsData.lines, stationsData.stations.line1],
    // Default stations
    startIndex: [0, 0],
    endIndex: [0, 11],

    // Init variables
    hasUserLocation: false,
    userLocation: '',
  },

  onLoad: function(journey) {
    // Get real time location
    this.onGotUserLocation()

    // 如果是透過轉發頁面進來，直接去結果頁
    if (journey.start) {
      wx.navigateTo({
        url: '../result/result?start=' + journey.start + '&end=' + journey.end
      })
    }
  },

  getTripInfo: function () {

    // Use user location data if exist
    if (this.data.hasUserLocation) {
      var journey = {
        start: this.data.userLocation,
        end: this.data.endArray[1][this.data.endIndex[1]]+'站'
      }
    } else {
      var journey = {
        start: this.data.startArray[1][this.data.startIndex[1]]+'站',
        end: this.data.endArray[1][this.data.endIndex[1]]+'站'
      }
    }

    if (debug) {
      console.log('查詢從' + journey.start + '到' + journey.end)
    }

    wx.navigateTo({
      url: '../result/result?start=' + journey.start + '&end=' + journey.end
    })

  },
  bindStartPickerColumnChange: function (e) {

    if (debug) {
      console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    }

    var data = {
      startArray: this.data.startArray,
      startIndex: this.data.startIndex
    };

    // When user changes the second column
    if (e.detail.column == 1) {
      data.startIndex[1] = e.detail.value
    }

    // When user changes the first column
    if (e.detail.column == 0) {

      // Change the first column value as the user input
      data.startIndex[0] = e.detail.value
      // Reset the second column to the first item to avoid bug
      data.startIndex[1] = 0

      // Change the second column value while the first column being changed
      switch (e.detail.value) {
        case 0:
          data.startArray[1] = stationsData.stations.line1
          break;
        case 1:
          data.startArray[1] = stationsData.stations.line2
          break;
        case 2:
          data.startArray[1] = stationsData.stations.line3
          break;
        case 3:
          data.startArray[1] = stationsData.stations.line4
          break;
        case 4:
          data.startArray[1] = stationsData.stations.line5
          break;
        case 5:
          data.startArray[1] = stationsData.stations.line6
          break;
        case 6:
          data.startArray[1] = stationsData.stations.line7
          break;
        case 7:
          data.startArray[1] = stationsData.stations.line8
          break;
        case 8:
          data.startArray[1] = stationsData.stations.line9
          break;
        case 9:
          data.startArray[1] = stationsData.stations.line10
          break;
        case 10:
          data.startArray[1] = stationsData.stations.line11
          break;
      }
    }
    // Change UI display
    this.setData(data);
  },

  bindEndPickerColumnChange: function (e) {

    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value)

    var data = {
      endArray: this.data.endArray,
      endIndex: this.data.endIndex
    };

    // When user changes the second column
    if (e.detail.column == 1) {
      data.endIndex[1] = e.detail.value
    }

    // When user changes the first column
    if (e.detail.column == 0) {

      // Change the first column value as the user input
      data.endIndex[0] = e.detail.value
      // Reset the second column to the first item to avoid bug
      data.endIndex[1] = 0

      // Change the second column value while the first column being changed
      switch (e.detail.value) {
        case 0:
          data.endArray[1] = stationsData.stations.line1
          break;
        case 1:
          data.endArray[1] = stationsData.stations.line2
          break;
        case 2:
          data.endArray[1] = stationsData.stations.line3
          break;
        case 3:
          data.endArray[1] = stationsData.stations.line4
          break;
        case 4:
          data.endArray[1] = stationsData.stations.line5
          break;
        case 5:
          data.endArray[1] = stationsData.stations.line6
          break;
        case 6:
          data.endArray[1] = stationsData.stations.line7
          break;
        case 7:
          data.endArray[1] = stationsData.stations.line8
          break;
        case 8:
          data.endArray[1] = stationsData.stations.line9
          break;
        case 9:
          data.endArray[1] = stationsData.stations.line10
          break;
        case 10:
          data.endArray[1] = stationsData.stations.line11
          break;
      }
    }
    // Change UI display
    this.setData(data);
  },
  onShareAppMessage: function (res) {
    return {
      title: '香港地铁路线查询小程序'
    }
  },
  onGotUserLocation: function () {
    this.setData({
      locationLoading: true,
    })
    var that = this

    if (debug) {
      console.log('getting location...')
    }

    wx.getLocation({
      success: function(res) {
        var lat = res.latitude
        var lng = res.longitude
        var latlng = lat+','+lng

        if (debug) {
          console.log(latlng)
        }

        that.setData({
          hasUserLocation: true,
          userLocation: latlng,
        })
      },
      fail: function() {
        wx.showToast({
          title: '授權不成功，请重新打开小程序再試',
          icon: 'none',
          duration: 3000
        })
      },
      complete: function() {
        that.setData({
          locationLoading: false,
        })
      }
    })
  },
  backToPicker: function() {
    this.setData({
      hasUserLocation: false
    })
  },
  previewImage: function() {
    wx.previewImage({
      urls: ['http://www.mtr.com.hk/ch/customer/images/services/MTR_routemap_510.jpg']
    })
  }
})
