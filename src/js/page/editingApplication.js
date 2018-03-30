/* global $ */
/* global layer */
var DfttModule = (function (dm) {

  var Index = {
    name: 'Index',
    typed: null,
    init: function () {
      var _this = this
      _this.url = 'http://api.shareinstall.com/'
      _this.getImg()
      _this.getAppInfo()
      _this.previewImg()
      _this.preservationOk()
      _this.cancelFun()
      _this.payLink()
    },
    /**
     * 进入页面读取之前的图片
     */
    getImg: function () {
      var img = $.cookie("oldImg") ? $.cookie("oldImg") : 'http://mini.eastday.com/songheng/sharefolder/dftoutiao/s_window_activity_banner/20180115/5a5c5751b2b6d.png'
      $("#xmTanImg").attr("src", img)
      var name = $.cookie("oldName") ? $.cookie("oldName") : "";
      // $("#appName").val(name)
    },
    /**
     *预览图片
     */
    // previewImg: function () {
    //     var _this = this
    //     $("#fileImg").on("change", function () {
    //         var file = document.getElementById("fileImg").files[0];
    //         var reader = new FileReader();
    //         reader.onload = function (e) {
    //             var mb = (e.total / 1024) / 1024;
    //             if (mb >= 1) {
    //                 alert('文件大小大于1M');
    //                 return;
    //             }
    //             var img = document.getElementById("xmTanImg");
    //             img.src = reader.result;
    //             console.log(img.src)
    //             //或者 img.src = this.result;  //e.target == this
    //         }
    //         reader.readAsDataURL(file)
    //     })
    // },
    /**
     *预览图片
     */
    previewImg: function () {
      var _this = this
      $("#fileImg").on("change", function () {
        var size = $('#fileImg')[0].files[0].size / 1024 / 1024
        var url = _this.url + 'appliance/upload'
        var file = $("#form1").serialize();
        if (size > 1) {
          $("#fileImg").val('')
          layer.msg('图片大于1M，请重新选择')
          return
        }
        $("#username2").val($.cookie("userName"))
        $("#token").val($.cookie("_token"))
        //$("#form1").submit()
        var form = $("form[name=form1]");
        var options = {
          url: url,
          type: 'post',
          success: function (data) {
            // console.log(data)
            if (data.code == 0) {
              layer.msg('上传成功')
              var data = data.data
              var img = data.img
              $("#xmTanImg").attr("src", img)
            }
          }
        };
        form.ajaxSubmit(options);
      })
    },

    getLength: function(str) {
      return str.replace(/[\u0391-\uFFE5]/g, 'aa').length;  //先把中文替换成两个字节的英文，在计算长度
    },

    // 输入长度限制
    inputLimit: function () {
      var _this = this
      var wordsLen = $('#appName').val().length
      $('#appName').on('input propertychange', function () {
        var value = $(this).val()
        if (_this.getLength(value) <= 30) {
          wordsLen = value.length
        }
        if (_this.getLength(value) > 30) {
          $(this).val($(this).val().substr(0, wordsLen))
          return false
        }
      })
    },
    /**
     * 点击保存按钮
     */
    preservationOk: function () {
      var _this = this
      $(".preservation").on("click", function () {
        var url = _this.url + 'appliance/update'
        var key = $.cookie('appkey')
        var img = $("#xmTanImg").attr("src")
        var name = $("#appName").val()
        var regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
          regCn = /[·！#￥（）：；“”‘、，|《。》？、【】[\]]/im;
        if (name == '') {
          layer.tips('应用名不能为空', $('#appName'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          return
        }
        if (regEn.test(name) || regCn.test(name)) {
          layer.tips('应用名不能包含特殊符号', $('#appName'), {
            tipsMore: !0,
            tips: [2, '#ff3333']
          })
          return
        }
        $.ajax({
          url: url,
          type: 'post',
          data: {
            username: $.cookie("userName"),
            token: $.cookie("_token"),
            app_name: name,
            app_icon: img,
            app_key: key
          },
          success: function (data) {
            console.log(data)
            if (data.code == 0) {
              window.location.href = './application.html'
            } else if (parseInt(data.code) == 88) {
              layer.msg('登录失效，请重新登录')
              setTimeout(function () {
                window.location.href = './login.html'
              }, 3000)
            }
          }
        })
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
            $('#appName').val(data.data.name)
            $('#xmTanImg').attr('src', data.data.icon)
            if (data.data.status === 1) {
              $('#appStatus').text('免费体验中')
            } else if (data.data.status === 2) {
              $('#appStatus').text('已付费')
            } else {
              $('#appStatus').text('已过期')
            }
            $('#appOver').text(data.data.app_over_time)
            _this.inputLimit()
          } else if (data.code === 88) {
            layer.msg('登录已过期，请重新登录')
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          }
        }
      })
    },

    // 支付跳转
    payLink: function () {
      var _this = this
      $('.to-pay').click(function () {
        window.location.href = './payment.html?appkey=' + $('#appKey').text()
      })
    }
  }
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line
