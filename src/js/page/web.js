/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global layer */
/* global QRCode  */
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
      _this.onlineTest()
    },

    // 渲染页面appkey
    writeAppkey: function () {
      var appKey = $.cookie('appkey')
      if (appKey) {
        $("#app_key").text(appKey)
        $('#configAppKey').text(appKey)
        $('.doc-appkey').text(appKey)
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

    // 在线测试链接
    onlineTest: function () {
      $(document).on('click', '.depoly-line-test', function () {
        var testWrap = $('#_win_web_test')
        testWrap.find('.qr_img').empty()
        testWrap.find('.qr_text').text('')
        layer.open({
          title: '测试',
          type: 1,
          area: '800',
          content: testWrap
        })
      })

      $(document).on('click', '.depoly-button', function () {
        var url = window.location.href.replace('web.html', '') + '/js-test.html?appkey=' + $.cookie('appkey') + '&' + $('input[name="key"]').val() + '=' + $('input[name="value"]').val()
        var curCode = new QRCode($('.qr_img').empty()[0], {
          text: url,
          width: 180,
          height: 180,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
        console.log(url)
      })
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

/**
 * Created by admin on 2018/1/12.
 */