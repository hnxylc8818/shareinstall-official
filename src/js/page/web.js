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
      _this.getAppInfo()
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

    // 获取字符数
    getLength: function(str) {
      return str.replace(/[\u0391-\uFFE5]/g, 'aa').length; // 先把中文替换成两个字节的英文，在计算长度
    },

    // 输入限制
    inputLimit: function () {
      var _this = this
      var wordsLen = 0
      $('input[name="key"], input[name="value"]').on('input propertychange', function () {
        var value = $(this).val()
        if (_this.getLength(value) <= 20) {
          wordsLen = value.length
        }
        if (_this.getLength(value) > 20) {
          $(this).val($(this).val().substr(0, wordsLen))
          return false
        }
      })
    },

    // 获取应用信息
    getAppInfo: function () {
      var _this = this;
      $.ajax({
        url: 'http://api.shareinstall.com/appliance/getone',
        data: {
          app_key: $.cookie('appkey')
        },
        type: 'POST',
        success: function (data) {
          var overTime = data.data.app_over_time.replace(/-/g, '/');
          var remainTime = parseInt(new Date(overTime) - new Date()) / 1000 / 60 / 60 / 24
          // console.log(remainTime)
          data.code = parseInt(data.code)
          if (data.code === 0) {
            if (data.data.status == 0) {
              _this.pageInit()
            } else if (remainTime <= 10 && data.data.status == 2) {
              _this.pageInit(remainTime)
            }
          }
        }
      })
    },

    pageInit: function (time) {
      var $dom = $('#paymentInfo')
      var hasClose = 0
      if (time) {
        $dom.find('.pop-status').text('还有' + Math.round(time) + '天服务将过期')
        hasClose = 1
      }
      if (hasClose && !$.cookie('warnshow' + $.cookie('appkey'))) {
        $.cookie('warnshow' + $.cookie('appkey'), 1, {
          expires: 1
        })
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      } else if (!hasClose) {
        layer.open({
          title: '到期提醒',
          type: 1,
          area: '800',
          content: $dom,
          closeBtn: hasClose
        })
      }
    },

    // 在线测试链接
    onlineTest: function () {
      this.inputLimit()
      $(document).on('click', '.depoly-line-test', function () {
        var testWrap = $('#_win_web_test')
        testWrap.find('.qr_img').empty()
        testWrap.find('.qr_text').text('')
        layer.open({
          title: '  ',
          type: 1,
          area: '800',
          content: testWrap
        })
      })

      $(document).on('click', '.depoly-button', function () {
        var key = $('input[name="key"]').val()
        var value = $('input[name="value"]').val()
        var url = window.location.href.replace('android.html', '') + 'js-test.html?appkey=' + $.cookie('appkey') + '&' + key + '=' + value
        var tag = true
        if (/[\u4e00-\u9fa5]+/.test(key)) {
          tag = false
          layer.tips('输入不能包含中文', $('input[name="key"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
        }
        if (/[\u4e00-\u9fa5]+/.test(value)) {
          tag = false
          layer.tips('输入不能包含中文', $('input[name="value"]'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
        }
        if (tag) {
          var curCode = new QRCode($('.qr_img').empty()[0], {
            text: url,
            width: 180,
            height: 180,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          })
        }
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