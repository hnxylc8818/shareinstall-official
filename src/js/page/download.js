/* global $ */
/* global Typed */
var DfttModule = (function (dm) {


  var Download = {
    name: 'Download',
    typed: null,
    init: function () {
      var _this = this
      _this.backTop()
      _this.console()
      _this.toggleMenu()
      _this.plateChange()
      _this.toggleLog()
    },
    /***
     * 返回顶部
     */
    backTop: function () {
      $("#J_barBack").on('click', function () {
        $('body,html').animate({
          scrollTop: 0
        }, 500);
      })
    },
    /*
     *点击控制台判断
     */
    console: function () {
      var _this = this
      $("#J_console").on("click", function () {
        var _token = $.cookie("_token")
        if (_token == "null" || _token == undefined) {
          window.location.href = './login.html'
        } else {
          window.location.href = './application.html'
        }
      })
    },
    // 移动端菜单收缩
    toggleMenu: function () {
      $('.btn-mobile-menu').on('click', function () {
        $('.banner-nav').toggle();
      })
    },

    // 下载切换
    plateChange: function () {
      $(document).on('click', '.download-menu', function () {
        var index = $(this).index()
        $('.download-menu').removeClass('active')
        $(this).addClass('active')
        $('.download-con').hide().eq(index).show()
      })
    },

    // 日志更新显示隐藏
    toggleLog: function () {
      $(document).on('click', '.edition a', function () {
        $(this).parents('.top').siblings('.bottom').toggle()
      })
    }
  }
  // 给模块单独定义一个命名空间
  dm[Download.name] = Download
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