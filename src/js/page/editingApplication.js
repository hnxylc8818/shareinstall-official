/* global $ */
/* global layer */
var DfttModule = (function (dm) {

  var Index = {
    name: 'Index',
    typed: null,
    init: function () {
      var _this = this
      _this.url = 'http://api.shareinstall.com/'
      _this.getAppInfo()
      _this.previewImg()
      _this.getImg()
      _this.preservationOk()
      _this.cancelFun()
    },
    /**
     * 进入页面读取之前的图片
     */
    getImg: function () {
      var img = $.cookie("oldImg") ? $.cookie("oldImg") : 'http://mini.eastday.com/songheng/sharefolder/dftoutiao/s_window_activity_banner/20180115/5a5c5751b2b6d.png'
      $("#xmTanImg").attr("src", img)
      var name = $.cookie("oldName") ? $.cookie("oldName") : "";
      $("#appName").val(name)
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
        var url = _this.url + 'appliance/upload'
        var file = $("#form1").serialize();
        $("#username2").val($.cookie("userName"))
        $("#token").val($.cookie("_token"))
        //$("#form1").submit()
        var form = $("form[name=form1]");
        var options = {
          url: url,
          type: 'post',
          success: function (data) {
            console.log(data)
            if (data.code == 0) {
              alert("上传成功")
              var data = data.data
              var img = data.img
              $("#xmTanImg").attr("src", img)
            }
          }
        };
        form.ajaxSubmit(options);
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
        if (name == '') {
          alert("APP名称不能为空")
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
            if (data.data.status === 1) {
              $('#appStatus').text('免费体验中')
            } else if (data.data.status === 2) {
              $('#appStatus').text('已支付')
            } else {
              $('#appStatus').text('已过期')
            }
            $('#appOver').text(data.data.app_over_time)
          } else if (data.code === 88) {
            layer.msg('登录已过期，请重新登录')
            setTimeout(function () {
              window.location.href = './login.html'
            }, 3000)
          }
        }
      })
    }
  }
  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
  return dm
})(DfttModule || {}) // eslint-disable-line
