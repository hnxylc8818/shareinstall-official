// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function (dm) {
  var $Jtitle = $('#J_title .titTab').children()
  var $Jtxt = $('#J_txt').children()
  var $JtimeAxis = $('#J_timeAxis')
  var companyJc = '上海嵩恒网络科技有限公司'
  var dataTime = [
    {
      time: '2017.9',
      text: '上海嵩恒网络科技有限公司在北京成立分公司'
    },
    {
      time: '2016.8',
      text: '上海嵩恒网络科技有限公司规模扩大'
    },
    {
      time: '2015.7',
      text: '上海嵩恒网络科技有限公司搬迁1600平方米办公室'
    },
    {
      time: '2014.11',
      text: '上海嵩恒网络科技有限公司成立'
    },
    {
      time: '2013.3',
      text: '更名为上海高欣计算系统有限公司'
    },
    {
      time: '2012.7',
      text: '上海龙居计算机系统有限公司成立'
    }
  ]

  var News = {
    name: 'News',
    typed: null,
    _tempData: null,
    init: function () {
      this._tableActive()
    },
    _tableActive: function () {
      var scope = this
      $Jtitle.on('click', function () {
        if ($(this).hasClass('active')) {
          return
        }
        if ($(this).hasClass('find')) { //  发展历程,重新加载动画
          scope._timeAxis()
        }
        var index = $(this).index()
        $(this).addClass('active').siblings().removeClass('active')
        $Jtxt.eq(index).addClass('active').siblings().removeClass('active')
      })
    },
    /**
     * 发展历程时间轴
     */
    _timeAxis: function () {  // $JtimeAxis
      var scope = this
      console.log(dataTime)
      var len = dataTime.length
      var end = '<li class="end animated slideInDown"><img src="./img/common/point.png" alt=""></li>'
      var listItem = ''
      for (var i = 0; i < len; i++) {
        var item = dataTime[i]
        if ((i % 2 == 0)) {
          listItem += '<li class="animated slideInLeft">'
            + '<div class="item fl">'
            + '<p class="right fr">'
            + '<img src="./img/common/Left.png" alt="">'
            + '</p>'
            + '<p class="left fr" style="margin-right: 30px;">'
            + '<span class="tit tr">' + item.time + '</span>'
            + '<span class="text">' + item.text + '</span>'
            + '</p>'
            + '</div>'
            + '</li>'
        } else {
          listItem += '<li style="margin-left: -12px;" class="animated slideInRight">'
            + '<div class="item fr">'
            + '<p class="right fl">'
            + '<img src="./img/common/Right.png" alt="">'
            + '</p>'
            + '<p class="left fl" style="margin-left: 30px;">'
            + '<span class="tit">' + item.time + '</span>'
            + '<span class="text">' + item.text + '</span>'
            + '</p>'
            + '</div>'
            + '</li>'
        }
        $JtimeAxis.html(listItem)
        $JtimeAxis.append(end)
      }
    }
  }
  // 给模块单独定义一个命名空间
  dm[News.name] = News
  return dm
})(DfttModule || {}) // eslint-disable-line

$(function () {
  // 调用初始化方法
  $.each(DfttModule, function (i, obj) {
    if ($.isPlainObject(obj)) {
      if ($.isFunction(obj.init)) {
        obj.init()
      } else {
        console.error(obj.init + ' is not a Function!')
      }
    } else {
      console.error(obj + ' is not a PlainObject!')
    }
  })
})
