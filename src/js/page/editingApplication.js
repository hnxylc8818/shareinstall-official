/* global $ */
/* global Typed */
var DfttModule = (function (dm) {

    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.url = 'http://api.shareinstall.com/'
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
                $("#username").val($.cookie("userName"))
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
                var key = window.location.href.split("=")[1]
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
