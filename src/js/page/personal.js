/* global $ */
/* global Typed */
var DfttModule = (function(dm) {
  var Index = {
    name: 'Index',
    typed: null,
    init: function() {
      var _this = this
      _this.url = 'http://test-api.shareinstall.com/'
      _this.login()
      _this.loginOut()
      _this.getuser()
      _this.ModifyPassword()
      _this.closeLayer1()
      _this.primaryEmail()
      _this.ModifyPhone()
      _this.grxxCode()
      _this.primaryPhone()
      _this.closeLayer2()
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
    },
    /*
      获取用户信息
    */
    getuser: function() {
      var _this = this
      var url = _this.url + 'account/info'
      $.ajax({
        url: url,
        type: 'post',
        data: {
          username: $.cookie("userName"),
          token: $.cookie("_token")
        },
        success: function(data) {
          console.log(data)
          if (data.code == 0) {
            $("#uesrTime").html(data.data.register_time)
            $("#uesrEmail").html(data.data.email)
            $("#userPhone").html(data.data.mobile)
            $.cookie("_phone", data.data.mobile)
          }
        }
      })
    },
    /**
      点击修改密码
    */
    ModifyPassword: function() {
      var _this = this
      /**
      渲染弹窗
      */
      $("#person_pass").on("click", function() {
        layer.open({
          type: 1,
          title: !1,
          closeBtn: !1,
          skin: "layui-layer-nobg",
          area: ["680px", "348px"],
          shadeClose: !1,
          content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="./img/console/gexx2.jpg"></p>修改密码</div><a class="grxx_title_right" id="grxx_right1" href="javascript:;"><img src="./img/console/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>旧密码</p><input class="old_pwd"  placeholder="请输入旧密码" name="textfield" type="password" value=""></li><li><p>新密码</p><input class="new_pwd"  placeholder="请输入新密码" name="textfield" type="password" value=""></li><li><p>确认新密码</p><input class="new_pwd2" placeholder="请再次输入新密码" name="textfield" type="password" value=""></li><div class="grxx_anniu"><button type="button" class="btn btn-primary"  id="primaryEmail" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
        });
      })
    },
    /*
     *关闭弹窗
     */
    closeLayer1: function() {
      var _this = this
      $("body").on("click", "#grxx_right1", function() {
        layer.closeAll()
      })
    },
    /*
     *关闭弹窗
     */
    closeLayer2: function() {
      var _this = this
      $("body").on("click", "#grxx_right2", function() {
        layer.closeAll()
      })
    },
    /*
     *修改密码提交
     */
    primaryEmail: function() {
      var _this = this
      $("body").on("click", "#primaryEmail", function() {
        var oldPass = $(".old_pwd").val();
        var newPass = $(".new_pwd").val();
        var TnewPass = $(".new_pwd2").val();
        var test = /^[a-zA-Z0-9_.]{6,12}/;
        if (oldPass && newPass && TnewPass) {
          if (!test.test(oldPass))
            return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", ".old_pwd", {
              tipsMore: !0,
              tips: [2, "#ff3333"]
            })
          if (!test.test(newPass)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", ".new_pwd", {
            tipsMore: !0,
            tips: [2, "#ff3333"]
          })
          if (!test.test(TnewPass)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", ".new_pwd2", {
            tipsMore: !0,
            tips: [2, "#ff3333"]
          })
          if (newPass != TnewPass) return void layer.msg("两次密码不一样", {
            icon: 2,
            time: 1500
          });
          $("#primaryEmail").addClass("disabled");
          $.ajax({
            url: _this.url + 'account/changepwd',
            type: 'post',
            data: {
              username: $.cookie("userName"),
              token: $.cookie("_token"),
              old_password: oldPass,
              new_password: newPass
            },
            success: function(data) {
              console.log(data)
              if (data.code == 0) {
                $("#primaryEmail").removeClass("disabled")
                layer.msg("修改成功", {
                  icon: 1,
                  time: 2e3
                }, function() {
                  layer.closeAll()
                })
              }
            }
          })
        } else {
          layer.msg("密码都必须填写", {
            icon: 1,
            time: 1500
          })
        }
      })
    },
    /*
     *修改手机号
     */
    ModifyPhone: function() {
      var _this = this
      $("#person_iphone").on("click", function() {

        layer.open({
          type: 1,
          title: !1,
          closeBtn: !1,
          skin: "layui-layer-nobg",
          area: ["680px", "348px"],
          shadeClose: !1,
          content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="./img/console/gexx3.jpg"></p>修改手机号码</div><a href="javascript:;" class="grxx_title_right" id="grxx_right2"><img src="./img/console/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>新手机号</p><label><input id="input_phone"  placeholder="请输入手机号码" name="textfield" type="text" value=""></label></li><li><p>验证码</p><label class="code_phone"><input id="input_code" style="width: 200px"  placeholder="请输入手机验证码" name="textfield" type="text" value=""><a  href="javascript:;" style=" margin-left: 15px"; id="grxx-code" data-click="1">点击获取验证码</a><span style="margin-left: 15px;display: none;">32秒后可重新获取</span></label></li><div class="grxx_anniu"><button type="button" class="btn btn-primary" id="primaryPhone" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
        });
      })
    },
    /*
      点击获取修改手机号验证码
    */
    grxxCode: function() {
      var _this = this
      $("body").on("click", "#grxx-code", function() {
        if ($("#grxx-code").attr("data-click") != 1) {
          return
        }
        var url = _this.url + 'account/getsms'
        var phone = $("#input_phone").val()
        var text = /^1[3|4|5|7|8]\d{9}$/;
        if (!text.test(phone)) return layer.tips("请输入正确的手机号码", "#input_phone", {
          tipsMore: !0,
          tips: [2, "#ff3333"]
        }), void $("#input_phone").focus();
        $("#grxx-code").attr("data-click", "0")
        $.ajax({
          url: url,
          type: 'post',
          data: {
            username: $.cookie("_phone"),
            token: $.cookie("_token"),
            mobile_num: phone
          },
          success: function(data) {
            if (data.code == 0) {
              layer.msg("发送成功", {
                icon: 1,
                time: 2e3
              })
              $("#grxx-code").html("已发送，请注意查收")
              $("#grxx-code").css("color", "#999")

              function timego() {
                $("#grxx-code").html("点击获取验证码")
                $("#grxx-code").attr("data-click", "1")
                $("#grxx-code").css("color", "#1dd2af")
              }
              window.setTimeout(timego, 60000)
            } else {
              var message = data.message
              $("#grxx-code").html(message)
              $("#grxx-code").css("color", "#999")
              $("#grxx-code").attr("data-click", "1")
            }
          }
        })
      })
    },

    /*
     *修改手机号提交提交逻辑
     */
    primaryPhone: function() {
      var _this = this
      $("body").on("click", "#primaryPhone", function() {
        var text = /^1[3|4|5|7|8]\d{9}$/;
        var codeText = /^\d{6}$/;
        var phone = $("#input_phone").val()
        var code = $("#input_code").val()
        if (phone == "" || code == "") {
          return
        }
        if (!$("#primaryPhone").hasClass("disabled")) {
          if (!text.test(phone)) return layer.tips("请输入正确的手机号码", "#input_phone", {
            tipsMore: !0,
            tips: [2, "#ff3333"]
          }), void $("#input_phone").focus();
          if (!codeText.test(code)) return layer.tips("请输入6位数字的短信验证码", "#input_code", {
            tipsMore: !0,
            tips: [2, "#ff3333"]
          }), void $("#register_code").focus();
          $("#primaryPhone").addClass("disabled");
          $.ajax({
            url: _this.url + 'account/changemobile',
            type: 'post',
            data: {
              username: $.cookie("userName"),
              token: $.cookie("_token"),
              new_mobile: phone,
              sms_code: code
            },
            success: function(data) {
              console.log(data)
              if (data.code == 0) {
                $("#primaryPhone").removeClass("disabled")
                $.cookie("userName", phone)
                _this.getuser()
                layer.msg("修改成功", {
                  icon: 1,
                  time: 2e3
                }, function() {
                  layer.closeAll()
                })
              }
            }
          })
        }
      })
    },

  }

  // 给模块单独定义一个命名空间
  dm[Index.name] = Index
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
