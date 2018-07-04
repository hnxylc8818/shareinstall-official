/* global $ */
/* global layer */
var DfttModule = (function (dm) {

  var Index = {
    name: 'Index',
    typed: null,
    order_id: '',
    init: function () {
      var _this = this
      _this.url = Tool.serverIP()
      _this.getAppInfo()
      // _this.preservationOk()
      _this.cancelFun()
      _this.backFun()
      _this.countPrice()
      _this.submitMent()
      _this.closeApp()
      _this.agreeScroll()
      _this.agreeToPay()
      _this.noPurchase()
      _this.clickToPay()
      _this.verifyStatement()
    },
    /**
     * 计算价格
     */
    countPrice: function () {
      var priceList = [3000, 5000, 7000, 10000]
      $(document).on('click', '.price-list li', function () {
        var price = priceList[$(this).index()]
        $(this).addClass('selected').siblings('li').removeClass('selected')
        $('#appPrice').html(price + '元')
      })
    },
    /***
     * 点击取消
     */
    cancelFun: function () {
      var _this = this
      $("body").on("click", ".cancel", function () {
        window.location.href = './application.html'
      })
    },

    // 获取url中的参数
    getQueryString: function (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); // 匹配目标参数
      var result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
      if (result != null) {
        return decodeURIComponent(result[2]);
      } else {
        return null;
      }
    },
    // 转换时间戳
    timetrans: function (date) {
      date = new Date(date * 1000); // 如果date为10位不需要乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    },

    // 获取应用信息
    getAppInfo: function () {
      var _this = this;
      $.ajax({
        url: _this.url + '/appliance/getone',
        data: {
          app_key: $.cookie('appkey')
        },
        type: 'POST',
        success: function (data) {
          data.code = parseInt(data.code)
          if (data.code === 0) {
            $('#appKey').text(data.data.app_key)
            $('#appTime').text(_this.timetrans(data.data.createTime))
            $('#appName').text(data.data.name)
            $('#xmTanImg').attr('src', data.data.icon)
            $.cookie('appName', data.data.name, {
              expires: 7
            });
            if (data.data.status === 1) {
              $('#appStatus').text('免费体验中')
            } else if (data.data.status === 2) {
              $('#appStatus').text('已支付')
            } else {
              $('#appStatus').text('已过期')
            }
            $('#appOver').text(data.data.app_over_time)
          }
        }
      })
    },
    closeApp: function() {
      $('.close').on('click', function() {
        document.getElementById('agreeContent').scrollTo(0, 0);
        $('#serviceAgreeMent').hide();
        $('.readed').hide();
        $('.reading').show();
      })
    },
    // 支付前阅读协议
    submitMent: function () {
      $('.submitMent').on('click', function () {
        $('#serviceAgreeMent').show()
      })
    },
    agreeScroll: function () {
      document.getElementById('agreeContent').onscroll = function(e) {
        e.stopPropagation();
        var scrollHeig = document.getElementById('agreeContent').scrollTop;
        var agreeHeight = document.getElementById('agreeContent').clientHeight;
        var agreePcc = document.getElementById('agreePcc').clientHeight;

        if (scrollHeig + agreeHeight - 100 >= agreePcc) {
          console.log('bottom');
          $('.readed').show();
          $('.reading').hide();
        }
      }
    },
    agreeToPay: function() {
      $('#readed').on('click', function () {
        document.getElementById('agreeContent').scrollTo(0, 0);
        $('.readed').hide();
        $('.reading').show();
        $('#serviceAgreeMent').hide()
        $('#appList').hide()
        $('#orderList').show()
        $('#appName1').text($('#appName').text());
        $('#appKey1').text($('#appKey').text());

        var priceList = {'1': 3000, '2': 5000, '3': 7000, '5': 10000}
        $('#pay-time').text(parseInt($('.price-list').find('.selected').text()));
        $('#priceTotal').text(priceList[parseInt($('.price-list').find('.selected').text())]);
        $('#priceSum').text(priceList[parseInt($('.price-list').find('.selected').text())]);
      })
    },
    backFun: function () {
      $('.back').on('click', function () {
        $('#appList').show()
        $('#orderList').hide()
      })
    },
    // 点击去支付
    clickToPay: function () {
      var _this = this
      $(document).on('click', '.pay-code', function () {
        var data = {}
        // var priceList = [3000, 5000, 7000, 10000]
        var priceList = {'1': 3000, '2': 5000, '3': 7000, '5': 10000}
        data.username = $.cookie('userName')
        data.token = $.cookie('_token')
        data.app_key = $.cookie('appkey')
        data.count = parseInt($('.price-list').find('.selected').text())
        data.price = priceList[data.count]
        var tempwindow = window.open();
        _this.getOrderId(data, function (res) {
          if (res.code == 0) {
            data.order_id = res.data.order_id
            $.cookie('orderid', res.data.order_id, {
              expires: 7
            });
            _this.purchaseOrder(data, tempwindow)
            $('#verifyInfo').show()
          } else if (res.code == 88) {
            tempwindow.close()
            layer.msg('登录已过期，请重新登录');
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          } else {
            tempwindow.close()
            layer.msg(res.message);
          }
        })
      })
    },

    // 获取订单号
    getOrderId: function (data, cb) {
      return $.ajax({
        type: 'POST',
        url: this.url + '/pay/createorder',
        data: data,
        success: function (res) {
          cb(res)
        }
      })
    },

    // 购买
    purchaseOrder: function (data, tempwindow) {
      tempwindow.location = this.url + '/pay/purchase?username=' + data.username + '&token=' + data.token + '&order_id=' + data.order_id
      // var $dom = '<a href="' + this.url + '/pay/purchase?username=' + data.username + '&token=' + data.token + '&order_id=' + data.order_id + '" target="_blank" ></a>'
      // var a = $($dom).get(0);
      // var e = document.createEvent('MouseEvents');
      // e.initEvent('click', false, true);
      // a.dispatchEvent(e);
    },
    // 尚未支付
    noPurchase: function () {
      $('.noPurchase').on('click', function () {
        $('#verifyInfo').hide()
      })
    },

    // 确认支付完成状态
    verifyStatement: function () {
      var _this = this
      $('.preservation').on('click', function () {
        $.ajax({
          type: 'POST',
          url: _this.url + '/pay/verifyorder',
          data: {
            username: $.cookie('userName'),
            token: $.cookie('_token'),
            app_key: $.cookie('appkey'),
            order_id: $.cookie('orderid')
          },
          success: function (res) {
            if (res.code == 0) {
              layer.msg('支付成功')
              $.cookie('orderid', null)
              window.location.href = './application.html'
            } else {
              layer.msg('未支付,请完成支付')
            }
            $('#verifyInfo').hide()
          }
        })
      })
    }
  }
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line
