/* global $ */
/* global Typed */
var DfttModule = (function (dm) {


    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.tabIntroduce()
            _this.backTop()
            _this.urlTo()
            _this.console()
        },
        /***
         * 通过路径判断显示那个页面
         */
        urlTo: function () {
            var _this = this;
            var url = window.document.location.href;
            var dataIndex = url.split("?")[1]
            if (!dataIndex) {
                dataIndex = 'android'
            } else {
                if (dataIndex == 'android') { //点击安卓
                    $(".copy div").eq(0).addClass('active activeAn').siblings().removeClass('active activeIos activeWeb')
                    $("#J_app .my-app").eq(0).show().siblings().hide()
                } else if (dataIndex == 'ios') {
                    $(".copy div").eq(1).addClass('active activeIos').siblings().removeClass('active activeAn activeWeb')
                    $("#J_app .my-app").eq(1).show().siblings().hide()
                } else if (dataIndex == 'web') {
                    $(".copy div").eq(2).addClass('active activeWeb').siblings().removeClass('active activeAn activeIos')
                    $("#J_app .my-app").eq(2).show().siblings().hide()
                }
            }
        },
        /***
         * 点击tab切换android,ios,web功能介绍
         */
        tabIntroduce: function () {
            var _this = this
            $(".copy div").on("click", function () {
                    if ($(this).hasClass("active")) {
                        return
                    }
                    var dataIndex = $(this).attr("data-index")
                    if (dataIndex == 'android') { //点击安卓
                        $(this).addClass('active activeAn').siblings().removeClass('active activeIos activeWeb')
                        $("#J_app .my-app").eq($(this).index()).show().siblings().hide()
                    } else if (dataIndex == 'ios') {
                        $(this).addClass('active activeIos').siblings().removeClass('active activeAn activeWeb')
                        $("#J_app .my-app").eq($(this).index()).show().siblings().hide()
                    } else {
                        $(this).addClass('active activeWeb').siblings().removeClass('active activeAn activeIos')
                        $("#J_app .my-app").eq($(this).index()).show().siblings().hide()
                    }
                }
            )
        },
        /***
         * 返回顶部
         */
        backTop: function () {
            $("#J_barBack").on('click', function () {
                $('body,html').animate({scrollTop: 0}, 500);
            })
        },
        /*
         *点击控制台判断
         */
        console: function() {
          var _this = this
          $("#J_console").on("click", function() {
            var _token = $.cookie("_token")
            if(_token == "null"){
                window.location.href = './login.html'
            }else{
                window.location.href = './application.html'
            }
          })
        }
    }
// 给模块单独定义一个命名空间
    dm[Index.name] = Index
    return dm
})
(DfttModule || {}) // eslint-disable-line

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
