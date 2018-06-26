// http://mini.eastday.com/miniapi/top20keji.json
/* global $ */
var DfttModule = (function(dm) {
  var News = {
    name: 'News',
    typed: null,
    _tempData: null,
    init: function() {
      var _this = this
      _this.url = Tool.serverIP()
      _this.login()
      _this.loginOut()
      _this.commonTip()
      _this.backTop()
      _this.getInfo()
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
            } else if (data.code == '88') {
              $.cookie("_token", null)
              $.cookie("userName", null)
              window.location.href = './login.html'
            }
          }
        })
      })
    },

    // 提示信息
    commonTip: function () {
      $('body').on('click', '.common-tip', function () {
        layer.tips($(this).find('.tip-content').text(), $(this), {
          tips: [3, '#1bd1ab'],
          time: 0,
          area: '300px',
          shade: 0.01,
          shadeClose: !0
        })
      })
    },

    // 应用信息
    getInfo: function () {
      var appStatus = $.cookie('status')
      if (!appStatus) {
        return
      }
      if (parseInt(appStatus) === 1) {
        $('.apppay-state').text('免费体验中')
      } else if (parseInt(appStatus) === 2) {
        $('.apppay-state').text('已付费')
      } else {
        $('.apppay-state').text('已过期')
      }
    },

    /***
     * 返回顶部
     */
    backTop: function() {
      $("#J_barBack").on('click', function() {
        $('body,html').animate({
          scrollTop: 0
        }, 500);
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
