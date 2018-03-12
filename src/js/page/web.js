/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
var DfttModule = (function (dm) {
  var Index = {
    name: 'Index',
    typed: null,
    init: function () {
      var _this = this;
      _this.tabsFun()
      _this.writeAppkey()
      _this.writeAppName()
      _this.drawAppicon()
    },

    // 渲染页面appkey
    writeAppkey: function () {
      var appKey = $.cookie('appkey')
      if (appKey) {
        $("#app_key").text(appKey)
        $('#configAppKey').text(appKey)
      }
    },

    // 渲染应用icon
    drawAppicon: function () {
      var appIcon = $.cookie('img')
      if (appIcon) {
        $('#app_icon').attr('src', appIcon)
      }
    },

    // 渲染应用名称
    writeAppName: function () {
      var appName = $.cookie('appName')
      if (appName) {
        $('#app_name').text(appName)
      }
    },
    /**
     * 点击导航切换
     */
    tabsFun: function () {
      var _this = this
      $(".tab-form li").on("click", function (e) {
        e.preventDefault()
        $(this).addClass("active").siblings().removeClass("active")
        var index = $(this).index()
        $(".my-app").eq(index).show().siblings().hide()
      })
    }
  };
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
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
/**
 * Created by admin on 2018/1/12.
 */