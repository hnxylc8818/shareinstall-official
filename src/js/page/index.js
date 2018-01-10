/* global $ */
/* global Typed */
var DfttModule = (function (dm) {


    var Index = {
        name: 'Index',
        typed: null,
        init: function () {
            var _this = this
            _this.typedElement()
        },
        /***
         * 首页打字效果
         */
        typedElement: function () {
            $(".typed-element").typed({
                strings: ["安卓iOS安装来源跟踪",],
                typeSpeed: 200,
                loop: false
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
