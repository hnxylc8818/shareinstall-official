/* global $ */
/* global Typed */
var DfttModule = (function (dm) {
    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.url = 'http://test-api.shareinstall.com/'
            _this.goSign()
            _this.goRegister()
            _this.getErification()
            _this.registerFun()
            _this.signFun()
        },
        /**
         * 点击立即登录
         */
        goSign: function () {
            $(".hlogin a").on("click", function (e) {
                e.preventDefault()
                $(".login").hide()
                $(".nologin").show()
            })
        },
        /**
         * 点击立即注册
         */
        goRegister: function () {
            $(".hregister a").on("click", function (e) {
                e.preventDefault()
                $(".login").show()
                $(".nologin").hide()
            })
        },
        /***
         * 点击获取验证码
         */
        getErification: function () {
            var _this = this
            $(".erification").on("click", function () {
                var mobile = $(".Rphone").val()
                var urlSendmessage = _this.url + 'login/sendmessage'
                $.ajax({
                    url: urlSendmessage,
                    type: "post",
                    data: {
                        mobile_num: mobile
                    },
                    success: function (data) {
                        console.log(data)
                        if(data.code == '0'){  //注册成功
                            alert('注册成功')
                            $(".login").show()
                            $(".nologin").hide()
                        }

                    }
                })
            })
        },
        /***
         * 注册账号逻辑
         */
        registerFun: function () {
            var _this = this
            $(".register").on("click", function () {
                var Ruser = $(".Ruser").val()
                var Rpassword = $(".Rpassword").val()
                var Rpasswordsc = $(".Rpasswordsc").val()
                var Rphone = $(".Rphone").val()
                var Rcode = $(".Rcode").val()
                var urlRegister = _this.url + 'login/register'
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
                    success: function (data) {
                        if(typeof data === "string"){
                            data = JSON.parse(data);
                        }
                       if(data.code == '0'){
                           alert('注册成功')
                           $(".login").show()
                           $(".nologin").hide()
                       }
                    }
                })
            })


        },
        /***
         * 点击登录
         */
        signFun:function () {
            var _this = this
            $(".sign").on("click",function () {
                var phone = $(".user").val()
                var password = $(".password").val()
                var login =  _this.url +'login/loginwithpwd'
                $.ajax({
                    url: login,
                    type: "post",
                    data: {
                        username: phone,
                        password: password
                    },
                    success: function (data) {
                        if(typeof data === "string"){
                            data = JSON.parse(data);
                        }
                        console.log(data)
                        if(data.code == '0'){
                            alert('登陆成功')
                            window.location.href = './index.html'
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
