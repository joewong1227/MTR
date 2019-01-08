// discover.js
const debug = getApp().globalData.debug

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    // Init variables
    hasUserLocation: false,
    userLocation: '',
    googleApiKey: 'yourgoogleapikey',
    placesArr: [],
    filteredArr: [],
    filtered: false,
    pickerArr: ["所有", "餐厅", "Cafe", "商场", "酒店"],
    pickerArrEng: ["", "restaurant", "cafe", "shopping", "lodging"],
    pickerIndex: 0,
    hasResult: false,
  },
  onLoad: function() {

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

        that.getPlaces(latlng)
      },
      fail: function() {
        wx.showToast({
          title: '授權不成功，请重新打开小程序再試',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  nearby: function () {
    this.setData({
      loading: true,
    })
    // Get real time location
    this.onGotUserLocation()
  },
  getPlaces: function (latlng) {
    var that = this
    wx.request({
      // config for type: &type=restaurant&keyword=cruise
      url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+latlng+'&radius=1500&opennow&language=zh_CN&key='+that.data.googleApiKey,
      success: function(res) {

        if (debug) {
          console.log('Google Nearby API結果 :')
          console.log(res)
        }

        var highRatingPlaces = []
        var i = 0

        for (i = 0; i < res.data.results.length; i++) {
          if (res.data.results[i].rating >= 3.6){
            highRatingPlaces.push(res.data.results[i])
          }
        }

        console.log(highRatingPlaces)

        that.setData({
          placesArr: highRatingPlaces,
          filtered: false,
          hasResult: true,
        })
      },
      fail: function() {
        wx.showToast({
          title: '卡了或者有墙，请再试一次',
          icon: 'none',
          duration: 3000
        })
      },
      complete: function() {
        that.setData({
          loading: false,
        })
      }
    })
  },
  filter: function(res) {
    if (debug) {
      console.log('選了', res.detail.value)
    }

    if (res.detail.value == 0) {
      this.setData({
        pickerIndex: res.detail.value,
        filtered: false
      })
    } else {
      var filteredArr = []
      var i = 0

      for (i = 0; i < this.data.placesArr.length; i++) {
        if (this.data.placesArr[i].types.includes(this.data.pickerArrEng[res.detail.value])) {
          filteredArr.push(this.data.placesArr[i])
        }
      }

      console.log(filteredArr)

      this.setData({
        pickerIndex: res.detail.value,
        filtered: true,
        filteredArr: filteredArr
      })

      console.log(this.data.filtered)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '香港好去處'
    }
  }

})
