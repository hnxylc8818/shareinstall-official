// /* global $ */
// /* global Typed */
// var DfttModule = (function(dm) {
//   var Index = {
//     name: 'Index',
//     typed: null,
//     init: function() {
//       var _this = this
//       _this.ModifyPassword()
//       _this.ModifyPhone()
//     },
//     /**
//       点击修改密码
//     */
//     ModifyPassword: function() {
//       var _this = this
//       /**
//       渲染弹窗
//       */
//       $("#person_pass").on("click", function() {
//         layer.open({
//           type: 1,
//           title: !1,
//           closeBtn: !1,
//           skin: "layui-layer-nobg",
//           area: ["680px", "348px"],
//           shadeClose: !1,
//           content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="../img/console/gexx2.jpg"></p>修改密码</div><a class="grxx_title_right" href="javascript:;"><img src="../img/console/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>旧密码</p><input id="old_pwd"  placeholder="请输入旧密码" name="textfield" type="password" value=""></li><li><p>新密码</p><input id="new_pwd"  placeholder="请输入新密码" name="textfield" type="password" value=""></li><li><p>确认新密码</p><input id="new_pwd2" placeholder="请再次输入新密码" name="textfield" type="password" value=""></li><div class="grxx_anniu"><button type="button" class="btn btn-primary" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
//         });
//
//       })
//       /*
//        *关闭弹窗
//        */
//       $("body").on("click", ".grxx_title_right", function() {
//         layer.closeAll()
//       })
//       /*
//        *提交逻辑
//        */
//       $("body").on("click", ".grxx_anniu .btn", function() {
//         var oldPass = $("#old_pwd").val();
//         var newPass = $("#new_pwd").val();
//         var TnewPass = $("#new_pwd2").val();
//         var test = /^[a-zA-Z0-9_.]{6,12}/;
//         if (oldPass && newPass && TnewPass) {
//           if (!test.test(oldPass))
//             return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#old_pwd", {
//               tipsMore: !0,
//               tips: [2, "#ff3333"]
//             }), void $("#old_pwd").focus();
//           if (!test.test(newPass)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#new_pwd", {
//             tipsMore: !0,
//             tips: [2, "#ff3333"]
//           }), void $("#new_pwd").focus();
//           if (!test.test(TnewPass)) return layer.tips("密码为6-12位（英文字母，数字，下划线）的组合", "#new_pwd2", {
//             tipsMore: !0,
//             tips: [2, "#ff3333"]
//           }), void $("#new_pwd2").focus();
//           if (newPass != TnewPass) return void layer.msg("两次密码不一样", {
//             icon: 2,
//             time: 1500
//           });
//           else layer.msg("密码都必须填写", {
//               icon: 2,
//               time: 1500
//             }) = layer.msg("正在提交", {
//               time: 0
//             }),
//             $(".grxx_anniu .btn").addClass("disabled");
//
//         } else {
//           layer.msg("密码都必须填写", {
//             icon: 1,
//             time: 1500
//           })
//         }
//       })
//     },
//     /*
//      *修改手机号
//      */
//     ModifyPhone: function() {
//       var _this = this
//       $("#person_iphone").on("click", function() {
//         layer.open({
//           type: 1,
//           title: !1,
//           closeBtn: !1,
//           skin: "layui-layer-nobg",
//           area: ["680px", "348px"],
//           shadeClose: !1,
//           content: '<div><div class="grxx"><div class="grxx_title"><div class="grxx_title_left"><p><img src="../img/console/gexx3.jpg"></p>修改手机号码</div><a href="javascript:;" class="grxx_title_right"><img src="../img/console/gexx4.jpg"></a></div><div class="grxx_main"><ul><li><p>新手机号</p><label><input id="input_phone"  placeholder="请输入手机号码" name="textfield" type="text" value=""></label></li><li><p>验证码</p><label class="code_phone"><input id="input_code" style="width: 200px"  placeholder="请输入手机验证码" name="textfield" type="text" value=""><a  href="javascript:;" style=" margin-left: 15px;">点击获取验证码</a><span style="margin-left: 15px;display: none;">32秒后可重新获取</span></label></li><div class="grxx_anniu"><button type="button" class="btn btn-primary" style="margin-top: 20px">提  交</button></div></ul></div></div></div>'
//         });
//       })
//       /*
//        *提交逻辑
//        */
//       $("body").on("click", ".grxx_anniu .btn", function() {
//         var text = /^1[3|4|5|7|8]\d{9}$/;
//         var codeText = /^\d{6}$/;
//         if (!$(".grxx_anniu .btn").hasClass("disabled")) {
//           var phone = $("#input_phone").val()
//           var code = $("#input_code").val()
//           if (!text.test(phone)) return layer.tips("请输入正确的手机号码", "#input_phone", {
//             tipsMore: !0,
//             tips: [2, "#ff3333"]
//           }), void $("#input_phone").focus();
//           if (!codeText.test(code)) return layer.tips("请输入6位数字的短信验证码", "#input_code", {
//             tipsMore: !0,
//             tips: [2, "#ff3333"]
//           }), void $("#register_code").focus();
//           a = layer.msg("正在提交", {
//             time: 0
//           }), $(".grxx_anniu .btn").addClass("disabled");
//         }
//       })
//     }
//   }
//   // 给模块单独定义一个命名空间
//   dm[Index.name] = Index
//   return dm
// })(DfttModule || {}) // eslint-disable-line
//
// $(function() {
//   // 调用初始化方法
//   $.each(DfttModule, function(i, obj) {
//     if ($.isPlainObject(obj)) {
//       if ($.isFunction(obj.init)) {
//         obj.init()
//       } else {
//         console.error(obj.init + ' is not a Function!')
//       }
//     } else {
//       console.error(obj + ' is not a PlainObject!')
//     }
//   })
// })
