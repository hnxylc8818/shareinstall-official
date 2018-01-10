/* global $ */
/* global Typed */
var DfttModule = (function (dm) {


    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.tabIntroduce()
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
                    }else if(dataIndex == 'ios'){
                        $(this).addClass('active activeIos').siblings().removeClass('active activeAn activeWeb')
                        $("#J_app .my-app").eq($(this).index()).show().siblings().hide()
                    }else{
                        $(this).addClass('active activeWeb').siblings().removeClass('active activeAn activeIos')
                        $("#J_app .my-app").eq($(this).index()).show().siblings().hide()
                    }
                }
            )
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
