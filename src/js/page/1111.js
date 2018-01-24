function updatePassword() {
  var e = layer.open({
    type: 1,
    title: !1,
    closeBtn: !1,
    skin: "layui-layer-nobg",
    area: ["680px", "348px"],
    shadeClose: !1,
    content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="images/new/gexx2.jpg"></p>修改密码</div><a class="grxx_title_right" href="javascript:;"><img src="images/new/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>旧密码</p><input id="old_pwd"  placeholder="请输入旧密码" name="textfield" type="password" value=""></li><li><p>新密码</p><input id="new_pwd"  placeholder="请输入新密码" name="textfield" type="password" value=""></li><li><p>确认新密码</p><input id="new_pwd2" placeholder="请再次输入新密码" name="textfield" type="password" value=""></li><div class="grxx_anniu"><button type="button" class="btn btn-primary" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
  });
  $(".grxx_title_right").click(function() {
    layer.close(e)
  }), $(".grxx_anniu .btn").click(function() {
    if (!$(".grxx_anniu .btn").hasClass("disabled")) {
      var e = $("#old_pwd").val(),
        t = $("#new_pwd").val(),
        i = $("#new_pwd2").val(),
        n = /^[a-zA-Z0-9_.]{6,12}/;
      if (e && t && i) {
        if (!n.test(e)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#old_pwd", {
          tipsMore: !0,
          tips: [2, "#ff3333"]
        }), void $("#old_pwd").focus();
        if (!n.test(t)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#new_pwd", {
          tipsMore: !0,
          tips: [2, "#ff3333"]
        }), void $("#new_pwd").focus();
        if (!n.test(i)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#new_pwd2", {
          tipsMore: !0,
          tips: [2, "#ff3333"]
        }), void $("#new_pwd2").focus();
        if (t != i) return void layer.msg("两次密码不一样", {
          icon: 2,
          time: 1500
        });
        a = layer.msg("正在提交", {
          time: 0
        }), $(".grxx_anniu .btn").addClass("disabled");
        var a;
        ajaxPost("account/change-password", {
          oldPwd: encrySHA(e),
          newPwd: encrySHA(t)
        }, function(e) {
          layer.close(a), $(".grxx_anniu .btn").removeClass("disabled"), layer.msg("修改成功", {
            icon: 1,
            time: 2e3
          }, function() {
            layer.closeAll()
          }), loadPage()
        }, function(e) {
          layer.close(a), $(".grxx_anniu .btn").removeClass("disabled"), layer.msg(e.msg)
        })
      } else layer.msg("密码都必须填写", {
        icon: 2,
        time: 1500
      })
    }
  })
}

function updatePhone() {
  var e = layer.open({
    type: 1,
    title: !1,
    closeBtn: !1,
    skin: "layui-layer-nobg",
    area: ["680px", "348px"],
    shadeClose: !1,
    content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="images/new/gexx3.jpg"></p>修改手机号码</div><a href="javascript:;" class="grxx_title_right"><img src="images/new/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>新手机号</p><label><input id="input_phone"  placeholder="请输入手机号码" name="textfield" type="text" value=""></label></li><li><p>验证码</p><label class="code_phone"><input id="input_code" style="width: 200px"  placeholder="请输入手机验证码" name="textfield" type="text" value=""><a onclick="getCode()" href="javascript:;" style=" margin-left: 15px;">点击获取验证码</a><span style="margin-left: 15px;display: none;">32秒后可重新获取</span></label></li><div class="grxx_anniu"><button type="button" class="btn btn-primary" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
  });
  $(".grxx_title_right").click(function() {
    layer.close(e)
  });
  var t = /^1[3|4|5|7|8]\d{9}$/,
    i = /^\d{6}$/;
  $(".grxx_anniu .btn").click(function() {
    if (!$(".grxx_anniu .btn").hasClass("disabled")) {
      var e = $("#input_phone").val(),
        n = $("#input_code").val();
      if (!t.test(e)) return layer.tips("请输入正确的手机号码", "#input_phone", {
        tipsMore: !0,
        tips: [2, "#ff3333"]
      }), void $("#input_phone").focus();
      if (!i.test(n)) return layer.tips("请输入6位数字的短信验证码", "#input_code", {
        tipsMore: !0,
        tips: [2, "#ff3333"]
      }), void $("#register_code").focus();
      a = layer.msg("正在提交", {
        time: 0
      }), $(".grxx_anniu .btn").addClass("disabled");
      var a;
      ajaxPost("account/change-phone", {
        phoneNum: e,
        phoneCode: n
      }, function(e) {
        layer.close(a), $(".grxx_anniu .btn").removeClass("disabled"), layer.msg("修改成功", {
          icon: 1,
          time: 2e3
        }, function() {
          layer.closeAll()
        }), loadPage()
      }, function(e) {
        layer.close(a), $(".grxx_anniu .btn").removeClass("disabled"), layer.msg(e.msg)
      })
    }
  })
}

function getCode() {
  var e = /^1[3|4|5|7|8]\d{9}$/,
    t = $("#input_phone").val();
  if (!e.test(t)) return layer.tips("请输入正确的手机号获取验证码", "#input_phone", {
    tipsMore: !0,
    tips: [2, "#ff3333"]
  }), void $("#input_phone").focus();
  ajaxPost("account/send-register-code", {
    phone: t
  }, function(e) {
    startCount()
  })
}

function startCount() {
  if (0 == (count -= 1)) return stopCount(), $(".code_phone a").show(), void $(".code_phone span").hide();
  $(".code_phone a").hide(), $(".code_phone span").show(), $(".code_phone span").html(count + "秒后可重新获取"), t = setTimeout("startCount()", 1e3)
}

function stopCount() {
  count = 60, clearTimeout(t)
}

function logout() {
  ajaxPost("/account/logout", function() {
    location.href = "/login.html"
  })
}
var count = 60,
  t, tmpl = Handlebars.compile($("#tmpl").html());
getUserInfo(function(e) {
  e.expireTime && (e.sExpireTime = formatDate(new Date(e.expireTime), "yyyy-MM-dd HH:mm:ss")), e.payment && e.payment.payTime && (e.sPaymentTime = formatDate(new Date(e.payment.payTime), "yyyy-MM-dd HH:mm:ss")), e.createTime && (e.sCreateTime = formatDate(new Date(e.createTime), "yyyy-MM-dd HH:mm:ss")), $("#user_info").html(tmpl(e))
})
