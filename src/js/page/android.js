/**
 * Created by admin on 2018/1/5.
 */
/* global $ */
/* global Typed */
var DfttModule = (function (dm) {
    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this;
            _this.tabsFun()

        },
        /**
         * 点击导航切换
         */
        tabsFun: function () {
            var _this = this
            $(".tab-form li").on("click", function () {
                $(this).addClass("active").siblings().removeClass("active")
                var index = $(this).index()
                $("#tab-panel .my-app").eq(index).show().siblings().hide()
            })
        },
        /**
         * 点击上一步
         */
        prevFun: function () {
            var _this = this
            $(".step_prev").on("click", function () {
                var index = parseInt($(this).attr("data-tab-index")) - 1
                $(".tabs-item").eq(index).addClass("active").parent("div").siblings().children("a").removeClass("active")
                $("#steps").children(".step").eq(index).show().siblings().hide()
            })
        },
        /***
         * 点击下一步
         */
        nextFun: function () {
            var _this = this
            $(".step_next").on("click", function () {
                var index = parseInt($(this).attr("data-tab-index")) + 1
                $(".tabs-item").eq(index).addClass("active").parent("div").siblings().children("a").removeClass("active")
                $("#steps").children(".step").eq(index).show().siblings().hide()
            })
        }
    };
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
/**
 * Created by admin on 2018/1/12.
 */
