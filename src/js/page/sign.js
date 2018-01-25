// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function(dm) {
  var News = {
    name: 'News',
    typed: null,
    _tempData: null,
    init: function() {
      var _this = this
      _this.url = 'http://test-api.shareinstall.com/'
      _this.login()
      _this.loginOut()
    },
    /*
     *判断用户是否登录
     */
    login: function() {
      var _token = $.cookie("_token")
      if (_token == 'null' || _token == undefined) {
        window.location.href = "./login.html"
      } else {
        $("#username").html($.cookie("userName"))
      }
    },
    /*
     *退出登录
     */
    loginOut: function() {
      var _this = this
      $("#loginOut").on("click", function() {
        $.ajax({
          url: _this.url + 'login/logout',
          type: 'post',
          data: {
            username: $.cookie("userName"),
            token: $.cookie("_token")
          },
          success: function(data) {
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            if (data.code == '0') {
              $.cookie("_token", null)
              $.cookie("userName", null)
              window.location.href = './index.html'
            }
          }
        })
      })
    }
  }
  // 给模块单独定义一个命名空间
  dm[News.name] = News
  return dm
})(DfttModule || {}) // eslint-disable-line

$(function() {
  // 调用初始化方法
  $.each(DfttModule, function(i, obj) {
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
