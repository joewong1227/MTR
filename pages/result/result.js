// result.js
const debug = getApp().globalData.debug

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    gotResult: false,
    resultArr: [],
    totalTime: 0,
    departureStop: '',
    arrivalStop: '',
    duration: 0,
    numStop: 0,
    lineName: '',
    lineColor: '',
    instruction: '',
    googleApiKey: 'AIzaSyAL1eUZ-uoiEstNr7k1gi5I1tWwZRoT0cA',
    journeyStart: '',
    journeyEnd: '',
  },

  onLoad: function(journey) {
    this.setData({
      journeyStart: journey.start,
      journeyEnd: journey.end,
      // Below 3 lines clear pervious results
      gotResult: false,
      totalTime: 0,
      resultArr: []
    })
    if (debug) {
      console.log(journey)
    }
    // Write this to avoid this.setData error
    var that = this
    // Call Google API to get result to display
    wx.request({
      // https://maps.googleapis.com/maps/api/directions/json?origin=堅尼地城站&destination=旺角站&mode=transit&transit_mode=subway&transit_routing_preference=fewer_transfers&language=zh_CN&key=AIzaSyAL1eUZ-uoiEstNr7k1gi5I1tWwZRoT0cA
      // subway icon: https://maps.gstatic.com/mapfiles/transit/iw2/6/subway2.png
      // mtr icon: https://maps.gstatic.com/mapfiles/transit/iw2/6/cn-hk-metro.png
      // config for less transfers: &transit_routing_preference=fewer_transfers
      url: 'https://maps.googleapis.com/maps/api/directions/json?origin='+journey.start+'&destination='+journey.end+'&mode=transit&transit_mode=subway&language=zh_CN&key='+that.data.googleApiKey,
      success: function(res) {

        // Remind users if it is not in MTR service hours
        var time = new Date().getHours()
        if (time >= 0 && time <= 6) {
          wx.showToast({
            title: '地铁服务时间以外，结果可能包括其他交通工具',
            icon: 'none',
            duration: 3000
          })
        }

        if (debug) {
          console.log('Google Direction API結果 :')
          console.log(res)
        }

        // Use a loop to contain transit mode only in an new array
        const legs = res.data.routes[0].legs[0]
        var stepsLen = legs.steps.length
        var i
        for (i = 0; i < stepsLen; i++) {
          if (legs.steps[i].travel_mode == 'TRANSIT') {

            // Set each steps as a object and push into the result array
            var resultObj = {}

            if (legs.steps[i].transit_details.line.color) {
              var color = legs.steps[i].transit_details.line.color
              var instruction = '往'+legs.steps[i].transit_details.headsign+'方向'
            // If not MTR, set a dark grey line color and use html instruction
            } else {
              var color = '#696969'
              var instruction = legs.steps[i].html_instructions
              console.log(instruction)
            }
            resultObj = {
                          'departureStop': legs.steps[i].transit_details.departure_stop.name,
                          'arrivalStop': legs.steps[i].transit_details.arrival_stop.name,
                          'duration': legs.steps[i].duration.text,
                          'numStop': legs.steps[i].transit_details.num_stops,
                          'lineName': legs.steps[i].transit_details.line.short_name,
                          'lineColor': color,
                          'instruction': instruction,
                        }
            that.data.resultArr.push(resultObj)

            if (debug) {
              console.log('地鐵路線結果 :')
              console.log(that.data.resultArr)
            }
          }
        }
        // Set to display data
        that.setData({
          totalTime: legs.duration.text,
          resultArr: that.data.resultArr,
          // Set journeyStart as chinese for sharing purpose
          journeyStart: that.data.resultArr[0].departureStop,
          gotResult: true,
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
      },
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.journeyStart + '->' + this.data.journeyEnd,
      // 先到首頁才能有返回button
      path: 'pages/trip/trip?start=' + this.data.journeyStart+ '&end=' + this.data.journeyEnd
    }
  }
})
