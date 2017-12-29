// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function (dm) {
  var $Jtitle = $('#J_title').children()
  var $Jtxt = $('#J_txt').children()
  var News = {
    name: 'Cooperative',
    typed: null,
    _tempData: null,
    init: function () {
      this.myBrowser()
    },
    myBrowser: function () {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Chrome') > -1) {
        $('.clientLogo').css('margin-top', '-20px')
      } else {
        $('.clientLogo').css('margin-top', '0px')
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

