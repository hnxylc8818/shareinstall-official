/* global $ */
/* global Typed */
var DfttModule = (function(dm) {
  var Index = {
    name: 'Index',
    typed: null,
    init: function() {
      var _this = this
      _this.url = Tool.serverIP()
      _this.goSign()
      _this.goRegister()
      _this.registerFun()
      _this.signFun()
      _this.forgetFun()
      _this.registerVerification()
      _this.forgetPass()
    },
    /**
     * 点击立即注册
     */
    goSign: function() {
      $(".hlogin a").on("click", function(e) {
        e.preventDefault()
        $(".section h2").html("注册账号")
        $(".login").hide()
        $(".nologin").show()
        $(".forgetPassword").hide()
      })
    },
    /**
     * 点击立即登录
     */
    goRegister: function() {
      $(".hregister a").on("click", function(e) {
        e.preventDefault()
        $(".section h2").html("登录账号")
        $(".login").show()
        $(".nologin").hide()
        $(".forgetPassword").hide()
      })
    },

    /***
     * 注册验证
     */
    registerVerification: function() {
      var _this = this
      var Ruser = false
      var Rpassword = false
      var Rpasswordsc = false
      var Rphone = false
      var code = false
      $(".Ruser").on("blur", function() { //邮箱验证
        var value = $(".Ruser").val()
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (value == '' || !myreg.test(value)) {
          // $(".prompt").html('邮箱不能为空！！')
          // $(".prompt").stop(true).fadeIn(1000).fadeOut(1000)
          $(".Ruser").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          $(".Ruser").css("border-color", "rgba(235, 240, 244, 0.3)")
          Ruser = true
        }
      })
      $(".Rpassword").on("blur", function() { //注册密码
        var value = $(".Rpassword").val()
        if (value == '') {
          $(".Rpassword").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          $(".Rpassword").css("border-color", "rgba(235, 240, 244, 0.3)")
          Rpassword = true
        }
      })
      $(".Rpasswordsc").on("blur", function() { //二次密码
        var newValue = $(".Rpasswordsc").val()
        var oldValue = $(".Rpassword").val()
        if (newValue != oldValue) {
          $(".Rpasswordsc").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          $(".Rpasswordsc").css("border-color", "rgba(235, 240, 244, 0.3)")
          Rpasswordsc = true
        }
      })
      $(".Rphone").on("blur", function() { //手机号验证
        var value = $(".Rphone").val()
        var myreg = /^1[34578]\d{9}$/
        if (value == '' || !myreg.test(value)) {
          $(".Rphone").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          $(".Rphone").css("border-color", "rgba(235, 240, 244, 0.3)")
          Rphone = true
        }
      })
      $(".erification").on("click", function() { //点击获取验证码
        var mobile = $(".Rphone").val()
        var myreg = /^1[34578]\d{9}$/
        var disabled = $(".erification").attr("data-click")
        var urlSendmessage = _this.url + 'login/sendmessage'
        if (mobile == '' || !myreg.test(mobile)) {
          $(".my-code").css("border-color", "rgba(231, 94, 94, 0.3)")
          return false
        } else {
          if (disabled != 1) { //点击拦截
            return
          } else {
            $(".erification").attr("data-click", "0");
            $.ajax({
              url: urlSendmessage,
              type: "post",
              data: {
                mobile_num: mobile
              },
              success: function(data) {
                if (typeof data === "string") {
                  data = JSON.parse(data);
                }
                console.log(data)
                if (data.code == 0) { //验证码发送成功
                  $(".prompt").html('验证码发送成功')
                  $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
                  code = true
                  var count = 60;

                  function set() {
                    if (count > 1) {
                      count--;
                      $(".erification").html(count + "s重新发送");
                    } else {
                      count = 60;
                      $(".erification").html("获取验证码");
                      $(".erification").attr("data-click", "1");
                      clearInterval(timer);
                    }
                  };
                  var timer = setInterval(function() {
                    set();
                  }, 1000)
                } else {
                  $(".erification").attr("data-click", "1");
                  $(".prompt").html(data.message)
                  $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
                }
              }
            })
          }
        }
      })
    },
    /***
     * 注册账号逻辑
     */
    registerFun: function() {
      var _this = this
      $(".register").on("click", function() {
        var Ruser = $(".Ruser").val()
        var Rpassword = $(".Rpassword").val()
        var Rpasswordsc = $(".Rpasswordsc").val()
        var Rphone = $(".Rphone").val()
        var Rcode = $(".Rcode").val()
        var regMobile = /^1[0-9]{10}$/
        var regMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        var urlRegister = _this.url + 'login/register'

        if (Ruser == '') {
          $(".prompt").html('邮箱是必填项')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (!regMail.test(Ruser)) {
          $(".prompt").html('邮箱格式错误')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rpassword == '') {
          $(".prompt").html('请输入密码')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rpassword.length < 6 || Rpassword.length > 12) {
          $(".prompt").html('密码为6-12位（数字、英文字母）组合')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (!Rpasswordsc) {
          $(".prompt").html('请再次输入密码')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rpasswordsc !== Rpassword) {
          $(".prompt").html('两次密码输入不一致')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rphone == '') {
          $(".prompt").html('请输入绑定手机号')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (!regMobile.test(Rphone)) {
          $(".prompt").html('手机号格式错误')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rcode == '') {
          $(".prompt").html('手机验证码为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }
        if (Rcode.length !== 6) {
          $(".prompt").html('手机验证码应为6位数字')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }

        $.ajax({
          url: urlRegister,
          type: "post",
          data: {
            mobile: Rphone,
            email: Ruser,
            password: Rpassword,
            sc_pd: Rpasswordsc,
            code: Rcode
          },
          success: function(data) {
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            if (data.code == '0') {
              $(".prompt").html('注册成功')
              $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
              setTimeout(function () {
                $(".section h2").html("登录账号")
                $(".login").show()
                $(".nologin").hide()
              }, 3000)
            } else {
              $(".prompt").html(data.message)
              $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
            }
          }
        })
      })
    },
    /***
     * 点击登录
     */
    signFun: function() {
      var _this = this
      $(".sign").on("click", function() {
        var phone = $(".user").val()
        var password = $(".password").val()
        var login = _this.url + 'login/loginwithpwd'

        if (!phone || !password) {
          $(".prompt").html('用户名或密码为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return
        }

        $.ajax({
          url: login,
          type: "post",
          data: {
            username: phone,
            password: password
          },
          success: function(data) {
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            console.log(data)
            if (data.code == '0') {
              var _token = data.data.login_token;
              var userName = $(".user").val()
              $.cookie('_token', _token, {
                expires: 7
              });
              $.cookie('userName', userName, {
                expires: 7
              });
              // alert('登录成功')
              window.location.href = './application.html'
            } else {
              $(".prompt").html(data.message)
              $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
            }
          }
        })
      })

      $('.login').on('keyup', function (event) {
        if (event.keyCode === 13) {
          $('.sign').click()
        }
      })
    },
    /***
     * 点击忘记密码
     */
    forgetFun: function() {
      var _this = this
      $(".forget a").on("click", function(e) {
        e.preventDefault()
        $(".section h2").html("忘记密码")
        $(".login").hide()
        $(".nologin").hide()
        $(".forgetPassword").show()
      })
    },
    /***
     * 忘记密码逻辑
     */
    forgetPass: function() {
      var _this = this
      var Rpassword = false
      var code = false
      var phone = false
      $(".phone-w").on("blur", function() { //手机号验证
        var value = $(".phone-w").val()
        var myreg = /^1[345678]\d{9}$/
        if (value == '' || !myreg.test(value)) {
          $(".phone-w").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          phone = true
          $(".phone-w").css("border-color", "rgba(235, 240, 244, 0.3)")
        }
      })
      $(".erification-w").on("click", function() { //忘记密码获取验证码
        var mobile = $(".phone-w").val()
        var myreg = /^1[345678]\d{9}$/
        var disabled = $(".erification-w").attr("data-click")
        var urlSendmessage = _this.url + 'changepwd/getsms'
        if (mobile == '') {
          // $(".my-code").css("border-color", "rgba(231, 94, 94, 0.3)")
          $(".prompt").html('手机号为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        } else if (!myreg.test(mobile)) {
          // $(".my-code").css("border-color", "rgba(231, 94, 94, 0.3)")
          $(".prompt").html('手机号格式错误')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
        } else {
          if (disabled != 1) { //点击拦截
            return
          } else {
            $(".erification-w").attr("data-click", "0");
            $.ajax({
              url: urlSendmessage,
              type: "post",
              data: {
                mobile_num: mobile
              },
              success: function(data) {
                if (typeof data === "string") {
                  data = JSON.parse(data);
                }
                console.log(data)
                if (data.code == 0) { //验证码发送成功
                  code = true
                  var count = 60;

                  function set() {
                    if (count > 1) {
                      count--;
                      $(".erification-w").html(count + "s重新发送");
                    } else {
                      count = 60;
                      $(".erification-w").html("获取验证码");
                      $(".erification-w").attr("data-click", "1");
                      clearInterval(timer);
                    }
                  };
                  var timer = setInterval(function() {
                    set();
                  }, 1000)
                } else {
                  $(".prompt").html(data.message)
                  $(".prompt").stop(true).fadeIn(1000).fadeOut(1000)
                }
              }
            })
          }
        }
      })
      $(".password-w").on("blur", function() { //重置密码
        var value = $(".password-w").val()
        if (value == '') {
          $(".password-w").css("border-color", "rgba(231, 94, 94, 0.3)")
        } else {
          $(".password-w").css("border-color", "rgba(235, 240, 244, 0.3)")
          Rpassword = true
        }
      })
      $(".confirm").on("click", function() { //点击确认
        var url = _this.url + 'changepwd/update'
        var mobile = $(".phone-w").val()
        var sms_code = $(".code-w").val()
        var password = $(".password-w").val()
        var myreg = /^1[345678]\d{9}$/

        if (mobile == '') {
          // $(".my-code").css("border-color", "rgba(231, 94, 94, 0.3)")
          $(".prompt").html('手机号为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        } else if (!myreg.test(mobile)) {
          // $(".my-code").css("border-color", "rgba(231, 94, 94, 0.3)")
          $(".prompt").html('手机号格式错误')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        }

        if (sms_code == '') {
          $(".prompt").html('手机验证码为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        } else if (sms_code.length !== 6) {
          $(".prompt").html('手机验证码为6位数字')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        }

        if (password == '') {
          $(".prompt").html('密码为空')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        } else if (password.length < 6 || password.length > 12) {
          $(".prompt").html('密码为6-12位（数字、英文字母）组合')
          $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
          return false
        }

        $.ajax({
          url: url,
          type: "post",
          data: {
            mobile_num: mobile,
            sms_code: sms_code,
            password: password
          },
          success: function(data) {
            if (typeof data === "string") {
              data = JSON.parse(data);
            }
            console.log(data)
            if (data.code == 0) { //修改成功
              $(".prompt").html('密码重置成功，前往登录')
              $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
              
              setTimeout(function () {
                $(".login").show()
                $(".nologin").hide()
                $(".forgetPassword").hide()
              }, 3000)
            } else {
              $(".prompt").html(data.message)
              $(".prompt").stop(true).fadeIn(1000).delay(1000).fadeOut(1000)
            }
          }
        })
      })
    }

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
